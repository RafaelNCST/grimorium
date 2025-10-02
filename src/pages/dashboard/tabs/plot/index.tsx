import { useState, useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import type { IPlotArc } from "@/types/plot-types";

import { MOCK_PLOT_ARCS } from "./mocks/mock-plot-arcs";
import { getSizeColor } from "./utils/get-size-color";
import { getStatusColor } from "./utils/get-status-color";
import { getStatusPriority } from "./utils/get-status-priority";
import { getVisibleEvents } from "./utils/get-visible-events";
import { PlotView } from "./view";

interface PropsPlotTab {
  bookId: string;
}

export function PlotTab({ bookId }: PropsPlotTab) {
  const navigate = useNavigate();
  const [arcs, setArcs] = useState<IPlotArc[]>(MOCK_PLOT_ARCS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const createArc = useCallback(
    (arcData: Omit<IPlotArc, "id" | "events" | "progress">) => {
      const newArc: IPlotArc = {
        ...arcData,
        id: Date.now().toString(),
        events: [],
        progress: 0,
      };

      setArcs((prev) => {
        const updatedArcs = prev.map((arc) => {
          if (arc.order >= newArc.order) {
            return { ...arc, order: arc.order + 1 };
          }
          return arc;
        });

        return [...updatedArcs, newArc].sort((a, b) => a.order - b.order);
      });
    },
    []
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

  const filteredAndSortedArcs = useMemo(
    () =>
      arcs
        .filter(
          (arc) => statusFilter === "todos" || arc.status === statusFilter
        )
        .sort((a, b) => {
          const statusPriorityA = getStatusPriority(a.status);
          const statusPriorityB = getStatusPriority(b.status);

          if (statusPriorityA !== statusPriorityB) {
            return statusPriorityA - statusPriorityB;
          }

          return a.order - b.order;
        }),
    [arcs, statusFilter]
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
      showCreateModal={showCreateModal}
      statusFilter={statusFilter}
      filteredAndSortedArcs={filteredAndSortedArcs}
      bookId={bookId}
      onSetShowCreateModal={setShowCreateModal}
      onSetStatusFilter={setStatusFilter}
      onCreateArc={createArc}
      onMoveArc={moveArc}
      onPlotTimelineClick={handlePlotTimelineClick}
      onArcClick={handleArcClick}
      getSizeColor={getSizeColor}
      getStatusColor={getStatusColor}
      getVisibleEvents={getVisibleEvents}
    />
  );
}
