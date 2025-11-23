import { IPlotArc, PlotArcStatus } from "@/types/plot-types";

export function calculateTotalByStatus(
  arcs: IPlotArc[]
): Record<PlotArcStatus, number> {
  return arcs.reduce(
    (acc, arc) => {
      acc[arc.status] = (acc[arc.status] || 0) + 1;
      return acc;
    },
    {} as Record<PlotArcStatus, number>
  );
}
