import {
  Moon,
  Sun,
  Sunset,
  Clock,
  MoonStar,
  SunDim,
  Infinity,
  Eclipse,
  type LucideIcon,
} from "lucide-react";
import { TFunction } from "i18next";

import { GridSelectOption } from "@/components/forms/FormSelectGrid";

export type RaceHabit =
  | "nocturnal"
  | "diurnal"
  | "crepuscular"
  | "catemeral"
  | "lunar"
  | "solar"
  | "transcendental"
  | "infernal";

export interface RaceHabitOption {
  value: RaceHabit;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const getRaceHabits = (t: TFunction): RaceHabitOption[] => [
  {
    value: "nocturnal",
    label: t("races:habits.nocturnal.label"),
    description: t("races:habits.nocturnal.description"),
    icon: Moon,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  {
    value: "diurnal",
    label: t("races:habits.diurnal.label"),
    description: t("races:habits.diurnal.description"),
    icon: Sun,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    value: "crepuscular",
    label: t("races:habits.crepuscular.label"),
    description: t("races:habits.crepuscular.description"),
    icon: Sunset,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    value: "catemeral",
    label: t("races:habits.catemeral.label"),
    description: t("races:habits.catemeral.description"),
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "lunar",
    label: t("races:habits.lunar.label"),
    description: t("races:habits.lunar.description"),
    icon: MoonStar,
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950",
    borderColor: "border-slate-200 dark:border-slate-800",
  },
  {
    value: "solar",
    label: t("races:habits.solar.label"),
    description: t("races:habits.solar.description"),
    icon: SunDim,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    value: "transcendental",
    label: t("races:habits.transcendental.label"),
    description: t("races:habits.transcendental.description"),
    icon: Infinity,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    value: "infernal",
    label: t("races:habits.infernal.label"),
    description: t("races:habits.infernal.description"),
    icon: Eclipse,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
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

export const getHabitsOptions = (t: TFunction): GridSelectOption<RaceHabit>[] =>
  getRaceHabits(t).map((habit) => ({
    value: habit.value,
    label: habit.label,
    description: habit.description,
    icon: habit.icon,
    backgroundColor: convertToTailwindAlpha(habit.bgColor),
    borderColor: convertBorderToTailwindAlpha(habit.borderColor),
  }));
