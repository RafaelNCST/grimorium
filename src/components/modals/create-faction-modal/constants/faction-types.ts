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
  Castle,
  Flag,
  MapPin,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { GridSelectOption } from "@/components/forms/FormSelectGrid";

/**
 * Faction type options for FormSelectGrid
 * Used in create-faction-modal for faction type selection
 */
export const FACTION_TYPE_OPTIONS: GridSelectOption[] = [
  {
    value: "commercial",
    label: "faction_type.commercial",
    description: "faction_type.commercial_desc",
    icon: Store,
    backgroundColor: "emerald-500/10",
    borderColor: "emerald-500/30",
  },
  {
    value: "military",
    label: "faction_type.military",
    description: "faction_type.military_desc",
    icon: Swords,
    backgroundColor: "red-500/10",
    borderColor: "red-500/30",
  },
  {
    value: "magical",
    label: "faction_type.magical",
    description: "faction_type.magical_desc",
    icon: Wand2,
    backgroundColor: "purple-500/10",
    borderColor: "purple-500/30",
  },
  {
    value: "religious",
    label: "faction_type.religious",
    description: "faction_type.religious_desc",
    icon: Church,
    backgroundColor: "yellow-500/10",
    borderColor: "yellow-500/30",
  },
  {
    value: "cult",
    label: "faction_type.cult",
    description: "faction_type.cult_desc",
    icon: Eye,
    backgroundColor: "indigo-500/10",
    borderColor: "indigo-500/30",
  },
  {
    value: "tribal",
    label: "faction_type.tribal",
    description: "faction_type.tribal_desc",
    icon: Users,
    backgroundColor: "orange-500/10",
    borderColor: "orange-500/30",
  },
  {
    value: "racial",
    label: "faction_type.racial",
    description: "faction_type.racial_desc",
    icon: Shield,
    backgroundColor: "cyan-500/10",
    borderColor: "cyan-500/30",
  },
  {
    value: "governmental",
    label: "faction_type.governmental",
    description: "faction_type.governmental_desc",
    icon: Building2,
    backgroundColor: "blue-500/10",
    borderColor: "blue-500/30",
  },
  {
    value: "revolutionary",
    label: "faction_type.revolutionary",
    description: "faction_type.revolutionary_desc",
    icon: Flame,
    backgroundColor: "red-700/10",
    borderColor: "red-700/30",
  },
  {
    value: "academic",
    label: "faction_type.academic",
    description: "faction_type.academic_desc",
    icon: GraduationCap,
    backgroundColor: "teal-500/10",
    borderColor: "teal-500/30",
  },
  {
    value: "royalty",
    label: "faction_type.royalty",
    description: "faction_type.royalty_desc",
    icon: Crown,
    backgroundColor: "amber-500/10",
    borderColor: "amber-500/30",
  },
  {
    value: "mercenary",
    label: "faction_type.mercenary",
    description: "faction_type.mercenary_desc",
    icon: Coins,
    backgroundColor: "slate-500/10",
    borderColor: "slate-500/30",
  },
  {
    value: "kingdom",
    label: "faction_type.kingdom",
    description: "faction_type.kingdom_desc",
    icon: Castle,
    backgroundColor: "violet-500/10",
    borderColor: "violet-500/30",
  },
  {
    value: "empire",
    label: "faction_type.empire",
    description: "faction_type.empire_desc",
    icon: Flag,
    backgroundColor: "rose-500/10",
    borderColor: "rose-500/30",
  },
  {
    value: "country",
    label: "faction_type.country",
    description: "faction_type.country_desc",
    icon: MapPin,
    backgroundColor: "sky-500/10",
    borderColor: "sky-500/30",
  },
  {
    value: "divine",
    label: "faction_type.divine",
    description: "faction_type.divine_desc",
    icon: Sparkles,
    backgroundColor: "fuchsia-500/10",
    borderColor: "fuchsia-500/30",
  },
];

/**
 * @deprecated Use FACTION_TYPE_OPTIONS instead
 * Legacy constant for backward compatibility
 */
export interface IFactionTypeConstant {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  descriptionKey: string;
  colorClass: string;
  bgColorClass: string;
}

/**
 * @deprecated Use FACTION_TYPE_OPTIONS instead
 */
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
  {
    value: "kingdom",
    icon: Castle,
    translationKey: "faction_type.kingdom",
    descriptionKey: "faction_type.kingdom_desc",
    colorClass: "text-violet-600",
    bgColorClass: "bg-violet-500/10 border-violet-500/30",
  },
  {
    value: "empire",
    icon: Flag,
    translationKey: "faction_type.empire",
    descriptionKey: "faction_type.empire_desc",
    colorClass: "text-rose-600",
    bgColorClass: "bg-rose-500/10 border-rose-500/30",
  },
  {
    value: "country",
    icon: MapPin,
    translationKey: "faction_type.country",
    descriptionKey: "faction_type.country_desc",
    colorClass: "text-sky-600",
    bgColorClass: "bg-sky-500/10 border-sky-500/30",
  },
  {
    value: "divine",
    icon: Sparkles,
    translationKey: "faction_type.divine",
    descriptionKey: "faction_type.divine_desc",
    colorClass: "text-fuchsia-600",
    bgColorClass: "bg-fuchsia-500/10 border-fuchsia-500/30",
  },
];
