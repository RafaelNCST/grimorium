import { Leaf, Sun, Wind, Snowflake, Sparkles, LucideIcon } from "lucide-react";

export type RegionSeasonValue =
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "custom";

export interface SeasonOption {
  value: RegionSeasonValue;
  label: string;
  description: string;
  icon: LucideIcon;
  requiresCustomName?: boolean;
}

/**
 * Region seasons constant with translation keys
 * Use with i18n: t('region-detail:seasons.spring'), etc.
 */
export const REGION_SEASONS: SeasonOption[] = [
  {
    value: "spring",
    label: "region-detail:seasons.spring",
    description: "region-detail:seasons.spring_description",
    icon: Leaf,
  },
  {
    value: "summer",
    label: "region-detail:seasons.summer",
    description: "region-detail:seasons.summer_description",
    icon: Sun,
  },
  {
    value: "autumn",
    label: "region-detail:seasons.autumn",
    description: "region-detail:seasons.autumn_description",
    icon: Wind,
  },
  {
    value: "winter",
    label: "region-detail:seasons.winter",
    description: "region-detail:seasons.winter_description",
    icon: Snowflake,
  },
  {
    value: "custom",
    label: "region-detail:seasons.custom",
    description: "region-detail:seasons.custom_description",
    icon: Sparkles,
    requiresCustomName: true,
  },
];
