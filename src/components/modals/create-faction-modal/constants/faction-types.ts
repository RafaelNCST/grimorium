import {
  Store,
  Swords,
  Wand2,
  Church,
  Eye,
  Users,
  Shield,
  Building2,
  Flame,
  GraduationCap,
  Crown,
  Coins,
  type LucideIcon,
} from "lucide-react";

export interface IFactionTypeConstant {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
  bgColorClass: string;
}

export const FACTION_TYPES_CONSTANT: IFactionTypeConstant[] = [
  {
    value: "commercial",
    icon: Store,
    translationKey: "faction_type.commercial",
    descriptionKey: "faction_type.commercial_desc",
    colorClass: "text-emerald-600",
    bgColorClass: "bg-emerald-500/10 border-emerald-500/30",
  },
  {
    value: "military",
    icon: Swords,
    translationKey: "faction_type.military",
    descriptionKey: "faction_type.military_desc",
    colorClass: "text-red-600",
    bgColorClass: "bg-red-500/10 border-red-500/30",
  },
  {
    value: "magical",
    icon: Wand2,
    translationKey: "faction_type.magical",
    descriptionKey: "faction_type.magical_desc",
    colorClass: "text-purple-600",
    bgColorClass: "bg-purple-500/10 border-purple-500/30",
  },
  {
    value: "religious",
    icon: Church,
    translationKey: "faction_type.religious",
    descriptionKey: "faction_type.religious_desc",
    colorClass: "text-yellow-600",
    bgColorClass: "bg-yellow-500/10 border-yellow-500/30",
  },
  {
    value: "cult",
    icon: Eye,
    translationKey: "faction_type.cult",
    descriptionKey: "faction_type.cult_desc",
    colorClass: "text-indigo-600",
    bgColorClass: "bg-indigo-500/10 border-indigo-500/30",
  },
  {
    value: "tribal",
    icon: Users,
    translationKey: "faction_type.tribal",
    descriptionKey: "faction_type.tribal_desc",
    colorClass: "text-orange-600",
    bgColorClass: "bg-orange-500/10 border-orange-500/30",
  },
  {
    value: "racial",
    icon: Shield,
    translationKey: "faction_type.racial",
    descriptionKey: "faction_type.racial_desc",
    colorClass: "text-cyan-600",
    bgColorClass: "bg-cyan-500/10 border-cyan-500/30",
  },
  {
    value: "governmental",
    icon: Building2,
    translationKey: "faction_type.governmental",
    descriptionKey: "faction_type.governmental_desc",
    colorClass: "text-blue-600",
    bgColorClass: "bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "revolutionary",
    icon: Flame,
    translationKey: "faction_type.revolutionary",
    descriptionKey: "faction_type.revolutionary_desc",
    colorClass: "text-rose-600",
    bgColorClass: "bg-rose-500/10 border-rose-500/30",
  },
  {
    value: "academic",
    icon: GraduationCap,
    translationKey: "faction_type.academic",
    descriptionKey: "faction_type.academic_desc",
    colorClass: "text-teal-600",
    bgColorClass: "bg-teal-500/10 border-teal-500/30",
  },
  {
    value: "royalty",
    icon: Crown,
    translationKey: "faction_type.royalty",
    descriptionKey: "faction_type.royalty_desc",
    colorClass: "text-amber-600",
    bgColorClass: "bg-amber-500/10 border-amber-500/30",
  },
  {
    value: "mercenary",
    icon: Coins,
    translationKey: "faction_type.mercenary",
    descriptionKey: "faction_type.mercenary_desc",
    colorClass: "text-slate-600",
    bgColorClass: "bg-slate-500/10 border-slate-500/30",
  },
];
