import { Users, Crown, Sword, UserCheck, type LucideIcon } from "lucide-react";

export interface IRole {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const ROLES_CONSTANT: IRole[] = [
  {
    value: "protagonista",
    label: "Protagonista",
    icon: Crown,
    color: "bg-accent text-accent-foreground",
  },
  {
    value: "co-protagonista",
    label: "Co-protagonista",
    icon: UserCheck,
    color: "bg-accent/80 text-accent-foreground",
  },
  {
    value: "antagonista",
    label: "Antagonista",
    icon: Sword,
    color: "bg-destructive text-destructive-foreground",
  },
  {
    value: "vilao",
    label: "Vilão",
    icon: Sword,
    color: "bg-destructive text-destructive-foreground",
  },
  {
    value: "secundario",
    label: "Secundário",
    icon: Users,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    value: "figurante",
    label: "Figurante",
    icon: Users,
    color: "bg-muted text-muted-foreground",
  },
];
