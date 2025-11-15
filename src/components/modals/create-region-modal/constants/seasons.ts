import { Leaf, Sun, Wind, Snowflake, Sparkles, LucideIcon } from "lucide-react";

export type RegionSeasonValue = "spring" | "summer" | "autumn" | "winter" | "custom";

export interface SeasonOption {
  value: RegionSeasonValue;
  label: string;
  description: string;
  icon: LucideIcon;
  requiresCustomName?: boolean;
}

export const REGION_SEASONS: SeasonOption[] = [
  {
    value: "spring",
    label: "Primavera",
    description: "Estação do renascimento",
    icon: Leaf,
  },
  {
    value: "summer",
    label: "Verão",
    description: "Estação do calor",
    icon: Sun,
  },
  {
    value: "autumn",
    label: "Outono",
    description: "Estação da colheita",
    icon: Wind,
  },
  {
    value: "winter",
    label: "Inverno",
    description: "Estação do frio",
    icon: Snowflake,
  },
  {
    value: "custom",
    label: "Outra",
    description: "Estação personalizada",
    icon: Sparkles,
    requiresCustomName: true,
  },
];
