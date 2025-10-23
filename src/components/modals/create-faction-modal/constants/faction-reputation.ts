import {
  HelpCircle,
  ThumbsDown,
  AlertTriangle,
  Meh,
  ThumbsUp,
  Heart,
  type LucideIcon,
} from "lucide-react";

export interface IFactionReputationConstant {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
  bgColorClass: string;
}

export const FACTION_REPUTATION_CONSTANT: IFactionReputationConstant[] = [
  {
    value: "unknown",
    icon: HelpCircle,
    translationKey: "reputation.unknown",
    descriptionKey: "reputation.unknown_desc",
    colorClass: "text-gray-600",
    bgColorClass: "bg-gray-500/10 border-gray-500/30",
  },
  {
    value: "hated",
    icon: ThumbsDown,
    translationKey: "reputation.hated",
    descriptionKey: "reputation.hated_desc",
    colorClass: "text-red-600",
    bgColorClass: "bg-red-500/10 border-red-500/30",
  },
  {
    value: "feared",
    icon: AlertTriangle,
    translationKey: "reputation.feared",
    descriptionKey: "reputation.feared_desc",
    colorClass: "text-orange-600",
    bgColorClass: "bg-orange-500/10 border-orange-500/30",
  },
  {
    value: "tolerated",
    icon: Meh,
    translationKey: "reputation.tolerated",
    descriptionKey: "reputation.tolerated_desc",
    colorClass: "text-yellow-600",
    bgColorClass: "bg-yellow-500/10 border-yellow-500/30",
  },
  {
    value: "respected",
    icon: ThumbsUp,
    translationKey: "reputation.respected",
    descriptionKey: "reputation.respected_desc",
    colorClass: "text-blue-600",
    bgColorClass: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "adored",
    icon: Heart,
    translationKey: "reputation.adored",
    descriptionKey: "reputation.adored_desc",
    colorClass: "text-pink-600",
    bgColorClass: "bg-pink-500/10 border-pink-500/30",
  },
];
