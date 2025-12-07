import React from "react";
import { useTranslation } from "react-i18next";

import {
  ArrowLeft,
  Plus,
  Edit,
  Trash,
  Clock,
  MapPin,
  User,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ITimelineEvent {
  id: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  character?: string;
  eventType:
    | "creation"
    | "battle"
    | "discovery"
    | "loss"
    | "transformation"
    | "other";
}

const eventTypeIcons: Record<ITimelineEvent["eventType"], string> = {
  creation: "⚒️",
  battle: "⚔️",
  discovery: "🔍",
  loss: "💔",
  transformation: "✨",
  other: "📍",
};


interface PropsItemTimelineView {
  itemName: string;
  events: ITimelineEvent[];
  showCreateModal: boolean;
  editingEvent: ITimelineEvent | null;
  newEvent: Partial<ITimelineEvent>;
  onBack: () => void;
  onCreateModalOpen: () => void;
  onCreateModalClose: () => void;
  onCreateEvent: () => void;
  onUpdateEvent: () => void;
  onEditEvent: (event: ITimelineEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onNewEventChange: (field: string, value: any) => void;
}

export function ItemTimelineView({
  itemName,
  events,
  showCreateModal,
  editingEvent,
  newEvent,
  onBack,
  onCreateModalOpen,
  onCreateModalClose,
  onCreateEvent,
  onUpdateEvent,
  onEditEvent,
  onDeleteEvent,
  onNewEventChange,
}: PropsItemTimelineView) {
  const { t } = useTranslation(["forms", "common", "tooltips"]);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common:actions.back_to", { name: itemName })}
            </Button>
          </div>

          <Button onClick={onCreateModalOpen} className="btn-magical">
            <Plus className="w-4 h-4 mr-2" />
            {t("forms:buttons.new_event")}
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8" />
            {t("common:title_bar.item_timeline")} - {itemName}
          </h1>
          <p className="text-muted-foreground">
            {t("tooltips:instructions.mark_events_as_you_write")}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {events.map((event, _index) => (
              <div key={event.id} className="relative flex items-start gap-6">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-background border-4 border-primary rounded-full">
                  <span className="text-2xl">
                    {eventTypeIcons[event.eventType]}
                  </span>
                </div>

                <Card className="flex-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">
                          {event.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {event.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {event.date}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          )}
                          {event.character && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {event.character}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteEvent(event.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {event.description}
                    </p>
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-secondary rounded-full">
                        {eventTypeIcons[event.eventType]}
                        {t(`forms:event_types.${event.eventType}`)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={showCreateModal} onOpenChange={onCreateModalClose}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? t("forms:buttons.edit_event") : t("forms:buttons.new_timeline_event")}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("forms:labels.event_title")} *</Label>
                <Input
                  id="title"
                  value={newEvent.title || ""}
                  onChange={(e) => onNewEventChange("title", e.target.value)}
                  placeholder={t("forms:placeholders.item_event_title")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("forms:labels.description")} *</Label>
                <Textarea
                  id="description"
                  value={newEvent.description || ""}
                  onChange={(e) =>
                    onNewEventChange("description", e.target.value)
                  }
                  placeholder={t("forms:placeholders.item_event_description")}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">{t("forms:labels.date_period")}</Label>
                  <Input
                    id="date"
                    value={newEvent.date || ""}
                    onChange={(e) => onNewEventChange("date", e.target.value)}
                    placeholder={t("forms:placeholders.event_title_example")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">{t("forms:labels.event_type")}</Label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                    value={newEvent.eventType}
                    onChange={(e) =>
                      onNewEventChange(
                        "eventType",
                        e.target.value as ITimelineEvent["eventType"]
                      )
                    }
                  >
                    {(Object.keys(eventTypeIcons) as Array<keyof typeof eventTypeIcons>).map((key) => (
                      <option key={key} value={key}>
                        {eventTypeIcons[key]}{" "}
                        {t(`forms:event_types.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">{t("forms:labels.location")}</Label>
                  <Input
                    id="location"
                    value={newEvent.location || ""}
                    onChange={(e) =>
                      onNewEventChange("location", e.target.value)
                    }
                    placeholder={t("forms:placeholders.item_event_location")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="character">{t("forms:labels.involved_character")}</Label>
                  <Input
                    id="character"
                    value={newEvent.character || ""}
                    onChange={(e) =>
                      onNewEventChange("character", e.target.value)
                    }
                    placeholder={t("forms:placeholders.item_event_character")}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onCreateModalClose}>
                {t("forms:buttons.cancel")}
              </Button>
              <Button
                onClick={editingEvent ? onUpdateEvent : onCreateEvent}
                className="btn-magical"
                disabled={!newEvent.title || !newEvent.description}
              >
                {editingEvent ? t("common:actions.edit") : t("common:actions.create")} {t("forms:buttons.new_event").split(" ")[1]}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
