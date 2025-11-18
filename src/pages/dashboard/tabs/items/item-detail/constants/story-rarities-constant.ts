import {
  Circle,
  Diamond,
  Star,
  Crown,
  type LucideIcon,
} from "lucide-react";

export interface IStoryRarity {
  value: string;
  translationKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  color: string;
  bgColorClass: string;
}

export const STORY_RARITIES_CONSTANT: IStoryRarity[] = [
  {
    value: "common",
    translationKey: "rarity.common",
    descriptionKey: "rarity.common_desc",
    icon: Circle,
    color: "text-gray-600 dark:text-gray-400",
    bgColorClass: "bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20",
  },
  {
    value: "rare",
    translationKey: "rarity.rare",
    descriptionKey: "rarity.rare_desc",
    icon: Diamond,
    color: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20",
  },
  {
    value: "legendary",
    translationKey: "rarity.legendary",
    descriptionKey: "rarity.legendary_desc",
    icon: Star,
    color: "text-purple-600 dark:text-purple-400",
    bgColorClass:
      "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20",
  },
  {
    value: "unique",
    translationKey: "rarity.unique",
    descriptionKey: "rarity.unique_desc",
    icon: Crown,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColorClass:
      "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20",
  },
];
