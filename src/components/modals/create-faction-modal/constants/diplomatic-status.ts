import {
  Handshake,
  ShieldCheck,
  Swords,
  HandMetal,
  Flame,
  Minus,
  type LucideIcon,
} from "lucide-react";

export interface IDiplomaticStatusConstant {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
}

export const DIPLOMATIC_STATUS_CONSTANT: IDiplomaticStatusConstant[] = [
  {
    value: "alliance",
    icon: Handshake,
    translationKey: "diplomatic_status.alliance",
    descriptionKey: "diplomatic_status.alliance_desc",
    colorClass: "text-green-600",
    bgColorClass: "bg-green-500/10",
    borderColorClass: "border-green-500/30",
  },
  {
    value: "subordinate",
    icon: ShieldCheck,
    translationKey: "diplomatic_status.subordinate",
    descriptionKey: "diplomatic_status.subordinate_desc",
    colorClass: "text-blue-600",
    bgColorClass: "bg-blue-500/10",
    borderColorClass: "border-blue-500/30",
  },
  {
    value: "war",
    icon: Swords,
    translationKey: "diplomatic_status.war",
    descriptionKey: "diplomatic_status.war_desc",
    colorClass: "text-red-600",
    bgColorClass: "bg-red-500/10",
    borderColorClass: "border-red-500/30",
  },
  {
    value: "peace",
    icon: HandMetal,
    translationKey: "diplomatic_status.peace",
    descriptionKey: "diplomatic_status.peace_desc",
    colorClass: "text-cyan-600",
    bgColorClass: "bg-cyan-500/10",
    borderColorClass: "border-cyan-500/30",
  },
  {
    value: "hatred",
    icon: Flame,
    translationKey: "diplomatic_status.hatred",
    descriptionKey: "diplomatic_status.hatred_desc",
    colorClass: "text-orange-600",
    bgColorClass: "bg-orange-500/10",
    borderColorClass: "border-orange-500/30",
  },
  {
    value: "neutral",
    icon: Minus,
    translationKey: "diplomatic_status.neutral",
    descriptionKey: "diplomatic_status.neutral_desc",
    colorClass: "text-gray-600",
    bgColorClass: "bg-gray-500/10",
    borderColorClass: "border-gray-500/30",
  },
];
