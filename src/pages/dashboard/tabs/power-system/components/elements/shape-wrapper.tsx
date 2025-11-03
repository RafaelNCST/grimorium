import { useState, useRef, useEffect, memo } from "react";

interface PropsShapeWrapper {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isEditMode: boolean;
  children: React.ReactNode;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange?: (width: number, height: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeMove?: (
    width: number,
    height: number,
    mode?: "diagonal" | "horizontal" | "vertical"
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
  shape: "circle" | "square" | "diamond";
  zoom?: number;
  disableDrag?: boolean;
  disableResize?: boolean;
  hasCreationToolActive?: boolean;
}

// Helper functions for calculating scaled handle sizes
const getScaledCornerSize = (width: number, height: number): number => {
  const baseDimension = Math.max(width, height);
  const scaled = baseDimension * 0.1; // 10% of the largest dimension
  return Math.max(10, Math.min(scaled, 20)); // Between 10px and 20px
};

const getScaledHandleLength = (dimension: number): number => {
  const scaled = dimension * 0.35; // 35% of the dimension
  return Math.max(24, Math.min(scaled, 60)); // Between 24px and 60px
};

const getScaledHandleThickness = (width: number, height: number): number => {
  const baseDimension = Math.max(width, height);
  const scaled = baseDimension * 0.015; // 1.5% of the largest dimension
  return Math.max(2, Math.min(scaled, 4)); // Between 2px and 4px
};

const getScaledCornerThickness = (width: number, height: number): number => {
  const baseDimension = Math.max(width, height);
  const scaled = baseDimension * 0.012; // 1.2% of the largest dimension
  return Math.max(2, Math.min(scaled, 3)); // Between 2px and 3px
};

export const ShapeWrapper = memo(
  ({
    id,
    x,
    y,
    width,
    height,
    isSelected,
    isEditMode,
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
    minWidth = 30,
    maxWidth = 5000,
    minHeight = 30,
    maxHeight = 5000,
    gridEnabled = false,
    gridSize = 20,
    shape,
    zoom = 1,
    disableDrag = false,
    disableResize = false,
    hasCreationToolActive = false,
  }: PropsShapeWrapper) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    // Constants for wrapper padding
    // Increased padding to accommodate corner L-shapes and resize handles
    // that extend beyond the shape boundaries (max extension is ~5px)
    const WRAPPER_PADDING = 12;

    // Calculate scaled dimensions for handles and corners
    const cornerSize = getScaledCornerSize(width, height);
    const cornerThickness = getScaledCornerThickness(width, height);
    const handleThickness = getScaledHandleThickness(width, height);
    const horizontalHandleLength = getScaledHandleLength(width);
    const verticalHandleLength = getScaledHandleLength(height);

    // Calculate wrapper dimensions (rectangular, not forced to be square)
    const wrapperWidth = width + WRAPPER_PADDING * 2;
    const wrapperHeight = height + WRAPPER_PADDING * 2;

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
      resizeMode: null as "horizontal" | "vertical" | "diagonal" | null,
      lastUpdatedWidth: width,
      lastUpdatedHeight: height,
    });

    // Store grid props in refs to avoid stale closures
    const gridPropsRef = useRef({
      gridEnabled,
      gridSize,
      width,
      height,
    });

    // Store WRAPPER_PADDING in ref for consistent access in event handlers
    const wrapperPaddingRef = useRef(WRAPPER_PADDING);

    // Update refs when props change
    useEffect(() => {
      gridPropsRef.current = {
        gridEnabled,
        gridSize,
        width,
        height,
      };
      wrapperPaddingRef.current = WRAPPER_PADDING;
      dragStateRef.current.currentX = x;
      dragStateRef.current.currentY = y;
      dragStateRef.current.currentWidth = width;
      dragStateRef.current.currentHeight = height;
    }, [gridEnabled, gridSize, width, height, x, y, WRAPPER_PADDING]);

    // Refs for inner container to enable direct DOM manipulation during resize
    const innerContainerRef = useRef<HTMLDivElement>(null);
    const shapeContentRef = useRef<HTMLDivElement>(null);

    // Refs for resize handles - for real-time size updates during resize
    const topHandleRef = useRef<HTMLDivElement>(null);
    const rightHandleRef = useRef<HTMLDivElement>(null);
    const bottomHandleRef = useRef<HTMLDivElement>(null);
    const leftHandleRef = useRef<HTMLDivElement>(null);

    // Refs for corner L-shapes (each corner has 2 divs: horizontal and vertical)
    const topLeftCornerHorizontalRef = useRef<HTMLDivElement>(null);
    const topLeftCornerVerticalRef = useRef<HTMLDivElement>(null);
    const topRightCornerHorizontalRef = useRef<HTMLDivElement>(null);
    const topRightCornerVerticalRef = useRef<HTMLDivElement>(null);
    const bottomRightCornerHorizontalRef = useRef<HTMLDivElement>(null);
    const bottomRightCornerVerticalRef = useRef<HTMLDivElement>(null);
    const bottomLeftCornerHorizontalRef = useRef<HTMLDivElement>(null);
    const bottomLeftCornerVerticalRef = useRef<HTMLDivElement>(null);

    // Update DOM when width/height props change during resize
    useEffect(() => {
      if (isResizing && elementRef.current) {
        if (
          dragStateRef.current.lastUpdatedWidth !== width ||
          dragStateRef.current.lastUpdatedHeight !== height
        ) {
          const newWrapperWidth = width + WRAPPER_PADDING * 2;
          const newWrapperHeight = height + WRAPPER_PADDING * 2;

          // Update wrapper size
          elementRef.current.style.width = `${newWrapperWidth}px`;
          elementRef.current.style.height = `${newWrapperHeight}px`;

          // Update inner container size and position
          if (innerContainerRef.current) {
            innerContainerRef.current.style.width = `${width}px`;
            innerContainerRef.current.style.height = `${height}px`;
            innerContainerRef.current.style.left = `${WRAPPER_PADDING}px`;
            innerContainerRef.current.style.top = `${WRAPPER_PADDING}px`;
          }

          // Update shape content size if it exists
          if (shapeContentRef.current) {
            shapeContentRef.current.style.width = `${width}px`;
            shapeContentRef.current.style.height = `${height}px`;
          }

          dragStateRef.current.lastUpdatedWidth = width;
          dragStateRef.current.lastUpdatedHeight = height;
        }
      }
    }, [isResizing, width, height, WRAPPER_PADDING]);

    // Intelligent snap-to-grid function (snap by center for shapes)
    const snapToGrid = (
      posX: number,
      posY: number
    ): { x: number; y: number } => {
      const {
        gridEnabled: enabled,
        gridSize: size,
        width: w,
        height: h,
      } = gridPropsRef.current;

      if (!enabled) {
        return { x: posX, y: posY };
      }

      // Snap by center for shapes (using actual wrapper dimensions)
      const currentWrapperWidth = w + WRAPPER_PADDING * 2;
      const currentWrapperHeight = h + WRAPPER_PADDING * 2;
      const centerX = posX + currentWrapperWidth / 2;
      const centerY = posY + currentWrapperHeight / 2;

      const snappedCenterX = Math.round(centerX / size) * size;
      const snappedCenterY = Math.round(centerY / size) * size;

      return {
        x: snappedCenterX - currentWrapperWidth / 2,
        y: snappedCenterY - currentWrapperHeight / 2,
      };
    };

    // Drag and resize handlers with direct DOM manipulation
    useEffect(() => {
      if (!isDragging && !isResizing) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isEditMode || !elementRef.current) return;

        if (dragStateRef.current.isDragging) {
          // Direct DOM manipulation for dragging - instant response
          const deltaX = (e.clientX - dragStateRef.current.startX) / zoom;
          const deltaY = (e.clientY - dragStateRef.current.startY) / zoom;

          const newX = x + deltaX;
          const newY = y + deltaY;

          dragStateRef.current.currentX = newX;
          dragStateRef.current.currentY = newY;

          // Update DOM directly
          elementRef.current.style.left = `${newX}px`;
          elementRef.current.style.top = `${newY}px`;

          // Callback to update wrapper in real time
          onDragMove?.(newX, newY);
        } else if (dragStateRef.current.isResizing) {
          // Direct DOM manipulation for resizing - instant response
          const deltaX = (e.clientX - dragStateRef.current.startX) / zoom;
          const deltaY = (e.clientY - dragStateRef.current.startY) / zoom;

          let newWidth = dragStateRef.current.startWidth;
          let newHeight = dragStateRef.current.startHeight;

          const direction = dragStateRef.current.resizeDirection;
          const mode = dragStateRef.current.resizeMode;

          // Resize logic based on mode
          if (mode === "diagonal") {
            // Diagonal: maintain aspect ratio (proportional resize)
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

            // For diagonal corners, use average of both deltas
            if (
              (direction?.includes("e") || direction?.includes("w")) &&
              (direction?.includes("n") || direction?.includes("s"))
            ) {
              const absDeltaX = Math.abs(deltaX);
              const absDeltaY = Math.abs(deltaY);
              delta = ((absDeltaX + absDeltaY) / 2) * (delta > 0 ? 1 : -1);
            }

            // Calculate new size maintaining aspect ratio
            const aspectRatio =
              dragStateRef.current.startWidth /
              dragStateRef.current.startHeight;
            const newSize = Math.max(
              minWidth,
              Math.min(maxWidth, dragStateRef.current.startWidth + delta)
            );

            newWidth = newSize;
            newHeight = newSize / aspectRatio;
          } else if (mode === "horizontal") {
            // Horizontal: only change width
            if (direction?.includes("e")) {
              newWidth = Math.max(
                minWidth,
                Math.min(maxWidth, dragStateRef.current.startWidth + deltaX)
              );
            } else if (direction?.includes("w")) {
              newWidth = Math.max(
                minWidth,
                Math.min(maxWidth, dragStateRef.current.startWidth - deltaX)
              );
            }
            newHeight = dragStateRef.current.startHeight;
          } else if (mode === "vertical") {
            // Vertical: only change height
            if (direction?.includes("s")) {
              newHeight = Math.max(
                minHeight,
                Math.min(maxHeight, dragStateRef.current.startHeight + deltaY)
              );
            } else if (direction?.includes("n")) {
              newHeight = Math.max(
                minHeight,
                Math.min(maxHeight, dragStateRef.current.startHeight - deltaY)
              );
            }
            newWidth = dragStateRef.current.startWidth;
          }

          // Store temporary dimensions
          dragStateRef.current.currentWidth = newWidth;
          dragStateRef.current.currentHeight = newHeight;

          // Direct DOM manipulation for instant visual feedback
          const padding = wrapperPaddingRef.current;
          const newWrapperWidth = newWidth + padding * 2;
          const newWrapperHeight = newHeight + padding * 2;

          // Update wrapper size
          if (elementRef.current) {
            elementRef.current.style.width = `${newWrapperWidth}px`;
            elementRef.current.style.height = `${newWrapperHeight}px`;
          }

          // Update inner container size and position to maintain centering
          if (innerContainerRef.current) {
            innerContainerRef.current.style.width = `${newWidth}px`;
            innerContainerRef.current.style.height = `${newHeight}px`;
            innerContainerRef.current.style.left = `${padding}px`;
            innerContainerRef.current.style.top = `${padding}px`;
          }

          // Update shape content size
          if (shapeContentRef.current) {
            shapeContentRef.current.style.width = `${newWidth}px`;
            shapeContentRef.current.style.height = `${newHeight}px`;
          }

          // Recalculate handle sizes based on new dimensions for real-time scaling
          const newCornerSize = getScaledCornerSize(newWidth, newHeight);
          const newCornerThickness = getScaledCornerThickness(newWidth, newHeight);
          const newHandleThickness = getScaledHandleThickness(newWidth, newHeight);
          const newHorizontalHandleLength = getScaledHandleLength(newWidth);
          const newVerticalHandleLength = getScaledHandleLength(newHeight);

          // Update edge handles directly in DOM
          if (topHandleRef.current) {
            topHandleRef.current.style.width = `${newHorizontalHandleLength}px`;
            topHandleRef.current.style.height = `${newHandleThickness}px`;
          }
          if (rightHandleRef.current) {
            rightHandleRef.current.style.width = `${newHandleThickness}px`;
            rightHandleRef.current.style.height = `${newVerticalHandleLength}px`;
          }
          if (bottomHandleRef.current) {
            bottomHandleRef.current.style.width = `${newHorizontalHandleLength}px`;
            bottomHandleRef.current.style.height = `${newHandleThickness}px`;
          }
          if (leftHandleRef.current) {
            leftHandleRef.current.style.width = `${newHandleThickness}px`;
            leftHandleRef.current.style.height = `${newVerticalHandleLength}px`;
          }

          // Update corner L-shapes directly in DOM
          // Top Left Corner
          if (topLeftCornerHorizontalRef.current) {
            topLeftCornerHorizontalRef.current.style.width = `${newCornerSize}px`;
            topLeftCornerHorizontalRef.current.style.height = `${newCornerThickness}px`;
          }
          if (topLeftCornerVerticalRef.current) {
            topLeftCornerVerticalRef.current.style.width = `${newCornerThickness}px`;
            topLeftCornerVerticalRef.current.style.height = `${newCornerSize}px`;
          }

          // Top Right Corner
          if (topRightCornerHorizontalRef.current) {
            topRightCornerHorizontalRef.current.style.width = `${newCornerSize}px`;
            topRightCornerHorizontalRef.current.style.height = `${newCornerThickness}px`;
          }
          if (topRightCornerVerticalRef.current) {
            topRightCornerVerticalRef.current.style.width = `${newCornerThickness}px`;
            topRightCornerVerticalRef.current.style.height = `${newCornerSize}px`;
          }

          // Bottom Right Corner
          if (bottomRightCornerHorizontalRef.current) {
            bottomRightCornerHorizontalRef.current.style.width = `${newCornerSize}px`;
            bottomRightCornerHorizontalRef.current.style.height = `${newCornerThickness}px`;
          }
          if (bottomRightCornerVerticalRef.current) {
            bottomRightCornerVerticalRef.current.style.width = `${newCornerThickness}px`;
            bottomRightCornerVerticalRef.current.style.height = `${newCornerSize}px`;
          }

          // Bottom Left Corner
          if (bottomLeftCornerHorizontalRef.current) {
            bottomLeftCornerHorizontalRef.current.style.width = `${newCornerSize}px`;
            bottomLeftCornerHorizontalRef.current.style.height = `${newCornerThickness}px`;
          }
          if (bottomLeftCornerVerticalRef.current) {
            bottomLeftCornerVerticalRef.current.style.width = `${newCornerThickness}px`;
            bottomLeftCornerVerticalRef.current.style.height = `${newCornerSize}px`;
          }

          // Callback to update element dimensions in React state
          onResizeMove?.(newWidth, newHeight, mode ?? undefined);
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

          // Callback to clean up temporary state
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

          // Callback to clean up temporary state
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
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      snapToGrid,
      zoom,
    ]);

    const handleMouseDown = (e: React.MouseEvent) => {
      // Don't allow dragging when a creation tool is active
      if (hasCreationToolActive) {
        return;
      }

      if (!isEditMode || disableDrag) return;

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
      // Don't intercept clicks when a creation tool is active
      if (hasCreationToolActive) {
        return;
      }

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

    const handleResizeStart = (
      e: React.MouseEvent,
      direction: string,
      mode: "horizontal" | "vertical" | "diagonal"
    ) => {
      if (!isEditMode || !onSizeChange || disableResize) return;

      e.stopPropagation();
      e.preventDefault();

      dragStateRef.current.isResizing = true;
      dragStateRef.current.resizeDirection = direction;
      dragStateRef.current.resizeMode = mode;
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
          width: `${wrapperWidth}px`,
          height: `${wrapperHeight}px`,
          zIndex: 10,
          willChange:
            isDragging || isResizing
              ? "transform, left, top, width, height"
              : "auto",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        onMouseDown={isEditMode ? handleMouseDown : undefined}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* Inner container to center the shape */}
        <div
          ref={innerContainerRef}
          className="absolute flex items-center justify-center"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            left: `${WRAPPER_PADDING}px`,
            top: `${WRAPPER_PADDING}px`,
          }}
        >
          <div
            ref={shapeContentRef}
            style={{
              width: `${width}px`,
              height: `${height}px`,
            }}
          >
            {children}
          </div>
        </div>

        {/* Resize Handles - Special for shapes */}
        {isSelected && isEditMode && onSizeChange && !disableResize && (
          <>
            {/* Corner L-shaped decorative borders - Top Left */}
            <div
              className="absolute cursor-nwse-resize pointer-events-auto"
              style={{
                top: "2px",
                left: "2px",
                width: `${cornerSize}px`,
                height: `${cornerSize}px`,
                zIndex: 3,
              }}
              onMouseDown={(e) => handleResizeStart(e, "nw", "diagonal")}
            >
              <div
                ref={topLeftCornerHorizontalRef}
                className="absolute bg-primary"
                style={{
                  top: 0,
                  left: 0,
                  width: `${cornerSize}px`,
                  height: `${cornerThickness}px`,
                }}
              />
              <div
                ref={topLeftCornerVerticalRef}
                className="absolute bg-primary"
                style={{
                  top: 0,
                  left: 0,
                  width: `${cornerThickness}px`,
                  height: `${cornerSize}px`,
                }}
              />
            </div>

            {/* Corner L-shaped decorative borders - Top Right */}
            <div
              className="absolute cursor-nesw-resize pointer-events-auto"
              style={{
                top: "2px",
                right: "2px",
                width: `${cornerSize}px`,
                height: `${cornerSize}px`,
                zIndex: 3,
              }}
              onMouseDown={(e) => handleResizeStart(e, "ne", "diagonal")}
            >
              <div
                ref={topRightCornerHorizontalRef}
                className="absolute bg-primary"
                style={{
                  top: 0,
                  right: 0,
                  width: `${cornerSize}px`,
                  height: `${cornerThickness}px`,
                }}
              />
              <div
                ref={topRightCornerVerticalRef}
                className="absolute bg-primary"
                style={{
                  top: 0,
                  right: 0,
                  width: `${cornerThickness}px`,
                  height: `${cornerSize}px`,
                }}
              />
            </div>

            {/* Corner L-shaped decorative borders - Bottom Right */}
            <div
              className="absolute cursor-nwse-resize pointer-events-auto"
              style={{
                bottom: "2px",
                right: "2px",
                width: `${cornerSize}px`,
                height: `${cornerSize}px`,
                zIndex: 3,
              }}
              onMouseDown={(e) => handleResizeStart(e, "se", "diagonal")}
            >
              <div
                ref={bottomRightCornerHorizontalRef}
                className="absolute bg-primary"
                style={{
                  bottom: 0,
                  right: 0,
                  width: `${cornerSize}px`,
                  height: `${cornerThickness}px`,
                }}
              />
              <div
                ref={bottomRightCornerVerticalRef}
                className="absolute bg-primary"
                style={{
                  bottom: 0,
                  right: 0,
                  width: `${cornerThickness}px`,
                  height: `${cornerSize}px`,
                }}
              />
            </div>

            {/* Corner L-shaped decorative borders - Bottom Left */}
            <div
              className="absolute cursor-nesw-resize pointer-events-auto"
              style={{
                bottom: "2px",
                left: "2px",
                width: `${cornerSize}px`,
                height: `${cornerSize}px`,
                zIndex: 3,
              }}
              onMouseDown={(e) => handleResizeStart(e, "sw", "diagonal")}
            >
              <div
                ref={bottomLeftCornerHorizontalRef}
                className="absolute bg-primary"
                style={{
                  bottom: 0,
                  left: 0,
                  width: `${cornerSize}px`,
                  height: `${cornerThickness}px`,
                }}
              />
              <div
                ref={bottomLeftCornerVerticalRef}
                className="absolute bg-primary"
                style={{
                  bottom: 0,
                  left: 0,
                  width: `${cornerThickness}px`,
                  height: `${cornerSize}px`,
                }}
              />
            </div>

            {/* Edge handles - Horizontal/Vertical resize */}
            {/* Top edge - Vertical resize (horizontal bar) */}
            <div
              ref={topHandleRef}
              className="absolute cursor-ns-resize bg-primary"
              style={{
                top: "0px",
                left: "50%",
                transform: "translateX(-50%)",
                width: `${horizontalHandleLength}px`,
                height: `${handleThickness}px`,
                zIndex: 2,
              }}
              onMouseDown={(e) => handleResizeStart(e, "n", "vertical")}
            />

            {/* Right edge - Horizontal resize (vertical bar) */}
            <div
              ref={rightHandleRef}
              className="absolute cursor-ew-resize bg-primary"
              style={{
                right: "0px",
                top: "50%",
                transform: "translateY(-50%)",
                width: `${handleThickness}px`,
                height: `${verticalHandleLength}px`,
                zIndex: 2,
              }}
              onMouseDown={(e) => handleResizeStart(e, "e", "horizontal")}
            />

            {/* Bottom edge - Vertical resize (horizontal bar) */}
            <div
              ref={bottomHandleRef}
              className="absolute cursor-ns-resize bg-primary"
              style={{
                bottom: "0px",
                left: "50%",
                transform: "translateX(-50%)",
                width: `${horizontalHandleLength}px`,
                height: `${handleThickness}px`,
                zIndex: 2,
              }}
              onMouseDown={(e) => handleResizeStart(e, "s", "vertical")}
            />

            {/* Left edge - Horizontal resize (vertical bar) */}
            <div
              ref={leftHandleRef}
              className="absolute cursor-ew-resize bg-primary"
              style={{
                left: "0px",
                top: "50%",
                transform: "translateY(-50%)",
                width: `${handleThickness}px`,
                height: `${verticalHandleLength}px`,
                zIndex: 2,
              }}
              onMouseDown={(e) => handleResizeStart(e, "w", "horizontal")}
            />

            {/* Visual border to show square wrapper bounds */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                border: "2px solid hsl(var(--primary))",
                opacity: 0.3,
              }}
            />
          </>
        )}
      </div>
    );
  }
);
