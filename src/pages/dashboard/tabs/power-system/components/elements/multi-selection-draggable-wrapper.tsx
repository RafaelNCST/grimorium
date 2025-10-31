import { useState, useRef, useEffect } from "react";

import { IPowerElement } from "../../types/power-system-types";

interface PropsMultiSelectionDraggableWrapper {
  elements: IPowerElement[];
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  zoom: number;
  dragPositions?: Record<string, { x: number; y: number }>;
  onPositionChange: (
    updates: Array<{ id: string; x: number; y: number }>
  ) => void;
  onDragMove?: (updates: Array<{ id: string; x: number; y: number }>) => void;
  onDragEnd?: () => void;
}

function MultiSelectionDraggableWrapperComponent({
  elements,
  isEditMode,
  gridEnabled,
  gridSize,
  zoom,
  dragPositions,
  onPositionChange,
  onDragMove,
  onDragEnd,
}: PropsMultiSelectionDraggableWrapper) {
  const [isDragging, setIsDragging] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Store drag state
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialElements: [] as Array<{
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>,
    boundingBox: { x: 0, y: 0, width: 0, height: 0 },
  });

  // Calculate bounding box for all selected elements
  const calculateBoundingBox = () => {
    if (elements.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    // Use drag positions if available, otherwise use element positions
    const minX = Math.min(
      ...elements.map((el) => {
        const pos = dragPositions?.[el.id];
        return pos ? pos.x : el.x;
      })
    );
    const minY = Math.min(
      ...elements.map((el) => {
        const pos = dragPositions?.[el.id];
        return pos ? pos.y : el.y;
      })
    );
    const maxX = Math.max(
      ...elements.map((el) => {
        const pos = dragPositions?.[el.id];
        return (pos ? pos.x : el.x) + el.width;
      })
    );
    const maxY = Math.max(
      ...elements.map((el) => {
        const pos = dragPositions?.[el.id];
        return (pos ? pos.y : el.y) + el.height;
      })
    );

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  const boundingBox = calculateBoundingBox();
  const padding = 8;

  // Intelligent snap-to-grid function
  const snapToGrid = (posX: number, posY: number): { x: number; y: number } => {
    if (!gridEnabled) {
      return { x: posX, y: posY };
    }

    return {
      x: Math.round(posX / gridSize) * gridSize,
      y: Math.round(posY / gridSize) * gridSize,
    };
  };

  // Drag handlers (resize disabled for multi-selection)
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isEditMode || !wrapperRef.current) return;

      if (dragStateRef.current.isDragging) {
        // Dragging multiple elements
        const deltaX = (e.clientX - dragStateRef.current.startX) / zoom;
        const deltaY = (e.clientY - dragStateRef.current.startY) / zoom;

        // Prepare updates for callback
        const tempUpdates: Array<{ id: string; x: number; y: number }> = [];

        // Update all elements maintaining relative positions
        dragStateRef.current.initialElements.forEach((initial) => {
          const newX = initial.x + deltaX;
          const newY = initial.y + deltaY;

          tempUpdates.push({ id: initial.id, x: newX, y: newY });

          // Also update DOM for immediate visual feedback
          const element = document.querySelector(
            `[data-element-id="${initial.id}"]`
          ) as HTMLElement;
          if (element) {
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
          }
        });

        // Call callback for real-time position updates (wrappers, connections, etc)
        onDragMove?.(tempUpdates);
      }
    };

    const handleMouseUp = () => {
      if (dragStateRef.current.isDragging) {
        // Calculate final positions with snap
        const updates: Array<{ id: string; x: number; y: number }> = [];

        dragStateRef.current.initialElements.forEach((initial) => {
          const element = document.querySelector(
            `[data-element-id="${initial.id}"]`
          ) as HTMLElement;
          if (element) {
            let finalX = parseFloat(element.style.left);
            let finalY = parseFloat(element.style.top);

            if (gridEnabled) {
              const snapped = snapToGrid(finalX, finalY);
              finalX = snapped.x;
              finalY = snapped.y;
            }

            updates.push({ id: initial.id, x: finalX, y: finalY });
          }
        });

        onPositionChange(updates);
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
    gridEnabled,
    gridSize,
    zoom,
    onPositionChange,
    onDragMove,
    onDragEnd,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;

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
    dragStateRef.current.initialElements = elements.map((el) => ({
      id: el.id,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
    }));
    dragStateRef.current.boundingBox = boundingBox;

    setIsDragging(true);
  };

  if (elements.length === 0) return null;

  return (
    <div
      ref={wrapperRef}
      className={`absolute pointer-events-auto ${
        isDragging
          ? "cursor-grabbing opacity-80"
          : isEditMode
            ? "cursor-move"
            : "cursor-default"
      }`}
      style={{
        left: `${boundingBox.x - padding}px`,
        top: `${boundingBox.y - padding}px`,
        width: `${boundingBox.width + padding * 2}px`,
        height: `${boundingBox.height + padding * 2}px`,
        zIndex: 98,
        willChange: isDragging ? "transform, left, top" : "auto",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
      onMouseDown={isEditMode ? handleMouseDown : undefined}
    >
      {/* Transparent area for dragging - no resize handles for multi-selection */}
      <div className="absolute inset-0" />
    </div>
  );
}

export const MultiSelectionDraggableWrapper =
  MultiSelectionDraggableWrapperComponent;
