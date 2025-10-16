import {
  Sword,
  Shield,
  Sparkles,
  Gem,
  Apple,
  Box,
  Crown,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface IItemCategory {
  value: string;
  translationKey: string;
  icon: LucideIcon;
}

export const ITEM_CATEGORIES_CONSTANT: IItemCategory[] = [
  {
    value: "weapon",
    translationKey: "category.weapon",
    icon: Sword,
  },
  {
    value: "armor",
    translationKey: "category.armor",
    icon: Shield,
  },
  {
    value: "accessory",
    translationKey: "category.accessory",
    icon: Sparkles,
  },
  {
    value: "relic",
    translationKey: "category.relic",
    icon: Gem,
  },
  {
    value: "consumable",
    translationKey: "category.consumable",
    icon: Apple,
  },
  {
    value: "resource",
    translationKey: "category.resource",
    icon: Box,
  },
  {
    value: "artifact",
    translationKey: "category.artifact",
    icon: Crown,
  },
  {
    value: "other",
    translationKey: "category.other",
    icon: HelpCircle,
  },
];
