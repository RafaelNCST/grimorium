import { useState, useCallback, useMemo, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  getItemById,
  getItemsByBookId,
  getItemVersions,
  createItemVersion,
  deleteItemVersion,
  updateItemVersion,
  updateItem,
  updateItemVersionData,
  type IItem,
  type IItemVersion,
} from "@/lib/db/items.service";
import { ItemSchema, ItemSchemaBase } from "@/lib/validation/item-schema";
import { useItemsStore } from "@/stores/items-store";
import { type IFieldVisibility } from "@/types/character-types";

import { ITEM_CATEGORIES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-categories";
import { ITEM_STATUSES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-statuses";
import { STORY_RARITIES_CONSTANT } from "@/components/modals/create-item-modal/constants/story-rarities";
import { type ItemFormSchema } from "@/components/modals/create-item-modal/hooks/use-item-validation";
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
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(() => {
    const stored = localStorage.getItem("itemDetailAdvancedSectionOpen");
    return stored ? JSON.parse(stored) : false;
  });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    alternativeNames: false,
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Original states for comparison
  const [originalFieldVisibility, setOriginalFieldVisibility] =
    useState<IFieldVisibility>({});
  const [versions, setVersions] = useState<IItemVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<IItemVersion | null>(
    null
  );
  const [_isLoading, setIsLoading] = useState(true);
  const [allItems, setAllItems] = useState<IItem[]>([]);

  // Save advanced section state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "itemDetailAdvancedSectionOpen",
      JSON.stringify(advancedSectionOpen)
    );
  }, [advancedSectionOpen]);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const itemFromDB = await getItemById(itemId);
        if (itemFromDB) {
          setItem(itemFromDB);
          setEditData(itemFromDB);
          setFieldVisibility(itemFromDB.fieldVisibility || {});
          setOriginalFieldVisibility(itemFromDB.fieldVisibility || {});

          // Carregar versões do banco de dados
          const versionsFromDB = await getItemVersions(itemId);

          // Check if main version exists
          const hasMainVersion = versionsFromDB.some((v) => v.isMain);

          if (!hasMainVersion) {
            // Create main version if it doesn't exist
            const mainVersion: IItemVersion = {
              id: "main-version",
              name: "Versão Principal",
              description: "Versão principal do item",
              createdAt: new Date().toISOString(),
              isMain: true,
              itemData: itemFromDB,
            };

            await createItemVersion(itemId, mainVersion);

            // Add main version to the array
            const allVersions = [mainVersion, ...versionsFromDB];
            setVersions(allVersions);
            setCurrentVersion(mainVersion);
          } else {
            // Main version exists, update it with fresh data
            const updatedVersions = versionsFromDB.map((v) =>
              v.isMain
                ? {
                    ...v,
                    itemData: itemFromDB,
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
  }, [itemId, dashboardId]);

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
  const validateField = useCallback((field: string, value: unknown) => {
    try {
      // Validar apenas este campo usando safeParse
      const result = ItemSchemaBase.shape[field as keyof typeof ItemSchemaBase.shape]?.safeParse(value);

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
  }, [t]);

  // Verificar se customCategory está inválida
  const isCustomCategoryInvalid = useMemo(() => {
    if (!editData) return false;
    return editData.category === "other" && (!editData.customCategory || editData.customCategory.trim().length === 0);
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

    if (result.success) {
      return { hasRequiredFieldsEmpty: false, missingFields: [] };
    }

    const missing = result.error.errors.map((e) => e.path[0] as string);
    return { hasRequiredFieldsEmpty: true, missingFields: missing };
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

    return false;
  }, [
    item,
    editData,
    isEditing,
    fieldVisibility,
    originalFieldVisibility,
  ]);

  const handleVersionChange = useCallback(
    (versionId: string | null) => {
      if (!versionId) return;

      const version = versions.find((v) => v.id === versionId);
      if (!version) return;

      setCurrentVersion(version);
      setItem(version.itemData);
      setEditData(version.itemData);
      setImagePreview(version.itemData.image || "");
    },
    [versions]
  );

  const handleVersionCreate = useCallback(
    async (versionData: {
      name: string;
      description: string;
      entityData: ItemFormSchema;
    }) => {
      try {
        // Convert ItemFormSchema to complete IItem object
        const itemData: IItem = {
          id: item.id, // Use the current item's ID for the version
          name: versionData.entityData.name,
          status: versionData.entityData.status,
          category: versionData.entityData.category,
          customCategory: versionData.entityData.customCategory,
          basicDescription: versionData.entityData.basicDescription,
          image: versionData.entityData.image,
          appearance: versionData.entityData.appearance,
          origin: versionData.entityData.origin,
          alternativeNames: versionData.entityData.alternativeNames,
          storyRarity: versionData.entityData.storyRarity,
          narrativePurpose: versionData.entityData.narrativePurpose,
          usageRequirements: versionData.entityData.usageRequirements,
          usageConsequences: versionData.entityData.usageConsequences,
          itemUsage: versionData.entityData.itemUsage,
          fieldVisibility: {}, // Default empty visibility
          createdAt: new Date().toISOString(),
        };

        const newVersion: IItemVersion = {
          id: `version-${Date.now()}`,
          name: versionData.name,
          description: versionData.description,
          createdAt: new Date().toISOString(),
          isMain: false,
          itemData: itemData, // Use the complete converted object
        };

        // Salvar no banco de dados
        await createItemVersion(itemId, newVersion);

        // Atualizar o estado apenas se o save for bem-sucedido
        setVersions((prev) => [...prev, newVersion]);
      } catch (error) {
        console.error("Error creating item version:", error);
      }
    },
    [itemId, item.id]
  );

  const handleVersionDelete = useCallback(
    async (versionId: string) => {
      const versionToDelete = versions.find((v) => v.id === versionId);

      // Não permitir deletar versão principal
      if (versionToDelete?.isMain) {
        return;
      }

      try {
        // Deletar do banco de dados
        await deleteItemVersion(versionId);

        // Atualizar o estado apenas se o delete for bem-sucedido
        const updatedVersions = versions.filter((v) => v.id !== versionId);

        // Se a versão deletada for a atual, voltar para a principal
        if (currentVersion?.id === versionId) {
          const mainVersion = updatedVersions.find((v) => v.isMain);
          if (mainVersion) {
            setCurrentVersion(mainVersion);
            setItem(mainVersion.itemData);
            setEditData(mainVersion.itemData);
            setImagePreview(mainVersion.itemData.image || "");
          }
        }

        setVersions(updatedVersions);
      } catch (error) {
        console.error("Error deleting item version:", error);
      }
    },
    [versions, currentVersion]
  );

  const handleVersionUpdate = useCallback(
    async (versionId: string, name: string, description?: string) => {
      try {
        // Atualizar no banco de dados
        await updateItemVersion(versionId, name, description);

        // Atualizar o estado apenas se o update for bem-sucedido
        const updatedVersions = versions.map((v) =>
          v.id === versionId ? { ...v, name, description } : v
        );
        setVersions(updatedVersions);

        if (currentVersion?.id === versionId) {
          setCurrentVersion({ ...currentVersion, name, description });
        }
      } catch (error) {
        console.error("Error updating item version:", error);
      }
    },
    [versions, currentVersion]
  );

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

      const updatedItem = { ...editData, fieldVisibility };
      setItem(updatedItem);

      // Atualizar dados na versão atual
      const updatedVersions = versions.map((v) =>
        v.id === currentVersion?.id
          ? { ...v, itemData: updatedItem as IItem }
          : v
      );
      setVersions(updatedVersions);

      const activeVersion = updatedVersions.find(
        (v) => v.id === currentVersion?.id
      );
      if (activeVersion) {
        setCurrentVersion(activeVersion);
      }

      // Salvar no banco de dados
      if (currentVersion?.isMain) {
        await updateItem(itemId, updatedItem);
        // Atualizar cache do store para refletir mudanças na listagem
        await updateItemInStore(itemId, updatedItem);
      } else {
        await updateItemVersionData(currentVersion.id, updatedItem);
      }

      // Update original visibility to match saved state
      setOriginalFieldVisibility(fieldVisibility);

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
  }, [
    editData,
    fieldVisibility,
    versions,
    currentVersion,
    itemId,
    t,
  ]);

  const navigateToItemsTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleConfirmDelete = useCallback(async () => {
    if (currentVersion && !currentVersion.isMain) {
      const versionToDelete = versions.find((v) => v.id === currentVersion.id);

      if (!versionToDelete) return;

      const updatedVersions = versions.filter(
        (v) => v.id !== currentVersion.id
      );

      const mainVersion = updatedVersions.find((v) => v.isMain);
      if (mainVersion) {
        setCurrentVersion(mainVersion);
        setItem(mainVersion.itemData);
        setEditData(mainVersion.itemData);
        setImagePreview(mainVersion.itemData.image || "");
      }

      setVersions(updatedVersions);
    } else {
      try {
        if (!dashboardId) return;
        // Deletar do store (que também deleta do DB)
        await deleteItemFromStore(dashboardId, itemId);
        navigateToItemsTab();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  }, [
    currentVersion,
    versions,
    navigateToItemsTab,
    itemId,
    dashboardId,
    deleteItemFromStore,
    t,
  ]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditData(item);
    setFieldVisibility(originalFieldVisibility);
    setErrors({});
    setIsEditing(false);
  }, [item, originalFieldVisibility, hasChanges]);

  const handleConfirmCancel = useCallback(() => {
    setEditData(item);
    setFieldVisibility(originalFieldVisibility);
    setErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [item, originalFieldVisibility]);


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

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => !prev);
  }, []);

  const toggleSection = useCallback((sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  }, []);

  return (
    <>
      <UnsavedChangesDialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
        onConfirm={handleConfirmCancel}
      />

      <ItemDetailView
        item={item}
        editData={editData}
        isEditing={isEditing}
        versions={versions}
        currentVersion={currentVersion}
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
        customCategoryError={isCustomCategoryInvalid ? t("item-detail:validation.custom_category_required") : undefined}
        isValid={!hasRequiredFieldsEmpty && !isCustomCategoryInvalid}
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
        onVersionChange={handleVersionChange}
        onVersionCreate={handleVersionCreate}
        onVersionDelete={handleVersionDelete}
        onVersionUpdate={handleVersionUpdate}
        onEditDataChange={handleEditDataChange}
        validateField={validateField}
        onFieldVisibilityToggle={handleFieldVisibilityToggle}
        onAdvancedSectionToggle={handleAdvancedSectionToggle}
        toggleSection={toggleSection}
      />
    </>
  );
}
