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
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormListInputProps {
  /**
   * Label for the field
   */
  label: string;
  /**
   * Placeholder for the input
   */
  placeholder: string;
  /**
   * Text for the add button (optional, used for accessibility)
   */
  buttonText?: string;
  /**
   * Current list of values
   */
  value: string[];
  /**
   * Callback when list changes
   */
  onChange: (value: string[]) => void;
  /**
   * Custom className for label
   */
  labelClassName?: string;
  /**
   * Maximum length for each item
   */
  maxLength?: number;
  /**
   * Size of the input field
   * - "small": Single-line Input for short items (e.g., nicknames)
   * - "large": Multi-line Textarea for longer items (e.g., mysteries, anomalies)
   * @default "large"
   */
  inputSize?: "small" | "large";
}

interface ListItem {
  id: string;
  text: string;
}

interface SortableItemProps {
  id: string;
  text: string;
  onTextChange: (text: string) => void;
  onDelete: () => void;
}

function SortableItem({ id, text, onTextChange, onDelete }: SortableItemProps) {
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
      {...listeners}
      className="flex items-center gap-2 group"
    >
      <span className="text-muted-foreground">•</span>
      <Input
        data-no-drag="true"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="flex-1"
      />
      <Button
        data-no-drag="true"
        variant="ghost-destructive"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="h-8 w-8 transition-opacity cursor-pointer"
      >
        <X className="h-4 w-4" />
      </Button>
    </li>
  );
}

/**
 * FormListInput - Reusable list input component with drag-and-drop support
 *
 * Allows adding, removing, editing, and reordering string items in a list.
 * Features drag-and-drop reordering and inline editing.
 *
 * @example
 * ```tsx
 * // Large textarea input (default) - for longer items
 * <FormListInput
 *   value={anomalies}
 *   onChange={setAnomalies}
 *   label="Region Anomalies"
 *   placeholder="Rivers that flow upward..."
 *   buttonText="Add Anomaly"
 *   maxLength={200}
 *   inputSize="large" // optional, this is the default
 * />
 *
 * // Small single-line input - for short items like nicknames
 * <FormListInput
 *   value={nicknames}
 *   onChange={setNicknames}
 *   label="Nicknames"
 *   placeholder="The Shadow..."
 *   buttonText="Add Nickname"
 *   inputSize="small"
 * />
 * ```
 */
export function FormListInput({
  label,
  placeholder,
  buttonText,
  value,
  onChange,
  labelClassName,
  maxLength,
  inputSize = "large",
}: FormListInputProps) {
  const [newItem, setNewItem] = useState("");

  // Convert string array to object array with IDs
  const items: ListItem[] = value.map((text, index) => ({
    id: `item-${index}`,
    text,
  }));

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
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      onChange(reorderedItems.map((item) => item.text));
    }
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      onChange([...value, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleDeleteItem = (id: string) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    onChange(value.filter((_, i) => i !== itemIndex));
  };

  const handleUpdateItem = (id: string, text: string) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    onChange(value.map((v, i) => (i === itemIndex ? text : v)));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    // For small inputs: Enter always adds the item
    // For large inputs: Enter without Shift adds, Shift+Enter creates new line
    if (e.key === "Enter") {
      if (inputSize === "small" || !e.shiftKey) {
        e.preventDefault();
        handleAddItem();
      }
    }
  };

  return (
    <div className="space-y-3">
      <Label className={labelClassName || "text-sm font-medium"}>{label}</Label>

      <div className="flex items-start gap-2">
        {inputSize === "small" ? (
          <Input
            data-no-drag="true"
            placeholder={placeholder}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            className="flex-1"
          />
        ) : (
          <Textarea
            data-no-drag="true"
            placeholder={placeholder}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            maxLength={maxLength}
            className="flex-1 resize-none"
          />
        )}
        <Button
          data-no-drag="true"
          onClick={handleAddItem}
          size="icon"
          variant="secondary"
          className="cursor-pointer"
          disabled={!newItem.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {items.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
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
