import * as React from 'react';
import { ChevronDown, X } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CollapsibleEntityListProps<T> {
  title: string;
  entities: T[];
  isOpen: boolean;
  onToggle: () => void;
  renderCard: (entity: T, index: number) => React.ReactNode;
  emptyText: string;
  isEditing?: boolean;
  onRemove?: (entity: T, index: number) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

/**
 * CollapsibleEntityList - Collapsible list of entities with customizable cards
 *
 * @example
 * ```tsx
 * <CollapsibleEntityList
 *   title="Facções Residentes"
 *   entities={residentFactions}
 *   isOpen={openSections.residentFactions}
 *   onToggle={() => toggleSection('residentFactions')}
 *   renderCard={(faction) => <FactionCard faction={faction} />}
 *   emptyText="Nenhuma facção residente"
 *   isEditing={isEditing}
 *   onRemove={handleRemoveFaction}
 * />
 * ```
 */
export function CollapsibleEntityList<T>({
  title,
  entities,
  isOpen,
  onToggle,
  renderCard,
  emptyText,
  isEditing = false,
  onRemove,
  className,
  headerClassName,
  contentClassName,
}: CollapsibleEntityListProps<T>) {
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
        <h3 className="text-lg font-semibold">
          {title}{' '}
          <span className="text-sm text-muted-foreground">
            ({entities.length})
          </span>
        </h3>
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-6 px-6">
        <div className={cn('pt-2 space-y-3', contentClassName)}>
          {entities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            entities.map((entity, index) => (
              <div
                key={index}
                className="relative group"
              >
                {renderCard(entity, index)}
                {isEditing && onRemove && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemove(entity, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
