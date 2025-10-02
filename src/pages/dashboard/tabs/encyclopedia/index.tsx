import { useState, useCallback, useMemo } from "react";

import { EncyclopediaView } from "./view";

interface EncyclopediaEntry {
  id: string;
  title: string;
  category:
    | "História"
    | "Geografia"
    | "Cultura"
    | "Política"
    | "Economia"
    | "Religião"
    | "Outros";
  content: string;
  relatedEntries: string[];
  tags: string[];
  lastModified: string;
}

const mockEntries: EncyclopediaEntry[] = [
  {
    id: "1",
    title: "A Era das Trevas",
    category: "História",
    content:
      "Período sombrio da história mundial que durou aproximadamente 1000 anos. Iniciou-se com a Grande Ruptura, evento que dividiu o mundo entre luz e trevas. Durante este período, criaturas sombrias dominaram vastas regiões, forçando a humanidade a se refugiar em cidades fortificadas.",
    relatedEntries: ["Grande Ruptura", "Ordem dos Guardiões"],
    tags: ["história", "trevas", "guerra"],
    lastModified: "há 2 dias",
  },
  {
    id: "2",
    title: "Cristais de Aetherium",
    category: "Geografia",
    content:
      "Cristais mágicos raros encontrados apenas nas Montanhas Celestiais. São a principal fonte de poder mágico no mundo. Possuem uma cor azul-prateada e emitem uma luz suave. Extremamente valiosos e disputados por todas as facções.",
    relatedEntries: ["Montanhas Celestiais", "Sistema de Magia"],
    tags: ["magia", "cristais", "recursos"],
    lastModified: "há 1 semana",
  },
  {
    id: "3",
    title: "Festivais da Lua Prateada",
    category: "Cultura",
    content:
      "Celebração anual realizada durante a lua cheia de inverno. Marca o fim do período mais sombrio do ano e renova as esperanças de paz. Inclui danças rituais, oferendas aos ancestrais e a tradicional Cerimônia das Luzes.",
    relatedEntries: ["Cultura Élfica", "Religião da Luz"],
    tags: ["festival", "cultura", "tradição"],
    lastModified: "há 5 dias",
  },
  {
    id: "4",
    title: "Conselho dos Reinos",
    category: "Política",
    content:
      "Órgão político formado pelos representantes dos cinco principais reinos. Criado para coordenar a defesa contra as ameaças sombrias e mediar conflitos entre os reinos. Reúne-se na Torre Neutra uma vez por estação.",
    relatedEntries: ["Reino de Aethermoor", "Torre Neutra"],
    tags: ["política", "governo", "diplomacia"],
    lastModified: "há 3 dias",
  },
];

export function EncyclopediaTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");

  const categories = useMemo(
    () => [
      "all",
      "História",
      "Geografia",
      "Cultura",
      "Política",
      "Economia",
      "Religião",
      "Outros",
    ],
    []
  );

  const getCategoryColor = useCallback((category: string) => {
    switch (category) {
      case "História":
        return "bg-accent text-accent-foreground";
      case "Geografia":
        return "bg-success text-success-foreground";
      case "Cultura":
        return "bg-primary text-primary-foreground";
      case "Política":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  }, []);

  const filteredEntries = useMemo(
    () =>
      mockEntries.filter((entry) => {
        const matchesSearch =
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          );
        const matchesCategory =
          selectedCategory === "all" || entry.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [searchTerm, selectedCategory]
  );

  const entriesByCategory = useMemo(
    () =>
      categories.slice(1).map((category) => ({
        category,
        entries: mockEntries.filter((entry) => entry.category === category),
        count: mockEntries.filter((entry) => entry.category === category)
          .length,
      })),
    [categories]
  );

  const handleCreateEntry = useCallback(() => {
    console.log("Create new encyclopedia entry");
  }, []);

  const handleEditEntry = useCallback((entryId: string) => {
    console.log("Edit entry:", entryId);
  }, []);

  const handleRelatedEntryClick = useCallback((relatedEntry: string) => {
    console.log("Navigate to related entry:", relatedEntry);
  }, []);

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
