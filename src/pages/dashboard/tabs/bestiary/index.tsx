import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { Beast } from "@/mocks/local/beast-data";

import { filterBeasts } from "./utils/filter-beasts";
import { getUniqueRaces } from "./utils/get-unique-races";
import { BestiaryView } from "./view";

interface PropsBestiaryTab {
  bookId: string;
}

export function BestiaryTab({ bookId }: PropsBestiaryTab) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRace, setSelectedRace] = useState<string>("all");
  const [selectedThreatLevel, setSelectedThreatLevel] = useState<string>("all");
  const [selectedHabit, setSelectedHabit] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const beasts = useMemo<Beast[]>(() => [], []);

  const filteredBeasts = useMemo(
    () =>
      filterBeasts({
        beasts,
        searchQuery,
        selectedRace,
        selectedThreatLevel,
        selectedHabit,
      }),
    [beasts, searchQuery, selectedRace, selectedThreatLevel, selectedHabit]
  );

  const uniqueRaces = useMemo(() => getUniqueRaces(beasts), [beasts]);

  const handleNavigateToBeast = useCallback(
    (beastId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/beast/$beastId",
        params: { dashboardId: bookId, beastId },
      });
    },
    [navigate, bookId]
  );

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSelectedRaceChange = useCallback((race: string) => {
    setSelectedRace(race);
  }, []);

  const handleSelectedThreatLevelChange = useCallback((level: string) => {
    setSelectedThreatLevel(level);
  }, []);

  const handleSelectedHabitChange = useCallback((habit: string) => {
    setSelectedHabit(habit);
  }, []);

  const handleShowCreateModalChange = useCallback((show: boolean) => {
    setShowCreateModal(show);
  }, []);

  return (
    <BestiaryView
      bookId={bookId}
      beasts={beasts}
      filteredBeasts={filteredBeasts}
      uniqueRaces={uniqueRaces}
      searchQuery={searchQuery}
      selectedRace={selectedRace}
      selectedThreatLevel={selectedThreatLevel}
      selectedHabit={selectedHabit}
      showCreateModal={showCreateModal}
      onSearchQueryChange={handleSearchQueryChange}
      onSelectedRaceChange={handleSelectedRaceChange}
      onSelectedThreatLevelChange={handleSelectedThreatLevelChange}
      onSelectedHabitChange={handleSelectedHabitChange}
      onShowCreateModalChange={handleShowCreateModalChange}
      onNavigateToBeast={handleNavigateToBeast}
    />
  );
}
