import { User, UserRound, Users, Sparkles, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface IGender {
  value: string;
  translationKey: string;
  icon: LucideIcon;
}

export const GENDERS_CONSTANT: IGender[] = [
  {
    value: "male",
    translationKey: "gender.male",
    icon: User,
  },
  {
    value: "female",
    translationKey: "gender.female",
    icon: UserRound,
  },
  {
    value: "non-binary",
    translationKey: "gender.non_binary",
    icon: Users,
  },
  {
    value: "other",
    translationKey: "gender.other",
    icon: Sparkles,
  },
  {
    value: "prefer-not-say",
    translationKey: "gender.prefer_not_say",
    icon: HelpCircle,
  },
];
