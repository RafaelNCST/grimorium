import { useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { IGalleryItem } from "@/types/gallery-types";
import { GalleryCard } from "./gallery-card";

interface GalleryGridProps {
  items: IGalleryItem[];
  onItemClick?: (item: IGalleryItem) => void;
  onItemEdit?: (item: IGalleryItem) => void;
  onItemDelete?: (item: IGalleryItem) => void;
  onReorder?: (reorderedItems: IGalleryItem[]) => void;
  enableDragDrop?: boolean;
}

interface SortableCardProps {
  item: IGalleryItem;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function SortableCard({
  item,
  onClick,
  onEdit,
  onDelete,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <GalleryCard
        item={item}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

export function GalleryGrid({
  items,
  onItemClick,
  onItemEdit,
  onItemDelete,
  onReorder,
  enableDragDrop = true,
}: GalleryGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !onReorder) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    onReorder(reorderedItems);
  };

  if (enableDragDrop) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
            {items.map((item) => (
              <SortableCard
                key={item.id}
                item={item}
                onClick={() => onItemClick?.(item)}
                onEdit={() => onItemEdit?.(item)}
                onDelete={() => onItemDelete?.(item)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  // Without drag & drop
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
      {items.map((item) => (
        <GalleryCard
          key={item.id}
          item={item}
          onClick={() => onItemClick?.(item)}
          onEdit={() => onItemEdit?.(item)}
          onDelete={() => onItemDelete?.(item)}
        />
      ))}
    </div>
  );
}
