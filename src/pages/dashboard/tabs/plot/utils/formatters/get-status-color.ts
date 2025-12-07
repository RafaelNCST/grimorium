import type { PlotArcStatus } from "@/types/plot-types";

export function getStatusColor(status: PlotArcStatus): string {
  switch (status) {
    case "finished":
      return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
    case "current":
      return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    case "planning":
      return "bg-amber-500/20 text-amber-600 border-amber-500/30";
    default:
      return "bg-muted";
  }
}
