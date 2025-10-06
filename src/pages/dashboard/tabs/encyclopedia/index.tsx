import { useState, useCallback, useMemo } from "react";

import type { ICategoryGroup } from "@/types/encyclopedia";

import { ENCYCLOPEDIA_CATEGORIES_CONSTANT } from "./constants/encyclopedia-categories";
import { getCategoryColor } from "./utils/get-category-color";
import { EncyclopediaView } from "./view";

export function EncyclopediaTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");

  const categories = useMemo(() => ENCYCLOPEDIA_CATEGORIES_CONSTANT, []);

  const filteredEntries = useMemo(() => [], [searchTerm, selectedCategory]);

  const entriesByCategory = useMemo<ICategoryGroup[]>(
    () =>
      categories.slice(1).map((category) => ({
        category,
        entries: [],
        count: 0,
      })),
    [categories]
  );

  const handleCreateEntry = useCallback(() => {}, []);

  const handleEditEntry = useCallback((_entryId: string) => {}, []);

  const handleRelatedEntryClick = useCallback(
    (_relatedEntry: string) => {},
    []
  );

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(category);
    setActiveTab("browse");
  }, []);

  return (
    <EncyclopediaView
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      activeTab={activeTab}
      categories={categories}
      filteredEntries={filteredEntries}
      entriesByCategory={entriesByCategory}
      onSearchTermChange={setSearchTerm}
      onSelectedCategoryChange={setSelectedCategory}
      onActiveTabChange={setActiveTab}
      onCreateEntry={handleCreateEntry}
      onEditEntry={handleEditEntry}
      onRelatedEntryClick={handleRelatedEntryClick}
      onCategoryClick={handleCategoryClick}
      getCategoryColor={getCategoryColor}
    />
  );
}
