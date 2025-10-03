import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";

import { MOCK_WORLD_ENTITIES } from "./mocks/mock-world-entities";
import { IWorldEntity, IWorld, IContinent } from "./types/world-types";
import { filterEntities } from "./utils/filter-entities";
import { getParentName } from "./utils/get-parent-name";
import { getTypeColor } from "./utils/get-type-color";
import { WorldView } from "./view";

interface PropsWorldTab {
  bookId: string;
}

export function WorldTab({ bookId }: PropsWorldTab) {
  const navigate = useNavigate();
  const [worldEntities, setWorldEntities] = useState<IWorldEntity[]>(
    MOCK_WORLD_ENTITIES
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateWorldModal, setShowCreateWorldModal] = useState(false);
  const [showCreateContinentModal, setShowCreateContinentModal] =
    useState(false);
  const [showCreateLocationModal, setShowCreateLocationModal] = useState(false);

  const worlds = useMemo(
    () => worldEntities.filter((e) => e.type === "World"),
    [worldEntities]
  );

  const continents = useMemo(
    () => worldEntities.filter((e) => e.type === "Continent"),
    [worldEntities]
  );

  const locations = useMemo(
    () => worldEntities.filter((e) => e.type === "Location"),
    [worldEntities]
  );

  const filteredWorlds = useMemo(
    () => filterEntities(worldEntities, searchTerm, "World"),
    [worldEntities, searchTerm]
  );

  const filteredContinents = useMemo(
    () => filterEntities(worldEntities, searchTerm, "Continent"),
    [worldEntities, searchTerm]
  );

  const filteredLocations = useMemo(
    () => filterEntities(worldEntities, searchTerm, "Location"),
    [worldEntities, searchTerm]
  );

  const entityStats = useMemo(
    () => ({
      totalWorlds: worlds.length,
      totalContinents: continents.length,
      totalLocations: locations.length,
    }),
    [worlds.length, continents.length, locations.length]
  );

  const availableWorlds = useMemo<IWorld[]>(
    () => worlds.map((w) => ({ id: w.id, name: w.name })),
    [worlds]
  );

  const availableContinents = useMemo<IContinent[]>(
    () => continents.map((c) => ({ id: c.id, name: c.name })),
    [continents]
  );

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSetShowCreateWorldModal = useCallback((show: boolean) => {
    setShowCreateWorldModal(show);
  }, []);

  const handleSetShowCreateContinentModal = useCallback((show: boolean) => {
    setShowCreateContinentModal(show);
  }, []);

  const handleSetShowCreateLocationModal = useCallback((show: boolean) => {
    setShowCreateLocationModal(show);
  }, []);

  const handleCreateWorld = useCallback(() => {
    setShowCreateWorldModal(true);
  }, []);

  const handleCreateContinent = useCallback(() => {
    setShowCreateContinentModal(true);
  }, []);

  const handleCreateLocation = useCallback(() => {
    setShowCreateLocationModal(true);
  }, []);

  const handleWorldCreated = useCallback((newWorld: IWorldEntity) => {
    setWorldEntities((prev) => [...prev, newWorld]);
  }, []);

  const handleContinentCreated = useCallback((newContinent: IWorldEntity) => {
    setWorldEntities((prev) => [...prev, newContinent]);
  }, []);

  const handleLocationCreated = useCallback((newLocation: IWorldEntity) => {
    setWorldEntities((prev) => [...prev, newLocation]);
  }, []);

  const handleEntityClick = useCallback(
    (entity: IWorldEntity) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/world/$worldId",
        params: { dashboardId: bookId, worldId: entity.id },
      });
    },
    [navigate, bookId]
  );

  const handleGetTypeColor = useCallback((type: string) => {
    return getTypeColor(type as "World" | "Continent" | "Location");
  }, []);

  const handleGetParentName = useCallback(
    (parentId?: string) => {
      return getParentName(parentId, worldEntities);
    },
    [worldEntities]
  );

  return (
    <WorldView
      bookId={bookId}
      searchTerm={searchTerm}
      worldEntities={worldEntities}
      showCreateWorldModal={showCreateWorldModal}
      showCreateContinentModal={showCreateContinentModal}
      showCreateLocationModal={showCreateLocationModal}
      filteredWorlds={filteredWorlds}
      filteredContinents={filteredContinents}
      filteredLocations={filteredLocations}
      entityStats={entityStats}
      availableWorlds={availableWorlds}
      availableContinents={availableContinents}
      onSetSearchTerm={handleSetSearchTerm}
      onSetShowCreateWorldModal={handleSetShowCreateWorldModal}
      onSetShowCreateContinentModal={handleSetShowCreateContinentModal}
      onSetShowCreateLocationModal={handleSetShowCreateLocationModal}
      onCreateWorld={handleCreateWorld}
      onCreateContinent={handleCreateContinent}
      onCreateLocation={handleCreateLocation}
      onWorldCreated={handleWorldCreated}
      onContinentCreated={handleContinentCreated}
      onLocationCreated={handleLocationCreated}
      onEntityClick={handleEntityClick}
      onGetTypeColor={handleGetTypeColor}
      onGetParentName={handleGetParentName}
    />
  );
}
