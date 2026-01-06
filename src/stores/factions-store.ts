import { create } from "zustand";

import {
  getFactionsByBookId,
  createFaction,
  updateFaction,
  deleteFaction,
} from "@/lib/db/factions.service";
import { type IFaction } from "@/types/faction-types";

interface FactionsCache {
  [bookId: string]: {
    factions: IFaction[];
    isLoading: boolean;
    lastFetched: number;
    hasAnimated: boolean;
  };
}

interface FactionsState {
  cache: FactionsCache;
  fetchFactions: (bookId: string, forceRefresh?: boolean) => Promise<void>;
  addFaction: (bookId: string, faction: IFaction) => Promise<void>;
  updateFactionInCache: (
    factionId: string,
    updates: Partial<IFaction>
  ) => Promise<void>;
  deleteFactionFromCache: (bookId: string, factionId: string) => Promise<void>;
  invalidateCache: (bookId: string) => void;
  getFactions: (bookId: string) => IFaction[];
  isLoading: (bookId: string) => boolean;
  hasAnimated: (bookId: string) => boolean;
  setHasAnimated: (bookId: string) => void;
}

// Map para rastrear fetches em andamento e prevenir race conditions
const fetchingPromises = new Map<string, Promise<void>>();

export const useFactionsStore = create<FactionsState>((set, get) => ({
  cache: {},

  fetchFactions: async (bookId: string, forceRefresh = false) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromises.has(bookId) && !forceRefresh) {
      return fetchingPromises.get(bookId);
    }

    const promise = (async () => {
      const cached = get().cache[bookId];

      // Verificar cache se não for forceRefresh
      if (!forceRefresh && cached?.factions && cached.factions.length > 0) {
        return;
      }

      // Marcar como loading
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            factions: cached?.factions || [],
            isLoading: true,
            lastFetched: cached?.lastFetched || 0,
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));

      try {
        // Fetch do DB
        const factions = await getFactionsByBookId(bookId);
        const now = Date.now();

        // Atualizar cache com sucesso
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              factions,
              isLoading: false,
              lastFetched: now,
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching factions:", error);
        // Atualizar cache com erro
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              factions: cached?.factions || [],
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

  addFaction: async (bookId: string, faction: IFaction) => {
    try {
      await createFaction(bookId, faction);

      // Atualizar cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              factions: [faction, ...(cached?.factions || [])],
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error adding faction:", error);
      throw error;
    }
  },

  updateFactionInCache: async (
    factionId: string,
    updates: Partial<IFaction>
  ) => {
    try {
      await updateFaction(factionId, updates);

      // Atualizar em todos os caches que contenham essa facção
      set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach((bookId) => {
          const cached = newCache[bookId];
          const factionIndex = cached.factions.findIndex(
            (f) => f.id === factionId
          );

          if (factionIndex !== -1) {
            const updatedFactions = [...cached.factions];
            updatedFactions[factionIndex] = {
              ...updatedFactions[factionIndex],
              ...updates,
            };

            newCache[bookId] = {
              ...cached,
              factions: updatedFactions,
            };
          }
        });

        return { cache: newCache };
      });
    } catch (error) {
      console.error("Error updating faction:", error);
      throw error;
    }
  },

  deleteFactionFromCache: async (bookId: string, factionId: string) => {
    try {
      await deleteFaction(factionId);

      // Remover do cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              factions: cached.factions.filter((f) => f.id !== factionId),
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error deleting faction:", error);
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

  getFactions: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.factions || [];
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
