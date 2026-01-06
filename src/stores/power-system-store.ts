import { create } from "zustand";

import {
  getPowerSystemsByBookId,
  createPowerSystem,
  updatePowerSystem,
  deletePowerSystem,
} from "@/lib/db/power-system.service";
import { type IPowerSystem } from "@/pages/dashboard/tabs/power-system/types/power-system-types";

interface PowerSystemCache {
  [bookId: string]: {
    systems: IPowerSystem[];
    isLoading: boolean;
    lastFetched: number;
    hasAnimated: boolean;
  };
}

interface PowerSystemState {
  cache: PowerSystemCache;
  fetchSystems: (bookId: string, forceRefresh?: boolean) => Promise<void>;
  addSystem: (
    bookId: string,
    name: string,
    iconImage?: string
  ) => Promise<string>;
  updateSystemInCache: (
    systemId: string,
    name: string,
    iconImage?: string
  ) => Promise<void>;
  deleteSystemFromCache: (bookId: string, systemId: string) => Promise<void>;
  invalidateCache: (bookId: string) => void;
  clearCache: () => void;
  getSystems: (bookId: string) => IPowerSystem[];
  isLoading: (bookId: string) => boolean;
  hasAnimated: (bookId: string) => boolean;
  setHasAnimated: (bookId: string) => void;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Map para rastrear fetches em andamento e prevenir race conditions
const fetchingPromises = new Map<string, Promise<void>>();

export const usePowerSystemStore = create<PowerSystemState>((set, get) => ({
  cache: {},

  fetchSystems: async (bookId: string, forceRefresh = false) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromises.has(bookId) && !forceRefresh) {
      return fetchingPromises.get(bookId);
    }

    const promise = (async () => {
      const cached = get().cache[bookId];
      const now = Date.now();

      // Verificar cache se não for forceRefresh (com TTL de 5 minutos)
      if (
        !forceRefresh &&
        cached?.systems &&
        cached.systems.length > 0 &&
        now - cached.lastFetched < CACHE_TTL
      ) {
        return;
      }

      // Marcar como loading
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            systems: cached?.systems || [],
            isLoading: true,
            lastFetched: cached?.lastFetched || 0,
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));

      try {
        // Fetch do DB
        const systems = await getPowerSystemsByBookId(bookId);
        const now = Date.now();

        // Atualizar cache com sucesso
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              systems,
              isLoading: false,
              lastFetched: now,
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching power systems:", error);
        // Atualizar cache com erro
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              systems: cached?.systems || [],
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

  addSystem: async (bookId: string, name: string, iconImage?: string) => {
    try {
      const systemId = await createPowerSystem(bookId, name, iconImage);

      // Optimistically update cache with the new system
      set((state) => {
        const cached = state.cache[bookId];
        const newSystem: IPowerSystem = {
          id: systemId,
          bookId,
          name,
          iconImage,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        return {
          cache: {
            ...state.cache,
            [bookId]: {
              systems: [newSystem, ...(cached?.systems || [])],
              isLoading: false,
              lastFetched: Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });

      return systemId;
    } catch (error) {
      console.error("Error adding power system:", error);
      throw error;
    }
  },

  updateSystemInCache: async (
    systemId: string,
    name: string,
    iconImage?: string
  ) => {
    try {
      await updatePowerSystem(systemId, name, iconImage);

      // Update in all caches that contain this system
      set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach((bookId) => {
          const cached = newCache[bookId];
          const systemIndex = cached.systems.findIndex(
            (s) => s.id === systemId
          );

          if (systemIndex !== -1) {
            const updatedSystems = [...cached.systems];
            updatedSystems[systemIndex] = {
              ...updatedSystems[systemIndex],
              name,
              iconImage,
              updatedAt: Date.now(),
            };

            newCache[bookId] = {
              ...cached,
              systems: updatedSystems,
            };
          }
        });

        return { cache: newCache };
      });
    } catch (error) {
      console.error("Error updating power system:", error);
      throw error;
    }
  },

  deleteSystemFromCache: async (bookId: string, systemId: string) => {
    try {
      await deletePowerSystem(systemId);

      // Remove from cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              systems: cached.systems.filter((s) => s.id !== systemId),
              isLoading: false,
              lastFetched: Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error deleting power system:", error);
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

  clearCache: () => {
    set({ cache: {} });
  },

  getSystems: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.systems || [];
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
