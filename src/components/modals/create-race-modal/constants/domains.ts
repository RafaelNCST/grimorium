import {
  Waves,
  Mountain,
  Cloud,
  ArrowDown,
  TrendingUp,
  Sparkles,
  Ghost,
  Orbit
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type RaceDomain =
  | 'aquatic'
  | 'terrestrial'
  | 'aerial'
  | 'underground'
  | 'elevated'
  | 'dimensional'
  | 'spiritual'
  | 'cosmic';

export interface RaceDomainOption {
  value: RaceDomain;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const RACE_DOMAINS: RaceDomainOption[] = [
  {
    value: 'aquatic',
    label: 'Aquático',
    icon: Waves,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    value: 'terrestrial',
    label: 'Terrestre',
    icon: Mountain,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  {
    value: 'aerial',
    label: 'Aéreo',
    icon: Cloud,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
  },
  {
    value: 'underground',
    label: 'Subterrâneo',
    icon: ArrowDown,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  {
    value: 'elevated',
    label: 'Elevado',
    icon: TrendingUp,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  {
    value: 'dimensional',
    label: 'Dimensional',
    icon: Sparkles,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    value: 'spiritual',
    label: 'Espiritual',
    icon: Ghost,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950',
    borderColor: 'border-violet-200 dark:border-violet-800',
  },
  {
    value: 'cosmic',
    label: 'Cósmico',
    icon: Orbit,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
];

// Helper interface for display
export interface DomainDisplayOption {
  value: string;
  label: string;
  icon: LucideIcon;
  baseColor: string;
  activeColor: string;
  hoverColor: string;
}

// Export for cards and badges (uses label as value for matching with domain array)
export const DOMAIN_CONSTANT: DomainDisplayOption[] = RACE_DOMAINS.map((domain) => ({
  value: domain.label,  // Use label as value to match with DomainType
  label: domain.label,
  icon: domain.icon,
  baseColor: domain.bgColor.replace('dark:bg-', '').split(' ')[0],
  activeColor: `${domain.color} ${domain.bgColor} border ${domain.borderColor}`,
  hoverColor: `hover:${domain.color} hover:${domain.bgColor}`,
}));
