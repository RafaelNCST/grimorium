import { create } from "zustand";

import {
  getRacesByBookId,
  createRace,
  updateRace,
  deleteRace,
} from "@/lib/db/races.service";
import { type IRace } from "@/pages/dashboard/tabs/races/types/race-types";

interface RacesCache {
  [bookId: string]: {
    races: IRace[];
    isLoading: boolean;
    lastFetched: number;
  };
}

interface RacesState {
  cache: RacesCache;
  fetchRaces: (bookId: string, forceRefresh?: boolean) => Promise<void>;
  addRace: (bookId: string, race: IRace) => Promise<void>;
  updateRaceInCache: (raceId: string, updates: Partial<IRace>) => Promise<void>;
  deleteRaceFromCache: (bookId: string, raceId: string) => Promise<void>;
  invalidateCache: (bookId: string) => void;
  getRaces: (bookId: string) => IRace[];
  isLoading: (bookId: string) => boolean;
}

export const useRacesStore = create<RacesState>((set, get) => ({
  cache: {},

  fetchRaces: async (bookId: string, forceRefresh = false) => {
    const { cache } = get();
    const cached = cache[bookId];

    // Se já existe em cache e não é forceRefresh, não buscar novamente
    if (cached && !forceRefresh && cached.races.length > 0) {
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
          races: cached?.races || [],
          isLoading: true,
          lastFetched: cached?.lastFetched || 0,
        },
      },
    }));

    try {
      const races = await getRacesByBookId(bookId);
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            races,
            isLoading: false,
            lastFetched: Date.now(),
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching races:", error);
      // Em caso de erro, marcar como não carregando
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            races: cached?.races || [],
            isLoading: false,
            lastFetched: cached?.lastFetched || 0,
          },
        },
      }));
    }
  },

  addRace: async (bookId: string, race: IRace) => {
    try {
      await createRace(bookId, race);

      // Atualizar cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              races: [...(cached?.races || []), race],
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
            },
          },
        };
      });
    } catch (error) {
      console.error("Error adding race:", error);
      throw error;
    }
  },

  updateRaceInCache: async (raceId: string, updates: Partial<IRace>) => {
    try {
      await updateRace(raceId, updates);

      // Atualizar em todos os caches que contenham essa raça
      set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach((bookId) => {
          const cached = newCache[bookId];
          const raceIndex = cached.races.findIndex((r) => r.id === raceId);

          if (raceIndex !== -1) {
            const updatedRaces = [...cached.races];
            updatedRaces[raceIndex] = {
              ...updatedRaces[raceIndex],
              ...updates,
            };

            newCache[bookId] = {
              ...cached,
              races: updatedRaces,
            };
          }
        });

        return { cache: newCache };
      });
    } catch (error) {
      console.error("Error updating race:", error);
      throw error;
    }
  },

  deleteRaceFromCache: async (bookId: string, raceId: string) => {
    try {
      await deleteRace(raceId);

      // Remover do cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              races: (cached?.races || []).filter((r) => r.id !== raceId),
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
            },
          },
        };
      });
    } catch (error) {
      console.error("Error deleting race:", error);
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

  getRaces: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.races || [];
  },

  isLoading: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.isLoading || false;
  },
}));
