import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useCharactersStore } from "@/stores/characters-store";
import { type ICharacter } from "@/types/character-types";

import { CharactersView } from "./view";

interface PropsCharactersTab {
  bookId: string;
}

const EMPTY_ARRAY: ICharacter[] = [];

export function CharactersTab({ bookId }: PropsCharactersTab) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Usar o store para gerenciar characters - seletores otimizados
  const characters = useCharactersStore(
    (state) => state.cache[bookId]?.characters ?? EMPTY_ARRAY
  );
  const isLoading = useCharactersStore(
    (state) => state.cache[bookId]?.isLoading ?? false
  );

  // Separar funções do store (não precisam de shallow comparison)
  const fetchCharacters = useCharactersStore((state) => state.fetchCharacters);
  const addCharacter = useCharactersStore((state) => state.addCharacter);

  // Load characters from cache or database on mount
  useEffect(() => {
    fetchCharacters(bookId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]); // Apenas bookId como dependência

  const filteredCharacters = useMemo(
    () =>
      characters.filter((character) => {
        const matchesSearch =
          character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          character.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesRole =
          selectedRoles.length === 0 || selectedRoles.includes(character.role);
        return matchesSearch && matchesRole;
      }),
    [characters, searchTerm, selectedRoles]
  );

  const roleStats = useMemo(
    () => ({
      total: characters.length,
      protagonist: characters.filter((c) => c.role === "protagonist").length,
      antagonist: characters.filter((c) => c.role === "antagonist").length,
      secondary: characters.filter((c) => c.role === "secondary").length,
      villain: characters.filter((c) => c.role === "villain").length,
      extra: characters.filter((c) => c.role === "extra").length,
    }),
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

  const handleRoleFilter = useCallback((role: string) => {
    setSelectedRoles((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      }
      return [...prev, role];
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedRoles([]);
  }, []);

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
      onClearFilters={handleClearFilters}
      onCharacterCreated={handleCharacterCreated}
      onCharacterClick={handleCharacterClick}
    />
  );
}
