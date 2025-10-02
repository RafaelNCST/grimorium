import { useState, useCallback, useMemo } from "react";

import { useNavigate, useParams } from "@tanstack/react-router";

import { mockArcs, type IPlotArc } from "@/mocks/local/plot-arcs";

import { PlotTimelineView } from "./view";

export function PlotTimeline() {
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/plot/plot-timeline",
  });
  const navigate = useNavigate();
  const [arcs] = useState<IPlotArc[]>(mockArcs);

  // Sort all arcs by order for the timeline - memoized
  const sortedArcs = useMemo(() => {
    return [...arcs].sort((a, b) => a.order - b.order);
  }, [arcs]);

  // Memoized color function
  const getSizeColor = useCallback((size: string) => {
    switch (size) {
      case "pequeno":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "médio":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "grande":
        return "bg-red-500/20 text-red-400 border-red-400/30";
      default:
        return "bg-muted";
    }
  }, []);

  // Navigation handlers
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

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
