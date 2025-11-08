import { useState } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  type IPowerBlock,
  type UnorderedListContent,
} from "../../types/power-system-types";

interface UnorderedListBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: UnorderedListContent) => void;
  onDelete: () => void;
}

interface SortableItemProps {
  id: string;
  text: string;
  isEditMode: boolean;
  onTextChange: (text: string) => void;
  onDelete: () => void;
}

function SortableItem({
  id,
  text,
  isEditMode,
  onTextChange,
  onDelete,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditMode ? listeners : {})}
      className="flex items-center gap-2 group"
    >
      <span className="text-muted-foreground">•</span>
      {isEditMode ? (
        <>
          <Input
            data-no-drag="true"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="flex-1"
          />
          <Button
            data-no-drag="true"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 text-destructive hover:bg-red-500/20 hover:text-red-600 transition-opacity cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <span className="text-sm">{text}</span>
      )}
    </li>
  );
}

export function UnorderedListBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
}: UnorderedListBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as UnorderedListContent;
  const [newItem, setNewItem] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = content.items.findIndex((item) => item.id === active.id);
      const newIndex = content.items.findIndex((item) => item.id === over.id);

      onUpdate({
        ...content,
        items: arrayMove(content.items, oldIndex, newIndex),
      });
    }
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      onUpdate({
        ...content,
        items: [
          ...content.items,
          { id: crypto.randomUUID(), text: newItem.trim() },
        ],
      });
      setNewItem("");
    }
  };

  const handleDeleteItem = (id: string) => {
    onUpdate({
      ...content,
      items: content.items.filter((item) => item.id !== id),
    });
  };

  const handleUpdateItem = (id: string, text: string) => {
    onUpdate({
      ...content,
      items: content.items.map((item) =>
        item.id === id ? { ...item, text } : item
      ),
    });
  };

  if (!isEditMode && content.items.length === 0) {
    return null;
  }

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Button
            data-no-drag="true"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:bg-red-500/20 hover:text-red-600 ml-auto cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Input
            data-no-drag="true"
            placeholder={t("blocks.unordered_list.item_placeholder")}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem();
              }
            }}
            className="flex-1"
          />
          <Button
            data-no-drag="true"
            onClick={handleAddItem}
            size="sm"
            variant="outline"
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("blocks.unordered_list.add_button")}
          </Button>
        </div>

        {content.items.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={content.items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {content.items.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    isEditMode={isEditMode}
                    onTextChange={(text) => handleUpdateItem(item.id, text)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    );
  }

  // In view mode, render simple list without DndContext
  return content.items.length > 0 ? (
    <ul className="space-y-2">
      {content.items.map((item) => (
        <li key={item.id} className="flex items-center gap-2">
          <span className="text-muted-foreground">•</span>
          <span className="text-sm">{item.text}</span>
        </li>
      ))}
    </ul>
  ) : null;
}
