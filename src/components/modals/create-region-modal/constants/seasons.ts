import { Leaf, Sun, Wind, Snowflake, Sparkles, LucideIcon } from "lucide-react";

export type RegionSeasonValue = "spring" | "summer" | "autumn" | "winter" | "custom";

export interface SeasonOption {
  value: RegionSeasonValue;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresCustomName?: boolean;
}

export const REGION_SEASONS: SeasonOption[] = [
  {
    value: "spring",
    label: "Primavera",
    description: "Estação do renascimento",
    icon: Leaf,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    value: "summer",
    label: "Verão",
    description: "Estação do calor",
    icon: Sun,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    value: "autumn",
    label: "Outono",
    description: "Estação da colheita",
    icon: Wind,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    value: "winter",
    label: "Inverno",
    description: "Estação do frio",
    icon: Snowflake,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "custom",
    label: "Outra",
    description: "Estação personalizada",
    icon: Sparkles,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
    requiresCustomName: true,
  },
];
