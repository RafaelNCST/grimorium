import { useState, useEffect, useCallback } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import type { IPlotArc } from "@/types/plot-types";

import { getSizeColor } from "../utils/get-size-color";
import { getStatusColor } from "../utils/get-status-color";

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
    const foundArc = MOCK_PLOT_ARCS.find((a) => a.id === plotId);
    if (foundArc) {
      setArc(foundArc);
      setEditForm(foundArc);
    }
  }, [plotId]);

  const handleBack = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: plotId },
    });
  }, [navigate, plotId]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (!arc) return;
    setEditForm(arc);
    setIsEditing(false);
  }, [arc]);

  const handleEditFormChange = useCallback((field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleToggleEventCompletion = useCallback((eventId: string) => {
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
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: plotId },
    });
  }, [navigate, plotId]);

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
      onToggleEventCompletion={handleToggleEventCompletion}
      onEventDeleteRequest={handleEventDeleteRequest}
      getSizeColor={getSizeColor}
      getStatusColor={getStatusColor}
    />
  );
}
