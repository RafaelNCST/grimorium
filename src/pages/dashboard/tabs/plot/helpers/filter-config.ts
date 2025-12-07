import type { FilterRow } from "@/components/entity-list";
import type { PlotArcSize, PlotArcStatus } from "@/types/plot-types";

import { ARC_SIZES_CONSTANT } from "../constants/arc-sizes-constant";
import { ARC_STATUSES_CONSTANT } from "../constants/arc-statuses-constant";

// Map status values to their hover/active colors
const STATUS_COLOR_MAP: Record<
  PlotArcStatus,
  { inactiveClasses: string; activeClasses: string }
> = {
  finished: {
    inactiveClasses:
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:!bg-emerald-500 hover:!text-black hover:!border-emerald-500",
    activeClasses: "!bg-emerald-500 !text-black !border-emerald-500",
  },
  current: {
    inactiveClasses:
      "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
    activeClasses: "!bg-blue-500 !text-black !border-blue-500",
  },
  planning: {
    inactiveClasses:
      "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:!bg-amber-500 hover:!text-black hover:!border-amber-500",
    activeClasses: "!bg-amber-500 !text-black !border-amber-500",
  },
};

// Map size values to their hover/active colors
const SIZE_COLOR_MAP: Record<
  PlotArcSize,
  { inactiveClasses: string; activeClasses: string }
> = {
  mini: {
    inactiveClasses:
      "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:!bg-violet-500 hover:!text-black hover:!border-violet-500",
    activeClasses: "!bg-violet-500 !text-black !border-violet-500",
  },
  small: {
    inactiveClasses:
      "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
    activeClasses: "!bg-blue-500 !text-black !border-blue-500",
  },
  medium: {
    inactiveClasses:
      "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:!bg-indigo-500 hover:!text-black hover:!border-indigo-500",
    activeClasses: "!bg-indigo-500 !text-black !border-indigo-500",
  },
  large: {
    inactiveClasses:
      "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-black hover:!border-purple-500",
    activeClasses: "!bg-purple-500 !text-black !border-purple-500",
  },
};

/**
 * Creates filter rows configuration for plot arcs
 */
export function createPlotFilterRows(
  statusStats: Record<PlotArcStatus, number>,
  sizeStats: Record<PlotArcSize, number>,
  t: (key: string) => string
): { statusRows: FilterRow<string>[]; sizeRows: FilterRow<string>[] } {
  const statusRows: FilterRow<string>[] = [
    {
      id: "plot-statuses",
      items: ARC_STATUSES_CONSTANT.map((status) => ({
        value: status.value,
        label: t(status.translationKey),
        count: statusStats[status.value] || 0,
        icon: status.icon,
        colorConfig: {
          color: status.value,
          ...STATUS_COLOR_MAP[status.value],
        },
      })),
    },
  ];

  const sizeRows: FilterRow<string>[] = [
    {
      id: "plot-sizes",
      items: ARC_SIZES_CONSTANT.map((size) => ({
        value: size.value,
        label: t(size.translationKey),
        count: sizeStats[size.value] || 0,
        icon: size.icon,
        colorConfig: {
          color: size.value,
          ...SIZE_COLOR_MAP[size.value],
        },
      })),
    },
  ];

  return { statusRows, sizeRows };
}
