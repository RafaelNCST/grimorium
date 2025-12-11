import { create } from "zustand";

import {
  getPlotArcsByBookId,
  createPlotArc,
  updatePlotArc,
  deletePlotArc,
} from "@/lib/db/plot.service";
import type { IPlotArc, PlotArcStatus, PlotArcSize } from "@/types/plot-types";

interface PlotCache {
  [bookId: string]: {
    arcs: IPlotArc[];
    isLoading: boolean;
    lastFetched: number;
  };
}

interface PlotState {
  cache: PlotCache;

  // Fetch and cache
  fetchPlotArcs: (bookId: string, forceRefresh?: boolean) => Promise<void>;

  // CRUD operations
  addPlotArc: (bookId: string, arc: IPlotArc) => Promise<void>;
  updatePlotArcInCache: (
    arcId: string,
    updates: Partial<IPlotArc>
  ) => Promise<void>;
  deletePlotArcFromCache: (bookId: string, arcId: string) => Promise<void>;

  // Getters
  getArcs: (bookId: string) => IPlotArc[];
  isLoading: (bookId: string) => boolean;

  // Cache management
  invalidateCache: (bookId: string) => void;
}

// Map para rastrear fetches em andamento
const fetchingPromises = new Map<string, Promise<void>>();

export const usePlotStore = create<PlotState>((set, get) => ({
  cache: {},

  fetchPlotArcs: async (bookId: string, forceRefresh = false) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromises.has(bookId) && !forceRefresh) {
      return fetchingPromises.get(bookId);
    }

    const promise = (async () => {
      const cached = get().cache[bookId];

      // Verificar cache se não for forceRefresh
      if (!forceRefresh && cached?.arcs && cached.arcs.length >= 0) {
        // Cache exists and is valid
        return;
      }

      // Marcar como loading
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            arcs: cached?.arcs || [],
            isLoading: true,
            lastFetched: cached?.lastFetched || 0,
          },
        },
      }));

      try {
        // Fetch do DB
        const arcs = await getPlotArcsByBookId(bookId);
        const now = Date.now();

        // Atualizar cache com sucesso
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              arcs,
              isLoading: false,
              lastFetched: now,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching plot arcs:", error);
        // Atualizar cache com erro
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              arcs: cached?.arcs || [],
              isLoading: false,
              lastFetched: cached?.lastFetched || 0,
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

  addPlotArc: async (bookId: string, arc: IPlotArc) => {
    try {
      await createPlotArc(bookId, arc);

      // Atualizar cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              arcs: [...(cached?.arcs || []), arc],
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
            },
          },
        };
      });
    } catch (error) {
      console.error("Error adding plot arc:", error);
      throw error;
    }
  },

  updatePlotArcInCache: async (arcId: string, updates: Partial<IPlotArc>) => {
    try {
      await updatePlotArc(arcId, updates);

      // Atualizar em todos os caches que contenham esse arc
      set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach((bookId) => {
          const cached = newCache[bookId];
          const arcIndex = cached.arcs.findIndex((a) => a.id === arcId);

          if (arcIndex !== -1) {
            const updatedArcs = [...cached.arcs];
            updatedArcs[arcIndex] = {
              ...updatedArcs[arcIndex],
              ...updates,
            };

            newCache[bookId] = {
              ...cached,
              arcs: updatedArcs,
            };
          }
        });

        return { cache: newCache };
      });
    } catch (error) {
      console.error("Error updating plot arc:", error);
      throw error;
    }
  },

  deletePlotArcFromCache: async (bookId: string, arcId: string) => {
    try {
      await deletePlotArc(arcId);

      // Remover do cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              arcs: cached.arcs.filter((a) => a.id !== arcId),
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
            },
          },
        };
      });
    } catch (error) {
      console.error("Error deleting plot arc:", error);
      throw error;
    }
  },

  getArcs: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.arcs || [];
  },

  isLoading: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.isLoading || false;
  },

  invalidateCache: (bookId: string) => {
    set((state) => {
      const newCache = { ...state.cache };
      delete newCache[bookId];
      return { cache: newCache };
    });
  },
}));
