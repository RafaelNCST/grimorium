import {
  Heart,
  Copy,
  Merge,
  Split,
  Baby,
  HelpCircle
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type RaceReproductiveCycle =
  | 'sexual'
  | 'asexual'
  | 'hermaphrodite'
  | 'parthenogenic'
  | 'viviparous'
  | 'other';

export interface RaceReproductiveCycleOption {
  value: RaceReproductiveCycle;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresDescription?: boolean;
}

export const RACE_REPRODUCTIVE_CYCLES: RaceReproductiveCycleOption[] = [
  {
    value: 'sexual',
    label: 'Sexuado',
    description: 'Reprodução que requer dois indivíduos de sexos diferentes para gerar descendentes',
    icon: Heart,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    borderColor: 'border-pink-200 dark:border-pink-800',
  },
  {
    value: 'asexual',
    label: 'Assexuado',
    description: 'Reprodução por divisão celular ou brotamento, sem necessidade de parceiro',
    icon: Copy,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  {
    value: 'hermaphrodite',
    label: 'Hermafrodita',
    description: 'Indivíduos possuem órgãos reprodutores de ambos os sexos, podendo se autofecundar ou cruzar',
    icon: Merge,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    value: 'parthenogenic',
    label: 'Partenogênico',
    description: 'Desenvolvimento de um embrião sem fecundação por um macho, gerando clones genéticos',
    icon: Split,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  {
    value: 'viviparous',
    label: 'Vivíparo',
    description: 'Filhotes se desenvolvem dentro do corpo do progenitor e nascem completamente formados',
    icon: Baby,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    value: 'other',
    label: 'Outro',
    description: 'Ciclo reprodutivo personalizado ou único desta raça',
    icon: HelpCircle,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950',
    borderColor: 'border-violet-200 dark:border-violet-800',
    requiresDescription: true,
  },
];
