import { useState, useCallback, useMemo } from "react";

import { useParams } from "@tanstack/react-router";

import { type ITimelineEvent, ItemTimelineView } from "./view";

export default function ItemTimeline() {
  const { itemId: _itemId } = useParams({
    from: "/dashboard/$dashboardId/tabs/item/$itemId/timeline",
  });

  const [events, setEvents] = useState<ITimelineEvent[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ITimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<ITimelineEvent>>({
    eventType: "other",
  });

  const itemName = useMemo(() => "Excalibur", []);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleCreateModalOpen = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCreateModalClose = useCallback(() => {
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
  }, [newEvent]);

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
  }, [editingEvent, newEvent]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  }, []);

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
      onCreateModalClose={handleCreateModalClose}
      onCreateEvent={handleCreateEvent}
      onUpdateEvent={handleUpdateEvent}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
      onNewEventChange={handleNewEventChange}
    />
  );
}
