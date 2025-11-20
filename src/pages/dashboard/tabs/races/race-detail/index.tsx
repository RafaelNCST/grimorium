import { useState, useRef, useCallback, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getRaceGroupsByBookId } from "@/lib/db/race-groups.service";
import {
  getRaceById,
  getRacesByBookId,
  getRaceRelationships,
  saveRaceRelationships,
} from "@/lib/db/races.service";
import { useRacesStore } from "@/stores/races-store";

import { RaceDetailView } from "./view";

import type { IRace, IRaceGroup } from "../types/race-types";
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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);
  const [allRaces, setAllRaces] = useState<IRace[]>([]);
  const [raceGroups, setRaceGroups] = useState<IRaceGroup[]>([]);
  const [relationships, setRelationships] = useState<IRaceRelationship[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

          // Load relationships
          const rels = await getRaceRelationships(raceId);
          setRelationships(rels);

          // Load all races from the same book
          if (dashboardId) {
            const allRacesFromBook = await getRacesByBookId(dashboardId);
            setAllRaces(allRacesFromBook);

            const groups = await getRaceGroupsByBookId(dashboardId);
            setRaceGroups(groups);
          }
        }
      } catch (error) {
        console.error("Error loading race:", error);
        toast.error("Erro ao carregar raça");
      } finally {
        setIsLoading(false);
      }
    };

    loadRace();
  }, [raceId, dashboardId]);

  const handleSave = useCallback(async () => {
    try {
      const updatedRace: IRace = {
        ...editData,
        fieldVisibility,
      };

      await updateRaceInCache(raceId, updatedRace);
      await saveRaceRelationships(raceId, relationships);

      setRace(updatedRace);
      setIsEditing(false);
      toast.success("Raça salva com sucesso!");
    } catch (error) {
      console.error("Error saving race:", error);
      toast.error("Erro ao salvar raça");
    }
  }, [
    editData,
    fieldVisibility,
    relationships,
    raceId,
    updateRaceInCache,
  ]);

  const handleEdit = useCallback(() => {
    setEditData(race);
    setIsEditing(true);
  }, [race]);

  const handleCancel = useCallback(() => {
    setEditData(race);
    setImagePreview(race?.image || "");
    setIsEditing(false);
  }, [race]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteRaceFromCache(dashboardId, raceId);
      toast.success("Raça excluída com sucesso!");
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId },
      });
    } catch (error) {
      console.error("Error deleting race:", error);
      toast.error("Erro ao excluir raça");
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
    setAdvancedSectionOpen((prev) => !prev);
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
  }, []);

  const validateField = useCallback((field: string, value: any) => {
    const requiredFields = ['name', 'scientificName', 'domain', 'summary'];

    if (requiredFields.includes(field)) {
      if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value.trim())) {
        setErrors(prev => ({
          ...prev,
          [field]: t('race-detail:validation.required')
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  }, [t]);

  // Computed values
  const hasChanges = JSON.stringify(race) !== JSON.stringify(editData);

  const missingFields = [];
  if (!editData.name?.trim()) missingFields.push('name');
  if (!editData.scientificName?.trim()) missingFields.push('scientificName');
  if (!editData.domain || editData.domain.length === 0) missingFields.push('domain');
  if (!editData.summary?.trim()) missingFields.push('summary');

  const hasRequiredFieldsEmpty = missingFields.length > 0;

  // Don't render until race is loaded
  if (isLoading || !race.id || race.id === "" || !race.name) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Carregando raça...</p>
        </div>
      </div>
    );
  }

  return (
    <RaceDetailView
      race={race}
      editData={editData}
      isEditing={isEditing}
      hasChanges={hasChanges}
      showDeleteModal={showDeleteModal}
      isNavigationSidebarOpen={isNavigationSidebarOpen}
      imagePreview={imagePreview}
      allRaces={allRaces}
      raceGroups={raceGroups}
      fieldVisibility={fieldVisibility}
      sectionVisibility={sectionVisibility}
      advancedSectionOpen={advancedSectionOpen}
      relationships={relationships}
      errors={errors}
      hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
      missingFields={missingFields}
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
    />
  );
}
