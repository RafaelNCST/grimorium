import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * Entity item configuration for display
 */
export interface DisplayEntityItem {
  /**
   * Unique identifier for the entity
   */
  id: string;
  /**
   * Display name of the entity
   */
  name: string;
  /**
   * Optional image URL
   */
  image?: string;
}

interface DisplayEntityListProps {
  /**
   * Title/label for the collapsible section
   */
  label: string;
  /**
   * List of entities to display (if empty/null, shows empty state)
   */
  entities: DisplayEntityItem[] | null | undefined;
  /**
   * Whether the collapsible is open by default
   */
  defaultOpen?: boolean;
  /**
   * Controlled open state (use with onOpenChange)
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Optional custom className for container
   */
  className?: string;
}

/**
 * DisplayEntityList - Display component for collapsible entity lists
 *
 * Shows a collapsible list of entities with image (or initial fallback) and name.
 * Displays entity count in the header and handles empty state automatically.
 * Used in view mode to display related entities like species, races, locations, etc.
 *
 * @example With entities
 * ```tsx
 * <DisplayEntityList
 *   label="Espécies e Raças"
 *   entities={[
 *     { id: "1", name: "Humano", image: "/human.jpg" },
 *     { id: "2", name: "Elfo" }
 *   ]}
 * />
 * ```
 *
 * @example Empty state
 * ```tsx
 * <DisplayEntityList
 *   label="Local de Nascimento"
 *   entities={[]}
 * />
 * ```
 *
 * @example Controlled state
 * ```tsx
 * <DisplayEntityList
 *   label="Espécies"
 *   entities={races}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */
export function DisplayEntityList({
  label,
  entities,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
}: DisplayEntityListProps) {
  const hasEntities = entities && entities.length > 0;
  const entityCount = entities?.length || 0;

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      className={className}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
        <p className="text-sm font-semibold text-primary">
          {label}
          {hasEntities && (
            <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
              ({entityCount})
            </span>
          )}
        </p>
        {open !== undefined ? (
          open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {hasEntities ? (
          <div className="flex flex-col gap-2">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="flex items-center gap-2 p-2 bg-muted rounded-lg"
              >
                {entity.image ? (
                  <img
                    src={entity.image}
                    alt={entity.name}
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-muted-foreground font-semibold">
                      {entity.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{entity.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="italic text-muted-foreground/60">Sem dados</span>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
