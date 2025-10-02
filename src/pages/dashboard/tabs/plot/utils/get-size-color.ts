import type { PlotArcSize } from "@/types/plot-types";

export function getSizeColor(size: PlotArcSize): string {
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
}
