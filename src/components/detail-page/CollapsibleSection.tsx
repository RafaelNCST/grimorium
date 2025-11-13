import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
}

/**
 * CollapsibleSection - Generic collapsible section (for timeline, map, etc)
 *
 * @example
 * ```tsx
 * <CollapsibleSection
 *   title="Timeline"
 *   icon={<Clock className="h-5 w-5" />}
 *   isOpen={timelineSectionOpen}
 *   onToggle={() => toggleSection('timeline')}
 * >
 *   <RegionTimeline ... />
 * </CollapsibleSection>
 * ```
 */
export function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  className,
  contentClassName,
  headerClassName,
}: CollapsibleSectionProps) {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className={cn('border-b border-border bg-card', className)}
    >
      <CollapsibleTrigger
        className={cn(
          'flex w-full items-center justify-between p-6 text-left hover:bg-accent/50 transition-colors',
          headerClassName
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-6 px-6">
        <div className={cn('pt-2', contentClassName)}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
