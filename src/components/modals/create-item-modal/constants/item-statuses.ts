import {
  GiBroadsword,
  GiHammerBreak,
  GiBrokenShield,
  GiPadlock,
  GiCrackedShield,
  GiUpgrade,
  GiCutDiamond,
} from "react-icons/gi";

import type { IconType } from "react-icons";

export interface IItemStatus {
  value: string;
  translationKey: string;
  icon: IconType;
  color: string;
  activeColor: string;
  colorClass: string;
  bgColorClass: string;
}

export const ITEM_STATUSES_CONSTANT: IItemStatus[] = [
  {
    value: "complete",
    translationKey: "status.complete",
    icon: GiBroadsword,
    color: "text-muted-foreground",
    activeColor: "text-green-600 dark:text-green-400",
    colorClass: "text-green-600 dark:text-green-400",
    bgColorClass: "bg-green-500/10 border-green-500/30",
  },
  {
    value: "incomplete",
    translationKey: "status.incomplete",
    icon: GiHammerBreak,
    color: "text-muted-foreground",
    activeColor: "text-slate-700 dark:text-slate-300",
    colorClass: "text-slate-700 dark:text-slate-300",
    bgColorClass: "bg-slate-500/10 border-slate-500/30",
  },
  {
    value: "destroyed",
    translationKey: "status.destroyed",
    icon: GiBrokenShield,
    color: "text-muted-foreground",
    activeColor: "text-red-600 dark:text-red-400",
    colorClass: "text-red-600 dark:text-red-400",
    bgColorClass: "bg-red-500/10 border-red-500/30",
  },
  {
    value: "sealed",
    translationKey: "status.sealed",
    icon: GiPadlock,
    color: "text-muted-foreground",
    activeColor: "text-purple-600 dark:text-purple-400",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "weakened",
    translationKey: "status.weakened",
    icon: GiCrackedShield,
    color: "text-muted-foreground",
    activeColor: "text-orange-600 dark:text-orange-400",
    colorClass: "text-orange-600 dark:text-orange-400",
    bgColorClass: "bg-orange-500/10 border-orange-500/30",
  },
  {
    value: "strengthened",
    translationKey: "status.strengthened",
    icon: GiUpgrade,
    color: "text-muted-foreground",
    activeColor: "text-blue-600 dark:text-blue-400",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "apex",
    translationKey: "status.apex",
    icon: GiCutDiamond,
    color: "text-muted-foreground",
    activeColor: "text-yellow-600 dark:text-yellow-400",
    colorClass: "text-yellow-600 dark:text-yellow-400",
    bgColorClass: "bg-yellow-500/10 border-yellow-500/30",
  },
];
