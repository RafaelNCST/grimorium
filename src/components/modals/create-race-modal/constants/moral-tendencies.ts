import {
  Zap,
  Scale,
  Shield,
  Flame,
  Crown,
  RotateCcw,
  LucideIcon,
} from "lucide-react";
import { TFunction } from "i18next";

import { GridSelectOption } from "@/components/forms/FormSelectGrid";

export type RaceMoralTendency =
  | "chaotic"
  | "neutral"
  | "honorable"
  | "extreme_chaotic"
  | "extreme_honorable"
  | "extreme_neutral";

export interface RaceMoralTendencyOption {
  value: RaceMoralTendency;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const getRaceMoralTendencies = (
  t: TFunction
): RaceMoralTendencyOption[] => [
  {
    value: "chaotic",
    label: t("races:moral_tendencies.chaotic.label"),
    description: t("races:moral_tendencies.chaotic.description"),
    icon: Zap,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: "neutral",
    label: t("races:moral_tendencies.neutral.label"),
    description: t("races:moral_tendencies.neutral.description"),
    icon: Scale,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950",
    borderColor: "border-slate-200 dark:border-slate-800",
  },
  {
    value: "honorable",
    label: t("races:moral_tendencies.honorable.label"),
    description: t("races:moral_tendencies.honorable.description"),
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "extreme_chaotic",
    label: t("races:moral_tendencies.extreme_chaotic.label"),
    description: t("races:moral_tendencies.extreme_chaotic.description"),
    icon: Flame,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    value: "extreme_honorable",
    label: t("races:moral_tendencies.extreme_honorable.label"),
    description: t("races:moral_tendencies.extreme_honorable.description"),
    icon: Crown,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    value: "extreme_neutral",
    label: t("races:moral_tendencies.extreme_neutral.label"),
    description: t("races:moral_tendencies.extreme_neutral.description"),
    icon: RotateCcw,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
];

// Helper para converter para o formato do FormSelectGrid
const convertToTailwindAlpha = (bgColor: string): string => {
  const colorMatch = bgColor.match(
    /(red|orange|blue|green|purple|yellow|indigo|pink|violet|amber|slate|cyan|teal)-/
  );
  if (colorMatch) {
    return `${colorMatch[1]}-500/10`;
  }
  return "gray-500/10";
};

const convertBorderToTailwindAlpha = (borderColor: string): string => {
  const colorMatch = borderColor.match(
    /(red|orange|blue|green|purple|yellow|indigo|pink|violet|amber|slate|cyan|teal)-/
  );
  if (colorMatch) {
    return `${colorMatch[1]}-500/30`;
  }
  return "gray-500/30";
};

export const getMoralTendencyOptions = (
  t: TFunction
): GridSelectOption<RaceMoralTendency>[] =>
  getRaceMoralTendencies(t).map((tendency) => ({
    value: tendency.value,
    label: tendency.label,
    description: tendency.description,
    icon: tendency.icon,
    backgroundColor: convertToTailwindAlpha(tendency.bgColor),
    borderColor: convertBorderToTailwindAlpha(tendency.borderColor),
  }));
