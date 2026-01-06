import { useState, useRef, useCallback, useEffect, useMemo } from "react";

import { useParams, useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  type ISectionVisibility,
  toggleSectionVisibility,
} from "@/components/detail-page/visibility-helpers";
import { EntityLogsModal } from "@/components/modals/entity-logs-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import {
  getRegionById,
  getRegionsByBookId,
  deleteRegion,
  type ITimelineEra,
} from "@/lib/db/regions.service";
import { safeJsonParse } from "@/lib/utils/json-parse";
import { RegionSchema } from "@/lib/validation/region-schema";
import {
  type IRegion,
  type RegionScale,
} from "@/pages/dashboard/tabs/world/types/region-types";
import { useRegionsStore } from "@/stores/regions-store";
import { useEntityUIStateStore } from "@/stores/entity-ui-state-store";

import { UnsavedChangesDialog } from "./components/unsaved-changes-dialog";
import { RegionDetailView } from "./view";

export function RegionDetail() {
  const { dashboardId, regionId } = useParams({
    from: "/dashboard/$dashboardId/tabs/world/$regionId/",
  });
  const search = useSearch({ strict: false });
  const versionIdFromUrl = (search as { versionId?: string })?.versionId;
  const fromMapId = (search as { fromMapId?: string })?.fromMapId;
  const fromMapVersionId = (search as { fromMapVersionId?: string })
    ?.fromMapVersionId;
  const navigate = useNavigate();
  const { t } = useTranslation(["region-detail", "common"]);

  // Store hook
  const updateRegionInCache = useRegionsStore(
    (state) => state.updateRegionInCache
  );

  // Entity UI State store
  const getUIState = useEntityUIStateStore((state) => state.getUIState);
  const setUIStateInStore = useEntityUIStateStore((state) => state.setUIState);

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
  const [_isLoading, _setIsLoading] = useState(true);
  const [allRegions, setAllRegions] = useState<IRegion[]>([]);
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);
  const [timelineSectionOpen, setTimelineSectionOpen] = useState(false);

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
  const [sectionVisibility, setSectionVisibility] =
    useState<ISectionVisibility>({});
  const [originalSectionVisibility, setOriginalSectionVisibility] =
    useState<ISectionVisibility>({});
  const [originalAdvancedSectionOpen, setOriginalAdvancedSectionOpen] = useState(false);
  const [originalTimelineSectionOpen, setOriginalTimelineSectionOpen] = useState(false);
  const [extraSectionsOpenState, setExtraSectionsOpenState] = useState<
    Record<string, boolean>
  >({});
  const [originalExtraSectionsOpenState, setOriginalExtraSectionsOpenState] = useState<
    Record<string, boolean>
  >({});

  // Chapter metrics state
  const [hasChapterMetrics, setHasChapterMetrics] = useState<boolean | null>(
    null
  );

  // Entity logs state
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  // Refs to always have current values (avoid stale closures)
  const advancedSectionOpenRef = useRef(advancedSectionOpen);
  const timelineSectionOpenRef = useRef(timelineSectionOpen);
  const sectionVisibilityRef = useRef(sectionVisibility);
  const extraSectionsOpenStateRef = useRef(extraSectionsOpenState);

  // Keep refs in sync with state
  useEffect(() => {
    advancedSectionOpenRef.current = advancedSectionOpen;
  }, [advancedSectionOpen]);

  useEffect(() => {
    timelineSectionOpenRef.current = timelineSectionOpen;
  }, [timelineSectionOpen]);

  useEffect(() => {
    sectionVisibilityRef.current = sectionVisibility;
  }, [sectionVisibility]);

  useEffect(() => {
    extraSectionsOpenStateRef.current = extraSectionsOpenState;
  }, [extraSectionsOpenState]);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Função de validação de campo individual (onBlur)
  const validateField = useCallback(
    (field: string, value: any) => {
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
          // Traduzir a mensagem de erro
          const errorMessage = error.errors[0].message;
          const translatedMessage = errorMessage.startsWith("region-detail:")
            ? t(errorMessage)
            : errorMessage;

          setErrors((prev) => ({
            ...prev,
            [field]: translatedMessage,
          }));
          return false;
        }
      }
    },
    [t]
  );

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

    // Helper function to compare section visibility
    // Treats undefined and true as equivalent (both = visible)
    const sectionVisibilityChanged = (
      current: ISectionVisibility,
      original: ISectionVisibility
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
    const parseJsonArray = (value: string | undefined): string[] =>
      safeJsonParse<string[]>(value, []);

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

    // Check if UI state has changed
    if (advancedSectionOpen !== originalAdvancedSectionOpen) return true;
    if (timelineSectionOpen !== originalTimelineSectionOpen) return true;

    return false;
  }, [
    region,
    editData,
    isEditing,
    timeline,
    originalTimeline,
    sectionVisibility,
    originalSectionVisibility,
    advancedSectionOpen,
    originalAdvancedSectionOpen,
    timelineSectionOpen,
    originalTimelineSectionOpen,
  ]);

  // Load region from database
  useEffect(() => {
    const loadRegion = async () => {
      // CRITICAL: Reset ALL UI states immediately when regionId changes
      // (component is not unmounted when navigating between regions)
      setSectionVisibility({});
      setAdvancedSectionOpen(false);
      setTimelineSectionOpen(false);
      setOriginalSectionVisibility({});
      setOriginalAdvancedSectionOpen(false);
      setOriginalTimelineSectionOpen(false);
      setExtraSectionsOpenState({});
      setOriginalExtraSectionsOpenState({});
      sectionVisibilityRef.current = {};
      extraSectionsOpenStateRef.current = {};

      try {
        const regionFromDB = await getRegionById(regionId);
        if (regionFromDB) {
          // Set region data
          setRegion(regionFromDB);
          setEditData(regionFromDB);
          setImagePreview(regionFromDB.image || "");

          // Load timeline from the region data
          const loadedTimeline = safeJsonParse<ITimelineEra[]>(
            regionFromDB.timeline,
            []
          );
          setTimeline(loadedTimeline);
          setOriginalTimeline(loadedTimeline);

          // Priority 1: Check in-memory cache
          let cachedUIState = getUIState("regions", regionId);

          // Priority 2: Load from database if not in cache
          if (!cachedUIState && regionFromDB.uiState) {
            cachedUIState = regionFromDB.uiState;
            // Save to cache for future use
            setUIStateInStore("regions", regionId, cachedUIState);
          }

          // Priority 3: Use defaults if no cache and no database value
          if (!cachedUIState) {
            // Create NEW object references for each entity (prevent sharing)
            cachedUIState = {
              advancedSectionOpen: false,
              timelineSectionOpen: false,
              sectionVisibility: {}, // New object reference
              extraSectionsOpenState: {}, // New object reference
            };
            // Save defaults to cache
            setUIStateInStore("regions", regionId, cachedUIState);
          }

          // Apply UI state to local state (deep copy to avoid reference sharing)
          const loadedAdvancedSectionOpen =
            cachedUIState.advancedSectionOpen ?? false;
          const loadedTimelineSectionOpen =
            cachedUIState.timelineSectionOpen ?? false;
          const loadedSectionVisibility =
            cachedUIState.sectionVisibility || {};
          const loadedExtraSectionsOpenState =
            cachedUIState.extraSectionsOpenState || {};

          // Create TWO separate deep copies to avoid sharing between current and original states
          const sectionVisibilityCopy = { ...loadedSectionVisibility };
          const sectionVisibilityOriginalCopy = { ...loadedSectionVisibility };
          const extraSectionsOpenStateCopy = { ...loadedExtraSectionsOpenState };
          const extraSectionsOpenStateOriginalCopy = { ...loadedExtraSectionsOpenState };

          setAdvancedSectionOpen(loadedAdvancedSectionOpen);
          setOriginalAdvancedSectionOpen(loadedAdvancedSectionOpen);
          setTimelineSectionOpen(loadedTimelineSectionOpen);
          setOriginalTimelineSectionOpen(loadedTimelineSectionOpen);
          setSectionVisibility(sectionVisibilityCopy);
          setOriginalSectionVisibility(sectionVisibilityOriginalCopy);
          setExtraSectionsOpenState(extraSectionsOpenStateCopy);
          setOriginalExtraSectionsOpenState(extraSectionsOpenStateOriginalCopy);

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

            // Clean orphaned IDs from region data
            const characterIds = new Set(charactersData.map((c) => c.id));
            const factionIds = new Set(factionsData.map((f) => f.id));
            const raceIds = new Set(racesData.map((r) => r.id));
            const itemIds = new Set(itemsData.map((i) => i.id));

            // Parse and clean each field
            const importantCharacters = safeJsonParse<string[]>(
              regionFromDB.importantCharacters,
              []
            );
            const importantFactions = safeJsonParse<string[]>(
              regionFromDB.importantFactions,
              []
            );
            const racesFound = safeJsonParse<string[]>(
              regionFromDB.racesFound,
              []
            );
            const itemsFound = safeJsonParse<string[]>(
              regionFromDB.itemsFound,
              []
            );

            // Filter out orphaned IDs
            const cleanedCharacters = importantCharacters.filter((id: string) =>
              characterIds.has(id)
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
            const hasOrphanedIds =
              cleanedCharacters.length !== importantCharacters.length ||
              cleanedFactions.length !== importantFactions.length ||
              cleanedRaces.length !== racesFound.length ||
              cleanedItems.length !== itemsFound.length;

            if (hasOrphanedIds) {
              const cleanedRegion = {
                ...regionFromDB,
                importantCharacters: JSON.stringify(cleanedCharacters),
                importantFactions: JSON.stringify(cleanedFactions),
                racesFound: JSON.stringify(cleanedRaces),
                itemsFound: JSON.stringify(cleanedItems),
              };

              // Update database and cache
              try {
                await updateRegionInCache(regionId, cleanedRegion);
                // Update state with cleaned data
                setRegion(cleanedRegion);
                setEditData(cleanedRegion);
              } catch (error) {
                console.error("Failed to clean orphaned IDs:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading region:", error);
      } finally {
        _setIsLoading(false);
      }
    };

    loadRegion();
  }, [regionId, dashboardId, getUIState, setUIStateInStore]);

  const handleSave = useCallback(async () => {
    if (!editData) {
      return;
    }

    try {
      // Helper function to safely parse JSON strings to arrays
      const parseArrayField = (field: any): string[] | undefined => {
        if (!field) return undefined;
        if (Array.isArray(field)) return field;
        if (typeof field === "string") {
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
      setImagePreview(updatedRegion.image || "");

      // Helper function to ensure array fields are JSON strings for database
      const ensureJsonString = (field: any): string | undefined => {
        if (!field) return undefined;
        if (typeof field === "string") return field;
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
        importantCharacters: ensureJsonString(
          updatedRegion.importantCharacters
        ),
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
        // sectionVisibility removed - now only saved in uiState
        // UI State
        uiState: {
          advancedSectionOpen,
          timelineSectionOpen,
          sectionVisibility: sectionVisibilityRef.current,
          extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
        },
        // Timeline data
        timeline: JSON.stringify(timeline),
      };

      // Update the region in database and cache
      await updateRegionInCache(regionId, dataToSave);

      // Update original visibility to match saved state
      setOriginalSectionVisibility(sectionVisibility);
      setOriginalAdvancedSectionOpen(advancedSectionOpen);
      setOriginalTimelineSectionOpen(timelineSectionOpen);
      setOriginalExtraSectionsOpenState(extraSectionsOpenState);

      // Update original timeline after successful save
      setOriginalTimeline(timeline);

      setErrors({}); // Limpar erros
      setIsEditing(false);
    } catch (error) {
      console.error("[handleSave] Error caught:", error);
      if (error instanceof z.ZodError) {
        console.error("[handleSave] Zod validation errors:", error.errors);
        // Mapear erros para cada campo e traduzir
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          // Traduzir a mensagem de erro
          const errorMessage = err.message;
          const translatedMessage = errorMessage.startsWith("region-detail:")
            ? t(errorMessage)
            : errorMessage;
          newErrors[field] = translatedMessage;
        });
        setErrors(newErrors);
      } else {
        console.error("Error saving region:", error);
      }
    }
  }, [editData, regionId, timeline]);

  const navigateToWorldTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (!dashboardId) return;
      await deleteRegion(regionId);
      navigateToWorldTab();
    } catch (error) {
      console.error("Error deleting region:", error);
    }
  }, [navigateToWorldTab, regionId, dashboardId]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditData(region);
    setImagePreview(region?.image || "");
    setTimeline(originalTimeline);
    setSectionVisibility(originalSectionVisibility);
    setAdvancedSectionOpen(originalAdvancedSectionOpen);
    setTimelineSectionOpen(originalTimelineSectionOpen);
    setExtraSectionsOpenState(originalExtraSectionsOpenState);
    setErrors({});
    setIsEditing(false);
  }, [region, originalTimeline, originalSectionVisibility, originalAdvancedSectionOpen, originalTimelineSectionOpen, originalExtraSectionsOpenState, hasChanges]);

  const handleConfirmCancel = useCallback(() => {
    setEditData(region);
    setImagePreview(region?.image || "");
    setTimeline(originalTimeline);
    setSectionVisibility(originalSectionVisibility);
    setAdvancedSectionOpen(originalAdvancedSectionOpen);
    setTimelineSectionOpen(originalTimelineSectionOpen);
    setExtraSectionsOpenState(originalExtraSectionsOpenState);
    setErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [region, originalTimeline, originalSectionVisibility, originalAdvancedSectionOpen, originalTimelineSectionOpen, originalExtraSectionsOpenState]);

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
    // If came from a map, go back to that map
    if (fromMapId) {
      navigate({
        to: "/dashboard/$dashboardId/tabs/world/$regionId/map",
        params: { dashboardId, regionId: fromMapId },
        search: fromMapVersionId ? { versionId: fromMapVersionId } : undefined,
      });
    } else {
      // Otherwise go back to world tab
      navigateToWorldTab();
    }
  }, [fromMapId, fromMapVersionId, navigate, dashboardId, navigateToWorldTab]);

  const handleViewMap = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/world/$regionId/map",
      params: { dashboardId, regionId },
    });
  }, [navigate, dashboardId, regionId]);

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
    // Capture current states when entering edit mode
    setOriginalSectionVisibility(sectionVisibility);
    setOriginalAdvancedSectionOpen(advancedSectionOpen);
    setOriginalTimelineSectionOpen(timelineSectionOpen);
    setOriginalTimeline(timeline);
    setOriginalExtraSectionsOpenState(extraSectionsOpenState);
  }, [sectionVisibility, advancedSectionOpen, timelineSectionOpen, timeline, extraSectionsOpenState]);

  const handleExtraSectionsOpenStateChange = useCallback((newState: Record<string, boolean>) => {
    const newUiState = {
      advancedSectionOpen: advancedSectionOpenRef.current,
      timelineSectionOpen: timelineSectionOpenRef.current,
      sectionVisibility: { ...sectionVisibilityRef.current },
      extraSectionsOpenState: { ...newState },
    };
    setExtraSectionsOpenState(newState);
    setUIStateInStore("regions", regionId, newUiState);
  }, [regionId, setUIStateInStore]);

  const handleDeleteModalOpen = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleEditDataChange = useCallback((field: string, value: unknown) => {
    setEditData((prev) => ({ ...prev, [field]: value }));

    // Update image preview when image field changes
    if (field === "image") {
      setImagePreview(value as string);
    }
  }, []);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => {
      const newValue = !prev;

      // Deep copy to avoid reference sharing, use refs to avoid stale closures
      setUIStateInStore("regions", regionId, {
        advancedSectionOpen: newValue,
        timelineSectionOpen: timelineSectionOpenRef.current,
        sectionVisibility: { ...sectionVisibilityRef.current },
        extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
      });

      return newValue;
    });
  }, [regionId, setUIStateInStore]);

  const handleTimelineSectionToggle = useCallback(() => {
    setTimelineSectionOpen((prev) => {
      const newValue = !prev;

      // Deep copy to avoid reference sharing, use refs to avoid stale closures
      setUIStateInStore("regions", regionId, {
        advancedSectionOpen: advancedSectionOpenRef.current,
        timelineSectionOpen: newValue,
        sectionVisibility: { ...sectionVisibilityRef.current },
        extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
      });

      return newValue;
    });
  }, [regionId, setUIStateInStore]);

  const handleTimelineChange = useCallback((newTimeline: ITimelineEra[]) => {
    setTimeline(newTimeline);
  }, []);

  const handleSectionVisibilityToggle = useCallback((sectionName: string) => {
    setSectionVisibility((prev) => {
      const newVisibility = toggleSectionVisibility(sectionName, prev);
      sectionVisibilityRef.current = newVisibility;

      // Deep copy to avoid reference sharing, use refs to avoid stale closures
      setUIStateInStore("regions", regionId, {
        advancedSectionOpen: advancedSectionOpenRef.current,
        timelineSectionOpen: timelineSectionOpenRef.current,
        sectionVisibility: { ...newVisibility },
        extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
      });

      return newVisibility;
    });
  }, [regionId, setUIStateInStore]);

  // Don't render until we have the region data loaded
  if (!region) {
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
        entityId={regionId}
        entityType="region"
        bookId={dashboardId}
      />

      <RegionDetailView
        region={region}
        editData={editData}
        isEditing={isEditing}
        hasChanges={hasChanges}
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
        sectionVisibility={sectionVisibility}
        hasChapterMetrics={hasChapterMetrics}
        setHasChapterMetrics={setHasChapterMetrics}
        onTimelineChange={handleTimelineChange}
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
        onImageFileChange={handleImageFileChange}
        onEditDataChange={handleEditDataChange}
        onAdvancedSectionToggle={handleAdvancedSectionToggle}
        onTimelineSectionToggle={handleTimelineSectionToggle}
        isLogsModalOpen={isLogsModalOpen}
        onLogsModalToggle={() => setIsLogsModalOpen(!isLogsModalOpen)}
        extraSectionsOpenState={extraSectionsOpenState}
        onExtraSectionsOpenStateChange={handleExtraSectionsOpenStateChange}
      />
    </>
  );
}
