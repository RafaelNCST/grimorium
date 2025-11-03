import { useState, useRef, useEffect, memo } from "react";

interface PropsDraggableElementWrapper {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isEditMode: boolean;
  isEditing?: boolean;
  children: React.ReactNode;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange?: (width: number, height: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeMove?: (
    width: number,
    height: number,
    mode?: "horizontal" | "vertical" | undefined
  ) => void;
  onResizeEnd?: () => void;
  onClick: () => void;
  onDoubleClick?: () => void;
  className?: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  gridEnabled?: boolean;
  gridSize?: number;
  elementType?: "paragraph-block" | "section-block" | "visual-section" | "text";
  shape?: "circle" | "square" | "rounded-square" | "triangle";
  zoom?: number;
  isBlockElement?: boolean;
  disableVerticalResize?: boolean;
  disableDrag?: boolean;
  disableResize?: boolean;
  hasCreationToolActive?: boolean;
}

export const DraggableElementWrapper = memo(
  ({
    id,
    x,
    y,
    width,
    height,
    isSelected,
    isEditMode,
    isEditing = false,
    children,
    onPositionChange,
    onSizeChange,
    onDragMove,
    onDragEnd,
    onResizeMove,
    onResizeEnd,
    onClick,
    onDoubleClick,
    className = "",
    minWidth = 100,
    maxWidth = 800,
    minHeight = 80,
    maxHeight = 1000,
    gridEnabled = false,
    gridSize = 20,
    elementType,
    shape,
    zoom = 1,
    isBlockElement = false,
    disableVerticalResize = false,
    disableDrag = false,
    disableResize = false,
    hasCreationToolActive = false,
  }: PropsDraggableElementWrapper) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    // Store current position/size during drag/resize for direct DOM manipulation
    const dragStateRef = useRef({
      isDragging: false,
      isResizing: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      currentX: x,
      currentY: y,
      currentWidth: width,
      currentHeight: height,
      resizeDirection: null as string | null,
      resizeMode: null as "horizontal" | "vertical" | null,
      lastUpdatedWidth: width,
      lastUpdatedHeight: height,
    });

    // Store grid props in refs to avoid stale closures
    const gridPropsRef = useRef({
      gridEnabled,
      gridSize,
      width,
      height,
      elementType,
    });

    // Update refs when props change
    useEffect(() => {
      gridPropsRef.current = {
        gridEnabled,
        gridSize,
        width,
        height,
        elementType,
      };
      dragStateRef.current.currentX = x;
      dragStateRef.current.currentY = y;
      dragStateRef.current.currentWidth = width;
      dragStateRef.current.currentHeight = height;
    }, [gridEnabled, gridSize, width, height, elementType, x, y]);

    // Update DOM when width/height props change during resize (from parent via tempSize)
    useEffect(() => {
      if (isResizing && elementRef.current) {
        // Only update if the dimensions actually changed
        if (
          dragStateRef.current.lastUpdatedWidth !== width ||
          dragStateRef.current.lastUpdatedHeight !== height
        ) {
          elementRef.current.style.width = `${width}px`;
          elementRef.current.style.height = `${height}px`;
          dragStateRef.current.lastUpdatedWidth = width;
          dragStateRef.current.lastUpdatedHeight = height;
        }
      }
    }, [isResizing, width, height]);

    // Intelligent snap-to-grid function
    const snapToGrid = (
      posX: number,
      posY: number
    ): { x: number; y: number } => {
      const {
        gridEnabled: enabled,
        gridSize: size,
        width: w,
        height: h,
        elementType: type,
      } = gridPropsRef.current;

      if (!enabled) {
        return { x: posX, y: posY };
      }

      // For visual-section (circles, shapes), snap by center
      if (type === "visual-section") {
        const centerX = posX + w / 2;
        const centerY = posY + h / 2;

        const snappedCenterX = Math.round(centerX / size) * size;
        const snappedCenterY = Math.round(centerY / size) * size;

        return {
          x: snappedCenterX - w / 2,
          y: snappedCenterY - h / 2,
        };
      }

      // For rectangular elements (paragraph-block, section-block, text), snap by top-left corner
      return {
        x: Math.round(posX / size) * size,
        y: Math.round(posY / size) * size,
      };
    };

    // Drag and resize handlers with direct DOM manipulation
    useEffect(() => {
      if (!isDragging && !isResizing) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isEditMode || !elementRef.current) return;

        if (dragStateRef.current.isDragging) {
          // Direct DOM manipulation for dragging - instant response
          // Compensate for zoom: divide mouse movement by zoom level
          const deltaX = (e.clientX - dragStateRef.current.startX) / zoom;
          const deltaY = (e.clientY - dragStateRef.current.startY) / zoom;

          const newX = x + deltaX;
          const newY = y + deltaY;

          dragStateRef.current.currentX = newX;
          dragStateRef.current.currentY = newY;

          // Update DOM directly
          elementRef.current.style.left = `${newX}px`;
          elementRef.current.style.top = `${newY}px`;

          // CRÍTICO: Chamar callback para atualizar wrapper em tempo real
          onDragMove?.(newX, newY);
        } else if (dragStateRef.current.isResizing) {
          // Direct DOM manipulation for resizing - instant response
          // Compensate for zoom: divide mouse movement by zoom level
          const deltaX = (e.clientX - dragStateRef.current.startX) / zoom;
          const deltaY = (e.clientY - dragStateRef.current.startY) / zoom;

          let newWidth = dragStateRef.current.startWidth;
          let newHeight = dragStateRef.current.startHeight;

          const direction = dragStateRef.current.resizeDirection;

          // For visual sections, maintain aspect ratio
          if (elementType === "visual-section") {
            let delta = 0;

            if (direction?.includes("e")) {
              delta = deltaX;
            } else if (direction?.includes("w")) {
              delta = -deltaX;
            } else if (direction?.includes("s")) {
              delta = deltaY;
            } else if (direction?.includes("n")) {
              delta = -deltaY;
            }

            // If diagonal, use average of both deltas
            if (direction?.includes("e") || direction?.includes("w")) {
              if (direction?.includes("n") || direction?.includes("s")) {
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                delta = ((absDeltaX + absDeltaY) / 2) * (delta > 0 ? 1 : -1);
              }
            }

            const newSize = Math.max(
              minWidth,
              Math.min(maxWidth, dragStateRef.current.startWidth + delta)
            );
            newWidth = newSize;
            newHeight = newSize;
          } else {
            // Standard resize for other element types
            if (direction?.includes("e")) {
              newWidth = Math.max(
                minWidth,
                Math.min(maxWidth, dragStateRef.current.startWidth + deltaX)
              );
            }
            if (direction?.includes("w")) {
              newWidth = Math.max(
                minWidth,
                Math.min(maxWidth, dragStateRef.current.startWidth - deltaX)
              );
            }
            // Only allow vertical resize if not disabled
            if (!disableVerticalResize) {
              if (direction?.includes("s")) {
                newHeight = Math.max(
                  minHeight,
                  Math.min(maxHeight, dragStateRef.current.startHeight + deltaY)
                );
              }
              if (direction?.includes("n")) {
                newHeight = Math.max(
                  minHeight,
                  Math.min(maxHeight, dragStateRef.current.startHeight - deltaY)
                );
              }
            }
          }

          // CRÍTICO: Chamar callback para que elementos (como TextElement) recalculem dimensões
          // O callback atualiza tempSize no parent, que então é propagado de volta via props
          // O useEffect acima detecta a mudança nos props e atualiza o DOM
          onResizeMove?.(
            newWidth,
            newHeight,
            dragStateRef.current.resizeMode ?? undefined
          );

          // Armazenar dimensões temporárias (podem ser sobrescritas pelo callback)
          dragStateRef.current.currentWidth = newWidth;
          dragStateRef.current.currentHeight = newHeight;
        }
      };

      const handleMouseUp = () => {
        if (dragStateRef.current.isDragging) {
          // Apply snap-to-grid when releasing the element
          let finalX = dragStateRef.current.currentX;
          let finalY = dragStateRef.current.currentY;

          if (gridEnabled && isEditMode) {
            const snapped = snapToGrid(finalX, finalY);
            finalX = snapped.x;
            finalY = snapped.y;
          }

          // Update React state once at the end
          onPositionChange(finalX, finalY);

          // CRÍTICO: Chamar callback para limpar estado temporário
          onDragEnd?.();

          dragStateRef.current.isDragging = false;
          setIsDragging(false);
        } else if (dragStateRef.current.isResizing) {
          // Update React state once at the end
          if (onSizeChange) {
            onSizeChange(
              dragStateRef.current.currentWidth,
              dragStateRef.current.currentHeight
            );
          }

          // Save resize mode before clearing it
          const { resizeMode } = dragStateRef.current;

          // CRÍTICO: Chamar callback para limpar estado temporário
          // Call both callbacks - onResizeEnd (existing) and our new cleanup callback
          if (onResizeEnd) {
            setTimeout(() => {
              onResizeEnd(resizeMode ?? undefined);
            }, 0);
          }

          dragStateRef.current.isResizing = false;
          dragStateRef.current.resizeDirection = null;
          dragStateRef.current.resizeMode = null;
          setIsResizing(false);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [
      isDragging,
      isResizing,
      isEditMode,
      x,
      y,
      width,
      height,
      gridEnabled,
      onPositionChange,
      onSizeChange,
      onDragMove,
      onDragEnd,
      onResizeMove,
      onResizeEnd,
      elementType,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      snapToGrid,
      zoom,
      disableVerticalResize,
    ]);

    const handleMouseDown = (e: React.MouseEvent) => {
      // If a creation tool is active, don't handle drag - let the canvas create new element
      if (hasCreationToolActive) {
        return;
      }

      if (!isEditMode || disableDrag) return;

      // Ignore middle mouse button (button 1) - let canvas handle pan
      if (e.button === 1) {
        return;
      }

      // Prevent drag if clicking on input elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      e.stopPropagation();

      dragStateRef.current.isDragging = true;
      dragStateRef.current.startX = e.clientX;
      dragStateRef.current.startY = e.clientY;

      setIsDragging(true);
    };

    const handleClick = (e: React.MouseEvent) => {
      // If a creation tool is active, don't intercept the click - let it propagate to canvas
      // This allows creating new elements on top of existing ones
      if (hasCreationToolActive) {
        return;
      }

      // Only stop propagation in edit mode to allow hover cards in view mode
      if (isEditMode) {
        e.stopPropagation();
      }
      onClick();
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
      // Prevent default double-click behavior (text selection)
      e.preventDefault();

      // Only stop propagation in edit mode
      if (isEditMode) {
        e.stopPropagation();
      }

      // Clear any existing text selection to prevent it from persisting after navigation
      window.getSelection()?.removeAllRanges();

      onDoubleClick?.();
    };

    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
      if (!isEditMode || !onSizeChange || disableResize) return;

      // Ignore middle mouse button (button 1) - let canvas handle pan
      if (e.button === 1) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      // Detect resize type based on direction
      // Visual sections support diagonal, other elements only horizontal/vertical
      const isDiagonal = ["nw", "ne", "sw", "se"].includes(direction);
      const isVertical = ["n", "s"].includes(direction);
      const isHorizontal = ["e", "w"].includes(direction);

      let resizeMode: "horizontal" | "vertical";
      // For visual-section, diagonal corners are treated as proportional resize (similar to vertical for aspect ratio)
      // For text elements, no diagonal is available - only horizontal and vertical
      if (isDiagonal && elementType === "visual-section") {
        // Visual sections maintain aspect ratio on diagonal resize (treat as vertical for mode purposes)
        resizeMode = "vertical";
      } else if (isVertical) {
        resizeMode = "vertical";
      } else {
        resizeMode = "horizontal";
      }

      dragStateRef.current.isResizing = true;
      dragStateRef.current.resizeDirection = direction;
      dragStateRef.current.resizeMode = resizeMode;
      dragStateRef.current.startX = e.clientX;
      dragStateRef.current.startY = e.clientY;
      dragStateRef.current.startWidth = width;
      dragStateRef.current.startHeight = height;

      setIsResizing(true);
    };

    return (
      <div
        ref={elementRef}
        data-element-id={id}
        className={`absolute ${
          isDragging
            ? "cursor-grabbing"
            : isEditMode
              ? "cursor-move"
              : "cursor-default"
        } ${className}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          zIndex: 10,
          // Performance optimizations for smooth dragging/resizing at any zoom level
          willChange:
            isDragging || isResizing
              ? "transform, left, top, width, height"
              : "auto",
          // Force GPU layer for better performance
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          // Use outline for block elements to create visual spacing without affecting layout
          ...(isBlockElement && isSelected && isEditMode && !isEditing
            ? {
                outline: "2px solid hsl(var(--primary))",
                outlineOffset: "6px",
              }
            : {}),
        }}
        onMouseDown={isEditMode ? handleMouseDown : undefined}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {children}

        {/* Resize Handles - Invisible hit areas for resizing */}
        {/* Block elements don't have resize handles */}
        {isSelected &&
          isEditMode &&
          onSizeChange &&
          !disableResize &&
          !isBlockElement && (
            <>
              {elementType === "visual-section" ? (
                <>
                  {/* Visual sections: optimized border handles */}
                  {/* Corner handles - positioned at corners */}
                  <div
                    className="absolute cursor-nwse-resize"
                    style={{
                      top: "-5px",
                      left: "-5px",
                      width: "10px",
                      height: "10px",
                      zIndex: 3,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, "nw")}
                  />
                  <div
                    className="absolute cursor-nesw-resize"
                    style={{
                      top: "-5px",
                      right: "-5px",
                      width: "10px",
                      height: "10px",
                      zIndex: 3,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, "ne")}
                  />
                  <div
                    className="absolute cursor-nwse-resize"
                    style={{
                      bottom: "-5px",
                      right: "-5px",
                      width: "10px",
                      height: "10px",
                      zIndex: 3,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, "se")}
                  />
                  <div
                    className="absolute cursor-nesw-resize"
                    style={{
                      bottom: "-5px",
                      left: "-5px",
                      width: "10px",
                      height: "10px",
                      zIndex: 3,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, "sw")}
                  />

                  {/* Edge handles - strips (10px) on the edge */}
                  {/* Top edge */}
                  <div
                    className="absolute cursor-ns-resize"
                    style={{
                      top: "-5px",
                      left: "10px",
                      right: "10px",
                      height: "10px",
                      zIndex: 2,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, "n")}
                  />

                  {/* Right edge */}
                  <div
                    className="absolute cursor-ew-resize"
                    style={{
                      right: "-5px",
                      top: "10px",
                      bottom: "10px",
                      width: "10px",
                      zIndex: 2,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, "e")}
                  />

                  {/* Bottom edge */}
                  <div
                    className="absolute cursor-ns-resize"
                    style={{
                      bottom: "-5px",
                      left: "10px",
                      right: "10px",
                      height: "10px",
                      zIndex: 2,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, "s")}
                  />

                  {/* Left edge */}
                  <div
                    className="absolute cursor-ew-resize"
                    style={{
                      left: "-5px",
                      top: "10px",
                      bottom: "10px",
                      width: "10px",
                      zIndex: 2,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, "w")}
                  />

                  {/* Circle-specific: additional diagonal handles on the circumference */}
                  {shape === "circle" && (
                    <>
                      <div
                        className="absolute cursor-nwse-resize"
                        style={{
                          top: "15%",
                          left: "15%",
                          transform: "translate(-50%, -50%)",
                          width: "12px",
                          height: "12px",
                          zIndex: 2,
                        }}
                        onMouseDown={(e) => handleResizeStart(e, "nw")}
                      />
                      <div
                        className="absolute cursor-nesw-resize"
                        style={{
                          top: "15%",
                          left: "85%",
                          transform: "translate(-50%, -50%)",
                          width: "12px",
                          height: "12px",
                          zIndex: 2,
                        }}
                        onMouseDown={(e) => handleResizeStart(e, "ne")}
                      />
                      <div
                        className="absolute cursor-nwse-resize"
                        style={{
                          top: "85%",
                          left: "85%",
                          transform: "translate(-50%, -50%)",
                          width: "12px",
                          height: "12px",
                          zIndex: 2,
                        }}
                        onMouseDown={(e) => handleResizeStart(e, "se")}
                      />
                      <div
                        className="absolute cursor-nesw-resize"
                        style={{
                          top: "85%",
                          left: "15%",
                          transform: "translate(-50%, -50%)",
                          width: "12px",
                          height: "12px",
                          zIndex: 2,
                        }}
                        onMouseDown={(e) => handleResizeStart(e, "sw")}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Standard handles for other element types (paragraph-block, section-block, text) */}
                  {/* Visual border: for non-block elements only (block elements use outline) */}
                  {/* Hide when editing or when block element (block elements use outline instead) */}
                  {!isEditing && !isBlockElement && (
                    <>
                      {/* Top border */}
                      <div
                        className="absolute"
                        style={{
                          top: "-1px",
                          left: "-1px",
                          right: "-1px",
                          height: "2px",
                          backgroundColor: "hsl(var(--primary))",
                          pointerEvents: "none",
                        }}
                      />
                      {/* Right border */}
                      <div
                        className="absolute"
                        style={{
                          right: "-1px",
                          top: "-1px",
                          bottom: "-1px",
                          width: "2px",
                          backgroundColor: "hsl(var(--primary))",
                          pointerEvents: "none",
                        }}
                      />
                      {/* Bottom border */}
                      <div
                        className="absolute"
                        style={{
                          bottom: "-1px",
                          left: "-1px",
                          right: "-1px",
                          height: "2px",
                          backgroundColor: "hsl(var(--primary))",
                          pointerEvents: "none",
                        }}
                      />
                      {/* Left border */}
                      <div
                        className="absolute"
                        style={{
                          left: "-1px",
                          top: "-1px",
                          bottom: "-1px",
                          width: "2px",
                          backgroundColor: "hsl(var(--primary))",
                          pointerEvents: "none",
                        }}
                      />
                    </>
                  )}

                  {/* Vertical resize handles - only if vertical resize is not disabled and not a text element */}
                  {!disableVerticalResize &&
                    !isEditing &&
                    elementType !== "text" && (
                      <>
                        {/* Top edge handle - invisible hit area */}
                        <div
                          className="absolute left-0 right-0 cursor-ns-resize"
                          style={{ top: "-4px", height: "8px" }}
                          onMouseDown={(e) => handleResizeStart(e, "n")}
                        />
                        {/* Bottom edge handle - invisible hit area */}
                        <div
                          className="absolute left-0 right-0 cursor-ns-resize"
                          style={{ bottom: "-4px", height: "8px" }}
                          onMouseDown={(e) => handleResizeStart(e, "s")}
                        />
                      </>
                    )}

                  {/* Horizontal resize handles - hide when editing */}
                  {!isEditing && (
                    <>
                      {/* Left edge handle - invisible hit area */}
                      <div
                        className="absolute top-0 bottom-0 cursor-ew-resize"
                        style={{ left: "-4px", width: "8px" }}
                        onMouseDown={(e) => handleResizeStart(e, "w")}
                      />
                      {/* Right edge handle - invisible hit area */}
                      <div
                        className="absolute top-0 bottom-0 cursor-ew-resize"
                        style={{ right: "-4px", width: "8px" }}
                        onMouseDown={(e) => handleResizeStart(e, "e")}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
      </div>
    );
  }
);
