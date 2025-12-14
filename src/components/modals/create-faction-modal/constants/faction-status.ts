import {
  Activity,
  TrendingDown,
  XCircle,
  RefreshCw,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/**
 * Faction status options base data
 * Converted to FormSimpleGrid format in create-faction-modal
 */
export interface FactionStatusOption {
  value: string;
  translationKey: string;
  icon: LucideIcon;
  color: string;
  activeColor: string;
}

export const FACTION_STATUS_OPTIONS: FactionStatusOption[] = [
  {
    value: "active",
    translationKey: "status.active",
    icon: Activity,
    color: "text-muted-foreground",
    activeColor: "text-green-600 dark:text-green-400",
  },
  {
    value: "weakened",
    translationKey: "status.weakened",
    icon: TrendingDown,
    color: "text-muted-foreground",
    activeColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    value: "dissolved",
    translationKey: "status.dissolved",
    icon: XCircle,
    color: "text-muted-foreground",
    activeColor: "text-red-600 dark:text-red-400",
  },
  {
    value: "reformed",
    translationKey: "status.reformed",
    icon: RefreshCw,
    color: "text-muted-foreground",
    activeColor: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "apex",
    translationKey: "status.apex",
    icon: TrendingUp,
    color: "text-muted-foreground",
    activeColor: "text-purple-600 dark:text-purple-400",
  },
];

/**
 * @deprecated Use FACTION_STATUS_OPTIONS instead
 * Legacy constant for backward compatibility
 */
export interface IFactionStatusConstant {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
  bgColorClass: string;
}

/**
 * @deprecated Use FACTION_STATUS_OPTIONS instead
 */
export const FACTION_STATUS_CONSTANT: IFactionStatusConstant[] = [
  {
    value: "active",
    icon: Activity,
    translationKey: "status.active",
    descriptionKey: "status.active_desc",
    colorClass: "text-green-600",
    bgColorClass: "bg-green-500/10 border-green-500/30",
  },
  {
    value: "weakened",
    icon: TrendingDown,
    translationKey: "status.weakened",
    descriptionKey: "status.weakened_desc",
    colorClass: "text-yellow-600",
    bgColorClass: "bg-yellow-500/10 border-yellow-500/30",
  },
  {
    value: "dissolved",
    icon: XCircle,
    translationKey: "status.dissolved",
    descriptionKey: "status.dissolved_desc",
    colorClass: "text-red-600",
    bgColorClass: "bg-red-500/10 border-red-500/30",
  },
  {
    value: "reformed",
    icon: RefreshCw,
    translationKey: "status.reformed",
    descriptionKey: "status.reformed_desc",
    colorClass: "text-blue-600",
    bgColorClass: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "apex",
    icon: TrendingUp,
    translationKey: "status.apex",
    descriptionKey: "status.apex_desc",
    colorClass: "text-purple-600",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
];
