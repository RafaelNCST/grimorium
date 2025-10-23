import {
  Minimize2,
  TrendingDown,
  Minus,
  TrendingUp,
  Zap,
  Crown,
  type LucideIcon,
} from "lucide-react";

export interface IFactionInfluenceConstant {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
  bgColorClass: string;
}

export const FACTION_INFLUENCE_CONSTANT: IFactionInfluenceConstant[] = [
  {
    value: "nonexistent",
    icon: Minimize2,
    translationKey: "influence.nonexistent",
    descriptionKey: "influence.nonexistent_desc",
    colorClass: "text-gray-600",
    bgColorClass: "bg-gray-500/10 border-gray-500/30",
  },
  {
    value: "low",
    icon: TrendingDown,
    translationKey: "influence.low",
    descriptionKey: "influence.low_desc",
    colorClass: "text-yellow-600",
    bgColorClass: "bg-yellow-500/10 border-yellow-500/30",
  },
  {
    value: "medium",
    icon: Minus,
    translationKey: "influence.medium",
    descriptionKey: "influence.medium_desc",
    colorClass: "text-orange-600",
    bgColorClass: "bg-orange-500/10 border-orange-500/30",
  },
  {
    value: "high",
    icon: TrendingUp,
    translationKey: "influence.high",
    descriptionKey: "influence.high_desc",
    colorClass: "text-blue-600",
    bgColorClass: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "superior",
    icon: Zap,
    translationKey: "influence.superior",
    descriptionKey: "influence.superior_desc",
    colorClass: "text-violet-600",
    bgColorClass: "bg-violet-500/10 border-violet-500/30",
  },
  {
    value: "dominant",
    icon: Crown,
    translationKey: "influence.dominant",
    descriptionKey: "influence.dominant_desc",
    colorClass: "text-purple-600",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
];
