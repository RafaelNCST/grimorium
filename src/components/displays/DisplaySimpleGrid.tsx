import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Option configuration for display simple grid
 */
export interface DisplaySimpleGridOption<T = string> {
  /**
   * Unique value for this option
   */
  value: T;
  /**
   * Display label
   */
  label: string;
  /**
   * Optional icon component
   */
  icon?: LucideIcon;
  /**
   * Active/selected color class (always displayed as active)
   */
  activeColorClass?: string;
}

interface DisplaySimpleGridProps<T = string> {
  /**
   * Current active value (if null/undefined, shows empty state)
   */
  value: T | null | undefined;
  /**
   * Available options (to find matching display data)
   */
  options: DisplaySimpleGridOption<T>[];
  /**
   * Empty state text when no value is provided
   */
  emptyText?: string;
  /**
   * Optional custom className for container
   */
  className?: string;
}

/**
 * DisplaySimpleGrid - Display-only version of FormSimpleGrid
 *
 * Shows a single card in "active" state from the grid options.
 * Used in view mode to display the selected option without interaction.
 * If no value is provided, shows an empty state with neutral colors.
 *
 * @example Basic usage (Physical Type in view mode)
 * ```tsx
 * <DisplaySimpleGrid
 *   value={character.physicalType}
 *   options={physicalTypeOptions}
 *   emptyText="Não definido"
 * />
 * ```
 *
 * @example Empty state (no value)
 * ```tsx
 * <DisplaySimpleGrid
 *   value={null}
 *   options={physicalTypeOptions}
 *   emptyText="Tipo físico não definido"
 * />
 * ```
 */
export function DisplaySimpleGrid<T extends string = string>({
  value,
  options,
  emptyText = "Não definido",
  className,
}: DisplaySimpleGridProps<T>) {
  // Find the matching option
  const selectedOption = value
    ? options.find((opt) => opt.value === value)
    : null;

  // If no value or option not found, show empty state
  if (!selectedOption) {
    return (
      <div className={cn("border-2 border-muted bg-muted/30 p-4 rounded-lg", className)}>
        <div className="flex flex-col items-center justify-center gap-2 min-h-[100px]">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xs">?</span>
          </div>
          <p className="font-medium text-sm text-center text-muted-foreground">
            {emptyText}
          </p>
        </div>
      </div>
    );
  }

  // Render active state card
  const Icon = selectedOption.icon;

  return (
    <div
      className={cn(
        "border-2 p-4 rounded-lg transition-all flex flex-col items-center justify-center gap-2 min-h-[100px]",
        selectedOption.activeColorClass ||
          "bg-primary/20 border-primary/30 ring-4 ring-primary/50 text-primary",
        className
      )}
    >
      {Icon && <Icon className="w-8 h-8 flex-shrink-0" />}
      <p className="font-medium text-sm text-center">{selectedOption.label}</p>
    </div>
  );
}
