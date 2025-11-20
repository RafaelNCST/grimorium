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

export const RACE_DIETS: RaceDietOption[] = [
  {
    value: "herbivore",
    label: "Herbívoro",
    description: "Alimenta-se de plantas",
    icon: Leaf,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    value: "carnivore",
    label: "Carnívoro",
    description: "Alimenta-se de carne",
    icon: Beef,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: "omnivore",
    label: "Onívoro",
    description: "Alimenta-se de tudo",
    icon: Utensils,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    value: "insectivore",
    label: "Insetívoro",
    description: "Alimenta-se de insetos",
    icon: Bug,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    value: "frugivore",
    label: "Frugívoro",
    description: "Alimenta-se de frutas e sementes",
    icon: Apple,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  {
    value: "detritivore",
    label: "Detritívoro",
    description: "Alimenta-se de matéria não viva e detritos",
    icon: Trash2,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950",
    borderColor: "border-slate-200 dark:border-slate-800",
  },
  {
    value: "spiritual",
    label: "Espiritual",
    description: "Alimenta-se de energia espiritual",
    icon: Ghost,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  {
    value: "blood",
    label: "Hematófago",
    description: "Se alimenta de sangue",
    icon: Droplet,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: "other",
    label: "Outro",
    description: "Fonte de alimento personalizada",
    icon: HelpCircle,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950",
    borderColor: "border-violet-200 dark:border-violet-800",
    requiresElement: true,
  },
];

// Helper para converter para o formato do FormSelectGrid
const convertToTailwindAlpha = (bgColor: string): string => {
  const colorMatch = bgColor.match(/(red|orange|blue|green|purple|yellow|indigo|pink|violet|amber|slate|cyan|teal)-/);
  if (colorMatch) {
    return `${colorMatch[1]}-500/10`;
  }
  return "gray-500/10";
};

const convertBorderToTailwindAlpha = (borderColor: string): string => {
  const colorMatch = borderColor.match(/(red|orange|blue|green|purple|yellow|indigo|pink|violet|amber|slate|cyan|teal)-/);
  if (colorMatch) {
    return `${colorMatch[1]}-500/30`;
  }
  return "gray-500/30";
};

export const DIET_OPTIONS: GridSelectOption<RaceDiet>[] = RACE_DIETS.map(
  (diet) => ({
    value: diet.value,
    label: diet.label,
    description: diet.description,
    icon: diet.icon,
    backgroundColor: convertToTailwindAlpha(diet.bgColor),
    borderColor: convertBorderToTailwindAlpha(diet.borderColor),
  })
);
