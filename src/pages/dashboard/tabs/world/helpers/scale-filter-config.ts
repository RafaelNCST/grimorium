import {
  MapPin,
  Mountain,
  Globe,
  Sparkles,
  Infinity,
  Layers,
} from "lucide-react";

import { FilterRow, BADGE_COLORS } from "@/components/entity-list";

import { RegionScale } from "../types/region-types";

// Map scale values to their icons
const SCALE_ICONS: Record<RegionScale, typeof MapPin> = {
  local: MapPin,
  continental: Mountain,
  planetary: Globe,
  galactic: Sparkles,
  universal: Infinity,
  multiversal: Layers,
};

/**
 * Creates filter configuration for region scales
 */
export function createScaleFilterRows(
  scaleStats: Record<RegionScale, number>,
  t: (key: string) => string
): FilterRow<RegionScale>[] {
  const scales: RegionScale[] = [
    "local",
    "continental",
    "planetary",
    "galactic",
    "universal",
    "multiversal",
  ];

  return [
    {
      id: "scales",
      items: scales.map((scale) => ({
        value: scale,
        label: t(`scales.${scale}`),
        count: scaleStats[scale],
        icon: SCALE_ICONS[scale],
        colorConfig: getScaleColorConfig(scale),
      })),
    },
  ];
}

/**
 * Maps scale to its color configuration
 */
function getScaleColorConfig(scale: RegionScale) {
  const colorMap: Record<RegionScale, keyof typeof BADGE_COLORS> = {
    local: "emerald",
    continental: "blue",
    planetary: "violet",
    galactic: "purple",
    universal: "amber",
    multiversal: "pink",
  };

  return BADGE_COLORS[colorMap[scale]];
}
