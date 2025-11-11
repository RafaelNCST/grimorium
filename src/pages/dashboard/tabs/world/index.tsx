import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/hooks/use-toast";
import { IRegion, IRegionWithChildren, RegionScale, IRegionFormData } from "./types/region-types";
import {
  getRegionsByBookId,
  createRegion,
  getRegionHierarchy,
} from "@/lib/db/regions.service";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { WorldView } from "./view";

interface WorldTabProps {
  bookId: string;
}

export function WorldTab({ bookId }: WorldTabProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [regions, setRegions] = useState<IRegion[]>([]);
  const [hierarchy, setHierarchy] = useState<IRegionWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScales, setSelectedScales] = useState<RegionScale[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);

  // Data for multi-select dropdowns
  const [characters, setCharacters] = useState<Array<{ id: string; name: string }>>([]);
  const [factions, setFactions] = useState<Array<{ id: string; name: string }>>([]);
  const [races, setRaces] = useState<Array<{ id: string; name: string }>>([]);
  const [items, setItems] = useState<Array<{ id: string; name: string }>>([]);

  // Load regions and related data from database
  const loadRegions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [regionsData, hierarchyData, charactersData, factionsData, racesData, itemsData] = await Promise.all([
        getRegionsByBookId(bookId),
        getRegionHierarchy(bookId),
        getCharactersByBookId(bookId),
        getFactionsByBookId(bookId),
        getRacesByBookId(bookId),
        getItemsByBookId(bookId),
      ]);
      setRegions(regionsData);
      setHierarchy(hierarchyData);
      setCharacters(charactersData.map(c => ({ id: c.id, name: c.name })));
      setFactions(factionsData.map(f => ({ id: f.id, name: f.name })));
      setRaces(racesData.map(r => ({ id: r.id, name: r.name })));
      setItems(itemsData.map(i => ({ id: i.id, name: i.name })));
    } catch (error) {
      console.error("Failed to load regions:", error);
      toast({
        title: "Error",
        description: "Failed to load regions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [bookId, toast]);

  // Initial load
  useEffect(() => {
    loadRegions();
  }, [loadRegions]);

  // Filter regions by search and selected scales
  const filteredRegions = useMemo(() => {
    let filtered = regions;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (region) =>
          region.name.toLowerCase().includes(query) ||
          region.summary?.toLowerCase().includes(query)
      );
    }

    // Filter by selected scales
    if (selectedScales.length > 0) {
      filtered = filtered.filter((region) =>
        selectedScales.includes(region.scale)
      );
    }

    return filtered;
  }, [regions, searchQuery, selectedScales]);

  // Calculate scale statistics
  const scaleStats = useMemo(() => {
    const stats = {
      local: 0,
      continental: 0,
      planetary: 0,
      galactic: 0,
      universal: 0,
      multiversal: 0,
    };

    regions.forEach((region) => {
      stats[region.scale]++;
    });

    return stats;
  }, [regions]);

  // Create region map for quick parent lookup
  const regionMap = useMemo(() => {
    const map = new Map<string, IRegion>();
    regions.forEach((region) => map.set(region.id, region));
    return map;
  }, [regions]);

  // Handle search query change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle scale filter toggle
  const handleScaleToggle = useCallback((scale: RegionScale) => {
    setSelectedScales((prev) => {
      if (prev.includes(scale)) {
        return prev.filter((s) => s !== scale);
      } else {
        return [...prev, scale];
      }
    });
  }, []);

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

        toast({
          title: "Success",
          description: "Region created successfully",
        });

        setShowCreateModal(false);
        loadRegions();
      } catch (error: any) {
        console.error("Failed to create region:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to create region",
          variant: "destructive",
        });
      }
    },
    [bookId, toast, loadRegions]
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
