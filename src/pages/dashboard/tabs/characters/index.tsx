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
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const filteredCharacters = useMemo(
    () =>
      characters.filter((character) => {
        const matchesSearch =
          character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          character.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === null || character.role === selectedRole;
        return matchesSearch && matchesRole;
      }),
    [characters, searchTerm, selectedRole]
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

  const handleRoleFilter = useCallback((role: string | null) => {
    setSelectedRole(role);
  }, []);

  return (
    <CharactersView
      bookId={bookId}
      characters={characters}
      filteredCharacters={filteredCharacters}
      roleStats={roleStats}
      searchTerm={searchTerm}
      selectedRole={selectedRole}
      onSearchTermChange={setSearchTerm}
      onRoleFilterChange={handleRoleFilter}
      onCharacterCreated={handleCharacterCreated}
      onCharacterClick={handleCharacterClick}
    />
  );
}
