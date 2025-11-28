/**
 * Base card colors for physical type picker (neutral state)
 */
export const PHYSICAL_TYPE_BASE_COLOR =
  "bg-card text-muted-foreground border-border";

/**
 * Hover colors for physical type picker cards
 */
export const PHYSICAL_TYPE_HOVER_COLOR: Record<string, string> = {
  malnourished: "hover:bg-orange-500/10 hover:border-orange-500/20",
  thin: "hover:bg-sky-500/10 hover:border-sky-500/20",
  athletic: "hover:bg-emerald-500/10 hover:border-emerald-500/20",
  robust: "hover:bg-blue-500/10 hover:border-blue-500/20",
  corpulent: "hover:bg-purple-500/10 hover:border-purple-500/20",
  aberration: "hover:bg-red-500/10 hover:border-red-500/20",
};

/**
 * Active colors for physical type picker cards (with ring)
 */
export const PHYSICAL_TYPE_ACTIVE_COLOR: Record<string, string> = {
  malnourished:
    "bg-orange-500/20 border-orange-500/30 ring-4 ring-orange-500/50",
  thin: "bg-sky-500/20 border-sky-500/30 ring-4 ring-sky-500/50",
  athletic:
    "bg-emerald-500/20 border-emerald-500/30 ring-4 ring-emerald-500/50",
  robust: "bg-blue-500/20 border-blue-500/30 ring-4 ring-blue-500/50",
  corpulent: "bg-purple-500/20 border-purple-500/30 ring-4 ring-purple-500/50",
  aberration: "bg-red-500/20 border-red-500/30 ring-4 ring-red-500/50",
};
