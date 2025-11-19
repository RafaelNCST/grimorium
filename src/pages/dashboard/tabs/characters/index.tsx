import { useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useEntityFilters } from "@/hooks/use-entity-filters";
import { useCharactersStore } from "@/stores/characters-store";
import { type ICharacter } from "@/types/character-types";
import { calculateEntityStats } from "@/utils/calculate-entity-stats";

import { CharactersView } from "./view";

interface PropsCharactersTab {
  bookId: string;
}

const EMPTY_ARRAY: ICharacter[] = [];

const ROLE_VALUES = ["protagonist", "antagonist", "secondary", "villain", "extra"];

export function CharactersTab({ bookId }: PropsCharactersTab) {
  const navigate = useNavigate();

  // Usar o store para gerenciar characters - seletores otimizados
  const characters = useCharactersStore(
    (state) => state.cache[bookId]?.characters ?? EMPTY_ARRAY
  );

  // Separar funções do store (não precisam de shallow comparison)
  const fetchCharacters = useCharactersStore((state) => state.fetchCharacters);
  const addCharacter = useCharactersStore((state) => state.addCharacter);

  // Load characters from cache or database on mount
  useEffect(() => {
    fetchCharacters(bookId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]); // Apenas bookId como dependência

  // Use entity filters hook
  const {
    filteredEntities: filteredCharacters,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    clearFilters,
  } = useEntityFilters({
    entities: characters,
    searchFields: ["name", "description"],
    filterGroups: [
      {
        key: "role",
        filterFn: (character, selectedRoles) =>
          selectedRoles.includes(character.role),
      },
    ],
  });

  const selectedRoles = selectedFilters.role || [];

  // Calculate role stats
  const roleStats = useMemo(
    () => calculateEntityStats(characters, "role", ROLE_VALUES),
    [characters]
  );

  const handleCharacterCreated = useCallback(
    async (newCharacter: ICharacter) => {
      try {
        // Adicionar ao store (que também salva no DB)
        await addCharacter(bookId, newCharacter);
      } catch (error) {
        console.error("Error creating character:", error);
      }
    },
    [bookId, addCharacter]
  );

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

  const handleRoleFilter = useCallback(
    (role: string) => {
      toggleFilter("role", role);
    },
    [toggleFilter]
  );

  return (
    <CharactersView
      bookId={bookId}
      characters={characters}
      filteredCharacters={filteredCharacters}
      roleStats={roleStats}
      searchTerm={searchTerm}
      selectedRoles={selectedRoles}
      onSearchTermChange={setSearchTerm}
      onRoleFilterChange={handleRoleFilter}
      onClearFilters={clearFilters}
      onCharacterCreated={handleCharacterCreated}
      onCharacterClick={handleCharacterClick}
    />
  );
}
