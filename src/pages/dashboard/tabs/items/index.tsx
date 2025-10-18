import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { type ItemFormSchema } from "@/components/modals/create-item-modal/hooks/use-item-validation";
import { type IItem } from "@/lib/db/items.service";
import { useItemsStore } from "@/stores/items-store";

import { filterItems } from "./utils/filter-items";
import { ItemsView } from "./view";

interface PropsItemsTab {
  bookId: string;
}

const EMPTY_ARRAY: IItem[] = [];

export function ItemsTab({ bookId }: PropsItemsTab) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
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

  const filteredItems = useMemo(
    () =>
      filterItems({
        items,
        searchTerm,
        selectedCategory,
        selectedStatus,
      }),
    [items, searchTerm, selectedCategory, selectedStatus]
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

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleCategoryFilterChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  const handleStatusFilterChange = useCallback((status: string | null) => {
    setSelectedStatus(status);
  }, []);

  const handleShowCreateModalChange = useCallback((show: boolean) => {
    setShowCreateModal(show);
  }, []);

  const handleCreateItem = useCallback(
    async (itemData: ItemFormSchema) => {
      const newItem: IItem = {
        id: Date.now().toString(),
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
        toast.success("Item criado com sucesso!");
      } catch (_error) {
        toast.error("Erro ao criar item");
      }
    },
    [bookId, addItem]
  );

  return (
    <ItemsView
      items={items}
      filteredItems={filteredItems}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedStatus={selectedStatus}
      showCreateModal={showCreateModal}
      onSearchTermChange={handleSearchTermChange}
      onCategoryFilterChange={handleCategoryFilterChange}
      onStatusFilterChange={handleStatusFilterChange}
      onShowCreateModalChange={handleShowCreateModalChange}
      onNavigateToItem={handleNavigateToItem}
      onCreateItem={handleCreateItem}
    />
  );
}
