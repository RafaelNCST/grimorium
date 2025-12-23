import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { Shield, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { EntityLogsModal } from "@/components/modals/entity-logs-modal";
import { getFactionById } from "@/lib/db/factions.service";
import { FactionSchema } from "@/lib/validation/faction-schema";
import { useCharactersStore } from "@/stores/characters-store";
import { useFactionsStore } from "@/stores/factions-store";
import { useItemsStore } from "@/stores/items-store";
import { useRacesStore } from "@/stores/races-store";
import { type IFaction, type IFactionUIState } from "@/types/faction-types";

import { UnsavedChangesDialog } from "./components/unsaved-changes-dialog";
import { FactionDetailView } from "./view";

export function FactionDetail() {
  const { dashboardId, factionId } = useParams({
    from: "/dashboard/$dashboardId/tabs/faction/$factionId",
  });
  const navigate = useNavigate();
  const { t } = useTranslation("faction-detail");

  // Stores
  const updateFactionInStore = useFactionsStore(
    (state) => state.updateFactionInCache
  );
  const deleteFactionFromStore = useFactionsStore(
    (state) => state.deleteFactionFromCache
  );
  const factionsCache = useFactionsStore((state) => state.cache);
  const racesCache = useRacesStore((state) => state.cache);
  const charactersCache = useCharactersStore((state) => state.cache);
  const itemsCache = useItemsStore((state) => state.cache);

  const emptyFaction: IFaction = {
    id: "",
    bookId: dashboardId,
    name: "",
    summary: "",
    status: "active",
    factionType: "commercial",
    createdAt: new Date().toISOString(),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [faction, setFaction] = useState<IFaction>(emptyFaction);
  const [editData, setEditData] = useState<IFaction>(emptyFaction);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [hasChapterMetrics, setHasChapterMetrics] = useState<boolean | null>(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [uiState, setUiState] = useState<IFactionUIState>(() => {
    const stored = localStorage.getItem("factionDetailAdvancedSectionOpen");
    return {
      advancedSectionOpen: stored ? JSON.parse(stored) : false,
      sectionVisibility: { timeline: true, hierarchy: true },
    };
  });
  const [originalUiState, setOriginalUiState] = useState<IFactionUIState>({
    advancedSectionOpen: false,
    sectionVisibility: { timeline: true, hierarchy: true },
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uiStateRef = useRef<IFactionUIState>(uiState);

  // Keep ref in sync with state
  useEffect(() => {
    uiStateRef.current = uiState;
  }, [uiState]);

  // Save advanced section state to localStorage (UI preference, not data)
  useEffect(() => {
    localStorage.setItem(
      "factionDetailAdvancedSectionOpen",
      JSON.stringify(uiState.advancedSectionOpen)
    );
  }, [uiState.advancedSectionOpen]);

  // Função de validação de campo individual (onBlur)
  const validateField = useCallback(
    (field: string, value: any) => {
      try {
        // Validar apenas este campo
        const fieldSchema = FactionSchema.pick({ [field]: true } as any);
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
          const translatedMessage = errorMessage.startsWith("faction-detail:")
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
      FactionSchema.pick({
        name: true,
        summary: true,
        status: true,
        factionType: true,
      } as any).parse({
        name: editData.name,
        summary: editData.summary,
        status: editData.status,
        factionType: editData.factionType,
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

  // Check if there are changes between faction and editData
  const hasChanges = useMemo(() => {
    if (!isEditing) return false;

    // Exclude uiState from data comparison to avoid duplicate checks
    const { uiState: _factionUiState, ...factionData } = faction;
    const { uiState: _editDataUiState, ...editDataData } = editData;

    // Check if data has changed (excluding uiState)
    const dataChanged = JSON.stringify(factionData) !== JSON.stringify(editDataData);

    // Check if UI state has changed (section visibility)
    const uiStateChanged = JSON.stringify(uiState.sectionVisibility) !== JSON.stringify(originalUiState.sectionVisibility);

    return dataChanged || uiStateChanged;
  }, [isEditing, faction, editData, uiState.sectionVisibility, originalUiState.sectionVisibility]);

  // Load faction from database
  useEffect(() => {
    const loadFaction = async () => {
      try {
        const factionFromDB = await getFactionById(factionId);
        if (factionFromDB) {
          setFaction(factionFromDB);
          setEditData(factionFromDB);
          setImagePreview(factionFromDB.image || "");

          // Load section visibility from database (olhinho - per faction)
          // But keep advancedSectionOpen from localStorage (setinha - global preference)
          const stored = localStorage.getItem("factionDetailAdvancedSectionOpen");
          const loadedUiState = {
            advancedSectionOpen: stored ? JSON.parse(stored) : false,
            sectionVisibility: factionFromDB.uiState?.sectionVisibility ?? {
              timeline: true,
              hierarchy: true,
            },
          };
          setUiState(loadedUiState);
          setOriginalUiState(loadedUiState);

          console.log('[Faction Load] factionFromDB.uiState:', factionFromDB.uiState);
          console.log('[Faction Load] loadedUiState:', loadedUiState);
        }
      } catch (error) {
        console.error("Error loading faction:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFaction();
  }, [factionId]);

  // Get races for the current book
  const races = useMemo(() => {
    if (!dashboardId) return [];
    const bookRaces = racesCache[dashboardId]?.races || [];
    return bookRaces.map((race) => ({
      id: race.id,
      name: race.name,
    }));
  }, [dashboardId, racesCache]);

  // Get characters for the current book
  const characters = useMemo(() => {
    if (!dashboardId) return [];
    const bookCharacters = charactersCache[dashboardId]?.characters || [];
    return bookCharacters.map((char) => ({
      id: char.id,
      name: char.name,
    }));
  }, [dashboardId, charactersCache]);

  // Get factions for the current book
  const factions = useMemo(() => {
    if (!dashboardId) return [];
    const bookFactions = factionsCache[dashboardId]?.factions || [];
    return bookFactions.map((faction) => ({
      id: faction.id,
      name: faction.name,
      image: faction.image,
    }));
  }, [dashboardId, factionsCache]);

  // Get items for the current book
  const items = useMemo(() => {
    if (!dashboardId) return [];
    const bookItems = itemsCache[dashboardId]?.items || [];
    return bookItems.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
    }));
  }, [dashboardId, itemsCache]);

  // Get current status, type, influence, reputation
  const currentStatus = useMemo(
    () => FACTION_STATUS_CONSTANT.find((s) => s.value === faction.status),
    [faction.status]
  );
  const currentType = useMemo(
    () => FACTION_TYPES_CONSTANT.find((t) => t.value === faction.factionType),
    [faction.factionType]
  );

  const handleSave = useCallback(async () => {
    try {
      // Validar TUDO com Zod
      const _validatedData = FactionSchema.parse({
        name: editData.name,
        summary: editData.summary,
        status: editData.status,
        factionType: editData.factionType,
        governmentForm: editData.governmentForm,
        economy: editData.economy,
        symbolsAndSecrets: editData.symbolsAndSecrets,
        factionMotto: editData.factionMotto,
        uniformAndAesthetics: editData.uniformAndAesthetics,
        foundationDate: editData.foundationDate,
        foundationHistorySummary: editData.foundationHistorySummary,
        organizationObjectives: editData.organizationObjectives,
        narrativeImportance: editData.narrativeImportance,
        inspirations: editData.inspirations,
        alignment: editData.alignment,
        rulesAndLaws: editData.rulesAndLaws,
        mainResources: editData.mainResources,
        currencies: editData.currencies,
        dominatedAreas: editData.dominatedAreas,
        mainBase: editData.mainBase,
        areasOfInterest: editData.areasOfInterest,
        traditionsAndRituals: editData.traditionsAndRituals,
        beliefsAndValues: editData.beliefsAndValues,
        languagesUsed: editData.languagesUsed,
        races: editData.races,
        founders: editData.founders,
        influence: editData.influence,
        publicReputation: editData.publicReputation,
        militaryPower: editData.militaryPower,
        politicalPower: editData.politicalPower,
        culturalPower: editData.culturalPower,
        economicPower: editData.economicPower,
        timeline: editData.timeline,
        hierarchy: editData.hierarchy,
      });

      // Use ref to get the most recent uiState (setUiState is async)
      const currentUiState = uiStateRef.current;
      const updatedFaction = { ...editData, uiState: currentUiState };
      setFaction(updatedFaction);

      console.log('[Faction Save] currentUiState from ref:', currentUiState);
      console.log('[Faction Save] updatedFaction.uiState:', updatedFaction.uiState);

      await updateFactionInStore(factionId, updatedFaction);

      setErrors({}); // Limpar erros
      setIsEditing(false);
      // Update original UI state after successful save (use ref for most recent value)
      setOriginalUiState(currentUiState);
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
          const translatedMessage = errorMessage.startsWith("faction-detail:")
            ? t(errorMessage)
            : errorMessage;
          newErrors[field] = translatedMessage;
        });
        setErrors(newErrors);
      } else {
        console.error("Error saving faction:", error);
      }
    }
  }, [editData, factionId, updateFactionInStore, t]);

  const navigateToFactionsTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (!dashboardId) return;
      await deleteFactionFromStore(dashboardId, factionId);
      navigateToFactionsTab();
    } catch (error) {
      console.error("Error deleting faction:", error);
    }
  }, [navigateToFactionsTab, factionId, dashboardId, deleteFactionFromStore]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditData({ ...faction });
    setImagePreview(faction.image || "");
    setUiState(originalUiState);
    setErrors({});
    setIsEditing(false);
  }, [faction, hasChanges, originalUiState]);

  const handleConfirmCancel = useCallback(() => {
    setEditData({ ...faction });
    setImagePreview(faction.image || "");
    setUiState(originalUiState);
    setErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [faction, originalUiState]);

  const handleBack = useCallback(() => {
    navigateToFactionsTab();
  }, [navigateToFactionsTab]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setIsNavigationOpen(false);
    // Capture current UI state when entering edit mode
    setOriginalUiState(uiState);
  }, [uiState]);

  const handleDeleteModalOpen = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleNavigationToggle = useCallback(() => {
    setIsNavigationOpen((prev) => !prev);
  }, []);

  const handleNavigationClose = useCallback(() => {
    setIsNavigationOpen(false);
  }, []);

  const handleEditDataChange = useCallback(
    (field: string, value: unknown) => {
      setEditData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field when user starts typing (for required fields)
      if (errors[field]) {
        // Re-validate the field to clear error if value is now valid
        try {
          const fieldSchema = FactionSchema.pick({ [field]: true } as any);
          fieldSchema.parse({ [field]: value });
          // If validation passes, clear the error
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
        } catch {
          // Keep the error if still invalid (will be shown properly on blur)
        }
      }
    },
    [errors]
  );

  const _handleImageChange = useCallback((image: string) => {
    setImagePreview(image);
    setEditData((prev) => ({ ...prev, image }));
  }, []);

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

  const handleAdvancedSectionToggle = useCallback(() => {
    const newUiState = {
      ...uiState,
      advancedSectionOpen: !uiState.advancedSectionOpen,
    };
    setUiState(newUiState);
  }, [uiState]);


  const handleSectionVisibilityChange = useCallback(
    (sectionName: string, isVisible: boolean) => {
      console.log('[handleSectionVisibilityChange] sectionName:', sectionName, 'isVisible:', isVisible);
      console.log('[handleSectionVisibilityChange] current uiState:', uiState);

      const newUiState = {
        ...uiState,
        sectionVisibility: {
          ...uiState.sectionVisibility,
          [sectionName]: isVisible,
        },
      };

      console.log('[handleSectionVisibilityChange] newUiState:', newUiState);
      setUiState(newUiState);
    },
    [uiState]
  );


  const handleFactionSelect = useCallback(
    (newFactionId: string) => {
      if (!dashboardId) return;
      navigate({
        to: "/dashboard/$dashboardId/tabs/faction/$factionId",
        params: { dashboardId, factionId: newFactionId },
      });
    },
    [navigate, dashboardId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!faction.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t("not_found.title")}</h2>
          <p className="text-muted-foreground mb-4">
            {t("not_found.description")}
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            {t("buttons.back")}
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = currentStatus?.icon || Shield;
  const TypeIcon = currentType?.icon || Building2;

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
        entityId={factionId}
        entityType="faction"
        bookId={dashboardId}
      />

      <FactionDetailView
        faction={faction}
        editData={editData}
        isEditing={isEditing}
        showDeleteModal={showDeleteModal}
        isNavigationSidebarOpen={isNavigationOpen}
        imagePreview={imagePreview}
        advancedSectionOpen={uiState.advancedSectionOpen ?? false}
        sectionVisibility={
          uiState.sectionVisibility ?? {
            timeline: true,
            hierarchy: true,
          }
        }
        mockRaces={races}
        mockCharacters={characters}
        mockFactions={factions}
        mockItems={items}
        statuses={FACTION_STATUS_CONSTANT}
        types={FACTION_TYPES_CONSTANT}
        currentStatus={currentStatus}
        currentType={currentType}
        StatusIcon={StatusIcon}
        TypeIcon={TypeIcon}
        fileInputRef={fileInputRef}
        bookId={dashboardId}
        errors={errors}
        validateField={validateField}
        hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
        missingFields={missingFields}
        hasChapterMetrics={hasChapterMetrics}
        setHasChapterMetrics={setHasChapterMetrics}
        onBack={handleBack}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDeleteModalOpen={handleDeleteModalOpen}
        onDeleteModalClose={handleDeleteModalClose}
        onConfirmDelete={handleConfirmDelete}
        onNavigationSidebarToggle={handleNavigationToggle}
        onNavigationSidebarClose={handleNavigationClose}
        onFactionSelect={handleFactionSelect}
        onEditDataChange={handleEditDataChange}
        onImageFileChange={handleImageFileChange}
        onAdvancedSectionToggle={handleAdvancedSectionToggle}
        onSectionVisibilityChange={handleSectionVisibilityChange}
        hasChanges={hasChanges}
        isLogsModalOpen={isLogsModalOpen}
        onLogsModalToggle={() => setIsLogsModalOpen(!isLogsModalOpen)}
      />
    </>
  );
}
