import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import {
  getPlotArcsByBookId,
  createPlotArc,
  reorderPlotArcs,
} from "@/lib/db/plot.service";
import type { IPlotArc, PlotArcStatus, PlotArcSize } from "@/types/plot-types";

import { getSizeColor } from "./utils/get-size-color";
import { getStatusColor } from "./utils/get-status-color";
import { getStatusPriority } from "./utils/get-status-priority";
import { getVisibleEvents } from "./utils/get-visible-events";
import { PlotView } from "./view";

interface PropsPlotTab {
  bookId: string;
}

interface Character {
  id: string;
  name: string;
  image?: string;
}

interface Faction {
  id: string;
  name: string;
  emblem?: string;
}

interface Item {
  id: string;
  name: string;
  image?: string;
}

export function PlotTab({ bookId }: PropsPlotTab) {
  const navigate = useNavigate();
  const [arcs, setArcs] = useState<IPlotArc[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<PlotArcStatus[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<PlotArcSize[]>([]);

  // Load data from database
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [loadedArcs, loadedCharacters, loadedFactions, loadedItems] =
          await Promise.all([
            getPlotArcsByBookId(bookId),
            getCharactersByBookId(bookId),
            getFactionsByBookId(bookId),
            getItemsByBookId(bookId),
          ]);

        if (mounted) {
          setArcs(loadedArcs);
          setCharacters(
            loadedCharacters.map((c) => ({
              id: c.id,
              name: c.name,
              image: c.image,
            }))
          );
          setFactions(
            loadedFactions.map((f) => ({
              id: f.id,
              name: f.name,
              emblem: f.image,
            }))
          );
          setItems(
            loadedItems.map((i) => ({
              id: i.id,
              name: i.name,
              image: i.image,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to load plot data:", error);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [bookId]);

  const createArc = useCallback(
    async (arcData: Omit<IPlotArc, "id" | "progress" | "order">) => {
      const newArc: IPlotArc = {
        ...arcData,
        id: crypto.randomUUID(),
        progress: 0,
        order: arcs.length + 1,
      };

      try {
        await createPlotArc(bookId, newArc);
        setArcs((prev) => [...prev, newArc]);
      } catch (error) {
        console.error("Failed to create plot arc:", error);
        throw error;
      }
    },
    [arcs.length, bookId]
  );

  const moveArc = useCallback((arcId: string, direction: "up" | "down") => {
    setArcs((prev) => {
      const sortedArcs = [...prev].sort((a, b) => a.order - b.order);
      const arcIndex = sortedArcs.findIndex((arc) => arc.id === arcId);

      if (arcIndex === -1) return prev;

      const targetIndex = direction === "up" ? arcIndex - 1 : arcIndex + 1;

      if (targetIndex < 0 || targetIndex >= sortedArcs.length) return prev;

      const currentArc = sortedArcs[arcIndex];
      const targetArc = sortedArcs[targetIndex];

      return prev.map((arc) => {
        if (arc.id === currentArc.id) {
          return { ...arc, order: targetArc.order };
        }
        if (arc.id === targetArc.id) {
          return { ...arc, order: currentArc.order };
        }
        return arc;
      });
    });
  }, []);

  const reorderArcs = useCallback(async (reorderedArcs: IPlotArc[]) => {
    const updatedArcs = reorderedArcs.map((arc, index) => ({
      ...arc,
      order: index + 1,
    }));

    // Optimistic update - update state immediately
    setArcs((prev) => {
      const arcMap = new Map(updatedArcs.map((arc) => [arc.id, arc]));
      return prev.map((arc) => arcMap.get(arc.id) || arc);
    });

    // Save to database in background
    try {
      await reorderPlotArcs(
        updatedArcs.map((arc) => ({ id: arc.id, order: arc.order }))
      );
    } catch (error) {
      console.error("Failed to reorder plot arcs:", error);
      // TODO: Revert state on error if needed
    }
  }, []);

  const handleStatusFilterChange = useCallback((status: PlotArcStatus) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      }
      return [...prev, status];
    });
  }, []);

  const handleSizeFilterChange = useCallback((size: PlotArcSize) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      }
      return [...prev, size];
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSelectedSizes([]);
  }, []);

  const filteredAndSortedArcs = useMemo(
    () =>
      arcs
        .filter((arc) => {
          const hasStatusFilter = selectedStatuses.length > 0;
          const hasSizeFilter = selectedSizes.length > 0;

          let matchesFilters = true;

          if (hasStatusFilter && hasSizeFilter) {
            // Both filters active: arc must match at least one status AND at least one size
            const matchesStatus = selectedStatuses.includes(arc.status);
            const matchesSize = selectedSizes.includes(arc.size);
            matchesFilters = matchesStatus && matchesSize;
          } else if (hasStatusFilter) {
            // Only status filter active: arc must match at least one status
            matchesFilters = selectedStatuses.includes(arc.status);
          } else if (hasSizeFilter) {
            // Only size filter active: arc must match at least one size
            matchesFilters = selectedSizes.includes(arc.size);
          }

          return matchesFilters;
        })
        .sort((a, b) => {
          const statusPriorityA = getStatusPriority(a.status);
          const statusPriorityB = getStatusPriority(b.status);

          if (statusPriorityA !== statusPriorityB) {
            return statusPriorityA - statusPriorityB;
          }

          return a.order - b.order;
        }),
    [arcs, selectedStatuses, selectedSizes]
  );

  const handlePlotTimelineClick = useCallback(
    (bookId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/plot/plot-timeline",
        params: { dashboardId: bookId },
      });
    },
    [navigate]
  );

  const handleArcClick = useCallback(
    (arcId: string, bookId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/plot/$plotId",
        params: { dashboardId: bookId, plotId: arcId },
      });
    },
    [navigate]
  );

  return (
    <PlotView
      arcs={arcs}
      characters={characters}
      factions={factions}
      items={items}
      showCreateModal={showCreateModal}
      selectedStatuses={selectedStatuses}
      selectedSizes={selectedSizes}
      filteredAndSortedArcs={filteredAndSortedArcs}
      bookId={bookId}
      onSetShowCreateModal={setShowCreateModal}
      onStatusFilterChange={handleStatusFilterChange}
      onSizeFilterChange={handleSizeFilterChange}
      onClearFilters={handleClearFilters}
      onCreateArc={createArc}
      onMoveArc={moveArc}
      onReorderArcs={reorderArcs}
      onPlotTimelineClick={handlePlotTimelineClick}
      onArcClick={handleArcClick}
      getSizeColor={getSizeColor}
      getStatusColor={getStatusColor}
      getVisibleEvents={getVisibleEvents}
    />
  );
}
