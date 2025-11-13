import { useRef, useState, useEffect, useCallback } from "react";
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
  onMarkerClick?: (marker: IRegionMapMarker) => void;
  onMapClick?: (x: number, y: number) => void;
  onMarkerDragEnd?: (markerId: string, x: number, y: number) => void;
}

export function MapCanvas({
  imagePath,
  children,
  markers,
  selectedMarkerId,
  selectedChildForPlacement,
  onMarkerClick,
  onMapClick,
  onMarkerDragEnd,
}: MapCanvasProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageUrl, setImageUrl] = useState("");

  // Drag and drop states
  const [draggingMarkerId, setDraggingMarkerId] = useState<string | null>(null);
  const [tempMarkerPositions, setTempMarkerPositions] = useState<Record<string, { x: number; y: number }>>({});
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const [currentScale, setCurrentScale] = useState(1);

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

  // Convert client coordinates to image coordinates considering zoom/pan
  const clientToImageCoords = useCallback((clientX: number, clientY: number) => {
    if (!imageRef.current) {
      console.log('[MapCanvas] clientToImageCoords: missing imageRef');
      return { x: 0, y: 0 };
    }

    const rect = imageRef.current.getBoundingClientRect();

    // Get mouse position relative to the image's bounding box
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    // Convert to image coordinates by dividing by scale
    const x = offsetX / currentScale;
    const y = offsetY / currentScale;

    console.log('[MapCanvas] clientToImageCoords:', {
      clientX,
      clientY,
      rectLeft: rect.left,
      rectTop: rect.top,
      scale: currentScale,
      offsetX,
      offsetY,
      x,
      y
    });

    return { x, y };
  }, [currentScale]);

  // Handle marker drag start
  const handleMarkerMouseDown = (e: React.MouseEvent, markerId: string) => {
    console.log('[MapCanvas] handleMarkerMouseDown called for marker:', markerId);
    if (!imageRef.current) {
      console.log('[MapCanvas] No imageRef, returning');
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const { x, y } = clientToImageCoords(e.clientX, e.clientY);
    console.log('[MapCanvas] Start drag at image coords:', { x, y });

    isDraggingRef.current = true;
    dragStartPosRef.current = { x, y };
    setDraggingMarkerId(markerId);
  };

  // Handle mouse move for dragging markers
  useEffect(() => {
    if (!draggingMarkerId || !imageRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current || !dragStartPosRef.current) return;

      const { x, y } = clientToImageCoords(e.clientX, e.clientY);

      // Check if mouse moved significantly (more than 3px) to differentiate click from drag
      const dx = Math.abs(x - dragStartPosRef.current.x);
      const dy = Math.abs(y - dragStartPosRef.current.y);
      if (dx > 3 || dy > 3) {
        isDraggingRef.current = true;
      }

      // Update temporary position
      setTempMarkerPositions((prev) => ({
        ...prev,
        [draggingMarkerId]: { x, y },
      }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!imageRef.current || !dragStartPosRef.current) return;

      const { x, y } = clientToImageCoords(e.clientX, e.clientY);

      // Check if this was a drag or just a click
      const dx = Math.abs(x - dragStartPosRef.current.x);
      const dy = Math.abs(y - dragStartPosRef.current.y);
      const wasDragged = dx > 3 || dy > 3;

      if (wasDragged && onMarkerDragEnd) {
        // Clamp position to image bounds (in image coordinates)
        const clampedX = Math.max(0, Math.min(x, imageDimensions.width));
        const clampedY = Math.max(0, Math.min(y, imageDimensions.height));
        onMarkerDragEnd(draggingMarkerId, clampedX, clampedY);
      } else {
        // Was a click, trigger marker click
        const marker = markers.find((m) => m.id === draggingMarkerId);
        if (marker) {
          onMarkerClick?.(marker);
        }
      }

      // Reset drag state
      isDraggingRef.current = false;
      dragStartPosRef.current = null;
      setDraggingMarkerId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingMarkerId, markers, onMarkerClick, onMarkerDragEnd, imageDimensions, clientToImageCoords]);

  // Clear temporary positions only when the marker position in props is updated
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


  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    // Don't trigger if clicking on a marker
    const target = e.target as HTMLElement;
    if (target.closest('[data-marker]')) return;

    const { x, y } = clientToImageCoords(e.clientX, e.clientY);

    // Only trigger if within image bounds (in image coordinates)
    if (x >= 0 && y >= 0 && x <= imageDimensions.width && y <= imageDimensions.height) {
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

  const getRegionById = (regionId: string) => {
    return children.find((r) => r.id === regionId);
  };

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
        disablePadding={true}
        panning={{
          disabled: isDraggingRef.current || draggingMarkerId !== null,
          allowLeftClickPan: true,
          allowMiddleClickPan: true,
          allowRightClickPan: false
        }}
        centerOnInit
        wheel={{
          step: 0.05,
          smoothStep: 0.002,
          limitsOnWheel: true,
          disabled: false
        }}
        doubleClick={{ disabled: true }}
        onTransformed={(ref, state) => {
          setCurrentScale(state.scale);
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => {
          return (
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
                !draggingMarkerId && !selectedChildForPlacement && "cursor-grab active:cursor-grabbing",
                selectedChildForPlacement && "cursor-pointer",
                draggingMarkerId && "cursor-grabbing"
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
                        isDraggable={true}
                        onClick={() => !isDragging && onMarkerClick?.(marker)}
                        onMouseDown={(e) => handleMarkerMouseDown(e, marker.id)}
                        style={{
                          cursor: isDragging ? 'grabbing' : 'grab',
                          pointerEvents: isDragging ? 'auto' : 'auto'
                        }}
                      />
                    );
                  })}
              </div>
            </TransformComponent>
          </>
        );
        }}
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
