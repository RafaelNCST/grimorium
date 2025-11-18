import {
  Heart,
  Skull,
  Lock,
  HelpCircle,
  Moon,
  type LucideIcon,
} from "lucide-react";

import { type IEntityTagConfig } from "@/components/ui/entity-tag-badge";

export const CHARACTER_STATUS_CONSTANT: IEntityTagConfig[] = [
  {
    value: "alive",
    icon: Heart,
    translationKey: "status.alive",
    colorClass: "text-green-600 dark:text-green-400",
    bgColorClass: "bg-green-500/10 border-green-500/30",
  },
  {
    value: "unconscious",
    icon: Moon,
    translationKey: "status.unconscious",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "dead",
    icon: Skull,
    translationKey: "status.dead",
    colorClass: "text-red-600 dark:text-red-400",
    bgColorClass: "bg-red-500/10 border-red-500/30",
  },
  {
    value: "sealed",
    icon: Lock,
    translationKey: "status.sealed",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "missing",
    icon: HelpCircle,
    translationKey: "status.missing",
    colorClass: "text-orange-600 dark:text-orange-400",
    bgColorClass: "bg-orange-500/10 border-orange-500/30",
  },
];
