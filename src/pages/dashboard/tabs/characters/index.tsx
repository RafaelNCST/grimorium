import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import {
  getCharactersByBookId,
  createCharacter,
} from "@/lib/db/characters.service";
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
  const [_isLoading, setIsLoading] = useState(true);

  // Load characters from database on mount
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const charactersFromDB = await getCharactersByBookId(bookId);
        setCharacters(charactersFromDB);
      } catch (error) {
        console.error("Error loading characters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, [bookId]);

  const filteredCharacters = useMemo(
    () =>
      characters.filter((character) => {
        const matchesSearch =
          character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          character.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesRole =
          selectedRole === null || character.role === selectedRole;
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

  const handleCharacterCreated = useCallback(
    async (newCharacter: ICharacter) => {
      try {
        // Save to database
        await createCharacter(bookId, newCharacter);
        // Update local state
        setCharacters((prev) => [...prev, newCharacter]);
      } catch (error) {
        console.error("Error creating character:", error);
      }
    },
    [bookId]
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
