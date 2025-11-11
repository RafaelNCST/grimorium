import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Map } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getRegionById,
  getRegionsByBookId,
  updateRegion,
  deleteRegion,
  getRegionVersions,
  createRegionVersion,
  deleteRegionVersion,
  updateRegionVersion,
  type IRegionVersion,
} from "@/lib/db/regions.service";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import {
  type IRegion,
  type IRegionFormData,
  type RegionScale,
} from "@/pages/dashboard/tabs/world/types/region-types";

import { RegionDetailView } from "./view";

export function RegionDetail() {
  const { dashboardId, regionId } = useParams({
    from: "/dashboard/$dashboardId/tabs/world/$regionId/",
  });
  const navigate = useNavigate();
  const { t } = useTranslation("region-detail");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyRegion: IRegion = {
    id: "",
    bookId: dashboardId,
    name: "",
    parentId: null,
    scale: "local" as RegionScale,
    summary: "",
    image: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [region, setRegion] = useState<IRegion>(emptyRegion);
  const [editData, setEditData] = useState<IRegion>(emptyRegion);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [versions, setVersions] = useState<IRegionVersion[]>([
    {
      id: "main-version",
      name: "Versão Principal",
      description: "Versão principal da região",
      createdAt: new Date().toISOString(),
      isMain: true,
      regionData: emptyRegion,
    },
  ]);
  const [currentVersion, setCurrentVersion] = useState<IRegionVersion | null>(
    versions[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [allRegions, setAllRegions] = useState<IRegion[]>([]);
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);

  // Related data for multi-selects
  const [characters, setCharacters] = useState<Array<{ id: string; name: string; image?: string }>>([]);
  const [factions, setFactions] = useState<Array<{ id: string; name: string; image?: string }>>([]);
  const [races, setRaces] = useState<Array<{ id: string; name: string; image?: string }>>([]);
  const [items, setItems] = useState<Array<{ id: string; name: string; image?: string }>>([]);

  // Check if there are changes between region and editData
  const hasChanges = useMemo(() => {
    if (!isEditing) return false;

    // Helper function to compare arrays (order-independent for IDs, order-dependent for strings)
    const arraysEqual = (a: unknown[] | undefined, b: unknown[] | undefined): boolean => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;

      // For string arrays (like mysteries, anomalies), order matters
      if (a.length > 0 && typeof a[0] === 'string') {
        return a.every((item, index) => item === b[index]);
      }

      // For ID arrays, order doesn't matter
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((item, index) => item === sortedB[index]);
    };

    // Helper to parse JSON strings to arrays for comparison
    const parseJsonArray = (value: string | undefined): string[] => {
      if (!value) return [];
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    };

    // Compare basic fields
    if (region.name !== editData.name) return true;
    if (region.parentId !== editData.parentId) return true;
    if (region.scale !== editData.scale) return true;
    if (region.summary !== editData.summary) return true;
    if (region.image !== editData.image) return true;

    // Compare advanced fields - Environment
    if (region.climate !== editData.climate) return true;
    if (region.currentSeason !== editData.currentSeason) return true;
    if (region.customSeasonName !== editData.customSeasonName) return true;
    if (region.generalDescription !== editData.generalDescription) return true;

    const regionAnomalies = parseJsonArray(region.regionAnomalies);
    const editAnomalies = parseJsonArray(editData.regionAnomalies);
    if (!arraysEqual(regionAnomalies, editAnomalies)) return true;

    // Compare advanced fields - Information
    if (!arraysEqual(
      parseJsonArray(region.residentFactions),
      parseJsonArray(editData.residentFactions)
    )) return true;

    if (!arraysEqual(
      parseJsonArray(region.dominantFactions),
      parseJsonArray(editData.dominantFactions)
    )) return true;

    if (!arraysEqual(
      parseJsonArray(region.importantCharacters),
      parseJsonArray(editData.importantCharacters)
    )) return true;

    if (!arraysEqual(
      parseJsonArray(region.racesFound),
      parseJsonArray(editData.racesFound)
    )) return true;

    if (!arraysEqual(
      parseJsonArray(region.itemsFound),
      parseJsonArray(editData.itemsFound)
    )) return true;

    // Compare advanced fields - Narrative
    if (region.narrativePurpose !== editData.narrativePurpose) return true;
    if (region.uniqueCharacteristics !== editData.uniqueCharacteristics) return true;
    if (region.politicalImportance !== editData.politicalImportance) return true;
    if (region.religiousImportance !== editData.religiousImportance) return true;
    if (region.worldPerception !== editData.worldPerception) return true;

    const regionMysteries = parseJsonArray(region.regionMysteries);
    const editMysteries = parseJsonArray(editData.regionMysteries);
    if (!arraysEqual(regionMysteries, editMysteries)) return true;

    const regionInspirations = parseJsonArray(region.inspirations);
    const editInspirations = parseJsonArray(editData.inspirations);
    if (!arraysEqual(regionInspirations, editInspirations)) return true;

    return false;
  }, [region, editData, isEditing]);

  // Load region from database
  useEffect(() => {
    const loadRegion = async () => {
      try {
        const regionFromDB = await getRegionById(regionId);
        if (regionFromDB) {
          setRegion(regionFromDB);
          setEditData(regionFromDB);
          setImagePreview(regionFromDB.image || "");

          // Load versions from database
          const versionsFromDB = await getRegionVersions(regionId);

          // If no versions exist, create main version
          if (versionsFromDB.length === 0) {
            const mainVersion: IRegionVersion = {
              id: `main-version-${regionId}`,
              name: "Versão Principal",
              description: "Versão principal da região",
              createdAt: new Date().toISOString(),
              isMain: true,
              regionData: regionFromDB,
            };

            await createRegionVersion(regionId, mainVersion);
            setVersions([mainVersion]);
            setCurrentVersion(mainVersion);
          } else {
            // Update main version with loaded data
            const updatedVersions = versionsFromDB.map((v) =>
              v.isMain
                ? {
                    ...v,
                    regionData: regionFromDB,
                  }
                : v
            );
            setVersions(updatedVersions);

            // Set main version as current
            const mainVersion = updatedVersions.find((v) => v.isMain);
            if (mainVersion) {
              setCurrentVersion(mainVersion);
            }
          }

          // Load all regions from the same book
          if (dashboardId) {
            const allRegionsFromBook = await getRegionsByBookId(dashboardId);
            setAllRegions(allRegionsFromBook);

            // Load related data for multi-selects
            const [charactersData, factionsData, racesData, itemsData] = await Promise.all([
              getCharactersByBookId(dashboardId),
              getFactionsByBookId(dashboardId),
              getRacesByBookId(dashboardId),
              getItemsByBookId(dashboardId)
            ]);

            setCharacters(charactersData.map(char => ({
              id: char.id,
              name: char.name,
              image: char.image
            })));

            setFactions(factionsData.map(faction => ({
              id: faction.id,
              name: faction.name,
              image: faction.image
            })));

            setRaces(racesData.map(race => ({
              id: race.id,
              name: race.name,
              image: race.image
            })));

            setItems(itemsData.map(item => ({
              id: item.id,
              name: item.name,
              image: item.image
            })));
          }
        }
      } catch (error) {
        console.error("Error loading region:", error);
        toast.error("Erro ao carregar região");
      } finally {
        setIsLoading(false);
      }
    };

    loadRegion();
  }, [regionId, dashboardId]);

  const handleVersionChange = useCallback(
    (versionId: string | null) => {
      if (!versionId) return;

      const version = versions.find((v) => v.id === versionId);
      if (!version) return;

      setCurrentVersion(version);
      setRegion(version.regionData);
      setEditData(version.regionData);
      setImagePreview(version.regionData.image || "");

      toast.success(`Versão "${version.name}" ativada`);
    },
    [versions]
  );

  const handleVersionCreate = useCallback(
    async (versionData: {
      name: string;
      description: string;
      regionData: IRegionFormData;
    }) => {
      try {
        const newVersion: IRegionVersion = {
          id: `version-${Date.now()}`,
          name: versionData.name,
          description: versionData.description,
          createdAt: new Date().toISOString(),
          isMain: false,
          regionData: versionData.regionData as unknown as IRegion,
        };

        // Save to database
        await createRegionVersion(regionId, newVersion);

        // Update state only if save is successful
        setVersions((prev) => [...prev, newVersion]);
        toast.success(`Versão "${versionData.name}" criada com sucesso!`);
      } catch (error) {
        console.error("Error creating region version:", error);
        toast.error("Erro ao criar versão");
      }
    },
    [regionId]
  );

  const handleVersionDelete = useCallback(
    async (versionId: string) => {
      const versionToDelete = versions.find((v) => v.id === versionId);

      // Don't allow deleting main version
      if (versionToDelete?.isMain) {
        toast.error("Não é possível excluir a versão principal");
        return;
      }

      try {
        // Delete from database
        await deleteRegionVersion(versionId);

        // Update state only if delete is successful
        const updatedVersions = versions.filter((v) => v.id !== versionId);

        // If the deleted version was the current one, switch to main
        if (currentVersion?.id === versionId) {
          const mainVersion = updatedVersions.find((v) => v.isMain);
          if (mainVersion) {
            setCurrentVersion(mainVersion);
            setRegion(mainVersion.regionData);
            setEditData(mainVersion.regionData);
            setImagePreview(mainVersion.regionData.image || "");
          }
        }

        setVersions(updatedVersions);
        toast.success("Versão excluída com sucesso!");
      } catch (error) {
        console.error("Error deleting region version:", error);
        toast.error("Erro ao excluir versão");
      }
    },
    [versions, currentVersion]
  );

  const handleVersionUpdate = useCallback(
    async (versionId: string, name: string, description?: string) => {
      try {
        // Update in database
        await updateRegionVersion(versionId, name, description);

        // Update state only if update is successful
        const updatedVersions = versions.map((v) =>
          v.id === versionId ? { ...v, name, description } : v
        );
        setVersions(updatedVersions);

        if (currentVersion?.id === versionId) {
          setCurrentVersion({ ...currentVersion, name, description });
        }
      } catch (error) {
        console.error("Error updating region version:", error);
        toast.error("Erro ao atualizar versão");
      }
    },
    [versions, currentVersion]
  );

  const handleSave = useCallback(async () => {
    const updatedRegion = editData;
    setRegion(updatedRegion);

    // Update data in current version
    const updatedVersions = versions.map((v) =>
      v.id === currentVersion?.id
        ? { ...v, regionData: updatedRegion }
        : v
    );
    setVersions(updatedVersions);

    const activeVersion = updatedVersions.find(
      (v) => v.id === currentVersion?.id
    );
    if (activeVersion) {
      setCurrentVersion(activeVersion);
    }

    try {
      // Update region in database
      await updateRegion(regionId, {
        name: updatedRegion.name,
        parentId: updatedRegion.parentId,
        scale: updatedRegion.scale,
        summary: updatedRegion.summary,
        image: updatedRegion.image,
      });

      setIsEditing(false);
      toast.success("Região atualizada com sucesso!");
    } catch (error) {
      console.error("Error saving region:", error);
      toast.error("Erro ao salvar região");
    }
  }, [editData, versions, currentVersion, regionId]);

  const navigateToWorldTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleConfirmDelete = useCallback(async () => {
    if (currentVersion && !currentVersion.isMain) {
      // Delete version (non-main)
      const versionToDelete = versions.find((v) => v.id === currentVersion.id);

      if (!versionToDelete) return;

      const updatedVersions = versions.filter(
        (v) => v.id !== currentVersion.id
      );

      // Switch to main version after deleting
      const mainVersion = updatedVersions.find((v) => v.isMain);
      if (mainVersion) {
        setCurrentVersion(mainVersion);
        setRegion(mainVersion.regionData);
        setEditData(mainVersion.regionData);
        setImagePreview(mainVersion.regionData.image || "");
      }

      setVersions(updatedVersions);
      toast.success(t("delete.version.success"));
    } else {
      // Delete entire region (main version)
      try {
        if (!dashboardId) return;
        await deleteRegion(regionId);
        toast.success(t("delete.region.success"));
        navigateToWorldTab();
      } catch (error) {
        console.error("Error deleting region:", error);
        toast.error("Erro ao excluir região");
      }
    }
  }, [currentVersion, versions, navigateToWorldTab, regionId, dashboardId, t]);

  const handleCancel = useCallback(() => {
    setEditData(region);
    setIsEditing(false);
  }, [region]);

  const handleImageFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
          setEditData((prev) => ({ ...prev, image: result }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleBack = useCallback(() => {
    navigateToWorldTab();
  }, [navigateToWorldTab]);

  const handleNavigationSidebarToggle = useCallback(() => {
    setIsNavigationSidebarOpen((prev) => !prev);
  }, []);

  const handleNavigationSidebarClose = useCallback(() => {
    setIsNavigationSidebarOpen(false);
  }, []);

  const handleRegionSelect = useCallback((regionId: string) => {
    window.location.replace(`/dashboard/${dashboardId}/tabs/world/${regionId}`);
  }, [dashboardId]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setIsNavigationSidebarOpen(false);
  }, []);

  const handleDeleteModalOpen = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleEditDataChange = useCallback((field: string, value: unknown) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => !prev);
  }, []);

  return (
    <RegionDetailView
      region={region}
      editData={editData}
      isEditing={isEditing}
      hasChanges={hasChanges}
      versions={versions}
      currentVersion={currentVersion}
      showDeleteModal={showDeleteModal}
      isNavigationSidebarOpen={isNavigationSidebarOpen}
      imagePreview={imagePreview}
      fileInputRef={fileInputRef}
      allRegions={allRegions}
      advancedSectionOpen={advancedSectionOpen}
      characters={characters}
      factions={factions}
      races={races}
      items={items}
      onBack={handleBack}
      onNavigationSidebarToggle={handleNavigationSidebarToggle}
      onNavigationSidebarClose={handleNavigationSidebarClose}
      onRegionSelect={handleRegionSelect}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDeleteModalOpen={handleDeleteModalOpen}
      onDeleteModalClose={handleDeleteModalClose}
      onConfirmDelete={handleConfirmDelete}
      onVersionChange={handleVersionChange}
      onVersionCreate={handleVersionCreate}
      onVersionDelete={handleVersionDelete}
      onVersionUpdate={handleVersionUpdate}
      onImageFileChange={handleImageFileChange}
      onEditDataChange={handleEditDataChange}
      onAdvancedSectionToggle={handleAdvancedSectionToggle}
    />
  );
}
