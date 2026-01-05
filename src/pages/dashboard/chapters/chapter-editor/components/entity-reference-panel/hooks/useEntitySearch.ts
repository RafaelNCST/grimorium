import { useState, useMemo } from "react";

import { useCharactersStore } from "@/stores/characters-store";
import { useFactionsStore } from "@/stores/factions-store";
import { useItemsStore } from "@/stores/items-store";
import { useRacesStore } from "@/stores/races-store";
import { useRegionsStore } from "@/stores/regions-store";

import type { EntityType } from "../types";

interface UseEntitySearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: EntityType | "all";
  setSelectedType: (type: EntityType | "all") => void;
  filteredEntities: {
    characters: any[];
    regions: any[];
    factions: any[];
    items: any[];
    races: any[];
  };
}

export function useEntitySearch(bookId: string): UseEntitySearchReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<EntityType | "all">("all");

  // Get entities directly from store cache (reactive)
  const allCharacters = useCharactersStore(
    (state) => state.cache[bookId]?.characters || []
  );
  const allRegions = useRegionsStore(
    (state) => state.cache[bookId]?.regions || []
  );
  const allFactions = useFactionsStore(
    (state) => state.cache[bookId]?.factions || []
  );
  const allItems = useItemsStore((state) => state.cache[bookId]?.items || []);
  const allRaces = useRacesStore((state) => state.cache[bookId]?.races || []);

  // Filter entities based on search term and type
  const filteredEntities = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filterByName = (entities: any[]) => {
      if (!term) return entities;
      return entities.filter((entity) =>
        entity.name.toLowerCase().includes(term)
      );
    };

    const characters =
      selectedType === "all" || selectedType === "character"
        ? filterByName(allCharacters)
        : [];

    const regions =
      selectedType === "all" || selectedType === "region"
        ? filterByName(allRegions)
        : [];

    const factions =
      selectedType === "all" || selectedType === "faction"
        ? filterByName(allFactions)
        : [];

    const items =
      selectedType === "all" || selectedType === "item"
        ? filterByName(allItems)
        : [];

    const races =
      selectedType === "all" || selectedType === "race"
        ? filterByName(allRaces)
        : [];

    return { characters, regions, factions, items, races };
  }, [
    searchTerm,
    selectedType,
    allCharacters,
    allRegions,
    allFactions,
    allItems,
    allRaces,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredEntities,
  };
}
