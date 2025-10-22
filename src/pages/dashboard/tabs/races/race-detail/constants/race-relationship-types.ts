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

export interface RaceRelationshipTypeConfig {
  value: string;
  translationKey: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export const RACE_RELATIONSHIP_TYPES: RaceRelationshipTypeConfig[] = [
  {
    value: "predation",
    translationKey: "predation",
    icon: Skull,
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    description: "Esta raça caça a outra",
  },
  {
    value: "prey",
    translationKey: "prey",
    icon: Fish,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    description: "Esta raça é presa da outra",
  },
  {
    value: "parasitism",
    translationKey: "parasitism",
    icon: Sparkles,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    description: "Esta raça se beneficia prejudicando a outra",
  },
  {
    value: "commensalism",
    translationKey: "commensalism",
    icon: Shield,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Esta raça se beneficia sem afetar a outra",
  },
  {
    value: "mutualism",
    translationKey: "mutualism",
    icon: Handshake,
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    description: "Ambas as raças se beneficiam",
  },
  {
    value: "competition",
    translationKey: "competition",
    icon: Swords,
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    description: "Ambas as raças competem por recursos",
  },
  {
    value: "neutralism",
    translationKey: "neutralism",
    icon: Equal,
    color: "bg-gray-500/20 text-gray-700 border-gray-500/40",
    description: "Nenhuma raça afeta a outra",
  },
];
