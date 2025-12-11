import { TFunction } from "i18next";
import {
  Heart,
  Copy,
  Merge,
  Split,
  Baby,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

import { GridSelectOption } from "@/components/forms/FormSelectGrid";

export type RaceReproductiveCycle =
  | "sexual"
  | "asexual"
  | "hermaphrodite"
  | "parthenogenic"
  | "viviparous"
  | "other";

export interface RaceReproductiveCycleOption {
  value: RaceReproductiveCycle;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresDescription?: boolean;
}

export const getRaceReproductiveCycles = (
  t: TFunction
): RaceReproductiveCycleOption[] => [
  {
    value: "sexual",
    label: t("races:reproductive_cycles.sexual.label"),
    description: t("races:reproductive_cycles.sexual.description"),
    icon: Heart,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  {
    value: "asexual",
    label: t("races:reproductive_cycles.asexual.label"),
    description: t("races:reproductive_cycles.asexual.description"),
    icon: Copy,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    value: "hermaphrodite",
    label: t("races:reproductive_cycles.hermaphrodite.label"),
    description: t("races:reproductive_cycles.hermaphrodite.description"),
    icon: Merge,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    value: "parthenogenic",
    label: t("races:reproductive_cycles.parthenogenic.label"),
    description: t("races:reproductive_cycles.parthenogenic.description"),
    icon: Split,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950",
    borderColor: "border-teal-200 dark:border-teal-800",
  },
  {
    value: "viviparous",
    label: t("races:reproductive_cycles.viviparous.label"),
    description: t("races:reproductive_cycles.viviparous.description"),
    icon: Baby,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "other",
    label: t("races:reproductive_cycles.other.label"),
    description: t("races:reproductive_cycles.other.description"),
    icon: HelpCircle,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950",
    borderColor: "border-violet-200 dark:border-violet-800",
    requiresDescription: true,
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

export const getReproductiveCycleOptions = (
  t: TFunction
): GridSelectOption<RaceReproductiveCycle>[] =>
  getRaceReproductiveCycles(t).map((cycle) => ({
    value: cycle.value,
    label: cycle.label,
    description: cycle.description,
    icon: cycle.icon,
    backgroundColor: convertToTailwindAlpha(cycle.bgColor),
    borderColor: convertBorderToTailwindAlpha(cycle.borderColor),
  }));
