import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useEntityFilters } from "@/hooks/use-entity-filters";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import {
  getRegionsByBookId,
  createRegion,
  getRegionHierarchy,
} from "@/lib/db/regions.service";
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

export function WorldTab({ bookId }: WorldTabProps) {
  const navigate = useNavigate();

  const [regions, setRegions] = useState<IRegion[]>([]);
  const [hierarchy, setHierarchy] = useState<IRegionWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);

  // Data for multi-select dropdowns
  const [characters, setCharacters] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [factions, setFactions] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [races, setRaces] = useState<Array<{ id: string; name: string }>>([]);
  const [items, setItems] = useState<Array<{ id: string; name: string }>>([]);

  // Load regions and related data from database
  const loadRegions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        regionsData,
        hierarchyData,
        charactersData,
        factionsData,
        racesData,
        itemsData,
      ] = await Promise.all([
        getRegionsByBookId(bookId),
        getRegionHierarchy(bookId),
        getCharactersByBookId(bookId),
        getFactionsByBookId(bookId),
        getRacesByBookId(bookId),
        getItemsByBookId(bookId),
      ]);
      setRegions(regionsData);
      setHierarchy(hierarchyData);
      setCharacters(charactersData.map((c) => ({ id: c.id, name: c.name })));
      setFactions(factionsData.map((f) => ({ id: f.id, name: f.name })));
      setRaces(racesData.map((r) => ({ id: r.id, name: r.name })));
      setItems(itemsData.map((i) => ({ id: i.id, name: i.name })));
    } catch (error) {
      console.error("Failed to load regions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  // Initial load
  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

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
        await createRegion({
          bookId,
          name: data.name,
          parentId: data.parentId,
          scale: data.scale,
          summary: data.summary,
          image: data.image,
          // Environment fields
          climate: data.climate,
          currentSeason: data.currentSeason,
          customSeasonName: data.customSeasonName,
          generalDescription: data.generalDescription,
          regionAnomalies: arrayToJson(data.regionAnomalies),
          // Information fields
          residentFactions: arrayToJson(data.residentFactions),
          dominantFactions: arrayToJson(data.dominantFactions),
          importantCharacters: arrayToJson(data.importantCharacters),
          racesFound: arrayToJson(data.racesFound),
          itemsFound: arrayToJson(data.itemsFound),
          // Narrative fields
          narrativePurpose: data.narrativePurpose,
          uniqueCharacteristics: data.uniqueCharacteristics,
          politicalImportance: data.politicalImportance,
          religiousImportance: data.religiousImportance,
          worldPerception: data.worldPerception,
          inspirations: arrayToJson(data.inspirations),
        });

        setShowCreateModal(false);
        loadRegions();
      } catch (error: any) {
        console.error("Failed to create region:", error);
      }
    },
    [bookId, loadRegions]
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

  return (
    <WorldView
      bookId={bookId}
      regions={filteredRegions}
      allRegions={regions}
      hierarchy={hierarchy}
      isLoading={isLoading}
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
      onRefreshRegions={loadRegions}
    />
  );
}
