import {
  Users,
  Swords,
  GraduationCap,
  BookOpen,
  Skull,
  Heart,
  Shield,
  Sparkles,
  Crown,
  UserMinus,
  Home,
  HeartHandshake,
  UserCheck,
  Flame,
  Minus,
  Sparkle,
  type LucideIcon,
} from "lucide-react";

export interface IRelationshipTypeBadge {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  colorClass: string;
  bgColorClass: string;
}

export const RELATIONSHIP_TYPES_BADGE_CONSTANT: IRelationshipTypeBadge[] = [
  {
    value: "friend",
    icon: Users,
    translationKey: "friend",
    colorClass: "text-green-600 dark:text-green-400",
    bgColorClass: "bg-green-500/10 border-green-500/30",
  },
  {
    value: "rival",
    icon: Swords,
    translationKey: "rival",
    colorClass: "text-orange-600 dark:text-orange-400",
    bgColorClass: "bg-orange-500/10 border-orange-500/30",
  },
  {
    value: "mentor",
    icon: GraduationCap,
    translationKey: "mentor",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgColorClass: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "apprentice",
    icon: BookOpen,
    translationKey: "apprentice",
    colorClass: "text-cyan-600 dark:text-cyan-400",
    bgColorClass: "bg-cyan-500/10 border-cyan-500/30",
  },
  {
    value: "enemy",
    icon: Skull,
    translationKey: "enemy",
    colorClass: "text-red-600 dark:text-red-400",
    bgColorClass: "bg-red-500/10 border-red-500/30",
  },
  {
    value: "love_interest",
    icon: Heart,
    translationKey: "love_interest",
    colorClass: "text-pink-600 dark:text-pink-400",
    bgColorClass: "bg-pink-500/10 border-pink-500/30",
  },
  {
    value: "ally",
    icon: Shield,
    translationKey: "ally",
    colorClass: "text-indigo-600 dark:text-indigo-400",
    bgColorClass: "bg-indigo-500/10 border-indigo-500/30",
  },
  {
    value: "acquaintance",
    icon: Sparkles,
    translationKey: "acquaintance",
    colorClass: "text-gray-600 dark:text-gray-400",
    bgColorClass: "bg-gray-500/10 border-gray-500/30",
  },
  {
    value: "leader",
    icon: Crown,
    translationKey: "leader",
    colorClass: "text-purple-600 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "subordinate",
    icon: UserMinus,
    translationKey: "subordinate",
    colorClass: "text-slate-600 dark:text-slate-400",
    bgColorClass: "bg-slate-500/10 border-slate-500/30",
  },
  {
    value: "family_love",
    icon: Home,
    translationKey: "family_love",
    colorClass: "text-pink-500 dark:text-pink-400",
    bgColorClass: "bg-pink-400/10 border-pink-400/30",
  },
  {
    value: "romantic_relationship",
    icon: HeartHandshake,
    translationKey: "romantic_relationship",
    colorClass: "text-fuchsia-600 dark:text-fuchsia-400",
    bgColorClass: "bg-fuchsia-500/10 border-fuchsia-500/30",
  },
  {
    value: "best_friend",
    icon: UserCheck,
    translationKey: "best_friend",
    colorClass: "text-teal-600 dark:text-teal-400",
    bgColorClass: "bg-teal-500/10 border-teal-500/30",
  },
  {
    value: "hatred",
    icon: Flame,
    translationKey: "hatred",
    colorClass: "text-red-700 dark:text-red-600",
    bgColorClass: "bg-red-700/10 border-red-700/30",
  },
  {
    value: "neutral",
    icon: Minus,
    translationKey: "neutral",
    colorClass: "text-gray-500 dark:text-gray-400",
    bgColorClass: "bg-gray-400/10 border-gray-400/30",
  },
  {
    value: "devotion",
    icon: Sparkle,
    translationKey: "devotion",
    colorClass: "text-violet-600 dark:text-violet-400",
    bgColorClass: "bg-violet-500/10 border-violet-500/30",
  },
];
