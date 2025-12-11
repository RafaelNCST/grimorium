import { TFunction } from "i18next";
import {
  Leaf,
  Beef,
  Utensils,
  Bug,
  Apple,
  Trash2,
  Ghost,
  Droplet,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

import { GridSelectOption } from "@/components/forms/FormSelectGrid";

export type RaceDiet =
  | "herbivore"
  | "carnivore"
  | "omnivore"
  | "insectivore"
  | "frugivore"
  | "detritivore"
  | "spiritual"
  | "blood"
  | "other";

export interface RaceDietOption {
  value: RaceDiet;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresElement?: boolean;
}

export const getRaceDiets = (t: TFunction): RaceDietOption[] => [
  {
    value: "herbivore",
    label: t("races:diets.herbivore.label"),
    description: t("races:diets.herbivore.description"),
    icon: Leaf,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    value: "carnivore",
    label: t("races:diets.carnivore.label"),
    description: t("races:diets.carnivore.description"),
    icon: Beef,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: "omnivore",
    label: t("races:diets.omnivore.label"),
    description: t("races:diets.omnivore.description"),
    icon: Utensils,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    value: "insectivore",
    label: t("races:diets.insectivore.label"),
    description: t("races:diets.insectivore.description"),
    icon: Bug,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    value: "frugivore",
    label: t("races:diets.frugivore.label"),
    description: t("races:diets.frugivore.description"),
    icon: Apple,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  {
    value: "detritivore",
    label: t("races:diets.detritivore.label"),
    description: t("races:diets.detritivore.description"),
    icon: Trash2,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950",
    borderColor: "border-slate-200 dark:border-slate-800",
  },
  {
    value: "spiritual",
    label: t("races:diets.spiritual.label"),
    description: t("races:diets.spiritual.description"),
    icon: Ghost,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  {
    value: "blood",
    label: t("races:diets.blood.label"),
    description: t("races:diets.blood.description"),
    icon: Droplet,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: "other",
    label: t("races:diets.other.label"),
    description: t("races:diets.other.description"),
    icon: HelpCircle,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950",
    borderColor: "border-violet-200 dark:border-violet-800",
    requiresElement: true,
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

export const getDietOptions = (t: TFunction): GridSelectOption<RaceDiet>[] =>
  getRaceDiets(t).map((diet) => ({
    value: diet.value,
    label: diet.label,
    description: diet.description,
    icon: diet.icon,
    backgroundColor: convertToTailwindAlpha(diet.bgColor),
    borderColor: convertBorderToTailwindAlpha(diet.borderColor),
  }));
