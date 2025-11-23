import { useState } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IPlotEvent } from "@/types/plot-types";

interface PropsEventChainEditor {
  events: IPlotEvent[];
  onChange: (events: IPlotEvent[]) => void;
}

interface PropsSortableEvent {
  event: IPlotEvent;
  onEdit: (event: IPlotEvent) => void;
  onDelete: (id: string) => void;
}

function SortableEvent({ event, onEdit, onDelete }: PropsSortableEvent) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: event.id,
    transition: null,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-grab active:cursor-grabbing"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-foreground">
            {event.order}
          </span>
          <div className="h-5 w-px bg-border" />
          <h4 className="font-medium truncate">{event.name}</h4>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {event.description}
        </p>
      </div>

      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="cursor-pointer hover:bg-amber-500/10 hover:text-amber-500"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost-destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function EventChainEditor({ events, onChange }: PropsEventChainEditor) {
  const { t } = useTranslation("create-plot-arc");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IPlotEvent | null>(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = events.findIndex((e) => e.id === active.id);
      const newIndex = events.findIndex((e) => e.id === over.id);

      const newEvents = arrayMove(events, oldIndex, newIndex).map((e, idx) => ({
        ...e,
        order: idx + 1,
      }));

      onChange(newEvents);
    }
  };

  const handleAddEvent = () => {
    if (!newEventName.trim() || !newEventDescription.trim()) return;

    const newEvent: IPlotEvent = {
      id: crypto.randomUUID(),
      name: newEventName.trim(),
      description: newEventDescription.trim(),
      completed: false,
      order: events.length + 1,
    };

    onChange([...events, newEvent]);
    setNewEventName("");
    setNewEventDescription("");
    setIsAddingEvent(false);
  };

  const handleEditEvent = () => {
    if (!editingEvent || !newEventName.trim() || !newEventDescription.trim())
      return;

    const updatedEvents = events.map((e) =>
      e.id === editingEvent.id
        ? {
            ...e,
            name: newEventName.trim(),
            description: newEventDescription.trim(),
          }
        : e
    );

    onChange(updatedEvents);
    setNewEventName("");
    setNewEventDescription("");
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    const newEvents = events
      .filter((e) => e.id !== id)
      .map((e, idx) => ({ ...e, order: idx + 1 }));
    onChange(newEvents);
  };

  const handleStartEdit = (event: IPlotEvent) => {
    setEditingEvent(event);
    setNewEventName(event.name);
    setNewEventDescription(event.description);
    setIsAddingEvent(false);
  };

  const handleCancelEdit = () => {
    setNewEventName("");
    setNewEventDescription("");
    setIsAddingEvent(false);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-primary">
          {t("modal.event_chain")} <span className="text-destructive">*</span>
        </Label>
        {!isAddingEvent && !editingEvent && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsAddingEvent(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("modal.add_event")}
          </Button>
        )}
      </div>

      {/* Add/Edit Event Form */}
      {(isAddingEvent || editingEvent) && (
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="event-name" className="text-sm">
              {t("modal.event_name")} *
            </Label>
            <Input
              id="event-name"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              placeholder={t("modal.event_name_placeholder")}
              maxLength={100}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{newEventName.length}/100</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description" className="text-sm">
              {t("modal.event_description")} *
            </Label>
            <Textarea
              id="event-description"
              value={newEventDescription}
              onChange={(e) => setNewEventDescription(e.target.value)}
              placeholder={t("modal.event_description_placeholder")}
              rows={3}
              maxLength={500}
              className="resize-none"
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{newEventDescription.length}/500</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCancelEdit}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {t("button.cancel")}
            </Button>
            <Button
              type="button"
              variant="magical"
              size="sm"
              onClick={editingEvent ? handleEditEvent : handleAddEvent}
              disabled={!newEventName.trim() || !newEventDescription.trim()}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              {editingEvent ? t("button.save") : t("button.add")}
            </Button>
          </div>
        </div>
      )}

      {/* Events List */}
      {events.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={events.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {events.map((event) => (
                <SortableEvent
                  key={event.id}
                  event={event}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {events.length === 0 && !isAddingEvent && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
          <p className="text-sm">{t("modal.no_events")}</p>
        </div>
      )}
    </div>
  );
}
