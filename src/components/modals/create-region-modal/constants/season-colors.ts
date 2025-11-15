import { RegionSeason } from "@/pages/dashboard/tabs/world/types/region-types";

/**
 * Base card colors for season picker (neutral state)
 */
export const SEASON_BASE_COLOR = "bg-card text-muted-foreground border-border";

/**
 * Hover colors for season picker cards
 * Note: hover:text-foreground is added in the component
 */
export const SEASON_HOVER_COLOR: Record<RegionSeason, string> = {
  spring: "hover:bg-green-500/10 hover:border-green-500/20",
  summer: "hover:bg-red-500/10 hover:border-red-500/20",
  autumn: "hover:bg-orange-500/10 hover:border-orange-500/20",
  winter: "hover:bg-blue-500/10 hover:border-blue-500/20",
  custom: "hover:bg-purple-500/10 hover:border-purple-500/20",
};

/**
 * Active colors for season picker cards (selected state)
 * Note: text-foreground is added in the component
 */
export const SEASON_ACTIVE_COLOR: Record<RegionSeason, string> = {
  spring: "bg-green-500/20 border-green-500/30 ring-2 ring-green-500/50",
  summer: "bg-red-500/20 border-red-500/30 ring-2 ring-red-500/50",
  autumn: "bg-orange-500/20 border-orange-500/30 ring-2 ring-orange-500/50",
  winter: "bg-blue-500/20 border-blue-500/30 ring-2 ring-blue-500/50",
  custom: "bg-purple-500/20 border-purple-500/30 ring-2 ring-purple-500/50",
};
