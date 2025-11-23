import { IPlotArc, PlotArcSize } from "@/types/plot-types";

export function calculateTotalBySize(
  arcs: IPlotArc[]
): Record<PlotArcSize, number> {
  return arcs.reduce(
    (acc, arc) => {
      acc[arc.size] = (acc[arc.size] || 0) + 1;
      return acc;
    },
    {} as Record<PlotArcSize, number>
  );
}
