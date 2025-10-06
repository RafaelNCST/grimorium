import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { type ICharacter } from "@/types/character-types";

import { CharactersView } from "./view";

interface PropsCharactersTab {
  bookId: string;
}

export function CharactersTab({ bookId }: PropsCharactersTab) {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const organizations = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(characters.map((c) => c.organization).filter(Boolean))
      ),
    ],
    [characters]
  );

  const locations = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set([
          ...characters.map((c) => c.birthPlace).filter(Boolean),
          ...characters.map((c) => c.affiliatedPlace).filter(Boolean),
        ])
      ),
    ],
    [characters]
  );

  const filteredCharacters = useMemo(
    () =>
      characters.filter((character) => {
        const matchesSearch =
          character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          character.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesOrg =
          selectedOrg === "all" || character.organization === selectedOrg;
        const matchesLocation =
          selectedLocation === "all" ||
          character.birthPlace === selectedLocation ||
          character.affiliatedPlace === selectedLocation;
        return matchesSearch && matchesOrg && matchesLocation;
      }),
    [characters, searchTerm, selectedOrg, selectedLocation]
  );

  const roleStats = useMemo(
    () => ({
      total: characters.length,
      protagonista: characters.filter((c) => c.role === "protagonista").length,
      antagonista: characters.filter((c) => c.role === "antagonista").length,
      secundario: characters.filter((c) => c.role === "secundario").length,
      vilao: characters.filter((c) => c.role === "vilao").length,
    }),
    [characters]
  );

  const handleCharacterCreated = useCallback((newCharacter: ICharacter) => {
    setCharacters((prev) => [...prev, newCharacter]);
  }, []);

  const navigateToCharacterDetail = useCallback(
    (characterId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/character/$characterId",
        params: { dashboardId: bookId, characterId },
      });
    },
    [navigate, bookId]
  );

  const handleCharacterClick = useCallback(
    (characterId: string) => {
      navigateToCharacterDetail(characterId);
    },
    [navigateToCharacterDetail]
  );

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
