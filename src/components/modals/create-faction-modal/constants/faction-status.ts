import {
  Activity,
  TrendingDown,
  XCircle,
  RefreshCw,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface IFactionStatusConstant {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
  bgColorClass: string;
}

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
