import React from "react";

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

const eventTypeNames: Record<ITimelineEvent["eventType"], string> = {
  creation: "Criação",
  battle: "Batalha",
  discovery: "Descoberta",
  loss: "Perda",
  transformation: "Transformação",
  other: "Outro",
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
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para {itemName}
            </Button>
          </div>

          <Button onClick={onCreateModalOpen} className="btn-magical">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8" />
            Timeline de {itemName}
          </h1>
          <p className="text-muted-foreground">
            Acompanhe a jornada histórica do item através do tempo
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
                        {eventTypeNames[event.eventType]}
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
                {editingEvent ? "Editar Evento" : "Novo Evento da Timeline"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Evento *</Label>
                <Input
                  id="title"
                  value={newEvent.title || ""}
                  onChange={(e) => onNewEventChange("title", e.target.value)}
                  placeholder="Ex: Forjado por Merlim"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={newEvent.description || ""}
                  onChange={(e) =>
                    onNewEventChange("description", e.target.value)
                  }
                  placeholder="Descreva o que aconteceu neste momento..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data/Período</Label>
                  <Input
                    id="date"
                    value={newEvent.date || ""}
                    onChange={(e) => onNewEventChange("date", e.target.value)}
                    placeholder="Ex: Era dos Deuses, Ano 1542..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Tipo de Evento</Label>
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
                    {Object.entries(eventTypeNames).map(([key, label]) => (
                      <option key={key} value={key}>
                        {eventTypeIcons[key as keyof typeof eventTypeIcons]}{" "}
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    value={newEvent.location || ""}
                    onChange={(e) =>
                      onNewEventChange("location", e.target.value)
                    }
                    placeholder="Ex: Camelot, Forjas Celestiais..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="character">Personagem Envolvido</Label>
                  <Input
                    id="character"
                    value={newEvent.character || ""}
                    onChange={(e) =>
                      onNewEventChange("character", e.target.value)
                    }
                    placeholder="Ex: Rei Arthur, Merlim..."
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onCreateModalClose}>
                Cancelar
              </Button>
              <Button
                onClick={editingEvent ? onUpdateEvent : onCreateEvent}
                className="btn-magical"
                disabled={!newEvent.title || !newEvent.description}
              >
                {editingEvent ? "Atualizar" : "Criar"} Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
