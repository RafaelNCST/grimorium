import {
  Crown,
  Skull,
  Swords,
  Users,
  User,
  type LucideIcon,
} from "lucide-react";

export interface ICharacterRole {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  colorClass: string;
  bgColorClass: string;
}

export const CHARACTER_ROLES_CONSTANT: ICharacterRole[] = [
  {
    value: "protagonist",
    icon: Crown,
    translationKey: "role.protagonist",
    colorClass: "text-yellow-600 dark:text-yellow-400",
    bgColorClass: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20",
  },
  {
    value: "antagonist",
    icon: Swords,
    translationKey: "role.antagonist",
    colorClass: "text-orange-600 dark:text-orange-400",
    bgColorClass: "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20",
  },
  {
    value: "villain",
    icon: Skull,
    translationKey: "role.villain",
    colorClass: "text-red-600 dark:text-red-400",
    bgColorClass: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20",
  },
  {
    value: "secondary",
    icon: Users,
    translationKey: "role.secondary",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20",
  },
  {
    value: "extra",
    icon: User,
    translationKey: "role.extra",
    colorClass: "text-gray-600 dark:text-gray-400",
    bgColorClass: "bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20",
  },
];
