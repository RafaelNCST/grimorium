import {
  Baby,
  Users,
  Sword,
  Heart,
  Compass,
  Flame,
  HeartHandshake,
  Sparkles,
  SmilePlus,
  BookOpen,
  Wand2,
  Crown,
  type LucideIcon,
} from "lucide-react";

export interface ICharacterArchetype {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
}

export const CHARACTER_ARCHETYPES_CONSTANT: ICharacterArchetype[] = [
  {
    value: "innocent",
    icon: Baby,
    translationKey: "archetype.innocent",
    descriptionKey: "archetype.innocent_desc",
  },
  {
    value: "orphan",
    icon: Users,
    translationKey: "archetype.orphan",
    descriptionKey: "archetype.orphan_desc",
  },
  {
    value: "hero",
    icon: Sword,
    translationKey: "archetype.hero",
    descriptionKey: "archetype.hero_desc",
  },
  {
    value: "caregiver",
    icon: Heart,
    translationKey: "archetype.caregiver",
    descriptionKey: "archetype.caregiver_desc",
  },
  {
    value: "explorer",
    icon: Compass,
    translationKey: "archetype.explorer",
    descriptionKey: "archetype.explorer_desc",
  },
  {
    value: "rebel",
    icon: Flame,
    translationKey: "archetype.rebel",
    descriptionKey: "archetype.rebel_desc",
  },
  {
    value: "lover",
    icon: HeartHandshake,
    translationKey: "archetype.lover",
    descriptionKey: "archetype.lover_desc",
  },
  {
    value: "creator",
    icon: Sparkles,
    translationKey: "archetype.creator",
    descriptionKey: "archetype.creator_desc",
  },
  {
    value: "jester",
    icon: SmilePlus,
    translationKey: "archetype.jester",
    descriptionKey: "archetype.jester_desc",
  },
  {
    value: "sage",
    icon: BookOpen,
    translationKey: "archetype.sage",
    descriptionKey: "archetype.sage_desc",
  },
  {
    value: "magician",
    icon: Wand2,
    translationKey: "archetype.magician",
    descriptionKey: "archetype.magician_desc",
  },
  {
    value: "ruler",
    icon: Crown,
    translationKey: "archetype.ruler",
    descriptionKey: "archetype.ruler_desc",
  },
];
