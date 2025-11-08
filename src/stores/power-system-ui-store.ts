import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * UI state for a single power system
 */
interface PowerSystemUIState {
  expandedGroups: string[];
  currentPageId: string | null;
  isEditMode: boolean;
  isLeftSidebarOpen: boolean;
  selectedItemId: string | null;
  selectedItemType: "page" | "group" | null;
}

/**
 * Cache of UI states organized by systemId
 */
interface PowerSystemUICache {
  [systemId: string]: PowerSystemUIState;
}

/**
 * Store state and actions
 */
interface PowerSystemUIStoreState {
  cache: PowerSystemUICache;

  // Getters
  getSystemState: (systemId: string) => PowerSystemUIState;
  getExpandedGroups: (systemId: string) => Set<string>;
  getCurrentPageId: (systemId: string) => string | null;
  getEditMode: (systemId: string) => boolean;
  getSidebarOpen: (systemId: string) => boolean;
  getSelectedItem: (systemId: string) => { id: string | null; type: "page" | "group" | null };

  // Setters
  setExpandedGroups: (systemId: string, groups: Set<string>) => void;
  toggleGroup: (systemId: string, groupId: string) => void;
  setCurrentPageId: (systemId: string, pageId: string | null) => void;
  setEditMode: (systemId: string, isEdit: boolean) => void;
  setSidebarOpen: (systemId: string, isOpen: boolean) => void;
  setSelectedItem: (systemId: string, itemId: string | null, itemType: "page" | "group" | null) => void;

  // Utilities
  clearSystemState: (systemId: string) => void;
  clearAllStates: () => void;
}

/**
 * Default UI state for a new system
 */
const getDefaultState = (): PowerSystemUIState => ({
  expandedGroups: [],
  currentPageId: null,
  isEditMode: true, // New systems start in edit mode by default
  isLeftSidebarOpen: true,
  selectedItemId: null,
  selectedItemType: null,
});

/**
 * Power System UI Store
 *
 * Persists UI state for each power system including:
 * - Expanded groups in navigation sidebar
 * - Current selected page
 * - Edit mode state
 * - Sidebar open/closed state
 */
export const usePowerSystemUIStore = create<PowerSystemUIStoreState>()(
  persist(
    (set, get) => ({
      cache: {},

      // ========================================================================
      // GETTERS
      // ========================================================================

      getSystemState: (systemId: string) => {
        const { cache } = get();
        return cache[systemId] || getDefaultState();
      },

      getExpandedGroups: (systemId: string) => {
        const state = get().getSystemState(systemId);
        return new Set(state.expandedGroups);
      },

      getCurrentPageId: (systemId: string) => {
        const state = get().getSystemState(systemId);
        return state.currentPageId;
      },

      getEditMode: (systemId: string) => {
        const state = get().getSystemState(systemId);
        return state.isEditMode;
      },

      getSidebarOpen: (systemId: string) => {
        const state = get().getSystemState(systemId);
        return state.isLeftSidebarOpen;
      },

      getSelectedItem: (systemId: string) => {
        const state = get().getSystemState(systemId);
        return {
          id: state.selectedItemId,
          type: state.selectedItemType,
        };
      },

      // ========================================================================
      // SETTERS
      // ========================================================================

      setExpandedGroups: (systemId: string, groups: Set<string>) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [systemId]: {
              ...(state.cache[systemId] || getDefaultState()),
              expandedGroups: Array.from(groups),
            },
          },
        }));
      },

      toggleGroup: (systemId: string, groupId: string) => {
        set((state) => {
          const currentState = state.cache[systemId] || getDefaultState();
          const expandedSet = new Set(currentState.expandedGroups);

          if (expandedSet.has(groupId)) {
            expandedSet.delete(groupId);
          } else {
            expandedSet.add(groupId);
          }

          return {
            cache: {
              ...state.cache,
              [systemId]: {
                ...currentState,
                expandedGroups: Array.from(expandedSet),
              },
            },
          };
        });
      },

      setCurrentPageId: (systemId: string, pageId: string | null) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [systemId]: {
              ...(state.cache[systemId] || getDefaultState()),
              currentPageId: pageId,
            },
          },
        }));
      },

      setEditMode: (systemId: string, isEdit: boolean) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [systemId]: {
              ...(state.cache[systemId] || getDefaultState()),
              isEditMode: isEdit,
            },
          },
        }));
      },

      setSidebarOpen: (systemId: string, isOpen: boolean) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [systemId]: {
              ...(state.cache[systemId] || getDefaultState()),
              isLeftSidebarOpen: isOpen,
            },
          },
        }));
      },

      setSelectedItem: (systemId: string, itemId: string | null, itemType: "page" | "group" | null) => {
        set((state) => ({
          cache: {
            ...state.cache,
            [systemId]: {
              ...(state.cache[systemId] || getDefaultState()),
              selectedItemId: itemId,
              selectedItemType: itemType,
            },
          },
        }));
      },

      // ========================================================================
      // UTILITIES
      // ========================================================================

      clearSystemState: (systemId: string) => {
        set((state) => {
          const newCache = { ...state.cache };
          delete newCache[systemId];
          return { cache: newCache };
        });
      },

      clearAllStates: () => {
        set({ cache: {} });
      },
    }),
    {
      name: "grimorium-power-system-ui",
      version: 1,
    }
  )
);
