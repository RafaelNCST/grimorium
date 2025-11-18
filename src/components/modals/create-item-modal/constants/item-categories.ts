import {
  Sword,
  Shield,
  Sparkles,
  Gem,
  Apple,
  Box,
  Crown,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface IItemCategory {
  value: string;
  translationKey: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
}

export const ITEM_CATEGORIES_CONSTANT: IItemCategory[] = [
  {
    value: "weapon",
    translationKey: "category.weapon",
    icon: Sword,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "armor",
    translationKey: "category.armor",
    icon: Shield,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "accessory",
    translationKey: "category.accessory",
    icon: Sparkles,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "relic",
    translationKey: "category.relic",
    icon: Gem,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "consumable",
    translationKey: "category.consumable",
    icon: Apple,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "resource",
    translationKey: "category.resource",
    icon: Box,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "artifact",
    translationKey: "category.artifact",
    icon: Crown,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "other",
    translationKey: "category.other",
    icon: HelpCircle,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
];
