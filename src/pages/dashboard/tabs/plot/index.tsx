import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { usePlotStore } from "@/stores/plot-store";
import type {
  IPlotArc,
  IPlotArcFormData,
  PlotArcStatus,
  PlotArcSize,
} from "@/types/plot-types";

import { calculateTotalBySize } from "./utils/calculators/calculate-total-by-size";
import { calculateTotalByStatus } from "./utils/calculators/calculate-total-by-status";
import { filterArcs } from "./utils/filters/filter-arcs";
import { PlotView } from "./view";

interface PropsPlotTab {
  bookId: string;
}

const EMPTY_ARRAY: IPlotArc[] = [];

export function PlotTab({ bookId }: PropsPlotTab) {
  const navigate = useNavigate();

  // Store selectors - acesso direto ao cache para evitar re-renders
  const arcs = usePlotStore(
    (state) => state.cache[bookId]?.arcs ?? EMPTY_ARRAY
  );
  const isLoading = usePlotStore(
    (state) => state.cache[bookId]?.isLoading ?? false
  );

  // Store actions
  const fetchPlotArcs = usePlotStore((state) => state.fetchPlotArcs);
  const addPlotArc = usePlotStore((state) => state.addPlotArc);

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<PlotArcStatus[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<PlotArcSize[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load data on mount (APENAS na primeira vez)
  useEffect(() => {
    if (!hasInitialized) {
      fetchPlotArcs(bookId).then(() => {
        setHasInitialized(true);
      });
    }
  }, [bookId, hasInitialized, fetchPlotArcs]);

  const filteredArcs = useMemo(
    () =>
      filterArcs({
        arcs,
        searchTerm,
        selectedStatuses,
        selectedSizes,
      }),
    [arcs, searchTerm, selectedStatuses, selectedSizes]
  );

  const statusStats = useMemo(() => calculateTotalByStatus(arcs), [arcs]);

  const sizeStats = useMemo(() => calculateTotalBySize(arcs), [arcs]);

  const handleNavigateToArc = useCallback(
    (arcId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/plot/$plotId",
        params: { dashboardId: bookId, plotId: arcId },
      });
    },
    [navigate, bookId]
  );

  const handleNavigateToTimeline = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/plot/plot-timeline",
      params: { dashboardId: bookId },
    });
  }, [navigate, bookId]);

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleStatusFilterChange = useCallback((status: string) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status as PlotArcStatus)) {
        return prev.filter((s) => s !== status);
      }
      return [...prev, status as PlotArcStatus];
    });
  }, []);

  const handleSizeFilterChange = useCallback((size: string) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size as PlotArcSize)) {
        return prev.filter((s) => s !== size);
      }
      return [...prev, size as PlotArcSize];
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSelectedSizes([]);
  }, []);

  const handleShowCreateModalChange = useCallback((show: boolean) => {
    setShowCreateModal(show);
  }, []);

  const handleCreateArc = useCallback(
    async (arcData: IPlotArcFormData) => {
      const newArc: IPlotArc = {
        id: crypto.randomUUID(),
        name: arcData.name,
        description: arcData.description,
        size: arcData.size as PlotArcSize,
        focus: arcData.focus,
        status: arcData.status as PlotArcStatus,
        events: arcData.events,
        progress: 0,
        order: arcs.length + 1,
        importantCharacters: arcData.importantCharacters || [],
        importantFactions: arcData.importantFactions || [],
        importantItems: arcData.importantItems || [],
        importantRegions: arcData.importantRegions || [],
        arcMessage: arcData.arcMessage,
        worldImpact: arcData.worldImpact,
      };

      try {
        await addPlotArc(bookId, newArc);
        setShowCreateModal(false);
      } catch (error) {
        console.error("Failed to create plot arc:", error);
        throw error;
      }
    },
    [arcs.length, bookId, addPlotArc]
  );

  return (
    <PlotView
      arcs={arcs}
      filteredArcs={filteredArcs}
      searchTerm={searchTerm}
      selectedStatuses={selectedStatuses}
      selectedSizes={selectedSizes}
      statusStats={statusStats}
      sizeStats={sizeStats}
      showCreateModal={showCreateModal}
      isLoading={isLoading}
      bookId={bookId}
      onSearchTermChange={handleSearchTermChange}
      onStatusFilterChange={handleStatusFilterChange}
      onSizeFilterChange={handleSizeFilterChange}
      onClearFilters={handleClearFilters}
      onShowCreateModalChange={handleShowCreateModalChange}
      onNavigateToArc={handleNavigateToArc}
      onNavigateToTimeline={handleNavigateToTimeline}
      onCreateArc={handleCreateArc}
    />
  );
}
