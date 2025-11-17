import {
  MapPin,
  Mountain,
  Globe,
  Sparkles,
  Infinity,
  Layers,
  type LucideIcon,
} from "lucide-react";

import { RegionScale } from "../types/region-types";

export interface IRegionScale {
  value: RegionScale;
  icon: LucideIcon;
  translationKey: string;
  colorClass: string;
  bgColorClass: string;
}

export const REGION_SCALES_CONSTANT: IRegionScale[] = [
  {
    value: "local",
    icon: MapPin,
    translationKey: "scales.local",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgColorClass: "bg-emerald-500/10 border-emerald-500/30",
  },
  {
    value: "continental",
    icon: Mountain,
    translationKey: "scales.continental",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "planetary",
    icon: Globe,
    translationKey: "scales.planetary",
    colorClass: "text-violet-600 dark:text-violet-400",
    bgColorClass: "bg-violet-500/10 border-violet-500/30",
  },
  {
    value: "galactic",
    icon: Sparkles,
    translationKey: "scales.galactic",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "universal",
    icon: Infinity,
    translationKey: "scales.universal",
    colorClass: "text-amber-600 dark:text-amber-400",
    bgColorClass: "bg-amber-500/10 border-amber-500/30",
  },
  {
    value: "multiversal",
    icon: Layers,
    translationKey: "scales.multiversal",
    colorClass: "text-pink-600 dark:text-pink-400",
    bgColorClass: "bg-pink-500/10 border-pink-500/30",
  },
];

// Legacy support - these remain for grid/picker components
/**
 * Badge color classes for region scale filters
 */
export const SCALE_BADGE_COLORS: Record<RegionScale, string> = {
  local:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  continental:
    "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  planetary:
    "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
  galactic:
    "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  universal:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  multiversal:
    "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400",
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
