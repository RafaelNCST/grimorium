import type { FilterRow } from "@/components/entity-list";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import type { FactionStatus, FactionType } from "@/types/faction-types";

export interface FactionFilterStats {
  total: number;
  // Statuses
  active: number;
  weakened: number;
  dissolved: number;
  reformed: number;
  apex: number;
  // Types
  commercial: number;
  military: number;
  magical: number;
  religious: number;
  cult: number;
  tribal: number;
  racial: number;
  governmental: number;
  revolutionary: number;
  academic: number;
  royalty: number;
  mercenary: number;
  kingdom: number;
  empire: number;
  country: number;
  divine: number;
}

// Map status values to their hover/active colors
const STATUS_COLOR_MAP: Record<
  string,
  { inactiveClasses: string; activeClasses: string }
> = {
  active: {
    inactiveClasses:
      "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:!bg-green-500 hover:!text-black hover:!border-green-500",
    activeClasses: "!bg-green-500 !text-black !border-green-500",
  },
  weakened: {
    inactiveClasses:
      "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-500",
    activeClasses: "!bg-yellow-500 !text-black !border-yellow-500",
  },
  dissolved: {
    inactiveClasses:
      "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:!bg-red-500 hover:!text-black hover:!border-red-500",
    activeClasses: "!bg-red-500 !text-black !border-red-500",
  },
  reformed: {
    inactiveClasses:
      "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
    activeClasses: "!bg-blue-500 !text-black !border-blue-500",
  },
  apex: {
    inactiveClasses:
      "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-black hover:!border-purple-500",
    activeClasses: "!bg-purple-500 !text-black !border-purple-500",
  },
};

// Map type values to their hover/active colors
const TYPE_COLOR_MAP: Record<
  string,
  { inactiveClasses: string; activeClasses: string }
> = {
  commercial: {
    inactiveClasses:
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:!bg-emerald-500 hover:!text-black hover:!border-emerald-500",
    activeClasses: "!bg-emerald-500 !text-black !border-emerald-500",
  },
  military: {
    inactiveClasses:
      "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:!bg-red-500 hover:!text-black hover:!border-red-500",
    activeClasses: "!bg-red-500 !text-black !border-red-500",
  },
  magical: {
    inactiveClasses:
      "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-black hover:!border-purple-500",
    activeClasses: "!bg-purple-500 !text-black !border-purple-500",
  },
  religious: {
    inactiveClasses:
      "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-500",
    activeClasses: "!bg-yellow-500 !text-black !border-yellow-500",
  },
  cult: {
    inactiveClasses:
      "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:!bg-indigo-500 hover:!text-black hover:!border-indigo-500",
    activeClasses: "!bg-indigo-500 !text-black !border-indigo-500",
  },
  tribal: {
    inactiveClasses:
      "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:!bg-orange-500 hover:!text-black hover:!border-orange-500",
    activeClasses: "!bg-orange-500 !text-black !border-orange-500",
  },
  racial: {
    inactiveClasses:
      "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:!bg-cyan-500 hover:!text-black hover:!border-cyan-500",
    activeClasses: "!bg-cyan-500 !text-black !border-cyan-500",
  },
  governmental: {
    inactiveClasses:
      "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
    activeClasses: "!bg-blue-500 !text-black !border-blue-500",
  },
  revolutionary: {
    inactiveClasses:
      "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:!bg-rose-500 hover:!text-black hover:!border-rose-500",
    activeClasses: "!bg-rose-500 !text-black !border-rose-500",
  },
  academic: {
    inactiveClasses:
      "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400 hover:!bg-teal-500 hover:!text-black hover:!border-teal-500",
    activeClasses: "!bg-teal-500 !text-black !border-teal-500",
  },
  royalty: {
    inactiveClasses:
      "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:!bg-amber-500 hover:!text-black hover:!border-amber-500",
    activeClasses: "!bg-amber-500 !text-black !border-amber-500",
  },
  mercenary: {
    inactiveClasses:
      "bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400 hover:!bg-slate-500 hover:!text-black hover:!border-slate-500",
    activeClasses: "!bg-slate-500 !text-black !border-slate-500",
  },
  kingdom: {
    inactiveClasses:
      "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:!bg-violet-500 hover:!text-black hover:!border-violet-500",
    activeClasses: "!bg-violet-500 !text-black !border-violet-500",
  },
  empire: {
    inactiveClasses:
      "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:!bg-rose-500 hover:!text-black hover:!border-rose-500",
    activeClasses: "!bg-rose-500 !text-black !border-rose-500",
  },
  country: {
    inactiveClasses:
      "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 hover:!bg-sky-500 hover:!text-black hover:!border-sky-500",
    activeClasses: "!bg-sky-500 !text-black !border-sky-500",
  },
  divine: {
    inactiveClasses:
      "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400 hover:!bg-fuchsia-500 hover:!text-black hover:!border-fuchsia-500",
    activeClasses: "!bg-fuchsia-500 !text-black !border-fuchsia-500",
  },
};

/**
 * Creates filter rows configuration for factions
 */
export function createFactionFilterRows(
  statusStats: Record<FactionStatus, number>,
  typeStats: Record<FactionType, number>,
  t: (key: string) => string
): { statusRows: FilterRow<string>[]; typeRows: FilterRow<string>[] } {
  const statusRows: FilterRow<string>[] = [
    {
      id: "faction-statuses",
      items: FACTION_STATUS_CONSTANT.map((status) => ({
        value: status.value,
        label: t(`create-faction:status.${status.value}`),
        count: statusStats[status.value as FactionStatus] || 0,
        icon: status.icon,
        colorConfig: {
          color: status.value,
          ...STATUS_COLOR_MAP[status.value],
        },
      })),
    },
  ];

  const typeRows: FilterRow<string>[] = [
    {
      id: "faction-types",
      items: FACTION_TYPES_CONSTANT.map((type) => ({
        value: type.value,
        label: t(`create-faction:faction_type.${type.value}`),
        count: typeStats[type.value as FactionType] || 0,
        icon: type.icon,
        colorConfig: {
          color: type.value,
          ...TYPE_COLOR_MAP[type.value],
        },
      })),
    },
  ];

  return { statusRows, typeRows };
}
