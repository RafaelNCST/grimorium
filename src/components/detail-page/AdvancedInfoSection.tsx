import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export interface AdvancedInfoSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * AdvancedInfoSection - Collapsible container for advanced information
 *
 * @example
 * ```tsx
 * <AdvancedInfoSection
 *   title="Informações Avançadas"
 *   isOpen={advancedSectionOpen}
 *   onToggle={() => toggleSection('advanced')}
 * >
 *   <FormInput ... />
 *   <FormTextarea ... />
 * </AdvancedInfoSection>
 * ```
 */
export function AdvancedInfoSection({
  title,
  isOpen,
  onToggle,
  children,
  className,
  contentClassName,
}: AdvancedInfoSectionProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className={cn('border-b border-border bg-card', className)}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left hover:bg-accent/50 transition-colors">
        <h2 className="text-xl font-semibold">{title}</h2>
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-6 px-6">
        <div className={cn('space-y-4 pt-2', contentClassName)}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
