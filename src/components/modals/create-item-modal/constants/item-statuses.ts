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
}

export const ITEM_STATUSES_CONSTANT: IItemStatus[] = [
  {
    value: "complete",
    translationKey: "status.complete",
    icon: GiBroadsword,
    color: "text-muted-foreground",
    activeColor: "text-green-600 dark:text-green-400",
  },
  {
    value: "incomplete",
    translationKey: "status.incomplete",
    icon: GiHammerBreak,
    color: "text-muted-foreground",
    activeColor: "text-slate-700 dark:text-slate-300",
  },
  {
    value: "destroyed",
    translationKey: "status.destroyed",
    icon: GiBrokenShield,
    color: "text-muted-foreground",
    activeColor: "text-red-600 dark:text-red-400",
  },
  {
    value: "sealed",
    translationKey: "status.sealed",
    icon: GiPadlock,
    color: "text-muted-foreground",
    activeColor: "text-purple-600 dark:text-purple-400",
  },
  {
    value: "weakened",
    translationKey: "status.weakened",
    icon: GiCrackedShield,
    color: "text-muted-foreground",
    activeColor: "text-orange-600 dark:text-orange-400",
  },
  {
    value: "strengthened",
    translationKey: "status.strengthened",
    icon: GiUpgrade,
    color: "text-muted-foreground",
    activeColor: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "apex",
    translationKey: "status.apex",
    icon: GiCutDiamond,
    color: "text-muted-foreground",
    activeColor: "text-yellow-600 dark:text-yellow-400",
  },
];
