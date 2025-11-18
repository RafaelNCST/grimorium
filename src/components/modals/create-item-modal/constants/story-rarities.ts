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
  activeColor: string;
  baseColorClass: string;
  hoverColorClass: string;
  activeColorClass: string;
}

export const STORY_RARITIES_CONSTANT: IStoryRarity[] = [
  {
    value: "common",
    translationKey: "rarity.common",
    descriptionKey: "rarity.common_desc",
    icon: Circle,
    color: "text-muted-foreground",
    activeColor: "text-slate-700 dark:text-slate-300",
    baseColorClass: "bg-card text-muted-foreground border-border",
    hoverColorClass: "hover:bg-gray-500/10 hover:border-gray-500/20",
    activeColorClass: "bg-gray-500/20 border-gray-500/30 ring-4 ring-gray-500/50 text-white",
  },
  {
    value: "rare",
    translationKey: "rarity.rare",
    descriptionKey: "rarity.rare_desc",
    icon: Diamond,
    color: "text-muted-foreground",
    activeColor: "text-blue-600 dark:text-blue-400",
    baseColorClass: "bg-card text-muted-foreground border-border",
    hoverColorClass: "hover:bg-blue-500/10 hover:border-blue-500/20",
    activeColorClass: "bg-blue-500/20 border-blue-500/30 ring-4 ring-blue-500/50 text-white",
  },
  {
    value: "legendary",
    translationKey: "rarity.legendary",
    descriptionKey: "rarity.legendary_desc",
    icon: Star,
    color: "text-muted-foreground",
    activeColor: "text-purple-600 dark:text-purple-400",
    baseColorClass: "bg-card text-muted-foreground border-border",
    hoverColorClass: "hover:bg-purple-500/10 hover:border-purple-500/20",
    activeColorClass: "bg-purple-500/20 border-purple-500/30 ring-4 ring-purple-500/50 text-white",
  },
  {
    value: "unique",
    translationKey: "rarity.unique",
    descriptionKey: "rarity.unique_desc",
    icon: Crown,
    color: "text-muted-foreground",
    activeColor: "text-yellow-600 dark:text-yellow-400",
    baseColorClass: "bg-card text-muted-foreground border-border",
    hoverColorClass: "hover:bg-yellow-500/10 hover:border-yellow-500/20",
    activeColorClass: "bg-yellow-500/20 border-yellow-500/30 ring-4 ring-yellow-500/50 text-white",
  },
];
