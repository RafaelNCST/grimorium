import { useState, useRef, useEffect, memo } from "react";

interface PropsCardWrapper {
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
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onClick: () => void;
  onDoubleClick?: () => void;
  className?: string;
  gridEnabled?: boolean;
  gridSize?: number;
  zoom?: number;
  disableDrag?: boolean;
}

export const CardWrapper = memo(
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
    onDragMove,
    onDragEnd,
    onClick,
    onDoubleClick,
    className = "",
    gridEnabled = false,
    gridSize = 20,
    zoom = 1,
    disableDrag = false,
  }: PropsCardWrapper) => {
    const [isDragging, setIsDragging] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    // Store current position during drag for direct DOM manipulation
    const dragStateRef = useRef({
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: x,
      currentY: y,
    });

    // Store grid props in refs to avoid stale closures
    const gridPropsRef = useRef({ gridEnabled, gridSize });

    // Update refs when props change
    useEffect(() => {
      gridPropsRef.current = { gridEnabled, gridSize };
      dragStateRef.current.currentX = x;
      dragStateRef.current.currentY = y;
    }, [gridEnabled, gridSize, x, y]);

    // Snap-to-grid function for rectangular elements
    const snapToGrid = (
      posX: number,
      posY: number
    ): { x: number; y: number } => {
      const { gridEnabled: enabled, gridSize: size } = gridPropsRef.current;

      if (!enabled) {
        return { x: posX, y: posY };
      }

      return {
        x: Math.round(posX / size) * size,
        y: Math.round(posY / size) * size,
      };
    };

    // Drag handlers with direct DOM manipulation
    useEffect(() => {
      if (!isDragging) return;

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

          // Call callback to update wrapper in real time
          onDragMove?.(newX, newY);
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

          // Call callback to clear temporary state
          onDragEnd?.();

          dragStateRef.current.isDragging = false;
          setIsDragging(false);
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
      isEditMode,
      x,
      y,
      gridEnabled,
      onPositionChange,
      onDragMove,
      onDragEnd,
      snapToGrid,
      zoom,
    ]);

    const handleMouseDown = (e: React.MouseEvent) => {
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

    return (
      <div
        ref={elementRef}
        data-element-id={id}
        className={`absolute ${
          isDragging
            ? "cursor-grabbing opacity-80"
            : isEditMode
              ? "cursor-move"
              : "cursor-default"
        } ${className}`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`,
          zIndex: isSelected ? 100 : 10,
          // Performance optimizations for smooth dragging at any zoom level
          willChange: isDragging ? "transform, left, top" : "auto",
          // Force GPU layer for better performance
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        onMouseDown={isEditMode ? handleMouseDown : undefined}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {children}

        {/* Selection border - purple lines */}
        {isSelected && isEditMode && !isEditing && (
          <>
            {/* Top border */}
            <div
              className="absolute"
              style={{
                top: "-1px",
                left: "0",
                right: "0",
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
                top: "0",
                bottom: "0",
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
                left: "0",
                right: "0",
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
                top: "0",
                bottom: "0",
                width: "2px",
                backgroundColor: "hsl(var(--primary))",
                pointerEvents: "none",
              }}
            />
          </>
        )}
      </div>
    );
  }
);
