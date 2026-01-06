import { useState, useCallback, useMemo, useEffect, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { ITEM_CATEGORIES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-categories";
import { ITEM_STATUSES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-statuses";
import { STORY_RARITIES_CONSTANT } from "@/components/modals/create-item-modal/constants/story-rarities";
import { type ItemFormSchema } from "@/components/modals/create-item-modal/hooks/use-item-validation";
import { EntityLogsModal } from "@/components/modals/entity-logs-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  getItemById,
  getItemsByBookId,
  updateItem,
  type IItem,
} from "@/lib/db/items.service";
import { ItemSchema, ItemSchemaBase } from "@/lib/validation/item-schema";
import { useItemsStore } from "@/stores/items-store";
import { useEntityUIStateStore } from "@/stores/entity-ui-state-store";
import { type IFieldVisibility } from "@/types/character-types";

import { UnsavedChangesDialog } from "./components/unsaved-changes-dialog";
import { ItemDetailView } from "./view";

export default function ItemDetail() {
  const { itemId, dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/item/$itemId/",
  });
  const navigate = useNavigate();
  const { t } = useTranslation("item-detail");

  // Usar o store para atualizar itens
  const updateItemInStore = useItemsStore((state) => state.updateItemInCache);
  const deleteItemFromStore = useItemsStore(
    (state) => state.deleteItemFromCache
  );

  // Entity UI State store
  const getUIState = useEntityUIStateStore((state) => state.getUIState);
  const setUIStateInStore = useEntityUIStateStore((state) => state.setUIState);

  const emptyItem: IItem = {
    id: "",
    name: "",
    status: "",
    category: "",
    basicDescription: "",
    image: "",
    appearance: "",
    origin: "",
    alternativeNames: [],
    storyRarity: "",
    narrativePurpose: "",
    usageRequirements: "",
    usageConsequences: "",
    fieldVisibility: {},
    createdAt: new Date().toISOString(),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [item, setItem] = useState<IItem>(emptyItem);
  const [editData, setEditData] = useState<IItem>(emptyItem);
  const [imagePreview, setImagePreview] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
  const [sectionVisibility, setSectionVisibility] = useState<
    Record<string, boolean>
  >({});
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    alternativeNames: false,
  });
  const [hasChapterMetrics, setHasChapterMetrics] = useState<boolean | null>(
    null
  );
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Original states for comparison
  const [originalFieldVisibility, setOriginalFieldVisibility] =
    useState<IFieldVisibility>({});
  const [originalSectionVisibility, setOriginalSectionVisibility] = useState<
    Record<string, boolean>
  >({});
  const [originalAdvancedSectionOpen, setOriginalAdvancedSectionOpen] = useState(false);
  const [extraSectionsOpenState, setExtraSectionsOpenState] = useState<
    Record<string, boolean>
  >({});
  const [originalExtraSectionsOpenState, setOriginalExtraSectionsOpenState] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [allItems, setAllItems] = useState<IItem[]>([]);

  // Refs to always have current values (avoid stale closures)
  const advancedSectionOpenRef = useRef(advancedSectionOpen);
  const sectionVisibilityRef = useRef(sectionVisibility);
  const extraSectionsOpenStateRef = useRef(extraSectionsOpenState);

  // Keep refs in sync with state
  useEffect(() => {
    advancedSectionOpenRef.current = advancedSectionOpen;
  }, [advancedSectionOpen]);

  useEffect(() => {
    sectionVisibilityRef.current = sectionVisibility;
  }, [sectionVisibility]);

  useEffect(() => {
    extraSectionsOpenStateRef.current = extraSectionsOpenState;
  }, [extraSectionsOpenState]);

  useEffect(() => {
    const loadItem = async () => {
      // CRITICAL: Reset ALL UI states immediately when itemId changes
      // (component is not unmounted when navigating between items)
      setSectionVisibility({});
      setAdvancedSectionOpen(false);
      setOriginalSectionVisibility({});
      setOriginalAdvancedSectionOpen(false);
      setExtraSectionsOpenState({});
      setOriginalExtraSectionsOpenState({});
      sectionVisibilityRef.current = {};
      extraSectionsOpenStateRef.current = {};

      try {
        const itemFromDB = await getItemById(itemId);
        if (itemFromDB) {
          setItem(itemFromDB);
          setEditData(itemFromDB);
          setImagePreview(itemFromDB.image || "");
          setFieldVisibility(itemFromDB.fieldVisibility || {});
          setOriginalFieldVisibility(itemFromDB.fieldVisibility || {});

          // Priority 1: Check in-memory cache
          let cachedUIState = getUIState("items", itemId);

          // Priority 2: Load from database if not in cache
          if (!cachedUIState && itemFromDB.uiState) {
            cachedUIState = itemFromDB.uiState;
            // Save to cache for future use
            setUIStateInStore("items", itemId, cachedUIState);
          }

          // Priority 3: Use defaults if no cache and no database value
          if (!cachedUIState) {
            // Create NEW object references for each entity (prevent sharing)
            cachedUIState = {
              advancedSectionOpen: false,
              sectionVisibility: {}, // New object reference
              extraSectionsOpenState: {}, // New object reference
            };
            // Save defaults to cache
            setUIStateInStore("items", itemId, cachedUIState);
          }

          // Apply UI state to local state (deep copy to avoid reference sharing)
          const loadedAdvancedSectionOpen =
            cachedUIState.advancedSectionOpen ?? false;
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
          setSectionVisibility(sectionVisibilityCopy);
          setOriginalSectionVisibility(sectionVisibilityOriginalCopy);
          setExtraSectionsOpenState(extraSectionsOpenStateCopy);
          setOriginalExtraSectionsOpenState(extraSectionsOpenStateOriginalCopy);

          if (dashboardId) {
            const allItemsFromBook = await getItemsByBookId(dashboardId);
            setAllItems(allItemsFromBook);
          }
        }
      } catch (error) {
        console.error("Error loading item:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [itemId, dashboardId, getUIState, setUIStateInStore]);

  const currentCategory = useMemo(
    () => ITEM_CATEGORIES_CONSTANT.find((c) => c.value === item.category),
    [item.category]
  );
  const currentStatus = useMemo(
    () => ITEM_STATUSES_CONSTANT.find((s) => s.value === item.status),
    [item.status]
  );
  const currentRarity = useMemo(
    () => STORY_RARITIES_CONSTANT.find((r) => r.value === item.storyRarity),
    [item.storyRarity]
  );

  // Função de validação de campo individual (onBlur)
  const validateField = useCallback(
    (field: string, value: unknown) => {
      try {
        // Validar apenas este campo usando safeParse
        const result =
          ItemSchemaBase.shape[
            field as keyof typeof ItemSchemaBase.shape
          ]?.safeParse(value);

        if (!result) {
          // Campo não tem validação específica
          return true;
        }

        if (result.success) {
          // Se passou, remover erro
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
          });
          return true;
        }

        // Traduzir a mensagem de erro
        const errorMessage = result.error.errors[0].message;
        const translatedMessage = errorMessage.startsWith("item-detail:")
          ? t(errorMessage)
          : errorMessage;

        setErrors((prev) => ({
          ...prev,
          [field]: translatedMessage,
        }));
        return false;
      } catch (error) {
        console.error("Error validating field:", field, error);
        return false;
      }
    },
    [t]
  );

  // Verificar se customCategory está inválida
  const isCustomCategoryInvalid = useMemo(() => {
    if (!editData) return false;
    return (
      editData.category === "other" &&
      (!editData.customCategory || editData.customCategory.trim().length === 0)
    );
  }, [editData]);

  // Verificar se tem campos obrigatórios vazios e quais são
  const { hasRequiredFieldsEmpty, missingFields } = useMemo(() => {
    if (!editData) return { hasRequiredFieldsEmpty: false, missingFields: [] };

    const requiredFields = {
      name: editData.name,
      status: editData.status,
      category: editData.category,
      basicDescription: editData.basicDescription,
    };

    const result = ItemSchemaBase.pick({
      name: true,
      status: true,
      category: true,
      basicDescription: true,
    }).safeParse(requiredFields);

    let missing: string[] = [];

    if (!result.success) {
      missing = result.error.errors.map((e) => e.path[0] as string);
    }

    // Verificar se categoria "outro" está sem customCategory preenchida
    if (editData.category === "other" && !editData.customCategory?.trim()) {
      if (!missing.includes("customCategory")) {
        missing.push("customCategory");
      }
    }

    return {
      hasRequiredFieldsEmpty: missing.length > 0,
      missingFields: missing,
    };
  }, [editData]);

  // Check if there are changes between item and editData
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

    // Check if visibility has changed
    if (visibilityChanged(fieldVisibility, originalFieldVisibility))
      return true;

    // Helper function to compare arrays
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
    if (item.name !== editData.name) return true;
    if (item.status !== editData.status) return true;
    if (item.category !== editData.category) return true;
    if (item.basicDescription !== editData.basicDescription) return true;
    if (item.image !== editData.image) return true;
    if (item.customCategory !== editData.customCategory) return true;

    // Compare advanced fields
    if (item.appearance !== editData.appearance) return true;
    if (item.origin !== editData.origin) return true;
    if (item.storyRarity !== editData.storyRarity) return true;
    if (item.narrativePurpose !== editData.narrativePurpose) return true;
    if (item.usageRequirements !== editData.usageRequirements) return true;
    if (item.usageConsequences !== editData.usageConsequences) return true;

    // Compare arrays
    if (!arraysEqual(item.alternativeNames, editData.alternativeNames))
      return true;

    // Check if section visibility has changed
    if (
      JSON.stringify(sectionVisibility) !==
      JSON.stringify(originalSectionVisibility)
    )
      return true;

    // Check if advanced section state has changed
    if (advancedSectionOpen !== originalAdvancedSectionOpen) return true;

    return false;
  }, [
    item,
    editData,
    isEditing,
    fieldVisibility,
    originalFieldVisibility,
    sectionVisibility,
    originalSectionVisibility,
    advancedSectionOpen,
    originalAdvancedSectionOpen,
  ]);

  const handleSave = useCallback(async () => {
    try {
      // Validar TUDO com Zod
      ItemSchema.parse({
        name: editData.name,
        status: editData.status,
        category: editData.category,
        basicDescription: editData.basicDescription,
        image: editData.image,
        customCategory: editData.customCategory,
        appearance: editData.appearance,
        origin: editData.origin,
        storyRarity: editData.storyRarity,
        narrativePurpose: editData.narrativePurpose,
        usageRequirements: editData.usageRequirements,
        usageConsequences: editData.usageConsequences,
        alternativeNames: editData.alternativeNames,
      });

      const updatedItem = {
        ...editData,
        fieldVisibility,
        // sectionVisibility removed - now only saved in uiState
        uiState: {
          advancedSectionOpen,
          sectionVisibility: sectionVisibilityRef.current,
          extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
        },
      };
      setItem(updatedItem);
      setImagePreview(updatedItem.image || "");

      // Salvar no banco de dados
      await updateItem(itemId, updatedItem);
      // Atualizar cache do store para refletir mudanças na listagem
      await updateItemInStore(itemId, updatedItem);

      // Update original visibility to match saved state
      setOriginalFieldVisibility(fieldVisibility);
      setOriginalSectionVisibility(sectionVisibility);
      setOriginalAdvancedSectionOpen(advancedSectionOpen);
      setOriginalExtraSectionsOpenState(extraSectionsOpenState);

      setErrors({}); // Limpar erros
      setIsEditing(false);
    } catch (error) {
      console.error("[handleSave] Error caught:", error);
      if (error instanceof z.ZodError) {
        console.error("[handleSave] Zod validation errors:", error.errors);
        // Mapear erros para cada campo
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          const errorMessage = err.message;
          newErrors[field] = errorMessage.startsWith("item-detail:")
            ? t(errorMessage)
            : errorMessage;
        });
        setErrors(newErrors);
      } else {
        console.error("Error saving item:", error);
      }
    }
  }, [editData, fieldVisibility, itemId, updateItemInStore, t]);

  const navigateToItemsTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (!dashboardId) return;
      await deleteItemFromStore(dashboardId, itemId);
      navigateToItemsTab();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }, [navigateToItemsTab, itemId, dashboardId, deleteItemFromStore]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditData(item);
    setImagePreview(item.image || "");
    setFieldVisibility(originalFieldVisibility);
    setSectionVisibility(originalSectionVisibility);
    setAdvancedSectionOpen(originalAdvancedSectionOpen);
    setExtraSectionsOpenState(originalExtraSectionsOpenState);
    setErrors({});
    setIsEditing(false);
  }, [item, originalFieldVisibility, originalSectionVisibility, originalAdvancedSectionOpen, originalExtraSectionsOpenState, hasChanges]);

  const handleConfirmCancel = useCallback(() => {
    setEditData(item);
    setImagePreview(item.image || "");
    setFieldVisibility(originalFieldVisibility);
    setSectionVisibility(originalSectionVisibility);
    setAdvancedSectionOpen(originalAdvancedSectionOpen);
    setExtraSectionsOpenState(originalExtraSectionsOpenState);
    setErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [item, originalFieldVisibility, originalSectionVisibility, originalAdvancedSectionOpen, originalExtraSectionsOpenState]);

  const handleBack = useCallback(() => {
    navigateToItemsTab();
  }, [navigateToItemsTab]);

  const handleNavigationSidebarToggle = useCallback(() => {
    setIsNavigationSidebarOpen((prev) => !prev);
  }, []);

  const handleNavigationSidebarClose = useCallback(() => {
    setIsNavigationSidebarOpen(false);
  }, []);

  const handleItemSelect = useCallback(
    (itemId: string) => {
      if (!dashboardId) return;
      navigate({
        to: "/dashboard/$dashboardId/tabs/item/$itemId",
        params: { dashboardId, itemId },
      });
    },
    [navigate, dashboardId]
  );

  const handleEdit = useCallback(() => {
    setOriginalSectionVisibility(sectionVisibility);
    setOriginalAdvancedSectionOpen(advancedSectionOpen);
    setOriginalExtraSectionsOpenState(extraSectionsOpenState);
    setIsEditing(true);
    setIsNavigationSidebarOpen(false);
  }, [sectionVisibility, advancedSectionOpen, extraSectionsOpenState]);

  const handleExtraSectionsOpenStateChange = useCallback((newState: Record<string, boolean>) => {
    const newUiState = {
      advancedSectionOpen: advancedSectionOpenRef.current,
      sectionVisibility: { ...sectionVisibilityRef.current },
      extraSectionsOpenState: { ...newState },
    };
    setExtraSectionsOpenState(newState);
    setUIStateInStore("items", itemId, newUiState);
  }, [itemId, setUIStateInStore]);

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

  const handleFieldVisibilityToggle = useCallback((field: string) => {
    setFieldVisibility((prev) => {
      // Trata undefined como true (visível), então inverte corretamente
      const currentValue = prev[field] !== false;
      return {
        ...prev,
        [field]: !currentValue,
      };
    });
  }, []);

  const handleSectionVisibilityToggle = useCallback((sectionId: string) => {
    setSectionVisibility((prev) => {
      const newVisibility = {
        ...prev,
        [sectionId]: prev[sectionId] === false ? true : false,
      };

      // Deep copy to avoid reference sharing, use refs to avoid stale closures
      setUIStateInStore("items", itemId, {
        advancedSectionOpen: advancedSectionOpenRef.current,
        sectionVisibility: { ...newVisibility },
        extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
      });

      return newVisibility;
    });
  }, [itemId, setUIStateInStore]);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => {
      const newValue = !prev;

      // Deep copy to avoid reference sharing, use refs to avoid stale closures
      setUIStateInStore("items", itemId, {
        advancedSectionOpen: newValue,
        sectionVisibility: { ...sectionVisibilityRef.current },
        extraSectionsOpenState: { ...extraSectionsOpenStateRef.current },
      });

      return newValue;
    });
  }, [itemId, setUIStateInStore]);

  const toggleSection = useCallback((sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  }, []);

  // Loading state
  if (isLoading) {
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
        entityId={itemId}
        entityType="item"
        bookId={dashboardId}
      />

      <ItemDetailView
        item={item}
        editData={editData}
        isEditing={isEditing}
        showDeleteModal={showDeleteModal}
        isNavigationSidebarOpen={isNavigationSidebarOpen}
        allItems={allItems}
        categories={ITEM_CATEGORIES_CONSTANT}
        statuses={ITEM_STATUSES_CONSTANT}
        rarities={STORY_RARITIES_CONSTANT}
        currentCategory={currentCategory}
        currentStatus={currentStatus}
        currentRarity={currentRarity}
        hasChanges={hasChanges}
        hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
        missingFields={missingFields}
        errors={errors}
        fieldVisibility={fieldVisibility}
        advancedSectionOpen={advancedSectionOpen}
        openSections={openSections}
        customCategoryError={
          isCustomCategoryInvalid
            ? t("item-detail:validation.custom_category_required")
            : undefined
        }
        isValid={!hasRequiredFieldsEmpty && !isCustomCategoryInvalid}
        hasChapterMetrics={hasChapterMetrics}
        onBack={handleBack}
        onNavigationSidebarToggle={handleNavigationSidebarToggle}
        onNavigationSidebarClose={handleNavigationSidebarClose}
        onItemSelect={handleItemSelect}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDeleteModalOpen={handleDeleteModalOpen}
        onDeleteModalClose={handleDeleteModalClose}
        onConfirmDelete={handleConfirmDelete}
        onEditDataChange={handleEditDataChange}
        validateField={validateField}
        onFieldVisibilityToggle={handleFieldVisibilityToggle}
        sectionVisibility={sectionVisibility}
        onSectionVisibilityToggle={handleSectionVisibilityToggle}
        onAdvancedSectionToggle={handleAdvancedSectionToggle}
        toggleSection={toggleSection}
        setHasChapterMetrics={setHasChapterMetrics}
        isLogsModalOpen={isLogsModalOpen}
        onLogsModalToggle={() => setIsLogsModalOpen(!isLogsModalOpen)}
        extraSectionsOpenState={extraSectionsOpenState}
        onExtraSectionsOpenStateChange={handleExtraSectionsOpenStateChange}
      />
    </>
  );
}
