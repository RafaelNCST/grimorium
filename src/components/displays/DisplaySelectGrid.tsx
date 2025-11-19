import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Option configuration for display select grid
 */
export interface DisplaySelectGridOption<T = string> {
  /**
   * Unique value for this option
   */
  value: T;
  /**
   * Display label
   */
  label: string;
  /**
   * Optional description
   */
  description?: string;
  /**
   * Optional icon component
   */
  icon?: LucideIcon;
  /**
   * Active/selected color class (always displayed as active)
   */
  activeColorClass?: string;
}

interface DisplaySelectGridProps<T = string> {
  /**
   * Current active value (if null/undefined, shows empty state)
   */
  value: T | null | undefined;
  /**
   * Available options (to find matching display data)
   */
  options: DisplaySelectGridOption<T>[];
  /**
   * Empty state text when no value is provided
   */
  emptyText?: string;
  /**
   * Empty state description when no value is provided
   */
  emptyDescription?: string;
  /**
   * Optional custom className for container
   */
  className?: string;
}

/**
 * DisplaySelectGrid - Display-only version of FormSelectGrid
 *
 * Shows a single card in "active" state from the grid options.
 * Used in view mode to display the selected option without interaction.
 * If no value is provided, shows an empty state with neutral colors.
 *
 * Features icon on the left, label and description on the right (horizontal layout).
 *
 * @example Basic usage (Archetype in view mode)
 * ```tsx
 * <DisplaySelectGrid
 *   value={character.archetype}
 *   options={archetypeOptions}
 *   emptyText="Não definido"
 *   emptyDescription="Nenhum arquétipo foi selecionado"
 * />
 * ```
 *
 * @example Empty state (no value)
 * ```tsx
 * <DisplaySelectGrid
 *   value={null}
 *   options={archetypeOptions}
 *   emptyText="Arquétipo não definido"
 *   emptyDescription="Selecione um arquétipo para visualizar"
 * />
 * ```
 */
export function DisplaySelectGrid<T extends string = string>({
  value,
  options,
  emptyText = "Não definido",
  emptyDescription = "Nenhuma seleção disponível",
  className,
}: DisplaySelectGridProps<T>) {
  // Find the matching option
  const selectedOption = value
    ? options.find((opt) => opt.value === value)
    : null;

  // If no value or option not found, show empty state
  if (!selectedOption) {
    return (
      <div
        className={cn(
          "border-2 border-muted bg-muted/30 p-6 rounded-lg",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 mt-0.5 flex-shrink-0 rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xs">?</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-muted-foreground">
              {emptyText}
            </p>
            <p className="text-xs mt-1 opacity-60 text-muted-foreground">
              {emptyDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render active state card
  const Icon = selectedOption.icon;

  return (
    <div
      className={cn(
        "p-6 rounded-lg border-2 transition-all",
        selectedOption.activeColorClass ||
          "bg-primary/20 border-primary/30 ring-4 ring-primary/50 text-primary",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{selectedOption.label}</p>
          {selectedOption.description && (
            <p className="text-xs mt-1 opacity-80">
              {selectedOption.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
