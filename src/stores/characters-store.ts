import { create } from "zustand";

import {
  getCharactersByBookId,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/lib/db/characters.service";
import { type ICharacter } from "@/types/character-types";

interface CharactersCache {
  [bookId: string]: {
    characters: ICharacter[];
    isLoading: boolean;
    lastFetched: number;
    hasAnimated: boolean;
  };
}

interface CharactersState {
  cache: CharactersCache;
  fetchCharacters: (bookId: string, forceRefresh?: boolean) => Promise<void>;
  addCharacter: (bookId: string, character: ICharacter) => Promise<void>;
  updateCharacterInCache: (
    characterId: string,
    updates: Partial<ICharacter>
  ) => Promise<void>;
  deleteCharacterFromCache: (
    bookId: string,
    characterId: string
  ) => Promise<void>;
  invalidateCache: (bookId: string) => void;
  getCharacters: (bookId: string) => ICharacter[];
  isLoading: (bookId: string) => boolean;
  hasAnimated: (bookId: string) => boolean;
  setHasAnimated: (bookId: string) => void;
}

export const useCharactersStore = create<CharactersState>((set, get) => ({
  cache: {},

  fetchCharacters: async (bookId: string, forceRefresh = false) => {
    const { cache } = get();
    const cached = cache[bookId];

    // Se já existe em cache e não é forceRefresh, não buscar novamente
    if (cached && !forceRefresh && cached.characters.length > 0) {
      return;
    }

    // Se já está carregando, não iniciar nova busca
    if (cached?.isLoading) {
      return;
    }

    // Marcar como loading
    set((state) => ({
      cache: {
        ...state.cache,
        [bookId]: {
          characters: cached?.characters || [],
          isLoading: true,
          lastFetched: cached?.lastFetched || 0,
          hasAnimated: cached?.hasAnimated || false,
        },
      },
    }));

    try {
      const characters = await getCharactersByBookId(bookId);
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            characters,
            isLoading: false,
            lastFetched: Date.now(),
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching characters:", error);
      // Em caso de erro, marcar como não carregando
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            characters: cached?.characters || [],
            isLoading: false,
            lastFetched: cached?.lastFetched || 0,
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));
    }
  },

  addCharacter: async (bookId: string, character: ICharacter) => {
    try {
      await createCharacter(bookId, character);

      // Atualizar cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              characters: [...(cached?.characters || []), character],
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error adding character:", error);
      throw error;
    }
  },

  updateCharacterInCache: async (
    characterId: string,
    updates: Partial<ICharacter>
  ) => {
    try {
      await updateCharacter(characterId, updates);

      // Atualizar em todos os caches que contenham esse personagem
      set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach((bookId) => {
          const cached = newCache[bookId];
          const characterIndex = cached.characters.findIndex(
            (c) => c.id === characterId
          );

          if (characterIndex !== -1) {
            const updatedCharacters = [...cached.characters];
            updatedCharacters[characterIndex] = {
              ...updatedCharacters[characterIndex],
              ...updates,
            };

            newCache[bookId] = {
              ...cached,
              characters: updatedCharacters,
            };
          }
        });

        return { cache: newCache };
      });
    } catch (error) {
      console.error("Error updating character:", error);
      throw error;
    }
  },

  deleteCharacterFromCache: async (bookId: string, characterId: string) => {
    try {
      await deleteCharacter(characterId);

      // Remover do cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              characters: cached.characters.filter((c) => c.id !== characterId),
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error deleting character:", error);
      throw error;
    }
  },

  invalidateCache: (bookId: string) => {
    set((state) => {
      const newCache = { ...state.cache };
      delete newCache[bookId];
      return { cache: newCache };
    });
  },

  getCharacters: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.characters || [];
  },

  isLoading: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.isLoading || false;
  },

  hasAnimated: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.hasAnimated || false;
  },

  setHasAnimated: (bookId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            hasAnimated: true,
          },
        },
      };
    });
  },
}));
