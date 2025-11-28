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
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { IPlotEvent } from "@/types/plot-types";

import { EventModal } from "./event-modal";

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
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-start gap-3 p-3 rounded-lg border border-border cursor-grab active:cursor-grabbing ${
        isDragging
          ? "bg-background shadow-lg border-primary/50"
          : "bg-card hover:bg-muted/30"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-foreground">
            {event.order}
          </span>
          <div className="h-5 w-px bg-border" />
          <h4 className="font-medium">{event.name}</h4>
        </div>
        <p className="text-sm text-muted-foreground mt-1 text-justify">
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
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function EventChainEditor({ events, onChange }: PropsEventChainEditor) {
  const { t } = useTranslation("create-plot-arc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IPlotEvent | null>(null);

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

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: IPlotEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleConfirmModal = (name: string, description: string) => {
    if (editingEvent) {
      // Edit existing event
      const updatedEvents = events.map((e) =>
        e.id === editingEvent.id ? { ...e, name, description } : e
      );
      onChange(updatedEvents);
    } else {
      // Add new event
      const newEvent: IPlotEvent = {
        id: crypto.randomUUID(),
        name,
        description,
        completed: false,
        order: events.length + 1,
      };
      onChange([...events, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    const newEvents = events
      .filter((e) => e.id !== id)
      .map((e, idx) => ({ ...e, order: idx + 1 }));
    onChange(newEvents);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-primary">
          {t("modal.event_chain")}
        </Label>
        <Button
          type="button"
          variant="magical"
          size="sm"
          onClick={handleOpenAddModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("modal.add_event")}
        </Button>
      </div>

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
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {events.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
          <p className="text-sm">{t("modal.no_events")}</p>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        event={editingEvent}
      />
    </div>
  );
}
