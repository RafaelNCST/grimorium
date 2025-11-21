import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { useFactionsStore } from "@/stores/factions-store";
import { type IFaction, type IFactionFormData } from "@/types/faction-types";

import { calculateTotalByStatus } from "./utils/calculators/calculate-total-by-status";
import { calculateTotalByType } from "./utils/calculators/calculate-total-by-type";
import { filterFactions } from "./utils/filters/filter-factions";
import { FactionsView } from "./view";

interface PropsFactionsTab {
  bookId: string;
}

const EMPTY_ARRAY: IFaction[] = [];

export function FactionsTab({ bookId }: PropsFactionsTab) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Use store to manage factions - optimized selectors
  const factions = useFactionsStore(
    (state) => state.cache[bookId]?.factions ?? EMPTY_ARRAY
  );
  const isLoading = useFactionsStore(
    (state) => state.cache[bookId]?.isLoading ?? false
  );

  // Separate store functions (don't need shallow comparison)
  const fetchFactions = useFactionsStore((state) => state.fetchFactions);
  const addFaction = useFactionsStore((state) => state.addFaction);

  // Load factions from cache or database on mount
  useEffect(() => {
    fetchFactions(bookId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]); // Only bookId as dependency

  const filteredFactions = useMemo(
    () =>
      filterFactions({
        factions,
        searchTerm,
        selectedStatuses,
        selectedTypes,
      }),
    [factions, searchTerm, selectedStatuses, selectedTypes]
  );

  const statusStats = useMemo(
    () => calculateTotalByStatus(factions),
    [factions]
  );

  const typeStats = useMemo(() => calculateTotalByType(factions), [factions]);

  const handleNavigateToFaction = useCallback(
    (factionId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/faction/$factionId/",
        params: { dashboardId: bookId, factionId },
      });
    },
    [navigate, bookId]
  );

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleStatusFilterChange = useCallback((status: string) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      }
      return [...prev, status];
    });
  }, []);

  const handleTypeFilterChange = useCallback((type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSelectedTypes([]);
  }, []);

  const handleShowCreateModalChange = useCallback((show: boolean) => {
    setShowCreateModal(show);
  }, []);

  const handleCreateFaction = useCallback(
    async (factionData: IFactionFormData) => {
      const newFaction: IFaction = {
        id: crypto.randomUUID(),
        bookId,
        ...factionData,
        createdAt: new Date().toISOString(),
      };

      try {
        // Add to store (which also saves to DB)
        await addFaction(bookId, newFaction);
        setShowCreateModal(false);
        toast.success("Faction created successfully!");
      } catch (_error) {
        toast.error("Error creating faction");
      }
    },
    [bookId, addFaction]
  );

  return (
    <FactionsView
      bookId={bookId}
      factions={factions}
      filteredFactions={filteredFactions}
      searchTerm={searchTerm}
      selectedStatuses={selectedStatuses}
      selectedTypes={selectedTypes}
      statusStats={statusStats}
      typeStats={typeStats}
      showCreateModal={showCreateModal}
      onSearchTermChange={handleSearchTermChange}
      onStatusFilterChange={handleStatusFilterChange}
      onTypeFilterChange={handleTypeFilterChange}
      onClearFilters={handleClearFilters}
      onShowCreateModalChange={handleShowCreateModalChange}
      onNavigateToFaction={handleNavigateToFaction}
      onCreateFaction={handleCreateFaction}
    />
  );
}
