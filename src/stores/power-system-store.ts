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

export const usePowerSystemStore = create<PowerSystemState>((set, get) => ({
  cache: {},

  fetchSystems: async (bookId: string, forceRefresh = false) => {
    const { cache } = get();
    const cached = cache[bookId];
    const now = Date.now();

    // If data is fresh (< 5 minutes old) and not forcing refresh, return cached data
    if (
      cached &&
      !forceRefresh &&
      cached.systems.length > 0 &&
      now - cached.lastFetched < CACHE_TTL
    ) {
      return;
    }

    // If already loading, don't start a new fetch
    if (cached?.isLoading) {
      return;
    }

    // Mark as loading
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
      const systems = await getPowerSystemsByBookId(bookId);
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            systems,
            isLoading: false,
            lastFetched: Date.now(),
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching power systems:", error);
      // On error, mark as not loading
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
              systems: [...(cached?.systems || []), newSystem],
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
