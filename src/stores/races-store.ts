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
    hasAnimated: boolean;
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
  hasAnimated: (bookId: string) => boolean;
  setHasAnimated: (bookId: string) => void;
}

// Map para rastrear fetches em andamento e prevenir race conditions
const fetchingPromises = new Map<string, Promise<void>>();

export const useRacesStore = create<RacesState>((set, get) => ({
  cache: {},

  fetchRaces: async (bookId: string, forceRefresh = false) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromises.has(bookId) && !forceRefresh) {
      return fetchingPromises.get(bookId);
    }

    const promise = (async () => {
      const cached = get().cache[bookId];

      // Verificar cache se não for forceRefresh
      if (!forceRefresh && cached?.races && cached.races.length > 0) {
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
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));

      try {
        // Fetch do DB
        const races = await getRacesByBookId(bookId);
        const now = Date.now();

        // Atualizar cache com sucesso
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              races,
              isLoading: false,
              lastFetched: now,
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching races:", error);
        // Atualizar cache com erro
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              races: cached?.races || [],
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
              hasAnimated: cached?.hasAnimated || false,
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
              hasAnimated: cached?.hasAnimated || false,
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
