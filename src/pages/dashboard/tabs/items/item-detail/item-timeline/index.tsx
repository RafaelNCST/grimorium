import { useState, useCallback, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { useToast } from "@/hooks/use-toast";
import {
  ITimelineEvent,
  mockTimelineEvents,
} from "@/mocks/local/timeline-data";

import { ItemTimelineView } from "./view";

export default function ItemTimeline() {
  const { itemId } = useParams({
    from: "/dashboard/$dashboardId/tabs/item/$itemId/timeline",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const [events, setEvents] = useState<ITimelineEvent[]>(mockTimelineEvents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ITimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<ITimelineEvent>>({
    eventType: "other",
  });

  // In real app, fetch from item data
  const itemName = useMemo(() => "Excalibur", []);

  // Navigation handlers with useCallback
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleCreateModalOpen = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingEvent(null);
    setNewEvent({ eventType: "other" });
  }, []);

  const handleCreateEvent = useCallback(() => {
    if (!newEvent.title || !newEvent.description) return;

    const event: ITimelineEvent = {
      id: Date.now().toString(),
      title: newEvent.title || "",
      description: newEvent.description || "",
      date: newEvent.date || "",
      location: newEvent.location || "",
      character: newEvent.character || "",
      eventType: (newEvent.eventType as ITimelineEvent["eventType"]) || "other",
    };

    setEvents((prev) => [...prev, event]);
    setNewEvent({ eventType: "other" });
    setShowCreateModal(false);

    toast({
      title: "Evento adicionado",
      description: "O evento foi adicionado à timeline.",
    });
  }, [newEvent, toast]);

  const handleEditEvent = useCallback((event: ITimelineEvent) => {
    setEditingEvent(event);
    setNewEvent(event);
    setShowCreateModal(true);
  }, []);

  const handleUpdateEvent = useCallback(() => {
    if (!editingEvent || !newEvent.title || !newEvent.description) return;

    const updatedEvent: ITimelineEvent = {
      ...editingEvent,
      title: newEvent.title || "",
      description: newEvent.description || "",
      date: newEvent.date || "",
      location: newEvent.location || "",
      character: newEvent.character || "",
      eventType: (newEvent.eventType as ITimelineEvent["eventType"]) || "other",
    };

    setEvents((prev) =>
      prev.map((e) => (e.id === editingEvent.id ? updatedEvent : e))
    );
    setEditingEvent(null);
    setNewEvent({ eventType: "other" });
    setShowCreateModal(false);

    toast({
      title: "Evento atualizado",
      description: "O evento foi atualizado com sucesso.",
    });
  }, [editingEvent, newEvent, toast]);

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast({
        title: "Evento removido",
        description: "O evento foi removido da timeline.",
      });
    },
    [toast]
  );

  const handleNewEventChange = useCallback((field: string, value: any) => {
    setNewEvent((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <ItemTimelineView
      itemName={itemName}
      events={events}
      showCreateModal={showCreateModal}
      editingEvent={editingEvent}
      newEvent={newEvent}
      onBack={handleBack}
      onCreateModalOpen={handleCreateModalOpen}
      onCreateModalClose={handleCloseModal}
      onCreateEvent={handleCreateEvent}
      onUpdateEvent={handleUpdateEvent}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
      onNewEventChange={handleNewEventChange}
    />
  );
}
