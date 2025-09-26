import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { BestiaryView } from "./view";

interface Beast {
  id: string;
  name: string;
  race?: string;
  species?: string;
  basicDescription: string;
  habit: string;
  threatLevel: {
    name: string;
    color: string;
  };
  image?: string;
  humanComparison: string;
}

interface BestiaryTabProps {
  bookId: string;
}

// Mock data for beasts
const getBookBeasts = (bookId: string): Beast[] => [
  {
    id: "1",
    name: "Dragão Sombrio",
    race: "Dracônico",
    species: "Reptiliano",
    basicDescription:
      "Criatura ancestral de escamas negras que domina as artes da magia sombria.",
    habit: "noturno",
    threatLevel: { name: "apocalíptico", color: "red" },
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    humanComparison: "impossível de ganhar",
  },
  {
    id: "2",
    name: "Lobo das Névoas",
    race: "Lupino",
    species: "Mamífero",
    basicDescription:
      "Predador fantasmagórico que se materializa através da névoa matinal.",
    habit: "crepuscular",
    threatLevel: { name: "médio", color: "yellow" },
    image:
      "https://images.unsplash.com/photo-1553830591-fddf9c6aab9e?w=400&h=300&fit=crop",
    humanComparison: "mais forte",
  },
  {
    id: "3",
    name: "Pixie Luminoso",
    race: "Feérico",
    species: "Espírito",
    basicDescription:
      "Pequena criatura mágica que emite luz própria e possui natureza brincalhona.",
    habit: "diurno",
    threatLevel: { name: "inexistente", color: "green" },
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    humanComparison: "impotente",
  },
  {
    id: "4",
    name: "Basilisco Venenoso",
    race: "Serpentino",
    species: "Reptiliano",
    basicDescription:
      "Serpente gigante cujo olhar pode petrificar e cujo veneno é letal.",
    habit: "subterrâneo",
    threatLevel: { name: "mortal", color: "orange" },
    image:
      "https://images.unsplash.com/photo-1516301617588-4c7a8b6c4a6e?w=400&h=300&fit=crop",
    humanComparison: "impossível de ganhar",
  },
];

export function BestiaryTab({ bookId }: BestiaryTabProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRace, setSelectedRace] = useState<string>("all");
  const [selectedThreatLevel, setSelectedThreatLevel] = useState<string>("all");
  const [selectedHabit, setSelectedHabit] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const beasts = getBookBeasts(bookId);

  // Filter beasts based on search and filters
  const filteredBeasts = beasts.filter((beast) => {
    const matchesSearch =
      beast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beast.basicDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRace = selectedRace === "all" || beast.race === selectedRace;
    const matchesThreat =
      selectedThreatLevel === "all" ||
      beast.threatLevel.name === selectedThreatLevel;
    const matchesHabit =
      selectedHabit === "all" || beast.habit === selectedHabit;

    return matchesSearch && matchesRace && matchesThreat && matchesHabit;
  });

  // Get unique races from beasts
  const uniqueRaces = Array.from(
    new Set(beasts.map((beast) => beast.race).filter(Boolean))
  );

  const handleNavigateToBeast = (beastId: string) => {
    navigate({ to: "/beast/$id", params: { id: beastId } });
  };

  return (
    <BestiaryView
      bookId={bookId}
      beasts={beasts}
      filteredBeasts={filteredBeasts}
      uniqueRaces={uniqueRaces}
      searchQuery={searchQuery}
      selectedRace={selectedRace}
      selectedThreatLevel={selectedThreatLevel}
      selectedHabit={selectedHabit}
      showCreateModal={showCreateModal}
      onSearchQueryChange={setSearchQuery}
      onSelectedRaceChange={setSelectedRace}
      onSelectedThreatLevelChange={setSelectedThreatLevel}
      onSelectedHabitChange={setSelectedHabit}
      onShowCreateModalChange={setShowCreateModal}
      onNavigateToBeast={handleNavigateToBeast}
    />
  );
}