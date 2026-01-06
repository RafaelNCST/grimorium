import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useEntityFilters } from "@/hooks/use-entity-filters";
import { useCharactersStore } from "@/stores/characters-store";
import { useFactionsStore } from "@/stores/factions-store";
import { useItemsStore } from "@/stores/items-store";
import { useRacesStore } from "@/stores/races-store";
import { useRegionsStore } from "@/stores/regions-store";
import { calculateEntityStats } from "@/utils/calculate-entity-stats";

import {
  IRegion,
  IRegionWithChildren,
  RegionScale,
  IRegionFormData,
} from "./types/region-types";
import { WorldView } from "./view";

interface WorldTabProps {
  bookId: string;
}

const EMPTY_ARRAY: IRegion[] = [];
const EMPTY_HIERARCHY: IRegionWithChildren[] = [];

export function WorldTab({ bookId }: WorldTabProps) {
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);

  // Stores para cache de dados
  const regions = useRegionsStore(
    (state) => state.cache[bookId]?.regions ?? EMPTY_ARRAY
  );
  const hierarchy = useRegionsStore(
    (state) => state.cache[bookId]?.hierarchy ?? EMPTY_HIERARCHY
  );
  const charactersCache = useCharactersStore((state) => state.cache);
  const factionsCache = useFactionsStore((state) => state.cache);
  const racesCache = useRacesStore((state) => state.cache);
  const itemsCache = useItemsStore((state) => state.cache);

  // Funções de fetch dos stores
  const fetchRegions = useRegionsStore((state) => state.fetchRegions);
  const fetchCharacters = useCharactersStore((state) => state.fetchCharacters);
  const fetchFactions = useFactionsStore((state) => state.fetchFactions);
  const fetchRaces = useRacesStore((state) => state.fetchRaces);
  const fetchItems = useItemsStore((state) => state.fetchItems);
  const addRegion = useRegionsStore((state) => state.addRegion);

  // Dados relacionados vindos dos caches (mapeados para formato simplificado)
  const characters = useMemo(
    () =>
      charactersCache[bookId]?.characters.map((c) => ({
        id: c.id,
        name: c.name,
      })) || [],
    [charactersCache, bookId]
  );
  const factions = useMemo(
    () =>
      factionsCache[bookId]?.factions.map((f) => ({ id: f.id, name: f.name })) ||
      [],
    [factionsCache, bookId]
  );
  const races = useMemo(
    () =>
      racesCache[bookId]?.races.map((r) => ({ id: r.id, name: r.name })) || [],
    [racesCache, bookId]
  );
  const items = useMemo(
    () =>
      itemsCache[bookId]?.items.map((i) => ({ id: i.id, name: i.name })) || [],
    [itemsCache, bookId]
  );

  // Fetch todos os caches em paralelo (usa cache se já tiver)
  useEffect(() => {
    Promise.all([
      fetchRegions(bookId),
      fetchCharacters(bookId),
      fetchFactions(bookId),
      fetchRaces(bookId),
      fetchItems(bookId),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]); // Only bookId as dependency

  // Use entity filters hook
  const {
    filteredEntities: filteredRegions,
    searchTerm: searchQuery,
    setSearchTerm: setSearchQuery,
    selectedFilters,
    toggleFilter,
    clearFilters: _clearFilters,
  } = useEntityFilters({
    entities: regions,
    searchFields: ["name", "summary"],
    filterGroups: [
      {
        key: "scale",
        filterFn: (region, selectedScales) =>
          selectedScales.includes(region.scale),
      },
    ],
  });

  const selectedScales = selectedFilters.scale || [];

  // Calculate scale statistics
  const scaleStats = useMemo(
    () =>
      calculateEntityStats(regions, "scale", [
        "local",
        "continental",
        "planetary",
        "galactic",
        "universal",
        "multiversal",
      ]),
    [regions]
  );

  // Create region map for quick parent lookup
  const regionMap = useMemo(() => {
    const map = new Map<string, IRegion>();
    regions.forEach((region) => map.set(region.id, region));
    return map;
  }, [regions]);

  // Handle search query change
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  // Handle scale filter toggle
  const handleScaleToggle = useCallback(
    (scale: RegionScale) => {
      toggleFilter("scale", scale);
    },
    [toggleFilter]
  );

  // Helper to convert arrays to JSON strings
  const arrayToJson = (arr: string[] | undefined): string | undefined => {
    if (!arr || arr.length === 0) return undefined;
    return JSON.stringify(arr);
  };

  // Handle create region
  const handleCreateRegion = useCallback(
    async (data: IRegionFormData) => {
      try {
        const newRegion: IRegion = {
          id: crypto.randomUUID(),
          bookId,
          name: data.name,
          parentId: data.parentId,
          scale: data.scale,
          summary: data.summary,
          image: data.image,
          orderIndex: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Environment fields
          climate: data.climate,
          currentSeason: data.currentSeason,
          customSeasonName: data.customSeasonName,
          generalDescription: data.generalDescription,
          regionAnomalies: data.regionAnomalies,
          // Information fields
          residentFactions: data.residentFactions,
          dominantFactions: data.dominantFactions,
          importantCharacters: data.importantCharacters,
          racesFound: data.racesFound,
          itemsFound: data.itemsFound,
          // Narrative fields
          narrativePurpose: data.narrativePurpose,
          uniqueCharacteristics: data.uniqueCharacteristics,
          politicalImportance: data.politicalImportance,
          religiousImportance: data.religiousImportance,
          worldPerception: data.worldPerception,
          regionMysteries: data.regionMysteries,
          inspirations: data.inspirations,
        };

        // Add to store (which also saves to DB)
        await addRegion(bookId, newRegion);
        setShowCreateModal(false);
      } catch (error: any) {
        console.error("Failed to create region:", error);
      }
    },
    [bookId, addRegion]
  );

  // Handle region card click - navigate to region detail
  const handleRegionClick = useCallback(
    (regionId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/world/$regionId",
        params: { dashboardId: bookId, regionId },
      });
    },
    [navigate, bookId]
  );

  // Handle refresh regions
  const handleRefreshRegions = useCallback(() => {
    fetchRegions(bookId, true); // forceRefresh = true
  }, [fetchRegions, bookId]);

  return (
    <WorldView
      bookId={bookId}
      regions={filteredRegions}
      allRegions={regions}
      hierarchy={hierarchy}
      isLoading={false}
      searchQuery={searchQuery}
      selectedScales={selectedScales}
      scaleStats={scaleStats}
      regionMap={regionMap}
      showCreateModal={showCreateModal}
      showHierarchyModal={showHierarchyModal}
      characters={characters}
      factions={factions}
      races={races}
      items={items}
      onSearchChange={handleSearchChange}
      onScaleToggle={handleScaleToggle}
      onCreateRegion={handleCreateRegion}
      onRegionClick={handleRegionClick}
      onShowCreateModal={setShowCreateModal}
      onShowHierarchyModal={setShowHierarchyModal}
      onRefreshRegions={handleRefreshRegions}
    />
  );
}
