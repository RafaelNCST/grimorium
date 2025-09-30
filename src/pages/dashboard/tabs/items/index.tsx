import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { ItemsView } from "./view";

// Mock data structures
interface Rarity {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface ItemStatus {
  id: string;
  name: string;
  icon: string;
}

interface Item {
  id: string;
  name: string;
  image: string;
  alternativeNames: string[];
  basicDescription: string;
  appearanceDescription: string;
  category: string;
  rarity: Rarity;
  status: ItemStatus;
  origin: string;
  weaknesses: string;
  powers: string;
  mythology: Array<{
    id: string;
    people: string;
    version: string;
  }>;
  inspirations: string;
}

// Mock data
const mockRarities: Rarity[] = [
  { id: "1", name: "Comum", color: "#6B7280", icon: "⚪" },
  { id: "2", name: "Incomum", color: "#10B981", icon: "🟢" },
  { id: "3", name: "Raro", color: "#3B82F6", icon: "🔵" },
  { id: "4", name: "Lendário", color: "#F59E0B", icon: "🟡" },
];

const mockStatuses: ItemStatus[] = [
  { id: "1", name: "Destruído", icon: "💥" },
  { id: "2", name: "Completa", icon: "✨" },
  { id: "3", name: "Incompleta", icon: "🪓" },
  { id: "4", name: "Selada", icon: "🔒" },
  { id: "5", name: "Enfraquecida", icon: "⚡" },
];

const mockItems: Item[] = [
  {
    id: "1",
    name: "Excalibur",
    image: "/placeholder.svg",
    alternativeNames: ["A Espada do Rei", "Caliburn"],
    basicDescription: "Lendária espada do Rei Arthur",
    appearanceDescription:
      "Uma espada de lâmina prateada com punho dourado ornamentado",
    category: "Arma",
    rarity: mockRarities[3],
    status: mockStatuses[1],
    origin: "Forjada por Merlim nas forjas celestiais",
    weaknesses: "Só pode ser empunhada por alguém puro de coração",
    powers: "Corta qualquer material, emite luz divina",
    mythology: [],
    inspirations: "Lenda Arturiana, mitologia celta",
  },
  {
    id: "2",
    name: "Poção de Cura Menor",
    image: "/placeholder.svg",
    alternativeNames: ["Elixir Básico"],
    basicDescription: "Poção que restaura ferimentos leves",
    appearanceDescription: "Líquido vermelho em frasco de vidro pequeno",
    category: "Consumível",
    rarity: mockRarities[0],
    status: mockStatuses[1],
    origin: "Alquimistas da Torre de Marfim",
    weaknesses: "Efeito limitado, não funciona em ferimentos mágicos",
    powers: "Regeneração acelerada de tecidos",
    mythology: [],
    inspirations: "RPGs clássicos, alquimia medieval",
  },
];

const categories = [
  "Arma",
  "Armadura",
  "Consumível",
  "Recurso",
  "Artefato",
  "Relíquia",
  "Outro",
];

interface ItemsTabProps {
  bookId: string;
}

export function ItemsTab({ bookId }: ItemsTabProps) {
  const navigate = useNavigate();
  const [items] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredItems = items.filter((item) => {
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

  const handleItemClick = (itemId: string) => {
    navigate({ to: "/dashboard/$dashboardId/item/$itemId", params: { dashboardId: bookId, itemId } });
  };

  const handleCreateItem = (itemData: any) => {
    console.log("Creating item:", itemData);
    setShowCreateModal(false);
  };

  return (
    <ItemsView
      items={items}
      filteredItems={filteredItems}
      categories={categories}
      mockRarities={mockRarities}
      mockStatuses={mockStatuses}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      selectedRarity={selectedRarity}
      showCreateModal={showCreateModal}
      onSearchTermChange={setSearchTerm}
      onSelectedCategoryChange={setSelectedCategory}
      onSelectedRarityChange={setSelectedRarity}
      onShowCreateModalChange={setShowCreateModal}
      onItemClick={handleItemClick}
      onCreateItem={handleCreateItem}
    />
  );
}
