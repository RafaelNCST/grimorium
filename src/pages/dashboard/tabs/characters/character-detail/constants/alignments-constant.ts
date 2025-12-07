import { Shield, Target, Sword, type LucideIcon } from "lucide-react";

export interface IAlignment {
  value: string;
  translationKey: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const ALIGNMENTS_CONSTANT: IAlignment[] = [
  {
    value: "bem",
    translationKey: "alignments.good",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-500/10 border-green-500/20",
  },
  {
    value: "neutro",
    translationKey: "alignments.neutral",
    icon: Target,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    value: "caotico",
    translationKey: "alignments.chaotic",
    icon: Sword,
    color: "text-red-600",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
];
