import {
  type LucideIcon,
  Sparkles,
  Shield,
  Handshake,
  Swords,
  Equal,
  Skull,
  Fish,
} from "lucide-react";

export interface IRaceRelationshipTypeBadge {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  colorClass: string;
  bgColorClass: string;
}

export const RACE_RELATIONSHIP_TYPES_BADGE_CONSTANT: IRaceRelationshipTypeBadge[] =
  [
    {
      value: "predation",
      icon: Skull,
      translationKey: "predation",
      colorClass: "text-red-600 dark:text-red-400",
      bgColorClass: "bg-red-500/10 border-red-500/30",
    },
    {
      value: "prey",
      icon: Fish,
      translationKey: "prey",
      colorClass: "text-orange-600 dark:text-orange-400",
      bgColorClass: "bg-orange-500/10 border-orange-500/30",
    },
    {
      value: "parasitism",
      icon: Sparkles,
      translationKey: "parasitism",
      colorClass: "text-purple-600 dark:text-purple-400",
      bgColorClass: "bg-purple-500/10 border-purple-500/30",
    },
    {
      value: "commensalism",
      icon: Shield,
      translationKey: "commensalism",
      colorClass: "text-blue-600 dark:text-blue-400",
      bgColorClass: "bg-blue-500/10 border-blue-500/30",
    },
    {
      value: "mutualism",
      icon: Handshake,
      translationKey: "mutualism",
      colorClass: "text-green-600 dark:text-green-400",
      bgColorClass: "bg-green-500/10 border-green-500/30",
    },
    {
      value: "competition",
      icon: Swords,
      translationKey: "competition",
      colorClass: "text-yellow-600 dark:text-yellow-400",
      bgColorClass: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      value: "neutralism",
      icon: Equal,
      translationKey: "neutralism",
      colorClass: "text-gray-600 dark:text-gray-400",
      bgColorClass: "bg-gray-500/10 border-gray-500/30",
    },
  ];
