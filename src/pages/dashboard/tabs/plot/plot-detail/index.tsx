import { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { useParams, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { getPlotArcsByBookId, getPlotArcById } from "@/lib/db/plot.service";
import { getRegionsByBookId } from "@/lib/db/regions.service";
import { canFinishArc } from "@/lib/utils/arc-validation";
import { usePlotStore } from "@/stores/plot-store";
import { useEntityUIStateStore } from "@/stores/entity-ui-state-store";
import type { IPlotArc, IPlotEvent } from "@/types/plot-types";

import { PlotArcDetailView } from "./view";

export function PlotArcDetail() {
  const { t } = useTranslation(["plot", "create-plot-arc"]);
  const { plotId, dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/plot/$plotId",
  });
  const router = useRouter();

  // Store actions
  const updatePlotArcInCache = usePlotStore(
    (state) => state.updatePlotArcInCache
  );
  const deletePlotArcFromCache = usePlotStore(
    (state) => state.deletePlotArcFromCache
  );

  // Entity UI State store
  const getUIState = useEntityUIStateStore((state) => state.getUIState);
  const setUIStateInStore = useEntityUIStateStore((state) => state.setUIState);

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
  const [showFinishWarningDialog, setShowFinishWarningDialog] = useState(false);
  const [finishWarningReason, setFinishWarningReason] = useState<{
    hasNoEvents: boolean;
    hasNoCompletedEvents: boolean;
  }>({ hasNoEvents: false, hasNoCompletedEvents: false });
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
  const [originalAdvancedSectionOpen, setOriginalAdvancedSectionOpen] = useState(false);
  const [originalEventChainSectionOpen, setOriginalEventChainSectionOpen] = useState(true);
  const [extraSectionsOpenState, setExtraSectionsOpenState] = useState<
    Record<string, boolean>
  >({});
  const [originalExtraSectionsOpenState, setOriginalExtraSectionsOpenState] = useState<
    Record<string, boolean>
  >({});

  // Refs to always have current values (avoid stale closures)
  const advancedSectionOpenRef = useRef(advancedSectionOpen);
  const eventChainSectionOpenRef = useRef(eventChainSectionOpen);
  const extraSectionsOpenStateRef = useRef(extraSectionsOpenState);

  // Keep refs in sync with state
  useEffect(() => {
    advancedSectionOpenRef.current = advancedSectionOpen;
  }, [advancedSectionOpen]);

  useEffect(() => {
    eventChainSectionOpenRef.current = eventChainSectionOpen;
  }, [eventChainSectionOpen]);

  useEffect(() => {
    extraSectionsOpenStateRef.current = extraSectionsOpenState;
  }, [extraSectionsOpenState]);

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
    const advancedSectionChanged = advancedSectionOpen !== originalAdvancedSectionOpen;
    const eventChainSectionChanged = eventChainSectionOpen !== originalEventChainSectionOpen;
    return formChanged || visibilityChanged || advancedSectionChanged || eventChainSectionChanged;
  }, [
    editForm,
    originalData,
    isEditing,
    fieldVisibility,
    originalFieldVisibility,
    advancedSectionOpen,
    originalAdvancedSectionOpen,
    eventChainSectionOpen,
    originalEventChainSectionOpen,
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

    // CRITICAL: Reset ALL UI states immediately when plotId changes
    // (component is not unmounted when navigating between plots)
    setAdvancedSectionOpen(false);
    setEventChainSectionOpen(true);
    setOriginalAdvancedSectionOpen(false);
    setOriginalEventChainSectionOpen(true);
    setExtraSectionsOpenState({});
    setOriginalExtraSectionsOpenState({});
    // Reset refs to prevent stale values
    advancedSectionOpenRef.current = false;
    eventChainSectionOpenRef.current = true;
    extraSectionsOpenStateRef.current = {};

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

            // Priority 1: Check in-memory cache
            let cachedUIState = getUIState("plotArcs", plotId);

            // Priority 2: Load from database if not in cache
            if (!cachedUIState && loadedArc.uiState) {
              cachedUIState = loadedArc.uiState;
              // Save to cache for future use
              setUIStateInStore("plotArcs", plotId, cachedUIState);
            }

            // Priority 3: Use defaults if no cache and no database value
            if (!cachedUIState) {
              // Create NEW object references for each entity (prevent sharing)
              cachedUIState = {
                advancedSectionOpen: false,
                eventChainSectionOpen: true,
                extraSectionsOpenState: {},
              };
              // Save defaults to cache
              setUIStateInStore("plotArcs", plotId, cachedUIState);
            }

            // Apply UI state to local state (deep copy to avoid reference sharing)
            const loadedAdvancedSectionOpen =
              cachedUIState.advancedSectionOpen ?? false;
            const loadedEventChainSectionOpen =
              cachedUIState.eventChainSectionOpen ?? true;
            const loadedExtraSectionsOpenState =
              cachedUIState.extraSectionsOpenState || {};

            // Create TWO separate deep copies to avoid sharing between current and original states
            const extraSectionsOpenStateCopy = { ...loadedExtraSectionsOpenState };
            const extraSectionsOpenStateOriginalCopy = { ...loadedExtraSectionsOpenState };

            setAdvancedSectionOpen(loadedAdvancedSectionOpen);
            setOriginalAdvancedSectionOpen(loadedAdvancedSectionOpen);
            setEventChainSectionOpen(loadedEventChainSectionOpen);
            setOriginalEventChainSectionOpen(loadedEventChainSectionOpen);
            setExtraSectionsOpenState(extraSectionsOpenStateCopy);
            setOriginalExtraSectionsOpenState(extraSectionsOpenStateOriginalCopy);
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
  }, [plotId, dashboardId, getUIState, setUIStateInStore]);

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
    setOriginalFieldVisibility(fieldVisibility);
    setOriginalAdvancedSectionOpen(advancedSectionOpen);
    setOriginalEventChainSectionOpen(eventChainSectionOpen);
    setOriginalExtraSectionsOpenState(extraSectionsOpenState);
    setIsEditing(true);
  }, [arc, fieldVisibility, advancedSectionOpen, eventChainSectionOpen, extraSectionsOpenState]);

  const handleExtraSectionsOpenStateChange = useCallback((newState: Record<string, boolean>) => {
    const newUiState = {
      advancedSectionOpen: advancedSectionOpenRef.current,
      eventChainSectionOpen: eventChainSectionOpenRef.current,
      extraSectionsOpenState: { ...newState },
    };
    setExtraSectionsOpenState(newState);
    setUIStateInStore("plotArcs", plotId, newUiState);
  }, [plotId, setUIStateInStore]);

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
    setAdvancedSectionOpen(originalAdvancedSectionOpen);
    setEventChainSectionOpen(originalEventChainSectionOpen);
    setExtraSectionsOpenState(originalExtraSectionsOpenState);
    setValidationErrors({});
    setIsEditing(false);
  }, [arc, hasChanges, originalFieldVisibility, originalAdvancedSectionOpen, originalEventChainSectionOpen, originalExtraSectionsOpenState]);

  const handleConfirmCancel = useCallback(() => {
    if (!arc) return;
    setEditForm({ ...arc });
    setFieldVisibility(originalFieldVisibility);
    setAdvancedSectionOpen(originalAdvancedSectionOpen);
    setEventChainSectionOpen(originalEventChainSectionOpen);
    setExtraSectionsOpenState(originalExtraSectionsOpenState);
    setValidationErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [arc, originalFieldVisibility, originalAdvancedSectionOpen, originalEventChainSectionOpen, originalExtraSectionsOpenState]);

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
          // Use specific validation messages for each field
          const validationKey = `plot:validation.${field}_required`;
          setValidationErrors((prev) => ({
            ...prev,
            [field]: t(validationKey),
          }));
          return false;
        }
      }
      // Clear validation error for this field if it passes
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    },
    [t]
  );

  // Event handlers
  const handleReorderEvents = useCallback(
    async (events: IPlotEvent[]) => {
      if (!arc) return;
      try {
        await updatePlotArcInCache(arc.id, { events });
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
    [arc, isEditing, updatePlotArcInCache]
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
        await updatePlotArcInCache(arc.id, { events: updatedEvents, progress });
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
    [arc, editForm.events, isEditing, updatePlotArcInCache]
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
        await updatePlotArcInCache(arc.id, { events: updatedEvents, progress });
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
    [arc, editForm.events, isEditing, updatePlotArcInCache]
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
      return;
    }

    try {
      const updatedData = {
        ...editForm,
        fieldVisibility,
        uiState: {
          advancedSectionOpen,
          eventChainSectionOpen,
          extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
        },
      };
      await updatePlotArcInCache(arc.id, updatedData);
      setArc({ ...arc, ...updatedData } as IPlotArc);
      setOriginalData({ ...arc, ...updatedData } as IPlotArc);
      setOriginalFieldVisibility(fieldVisibility);
      setOriginalAdvancedSectionOpen(advancedSectionOpen);
      setOriginalEventChainSectionOpen(eventChainSectionOpen);
      setOriginalExtraSectionsOpenState(extraSectionsOpenState);
      setValidationErrors({});
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update plot arc:", error);
    }
  }, [arc, editForm, fieldVisibility, t, updatePlotArcInCache]);

  // Delete handlers
  const handleDeleteArc = useCallback(async () => {
    if (!arc) return;
    try {
      await deletePlotArcFromCache(dashboardId, arc.id);
      router.history.back();
    } catch (error) {
      console.error("Failed to delete plot arc:", error);
    }
  }, [arc, dashboardId, deletePlotArcFromCache, router]);

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
        await updatePlotArcInCache(arc.id, { events: updatedEvents, progress });
        setArc((prev) => {
          if (!prev) return prev;
          return { ...prev, events: updatedEvents, progress };
        });
        if (isEditing) {
          setEditForm((prev) => ({ ...prev, events: updatedEvents, progress }));
        }
        setEventToDelete(null);
        setShowDeleteEventDialog(false);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  }, [eventToDelete, arc, editForm.events, isEditing, t, updatePlotArcInCache]);

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
    setEventChainSectionOpen((prev) => {
      const newValue = !prev;

      // Update cache immediately with complete UI state, use refs to avoid stale closures
      setUIStateInStore("plotArcs", plotId, {
        advancedSectionOpen: advancedSectionOpenRef.current,
        eventChainSectionOpen: newValue,
        extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
      });

      return newValue;
    });
  }, [plotId, setUIStateInStore]);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => {
      const newValue = !prev;

      // Update cache immediately with complete UI state, use refs to avoid stale closures
      setUIStateInStore("plotArcs", plotId, {
        advancedSectionOpen: newValue,
        eventChainSectionOpen: eventChainSectionOpenRef.current,
        extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
      });

      return newValue;
    });
  }, [plotId, setUIStateInStore]);

  // Field visibility toggle handler
  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === false ? true : false,
    }));
  }, []);

  // Finish/Activate arc handlers
  const handleFinishOrActivateArc = useCallback(async () => {
    if (!arc) return;

    // If arc is already finished, activate it (set to planning)
    if (arc.status === "finished") {
      try {
        await updatePlotArcInCache(arc.id, { status: "planning" });
        setArc((prev) => {
          if (!prev) return prev;
          return { ...prev, status: "planning" };
        });
      } catch (error) {
        console.error("Failed to activate arc:", error);
      }
      return;
    }

    // If arc is not finished, check if it can be finished
    const validation = canFinishArc(arc);
    if (!validation.canFinish) {
      setFinishWarningReason({
        hasNoEvents: validation.hasNoEvents,
        hasNoCompletedEvents: validation.hasNoCompletedEvents,
      });
      setShowFinishWarningDialog(true);
      return;
    }

    // Arc can be finished
    try {
      await updatePlotArcInCache(arc.id, { status: "finished" });
      setArc((prev) => {
        if (!prev) return prev;
        return { ...prev, status: "finished" };
      });
    } catch (error) {
      console.error("Failed to finish arc:", error);
    }
  }, [arc, updatePlotArcInCache]);

  const handleFinishWarningDialogChange = useCallback((open: boolean) => {
    setShowFinishWarningDialog(open);
  }, []);

  // Show loading spinner while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
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
      showFinishWarningDialog={showFinishWarningDialog}
      finishWarningReason={finishWarningReason}
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
      onFinishWarningDialogChange={handleFinishWarningDialogChange}
      onFinishOrActivateArc={handleFinishOrActivateArc}
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
      extraSectionsOpenState={extraSectionsOpenState}
      onExtraSectionsOpenStateChange={handleExtraSectionsOpenStateChange}
    />
  );
}
