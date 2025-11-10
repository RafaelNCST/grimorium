import { RegionScale } from "../types/region-types";

/**
 * Color classes for region scales (for cards and general use)
 */
export const SCALE_COLORS: Record<RegionScale, string> = {
  local: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  continental: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  planetary: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  galactic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  universal: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  multiversal: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
};

/**
 * Badge color classes for region scale filters
 */
export const SCALE_BADGE_COLORS: Record<RegionScale, string> = {
  local: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  continental: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  planetary: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
  galactic: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  universal: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  multiversal: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400",
};

/**
 * Icon background colors for scale picker
 */
export const SCALE_ICON_BG: Record<RegionScale, string> = {
  local: "bg-emerald-100 dark:bg-emerald-900",
  continental: "bg-blue-100 dark:bg-blue-900",
  planetary: "bg-violet-100 dark:bg-violet-900",
  galactic: "bg-purple-100 dark:bg-purple-900",
  universal: "bg-amber-100 dark:bg-amber-900",
  multiversal: "bg-pink-100 dark:bg-pink-900",
};

/**
 * Icon text colors for scale picker
 */
export const SCALE_ICON_TEXT: Record<RegionScale, string> = {
  local: "text-emerald-600 dark:text-emerald-400",
  continental: "text-blue-600 dark:text-blue-400",
  planetary: "text-violet-600 dark:text-violet-400",
  galactic: "text-purple-600 dark:text-purple-400",
  universal: "text-amber-600 dark:text-amber-400",
  multiversal: "text-pink-600 dark:text-pink-400",
};

/**
 * Base card colors for scale picker (neutral state)
 */
export const SCALE_BASE_COLOR = "bg-card text-muted-foreground border-border";

/**
 * Hover colors for scale picker cards (same pattern as arc sizes)
 * Note: text-white is added in the component
 */
export const SCALE_HOVER_COLOR: Record<RegionScale, string> = {
  local: "hover:bg-emerald-500/10 hover:border-emerald-500/20",
  continental: "hover:bg-blue-500/10 hover:border-blue-500/20",
  planetary: "hover:bg-violet-500/10 hover:border-violet-500/20",
  galactic: "hover:bg-purple-500/10 hover:border-purple-500/20",
  universal: "hover:bg-amber-500/10 hover:border-amber-500/20",
  multiversal: "hover:bg-pink-500/10 hover:border-pink-500/20",
};

/**
 * Active colors for scale picker cards (same pattern as arc sizes with ring)
 * Note: text-white is added in the component
 */
export const SCALE_ACTIVE_COLOR: Record<RegionScale, string> = {
  local: "bg-emerald-500/20 border-emerald-500/30 ring-2 ring-emerald-500/50",
  continental: "bg-blue-500/20 border-blue-500/30 ring-2 ring-blue-500/50",
  planetary: "bg-violet-500/20 border-violet-500/30 ring-2 ring-violet-500/50",
  galactic: "bg-purple-500/20 border-purple-500/30 ring-2 ring-purple-500/50",
  universal: "bg-amber-500/20 border-amber-500/30 ring-2 ring-amber-500/50",
  multiversal: "bg-pink-500/20 border-pink-500/30 ring-2 ring-pink-500/50",
};
