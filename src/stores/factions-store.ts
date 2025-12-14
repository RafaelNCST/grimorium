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

export const useFactionsStore = create<FactionsState>((set, get) => ({
  cache: {},

  fetchFactions: async (bookId: string, forceRefresh = false) => {
    const { cache } = get();
    const cached = cache[bookId];

    // Se já existe em cache e não é forceRefresh, não buscar novamente
    if (cached && !forceRefresh && cached.factions.length > 0) {
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
          factions: cached?.factions || [],
          isLoading: true,
          lastFetched: cached?.lastFetched || 0,
          hasAnimated: cached?.hasAnimated || false,
        },
      },
    }));

    try {
      const factions = await getFactionsByBookId(bookId);
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            factions,
            isLoading: false,
            lastFetched: Date.now(),
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching factions:", error);
      // Em caso de erro, marcar como não carregando
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
