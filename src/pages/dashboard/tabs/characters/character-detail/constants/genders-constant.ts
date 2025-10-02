import {
  User,
  UserCheck,
  Users2,
  Ban,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface IGender {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const GENDERS_CONSTANT: IGender[] = [
  { value: "masculino", label: "Masculino", icon: User },
  { value: "feminino", label: "Feminino", icon: Users2 },
  { value: "transgenero", label: "Transgênero", icon: UserCheck },
  { value: "assexuado", label: "Assexuado", icon: Ban },
  { value: "outro", label: "Outro", icon: HelpCircle },
];
