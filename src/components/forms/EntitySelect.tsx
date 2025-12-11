import * as React from "react";

import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Service imports
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import { getRegionsByBookId } from "@/lib/db/regions.service";
import { cn } from "@/lib/utils";

export type EntityType = "character" | "faction" | "race" | "item" | "region";

export interface Entity {
  id: string;
  name: string;
  image?: string;
}

export interface EntitySelectProps {
  entity: EntityType;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
  showOptionalLabel?: boolean;
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
 * EntitySelect - Dropdown for selecting entities from other tabs
 *
 * @example
 * ```tsx
 * <EntitySelect
 *   entity="character"
 *   value={founderId}
 *   onValueChange={setFounderId}
 *   label="Fundador"
 *   placeholder="Selecione o fundador"
 * />
 * ```
 */
export const EntitySelect = React.forwardRef<
  HTMLButtonElement,
  EntitySelectProps
>(
  (
    {
      entity,
      value,
      onValueChange,
      label,
      placeholder = "Selecione...",
      error,
      helperText,
      containerClassName,
      required,
      disabled,
      showOptionalLabel = true,
      filter,
    },
    ref
  ) => {
    const { t } = useTranslation(["empty-states", "loading"]);
    const { dashboardId } = useParams({ strict: false }) as {
      dashboardId?: string;
    };
    const [entities, setEntities] = React.useState<Entity[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const hasError = Boolean(error);

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

    const selectedEntity = entities.find((e) => e.id === value);

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
            {!required && showOptionalLabel && (
              <span className="text-xs text-muted-foreground">(opcional)</span>
            )}
          </Label>
        )}

        <Select
          value={value ?? undefined}
          onValueChange={(newValue) =>
            onValueChange?.(newValue === "__none__" ? null : newValue)
          }
          disabled={disabled || isLoading}
        >
          <SelectTrigger
            ref={ref}
            className={cn(hasError && "border-destructive")}
            aria-invalid={hasError}
          >
            {selectedEntity ? (
              <div className="flex items-center gap-2">
                {selectedEntity.image && (
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={selectedEntity.image}
                      alt={selectedEntity.name}
                    />
                    <AvatarFallback className="text-xs">
                      {selectedEntity.name[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span>{selectedEntity.name}</span>
              </div>
            ) : (
              <SelectValue
                placeholder={isLoading ? t("loading:loading") : placeholder}
              />
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {!required && (
                <SelectItem value="__none__">
                  <span className="text-muted-foreground">
                    {t("empty-states:plot_arc.no_arc")}
                  </span>
                </SelectItem>
              )}
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  <div className="flex items-center gap-2">
                    {entity.image && (
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={entity.image} alt={entity.name} />
                        <AvatarFallback className="text-xs">
                          {entity.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span>{entity.name}</span>
                  </div>
                </SelectItem>
              ))}
              {entities.length === 0 && !isLoading && (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  {t("empty-states:items.no_item_available")}
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

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

EntitySelect.displayName = "EntitySelect";
