import { Item } from "@/mocks/local/item-data";

interface FilterItemsParams {
  items: Item[];
  searchTerm: string;
  selectedCategory: string;
  selectedRarity: string;
}

export function filterItems({
  items,
  searchTerm,
  selectedCategory,
  selectedRarity,
}: FilterItemsParams): Item[] {
  return items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alternativeNames.some((name) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesRarity =
      selectedRarity === "all" || item.rarity.id === selectedRarity;

    return matchesSearch && matchesCategory && matchesRarity;
  });
}
