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

  // Get entities from stores
  const getCharacters = useCharactersStore((state) => state.getCharacters);
  const getRegions = useRegionsStore((state) => state.getRegions);
  const getFactions = useFactionsStore((state) => state.getFactions);
  const getItems = useItemsStore((state) => state.getItems);
  const getRaces = useRacesStore((state) => state.getRaces);

  // Filter entities based on search term and type
  const filteredEntities = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const allCharacters = getCharacters(bookId);
    const allRegions = getRegions(bookId);
    const allFactions = getFactions(bookId);
    const allItems = getItems(bookId);
    const allRaces = getRaces(bookId);

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
    bookId,
    getCharacters,
    getRegions,
    getFactions,
    getItems,
    getRaces,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredEntities,
  };
}
