import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { IFaction } from "@/types/faction-types";

import { calculateTotalByAlignment } from "./utils/calculators/calculate-total-by-alignment";
import { filterFactions } from "./utils/filters/filter-factions";
import { FactionsView } from "./view";

interface PropsFactionsTab {
  bookId: string;
}

export function FactionsTab({ bookId }: PropsFactionsTab) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState<string>("all");
  const [selectedWorld, setSelectedWorld] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [factions, setFactions] = useState<IFaction[]>([]);

  const alignments = useMemo(() => ["all", "Bem", "Neutro", "Caótico"], []);
  const worlds = useMemo(() => ["all", "Aethermoor"], []);

  const filteredFactions = useMemo(
    () =>
      filterFactions({
        factions,
        searchTerm,
        selectedAlignment,
        selectedWorld,
      }),
    [factions, searchTerm, selectedAlignment, selectedWorld]
  );

  const totalByAlignment = useMemo(
    () => calculateTotalByAlignment(factions),
    [factions]
  );

  const handleCreateFaction = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleFactionCreated = useCallback(
    (newFaction: IFaction) => {
      setFactions((prev) => [...prev, newFaction]);
    },
    []
  );

  const handleFactionClick = useCallback(
    (factionId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/faction/$factionId",
        params: { dashboardId: bookId, factionId },
      });
    },
    [navigate, bookId]
  );

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSelectedAlignmentChange = useCallback((alignment: string) => {
    setSelectedAlignment(alignment);
  }, []);

  const handleSelectedWorldChange = useCallback((world: string) => {
    setSelectedWorld(world);
  }, []);

  const handleShowCreateModalChange = useCallback((show: boolean) => {
    setShowCreateModal(show);
  }, []);

  return (
    <FactionsView
      bookId={bookId}
      factions={factions}
      filteredFactions={filteredFactions}
      totalByAlignment={totalByAlignment}
      searchTerm={searchTerm}
      selectedAlignment={selectedAlignment}
      selectedWorld={selectedWorld}
      showCreateModal={showCreateModal}
      alignments={alignments}
      worlds={worlds}
      onSearchTermChange={handleSearchTermChange}
      onSelectedAlignmentChange={handleSelectedAlignmentChange}
      onSelectedWorldChange={handleSelectedWorldChange}
      onShowCreateModalChange={handleShowCreateModalChange}
      onCreateFaction={handleCreateFaction}
      onFactionCreated={handleFactionCreated}
      onFactionClick={handleFactionClick}
    />
  );
}
