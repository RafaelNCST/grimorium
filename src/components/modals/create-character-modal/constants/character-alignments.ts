import {
  Heart,
  Scale,
  Skull,
  Shield,
  CircleDot,
  Swords,
  Sparkles,
  Zap,
  Flame,
  type LucideIcon,
} from "lucide-react";

export interface ICharacterAlignment {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
}

export const CHARACTER_ALIGNMENTS_CONSTANT: ICharacterAlignment[] = [
  {
    value: "lawful-good",
    icon: Shield,
    translationKey: "alignment.lawful_good",
    descriptionKey: "alignment.lawful_good_desc",
    colorClass:
      "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400",
  },
  {
    value: "neutral-good",
    icon: Heart,
    translationKey: "alignment.neutral_good",
    descriptionKey: "alignment.neutral_good_desc",
    colorClass:
      "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400",
  },
  {
    value: "chaotic-good",
    icon: Sparkles,
    translationKey: "alignment.chaotic_good",
    descriptionKey: "alignment.chaotic_good_desc",
    colorClass:
      "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400",
  },
  {
    value: "lawful-neutral",
    icon: Scale,
    translationKey: "alignment.lawful_neutral",
    descriptionKey: "alignment.lawful_neutral_desc",
    colorClass:
      "bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-400",
  },
  {
    value: "true-neutral",
    icon: CircleDot,
    translationKey: "alignment.true_neutral",
    descriptionKey: "alignment.true_neutral_desc",
    colorClass:
      "bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-400",
  },
  {
    value: "chaotic-neutral",
    icon: Zap,
    translationKey: "alignment.chaotic_neutral",
    descriptionKey: "alignment.chaotic_neutral_desc",
    colorClass:
      "bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-400",
  },
  {
    value: "lawful-evil",
    icon: Swords,
    translationKey: "alignment.lawful_evil",
    descriptionKey: "alignment.lawful_evil_desc",
    colorClass: "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400",
  },
  {
    value: "neutral-evil",
    icon: Skull,
    translationKey: "alignment.neutral_evil",
    descriptionKey: "alignment.neutral_evil_desc",
    colorClass: "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400",
  },
  {
    value: "chaotic-evil",
    icon: Flame,
    translationKey: "alignment.chaotic_evil",
    descriptionKey: "alignment.chaotic_evil_desc",
    colorClass: "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400",
  },
];
