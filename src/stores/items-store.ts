import { create } from "zustand";

import {
  getItemsByBookId,
  createItem,
  updateItem,
  deleteItem,
  type IItem,
} from "@/lib/db/items.service";

interface ItemsCache {
  [bookId: string]: {
    items: IItem[];
    isLoading: boolean;
    lastFetched: number;
    hasAnimated: boolean;
  };
}

interface ItemsState {
  cache: ItemsCache;
  fetchItems: (bookId: string, forceRefresh?: boolean) => Promise<void>;
  addItem: (bookId: string, item: IItem) => Promise<void>;
  updateItemInCache: (itemId: string, updates: Partial<IItem>) => Promise<void>;
  deleteItemFromCache: (bookId: string, itemId: string) => Promise<void>;
  invalidateCache: (bookId: string) => void;
  getItems: (bookId: string) => IItem[];
  isLoading: (bookId: string) => boolean;
  hasAnimated: (bookId: string) => boolean;
  setHasAnimated: (bookId: string) => void;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  cache: {},

  fetchItems: async (bookId: string, forceRefresh = false) => {
    const { cache } = get();
    const cached = cache[bookId];

    // Se já existe em cache e não é forceRefresh, não buscar novamente
    if (cached && !forceRefresh && cached.items.length > 0) {
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
          items: cached?.items || [],
          isLoading: true,
          lastFetched: cached?.lastFetched || 0,
          hasAnimated: cached?.hasAnimated || false,
        },
      },
    }));

    try {
      const items = await getItemsByBookId(bookId);
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            items,
            isLoading: false,
            lastFetched: Date.now(),
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));
    } catch (error) {
      console.error("Error fetching items:", error);
      // Em caso de erro, marcar como não carregando
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            items: cached?.items || [],
            isLoading: false,
            lastFetched: cached?.lastFetched || 0,
            hasAnimated: cached?.hasAnimated || false,
          },
        },
      }));
    }
  },

  addItem: async (bookId: string, item: IItem) => {
    try {
      await createItem(bookId, item);

      // Atualizar cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              items: [...(cached?.items || []), item],
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  },

  updateItemInCache: async (itemId: string, updates: Partial<IItem>) => {
    try {
      await updateItem(itemId, updates);

      // Atualizar em todos os caches que contenham esse item
      set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach((bookId) => {
          const cached = newCache[bookId];
          const itemIndex = cached.items.findIndex((i) => i.id === itemId);

          if (itemIndex !== -1) {
            const updatedItems = [...cached.items];
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              ...updates,
            };

            newCache[bookId] = {
              ...cached,
              items: updatedItems,
            };
          }
        });

        return { cache: newCache };
      });
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  },

  deleteItemFromCache: async (bookId: string, itemId: string) => {
    try {
      await deleteItem(itemId);

      // Remover do cache
      set((state) => {
        const cached = state.cache[bookId];
        return {
          cache: {
            ...state.cache,
            [bookId]: {
              items: cached.items.filter((i) => i.id !== itemId),
              isLoading: false,
              lastFetched: cached?.lastFetched || Date.now(),
              hasAnimated: cached?.hasAnimated || false,
            },
          },
        };
      });
    } catch (error) {
      console.error("Error deleting item:", error);
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

  getItems: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.items || [];
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
