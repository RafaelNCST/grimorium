import { useState, useEffect, useCallback, useMemo } from "react";

import { useCharactersStore } from "@/stores/characters-store";
import { useFactionsStore } from "@/stores/factions-store";
import { useItemsStore } from "@/stores/items-store";
import { useRacesStore } from "@/stores/races-store";
import { useRegionsStore } from "@/stores/regions-store";
import { type ICharacter } from "@/types/character-types";

import type { PinnedEntity, EntityType } from "../types";

interface UsePinnedEntitiesReturn {
  pinnedEntities: PinnedEntity[];
  pinEntity: (type: EntityType, id: string) => void;
  unpinEntity: (type: EntityType, id: string) => void;
  isPinned: (type: EntityType, id: string) => boolean;
  reorderPinnedEntities: (newOrder: PinnedEntity[]) => void;
  pinnedData: {
    characters: ICharacter[];
    regions: any[];
    factions: any[];
    items: any[];
    races: any[];
  };
}

export function usePinnedEntities(
  chapterId: string,
  bookId: string
): UsePinnedEntitiesReturn {
  const [pins, setPins] = useState<PinnedEntity[]>([]);

  // Get entities directly from store cache (reactive)
  const characters = useCharactersStore(
    (state) => state.cache[bookId]?.characters || []
  );
  const regions = useRegionsStore(
    (state) => state.cache[bookId]?.regions || []
  );
  const factions = useFactionsStore(
    (state) => state.cache[bookId]?.factions || []
  );
  const items = useItemsStore((state) => state.cache[bookId]?.items || []);
  const races = useRacesStore((state) => state.cache[bookId]?.races || []);

  // Load pinned entities from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`pinnedEntities_${chapterId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPins(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Failed to parse pinned entities:", error);
        setPins([]);
      }
    }
  }, [chapterId]);

  // Save pinned entities to localStorage when changed
  useEffect(() => {
    localStorage.setItem(`pinnedEntities_${chapterId}`, JSON.stringify(pins));
  }, [pins, chapterId]);

  // Pin an entity
  const pinEntity = useCallback((type: EntityType, id: string) => {
    setPins((prev) => {
      // Check if already pinned
      if (prev.some((p) => p.type === type && p.id === id)) {
        return prev;
      }

      return [...prev, { type, id }];
    });
  }, []);

  // Unpin an entity
  const unpinEntity = useCallback((type: EntityType, id: string) => {
    setPins((prev) => prev.filter((p) => !(p.type === type && p.id === id)));
  }, []);

  // Check if entity is pinned
  const isPinned = useCallback(
    (type: EntityType, id: string) =>
      pins.some((p) => p.type === type && p.id === id),
    [pins]
  );

  // Reorder pinned entities
  const reorderPinnedEntities = useCallback((newOrder: PinnedEntity[]) => {
    setPins(newOrder);
  }, []);

  // Get actual entity data for pinned entities
  const pinnedData = useMemo(() => {
    const pinnedCharacters = pins
      .filter((p) => p.type === "character")
      .map((p) => characters.find((c) => c.id === p.id))
      .filter(Boolean) as ICharacter[];

    const pinnedRegions = pins
      .filter((p) => p.type === "region")
      .map((p) => regions.find((r) => r.id === p.id))
      .filter(Boolean);

    const pinnedFactions = pins
      .filter((p) => p.type === "faction")
      .map((p) => factions.find((f) => f.id === p.id))
      .filter(Boolean);

    const pinnedItems = pins
      .filter((p) => p.type === "item")
      .map((p) => items.find((i) => i.id === p.id))
      .filter(Boolean);

    const pinnedRaces = pins
      .filter((p) => p.type === "race")
      .map((p) => races.find((r) => r.id === p.id))
      .filter(Boolean);

    return {
      characters: pinnedCharacters,
      regions: pinnedRegions,
      factions: pinnedFactions,
      items: pinnedItems,
      races: pinnedRaces,
    };
  }, [pins, characters, regions, factions, items, races]);

  return {
    pinnedEntities: pins,
    pinEntity,
    unpinEntity,
    isPinned,
    reorderPinnedEntities,
    pinnedData,
  };
}
