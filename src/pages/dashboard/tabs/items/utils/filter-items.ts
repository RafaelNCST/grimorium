import { IItem } from "../components/item-card";

interface FilterItemsParams {
  items: IItem[];
  searchTerm: string;
  selectedCategories: string[];
  selectedStatuses: string[];
}

export function filterItems({
  items,
  searchTerm,
  selectedCategories,
  selectedStatuses,
}: FilterItemsParams): IItem[] {
  return items.filter((item) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.basicDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.alternativeNames &&
        item.alternativeNames.some((name) =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    // Multi-selection filter logic
    const hasCategoryFilter = selectedCategories.length > 0;
    const hasStatusFilter = selectedStatuses.length > 0;

    let matchesFilters = true;

    if (hasCategoryFilter && hasStatusFilter) {
      // Both filters active: item must match at least one category AND at least one status
      const matchesCategory = selectedCategories.includes(item.category);
      const matchesStatus = selectedStatuses.includes(item.status);
      matchesFilters = matchesCategory && matchesStatus;
    } else if (hasCategoryFilter) {
      // Only category filter active: item must match at least one category (OR)
      matchesFilters = selectedCategories.includes(item.category);
    } else if (hasStatusFilter) {
      // Only status filter active: item must match at least one status (OR)
      matchesFilters = selectedStatuses.includes(item.status);
    }
    // If no filters are active, matchesFilters remains true

    return matchesSearch && matchesFilters;
  });
}
