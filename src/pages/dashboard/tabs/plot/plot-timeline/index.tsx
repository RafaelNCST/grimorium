import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate, useParams } from "@tanstack/react-router";

import type { IPlotArc } from "@/types/plot-types";
import { getPlotArcsByBookId, reorderPlotArcs } from "@/lib/db/plot.service";

import { getSizeColor } from "../utils/get-size-color";
import { getStatusColor } from "../utils/get-status-color";

import { PlotTimelineView } from "./view";

export function PlotTimeline() {
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/plot/plot-timeline",
  });
  const navigate = useNavigate();
  const [arcs, setArcs] = useState<IPlotArc[]>([]);

  // Load arcs from database
  useEffect(() => {
    let mounted = true;

    const loadArcs = async () => {
      try {
        const loadedArcs = await getPlotArcsByBookId(dashboardId!);
        if (mounted) {
          setArcs(loadedArcs);
        }
      } catch (error) {
        console.error("Failed to load plot arcs:", error);
      }
    };

    if (dashboardId) {
      loadArcs();
    }

    return () => {
      mounted = false;
    };
  }, [dashboardId]);

  const sortedArcs = useMemo(
    () => [...arcs].sort((a, b) => a.order - b.order),
    [arcs]
  );

  const handleBack = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: dashboardId! },
    });
  }, [navigate, dashboardId]);

  const handleArcClick = useCallback(
    (arcId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/plot/$plotId",
        params: { dashboardId: dashboardId!, plotId: arcId },
      });
    },
    [navigate, dashboardId]
  );

  const handleReorderArcs = useCallback(async (reorderedArcs: IPlotArc[]) => {
    const updatedArcs = reorderedArcs.map((arc, index) => ({
      ...arc,
      order: index + 1,
    }));

    try {
      await reorderPlotArcs(
        updatedArcs.map((arc) => ({ id: arc.id, order: arc.order }))
      );
      setArcs(updatedArcs);
    } catch (error) {
      console.error("Failed to reorder plot arcs:", error);
    }
  }, []);

  return (
    <PlotTimelineView
      sortedArcs={sortedArcs}
      onBack={handleBack}
      onArcClick={handleArcClick}
      onReorderArcs={handleReorderArcs}
      getSizeColor={getSizeColor}
      getStatusColor={getStatusColor}
    />
  );
}
