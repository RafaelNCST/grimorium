import { Users, Crown, Sword, UserCheck, type LucideIcon } from "lucide-react";

export interface IRole {
  value: string;
  translationKey: string;
  icon: LucideIcon;
  color: string;
}

export const ROLES_CONSTANT: IRole[] = [
  {
    value: "protagonista",
    translationKey: "roles.protagonist",
    icon: Crown,
    color: "bg-accent text-accent-foreground",
  },
  {
    value: "co-protagonista",
    translationKey: "roles.co_protagonist",
    icon: UserCheck,
    color: "bg-accent/80 text-accent-foreground",
  },
  {
    value: "antagonista",
    translationKey: "roles.antagonist",
    icon: Sword,
    color: "bg-destructive text-destructive-foreground",
  },
  {
    value: "vilao",
    translationKey: "roles.villain",
    icon: Sword,
    color: "bg-destructive text-destructive-foreground",
  },
  {
    value: "secundario",
    translationKey: "roles.secondary",
    icon: Users,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    value: "figurante",
    translationKey: "roles.extra",
    icon: Users,
    color: "bg-muted text-muted-foreground",
  },
];
