import type { PlotArcStatus } from "@/types/plot-types";

export function getStatusPriority(status: PlotArcStatus): number {
  switch (status) {
    case "andamento":
      return 1;
    case "planejamento":
      return 2;
    case "finalizado":
      return 3;
    default:
      return 4;
  }
}
