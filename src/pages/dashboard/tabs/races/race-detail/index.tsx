import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { EntityLogsModal } from "@/components/modals/entity-logs-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  getRaceById,
  getRacesByBookId,
  getRaceRelationships,
  saveRaceRelationships,
} from "@/lib/db/races.service";
import { useRacesStore } from "@/stores/races-store";

import { UnsavedChangesDialog } from "./components/unsaved-changes-dialog";
import { RaceDetailView } from "./view";

import type { IRace } from "../types/race-types";
import type {
  IRaceRelationship,
  IFieldVisibility,
} from "./types/race-detail-types";

export function RaceDetail() {
  const { raceId, dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/race/$raceId",
  });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { updateRaceInCache, deleteRaceFromCache } = useRacesStore();

  const emptyRace: IRace = {
    id: "",
    name: "",
    domain: [],
    summary: "",
    speciesId: "",
    image: undefined,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [race, setRace] = useState<IRace>(emptyRace);
  const [editData, setEditData] = useState<IRace>(emptyRace);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
  const [sectionVisibility, setSectionVisibility] = useState<
    Record<string, boolean>
  >({});
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(() => {
    const stored = localStorage.getItem("raceDetailAdvancedSectionOpen");
    return stored ? JSON.parse(stored) : false;
  });
  const [allRaces, setAllRaces] = useState<IRace[]>([]);
  const [relationships, setRelationships] = useState<IRaceRelationship[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Chapter metrics state
  const [hasChapterMetrics, setHasChapterMetrics] = useState<boolean | null>(
    null
  );

  // Entity logs state
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  // Original states for comparison
  const [originalFieldVisibility, setOriginalFieldVisibility] =
    useState<IFieldVisibility>({});
  const [originalSectionVisibility, setOriginalSectionVisibility] = useState<
    Record<string, boolean>
  >({});
  const [originalRelationships, setOriginalRelationships] = useState<
    IRaceRelationship[]
  >([]);

  // Ref to keep sectionVisibility always up-to-date (fixes async setState issue)
  const sectionVisibilityRef =
    useRef<Record<string, boolean>>(sectionVisibility);

  // Keep ref in sync with state
  useEffect(() => {
    sectionVisibilityRef.current = sectionVisibility;
  }, [sectionVisibility]);

  useEffect(() => {
    const loadRace = async () => {
      try {
        setIsLoading(true);
        const raceFromDB = await getRaceById(raceId);
        if (raceFromDB) {
          setRace(raceFromDB);
          setEditData(raceFromDB);
          setImagePreview(raceFromDB.image || "");
          setFieldVisibility(raceFromDB.fieldVisibility || {});
          setOriginalFieldVisibility(raceFromDB.fieldVisibility || {});

          const loadedSectionVisibility = raceFromDB.sectionVisibility || {};
          setSectionVisibility(loadedSectionVisibility);
          setOriginalSectionVisibility(loadedSectionVisibility);
          sectionVisibilityRef.current = loadedSectionVisibility;

          // Load relationships
          const rels = await getRaceRelationships(raceId);
          setRelationships(rels);
          setOriginalRelationships(rels);

          // Load all races from the same book
          if (dashboardId) {
            const allRacesFromBook = await getRacesByBookId(dashboardId);
            setAllRaces(allRacesFromBook);
          }
        }
      } catch (error) {
        console.error("Error loading race:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRace();
  }, [raceId, dashboardId]);

  // Check if there are changes between race and editData
  const hasChanges = useMemo(() => {
    if (!isEditing) return false;

    // Helper function to compare field visibility
    // Treats undefined and true as equivalent (both = visible)
    const visibilityChanged = (
      current: IFieldVisibility,
      original: IFieldVisibility
    ): boolean => {
      const allFields = new Set([
        ...Object.keys(current),
        ...Object.keys(original),
      ]);

      for (const field of allFields) {
        const currentValue = current[field] !== false; // undefined or true = visible
        const originalValue = original[field] !== false; // undefined or true = visible
        if (currentValue !== originalValue) return true;
      }

      return false;
    };

    // Helper function to compare section visibility
    const sectionVisibilityChanged = (
      current: Record<string, boolean>,
      original: Record<string, boolean>
    ): boolean => {
      const allSections = new Set([
        ...Object.keys(current),
        ...Object.keys(original),
      ]);

      for (const section of allSections) {
        const currentValue = current[section] !== false; // undefined or true = visible
        const originalValue = original[section] !== false; // undefined or true = visible
        if (currentValue !== originalValue) return true;
      }

      return false;
    };

    // Check if visibility has changed
    if (visibilityChanged(fieldVisibility, originalFieldVisibility))
      return true;

    // Check if section visibility has changed
    if (sectionVisibilityChanged(sectionVisibility, originalSectionVisibility))
      return true;

    // Helper function to compare arrays (order-independent for IDs, order-dependent for strings)
    const arraysEqual = (
      a: unknown[] | undefined,
      b: unknown[] | undefined
    ): boolean => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;

      // For string arrays, order matters
      if (a.length > 0 && typeof a[0] === "string") {
        return a.every((item, index) => item === b[index]);
      }

      // For ID arrays, order doesn't matter
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((item, index) => item === sortedB[index]);
    };

    // Compare basic fields
    if (race.name !== editData.name) return true;
    if (race.scientificName !== editData.scientificName) return true;
    if (!arraysEqual(race.domain, editData.domain)) return true;
    if (race.summary !== editData.summary) return true;
    if (race.image !== editData.image) return true;

    // Compare culture fields
    if (!arraysEqual(race.alternativeNames, editData.alternativeNames))
      return true;
    if (race.culturalNotes !== editData.culturalNotes) return true;

    // Compare appearance fields
    if (race.generalAppearance !== editData.generalAppearance) return true;
    if (race.lifeExpectancy !== editData.lifeExpectancy) return true;
    if (race.averageHeight !== editData.averageHeight) return true;
    if (race.averageWeight !== editData.averageWeight) return true;
    if (
      race.specialPhysicalCharacteristics !==
      editData.specialPhysicalCharacteristics
    )
      return true;

    // Compare behavior fields
    if (race.habits !== editData.habits) return true;
    if (race.reproductiveCycle !== editData.reproductiveCycle) return true;
    if (race.otherCycleDescription !== editData.otherCycleDescription)
      return true;
    if (race.diet !== editData.diet) return true;
    if (race.elementalDiet !== editData.elementalDiet) return true;
    if (!arraysEqual(race.communication, editData.communication)) return true;
    if (race.otherCommunication !== editData.otherCommunication) return true;
    if (race.moralTendency !== editData.moralTendency) return true;
    if (race.socialOrganization !== editData.socialOrganization) return true;
    if (!arraysEqual(race.habitat, editData.habitat)) return true;

    // Compare power fields
    if (race.physicalCapacity !== editData.physicalCapacity) return true;
    if (race.specialCharacteristics !== editData.specialCharacteristics)
      return true;
    if (race.weaknesses !== editData.weaknesses) return true;

    // Compare narrative fields
    if (race.storyMotivation !== editData.storyMotivation) return true;
    if (race.inspirations !== editData.inspirations) return true;

    // Compare relationships
    if (JSON.stringify(relationships) !== JSON.stringify(originalRelationships))
      return true;

    return false;
  }, [
    race,
    editData,
    isEditing,
    fieldVisibility,
    originalFieldVisibility,
    sectionVisibility,
    originalSectionVisibility,
    relationships,
    originalRelationships,
  ]);

  const handleSave = useCallback(async () => {
    // Don't save if there are no changes
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      // Use ref to get the most recent sectionVisibility (setState is async)
      const currentSectionVisibility = sectionVisibilityRef.current;

      const updatedRace: IRace = {
        ...editData,
        fieldVisibility,
        sectionVisibility: currentSectionVisibility,
      };

      // Update race and save relationships
      await updateRaceInCache(raceId, updatedRace);
      await saveRaceRelationships(raceId, relationships);

      setRace(updatedRace);
      setImagePreview(updatedRace.image || "");
      setOriginalFieldVisibility(fieldVisibility);
      setOriginalSectionVisibility(currentSectionVisibility);
      setOriginalRelationships(relationships);
      setErrors({});
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving race:", error);
    }
  }, [
    editData,
    fieldVisibility,
    relationships,
    raceId,
    updateRaceInCache,
    hasChanges,
  ]);

  const handleEdit = useCallback(() => {
    setEditData(race);
    setIsEditing(true);
    // Capture current visibility states when entering edit mode
    setOriginalFieldVisibility(fieldVisibility);
    setOriginalSectionVisibility(sectionVisibility);
    setOriginalRelationships(relationships);
  }, [race, fieldVisibility, sectionVisibility, relationships]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditData(race);
    setImagePreview(race?.image || "");
    setFieldVisibility(originalFieldVisibility);
    setSectionVisibility(originalSectionVisibility);
    setRelationships(originalRelationships);
    setErrors({});
    setIsEditing(false);
  }, [
    race,
    hasChanges,
    originalFieldVisibility,
    originalSectionVisibility,
    originalRelationships,
  ]);

  const handleConfirmCancel = useCallback(() => {
    setEditData(race);
    setImagePreview(race?.image || "");
    setFieldVisibility(originalFieldVisibility);
    setSectionVisibility(originalSectionVisibility);
    setRelationships(originalRelationships);
    setErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [
    race,
    originalFieldVisibility,
    originalSectionVisibility,
    originalRelationships,
  ]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteRaceFromCache(dashboardId, raceId);
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId },
      });
    } catch (error) {
      console.error("Error deleting race:", error);
    }
  }, [raceId, dashboardId, deleteRaceFromCache, navigate]);

  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === false ? true : false,
    }));
  }, []);

  const handleSectionVisibilityToggle = useCallback((sectionName: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName] === false ? true : false,
    }));
  }, []);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => {
      const newValue = !prev;
      localStorage.setItem(
        "raceDetailAdvancedSectionOpen",
        JSON.stringify(newValue)
      );
      return newValue;
    });
  }, []);

  const toggleSection = useCallback((sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  }, []);

  const handleNavigateToRace = useCallback(
    (newRaceId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/race/$raceId",
        params: { dashboardId, raceId: newRaceId },
      });
    },
    [navigate, dashboardId]
  );

  const handleBack = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleNavigationSidebarToggle = useCallback(() => {
    setIsNavigationSidebarOpen((prev) => !prev);
  }, []);

  const handleNavigationSidebarClose = useCallback(() => {
    setIsNavigationSidebarOpen(false);
  }, []);

  const handleRelationshipsChange = useCallback(
    (newRelationships: IRaceRelationship[]) => {
      setRelationships(newRelationships);
    },
    []
  );

  const handleEditDataChange = useCallback((field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));

    // Update image preview when image field changes
    if (field === "image") {
      setImagePreview(value as string);
    }
  }, []);

  const validateField = useCallback(
    (field: string, value: any) => {
      const requiredFields = ["name", "domain", "summary"];

      if (requiredFields.includes(field)) {
        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && !value.trim())
        ) {
          setErrors((prev) => ({
            ...prev,
            [field]: t(`race-detail:validation.${field}_required`),
          }));
          return false;
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
          return true;
        }
      }
      return true;
    },
    [t]
  );

  // Computed values
  const missingFields = [];
  if (!editData.name?.trim()) missingFields.push("name");
  if (!editData.domain || editData.domain.length === 0)
    missingFields.push("domain");
  if (!editData.summary?.trim()) missingFields.push("summary");

  const hasRequiredFieldsEmpty = missingFields.length > 0;

  // Don't render until race is loaded
  if (isLoading || !race.id || race.id === "" || !race.name) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <>
      <UnsavedChangesDialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
        onConfirm={handleConfirmCancel}
      />

      <EntityLogsModal
        open={isLogsModalOpen}
        onOpenChange={setIsLogsModalOpen}
        entityId={raceId}
        entityType="race"
        bookId={dashboardId}
      />

      <RaceDetailView
        race={race}
        editData={editData}
        isEditing={isEditing}
        hasChanges={hasChanges}
        showDeleteModal={showDeleteModal}
        isNavigationSidebarOpen={isNavigationSidebarOpen}
        imagePreview={imagePreview}
        allRaces={allRaces}
        fieldVisibility={fieldVisibility}
        sectionVisibility={sectionVisibility}
        advancedSectionOpen={advancedSectionOpen}
        relationships={relationships}
        errors={errors}
        hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
        missingFields={missingFields}
        bookId={dashboardId}
        onBack={handleBack}
        onNavigationSidebarToggle={handleNavigationSidebarToggle}
        onNavigationSidebarClose={handleNavigationSidebarClose}
        onRaceSelect={handleNavigateToRace}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDeleteModalOpen={() => setShowDeleteModal(true)}
        onDeleteModalClose={() => setShowDeleteModal(false)}
        onConfirmDelete={handleConfirmDelete}
        onEditDataChange={handleEditDataChange}
        onFieldVisibilityToggle={handleFieldVisibilityToggle}
        onSectionVisibilityToggle={handleSectionVisibilityToggle}
        onAdvancedSectionToggle={handleAdvancedSectionToggle}
        onRelationshipsChange={handleRelationshipsChange}
        validateField={validateField}
        openSections={openSections}
        toggleSection={toggleSection}
        hasChapterMetrics={hasChapterMetrics}
        setHasChapterMetrics={setHasChapterMetrics}
        isLogsModalOpen={isLogsModalOpen}
        onLogsModalToggle={() => setIsLogsModalOpen(!isLogsModalOpen)}
      />
    </>
  );
}
