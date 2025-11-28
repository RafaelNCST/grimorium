import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { type ItemFormSchema } from "@/components/modals/create-item-modal/hooks/use-item-validation";
import { useEntityFilters } from "@/hooks/use-entity-filters";
import { type IItem } from "@/lib/db/items.service";
import { useItemsStore } from "@/stores/items-store";
import { calculateEntityStats } from "@/utils/calculate-entity-stats";

import { ItemsView } from "./view";

interface PropsItemsTab {
  bookId: string;
}

const EMPTY_ARRAY: IItem[] = [];

const CATEGORY_VALUES = [
  "weapon",
  "armor",
  "tool",
  "artifact",
  "consumable",
  "accessory",
  "container",
  "vehicle",
  "currency",
  "document",
  "key",
  "other",
];

const STATUS_VALUES = [
  "common",
  "rare",
  "epic",
  "legendary",
  "mythical",
  "unique",
];

export function ItemsTab({ bookId }: PropsItemsTab) {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Usar o store para gerenciar items - seletores otimizados
  const items = useItemsStore(
    (state) => state.cache[bookId]?.items ?? EMPTY_ARRAY
  );
  const isLoading = useItemsStore(
    (state) => state.cache[bookId]?.isLoading ?? false
  );

  // Separar funções do store (não precisam de shallow comparison)
  const fetchItems = useItemsStore((state) => state.fetchItems);
  const addItem = useItemsStore((state) => state.addItem);

  // Load items from cache or database on mount
  useEffect(() => {
    fetchItems(bookId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]); // Apenas bookId como dependência

  // Use entity filters hook
  const {
    filteredEntities: filteredItems,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    clearFilters,
  } = useEntityFilters({
    entities: items,
    searchFields: ["name", "basicDescription"],
    filterGroups: [
      {
        key: "category",
        filterFn: (item, selectedCategories) =>
          selectedCategories.includes(item.category),
      },
      {
        key: "status",
        filterFn: (item, selectedStatuses) =>
          selectedStatuses.includes(item.status),
      },
    ],
  });

  const selectedCategories = selectedFilters.category || [];
  const selectedStatuses = selectedFilters.status || [];

  // Calculate stats
  const categoryStats = useMemo(
    () => calculateEntityStats(items, "category", CATEGORY_VALUES),
    [items]
  );

  const statusStats = useMemo(
    () => calculateEntityStats(items, "status", STATUS_VALUES),
    [items]
  );

  const handleNavigateToItem = useCallback(
    (itemId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/item/$itemId/",
        params: { dashboardId: bookId, itemId },
      });
    },
    [navigate, bookId]
  );

  const handleCategoryFilterChange = useCallback(
    (category: string) => {
      toggleFilter("category", category);
    },
    [toggleFilter]
  );

  const handleStatusFilterChange = useCallback(
    (status: string) => {
      toggleFilter("status", status);
    },
    [toggleFilter]
  );

  const handleShowCreateModalChange = useCallback((show: boolean) => {
    setShowCreateModal(show);
  }, []);

  const handleCreateItem = useCallback(
    async (itemData: ItemFormSchema) => {
      const newItem: IItem = {
        id: crypto.randomUUID(),
        name: itemData.name,
        status: itemData.status,
        category: itemData.category,
        customCategory: itemData.customCategory,
        basicDescription: itemData.basicDescription,
        image: itemData.image,
        appearance: itemData.appearance,
        origin: itemData.origin,
        alternativeNames: itemData.alternativeNames,
        storyRarity: itemData.storyRarity,
        narrativePurpose: itemData.narrativePurpose,
        usageRequirements: itemData.usageRequirements,
        usageConsequences: itemData.usageConsequences,
        fieldVisibility: {},
        createdAt: new Date().toISOString(),
      };

      try {
        // Adicionar ao store (que também salva no DB)
        await addItem(bookId, newItem);
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error creating item:", error);
      }
    },
    [bookId, addItem]
  );

  return (
    <ItemsView
      items={items}
      filteredItems={filteredItems}
      isLoading={isLoading}
      searchTerm={searchTerm}
      selectedCategories={selectedCategories}
      selectedStatuses={selectedStatuses}
      showCreateModal={showCreateModal}
      onSearchTermChange={setSearchTerm}
      onCategoryFilterChange={handleCategoryFilterChange}
      onStatusFilterChange={handleStatusFilterChange}
      onClearFilters={clearFilters}
      onShowCreateModalChange={handleShowCreateModalChange}
      onNavigateToItem={handleNavigateToItem}
      onCreateItem={handleCreateItem}
    />
  );
}
