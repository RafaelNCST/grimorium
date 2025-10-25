import { useState, useEffect, useCallback } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import type { IPlotArc, IPlotEvent } from "@/types/plot-types";
import {
  getPlotArcById,
  updatePlotArc,
  deletePlotArc,
} from "@/lib/db/plot.service";

import { getSizeColor } from "../utils/get-size-color";
import { getStatusColor } from "../utils/get-status-color";

import { PlotArcDetailView } from "./view";

export function PlotArcDetail() {
  const { t } = useTranslation("plot");
  const { plotId, dashboardId } = useParams({
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
    let mounted = true;

    const loadArc = async () => {
      try {
        const loadedArc = await getPlotArcById(plotId);
        if (mounted && loadedArc) {
          setArc(loadedArc);
          setEditForm(loadedArc);
        }
      } catch (error) {
        console.error("Failed to load plot arc:", error);
      }
    };

    loadArc();

    return () => {
      mounted = false;
    };
  }, [plotId]);

  const handleBack = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (!arc) return;
    setEditForm(arc);
    setIsEditing(false);
  }, [arc]);

  const handleEditFormChange = useCallback(
    <K extends keyof IPlotArc>(field: K, value: IPlotArc[K]) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleReorderEvents = useCallback(
    async (events: IPlotEvent[]) => {
      if (!arc) return;
      try {
        await updatePlotArc(arc.id, { events });
        setArc((prev) => {
          if (!prev) return prev;
          return { ...prev, events };
        });
      } catch (error) {
        console.error("Failed to reorder events:", error);
      }
    },
    [arc]
  );

  const handleAddEvent = useCallback(
    async (eventData: Omit<IPlotEvent, "id" | "order">) => {
      if (!arc) return;
      const newEvent = {
        ...eventData,
        id: crypto.randomUUID(),
        order: arc.events.length + 1,
      };
      const updatedEvents = [...arc.events, newEvent];
      const completedCount = updatedEvents.filter((e) => e.completed).length;
      const progress =
        updatedEvents.length > 0
          ? (completedCount / updatedEvents.length) * 100
          : 0;

      try {
        await updatePlotArc(arc.id, { events: updatedEvents, progress });
        setArc((prev) => {
          if (!prev) return prev;
          return { ...prev, events: updatedEvents, progress };
        });
      } catch (error) {
        console.error("Failed to add event:", error);
      }
    },
    [arc]
  );

  const handleToggleEventCompletion = useCallback(
    async (eventId: string) => {
      if (!arc) return;
      const updatedEvents = arc.events.map((event) =>
        event.id === eventId ? { ...event, completed: !event.completed } : event
      );
      const completedCount = updatedEvents.filter((e) => e.completed).length;
      const progress =
        updatedEvents.length > 0
          ? (completedCount / updatedEvents.length) * 100
          : 0;

      try {
        await updatePlotArc(arc.id, { events: updatedEvents, progress });
        setArc((prev) => {
          if (!prev) return prev;
          return { ...prev, events: updatedEvents, progress };
        });
      } catch (error) {
        console.error("Failed to toggle event completion:", error);
      }
    },
    [arc]
  );

  const handleSave = useCallback(async () => {
    if (!arc) return;
    if (
      editForm.name &&
      editForm.focus &&
      editForm.description &&
      editForm.size &&
      editForm.status
    ) {
      try {
        await updatePlotArc(arc.id, editForm);
        setArc({ ...arc, ...editForm } as IPlotArc);
        setIsEditing(false);
        toast.success(t("toast.arc_updated"));
      } catch (error) {
        console.error("Failed to update plot arc:", error);
        toast.error(t("toast.update_failed"));
      }
    }
  }, [arc, editForm, t]);

  const handleDeleteArc = useCallback(async () => {
    if (!arc) return;
    try {
      await deletePlotArc(arc.id);
      toast.success(t("toast.arc_deleted"));
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId: dashboardId },
      });
    } catch (error) {
      console.error("Failed to delete plot arc:", error);
      toast.error(t("toast.delete_failed"));
    }
  }, [arc, navigate, dashboardId, t]);

  const handleDeleteEvent = useCallback(async () => {
    if (eventToDelete && arc) {
      const updatedEvents = arc.events.filter((e) => e.id !== eventToDelete);
      const completedCount = updatedEvents.filter((e) => e.completed).length;
      const progress =
        updatedEvents.length > 0
          ? (completedCount / updatedEvents.length) * 100
          : 0;

      try {
        await updatePlotArc(arc.id, { events: updatedEvents, progress });
        setArc((prev) => {
          if (!prev) return prev;
          return { ...prev, events: updatedEvents, progress };
        });
        setEventToDelete(null);
        setShowDeleteEventDialog(false);
        toast.success(t("toast.event_deleted"));
      } catch (error) {
        console.error("Failed to delete event:", error);
        toast.error(t("toast.delete_failed"));
      }
    }
  }, [eventToDelete, arc, t]);

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
          <h2 className="text-2xl font-bold mb-2">
            {t("detail.arc_not_found")}
          </h2>
          <button onClick={handleBack} className="btn btn-primary">
            {t("button.back")}
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
      onReorderEvents={handleReorderEvents}
      onAddEvent={handleAddEvent}
      getSizeColor={getSizeColor}
      getStatusColor={getStatusColor}
    />
  );
}
