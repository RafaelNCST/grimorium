import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  getRaceById,
  getRacesByBookId,
  getRaceRelationships,
  saveRaceRelationships,
  getRaceVersions,
  createRaceVersion,
  deleteRaceVersion,
  updateRaceVersion,
} from "@/lib/db/races.service";
import { getRaceGroupsByBookId } from "@/lib/db/race-groups.service";
import { useRacesStore } from "@/stores/races-store";
import type { IRace, IRaceGroup } from "../types/race-types";
import type { IRaceRelationship, IRaceVersion, IFieldVisibility } from "./types/race-detail-types";

import { RaceDetailView } from "./view";

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
  const [versions, setVersions] = useState<IRaceVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<IRaceVersion | null>(null);
  const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);
  const [allRaces, setAllRaces] = useState<IRace[]>([]);
  const [raceGroups, setRaceGroups] = useState<IRaceGroup[]>([]);
  const [relationships, setRelationships] = useState<IRaceRelationship[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

          // Load versions
          const versionsFromDB = await getRaceVersions(raceId);
          if (versionsFromDB.length === 0) {
            const mainVersion: IRaceVersion = {
              id: `main-version-${raceId}`,
              name: "Versão Principal",
              description: "Versão principal da raça",
              createdAt: new Date().toISOString(),
              isMain: true,
              raceData: raceFromDB,
            };
            await createRaceVersion(raceId, mainVersion);
            setVersions([mainVersion]);
            setCurrentVersion(mainVersion);
          } else {
            const updatedVersions = versionsFromDB.map((v) =>
              v.isMain
                ? {
                    ...v,
                    raceData: raceFromDB,
                  }
                : v
            );
            setVersions(updatedVersions);
            const mainVersion = updatedVersions.find((v) => v.isMain);
            if (mainVersion) {
              setCurrentVersion(mainVersion);
            }
          }

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

      // Update main version
      const mainVersion = versions.find((v) => v.isMain);
      if (mainVersion) {
        const updatedMainVersion: IRaceVersion = {
          ...mainVersion,
          raceData: updatedRace,
        };
        await updateRaceVersion(raceId, mainVersion.id, mainVersion.name, mainVersion.description);

        const updatedVersions = versions.map((v) =>
          v.id === mainVersion.id ? updatedMainVersion : v
        );
        setVersions(updatedVersions);
        setCurrentVersion(updatedMainVersion);
      }

      setRace(updatedRace);
      setIsEditing(false);
      toast.success("Raça salva com sucesso!");
    } catch (error) {
      console.error("Error saving race:", error);
      toast.error("Erro ao salvar raça");
    }
  }, [editData, fieldVisibility, relationships, raceId, updateRaceInCache, versions]);

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

  const handleVersionChange = useCallback(
    async (versionId: string | null) => {
      if (!versionId) {
        // Restore main version
        const mainVersion = versions.find((v) => v.isMain);
        if (mainVersion && mainVersion.raceData) {
          setCurrentVersion(mainVersion);
          setRace(mainVersion.raceData);
          setEditData(mainVersion.raceData);
          setImagePreview(mainVersion.raceData?.image || "");
          // Reload relationships from database
          const rels = await getRaceRelationships(raceId);
          setRelationships(rels);
        }
        return;
      }

      const version = versions.find((v) => v.id === versionId);
      if (version && version.raceData) {
        setCurrentVersion(version);
        setRace(version.raceData);
        setEditData(version.raceData);
        setImagePreview(version.raceData?.image || "");
        // For non-main versions, keep current relationships or reload from DB
        const rels = await getRaceRelationships(raceId);
        setRelationships(rels);
      }
    },
    [versions, raceId]
  );

  const handleVersionCreate = useCallback(
    async (data: { name: string; description: string; raceData: IRace }) => {
      try {
        const newVersion: IRaceVersion = {
          id: `version-${Date.now()}`,
          name: data.name,
          description: data.description,
          createdAt: new Date().toISOString(),
          isMain: false,
          raceData: race,
        };

        await createRaceVersion(raceId, newVersion);
        setVersions([...versions, newVersion]);
        toast.success("Versão criada com sucesso!");
      } catch (error) {
        console.error("Error creating version:", error);
        toast.error("Erro ao criar versão");
      }
    },
    [race, raceId, versions]
  );

  const handleVersionDelete = useCallback(
    async (versionId: string) => {
      try {
        await deleteRaceVersion(raceId, versionId);
        const updatedVersions = versions.filter((v) => v.id !== versionId);
        setVersions(updatedVersions);

        // If deleted version was current, switch to main
        if (currentVersion?.id === versionId) {
          const mainVersion = updatedVersions.find((v) => v.isMain);
          if (mainVersion) {
            handleVersionChange(mainVersion.id);
          }
        }

        toast.success("Versão excluída com sucesso!");
      } catch (error) {
        console.error("Error deleting version:", error);
        toast.error("Erro ao excluir versão");
      }
    },
    [raceId, versions, currentVersion, handleVersionChange]
  );

  const handleVersionUpdate = useCallback(
    async (versionId: string, name: string, description?: string) => {
      try {
        await updateRaceVersion(raceId, versionId, name, description);
        const updatedVersions = versions.map((v) =>
          v.id === versionId
            ? { ...v, name, description: description || v.description }
            : v
        );
        setVersions(updatedVersions);

        if (currentVersion?.id === versionId) {
          setCurrentVersion({
            ...currentVersion,
            name,
            description: description || currentVersion.description,
          });
        }

        toast.success("Versão atualizada com sucesso!");
      } catch (error) {
        console.error("Error updating version:", error);
        toast.error("Erro ao atualizar versão");
      }
    },
    [raceId, versions, currentVersion]
  );

  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === false ? true : false,
    }));
  }, []);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => !prev);
  }, []);

  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImagePreview(base64String);
          setEditData((prev) => ({ ...prev, image: base64String }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

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
      versions={versions}
      currentVersion={currentVersion}
      showDeleteModal={showDeleteModal}
      isNavigationSidebarOpen={isNavigationSidebarOpen}
      imagePreview={imagePreview}
      fileInputRef={fileInputRef}
      allRaces={allRaces}
      raceGroups={raceGroups}
      fieldVisibility={fieldVisibility}
      advancedSectionOpen={advancedSectionOpen}
      relationships={relationships}
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
      onVersionChange={handleVersionChange}
      onVersionCreate={handleVersionCreate}
      onVersionDelete={handleVersionDelete}
      onVersionUpdate={handleVersionUpdate}
      onImageFileChange={handleImageFileChange}
      onEditDataChange={handleEditDataChange}
      onFieldVisibilityToggle={handleFieldVisibilityToggle}
      onAdvancedSectionToggle={handleAdvancedSectionToggle}
      onRelationshipsChange={handleRelationshipsChange}
    />
  );
}
