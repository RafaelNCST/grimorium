import * as React from 'react';
import { Check, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useParams } from '@tanstack/react-router';

// Service imports
import { getCharactersByBookId } from '@/lib/db/characters.service';
import { getFactionsByBookId } from '@/lib/db/factions.service';
import { getRacesByBookId } from '@/lib/db/races.service';
import { getItemsByBookId } from '@/lib/db/items.service';
import { getRegionsByBookId } from '@/lib/db/regions.service';

export type EntityType = 'character' | 'faction' | 'race' | 'item' | 'region';

export interface Entity {
  id: string;
  name: string;
  image?: string;
}

export interface EntityMultiSelectProps {
  entity: EntityType;
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
  showOptionalLabel?: boolean;
  maxItems?: number;
  filter?: (entity: Entity) => boolean;
}

const ENTITY_SERVICE_MAP = {
  character: getCharactersByBookId,
  faction: getFactionsByBookId,
  race: getRacesByBookId,
  item: getItemsByBookId,
  region: getRegionsByBookId,
};

/**
 * EntityMultiSelect - Multi-select for entities with badges
 *
 * @example
 * ```tsx
 * <EntityMultiSelect
 *   entity="faction"
 *   value={residentFactions}
 *   onChange={setResidentFactions}
 *   label="Facções Residentes"
 *   placeholder="Selecione facções"
 * />
 * ```
 */
export const EntityMultiSelect = React.forwardRef<
  HTMLButtonElement,
  EntityMultiSelectProps
>(
  (
    {
      entity,
      value = [],
      onChange,
      label,
      placeholder = 'Selecione itens...',
      searchPlaceholder = 'Buscar...',
      emptyText = 'Nenhum item encontrado',
      error,
      helperText,
      containerClassName,
      required,
      disabled,
      showOptionalLabel = true,
      maxItems,
      filter,
    },
    ref
  ) => {
    const { dashboardId } = useParams({ strict: false }) as {
      dashboardId?: string;
    };
    const [entities, setEntities] = React.useState<Entity[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const hasError = Boolean(error);
    const selectedCount = value.length;
    const hasReachedMax = maxItems !== undefined && selectedCount >= maxItems;

    // Load entities
    React.useEffect(() => {
      const loadEntities = async () => {
        if (!dashboardId) return;

        try {
          setIsLoading(true);
          const service = ENTITY_SERVICE_MAP[entity];
          const data = await service(dashboardId);

          // Map to Entity interface
          const mappedEntities: Entity[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            image: item.image,
          }));

          // Apply filter if provided
          const filteredEntities = filter
            ? mappedEntities.filter(filter)
            : mappedEntities;

          setEntities(filteredEntities);
        } catch (error) {
          console.error(`Error loading ${entity} entities:`, error);
          setEntities([]);
        } finally {
          setIsLoading(false);
        }
      };

      loadEntities();
    }, [dashboardId, entity, filter]);

    const handleSelect = (entityId: string) => {
      if (!onChange) return;

      const newValue = value.includes(entityId)
        ? value.filter((v) => v !== entityId)
        : hasReachedMax
          ? value
          : [...value, entityId];

      onChange(newValue);
    };

    const handleRemove = (entityId: string) => {
      if (!onChange) return;
      onChange(value.filter((v) => v !== entityId));
    };

    const selectedEntities = entities.filter((e) => value.includes(e.id));

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <Label className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
            {!required && showOptionalLabel && (
              <span className="text-xs text-muted-foreground">(opcional)</span>
            )}
            {maxItems && (
              <span className="text-xs text-muted-foreground">
                ({selectedCount}/{maxItems})
              </span>
            )}
          </Label>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                'w-full justify-between',
                hasError && 'border-destructive',
                !selectedCount && 'text-muted-foreground'
              )}
              disabled={disabled || isLoading}
            >
              {isLoading
                ? 'Carregando...'
                : selectedCount > 0
                  ? `${selectedCount} ${selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}`
                  : placeholder}
              <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {entities.map((entity) => {
                    const isSelected = value.includes(entity.id);
                    const isDisabled = hasReachedMax && !isSelected;

                    return (
                      <CommandItem
                        key={entity.id}
                        value={entity.id}
                        onSelect={() => handleSelect(entity.id)}
                        disabled={isDisabled}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex items-center gap-2">
                          {entity.image && (
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={entity.image}
                                alt={entity.name}
                              />
                              <AvatarFallback className="text-xs">
                                {entity.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span>{entity.name}</span>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedEntities.map((entity) => (
              <Badge
                key={entity.id}
                variant="secondary"
                className="gap-1 pr-1"
              >
                <div className="flex items-center gap-1">
                  {entity.image && (
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={entity.image} alt={entity.name} />
                      <AvatarFallback className="text-xs">
                        {entity.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span>{entity.name}</span>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    className="ml-1 rounded-sm hover:bg-muted"
                    onClick={() => handleRemove(entity.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}

        {hasError && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

EntityMultiSelect.displayName = 'EntityMultiSelect';
