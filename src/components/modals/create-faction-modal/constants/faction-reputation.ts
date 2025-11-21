import {
  HelpCircle,
  ThumbsDown,
  AlertTriangle,
  Meh,
  ThumbsUp,
  Heart,
  type LucideIcon,
} from "lucide-react";

import type { GridSelectOption } from "@/components/forms/FormSelectGrid";

/**
 * Faction reputation options for FormSelectGrid
 * Used in create-faction-modal for public reputation selection
 */
export const FACTION_REPUTATION_OPTIONS: GridSelectOption[] = [
  {
    value: "unknown",
    label: "reputation.unknown",
    description: "reputation.unknown_desc",
    icon: HelpCircle,
    backgroundColor: "gray-500/10",
    borderColor: "gray-500/30",
  },
  {
    value: "hated",
    label: "reputation.hated",
    description: "reputation.hated_desc",
    icon: ThumbsDown,
    backgroundColor: "red-500/10",
    borderColor: "red-500/30",
  },
  {
    value: "feared",
    label: "reputation.feared",
    description: "reputation.feared_desc",
    icon: AlertTriangle,
    backgroundColor: "orange-500/10",
    borderColor: "orange-500/30",
  },
  {
    value: "tolerated",
    label: "reputation.tolerated",
    description: "reputation.tolerated_desc",
    icon: Meh,
    backgroundColor: "yellow-500/10",
    borderColor: "yellow-500/30",
  },
  {
    value: "respected",
    label: "reputation.respected",
    description: "reputation.respected_desc",
    icon: ThumbsUp,
    backgroundColor: "blue-500/10",
    borderColor: "blue-500/30",
  },
  {
    value: "adored",
    label: "reputation.adored",
    description: "reputation.adored_desc",
    icon: Heart,
    backgroundColor: "pink-500/10",
    borderColor: "pink-500/30",
  },
];

/**
 * @deprecated Use FACTION_REPUTATION_OPTIONS instead
 * Legacy constant for backward compatibility
 */
export interface IFactionReputationConstant {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
  bgColorClass: string;
}

/**
 * @deprecated Use FACTION_REPUTATION_OPTIONS instead
 */
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
