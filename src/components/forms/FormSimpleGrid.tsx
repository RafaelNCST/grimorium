import { LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Option configuration for simple grid selection
 */
export interface SimpleGridSelectOption<T = string> {
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
   * Base background color class when not selected
   */
  baseColorClass?: string;
  /**
   * Hover color class
   */
  hoverColorClass?: string;
  /**
   * Active/selected color class
   */
  activeColorClass?: string;
}

interface FormSimpleGridProps<T = string> {
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
  options: SimpleGridSelectOption<T>[];
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
   * Number of columns in the grid (default: 5)
   */
  columns?: 2 | 3 | 4 | 5 | 6;
  /**
   * Optional custom className for grid container
   */
  className?: string;
}

/**
 * FormSimpleGrid - Simple grid-based selection component with icon on top and label below
 *
 * A simplified version of FormSelectGrid without descriptions.
 * Perfect for role selection, status selection, etc.
 *
 * @example Basic usage (Roles)
 * ```tsx
 * <FormSimpleGrid
 *   value={role}
 *   onChange={setRole}
 *   label="Role"
 *   required
 *   columns={5}
 *   options={[
 *     {
 *       value: "protagonist",
 *       label: "Protagonist",
 *       icon: Star,
 *       activeColorClass: "bg-yellow-500 border-yellow-500",
 *       iconColorClass: "text-muted-foreground",
 *       activeIconColorClass: "text-white"
 *     },
 *     // ... more options
 *   ]}
 * />
 * ```
 */
export function FormSimpleGrid<T extends string = string>({
  value,
  onChange,
  options,
  label,
  required = false,
  error,
  columns = 5,
  className,
}: FormSimpleGridProps<T>) {
  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[columns];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-primary">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className={cn(`grid ${gridColsClass} gap-3`, className)}>
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 min-h-[100px]",
                isSelected
                  ? option.activeColorClass || "bg-primary text-white border-primary"
                  : cn(
                      option.baseColorClass || "bg-background text-foreground border-border",
                      option.hoverColorClass || "hover:bg-primary hover:text-white hover:border-primary"
                    )
              )}
            >
              {Icon && <Icon className="w-8 h-8 flex-shrink-0" />}
              <p className="font-medium text-sm text-center">{option.label}</p>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
