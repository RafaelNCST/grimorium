import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  getItemById,
  getItemsByBookId,
  type IItem,
  type IItemVersion,
} from "@/lib/db/items.service";
import { useItemsStore } from "@/stores/items-store";

import { ITEM_CATEGORIES_CONSTANT } from "./constants/item-categories-constant";
import { ITEM_STATUSES_CONSTANT } from "./constants/item-statuses-constant";
import { STORY_RARITIES_CONSTANT } from "./constants/story-rarities-constant";
import { ItemDetailViewRefactored } from "./view-refactored";

export default function ItemDetail() {
  const { itemId, dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/item/$itemId/",
  });
  const navigate = useNavigate();
  const { t } = useTranslation("item-detail");

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [versions, setVersions] = useState<IItemVersion[]>([
    {
      id: "main-version",
      name: "Versão Principal",
      description: "Versão principal do item",
      createdAt: new Date().toISOString(),
      isMain: true,
      itemData: emptyItem,
    },
  ]);
  const [currentVersion, setCurrentVersion] = useState<IItemVersion | null>(
    versions[0]
  );
  const [_isLoading, setIsLoading] = useState(true);
  const [allItems, setAllItems] = useState<IItem[]>([]);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const itemFromDB = await getItemById(itemId);
        if (itemFromDB) {
          setItem(itemFromDB);
          setEditData(itemFromDB);
          setImagePreview(itemFromDB.image || "");

          setVersions((prev) =>
            prev.map((v) =>
              v.isMain
                ? {
                    ...v,
                    itemData: itemFromDB,
                  }
                : v
            )
          );

          if (dashboardId) {
            const allItemsFromBook = await getItemsByBookId(dashboardId);
            setAllItems(allItemsFromBook);
          }
        }
      } catch (_error) {
        toast.error("Erro ao carregar item");
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

  const handleVersionChange = useCallback(
    (versionId: string | null) => {
      if (!versionId) return;

      const version = versions.find((v) => v.id === versionId);
      if (!version) return;

      setCurrentVersion(version);
      setItem(version.itemData);
      setEditData(version.itemData);
      setImagePreview(version.itemData.image || "");

      toast.success(`Versão "${version.name}" ativada`);
    },
    [versions]
  );

  const handleVersionCreate = useCallback(
    (versionData: { name: string; description: string; itemData: IItem }) => {
      const newVersion: IItemVersion = {
        id: `version-${Date.now()}`,
        name: versionData.name,
        description: versionData.description,
        createdAt: new Date().toISOString(),
        isMain: false,
        itemData: versionData.itemData,
      };

      setVersions((prev) => [...prev, newVersion]);
      toast.success(`Versão "${versionData.name}" criada com sucesso!`);
    },
    []
  );

  const handleVersionDelete = useCallback(
    (versionId: string) => {
      const versionToDelete = versions.find((v) => v.id === versionId);

      if (versionToDelete?.isMain) {
        toast.error("Não é possível excluir a versão principal");
        return;
      }

      const updatedVersions = versions.filter((v) => v.id !== versionId);

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
      toast.success("Versão excluída com sucesso!");
    },
    [versions, currentVersion]
  );

  const handleSave = useCallback(async () => {
    const updatedItem = { ...editData };
    setItem(updatedItem);

    const updatedVersions = versions.map((v) =>
      v.id === currentVersion?.id ? { ...v, itemData: updatedItem } : v
    );
    setVersions(updatedVersions);

    const activeVersion = updatedVersions.find(
      (v) => v.id === currentVersion?.id
    );
    if (activeVersion) {
      setCurrentVersion(activeVersion);
    }

    try {
      // Atualizar no store (que também salva no DB)
      await updateItemInStore(itemId, updatedItem);
      setIsEditing(false);
      toast.success("Item atualizado com sucesso!");
    } catch (_error) {
      toast.error("Erro ao salvar item");
    }
  }, [editData, versions, currentVersion, itemId, updateItemInStore]);

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
      toast.success(t("delete.version.success"));
    } else {
      try {
        if (!dashboardId) return;
        // Deletar do store (que também deleta do DB)
        await deleteItemFromStore(dashboardId, itemId);
        toast.success(t("delete.item.step2.success"));
        navigateToItemsTab();
      } catch (_error) {
        toast.error("Erro ao excluir item");
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
    setEditData({ ...item });
    setIsEditing(false);
  }, [item]);

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

  return (
    <ItemDetailViewRefactored
      item={item}
      editData={editData}
      isEditing={isEditing}
      versions={versions}
      currentVersion={currentVersion}
      showDeleteModal={showDeleteModal}
      isNavigationSidebarOpen={isNavigationSidebarOpen}
      imagePreview={imagePreview}
      fileInputRef={fileInputRef}
      allItems={allItems}
      categories={ITEM_CATEGORIES_CONSTANT}
      statuses={ITEM_STATUSES_CONSTANT}
      rarities={STORY_RARITIES_CONSTANT}
      currentCategory={currentCategory}
      currentStatus={currentStatus}
      currentRarity={currentRarity}
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
      onImageFileChange={handleImageFileChange}
      onEditDataChange={handleEditDataChange}
    />
  );
}
