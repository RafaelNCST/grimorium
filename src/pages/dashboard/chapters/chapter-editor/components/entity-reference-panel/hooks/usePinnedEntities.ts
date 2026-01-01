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

  // Get entities from stores
  const getCharacters = useCharactersStore((state) => state.getCharacters);
  const getRegions = useRegionsStore((state) => state.getRegions);
  const getFactions = useFactionsStore((state) => state.getFactions);
  const getItems = useItemsStore((state) => state.getItems);
  const getRaces = useRacesStore((state) => state.getRaces);

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
  const pinEntity = useCallback(
    (type: EntityType, id: string) => {
      setPins((prev) => {
        // Check if already pinned
        if (prev.some((p) => p.type === type && p.id === id)) {
          return prev;
        }

        return [...prev, { type, id }];
      });
    },
    []
  );

  // Unpin an entity
  const unpinEntity = useCallback((type: EntityType, id: string) => {
    setPins((prev) => prev.filter((p) => !(p.type === type && p.id === id)));
  }, []);

  // Check if entity is pinned
  const isPinned = useCallback(
    (type: EntityType, id: string) => {
      return pins.some((p) => p.type === type && p.id === id);
    },
    [pins]
  );

  // Get actual entity data for pinned entities
  const pinnedData = useMemo(() => {
    const allCharacters = getCharacters(bookId);
    const allRegions = getRegions(bookId);
    const allFactions = getFactions(bookId);
    const allItems = getItems(bookId);
    const allRaces = getRaces(bookId);

    const characters = pins
      .filter((p) => p.type === "character")
      .map((p) => allCharacters.find((c) => c.id === p.id))
      .filter(Boolean) as ICharacter[];

    const regions = pins
      .filter((p) => p.type === "region")
      .map((p) => allRegions.find((r) => r.id === p.id))
      .filter(Boolean);

    const factions = pins
      .filter((p) => p.type === "faction")
      .map((p) => allFactions.find((f) => f.id === p.id))
      .filter(Boolean);

    const items = pins
      .filter((p) => p.type === "item")
      .map((p) => allItems.find((i) => i.id === p.id))
      .filter(Boolean);

    const races = pins
      .filter((p) => p.type === "race")
      .map((p) => allRaces.find((r) => r.id === p.id))
      .filter(Boolean);

    return { characters, regions, factions, items, races };
  }, [pins, getCharacters, getRegions, getFactions, getItems, getRaces, bookId]);

  return {
    pinnedEntities: pins,
    pinEntity,
    unpinEntity,
    isPinned,
    pinnedData,
  };
}
