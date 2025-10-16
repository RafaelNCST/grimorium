import { IItem } from "../components/item-card";

interface FilterItemsParams {
  items: IItem[];
  searchTerm: string;
  selectedCategory: string | null;
  selectedStatus: string | null;
}

export function filterItems({
  items,
  searchTerm,
  selectedCategory,
  selectedStatus,
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

    // Category filter - if category is "other", match all custom categories (items with category="other")
    const matchesCategory =
      selectedCategory === null ||
      (selectedCategory === "other"
        ? item.category === "other"
        : item.category === selectedCategory);

    // Status filter
    const matchesStatus =
      selectedStatus === null || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });
}
