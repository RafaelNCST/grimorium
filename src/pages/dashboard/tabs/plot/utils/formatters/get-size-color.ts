import type { PlotArcSize } from "@/types/plot-types";

export function getSizeColor(size: PlotArcSize): string {
  switch (size) {
    case "mini":
      return "bg-violet-500/20 text-violet-600 border-violet-500/30";
    case "pequeno":
      return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    case "médio":
      return "bg-indigo-500/20 text-indigo-600 border-indigo-500/30";
    case "grande":
      return "bg-purple-500/20 text-purple-600 border-purple-500/30";
    default:
      return "bg-muted";
  }
}
