import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash, Clock, MapPin, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  character: string;
  eventType: "creation" | "ownership" | "lost" | "found" | "destroyed" | "modified" | "other";
}

// Mock data
const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "Forjado por Merlim",
    description: "A espada foi forjada nas forjas celestiais usando metal de origem estelar, imbuída com magias ancestrais.",
    date: "Era dos Deuses",
    location: "Forjas Celestiais",
    character: "Merlim, o Mago",
    eventType: "creation"
  },
  {
    id: "2",
    title: "Entregue ao Rei Arthur",
    description: "Merlim entrega Excalibur ao jovem Arthur após ele provar ser o rei legítimo retirando a espada da pedra.",
    date: "Primeiro Ano do Reino de Camelot",
    location: "Camelot",
    character: "Rei Arthur",
    eventType: "ownership"
  },
  {
    id: "3",
    title: "Batalha contra Mordred",
    description: "Durante a batalha final contra Mordred, Excalibur foi danificada mas não quebrada. Suas runas perderam parte do brilho.",
    date: "Último Ano do Reino de Camelot",
    location: "Campo de Batalha de Camlann",
    character: "Rei Arthur",
    eventType: "modified"
  },
  {
    id: "4",
    title: "Devolvida ao Lago",
    description: "Antes de morrer, Arthur ordena que Sir Bedivere devolva Excalibur à Senhora do Lago.",
    date: "Fim do Reino de Camelot",
    location: "Lago Sagrado",
    character: "Sir Bedivere",
    eventType: "lost"
  }
];

const eventTypeIcons = {
  creation: "⚒️",
  ownership: "👑",
  lost: "🌊",
  found: "🔍",
  destroyed: "💥",
  modified: "🔧",
  other: "📜"
};

const eventTypeNames = {
  creation: "Criação",
  ownership: "Mudança de Posse",
  lost: "Perdido",
  found: "Encontrado",
  destroyed: "Destruído",
  modified: "Modificado",
  other: "Outro"
};

export default function ItemTimeline() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<TimelineEvent[]>(mockTimelineEvents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    eventType: "other"
  });

  const itemName = "Excalibur"; // In real app, fetch from item data

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.description) return;

    const event: TimelineEvent = {
      id: Date.now().toString(),
      title: newEvent.title || "",
      description: newEvent.description || "",
      date: newEvent.date || "",
      location: newEvent.location || "",
      character: newEvent.character || "",
      eventType: newEvent.eventType as TimelineEvent["eventType"] || "other"
    };

    setEvents([...events, event]);
    setNewEvent({ eventType: "other" });
    setShowCreateModal(false);
    
    toast({
      title: "Evento adicionado",
      description: "O evento foi adicionado à timeline.",
    });
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowCreateModal(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !newEvent.title || !newEvent.description) return;

    const updatedEvent: TimelineEvent = {
      ...editingEvent,
      title: newEvent.title || "",
      description: newEvent.description || "",
      date: newEvent.date || "",
      location: newEvent.location || "",
      character: newEvent.character || "",
      eventType: newEvent.eventType as TimelineEvent["eventType"] || "other"
    };

    setEvents(events.map(e => e.id === editingEvent.id ? updatedEvent : e));
    setEditingEvent(null);
    setNewEvent({ eventType: "other" });
    setShowCreateModal(false);
    
    toast({
      title: "Evento atualizado",
      description: "O evento foi atualizado com sucesso.",
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({
      title: "Evento removido",
      description: "O evento foi removido da timeline.",
    });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingEvent(null);
    setNewEvent({ eventType: "other" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(`/item/${id}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para {itemName}
            </Button>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)} className="btn-magical">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Timeline Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8" />
            Timeline de {itemName}
          </h1>
          <p className="text-muted-foreground">
            Acompanhe a jornada histórica do item através do tempo
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-background border-4 border-primary rounded-full">
                  <span className="text-2xl">{eventTypeIcons[event.eventType]}</span>
                </div>
                
                {/* Event card */}
                <Card className="flex-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
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
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm leading-relaxed">{event.description}</p>
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

        {/* Create/Edit Event Modal */}
        <Dialog open={showCreateModal} onOpenChange={handleCloseModal}>
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
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ex: Forjado por Merlim"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={newEvent.description || ""}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
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
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    placeholder="Ex: Era dos Deuses, Ano 1542..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Tipo de Evento</Label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({ 
                      ...newEvent, 
                      eventType: e.target.value as TimelineEvent["eventType"] 
                    })}
                  >
                    {Object.entries(eventTypeNames).map(([key, label]) => (
                      <option key={key} value={key}>
                        {eventTypeIcons[key as keyof typeof eventTypeIcons]} {label}
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
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Ex: Camelot, Forjas Celestiais..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="character">Personagem Envolvido</Label>
                  <Input
                    id="character"
                    value={newEvent.character || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, character: e.target.value })}
                    placeholder="Ex: Rei Arthur, Merlim..."
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button 
                onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
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