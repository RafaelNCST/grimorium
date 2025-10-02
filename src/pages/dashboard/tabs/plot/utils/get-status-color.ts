import type { PlotArcStatus } from "@/types/plot-types";

export function getStatusColor(status: PlotArcStatus): string {
  switch (status) {
    case "finalizado":
      return "bg-green-500/20 text-green-400 border-green-400/30";
    case "andamento":
      return "bg-blue-500/20 text-blue-400 border-blue-400/30";
    case "planejamento":
      return "bg-orange-500/20 text-orange-400 border-orange-400/30";
    default:
      return "bg-muted";
  }
}
