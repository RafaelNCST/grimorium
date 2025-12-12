import { useRef, useState, useEffect, useCallback } from "react";

import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import { Button } from "@/components/ui/button";
import { IRegionMapMarker } from "@/lib/db/region-maps.service";
import { cn } from "@/lib/utils";

import { IRegion } from "../../types/region-types";

import { MapMarker } from "./map-marker";

interface MapCanvasProps {
  imagePath: string;
  children: IRegion[];
  markers: IRegionMapMarker[];
  selectedMarkerIds?: string[];
  selectedChildForPlacement?: string | null;
  onMarkerClick?: (marker: IRegionMapMarker, ctrlKey: boolean) => void;
  onMapClick?: (x: number, y: number) => void;
  onMarkerDragEnd?: (markerId: string, x: number, y: number) => void;
  onMarkerScaleChange?: (markerId: string, scale: number) => void;
}

export function MapCanvas({
  imagePath,
  children,
  markers,
  selectedMarkerIds = [],
  selectedChildForPlacement,
  onMarkerClick,
  onMapClick,
  onMarkerDragEnd,
  onMarkerScaleChange,
}: MapCanvasProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFullyReady, setIsFullyReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  const [imageUrl, setImageUrl] = useState("");

  // Drag and drop states
  const [draggingMarkerId, setDraggingMarkerId] = useState<string | null>(null);
  const [tempMarkerPositions, setTempMarkerPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const [currentScale, setCurrentScale] = useState(1);

  // Resize states
  const [resizingMarkerId, setResizingMarkerId] = useState<string | null>(null);
  const [resizeStartScale, setResizeStartScale] = useState<number>(1);
  const [resizeStartDistance, setResizeStartDistance] = useState<number>(0);
  const resizingRef = useRef(false);

  // Pan/zoom states
  const [isPanning, setIsPanning] = useState(false);
  const [savedScale, setSavedScale] = useState<number>(1);

  // Load saved scale state
  useEffect(() => {
    const saved = localStorage.getItem(`map-scale-${imagePath}`);
    if (saved) {
      try {
        setSavedScale(parseFloat(saved));
      } catch (error) {
        console.error("Failed to parse saved scale:", error);
      }
    }
  }, [imagePath]);

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadImage = async () => {
      try {
        // Reset states when loading new image
        setImageLoaded(false);
        setIsFullyReady(false);
        setLoadError(null);

        // Read file as binary using Tauri plugin-fs
        const fileData = await readFile(imagePath, {
          baseDir: BaseDirectory.AppData,
        });

        // Create blob from file data
        const blob = new Blob([fileData]);
        objectUrl = URL.createObjectURL(blob);

        setImageUrl(objectUrl);

        // Load image to get dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
        };
        img.onerror = (e) => {
          console.error("Failed to load image from blob:", e);
          setLoadError("Erro ao carregar imagem do mapa");
        };
        img.src = objectUrl;
      } catch (error) {
        console.error("Failed to read file:", error);
        setLoadError("Arquivo de imagem do mapa não encontrado");
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

  // Center image when loaded with saved scale
  useEffect(() => {
    if (imageLoaded && transformRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Always center, but use saved scale
        transformRef.current?.centerView(savedScale, 0);
        // After positioning, mark as fully ready
        setTimeout(() => {
          setIsFullyReady(true);
        }, 50);
      }, 100);
    }
  }, [imageLoaded, savedScale]);

  // Convert client coordinates to image coordinates considering zoom/pan
  const clientToImageCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!imageRef.current) {
        return { x: 0, y: 0 };
      }

      const rect = imageRef.current.getBoundingClientRect();

      // Get mouse position relative to the image's bounding box
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;

      // Convert to image coordinates by dividing by scale
      const x = offsetX / currentScale;
      const y = offsetY / currentScale;

      return { x, y };
    },
    [currentScale]
  );

  // Handle marker drag start
  const handleMarkerMouseDown = (e: React.MouseEvent, markerId: string) => {
    // Check if clicking on a resize handle
    const target = e.target as HTMLElement;
    if (target.hasAttribute("data-handle")) {
      handleResizeStart(e, markerId);
      return;
    }

    if (!imageRef.current) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Get the marker's current position
    const marker = markers.find((m) => m.id === markerId);
    if (!marker) return;

    const { x: clickX, y: clickY } = clientToImageCoords(e.clientX, e.clientY);

    // Calculate offset between marker position and click position
    const offsetX = marker.positionX - clickX;
    const offsetY = marker.positionY - clickY;

    isDraggingRef.current = true;
    dragStartPosRef.current = { x: clickX, y: clickY };
    dragOffsetRef.current = { x: offsetX, y: offsetY };
    setDraggingMarkerId(markerId);
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, markerId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const marker = markers.find((m) => m.id === markerId);
    if (!marker) return;

    // Store initial scale and mouse position
    resizingRef.current = true;
    setResizingMarkerId(markerId);
    setResizeStartScale(marker.scale || 1.0);

    // Calculate initial distance from marker center
    const markerX = marker.positionX;
    const markerY = marker.positionY;
    const { x: mouseX, y: mouseY } = clientToImageCoords(e.clientX, e.clientY);
    const distance = Math.sqrt(
      Math.pow(mouseX - markerX, 2) + Math.pow(mouseY - markerY, 2)
    );
    setResizeStartDistance(distance);
  };

  // Handle mouse move for dragging markers
  useEffect(() => {
    if (!draggingMarkerId || !imageRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (
        !imageRef.current ||
        !dragStartPosRef.current ||
        !dragOffsetRef.current
      )
        return;

      const { x: cursorX, y: cursorY } = clientToImageCoords(
        e.clientX,
        e.clientY
      );

      // Check if mouse moved significantly (more than 3px) to differentiate click from drag
      const dx = Math.abs(cursorX - dragStartPosRef.current.x);
      const dy = Math.abs(cursorY - dragStartPosRef.current.y);
      if (dx > 3 || dy > 3) {
        isDraggingRef.current = true;
      }

      // Calculate new marker position by adding the offset to cursor position
      const newMarkerX = cursorX + dragOffsetRef.current.x;
      const newMarkerY = cursorY + dragOffsetRef.current.y;

      // Update temporary position
      setTempMarkerPositions((prev) => ({
        ...prev,
        [draggingMarkerId]: { x: newMarkerX, y: newMarkerY },
      }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (
        !imageRef.current ||
        !dragStartPosRef.current ||
        !dragOffsetRef.current
      )
        return;

      const { x: cursorX, y: cursorY } = clientToImageCoords(
        e.clientX,
        e.clientY
      );

      // Check if this was a drag or just a click
      const dx = Math.abs(cursorX - dragStartPosRef.current.x);
      const dy = Math.abs(cursorY - dragStartPosRef.current.y);
      const wasDragged = dx > 3 || dy > 3;

      if (wasDragged && onMarkerDragEnd) {
        // Calculate final marker position using the offset
        const finalMarkerX = cursorX + dragOffsetRef.current.x;
        const finalMarkerY = cursorY + dragOffsetRef.current.y;

        // Clamp position to image bounds (in image coordinates)
        const clampedX = Math.max(
          0,
          Math.min(finalMarkerX, imageDimensions.width)
        );
        const clampedY = Math.max(
          0,
          Math.min(finalMarkerY, imageDimensions.height)
        );
        onMarkerDragEnd(draggingMarkerId, clampedX, clampedY);
      } else {
        // Was a click, trigger marker click
        const marker = markers.find((m) => m.id === draggingMarkerId);
        if (marker) {
          // Pass ctrlKey or metaKey for multi-selection
          onMarkerClick?.(marker, e.ctrlKey || e.metaKey);
        }
      }

      // Reset drag state
      isDraggingRef.current = false;
      dragStartPosRef.current = null;
      dragOffsetRef.current = null;
      setDraggingMarkerId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    draggingMarkerId,
    markers,
    onMarkerClick,
    onMarkerDragEnd,
    imageDimensions,
    clientToImageCoords,
  ]);

  // Handle mouse move for resizing markers
  useEffect(() => {
    if (!resizingMarkerId || !imageRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;

      const marker = markers.find((m) => m.id === resizingMarkerId);
      if (!marker) return;

      // Calculate current distance from marker center
      const markerX = marker.positionX;
      const markerY = marker.positionY;
      const { x: mouseX, y: mouseY } = clientToImageCoords(
        e.clientX,
        e.clientY
      );
      const currentDistance = Math.sqrt(
        Math.pow(mouseX - markerX, 2) + Math.pow(mouseY - markerY, 2)
      );

      // Calculate scale factor based on distance change
      if (resizeStartDistance > 0) {
        const distanceRatio = currentDistance / resizeStartDistance;
        let newScale = resizeStartScale * distanceRatio;

        // Clamp scale between 0.5x and 3x
        newScale = Math.max(0.5, Math.min(3.0, newScale));

        // Update scale temporarily (for visual feedback)
        onMarkerScaleChange?.(resizingMarkerId, newScale);
      }
    };

    const handleMouseUp = () => {
      // Reset resize state
      resizingRef.current = false;
      setResizingMarkerId(null);
      setResizeStartScale(1);
      setResizeStartDistance(0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    resizingMarkerId,
    markers,
    resizeStartScale,
    resizeStartDistance,
    onMarkerScaleChange,
    clientToImageCoords,
  ]);

  // Clear temporary positions only when the marker position in props is updated
  useEffect(() => {
    setTempMarkerPositions((prev) => {
      const newPositions = { ...prev };
      let hasChanges = false;

      // Remove temp positions that match the actual marker positions
      Object.keys(newPositions).forEach((markerId) => {
        const marker = markers.find((m) => m.id === markerId);
        const tempPos = newPositions[markerId];

        if (marker && tempPos) {
          // If the marker position matches temp position (rounded), remove temp
          if (
            Math.round(marker.positionX) === Math.round(tempPos.x) &&
            Math.round(marker.positionY) === Math.round(tempPos.y)
          ) {
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
    if (target.closest("[data-marker]")) return;

    const { x, y } = clientToImageCoords(e.clientX, e.clientY);

    // Only trigger if within image bounds (in image coordinates)
    if (
      x >= 0 &&
      y >= 0 &&
      x <= imageDimensions.width &&
      y <= imageDimensions.height
    ) {
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

  const getRegionById = (regionId: string) =>
    children.find((r) => r.id === regionId);

  return (
    <div
      className="relative w-full h-full bg-background select-none"
      ref={containerRef}
      onSelectStart={handleSelectStart}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.25}
        maxScale={4}
        disabled={false}
        limitToBounds={false}
        centerOnInit={false}
        centerZoomedOut={false}
        alignmentAnimation={{ disabled: true }}
        panning={{
          disabled:
            isDraggingRef.current ||
            draggingMarkerId !== null ||
            resizingRef.current ||
            resizingMarkerId !== null,
          allowLeftClickPan: true,
          allowMiddleClickPan: true,
          allowRightClickPan: false,
        }}
        wheel={{
          step: 0.015,
          smoothStep: 0.001,
          limitsOnWheel: true,
          disabled: false,
        }}
        doubleClick={{ disabled: true }}
        onTransformed={(ref, state) => {
          setCurrentScale(state.scale);
          // Save only scale to localStorage
          localStorage.setItem(
            `map-scale-${imagePath}`,
            state.scale.toString()
          );
        }}
        onPanningStart={() => setIsPanning(true)}
        onPanningStop={() => setIsPanning(false)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls - Fixed */}
            <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => zoomIn()}
                className="shadow-lg"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => zoomOut()}
                className="shadow-lg"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  resetTransform();
                  // Clear saved scale
                  localStorage.removeItem(`map-scale-${imagePath}`);
                  setSavedScale(1);
                  setTimeout(() => {
                    transformRef.current?.centerView(1, 0);
                  }, 50);
                }}
                className="shadow-lg"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            <TransformComponent
              wrapperClass="select-none"
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
              contentClass={cn(
                "select-none",
                selectedChildForPlacement && "cursor-pointer",
                (draggingMarkerId || isPanning) && "cursor-grabbing",
                resizingMarkerId && "cursor-nwse-resize"
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
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                }}
              >
                {/* Map Image - Hidden until fully ready */}
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Region Map"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  draggable={false}
                  onLoad={() => setImageLoaded(true)}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    WebkitUserDrag: "none",
                    userDrag: "none",
                    opacity: isFullyReady ? 1 : 0,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                />

                {/* Markers - Only show when fully ready */}
                {isFullyReady &&
                  markers.map((marker) => {
                    const region = getRegionById(marker.childRegionId);
                    if (!region) return null;

                    const tempPos = tempMarkerPositions[marker.id];
                    const x = tempPos ? tempPos.x : marker.positionX;
                    const y = tempPos ? tempPos.y : marker.positionY;
                    const isDragging = draggingMarkerId === marker.id;
                    const isResizing = resizingMarkerId === marker.id;
                    const isSelected = selectedMarkerIds.includes(marker.id);

                    return (
                      <MapMarker
                        key={marker.id}
                        region={region}
                        x={x}
                        y={y}
                        color={marker.color}
                        showLabel={marker.showLabel}
                        isSelected={isSelected}
                        isDraggable
                        markerScale={marker.scale || 1.0}
                        zoomScale={currentScale}
                        onMouseDown={(e) => handleMarkerMouseDown(e, marker.id)}
                        style={{
                          cursor: isDragging
                            ? "grabbing"
                            : isResizing
                              ? "nwse-resize"
                              : "default",
                          pointerEvents:
                            isDragging || isResizing ? "auto" : "auto",
                        }}
                      />
                    );
                  })}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Loading State or Error */}
      {!isFullyReady && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-40">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-40">
          <div className="text-center space-y-3 max-w-md px-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Erro ao carregar mapa
              </p>
              <p className="text-xs text-muted-foreground">
                {loadError}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
