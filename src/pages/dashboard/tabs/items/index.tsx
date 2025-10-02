import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { mockRarities, mockStatuses } from "@/mocks/local/item-data";

import { ITEM_CATEGORIES_CONSTANT } from "./constants/item-categories-constant";
import { MOCK_ITEMS } from "./mocks/mock-items";
import { filterItems } from "./utils/filter-items";
import { ItemsView } from "./view";

interface PropsItemsTab {
  bookId: string;
}

export function ItemsTab({ bookId }: PropsItemsTab) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const items = useMemo(() => MOCK_ITEMS, []);

  const filteredItems = useMemo(
    () =>
      filterItems({
        items,
        searchTerm,
        selectedCategory,
        selectedRarity,
      }),
    [items, searchTerm, selectedCategory, selectedRarity]
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

  const handleSelectedCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSelectedRarityChange = useCallback((rarity: string) => {
    setSelectedRarity(rarity);
  }, []);

  const handleShowCreateModalChange = useCallback((show: boolean) => {
    setShowCreateModal(show);
  }, []);

  const handleCreateItem = useCallback((itemData: any) => {
    setShowCreateModal(false);
  }, []);

  return (
    <ItemsView
      items={items}
      filteredItems={filteredItems}
      categories={ITEM_CATEGORIES_CONSTANT}
      mockRarities={mockRarities}
      mockStatuses={mockStatuses}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedRarity={selectedRarity}
      showCreateModal={showCreateModal}
      onSearchTermChange={handleSearchTermChange}
      onSelectedCategoryChange={handleSelectedCategoryChange}
      onSelectedRarityChange={handleSelectedRarityChange}
      onShowCreateModalChange={handleShowCreateModalChange}
      onNavigateToItem={handleNavigateToItem}
      onCreateItem={handleCreateItem}
    />
  );
}
