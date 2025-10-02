import { useState, useEffect, useCallback, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { IPlotArc, mockPlotArcs } from "@/mocks/local/plot-arc-data";

import { PlotArcDetailView } from "./view";

export function PlotArcDetail() {
  const { plotId } = useParams({
    from: "/dashboard/$dashboardId/tabs/plot/$plotId",
  });
  const navigate = useNavigate();
  const [arc, setArc] = useState<IPlotArc | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<IPlotArc>>({});
  const [showDeleteArcDialog, setShowDeleteArcDialog] = useState(false);
  const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  useEffect(() => {
    const foundArc = mockPlotArcs.find((a) => a.id === plotId);
    if (foundArc) {
      setArc(foundArc);
      setEditForm(foundArc);
    }
  }, [plotId]);

  // Memoized color functions
  const getSizeColor = useCallback((size: string) => {
    switch (size) {
      case "pequeno":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "médio":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "grande":
        return "bg-red-500/20 text-red-400 border-red-400/30";
      default:
        return "bg-muted";
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "finalizado":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "andamento":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "planejamento":
        return "bg-orange-500/20 text-orange-400 border-orange-400/30";
      default:
        return "bg-muted";
    }
  }, []);

  // Navigation handlers
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (!arc) return;
    setEditForm(arc);
    setIsEditing(false);
  }, [arc]);

  // Event handlers
  const handleEditFormChange = useCallback((field: string, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleEventCompletion = useCallback((eventId: string) => {
    setArc((prev) => {
      if (!prev) return prev;
      const updatedEvents = prev.events.map((event) =>
        event.id === eventId ? { ...event, completed: !event.completed } : event
      );
      const completedCount = updatedEvents.filter((e) => e.completed).length;
      const progress =
        updatedEvents.length > 0
          ? (completedCount / updatedEvents.length) * 100
          : 0;

      return { ...prev, events: updatedEvents, progress };
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!arc) return;
    if (
      editForm.name &&
      editForm.focus &&
      editForm.description &&
      editForm.size &&
      editForm.status
    ) {
      setArc({ ...arc, ...editForm } as IPlotArc);
      setIsEditing(false);
      toast("Arco atualizado com sucesso!");
    }
  }, [arc, editForm]);

  const handleDeleteArc = useCallback(() => {
    toast("Arco excluído com sucesso!");
    window.history.back();
  }, []);

  const handleDeleteEvent = useCallback(() => {
    if (eventToDelete) {
      setArc((prev) => {
        if (!prev) return prev;
        const updatedEvents = prev.events.filter((e) => e.id !== eventToDelete);
        const completedCount = updatedEvents.filter((e) => e.completed).length;
        const progress =
          updatedEvents.length > 0
            ? (completedCount / updatedEvents.length) * 100
            : 0;

        return { ...prev, events: updatedEvents, progress };
      });
      setEventToDelete(null);
      setShowDeleteEventDialog(false);
      toast("Evento excluído com sucesso!");
    }
  }, [eventToDelete]);

  const handleEventDeleteRequest = useCallback((eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteEventDialog(true);
  }, []);

  const handleDeleteArcDialogChange = useCallback((open: boolean) => {
    setShowDeleteArcDialog(open);
  }, []);

  const handleDeleteEventDialogChange = useCallback((open: boolean) => {
    setShowDeleteEventDialog(open);
    if (!open) {
      setEventToDelete(null);
    }
  }, []);

  if (!arc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Arco não encontrado</h2>
          <button onClick={handleBack} className="btn btn-primary">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <PlotArcDetailView
      arc={arc}
      isEditing={isEditing}
      editForm={editForm}
      showDeleteArcDialog={showDeleteArcDialog}
      showDeleteEventDialog={showDeleteEventDialog}
      onBack={handleBack}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDeleteArc={handleDeleteArc}
      onDeleteEvent={handleDeleteEvent}
      onDeleteArcDialogChange={handleDeleteArcDialogChange}
      onDeleteEventDialogChange={handleDeleteEventDialogChange}
      onEditFormChange={handleEditFormChange}
      onToggleEventCompletion={toggleEventCompletion}
      onEventDeleteRequest={handleEventDeleteRequest}
      getSizeColor={getSizeColor}
      getStatusColor={getStatusColor}
    />
  );
}
