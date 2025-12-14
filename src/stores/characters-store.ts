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

// Map para rastrear fetches em andamento e prevenir race conditions
const fetchingPromises = new Map<string, Promise<void>>();

export const useCharactersStore = create<CharactersState>((set, get) => ({
  cache: {},

  fetchCharacters: async (bookId: string, forceRefresh = false) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromises.has(bookId) && !forceRefresh) {
      return fetchingPromises.get(bookId);
    }

    const promise = (async () => {
      const cached = get().cache[bookId];

      // Verificar cache se não for forceRefresh
      if (!forceRefresh && cached?.characters && cached.characters.length > 0) {
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
        // Fetch do DB
        const characters = await getCharactersByBookId(bookId);
        const now = Date.now();

        // Atualizar cache com sucesso
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              characters,
              isLoading: false,
              lastFetched: now,
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching characters:", error);
        // Atualizar cache com erro
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
        throw error;
      }
    })();

    fetchingPromises.set(bookId, promise);

    try {
      await promise;
    } finally {
      // Limpar após conclusão
      fetchingPromises.delete(bookId);
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
              characters: [character, ...(cached?.characters || [])],
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
