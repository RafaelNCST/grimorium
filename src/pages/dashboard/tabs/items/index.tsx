import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { type ItemFormSchema } from "@/components/modals/create-item-modal/hooks/use-item-validation";

import { IItem } from "./components/item-card";
import { filterItems } from "./utils/filter-items";
import { ItemsView } from "./view";

interface PropsItemsTab {
  bookId: string;
}

export function ItemsTab({ bookId }: PropsItemsTab) {
  const navigate = useNavigate();

  const [items, setItems] = useState<IItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleCreateItem = useCallback((itemData: ItemFormSchema) => {
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
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [...prev, newItem]);
    setShowCreateModal(false);
  }, []);

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
