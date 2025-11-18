import {
  Sword,
  Shield,
  Sparkles,
  Gem,
  Apple,
  Box,
  Crown,
  HelpCircle,
  Wrench,
  Coins,
} from "lucide-react";
import {
  GiBroadsword,
  GiHammerBreak,
  GiBrokenShield,
  GiPadlock,
  GiCrackedShield,
  GiUpgrade,
  GiCutDiamond,
} from "react-icons/gi";

import type { FilterRow } from "@/components/entity-list";

export interface ItemFilterStats {
  total: number;
  // Categories
  weapon: number;
  armor: number;
  accessory: number;
  artifact: number;
  consumable: number;
  relic: number;
  tool: number;
  treasure: number;
  other: number;
  // Statuses
  complete: number;
  incomplete: number;
  destroyed: number;
  sealed: number;
  weakened: number;
  strengthened: number;
  apex: number;
}

/**
 * Creates filter rows configuration for items with unified colors
 */
export function createItemFilterRows(
  stats: ItemFilterStats,
  t: (key: string) => string
): { categoryRows: FilterRow<string>[]; statusRows: FilterRow<string>[] } {
  const categoryRows: FilterRow<string>[] = [
    {
      id: "item-categories",
      items: [
        {
          value: "weapon",
          label: t("create-item:category.weapon"),
          count: stats.weapon,
          icon: Sword,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
        {
          value: "armor",
          label: t("create-item:category.armor"),
          count: stats.armor,
          icon: Shield,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
        {
          value: "accessory",
          label: t("create-item:category.accessory"),
          count: stats.accessory,
          icon: Sparkles,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
        {
          value: "artifact",
          label: t("create-item:category.artifact"),
          count: stats.artifact,
          icon: Crown,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
        {
          value: "consumable",
          label: t("create-item:category.consumable"),
          count: stats.consumable,
          icon: Apple,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
        {
          value: "relic",
          label: t("create-item:category.relic"),
          count: stats.relic,
          icon: Gem,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
        {
          value: "tool",
          label: t("create-item:category.tool"),
          count: stats.tool,
          icon: Wrench,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
        {
          value: "treasure",
          label: t("create-item:category.treasure"),
          count: stats.treasure,
          icon: Coins,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
        {
          value: "other",
          label: t("create-item:category.other"),
          count: stats.other,
          icon: HelpCircle,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-white hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-white !border-purple-500",
          },
        },
      ],
    },
  ];

  const statusRows: FilterRow<string>[] = [
    {
      id: "item-statuses",
      items: [
        {
          value: "complete",
          label: t("create-item:status.complete"),
          count: stats.complete,
          icon: GiBroadsword,
          colorConfig: {
            color: "green",
            inactiveClasses:
              "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:!bg-green-500 hover:!text-black hover:!border-green-500",
            activeClasses: "!bg-green-500 !text-black !border-green-500",
          },
        },
        {
          value: "incomplete",
          label: t("create-item:status.incomplete"),
          count: stats.incomplete,
          icon: GiHammerBreak,
          colorConfig: {
            color: "slate",
            inactiveClasses:
              "bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300 hover:!bg-slate-500 hover:!text-black hover:!border-slate-500",
            activeClasses: "!bg-slate-500 !text-black !border-slate-500",
          },
        },
        {
          value: "destroyed",
          label: t("create-item:status.destroyed"),
          count: stats.destroyed,
          icon: GiBrokenShield,
          colorConfig: {
            color: "red",
            inactiveClasses:
              "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:!bg-red-500 hover:!text-black hover:!border-red-500",
            activeClasses: "!bg-red-500 !text-black !border-red-500",
          },
        },
        {
          value: "sealed",
          label: t("create-item:status.sealed"),
          count: stats.sealed,
          icon: GiPadlock,
          colorConfig: {
            color: "purple",
            inactiveClasses:
              "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-black hover:!border-purple-500",
            activeClasses: "!bg-purple-500 !text-black !border-purple-500",
          },
        },
        {
          value: "weakened",
          label: t("create-item:status.weakened"),
          count: stats.weakened,
          icon: GiCrackedShield,
          colorConfig: {
            color: "orange",
            inactiveClasses:
              "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:!bg-orange-500 hover:!text-black hover:!border-orange-500",
            activeClasses: "!bg-orange-500 !text-black !border-orange-500",
          },
        },
        {
          value: "strengthened",
          label: t("create-item:status.strengthened"),
          count: stats.strengthened,
          icon: GiUpgrade,
          colorConfig: {
            color: "blue",
            inactiveClasses:
              "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500",
            activeClasses: "!bg-blue-500 !text-black !border-blue-500",
          },
        },
        {
          value: "apex",
          label: t("create-item:status.apex"),
          count: stats.apex,
          icon: GiCutDiamond,
          colorConfig: {
            color: "yellow",
            inactiveClasses:
              "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:!bg-yellow-500 hover:!text-black hover:!border-yellow-500",
            activeClasses: "!bg-yellow-500 !text-black !border-yellow-500",
          },
        },
      ],
    },
  ];

  return { categoryRows, statusRows };
}
