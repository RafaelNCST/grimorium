import { create } from "zustand";

import {
  getRegionsByBookId,
  createRegion,
  updateRegion,
  deleteRegion,
  getRegionHierarchy,
} from "@/lib/db/regions.service";
import {
  type IRegion,
  type IRegionWithChildren,
} from "@/pages/dashboard/tabs/world/types/region-types";

interface RegionsCache {
  [bookId: string]: {
    regions: IRegion[];
    hierarchy: IRegionWithChildren[];
    isLoading: boolean;
    lastFetched: number;
    hasAnimated: boolean;
  };
}

interface RegionsState {
  cache: RegionsCache;
  fetchRegions: (bookId: string, forceRefresh?: boolean) => Promise<void>;
  addRegion: (bookId: string, region: IRegion) => Promise<void>;
  updateRegionInCache: (
    regionId: string,
    updates: Partial<IRegion>
  ) => Promise<void>;
  deleteRegionFromCache: (bookId: string, regionId: string) => Promise<void>;
  invalidateCache: (bookId: string) => void;
  getRegions: (bookId: string) => IRegion[];
  getHierarchy: (bookId: string) => IRegionWithChildren[];
  isLoading: (bookId: string) => boolean;
  hasAnimated: (bookId: string) => boolean;
  setHasAnimated: (bookId: string) => void;
}

// Map para rastrear fetches em andamento e prevenir race conditions
const fetchingPromises = new Map<string, Promise<void>>();

export const useRegionsStore = create<RegionsState>((set, get) => ({
  cache: {},

  fetchRegions: async (bookId: string, forceRefresh = false) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromises.has(bookId) && !forceRefresh) {
      return fetchingPromises.get(bookId);
    }

    const promise = (async () => {
      const cached = get().cache[bookId];

      // Verificar cache se não for forceRefresh
      if (!forceRefresh && cached?.regions && cached.regions.length > 0) {
        return;
      }

      // Marcar como loading
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            regions: cached?.regions || [],
            hierarchy: cached?.hierarchy || [],
            isLoading: true,
            lastFetched: cached?.lastFetched || 0,
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));

      try {
        // Fetch regions e hierarchy em paralelo
        const [regionsData, hierarchyData] = await Promise.all([
          getRegionsByBookId(bookId),
          getRegionHierarchy(bookId),
        ]);
        const now = Date.now();

        // Atualizar cache com sucesso
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              regions: regionsData,
              hierarchy: hierarchyData,
              isLoading: false,
              lastFetched: now,
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching regions:", error);
        // Atualizar cache com erro
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              regions: cached?.regions || [],
              hierarchy: cached?.hierarchy || [],
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

  addRegion: async (bookId: string, region: IRegion) => {
    try {
      // createRegion expects region without id, createdAt, updatedAt, orderIndex
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, orderIndex, ...regionData } = region;
      const createdRegion = await createRegion(regionData);

      // Atualizar cache - adicionar a nova região e refazer hierarquia
      const hierarchyData = await getRegionHierarchy(bookId);

      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              regions: [...(cached?.regions || []), createdRegion],
              hierarchy: hierarchyData,
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error adding region:", error);
      throw error;
    }
  },

  updateRegionInCache: async (regionId: string, updates: Partial<IRegion>) => {
    try {
      await updateRegion(regionId, updates);

      // Atualizar em todos os caches que contenham essa região
      set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach((bookId) => {
          const cached = newCache[bookId];
          const regionIndex = cached.regions.findIndex(
            (r) => r.id === regionId
          );

          if (regionIndex !== -1) {
            const updatedRegions = [...cached.regions];
            updatedRegions[regionIndex] = {
              ...updatedRegions[regionIndex],
              ...updates,
            };

            newCache[bookId] = {
              ...cached,
              regions: updatedRegions,
            };
          }
        });

        return { cache: newCache };
      });

      // Refazer hierarquia para todos os books que têm essa região
      for (const bookId of Object.keys(get().cache)) {
        const cached = get().cache[bookId];
        if (cached.regions.some((r) => r.id === regionId)) {
          const hierarchyData = await getRegionHierarchy(bookId);
          set((state) => ({
            cache: {
              ...state.cache,
              [bookId]: {
                ...state.cache[bookId],
                hierarchy: hierarchyData,
              },
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error updating region:", error);
      throw error;
    }
  },

  deleteRegionFromCache: async (bookId: string, regionId: string) => {
    try {
      await deleteRegion(regionId);

      // Remover do cache e refazer hierarquia
      const hierarchyData = await getRegionHierarchy(bookId);

      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              regions: (cached?.regions || []).filter((r) => r.id !== regionId),
              hierarchy: hierarchyData,
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error deleting region:", error);
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

  getRegions: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.regions || [];
  },

  getHierarchy: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.hierarchy || [];
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
