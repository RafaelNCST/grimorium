import { ReactNode } from "react";

import { LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Option configuration for grid selection
 */
export interface GridSelectOption<T = string> {
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
   * Background color for hover and active states (e.g., "blue-500/10")
   */
  backgroundColor: string;
  /**
   * Border color for hover and active states (e.g., "blue-500/30")
   */
  borderColor: string;
  /**
   * Number of columns this option should span (e.g., 2 for full width in a 2-column grid)
   */
  colSpan?: number;
}

interface FormSelectGridProps<T = string> {
  /**
   * Selected value
   */
  value: T | null | undefined;
  /**
   * Callback when value changes
   */
  onChange: (value: T) => void;
  /**
   * Available options
   */
  options: GridSelectOption<T>[];
  /**
   * Label for the field
   */
  label: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Optional error message
   */
  error?: string;
  /**
   * Number of columns in the grid (default: 2)
   */
  columns?: number;
  /**
   * Optional custom className for grid container
   */
  className?: string;
  /**
   * Optional expanded content to show after grid (e.g., custom input field)
   */
  expandedContent?: ReactNode;
  /**
   * Whether to show the expanded content
   */
  showExpandedContent?: boolean;
}

/**
 * FormSelectGrid - Reusable grid-based selection component
 *
 * Provides a visual grid of options with icons and descriptions.
 * Used for selections like scales, seasons, types, etc.
 *
 * @example Basic usage (Scale-like)
 * ```tsx
 * <FormSelectGrid
 *   value={scale}
 *   onChange={setScale}
 *   label="Scale"
 *   required
 *   options={[
 *     {
 *       value: "local",
 *       label: "Local",
 *       description: "Cities, towns, forests",
 *       icon: MapPin,
 *       backgroundColor: "emerald-500/10",
 *       borderColor: "emerald-500/30"
 *     },
 *     // ... more options
 *   ]}
 * />
 * ```
 *
 * @example Season-like with custom columns
 * ```tsx
 * <FormSelectGrid
 *   value={season}
 *   onChange={setSeason}
 *   label="Season"
 *   columns={3}
 *   options={seasonOptions}
 * />
 * ```
 */
export function FormSelectGrid<T extends string = string>({
  value,
  onChange,
  options,
  label,
  required = false,
  error,
  columns = 2,
  className,
  expandedContent,
  showExpandedContent = false,
}: FormSelectGridProps<T>) {
  const getColSpanClass = (colSpan?: number) => {
    if (!colSpan) return "";
    return `col-span-${colSpan}`;
  };

  return (
    <div className="space-y-2">
      <Label className="text-primary">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className={cn(`grid grid-cols-${columns} gap-3`, className)}>
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all text-left",
                "bg-card text-foreground border-border",
                option.colSpan ? getColSpanClass(option.colSpan) : "",
                isSelected
                  ? `bg-${option.backgroundColor} border-${option.borderColor} ring-4 ring-${option.borderColor}`
                  : `hover:bg-${option.backgroundColor} hover:border-${option.borderColor}`
              )}
            >
              <div className="flex items-start gap-3">
                {Icon && <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{option.label}</p>
                  {option.description && (
                    <p className="text-xs mt-1 opacity-80">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showExpandedContent && expandedContent && (
        <div className="mt-4">{expandedContent}</div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
