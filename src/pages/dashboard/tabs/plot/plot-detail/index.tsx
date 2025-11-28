import { useState, useEffect, useCallback, useMemo } from "react";

import { useParams, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import {
  getPlotArcsByBookId,
  getPlotArcById,
  updatePlotArc,
  deletePlotArc,
} from "@/lib/db/plot.service";
import { getRegionsByBookId } from "@/lib/db/regions.service";
import type { IPlotArc, IPlotEvent } from "@/types/plot-types";

import { PlotArcDetailView } from "./view";

export function PlotArcDetail() {
  const { t } = useTranslation(["plot", "create-plot-arc"]);
  const { plotId, dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/plot/$plotId",
  });
  const router = useRouter();

  // Data state
  const [arc, setArc] = useState<IPlotArc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [factions, setFactions] = useState<
    Array<{ id: string; name: string; emblem?: string }>
  >([]);
  const [items, setItems] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [regions, setRegions] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [hasCurrentArc, setHasCurrentArc] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<IPlotArc>>({});
  const [originalData, setOriginalData] = useState<IPlotArc | null>(null);

  // Dialog state
  const [showDeleteArcDialog, setShowDeleteArcDialog] = useState(false);
  const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Section state
  const [eventChainSectionOpen, setEventChainSectionOpen] = useState(true);
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);

  // Field visibility state
  const [fieldVisibility, setFieldVisibility] = useState<
    Record<string, boolean>
  >({});
  const [originalFieldVisibility, setOriginalFieldVisibility] = useState<
    Record<string, boolean>
  >({});

  // Validation state
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    if (!originalData || !isEditing) return false;
    const formChanged =
      JSON.stringify(editForm) !== JSON.stringify(originalData);
    const visibilityChanged =
      JSON.stringify(fieldVisibility) !==
      JSON.stringify(originalFieldVisibility);
    return formChanged || visibilityChanged;
  }, [
    editForm,
    originalData,
    isEditing,
    fieldVisibility,
    originalFieldVisibility,
  ]);

  // Check required fields
  const requiredFields = ["name", "focus", "description", "size", "status"];
  const missingFields = useMemo(() => {
    if (!isEditing) return [];
    return requiredFields.filter((field) => {
      const value = editForm[field as keyof IPlotArc];
      return !value || (typeof value === "string" && !value.trim());
    });
  }, [editForm, isEditing]);

  const hasRequiredFieldsEmpty = missingFields.length > 0;

  // Load data
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const [
          loadedArc,
          loadedCharacters,
          loadedFactions,
          loadedItems,
          loadedRegions,
          allArcs,
        ] = await Promise.all([
          getPlotArcById(plotId),
          getCharactersByBookId(dashboardId),
          getFactionsByBookId(dashboardId),
          getItemsByBookId(dashboardId),
          getRegionsByBookId(dashboardId),
          getPlotArcsByBookId(dashboardId),
        ]);

        if (mounted) {
          if (loadedArc) {
            setArc(loadedArc);
            setEditForm(loadedArc);
            setOriginalData(loadedArc);
            setFieldVisibility(loadedArc.fieldVisibility || {});
            setOriginalFieldVisibility(loadedArc.fieldVisibility || {});
          }
          setCharacters(
            loadedCharacters.map((c) => ({
              id: c.id,
              name: c.name,
              image: c.image,
            }))
          );
          setFactions(
            loadedFactions.map((f) => ({
              id: f.id,
              name: f.name,
              emblem: f.image,
            }))
          );
          setItems(
            loadedItems.map((i) => ({
              id: i.id,
              name: i.name,
              image: i.image,
            }))
          );
          setRegions(
            loadedRegions.map((r) => ({
              id: r.id,
              name: r.name,
              image: r.image,
            }))
          );
          // Check if there's another arc with "atual" status (excluding current arc)
          const hasOtherCurrentArc = allArcs.some(
            (a) => a.status === "atual" && a.id !== plotId
          );
          setHasCurrentArc(hasOtherCurrentArc);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to load plot arc data:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [plotId, dashboardId]);

  // Navigation handlers
  const handleBack = useCallback(() => {
    router.history.back();
  }, [router]);

  // Edit mode handlers
  const handleEdit = useCallback(() => {
    if (arc) {
      setEditForm({ ...arc });
      setOriginalData({ ...arc });
    }
    setIsEditing(true);
  }, [arc]);

  const handleCancel = useCallback(() => {
    if (!arc) return;

    // If there are unsaved changes, show confirmation dialog
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditForm({ ...arc });
    setFieldVisibility(originalFieldVisibility);
    setValidationErrors({});
    setIsEditing(false);
  }, [arc, hasChanges, originalFieldVisibility]);

  const handleConfirmCancel = useCallback(() => {
    if (!arc) return;
    setEditForm({ ...arc });
    setFieldVisibility(originalFieldVisibility);
    setValidationErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [arc, originalFieldVisibility]);

  const handleUnsavedChangesDialogChange = useCallback((open: boolean) => {
    setShowUnsavedChangesDialog(open);
  }, []);

  // Field change handler with validation
  const handleEditFormChange = useCallback(
    <K extends keyof IPlotArc>(field: K, value: IPlotArc[K]) => {
      setEditForm((prev) => ({ ...prev, [field]: value }));
      // Clear validation error for this field
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    },
    []
  );

  // Field validation
  const validateField = useCallback(
    (field: string, value: unknown) => {
      if (requiredFields.includes(field)) {
        if (!value || (typeof value === "string" && !value.trim())) {
          setValidationErrors((prev) => ({
            ...prev,
            [field]: t("plot:validation.required_field"),
          }));
          return false;
        }
      }
      return true;
    },
    [t]
  );

  // Event handlers
  const handleReorderEvents = useCallback(
    async (events: IPlotEvent[]) => {
      if (!arc) return;
      try {
        await updatePlotArc(arc.id, { events });
        setArc((prev) => {
          if (!prev) return prev;
          return { ...prev, events };
        });
        // Also update editForm if in editing mode
        if (isEditing) {
          setEditForm((prev) => ({ ...prev, events }));
        }
      } catch (error) {
        console.error("Failed to reorder events:", error);
      }
    },
    [arc, isEditing]
  );

  const handleAddEvent = useCallback(
    async (eventData: Omit<IPlotEvent, "id" | "order">) => {
      if (!arc) return;
      const currentEvents = isEditing ? editForm.events || [] : arc.events;
      const newEvent = {
        ...eventData,
        id: crypto.randomUUID(),
        order: currentEvents.length + 1,
      };
      const updatedEvents = [...currentEvents, newEvent];
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
        if (isEditing) {
          setEditForm((prev) => ({ ...prev, events: updatedEvents, progress }));
        }
      } catch (error) {
        console.error("Failed to add event:", error);
      }
    },
    [arc, editForm.events, isEditing]
  );

  const handleToggleEventCompletion = useCallback(
    async (eventId: string) => {
      if (!arc) return;
      const currentEvents = isEditing
        ? editForm.events || arc.events
        : arc.events;
      const updatedEvents = currentEvents.map((event) =>
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
        if (isEditing) {
          setEditForm((prev) => ({ ...prev, events: updatedEvents, progress }));
        }
      } catch (error) {
        console.error("Failed to toggle event completion:", error);
      }
    },
    [arc, editForm.events, isEditing]
  );

  // Save handler
  const handleSave = useCallback(async () => {
    if (!arc) return;

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!editForm.name?.trim())
      errors.name = t("plot:validation.required_field");
    if (!editForm.focus?.trim())
      errors.focus = t("plot:validation.required_field");
    if (!editForm.description?.trim())
      errors.description = t("plot:validation.required_field");
    if (!editForm.size) errors.size = t("plot:validation.select_size");
    if (!editForm.status) errors.status = t("plot:validation.select_status");

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error(t("plot:validation.fill_required_fields"));
      return;
    }

    try {
      const updatedData = { ...editForm, fieldVisibility };
      await updatePlotArc(arc.id, updatedData);
      setArc({ ...arc, ...updatedData } as IPlotArc);
      setOriginalData({ ...arc, ...updatedData } as IPlotArc);
      setOriginalFieldVisibility(fieldVisibility);
      setValidationErrors({});
      setIsEditing(false);
      toast.success(t("plot:toast.arc_updated"));
    } catch (error) {
      console.error("Failed to update plot arc:", error);
      toast.error(t("plot:toast.update_failed"));
    }
  }, [arc, editForm, fieldVisibility, t]);

  // Delete handlers
  const handleDeleteArc = useCallback(async () => {
    if (!arc) return;
    try {
      await deletePlotArc(arc.id);
      toast.success(t("plot:toast.arc_deleted"));
      router.history.back();
    } catch (error) {
      console.error("Failed to delete plot arc:", error);
      toast.error(t("plot:toast.delete_failed"));
    }
  }, [arc, router, t]);

  const handleDeleteEvent = useCallback(async () => {
    if (eventToDelete && arc) {
      const currentEvents = isEditing
        ? editForm.events || arc.events
        : arc.events;
      const updatedEvents = currentEvents.filter((e) => e.id !== eventToDelete);
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
        if (isEditing) {
          setEditForm((prev) => ({ ...prev, events: updatedEvents, progress }));
        }
        setEventToDelete(null);
        setShowDeleteEventDialog(false);
        toast.success(t("plot:toast.event_deleted"));
      } catch (error) {
        console.error("Failed to delete event:", error);
        toast.error(t("plot:toast.delete_failed"));
      }
    }
  }, [eventToDelete, arc, editForm.events, isEditing, t]);

  const handleEventDeleteRequest = useCallback((eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteEventDialog(true);
  }, []);

  // Dialog handlers
  const handleDeleteArcDialogChange = useCallback((open: boolean) => {
    setShowDeleteArcDialog(open);
  }, []);

  const handleDeleteEventDialogChange = useCallback((open: boolean) => {
    setShowDeleteEventDialog(open);
    if (!open) {
      setEventToDelete(null);
    }
  }, []);

  // Section toggle handlers
  const handleEventChainSectionToggle = useCallback(() => {
    setEventChainSectionOpen((prev) => !prev);
  }, []);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => !prev);
  }, []);

  // Field visibility toggle handler
  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === false ? true : false,
    }));
  }, []);

  // Show nothing while loading to avoid flash
  if (isLoading) {
    return null;
  }

  if (!arc) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {t("plot:detail.arc_not_found")}
          </h2>
          <button onClick={handleBack} className="btn btn-primary">
            {t("plot:button.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <PlotArcDetailView
      arc={arc}
      characters={characters}
      factions={factions}
      items={items}
      regions={regions}
      isEditing={isEditing}
      editForm={editForm}
      showDeleteArcDialog={showDeleteArcDialog}
      showDeleteEventDialog={showDeleteEventDialog}
      showUnsavedChangesDialog={showUnsavedChangesDialog}
      eventChainSectionOpen={eventChainSectionOpen}
      advancedSectionOpen={advancedSectionOpen}
      validationErrors={validationErrors}
      hasChanges={hasChanges}
      hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
      missingFields={missingFields}
      hasCurrentArc={hasCurrentArc}
      bookId={dashboardId}
      onBack={handleBack}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onConfirmCancel={handleConfirmCancel}
      onDeleteArc={handleDeleteArc}
      onDeleteEvent={handleDeleteEvent}
      onDeleteArcDialogChange={handleDeleteArcDialogChange}
      onDeleteEventDialogChange={handleDeleteEventDialogChange}
      onUnsavedChangesDialogChange={handleUnsavedChangesDialogChange}
      onEditFormChange={handleEditFormChange}
      validateField={validateField}
      onToggleEventCompletion={handleToggleEventCompletion}
      onEventDeleteRequest={handleEventDeleteRequest}
      onReorderEvents={handleReorderEvents}
      onAddEvent={handleAddEvent}
      onEventChainSectionToggle={handleEventChainSectionToggle}
      onAdvancedSectionToggle={handleAdvancedSectionToggle}
      fieldVisibility={fieldVisibility}
      onFieldVisibilityToggle={handleFieldVisibilityToggle}
    />
  );
}
