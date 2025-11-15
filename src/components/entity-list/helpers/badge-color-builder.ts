import { BadgeColorConfig } from "../EntityFilterBadges";

/**
 * Tailwind color names available for badges
 */
export type TailwindColor =
  | "emerald"
  | "blue"
  | "violet"
  | "purple"
  | "amber"
  | "pink"
  | "red"
  | "yellow"
  | "green"
  | "orange"
  | "cyan"
  | "teal"
  | "indigo"
  | "rose"
  | "slate";

/**
 * Pre-configured color configs with explicit Tailwind classes.
 *
 * IMPORTANT: Tailwind's JIT compiler requires complete class names at build time.
 * Dynamic class generation (e.g., `bg-${color}-500`) does NOT work.
 * Each color must have explicitly written class strings.
 */
export const BADGE_COLORS = {
  emerald: {
    color: "emerald",
    activeClasses: "!bg-emerald-500 !text-black !border-emerald-500",
    inactiveClasses: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:!bg-emerald-500 hover:!text-black hover:!border-emerald-500",
  },
  blue: {
    color: "blue",
    activeClasses: "!bg-blue-500 !text-black !border-blue-500",
    inactiveClasses: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
  },
  violet: {
    color: "violet",
    activeClasses: "!bg-violet-500 !text-black !border-violet-500",
    inactiveClasses: "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:!bg-violet-500 hover:!text-black hover:!border-violet-500",
  },
  purple: {
    color: "purple",
    activeClasses: "!bg-purple-500 !text-black !border-purple-500",
    inactiveClasses: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-black hover:!border-purple-500",
  },
  amber: {
    color: "amber",
    activeClasses: "!bg-amber-500 !text-black !border-amber-500",
    inactiveClasses: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:!bg-amber-500 hover:!text-black hover:!border-amber-500",
  },
  pink: {
    color: "pink",
    activeClasses: "!bg-pink-500 !text-black !border-pink-500",
    inactiveClasses: "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400 hover:!bg-pink-500 hover:!text-black hover:!border-pink-500",
  },
  red: {
    color: "red",
    activeClasses: "!bg-red-500 !text-black !border-red-500",
    inactiveClasses: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:!bg-red-500 hover:!text-black hover:!border-red-500",
  },
  yellow: {
    color: "yellow",
    activeClasses: "!bg-yellow-500 !text-black !border-yellow-500",
    inactiveClasses: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-500",
  },
  green: {
    color: "green",
    activeClasses: "!bg-green-500 !text-black !border-green-500",
    inactiveClasses: "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:!bg-green-500 hover:!text-black hover:!border-green-500",
  },
  orange: {
    color: "orange",
    activeClasses: "!bg-orange-500 !text-black !border-orange-500",
    inactiveClasses: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:!bg-orange-500 hover:!text-black hover:!border-orange-500",
  },
  cyan: {
    color: "cyan",
    activeClasses: "!bg-cyan-500 !text-black !border-cyan-500",
    inactiveClasses: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:!bg-cyan-500 hover:!text-black hover:!border-cyan-500",
  },
  teal: {
    color: "teal",
    activeClasses: "!bg-teal-500 !text-black !border-teal-500",
    inactiveClasses: "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400 hover:!bg-teal-500 hover:!text-black hover:!border-teal-500",
  },
  indigo: {
    color: "indigo",
    activeClasses: "!bg-indigo-500 !text-black !border-indigo-500",
    inactiveClasses: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:!bg-indigo-500 hover:!text-black hover:!border-indigo-500",
  },
  rose: {
    color: "rose",
    activeClasses: "!bg-rose-500 !text-black !border-rose-500",
    inactiveClasses: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:!bg-rose-500 hover:!text-black hover:!border-rose-500",
  },
  slate: {
    color: "slate",
    activeClasses: "!bg-slate-500 !text-black !border-slate-500",
    inactiveClasses: "bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400 hover:!bg-slate-500 hover:!text-black hover:!border-slate-500",
  },
} as const;
