import {
  MessageSquare,
  Brain,
  Waves,
  Hand,
  HelpCircle
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type RaceCommunication =
  | 'speech'
  | 'telepathy'
  | 'pheromones'
  | 'gestures'
  | 'other';

export interface RaceCommunicationOption {
  value: RaceCommunication;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresDescription?: boolean;
}

export const RACE_COMMUNICATIONS: RaceCommunicationOption[] = [
  {
    value: 'speech',
    label: 'Fala',
    description: 'Comunicação verbal',
    icon: MessageSquare,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    value: 'telepathy',
    label: 'Telepatia',
    description: 'Comunicação mental',
    icon: Brain,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    value: 'pheromones',
    label: 'Feromônios',
    description: 'Comunicação química',
    icon: Waves,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  {
    value: 'gestures',
    label: 'Gestos',
    description: 'Comunicação corporal',
    icon: Hand,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  {
    value: 'other',
    label: 'Outro',
    description: 'Forma de comunicação personalizada',
    icon: HelpCircle,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950',
    borderColor: 'border-violet-200 dark:border-violet-800',
    requiresDescription: true,
  },
];
