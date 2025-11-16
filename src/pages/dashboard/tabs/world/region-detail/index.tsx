import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearch } from "@tanstack/react-router";
import { Map } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { RegionSchema } from "@/lib/validation/region-schema";
import { safeJsonParse } from "@/lib/utils/json-parse";

import {
  getRegionById,
  getRegionsByBookId,
  updateRegion,
  deleteRegion,
  getRegionVersions,
  createRegionVersion,
  deleteRegionVersion,
  updateRegionVersion,
  updateRegionVersionData,
  getRegionVersionTimeline,
  saveRegionVersionTimeline,
  type IRegionVersion,
  type ITimelineEra,
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
import {
  type IFieldVisibility,
  type ISectionVisibility,
  toggleFieldVisibility,
  toggleSectionVisibility,
} from "@/components/detail-page/visibility-helpers";

import { RegionDetailView } from "./view";
import { UnsavedChangesDialog } from "./components/unsaved-changes-dialog";

export function RegionDetail() {
  const { dashboardId, regionId } = useParams({
    from: "/dashboard/$dashboardId/tabs/world/$regionId/",
  });
  const search = useSearch({ strict: false });
  const versionIdFromUrl = (search as { versionId?: string })?.versionId;
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
  const [region, setRegion] = useState<IRegion | null>(null);
  const [editData, setEditData] = useState<IRegion>(emptyRegion);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [versions, setVersions] = useState<IRegionVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<IRegionVersion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [allRegions, setAllRegions] = useState<IRegion[]>([]);
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(() => {
    const stored = localStorage.getItem("regionDetailAdvancedSectionOpen");
    return stored ? JSON.parse(stored) : false;
  });
  const [timelineSectionOpen, setTimelineSectionOpen] = useState(() => {
    const stored = localStorage.getItem("regionDetailTimelineSectionOpen");
    return stored ? JSON.parse(stored) : false;
  });

  // Related data for multi-selects
  const [characters, setCharacters] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [factions, setFactions] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [races, setRaces] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [items, setItems] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);

  // Timeline state
  const [timeline, setTimeline] = useState<ITimelineEra[]>([]);
  const [originalTimeline, setOriginalTimeline] = useState<ITimelineEra[]>([]);

  // Visibility state
  const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
  const [sectionVisibility, setSectionVisibility] =
    useState<ISectionVisibility>({});
  const [originalFieldVisibility, setOriginalFieldVisibility] =
    useState<IFieldVisibility>({});
  const [originalSectionVisibility, setOriginalSectionVisibility] =
    useState<ISectionVisibility>({});

  // Refs to always have the latest visibility values
  const fieldVisibilityRef = useRef<IFieldVisibility>({});
  const sectionVisibilityRef = useRef<ISectionVisibility>({});

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função de validação de campo individual (onBlur)
  const validateField = useCallback((field: string, value: any) => {
    try {
      // Validar apenas este campo
      const fieldSchema = RegionSchema.pick({ [field]: true } as any);
      fieldSchema.parse({ [field]: value });

      // Se passou, remover erro
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.errors[0].message,
        }));
        return false;
      }
    }
  }, []);

  // Verificar se tem campos obrigatórios vazios e quais são
  const { hasRequiredFieldsEmpty, missingFields } = useMemo(() => {
    if (!editData) return { hasRequiredFieldsEmpty: false, missingFields: [] };

    try {
      // Validar apenas campos obrigatórios
      RegionSchema.pick({
        name: true,
        scale: true,
        summary: true,
      } as any).parse({
        name: editData.name,
        scale: editData.scale,
        summary: editData.summary,
      });
      return { hasRequiredFieldsEmpty: false, missingFields: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missing = error.errors.map((e) => e.path[0] as string);
        return { hasRequiredFieldsEmpty: true, missingFields: missing };
      }
      return { hasRequiredFieldsEmpty: true, missingFields: [] };
    }
  }, [editData]);

  // Save section states to localStorage
  useEffect(() => {
    localStorage.setItem(
      "regionDetailAdvancedSectionOpen",
      JSON.stringify(advancedSectionOpen)
    );
  }, [advancedSectionOpen]);

  useEffect(() => {
    localStorage.setItem(
      "regionDetailTimelineSectionOpen",
      JSON.stringify(timelineSectionOpen)
    );
  }, [timelineSectionOpen]);

  // Check if there are changes between region and editData
  const hasChanges = useMemo(() => {
    if (!isEditing) return false;

    // Check if timeline has changed
    if (JSON.stringify(timeline) !== JSON.stringify(originalTimeline))
      return true;

    // Check if visibility has changed
    if (
      JSON.stringify(fieldVisibility) !==
      JSON.stringify(originalFieldVisibility)
    )
      return true;
    if (
      JSON.stringify(sectionVisibility) !==
      JSON.stringify(originalSectionVisibility)
    )
      return true;

    // Helper function to compare arrays (order-independent for IDs, order-dependent for strings)
    const arraysEqual = (
      a: unknown[] | undefined,
      b: unknown[] | undefined
    ): boolean => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;

      // For string arrays (like mysteries, anomalies), order matters
      if (a.length > 0 && typeof a[0] === "string") {
        return a.every((item, index) => item === b[index]);
      }

      // For ID arrays, order doesn't matter
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((item, index) => item === sortedB[index]);
    };

    // Helper to parse JSON strings to arrays for comparison
    const parseJsonArray = (value: string | undefined): string[] => {
      return safeJsonParse<string[]>(value, []);
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
    if (
      !arraysEqual(
        parseJsonArray(region.residentFactions),
        parseJsonArray(editData.residentFactions)
      )
    )
      return true;

    if (
      !arraysEqual(
        parseJsonArray(region.dominantFactions),
        parseJsonArray(editData.dominantFactions)
      )
    )
      return true;

    if (
      !arraysEqual(
        parseJsonArray(region.importantCharacters),
        parseJsonArray(editData.importantCharacters)
      )
    )
      return true;

    if (
      !arraysEqual(
        parseJsonArray(region.racesFound),
        parseJsonArray(editData.racesFound)
      )
    )
      return true;

    if (
      !arraysEqual(
        parseJsonArray(region.itemsFound),
        parseJsonArray(editData.itemsFound)
      )
    )
      return true;

    // Compare advanced fields - Narrative
    if (region.narrativePurpose !== editData.narrativePurpose) return true;
    if (region.uniqueCharacteristics !== editData.uniqueCharacteristics)
      return true;
    if (region.politicalImportance !== editData.politicalImportance)
      return true;
    if (region.religiousImportance !== editData.religiousImportance)
      return true;
    if (region.worldPerception !== editData.worldPerception) return true;

    const regionMysteries = parseJsonArray(region.regionMysteries);
    const editMysteries = parseJsonArray(editData.regionMysteries);
    if (!arraysEqual(regionMysteries, editMysteries)) return true;

    const regionInspirations = parseJsonArray(region.inspirations);
    const editInspirations = parseJsonArray(editData.inspirations);
    if (!arraysEqual(regionInspirations, editInspirations)) return true;

    return false;
  }, [
    region,
    editData,
    isEditing,
    timeline,
    originalTimeline,
    fieldVisibility,
    originalFieldVisibility,
    sectionVisibility,
    originalSectionVisibility,
  ]);

  // Load region from database
  useEffect(() => {
    const loadRegion = async () => {
      try {
        const regionFromDB = await getRegionById(regionId);
        if (regionFromDB) {
          // Load versions from database
          const versionsFromDB = await getRegionVersions(regionId);

          // Prepare versions list
          let updatedVersions: IRegionVersion[] = [];

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
            updatedVersions = [mainVersion];
            setVersions([mainVersion]);
            setCurrentVersion(mainVersion);

            // Set region data from main version
            setRegion(regionFromDB);
            setEditData(regionFromDB);
            setImagePreview(regionFromDB.image || "");

            // Load visibility preferences from the region data
            const loadedFieldVisibility = safeJsonParse<IFieldVisibility>(
              regionFromDB.fieldVisibility,
              {}
            );
            const loadedSectionVisibility = safeJsonParse<ISectionVisibility>(
              regionFromDB.sectionVisibility,
              {}
            );

            setFieldVisibility(loadedFieldVisibility);
            setSectionVisibility(loadedSectionVisibility);
            setOriginalFieldVisibility(loadedFieldVisibility);
            setOriginalSectionVisibility(loadedSectionVisibility);
            // Update refs
            fieldVisibilityRef.current = loadedFieldVisibility;
            sectionVisibilityRef.current = loadedSectionVisibility;
          } else {
            // Update main version with loaded data
            updatedVersions = versionsFromDB.map((v) =>
              v.isMain
                ? {
                    ...v,
                    regionData: regionFromDB,
                  }
                : v
            );
            setVersions(updatedVersions);
          }

          // Load all regions from the same book
          if (dashboardId) {
            const allRegionsFromBook = await getRegionsByBookId(dashboardId);
            setAllRegions(allRegionsFromBook);

            // Load related data for multi-selects
            const [charactersData, factionsData, racesData, itemsData] =
              await Promise.all([
                getCharactersByBookId(dashboardId),
                getFactionsByBookId(dashboardId),
                getRacesByBookId(dashboardId),
                getItemsByBookId(dashboardId),
              ]);

            setCharacters(
              charactersData.map((char) => ({
                id: char.id,
                name: char.name,
                image: char.image,
              }))
            );

            setFactions(
              factionsData.map((faction) => ({
                id: faction.id,
                name: faction.name,
                image: faction.image,
              }))
            );

            setRaces(
              racesData.map((race) => ({
                id: race.id,
                name: race.name,
                image: race.image,
              }))
            );

            setItems(
              itemsData.map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image,
              }))
            );

            // Clean orphaned IDs from all versions BEFORE setting state
            const characterIds = new Set(charactersData.map((c) => c.id));
            const factionIds = new Set(factionsData.map((f) => f.id));
            const raceIds = new Set(racesData.map((r) => r.id));
            const itemIds = new Set(itemsData.map((i) => i.id));

            let hasOrphanedIds = false;

            const cleanedVersions = updatedVersions.map((version) => {
              const regionData = version.regionData;
              let needsUpdate = false;

              // Parse and clean each field
              const importantCharacters = safeJsonParse<string[]>(
                regionData.importantCharacters,
                []
              );
              const importantFactions = safeJsonParse<string[]>(
                regionData.importantFactions,
                []
              );
              const racesFound = safeJsonParse<string[]>(
                regionData.racesFound,
                []
              );
              const itemsFound = safeJsonParse<string[]>(
                regionData.itemsFound,
                []
              );

              // Filter out orphaned IDs
              const cleanedCharacters = importantCharacters.filter(
                (id: string) => characterIds.has(id)
              );
              const cleanedFactions = importantFactions.filter((id: string) =>
                factionIds.has(id)
              );
              const cleanedRaces = racesFound.filter((id: string) =>
                raceIds.has(id)
              );
              const cleanedItems = itemsFound.filter((id: string) =>
                itemIds.has(id)
              );

              // Check if any IDs were removed
              if (
                cleanedCharacters.length !== importantCharacters.length ||
                cleanedFactions.length !== importantFactions.length ||
                cleanedRaces.length !== racesFound.length ||
                cleanedItems.length !== itemsFound.length
              ) {
                needsUpdate = true;
                hasOrphanedIds = true;
              }

              if (needsUpdate) {
                return {
                  ...version,
                  regionData: {
                    ...regionData,
                    importantCharacters: JSON.stringify(cleanedCharacters),
                    importantFactions: JSON.stringify(cleanedFactions),
                    racesFound: JSON.stringify(cleanedRaces),
                    itemsFound: JSON.stringify(cleanedItems),
                  },
                };
              }

              return version;
            });

            // Update database if orphaned IDs were found
            if (hasOrphanedIds) {
              for (const version of cleanedVersions) {
                try {
                  if (version.isMain) {
                    // Update main region
                    await updateRegion(regionId, version.regionData);
                  } else {
                    // Update version
                    const { updateRegionVersionData } = await import(
                      "@/lib/db/regions.service"
                    );
                    await updateRegionVersionData(
                      version.id,
                      version.regionData
                    );
                  }
                } catch (error) {
                  console.error(
                    `Failed to clean orphaned IDs for version ${version.id}:`,
                    error
                  );
                }
              }
            }

            // Update state with cleaned versions (always use cleaned versions)
            const finalVersions = hasOrphanedIds
              ? cleanedVersions
              : updatedVersions;
            setVersions(finalVersions);

            // Set current version based on URL parameter or default to main (using cleaned data)
            let selectedVersion: IRegionVersion | undefined;

            if (versionIdFromUrl) {
              selectedVersion = finalVersions.find(
                (v) => v.id === versionIdFromUrl
              );
              if (!selectedVersion) {
                selectedVersion = finalVersions.find((v) => v.isMain);
              }
            } else {
              selectedVersion = finalVersions.find((v) => v.isMain);
            }

            if (selectedVersion) {
              setCurrentVersion(selectedVersion);
              // Set region data from selected version (already cleaned)
              setRegion(selectedVersion.regionData);
              setEditData(selectedVersion.regionData);
              setImagePreview(selectedVersion.regionData.image || "");

              // Load visibility preferences from the region data
              const loadedFieldVisibility = safeJsonParse<IFieldVisibility>(
                selectedVersion.regionData.fieldVisibility,
                {}
              );
              const loadedSectionVisibility = safeJsonParse<ISectionVisibility>(
                selectedVersion.regionData.sectionVisibility,
                {}
              );

              setFieldVisibility(loadedFieldVisibility);
              setSectionVisibility(loadedSectionVisibility);
              setOriginalFieldVisibility(loadedFieldVisibility);
              setOriginalSectionVisibility(loadedSectionVisibility);
              // Update refs
              fieldVisibilityRef.current = loadedFieldVisibility;
              sectionVisibilityRef.current = loadedSectionVisibility;

              // Load timeline for this version
              const timelineData = await getRegionVersionTimeline(
                selectedVersion.id
              );
              setTimeline(timelineData);
              setOriginalTimeline(timelineData);
            }
          }
        }
      } catch (error) {
        console.error("Error loading region:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegion();
  }, [regionId, dashboardId, versionIdFromUrl]);

  const handleVersionChange = useCallback(
    async (versionId: string | null) => {
      if (!versionId) return;

      const version = versions.find((v) => v.id === versionId);
      if (!version) return;

      setCurrentVersion(version);
      setRegion(version.regionData);
      setEditData(version.regionData);
      setImagePreview(version.regionData.image || "");

      // Load visibility preferences from the region data
      const loadedFieldVisibility = safeJsonParse<IFieldVisibility>(
        version.regionData.fieldVisibility,
        {}
      );
      const loadedSectionVisibility = safeJsonParse<ISectionVisibility>(
        version.regionData.sectionVisibility,
        {}
      );

      setFieldVisibility(loadedFieldVisibility);
      setSectionVisibility(loadedSectionVisibility);
      setOriginalFieldVisibility(loadedFieldVisibility);
      setOriginalSectionVisibility(loadedSectionVisibility);
      // Update refs
      fieldVisibilityRef.current = loadedFieldVisibility;
      sectionVisibilityRef.current = loadedSectionVisibility;

      // Load timeline for this version
      try {
        const timelineData = await getRegionVersionTimeline(version.id);
        setTimeline(timelineData);
        setOriginalTimeline(timelineData);
      } catch (error) {
        console.error("Error loading version timeline:", error);
      }
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
      } catch (error) {
        console.error("Error creating region version:", error);
      }
    },
    [regionId]
  );

  const handleVersionDelete = useCallback(
    async (versionId: string) => {
      const versionToDelete = versions.find((v) => v.id === versionId);

      // Don't allow deleting main version
      if (versionToDelete?.isMain) {
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
      } catch (error) {
        console.error(
          "[handleVersionDelete] Error deleting region version:",
          error
        );
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
      }
    },
    [versions, currentVersion]
  );

  const handleSave = useCallback(async () => {
    console.log('[handleSave] Starting save...', { currentVersion, editData });
    if (!currentVersion || !editData) {
      console.log('[handleSave] Early return - missing currentVersion or editData');
      return;
    }

    try {
      console.log('[handleSave] Validating data...');

      // Helper function to safely parse JSON strings to arrays
      const parseArrayField = (field: any): string[] | undefined => {
        if (!field) return undefined;
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
          try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : undefined;
          } catch {
            return undefined;
          }
        }
        return undefined;
      };

      // Validar TUDO com Zod (convertendo strings JSON para arrays)
      const validatedData = RegionSchema.parse({
        name: editData.name,
        scale: editData.scale,
        summary: editData.summary,
        climate: editData.climate,
        parentId: editData.parentId,
        image: editData.image,
        currentSeason: editData.currentSeason,
        customSeasonName: editData.customSeasonName,
        generalDescription: editData.generalDescription,
        regionAnomalies: parseArrayField(editData.regionAnomalies),
        residentFactions: parseArrayField(editData.residentFactions),
        dominantFactions: parseArrayField(editData.dominantFactions),
        importantCharacters: parseArrayField(editData.importantCharacters),
        racesFound: parseArrayField(editData.racesFound),
        itemsFound: parseArrayField(editData.itemsFound),
        narrativePurpose: editData.narrativePurpose,
        uniqueCharacteristics: editData.uniqueCharacteristics,
        politicalImportance: editData.politicalImportance,
        religiousImportance: editData.religiousImportance,
        worldPerception: editData.worldPerception,
        regionMysteries: parseArrayField(editData.regionMysteries),
        inspirations: parseArrayField(editData.inspirations),
      });

      // Atualizar state com dados validados
      const updatedRegion = {
        ...editData,
        name: validatedData.name,
        scale: validatedData.scale,
        summary: validatedData.summary,
        climate: validatedData.climate,
      };

      setRegion(updatedRegion);

      // Update data in current version
      const updatedVersions = versions.map((v) =>
        v.id === currentVersion?.id ? { ...v, regionData: updatedRegion } : v
      );
      setVersions(updatedVersions);

      const activeVersion = updatedVersions.find(
        (v) => v.id === currentVersion?.id
      );
      if (activeVersion) {
        setCurrentVersion(activeVersion);
      }

      // Get current visibility state from refs
      const currentFieldVisibility = fieldVisibilityRef.current;
      const currentSectionVisibility = sectionVisibilityRef.current;

      // Helper function to ensure array fields are JSON strings for database
      const ensureJsonString = (field: any): string | undefined => {
        if (!field) return undefined;
        if (typeof field === 'string') return field;
        if (Array.isArray(field)) return JSON.stringify(field);
        return undefined;
      };

      const dataToSave = {
        name: updatedRegion.name,
        parentId: updatedRegion.parentId,
        scale: updatedRegion.scale,
        summary: updatedRegion.summary,
        image: updatedRegion.image,
        // Environment fields
        climate: updatedRegion.climate,
        currentSeason: updatedRegion.currentSeason,
        customSeasonName: updatedRegion.customSeasonName,
        generalDescription: updatedRegion.generalDescription,
        regionAnomalies: ensureJsonString(updatedRegion.regionAnomalies),
        // Information fields
        residentFactions: ensureJsonString(updatedRegion.residentFactions),
        dominantFactions: ensureJsonString(updatedRegion.dominantFactions),
        importantCharacters: ensureJsonString(updatedRegion.importantCharacters),
        racesFound: ensureJsonString(updatedRegion.racesFound),
        itemsFound: ensureJsonString(updatedRegion.itemsFound),
        // Narrative fields
        narrativePurpose: updatedRegion.narrativePurpose,
        uniqueCharacteristics: updatedRegion.uniqueCharacteristics,
        politicalImportance: updatedRegion.politicalImportance,
        religiousImportance: updatedRegion.religiousImportance,
        worldPerception: updatedRegion.worldPerception,
        regionMysteries: ensureJsonString(updatedRegion.regionMysteries),
        inspirations: ensureJsonString(updatedRegion.inspirations),
        // Visibility preferences
        fieldVisibility: JSON.stringify(currentFieldVisibility),
        sectionVisibility: JSON.stringify(currentSectionVisibility),
      };

      // Check if we're editing the main version or an alternate version
      const isMainVersion = currentVersion?.isMain ?? true;
      console.log('[handleSave] isMainVersion:', isMainVersion);

      if (isMainVersion) {
        // Update the main region in database
        console.log('[handleSave] Updating main region...');
        await updateRegion(regionId, dataToSave);
        console.log('[handleSave] Main region updated successfully');
      } else {
        // Update the alternate version's data in database
        console.log('[handleSave] Updating alternate version...', currentVersion.id);
        await updateRegionVersionData(currentVersion.id, updatedRegion);
        console.log('[handleSave] Alternate version updated successfully');
      }

      // Update original visibility to match saved state
      setOriginalFieldVisibility(currentFieldVisibility);
      setOriginalSectionVisibility(currentSectionVisibility);

      // Save timeline for current version
      if (currentVersion) {
        console.log('[handleSave] Saving timeline...');
        await saveRegionVersionTimeline(currentVersion.id, timeline);
        console.log('[handleSave] Timeline saved');
      }

      // Update original timeline after successful save
      setOriginalTimeline(timeline);

      setErrors({}); // Limpar erros
      console.log('[handleSave] Exiting edit mode...');
      setIsEditing(false);
      console.log('[handleSave] Save completed successfully!');
    } catch (error) {
      console.error('[handleSave] Error caught:', error);
      if (error instanceof z.ZodError) {
        console.error('[handleSave] Zod validation errors:', error.errors);
        // Mapear erros para cada campo
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Error saving region:", error);
      }
    }
  }, [editData, versions, currentVersion, regionId, timeline, t]);

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

      try {
        // Delete from database
        await deleteRegionVersion(currentVersion.id);

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
      } catch (error) {
        console.error("[handleConfirmDelete] Error deleting version:", error);
      }
    } else {
      // Delete entire region (main version)
      try {
        if (!dashboardId) return;
        await deleteRegion(regionId);
        navigateToWorldTab();
      } catch (error) {
        console.error("Error deleting region:", error);
      }
    }
  }, [currentVersion, versions, navigateToWorldTab, regionId, dashboardId, t]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditData(region);
    setTimeline(originalTimeline);
    setFieldVisibility(originalFieldVisibility);
    setSectionVisibility(originalSectionVisibility);
    setErrors({});
    setIsEditing(false);
  }, [
    region,
    originalTimeline,
    originalFieldVisibility,
    originalSectionVisibility,
    hasChanges,
  ]);

  const handleConfirmCancel = useCallback(() => {
    setEditData(region);
    setTimeline(originalTimeline);
    setFieldVisibility(originalFieldVisibility);
    setSectionVisibility(originalSectionVisibility);
    setErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [
    region,
    originalTimeline,
    originalFieldVisibility,
    originalSectionVisibility,
  ]);

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

  const handleViewMap = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/world/$regionId/map",
      params: { dashboardId, regionId },
      search:
        currentVersion?.id && currentVersion.id !== "main-version"
          ? { versionId: currentVersion.id }
          : undefined,
    });
  }, [navigate, dashboardId, regionId, currentVersion]);

  const handleNavigationSidebarToggle = useCallback(() => {
    setIsNavigationSidebarOpen((prev) => !prev);
  }, []);

  const handleNavigationSidebarClose = useCallback(() => {
    setIsNavigationSidebarOpen(false);
  }, []);

  const handleRegionSelect = useCallback(
    (regionId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/world/$regionId",
        params: { dashboardId, regionId },
        replace: true,
      });
    },
    [dashboardId, navigate]
  );

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

  const handleTimelineSectionToggle = useCallback(() => {
    setTimelineSectionOpen((prev) => !prev);
  }, []);

  const handleTimelineChange = useCallback((newTimeline: ITimelineEra[]) => {
    setTimeline(newTimeline);
  }, []);

  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => {
      const newVisibility = toggleFieldVisibility(fieldName, prev);
      fieldVisibilityRef.current = newVisibility;
      console.log(
        "[Visibility] Field toggled:",
        fieldName,
        "New state:",
        newVisibility
      );
      return newVisibility;
    });
  }, []);

  const handleSectionVisibilityToggle = useCallback((sectionName: string) => {
    setSectionVisibility((prev) => {
      const newVisibility = toggleSectionVisibility(sectionName, prev);
      sectionVisibilityRef.current = newVisibility;
      console.log(
        "[Visibility] Section toggled:",
        sectionName,
        "New state:",
        newVisibility
      );
      return newVisibility;
    });
  }, []);

  // Don't render until we have the region data loaded
  if (!region || !currentVersion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando região...</p>
        </div>
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
        timelineSectionOpen={timelineSectionOpen}
        bookId={dashboardId}
        characters={characters}
        factions={factions}
        races={races}
        items={items}
        timeline={timeline}
        errors={errors}
        validateField={validateField}
        hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
        missingFields={missingFields}
        fieldVisibility={fieldVisibility}
        sectionVisibility={sectionVisibility}
        onTimelineChange={handleTimelineChange}
        onFieldVisibilityToggle={handleFieldVisibilityToggle}
        onSectionVisibilityToggle={handleSectionVisibilityToggle}
        onBack={handleBack}
        onViewMap={handleViewMap}
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
        onTimelineSectionToggle={handleTimelineSectionToggle}
      />
    </>
  );
}
