import { create } from "zustand";

import type { ICharacterUIState } from "@/types/character-types";
import type { IFactionUIState } from "@/types/faction-types";
import type { IPlotArcUIState } from "@/types/plot-types";
import type { IItemUIState } from "@/lib/db/items.service";
import type { IRaceUIState } from "@/pages/dashboard/tabs/races/types/race-types";
import type { IRegionUIState } from "@/pages/dashboard/tabs/world/types/region-types";

/**
 * Entity UI State Cache
 *
 * Stores UI preferences (collapsed sections, visibility, etc.) for each entity instance
 * organized by entity type and ID.
 *
 * Structure:
 * {
 *   characters: {
 *     "char-123": { advancedSectionOpen: true, sectionVisibility: {...} },
 *     "char-456": { advancedSectionOpen: false, sectionVisibility: {...} }
 *   },
 *   factions: {
 *     "faction-123": { ... }
 *   },
 *   ...
 * }
 */

export type EntityType = "characters" | "factions" | "items" | "races" | "regions" | "plotArcs";

export type UIStateByType = {
  characters: ICharacterUIState;
  factions: IFactionUIState;
  items: IItemUIState;
  races: IRaceUIState;
  regions: IRegionUIState;
  plotArcs: IPlotArcUIState;
};

interface EntityUIStateCache {
  characters: Record<string, ICharacterUIState>;
  factions: Record<string, IFactionUIState>;
  items: Record<string, IItemUIState>;
  races: Record<string, IRaceUIState>;
  regions: Record<string, IRegionUIState>;
  plotArcs: Record<string, IPlotArcUIState>;
}

interface EntityUIStateStore {
  cache: EntityUIStateCache;

  /**
   * Get UI state for a specific entity instance
   * Returns undefined if not found in cache
   */
  getUIState: <T extends EntityType>(
    entityType: T,
    entityId: string
  ) => UIStateByType[T] | undefined;

  /**
   * Set UI state for a specific entity instance
   * Updates the in-memory cache
   */
  setUIState: <T extends EntityType>(
    entityType: T,
    entityId: string,
    uiState: UIStateByType[T]
  ) => void;

  /**
   * Clear UI state for a specific entity instance
   * Removes from in-memory cache
   */
  clearUIState: (entityType: EntityType, entityId: string) => void;

  /**
   * Clear all UI state for a specific entity type
   * Useful when switching books or logging out
   */
  clearEntityType: (entityType: EntityType) => void;

  /**
   * Clear all UI state cache
   * Useful when logging out or resetting app state
   */
  clearAll: () => void;
}

export const useEntityUIStateStore = create<EntityUIStateStore>((set, get) => ({
  cache: {
    characters: {},
    factions: {},
    items: {},
    races: {},
    regions: {},
    plotArcs: {},
  },

  getUIState: (entityType, entityId) => {
    const cache = get().cache;
    const cachedValue = cache[entityType][entityId];

    // Return a deep copy to prevent reference sharing
    if (!cachedValue) return undefined;

    return JSON.parse(JSON.stringify(cachedValue));
  },

  setUIState: (entityType, entityId, uiState) => {
    // Deep copy to prevent reference sharing
    const uiStateCopy = JSON.parse(JSON.stringify(uiState));

    set((state) => ({
      cache: {
        ...state.cache,
        [entityType]: {
          ...state.cache[entityType],
          [entityId]: uiStateCopy,
        },
      },
    }));
  },

  clearUIState: (entityType, entityId) => {
    set((state) => {
      const newCache = { ...state.cache };
      const entityCache = { ...newCache[entityType] };
      delete entityCache[entityId];
      newCache[entityType] = entityCache;
      return { cache: newCache };
    });
  },

  clearEntityType: (entityType) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [entityType]: {},
      },
    }));
  },

  clearAll: () => {
    set({
      cache: {
        characters: {},
        factions: {},
        items: {},
        races: {},
        regions: {},
        plotArcs: {},
      },
    });
  },
}));
