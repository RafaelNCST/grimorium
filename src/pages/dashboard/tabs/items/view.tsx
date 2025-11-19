import { memo, useMemo } from "react";

import { Plus, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityListLayout, EntityCardList } from "@/components/layouts";
import { type ItemFormSchema } from "@/components/modals/create-item-modal/hooks/use-item-validation";
import { CreateItemModal } from "@/components/modals/create-item-modal/index";

import { IItem, ItemCard } from "./components/item-card";
import { createItemFilterRows } from "./helpers/filter-config";

interface PropsItemsView {
  items: IItem[];
  filteredItems: IItem[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategories: string[];
  selectedStatuses: string[];
  showCreateModal: boolean;
  onSearchTermChange: (term: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onStatusFilterChange: (status: string) => void;
  onClearFilters: () => void;
  onShowCreateModalChange: (show: boolean) => void;
  onNavigateToItem: (itemId: string) => void;
  onCreateItem: (itemData: ItemFormSchema) => void;
}

const ItemsViewComponent = function ItemsView({
  items,
  filteredItems,
  isLoading,
  searchTerm,
  selectedCategories,
  selectedStatuses,
  showCreateModal,
  onSearchTermChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onClearFilters,
  onShowCreateModalChange,
  onNavigateToItem,
  onCreateItem,
}: PropsItemsView) {
  const { t } = useTranslation(["items", "create-item"]);

  // Calculate stats for filters
  const stats = useMemo(() => {
    return {
      total: items.length,
      weapon: items.filter((i) => i.category === "weapon").length,
      armor: items.filter((i) => i.category === "armor").length,
      accessory: items.filter((i) => i.category === "accessory").length,
      artifact: items.filter((i) => i.category === "artifact").length,
      consumable: items.filter((i) => i.category === "consumable").length,
      relic: items.filter((i) => i.category === "relic").length,
      tool: items.filter((i) => i.category === "tool").length,
      treasure: items.filter((i) => i.category === "treasure").length,
      other: items.filter((i) => i.category === "other").length,
      complete: items.filter((i) => i.status === "complete").length,
      incomplete: items.filter((i) => i.status === "incomplete").length,
      destroyed: items.filter((i) => i.status === "destroyed").length,
      sealed: items.filter((i) => i.status === "sealed").length,
      weakened: items.filter((i) => i.status === "weakened").length,
      strengthened: items.filter((i) => i.status === "strengthened").length,
      apex: items.filter((i) => i.status === "apex").length,
    };
  }, [items]);

  // Create filter rows with unified colors
  const { categoryRows, statusRows } = useMemo(
    () => createItemFilterRows(stats, t),
    [stats, t]
  );

  // Combine all selected filters
  const allSelectedFilters = useMemo(
    () => [...selectedCategories, ...selectedStatuses],
    [selectedCategories, selectedStatuses]
  );

  // Handle filter toggle (works for both categories and statuses)
  const handleFilterToggle = (value: string) => {
    // Check if value is in category filters
    const isCategory = categoryRows[0]?.items.some(item => item.value === value);

    if (isCategory) {
      onCategoryFilterChange(value);
    } else {
      onStatusFilterChange(value);
    }
  };

  return (
    <>
      <EntityListLayout
        isLoading={isLoading}
        isEmpty={items.length === 0}
        emptyState={{
          icon: Package,
          title: t("items:empty_state.no_items"),
          description: t("items:empty_state.no_items_description"),
        }}
        header={{
          title: t("items:page.title"),
          description: t("items:page.description"),
          primaryAction: {
            label: t("items:page.new_item"),
            onClick: () => onShowCreateModalChange(true),
            variant: "magical",
            icon: Plus,
            className: "animate-glow",
          },
        }}
        filters={{
          totalCount: items.length,
          totalLabel: t("items:page.total_badge"),
          selectedFilters: allSelectedFilters,
          filterRows: [...categoryRows, ...statusRows],
          onFilterToggle: handleFilterToggle,
          onClearFilters,
        }}
        search={{
          value: searchTerm,
          onChange: onSearchTermChange,
          placeholder: t("items:page.search_placeholder"),
          maxWidth: "max-w-[50%]",
        }}
        showNoResultsState={filteredItems.length === 0 && items.length > 0}
      >
        <div className="grid grid-cols-[repeat(auto-fill,470px)] gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onClick={onNavigateToItem} />
          ))}
        </div>
      </EntityListLayout>

      <CreateItemModal
        open={showCreateModal}
        onClose={() => onShowCreateModalChange(false)}
        onConfirm={onCreateItem}
      />
    </>
  );
};

export const ItemsView = memo(ItemsViewComponent);
