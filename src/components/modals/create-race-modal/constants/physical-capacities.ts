import {
  BanIcon,
  TrendingDown,
  Equal,
  TrendingUp,
  Sword,
  LucideIcon,
} from "lucide-react";

export type RacePhysicalCapacity =
  | "powerless"
  | "weaker"
  | "comparable"
  | "stronger"
  | "invincible";

export interface RacePhysicalCapacityOption {
  value: RacePhysicalCapacity;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const RACE_PHYSICAL_CAPACITIES: RacePhysicalCapacityOption[] = [
  {
    value: "powerless",
    label: "Impotente",
    description:
      "Um membro médio seria facilmente derrotado por um humano comum",
    icon: BanIcon,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    value: "weaker",
    label: "Mais fraco",
    description: "Um membro médio é mais fraco que um humano comum",
    icon: TrendingDown,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    value: "comparable",
    label: "Comparável",
    description: "Um membro médio tem força similar a um humano comum",
    icon: Equal,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "stronger",
    label: "Mais forte",
    description: "Um membro médio é mais forte que um humano comum",
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    value: "invincible",
    label: "Invencível",
    description: "Um membro médio poderia facilmente eliminar um humano comum",
    icon: Sword,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
];
