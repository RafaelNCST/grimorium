import { Shield, Target, Sword, type LucideIcon } from "lucide-react";

export interface IAlignment {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const ALIGNMENTS_CONSTANT: IAlignment[] = [
  {
    value: "bem",
    label: "Bem",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-500/10 border-green-500/20",
  },
  {
    value: "neutro",
    label: "Neutro",
    icon: Target,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    value: "caotico",
    label: "Caótico",
    icon: Sword,
    color: "text-red-600",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
];
