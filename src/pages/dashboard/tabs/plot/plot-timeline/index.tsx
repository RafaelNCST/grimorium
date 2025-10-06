import { useState, useCallback, useMemo } from "react";

import { useNavigate, useParams } from "@tanstack/react-router";

import type { IPlotArc } from "@/types/plot-types";

import { getSizeColor } from "../utils/get-size-color";

import { PlotTimelineView } from "./view";

export function PlotTimeline() {
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/plot/plot-timeline",
  });
  const navigate = useNavigate();
  const [arcs] = useState<IPlotArc[]>([]);

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

  return (
    <PlotTimelineView
      sortedArcs={sortedArcs}
      onBack={handleBack}
      onArcClick={handleArcClick}
      getSizeColor={getSizeColor}
    />
  );
}
