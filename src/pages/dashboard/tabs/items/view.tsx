import { memo, useMemo } from "react";

import { Plus, Search, Package, Filter, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/empty-state";
import { ITEM_CATEGORIES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-categories";
import { ITEM_STATUSES_CONSTANT } from "@/components/modals/create-item-modal/constants/item-statuses";
import { type ItemFormSchema } from "@/components/modals/create-item-modal/hooks/use-item-validation";
import { CreateItemModal } from "@/components/modals/create-item-modal/index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { IItem, ItemCard } from "./components/item-card";

interface PropsItemsView {
  items: IItem[];
  filteredItems: IItem[];
  searchTerm: string;
  selectedCategory: string | null;
  selectedStatus: string | null;
  showCreateModal: boolean;
  onSearchTermChange: (term: string) => void;
  onCategoryFilterChange: (category: string | null) => void;
  onStatusFilterChange: (status: string | null) => void;
  onShowCreateModalChange: (show: boolean) => void;
  onNavigateToItem: (itemId: string) => void;
  onCreateItem: (itemData: ItemFormSchema) => void;
}

const ItemsViewComponent = function ItemsView({
  items,
  filteredItems,
  searchTerm,
  selectedCategory,
  selectedStatus,
  showCreateModal,
  onSearchTermChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onShowCreateModalChange,
  onNavigateToItem,
  onCreateItem,
}: PropsItemsView) {
  const { t } = useTranslation(["items", "create-item"]);

  // Calculate category stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};

    ITEM_CATEGORIES_CONSTANT.forEach((category) => {
      stats[category.value] = items.filter((item) => {
        if (category.value === "other") {
          return item.category === "other";
        }
        return item.category === category.value;
      }).length;
    });

    return stats;
  }, [items]);

  // Calculate status stats
  const statusStats = useMemo(() => {
    const stats: Record<string, number> = {};

    ITEM_STATUSES_CONSTANT.forEach((status) => {
      stats[status.value] = items.filter(
        (item) => item.status === status.value
      ).length;
    });

    return stats;
  }, [items]);

  const totalItems = items.length;

  // Empty state when no items exist
  if (totalItems === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("items:page.title")}</h2>
            <p className="text-muted-foreground">
              {t("items:page.description")}
            </p>
          </div>
          <Button
            variant="magical"
            size="lg"
            onClick={() => onShowCreateModalChange(true)}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("items:page.new_item")}
          </Button>
        </div>

        <EmptyState
          icon={Package}
          title={t("items:empty_state.no_items")}
          description={t("items:empty_state.no_items_description")}
        />

        <CreateItemModal
          open={showCreateModal}
          onClose={() => onShowCreateModalChange(false)}
          onConfirm={onCreateItem}
        />
      </div>
    );
  }

  // Get category badge style - using a neutral purple color for all categories
  const getCategoryBadgeClass = (categoryValue: string) => {
    const isActive = selectedCategory === categoryValue;

    if (isActive) {
      return "!bg-purple-500 !text-white !border-purple-500";
    }

    return "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500";
  };

  // Get status badge class based on status colors from constants
  const getStatusBadgeClass = (statusValue: string) => {
    const statusData = ITEM_STATUSES_CONSTANT.find(
      (s) => s.value === statusValue
    );
    const isActive = selectedStatus === statusValue;

    if (!statusData) return "";

    // Map active colors to badge colors
    const colorMap: Record<string, string> = {
      "text-green-600 dark:text-green-400": isActive
        ? "!bg-green-500 !text-black !border-green-500"
        : "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:!bg-green-500 hover:!text-black hover:!border-green-500",
      "text-slate-700 dark:text-slate-300": isActive
        ? "!bg-slate-500 !text-black !border-slate-500"
        : "bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300 hover:!bg-slate-500 hover:!text-black hover:!border-slate-500",
      "text-red-600 dark:text-red-400": isActive
        ? "!bg-red-500 !text-black !border-red-500"
        : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:!bg-red-500 hover:!text-black hover:!border-red-500",
      "text-purple-600 dark:text-purple-400": isActive
        ? "!bg-purple-500 !text-black !border-purple-500"
        : "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-black hover:!border-purple-500",
      "text-orange-600 dark:text-orange-400": isActive
        ? "!bg-orange-500 !text-black !border-orange-500"
        : "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:!bg-orange-500 hover:!text-black hover:!border-orange-500",
      "text-blue-600 dark:text-blue-400": isActive
        ? "!bg-blue-500 !text-black !border-blue-500"
        : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
      "text-yellow-600 dark:text-yellow-400": isActive
        ? "!bg-yellow-500 !text-black !border-yellow-500"
        : "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-500",
    };

    return colorMap[statusData.activeColor] || "";
  };

  const handleCategoryClick = (categoryValue: string) => {
    onCategoryFilterChange(
      selectedCategory === categoryValue ? null : categoryValue
    );
  };

  const handleStatusClick = (statusValue: string) => {
    onStatusFilterChange(selectedStatus === statusValue ? null : statusValue);
  };

  return (
    <div className="flex-1 h-full flex flex-col space-y-6">
      {/* Header with category and status counters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("items:page.title")}</h2>
          <p className="text-muted-foreground">{t("items:page.description")}</p>

          {/* Total Badge */}
          <div className="flex items-center gap-4 mt-2">
            <Badge
              className={`cursor-pointer border transition-colors ${
                selectedCategory === null && selectedStatus === null
                  ? "!bg-primary !text-white !border-primary"
                  : "bg-background text-foreground border-border hover:!bg-primary hover:!text-white hover:!border-primary"
              }`}
              onClick={() => {
                onCategoryFilterChange(null);
                onStatusFilterChange(null);
              }}
            >
              {totalItems} {t("items:page.total_badge")}
            </Badge>
          </div>

          {/* Category Counters */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {ITEM_CATEGORIES_CONSTANT.map((category) => {
              const count = categoryStats[category.value] || 0;

              const CategoryIcon = category.icon;

              return (
                <Badge
                  key={category.value}
                  className={`cursor-pointer border transition-colors ${getCategoryBadgeClass(category.value)}`}
                  onClick={() => handleCategoryClick(category.value)}
                >
                  <CategoryIcon className="w-3.5 h-3.5 mr-1.5" />
                  {count} {t(`create-item:category.${category.value}`)}
                </Badge>
              );
            })}
          </div>

          {/* Status Counters */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {ITEM_STATUSES_CONSTANT.map((status) => {
              const count = statusStats[status.value] || 0;

              const StatusIcon = status.icon;

              return (
                <Badge
                  key={status.value}
                  className={`cursor-pointer border transition-colors ${getStatusBadgeClass(status.value)}`}
                  onClick={() => handleStatusClick(status.value)}
                >
                  <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                  {count} {t(`create-item:status.${status.value}`)}
                </Badge>
              );
            })}
          </div>
        </div>

        <Button
          variant="magical"
          size="lg"
          onClick={() => onShowCreateModalChange(true)}
          className="animate-glow"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("items:page.new_item")}
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("items:page.search_placeholder")}
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Empty state when no filtered results */}
      {filteredItems.length === 0 && (
        <EmptyState
          icon={
            searchTerm !== ""
              ? SearchX
              : selectedCategory !== null || selectedStatus !== null
                ? Filter
                : Package
          }
          title={
            searchTerm !== ""
              ? t("items:empty_state.no_results")
              : selectedCategory !== null
                ? t("items:empty_state.no_category_items", {
                    category: t(
                      `create-item:category.${selectedCategory}`
                    ).toLowerCase(),
                  })
                : selectedStatus !== null
                  ? t("items:empty_state.no_status_items", {
                      status: t(
                        `create-item:status.${selectedStatus}`
                      ).toLowerCase(),
                    })
                  : t("items:empty_state.no_items")
          }
          description={
            searchTerm !== ""
              ? t("items:empty_state.no_results_description")
              : selectedCategory !== null
                ? t("items:empty_state.no_category_items_description")
                : selectedStatus !== null
                  ? t("items:empty_state.no_status_items_description")
                  : t("items:empty_state.no_items_description")
          }
        />
      )}

      {/* Items Grid */}
      {filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onClick={onNavigateToItem} />
          ))}
        </div>
      )}

      <CreateItemModal
        open={showCreateModal}
        onClose={() => onShowCreateModalChange(false)}
        onConfirm={onCreateItem}
      />
    </div>
  );
};

export const ItemsView = memo(ItemsViewComponent);
