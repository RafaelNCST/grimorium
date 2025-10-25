import { useState } from "react";

import { Calendar, Edit2, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type ITimelineEvent } from "@/types/faction-types";

interface PropsTimelineInput {
  value: ITimelineEvent[];
  onChange: (value: ITimelineEvent[]) => void;
}

export function TimelineInput({ value, onChange }: PropsTimelineInput) {
  const { t } = useTranslation("create-faction");
  const [editingEvent, setEditingEvent] = useState<ITimelineEvent>({
    id: "",
    title: "",
    date: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleAddOrUpdateEvent = () => {
    if (editingEvent.title.trim() && editingEvent.date.trim()) {
      if (isEditing && editingEvent.id) {
        // Update existing event
        onChange(
          value.map((event) =>
            event.id === editingEvent.id ? editingEvent : event
          )
        );
        setIsEditing(false);
      } else {
        // Add new event
        const newEvent = {
          ...editingEvent,
          id: Date.now().toString(),
        };
        onChange([...value, newEvent]);
      }
      setEditingEvent({ id: "", title: "", date: "", description: "" });
    }
  };

  const handleEditEvent = (event: ITimelineEvent) => {
    setEditingEvent(event);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingEvent({ id: "", title: "", date: "", description: "" });
    setIsEditing(false);
  };

  const handleRemoveEvent = (id: string) => {
    onChange(value.filter((event) => event.id !== id));
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{t("modal.chronology")}</Label>

      {/* Add Event Form */}
      <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
        <div className="space-y-2">
          <Label htmlFor="event-title" className="text-xs">
            {t("modal.event_title")} *
          </Label>
          <Input
            id="event-title"
            placeholder={t("modal.event_title_placeholder")}
            value={editingEvent.title}
            onChange={(e) =>
              setEditingEvent((prev) => ({ ...prev, title: e.target.value }))
            }
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-date" className="text-xs">
            {t("modal.event_date")} *
          </Label>
          <Input
            id="event-date"
            placeholder={t("modal.event_date_placeholder")}
            value={editingEvent.date}
            onChange={(e) =>
              setEditingEvent((prev) => ({ ...prev, date: e.target.value }))
            }
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-description" className="text-xs">
            {t("modal.event_description")}
          </Label>
          <Textarea
            id="event-description"
            placeholder={t("modal.event_description_placeholder")}
            value={editingEvent.description}
            onChange={(e) =>
              setEditingEvent((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={3}
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{editingEvent.description.length}/500</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddOrUpdateEvent}
            className="flex-1"
            disabled={!editingEvent.title.trim() || !editingEvent.date.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isEditing ? t("modal.update_event") : t("modal.add_event")}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelEdit}
              className="px-4"
            >
              {t("modal.cancel_edit")}
            </Button>
          )}
        </div>
      </div>

      {/* Events List */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((event) => (
            <div
              key={event.id}
              className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">{event.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditEvent(event)}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEvent(event.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
