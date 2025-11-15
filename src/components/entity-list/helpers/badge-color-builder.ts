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
 * Helper to create badge color configuration
 *
 * @example
 * ```tsx
 * const config = createBadgeColorConfig("emerald");
 * // Returns full BadgeColorConfig object with active/inactive classes
 * ```
 */
export function createBadgeColorConfig(color: TailwindColor): BadgeColorConfig {
  return {
    color,
    activeClasses: `!bg-${color}-500 !text-black !border-${color}-500`,
    inactiveClasses: `bg-${color}-500/10 border-${color}-500/30 text-${color}-600 dark:text-${color}-400 hover:!bg-${color}-500 hover:!text-black hover:!border-${color}-500`,
  };
}

/**
 * Pre-configured color configs for common use cases
 */
export const BADGE_COLORS = {
  emerald: createBadgeColorConfig("emerald"),
  blue: createBadgeColorConfig("blue"),
  violet: createBadgeColorConfig("violet"),
  purple: createBadgeColorConfig("purple"),
  amber: createBadgeColorConfig("amber"),
  pink: createBadgeColorConfig("pink"),
  red: createBadgeColorConfig("red"),
  yellow: createBadgeColorConfig("yellow"),
  green: createBadgeColorConfig("green"),
  orange: createBadgeColorConfig("orange"),
  cyan: createBadgeColorConfig("cyan"),
  teal: createBadgeColorConfig("teal"),
  indigo: createBadgeColorConfig("indigo"),
  rose: createBadgeColorConfig("rose"),
  slate: createBadgeColorConfig("slate"),
} as const;
