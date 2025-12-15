import { create } from "zustand";

import {
  getAllGalleryItems,
  getGalleryItemsByBookId,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  deleteGalleryItems,
  addGalleryLink,
  removeGalleryLink,
  updateGalleryLinks,
  reorderGalleryItems,
  getGalleryItemsPaginated,
  getGalleryItemsCount,
} from "@/lib/db/gallery.service";
import { IGalleryItem, IGalleryLink } from "@/types/gallery-types";

const PAGE_SIZE = 30;

interface GalleryState {
  items: IGalleryItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  totalCount: number;
  lastFetched: number;
  currentBookId: string | null;

  // Fetch
  fetchGalleryItems: (forceRefresh?: boolean, bookId?: string) => Promise<void>;
  loadMoreGalleryItems: () => Promise<void>;
  getGalleryItemById: (itemId: string) => Promise<IGalleryItem | null>;

  // CRUD
  addGalleryItem: (item: IGalleryItem) => Promise<void>;
  updateGalleryItemInCache: (
    itemId: string,
    updates: Partial<Omit<IGalleryItem, "id" | "createdAt" | "links">>
  ) => Promise<void>;
  deleteGalleryItemFromCache: (itemId: string) => Promise<void>;
  deleteGalleryItemsFromCache: (itemIds: string[]) => Promise<void>;

  // Links
  addGalleryLinkInCache: (itemId: string, link: IGalleryLink) => Promise<void>;
  removeGalleryLinkFromCache: (itemId: string, linkId: string) => Promise<void>;
  updateGalleryLinksInCache: (
    itemId: string,
    links: IGalleryLink[]
  ) => Promise<void>;

  // Reorder
  reorderGalleryItemsInCache: (reorderedItems: IGalleryItem[]) => Promise<void>;

  // Utils
  invalidateCache: () => void;
  getGalleryItems: () => IGalleryItem[];
}

// Promise para rastrear fetch em andamento
let fetchingPromise: Promise<void> | null = null;
let loadingMorePromise: Promise<void> | null = null;

export const useGalleryStore = create<GalleryState>((set, get) => ({
  items: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  totalCount: 0,
  lastFetched: 0,
  currentBookId: null,

  fetchGalleryItems: async (forceRefresh = false, bookId?: string) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromise && !forceRefresh) {
      return fetchingPromise;
    }

    const promise = (async () => {
      const state = get();

      // Se o bookId mudou, forçar refresh
      const bookIdChanged = bookId !== state.currentBookId;
      const shouldRefresh = forceRefresh || bookIdChanged;

      // Verificar cache se não for shouldRefresh
      if (!shouldRefresh && state.items.length > 0) {
        return;
      }

      // Marcar como loading
      set({
        isLoading: true,
        currentBookId: bookId ?? null,
        items: [], // Limpar itens ao trocar de book ou refresh
      });

      try {
        const targetBookId = bookId ?? null;

        // Buscar primeira página e total count em paralelo
        const [fetchedItems, totalCount] = await Promise.all([
          getGalleryItemsPaginated(targetBookId, 0, PAGE_SIZE),
          getGalleryItemsCount(targetBookId),
        ]);

        const now = Date.now();
        const hasMore = fetchedItems.length < totalCount;

        set({
          items: fetchedItems,
          totalCount,
          hasMore,
          isLoading: false,
          lastFetched: now,
        });
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        set({ isLoading: false });
        throw error;
      }
    })();

    fetchingPromise = promise;

    try {
      await promise;
    } finally {
      fetchingPromise = null;
    }
  },

  loadMoreGalleryItems: async () => {
    // Se já está carregando mais, retornar a promise existente
    if (loadingMorePromise) {
      return loadingMorePromise;
    }

    const state = get();

    // Se não tem mais itens ou está carregando, retornar
    if (!state.hasMore || state.isLoading || state.isLoadingMore) {
      return;
    }

    const promise = (async () => {
      set({ isLoadingMore: true });

      try {
        const currentOffset = state.items.length;
        const targetBookId = state.currentBookId;

        const fetchedItems = await getGalleryItemsPaginated(
          targetBookId,
          currentOffset,
          PAGE_SIZE
        );

        const newItems = [...state.items, ...fetchedItems];
        const hasMore = newItems.length < state.totalCount;

        set({
          items: newItems,
          hasMore,
          isLoadingMore: false,
        });
      } catch (error) {
        console.error("Error loading more gallery items:", error);
        set({ isLoadingMore: false });
        throw error;
      }
    })();

    loadingMorePromise = promise;

    try {
      await promise;
    } finally {
      loadingMorePromise = null;
    }
  },

  getGalleryItemById: async (itemId: string) => {
    // First check cache
    const cached = get().items.find((item) => item.id === itemId);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from DB
    try {
      const item = await getGalleryItemById(itemId);
      if (item) {
        // Add to cache
        set((state) => ({
          items: [...state.items, item],
        }));
      }
      return item;
    } catch (error) {
      console.error("Error getting gallery item:", error);
      return null;
    }
  },

  addGalleryItem: async (item: IGalleryItem) => {
    try {
      await createGalleryItem(item);

      // Add to cache and increment total count
      set((state) => ({
        items: [item, ...state.items],
        totalCount: state.totalCount + 1,
      }));
    } catch (error) {
      console.error("Error adding gallery item:", error);
      throw error;
    }
  },

  updateGalleryItemInCache: async (itemId, updates) => {
    try {
      await updateGalleryItem(itemId, updates);

      // Update cache
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      }));
    } catch (error) {
      console.error("Error updating gallery item:", error);
      throw error;
    }
  },

  deleteGalleryItemFromCache: async (itemId) => {
    try {
      await deleteGalleryItem(itemId);

      // Remove from cache and decrement total count
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
        totalCount: Math.max(0, state.totalCount - 1),
        hasMore: state.items.length - 1 < state.totalCount - 1,
      }));
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      throw error;
    }
  },

  deleteGalleryItemsFromCache: async (itemIds) => {
    try {
      await deleteGalleryItems(itemIds);

      // Remove from cache and decrement total count
      set((state) => ({
        items: state.items.filter((item) => !itemIds.includes(item.id)),
        totalCount: Math.max(0, state.totalCount - itemIds.length),
        hasMore: state.items.length - itemIds.length < state.totalCount - itemIds.length,
      }));
    } catch (error) {
      console.error("Error deleting gallery items:", error);
      throw error;
    }
  },

  addGalleryLinkInCache: async (itemId, link) => {
    try {
      await addGalleryLink(itemId, link);

      // Update cache
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, links: [...item.links, link] } : item
        ),
      }));
    } catch (error) {
      console.error("Error adding gallery link:", error);
      throw error;
    }
  },

  removeGalleryLinkFromCache: async (itemId, linkId) => {
    try {
      await removeGalleryLink(linkId);

      // Update cache
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId
            ? { ...item, links: item.links.filter((l) => l.id !== linkId) }
            : item
        ),
      }));
    } catch (error) {
      console.error("Error removing gallery link:", error);
      throw error;
    }
  },

  updateGalleryLinksInCache: async (itemId, links) => {
    try {
      await updateGalleryLinks(itemId, links);

      // Update cache
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, links } : item
        ),
      }));
    } catch (error) {
      console.error("Error updating gallery links:", error);
      throw error;
    }
  },

  reorderGalleryItemsInCache: async (reorderedItems) => {
    try {
      // Prepare data for service
      const reorderData = reorderedItems.map((item, index) => ({
        id: item.id,
        orderIndex: index,
      }));

      await reorderGalleryItems(reorderData);

      // Update cache
      set({ items: reorderedItems });
    } catch (error) {
      console.error("Error reordering gallery items:", error);
      throw error;
    }
  },

  invalidateCache: () => {
    set({
      items: [],
      lastFetched: 0,
      hasMore: true,
      totalCount: 0,
    });
  },

  getGalleryItems: () => get().items,
}));
