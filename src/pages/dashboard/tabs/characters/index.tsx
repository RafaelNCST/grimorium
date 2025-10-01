import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { CharactersView } from "./view";

interface ICharacter {
  id: string;
  name: string;
  age?: number;
  appearance?: string;
  role: string;
  personality?: string;
  description: string;
  organization: string;
  birthPlace?: string;
  affiliatedPlace?: string;
  alignment?: string;
  image?: string;
  qualities: string[];
}

interface CharactersTabProps {
  bookId: string;
}

// Book-specific character data
const getBookCharacters = (bookId: string): ICharacter[] => {
  if (bookId === "1") {
    return [
      {
        id: "1",
        name: "Aelric Valorheart",
        age: 23,
        appearance:
          "Jovem de estatura média com cabelos castanhos ondulados e olhos verdes penetrantes. Possui uma cicatriz no braço direito de uma batalha antiga. Veste sempre uma armadura de couro reforçado com detalhes em bronze, e carrega uma espada élfica herdada de seus antepassados. Seus olhos brilham com uma luz sobrenatural quando usa magia.",
        description:
          "Um jovem pastor que descobre possuir poderes mágicos ancestrais.",
        role: "protagonista",
        personality:
          "Determinado e corajoso, mas às vezes impulsivo. Possui um forte senso de justiça e não hesita em ajudar os necessitados. É naturalmente carismático e inspira confiança nos outros. Tem tendência a se sacrificar pelos outros, o que às vezes o coloca em situações perigosas. Apesar de sua juventude, demonstra uma sabedoria além de seus anos.",
        organization: "Ordem dos Guardiões",
        birthPlace: "Vila Pedraverde",
        affiliatedPlace: "Capital Elaria",
        alignment: "bem",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        qualities: [
          "Corajoso",
          "Determinado",
          "Leal",
          "Otimista",
          "Protetor",
          "Carismático",
          "Altruísta",
          "Intuitivo",
        ],
      },
      {
        id: "2",
        name: "Lyara Moonwhisper",
        age: 247,
        description:
          "Mentora élfica com conhecimento profundo sobre magia antiga.",
        role: "secundario",
        organization: "Ordem dos Guardiões",
        birthPlace: "Floresta Sombria",
        affiliatedPlace: "Capital Elaria",
        alignment: "bem",
        qualities: ["Sábia", "Misteriosa", "Protetora"],
      },
      {
        id: "3",
        name: "Malachar o Sombrio",
        age: 45,
        description:
          "Antigo mago que busca o poder absoluto através da magia negra.",
        role: "antagonista",
        organization: "Culto das Sombras",
        birthPlace: "Montanhas do Norte",
        affiliatedPlace: "Torre Sombria",
        alignment: "caotico",
        qualities: ["Ambicioso", "Cruel", "Inteligente"],
      },
      {
        id: "4",
        name: "Finn Pedraverde",
        age: 67,
        description: "Anão ferreiro e companheiro leal do protagonista.",
        role: "secundario",
        organization: "Guilda dos Ferreiros",
        birthPlace: "Montanhas do Norte",
        affiliatedPlace: "Vila Pedraverde",
        alignment: "bem",
        qualities: ["Leal", "Trabalhador", "Teimoso"],
      },
      {
        id: "5",
        name: "Seraphina Nightblade",
        age: 28,
        description: "Assassina habilidosa que serve aos interesses sombrios.",
        role: "vilao",
        organization: "Culto das Sombras",
        birthPlace: "Capital Elaria",
        affiliatedPlace: "Submundo",
        alignment: "caotico",
        qualities: ["Ágil", "Letal", "Calculista"],
      },
    ];
  }
  return [];
};

export function CharactersTab({ bookId }: CharactersTabProps) {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState(() => getBookCharacters(bookId));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Get unique organizations and locations from current book's characters
  const organizations = [
    "all",
    ...Array.from(
      new Set(characters.map((c) => c.organization).filter(Boolean))
    ),
  ];
  const locations = [
    "all",
    ...Array.from(
      new Set([
        ...characters.map((c) => c.birthPlace).filter(Boolean),
        ...characters.map((c) => c.affiliatedPlace).filter(Boolean),
      ])
    ),
  ];

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg =
      selectedOrg === "all" || character.organization === selectedOrg;
    const matchesLocation =
      selectedLocation === "all" ||
      character.birthPlace === selectedLocation ||
      character.affiliatedPlace === selectedLocation;
    return matchesSearch && matchesOrg && matchesLocation;
  });

  // Statistics - by role
  const roleStats = {
    total: characters.length,
    protagonista: characters.filter((c) => c.role === "protagonista").length,
    antagonista: characters.filter((c) => c.role === "antagonista").length,
    secundario: characters.filter((c) => c.role === "secundario").length,
    vilao: characters.filter((c) => c.role === "vilao").length,
  };

  const handleCharacterCreated = (newCharacter: any) => {
    setCharacters((prev) => [...prev, newCharacter]);
  };

  const handleCharacterClick = (characterId: string) => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/character/$characterId/",
      params: { dashboardId: bookId, characterId },
    });
  };

  return (
    <CharactersView
      bookId={bookId}
      characters={characters}
      filteredCharacters={filteredCharacters}
      organizations={organizations}
      locations={locations}
      roleStats={roleStats}
      searchTerm={searchTerm}
      selectedOrg={selectedOrg}
      selectedLocation={selectedLocation}
      onSearchTermChange={setSearchTerm}
      onSelectedOrgChange={setSelectedOrg}
      onSelectedLocationChange={setSelectedLocation}
      onCharacterCreated={handleCharacterCreated}
      onCharacterClick={handleCharacterClick}
    />
  );
}
