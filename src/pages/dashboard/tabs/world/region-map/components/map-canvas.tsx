import { useRef, useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapMarker } from "./map-marker";
import { IRegion } from "../../types/region-types";
import { IRegionMapMarker } from "@/lib/db/region-maps.service";
import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { cn } from "@/lib/utils";

interface MapCanvasProps {
  imagePath: string;
  children: IRegion[];
  markers: IRegionMapMarker[];
  selectedMarkerId?: string | null;
  selectedChildForPlacement?: string | null;
  isEditMode: boolean;
  onMarkerClick?: (marker: IRegionMapMarker) => void;
  onMarkerDragEnd?: (markerId: string, x: number, y: number) => void;
  onMapClick?: (x: number, y: number) => void;
}

export function MapCanvas({
  imagePath,
  children,
  markers,
  selectedMarkerId,
  selectedChildForPlacement,
  isEditMode,
  onMarkerClick,
  onMarkerDragEnd,
  onMapClick,
}: MapCanvasProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [draggingMarkerId, setDraggingMarkerId] = useState<string | null>(null);
  const [tempMarkerPositions, setTempMarkerPositions] = useState<Record<string, { x: number; y: number }>>({});
  const isDraggingRef = useRef(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadImage = async () => {
      try {
        console.log('[MapCanvas] Loading image from:', imagePath);

        // Read file as binary using Tauri plugin-fs
        const fileData = await readFile(imagePath, {
          baseDir: BaseDirectory.AppData,
        });

        console.log('[MapCanvas] File read successfully, size:', fileData.length);

        // Create blob from file data
        const blob = new Blob([fileData]);
        objectUrl = URL.createObjectURL(blob);

        console.log('[MapCanvas] Blob URL created:', objectUrl);

        setImageUrl(objectUrl);

        // Load image to get dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setImageLoaded(true);
          console.log('[MapCanvas] Image loaded successfully:', {
            width: img.width,
            height: img.height,
          });
        };
        img.onerror = (e) => {
          console.error('[MapCanvas] Failed to load image from blob:', e);
        };
        img.src = objectUrl;
      } catch (error) {
        console.error('[MapCanvas] Failed to read file:', error);
      }
    };

    loadImage();

    // Cleanup: revoke object URL when component unmounts or imagePath changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imagePath]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !imageRef.current) return;

    // Don't trigger if clicking on a marker
    const target = e.target as HTMLElement;
    if (target.closest('[data-marker]')) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Only trigger if within image bounds
    if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
      onMapClick?.(x, y);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSelectStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent selection on double-click and triple-click
    if (e.detail > 1) {
      e.preventDefault();
    }
  };

  const handleMarkerMouseDown = (e: React.MouseEvent, markerId: string) => {
    if (!isEditMode || !imageRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    isDraggingRef.current = true;
    setDraggingMarkerId(markerId);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !draggingMarkerId || !imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update position in real-time
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        setTempMarkerPositions(prev => ({
          ...prev,
          [draggingMarkerId]: { x, y }
        }));
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current || !draggingMarkerId || !imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Clean up dragging state immediately
      isDraggingRef.current = false;
      setDraggingMarkerId(null);

      // Save final position if within bounds
      // Keep temp position until parent updates (prevents flicker)
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        onMarkerDragEnd?.(draggingMarkerId, x, y);
      } else {
        // If dropped outside bounds, remove temp position
        setTempMarkerPositions(prev => {
          const newPositions = { ...prev };
          delete newPositions[draggingMarkerId];
          return newPositions;
        });
      }
    };

    if (isDraggingRef.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingMarkerId, onMarkerDragEnd]);

  const getRegionById = (regionId: string) => {
    return children.find((r) => r.id === regionId);
  };

  // Clean up temp positions when markers update from parent
  useEffect(() => {
    setTempMarkerPositions(prev => {
      const newPositions = { ...prev };
      let hasChanges = false;

      // Remove temp positions that match the actual marker positions
      Object.keys(newPositions).forEach(markerId => {
        const marker = markers.find(m => m.id === markerId);
        const tempPos = newPositions[markerId];

        if (marker && tempPos) {
          // If the marker position matches temp position (rounded), remove temp
          if (Math.round(marker.positionX) === Math.round(tempPos.x) &&
              Math.round(marker.positionY) === Math.round(tempPos.y)) {
            delete newPositions[markerId];
            hasChanges = true;
          }
        }
      });

      return hasChanges ? newPositions : prev;
    });
  }, [markers]);

  return (
    <div
      className="relative w-full h-full bg-background select-none"
      ref={containerRef}
      onSelectStart={handleSelectStart}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
    >
      <TransformWrapper
        initialScale={1}
        minScale={0.25}
        maxScale={4}
        disabled={false}
        panning={{
          disabled: false,
          allowLeftClickPan: !isEditMode,
          allowMiddleClickPan: true,
          allowRightClickPan: false
        }}
        centerOnInit
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls - Fixed */}
            <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => zoomIn()}
                className="shadow-lg"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => zoomOut()}
                className="shadow-lg"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => resetTransform()}
                className="shadow-lg"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            <TransformComponent
              wrapperClass="w-full h-full select-none"
              contentClass={cn(
                "flex items-center justify-center select-none",
                !isEditMode && "cursor-grab active:cursor-grabbing",
                isEditMode && !selectedChildForPlacement && "cursor-crosshair",
                isEditMode && selectedChildForPlacement && "cursor-pointer"
              )}
            >
              <div
                className="relative select-none"
                onClick={handleImageClick}
                onDoubleClick={handleDoubleClick}
                onSelectStart={handleSelectStart}
                onMouseDown={handleMouseDown}
                style={{
                  width: imageLoaded ? `${imageDimensions.width}px` : "100%",
                  height: imageLoaded ? `${imageDimensions.height}px` : "100%",
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  cursor: draggingMarkerId ? 'grabbing' : undefined,
                }}
              >
                {/* Map Image */}
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Region Map"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  draggable={false}
                  onLoad={() => setImageLoaded(true)}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    WebkitUserDrag: 'none',
                    userDrag: 'none'
                  }}
                />

                {/* Markers */}
                {imageLoaded &&
                  markers.map((marker) => {
                    const region = getRegionById(marker.childRegionId);
                    if (!region) return null;

                    // Use temporary position if available (during drag or right after),
                    // otherwise use the stored position from props
                    const tempPos = tempMarkerPositions[marker.id];
                    const x = tempPos ? tempPos.x : marker.positionX;
                    const y = tempPos ? tempPos.y : marker.positionY;
                    const isDragging = draggingMarkerId === marker.id;

                    return (
                      <MapMarker
                        key={marker.id}
                        region={region}
                        x={x}
                        y={y}
                        color={marker.color}
                        showLabel={marker.showLabel}
                        isSelected={selectedMarkerId === marker.id}
                        isDraggable={isEditMode}
                        onClick={() => isEditMode && !isDragging && onMarkerClick?.(marker)}
                        onMouseDown={(e) => handleMarkerMouseDown(e, marker.id)}
                        style={{
                          cursor: isDragging ? 'grabbing' : (isEditMode ? 'grab' : 'pointer'),
                          pointerEvents: isDragging ? 'none' : 'auto'
                        }}
                      />
                    );
                  })}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Loading State */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}
