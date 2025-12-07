import {
  type LucideIcon,
  Sparkles,
  Shield,
  Handshake,
  Swords,
  Equal,
  Skull,
  Fish,
} from "lucide-react";
import { TFunction } from "i18next";

export interface RaceRelationshipTypeConfig {
  value: string;
  translationKey: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export const getRaceRelationshipTypes = (
  t: TFunction
): RaceRelationshipTypeConfig[] => [
  {
    value: "predation",
    translationKey: "predation",
    icon: Skull,
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    description: t("races:relationships.predation.description"),
  },
  {
    value: "prey",
    translationKey: "prey",
    icon: Fish,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    description: t("races:relationships.prey.description"),
  },
  {
    value: "parasitism",
    translationKey: "parasitism",
    icon: Sparkles,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    description: t("races:relationships.parasitism.description"),
  },
  {
    value: "commensalism",
    translationKey: "commensalism",
    icon: Shield,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: t("races:relationships.commensalism.description"),
  },
  {
    value: "mutualism",
    translationKey: "mutualism",
    icon: Handshake,
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    description: t("races:relationships.mutualism.description"),
  },
  {
    value: "competition",
    translationKey: "competition",
    icon: Swords,
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    description: t("races:relationships.competition.description"),
  },
  {
    value: "neutralism",
    translationKey: "neutralism",
    icon: Equal,
    color: "bg-gray-500/20 text-gray-700 border-gray-500/40",
    description: t("races:relationships.neutralism.description"),
  },
];
