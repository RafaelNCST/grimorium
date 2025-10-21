import {
  Zap,
  Scale,
  Shield,
  Flame,
  Crown,
  RotateCcw
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type RaceMoralTendency =
  | 'chaotic'
  | 'neutral'
  | 'honorable'
  | 'extreme_chaotic'
  | 'extreme_honorable'
  | 'extreme_neutral';

export interface RaceMoralTendencyOption {
  value: RaceMoralTendency;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const RACE_MORAL_TENDENCIES: RaceMoralTendencyOption[] = [
  {
    value: 'chaotic',
    label: 'Caótico',
    description: 'Essa raça costuma ter membros caóticos que seguem seus próprios desejos',
    icon: Zap,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  {
    value: 'neutral',
    label: 'Neutro',
    description: 'Essa raça costuma ser equilibrada nas suas ações, não sendo nem bem e nem mal necessariamente',
    icon: Scale,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-950',
    borderColor: 'border-slate-200 dark:border-slate-800',
  },
  {
    value: 'honorable',
    label: 'Honrado',
    description: 'Essa raça costuma ter membros que seguem códigos de honra e princípios morais',
    icon: Shield,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    value: 'extreme_chaotic',
    label: 'Extremo Caótico',
    description: 'Essa raça só possui indivíduos caóticos que seguem seus próprios desejos',
    icon: Flame,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  {
    value: 'extreme_honorable',
    label: 'Extremo Honrado',
    description: 'Essa raça só possui indivíduos que seguem rigidamente códigos de honra',
    icon: Crown,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  {
    value: 'extreme_neutral',
    label: 'Extremo Neutro',
    description: 'Essa raça possui indivíduos com morais extremamente opostas, variando entre caóticos absolutos e honrados inflexíveis',
    icon: RotateCcw,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
];
