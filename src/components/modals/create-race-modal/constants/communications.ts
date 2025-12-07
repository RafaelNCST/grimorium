import {
  MessageSquare,
  Brain,
  Waves,
  Hand,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import { TFunction } from "i18next";

export type RaceCommunication =
  | "speech"
  | "telepathy"
  | "pheromones"
  | "gestures"
  | "other";

export interface RaceCommunicationOption {
  value: RaceCommunication;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresDescription?: boolean;
}

export const getRaceCommunications = (
  t: TFunction
): RaceCommunicationOption[] => [
  {
    value: "speech",
    label: t("races:communications.speech.label"),
    description: t("races:communications.speech.description"),
    icon: MessageSquare,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    value: "telepathy",
    label: t("races:communications.telepathy.label"),
    description: t("races:communications.telepathy.description"),
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    value: "pheromones",
    label: t("races:communications.pheromones.label"),
    description: t("races:communications.pheromones.description"),
    icon: Waves,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    value: "gestures",
    label: t("races:communications.gestures.label"),
    description: t("races:communications.gestures.description"),
    icon: Hand,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    value: "other",
    label: t("races:communications.other.label"),
    description: t("races:communications.other.description"),
    icon: HelpCircle,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950",
    borderColor: "border-violet-200 dark:border-violet-800",
    requiresDescription: true,
  },
];
