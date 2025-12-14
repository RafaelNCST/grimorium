import { LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Helper para converter cores Tailwind em valores CSS
const getTailwindColor = (colorString: string): string => {
  const colorMap: Record<string, string> = {
    // Blues
    "blue-500/10": "rgb(59 130 246 / 0.1)",
    "blue-500/20": "rgb(59 130 246 / 0.2)",
    "blue-500/30": "rgb(59 130 246 / 0.3)",
    // Yellows
    "yellow-500/10": "rgb(234 179 8 / 0.1)",
    "yellow-500/20": "rgb(234 179 8 / 0.2)",
    "yellow-500/30": "rgb(234 179 8 / 0.3)",
    // Oranges
    "orange-500/10": "rgb(249 115 22 / 0.1)",
    "orange-500/20": "rgb(249 115 22 / 0.2)",
    "orange-500/30": "rgb(249 115 22 / 0.3)",
    // Reds
    "red-500/10": "rgb(239 68 68 / 0.1)",
    "red-500/20": "rgb(239 68 68 / 0.2)",
    "red-500/30": "rgb(239 68 68 / 0.3)",
    "red-700/10": "rgb(185 28 28 / 0.1)",
    "red-700/20": "rgb(185 28 28 / 0.2)",
    "red-700/30": "rgb(185 28 28 / 0.3)",
    // Grays
    "gray-500/10": "rgb(107 114 128 / 0.1)",
    "gray-500/20": "rgb(107 114 128 / 0.2)",
    "gray-500/30": "rgb(107 114 128 / 0.3)",
    "gray-400/10": "rgb(156 163 175 / 0.1)",
    "gray-400/20": "rgb(156 163 175 / 0.2)",
    "gray-400/30": "rgb(156 163 175 / 0.3)",
    // Purples
    "purple-500/10": "rgb(168 85 247 / 0.1)",
    "purple-500/20": "rgb(168 85 247 / 0.2)",
    "purple-500/30": "rgb(168 85 247 / 0.3)",
    "violet-500/10": "rgb(139 92 246 / 0.1)",
    "violet-500/20": "rgb(139 92 246 / 0.2)",
    "violet-500/30": "rgb(139 92 246 / 0.3)",
    // Greens
    "emerald-500/10": "rgb(16 185 129 / 0.1)",
    "emerald-500/20": "rgb(16 185 129 / 0.2)",
    "emerald-500/30": "rgb(16 185 129 / 0.3)",
    "green-500/10": "rgb(34 197 94 / 0.1)",
    "green-500/20": "rgb(34 197 94 / 0.2)",
    "green-500/30": "rgb(34 197 94 / 0.3)",
    // Pinks
    "pink-500/10": "rgb(236 72 153 / 0.1)",
    "pink-500/20": "rgb(236 72 153 / 0.2)",
    "pink-500/30": "rgb(236 72 153 / 0.3)",
    "pink-400/10": "rgb(244 114 182 / 0.1)",
    "pink-400/20": "rgb(244 114 182 / 0.2)",
    "pink-400/30": "rgb(244 114 182 / 0.3)",
    "fuchsia-500/10": "rgb(217 70 239 / 0.1)",
    "fuchsia-500/20": "rgb(217 70 239 / 0.2)",
    "fuchsia-500/30": "rgb(217 70 239 / 0.3)",
    // Others
    "sky-500/10": "rgb(14 165 233 / 0.1)",
    "sky-500/20": "rgb(14 165 233 / 0.2)",
    "sky-500/30": "rgb(14 165 233 / 0.3)",
    "cyan-500/10": "rgb(6 182 212 / 0.1)",
    "cyan-500/20": "rgb(6 182 212 / 0.2)",
    "cyan-500/30": "rgb(6 182 212 / 0.3)",
    "teal-500/10": "rgb(20 184 166 / 0.1)",
    "teal-500/20": "rgb(20 184 166 / 0.2)",
    "teal-500/30": "rgb(20 184 166 / 0.3)",
    "indigo-500/10": "rgb(99 102 241 / 0.1)",
    "indigo-500/20": "rgb(99 102 241 / 0.2)",
    "indigo-500/30": "rgb(99 102 241 / 0.3)",
    "slate-500/10": "rgb(100 116 139 / 0.1)",
    "slate-500/20": "rgb(100 116 139 / 0.2)",
    "slate-500/30": "rgb(100 116 139 / 0.3)",
    "amber-500/10": "rgb(245 158 11 / 0.1)",
    "amber-500/20": "rgb(245 158 11 / 0.2)",
    "amber-500/30": "rgb(245 158 11 / 0.3)",
  };
  return colorMap[colorString] || colorString;
};

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
   * Background color for hover and active states (e.g., "blue-500/10")
   */
  backgroundColor: string;
  /**
   * Border color for hover and active states (e.g., "blue-500/30")
   */
  borderColor: string;
  /**
   * Whether this option is disabled
   */
  disabled?: boolean;
}

interface FormSimpleGridProps<T = string> {
  /**
   * Selected value (single selection) or values (multi-selection)
   */
  value: T | T[] | null | undefined;
  /**
   * Callback when value changes
   */
  onChange: (value: T | T[]) => void;
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
  /**
   * Enable multi-selection mode (default: false)
   */
  multi?: boolean;
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
 *       backgroundColor: "yellow-500/10",
 *       borderColor: "yellow-500/30"
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
  multi = false,
}: FormSimpleGridProps<T>) {
  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[columns];

  const handleClick = (optionValue: T) => {
    if (multi) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue) as T[]);
      } else {
        onChange([...currentValues, optionValue] as T[]);
      }
    } else {
      // Allow deselection: if clicking on selected item, set to empty string
      if (value === optionValue) {
        onChange("" as T);
      } else {
        onChange(optionValue);
      }
    }
  };

  const isSelected = (optionValue: T): boolean => {
    if (multi) {
      return Array.isArray(value) ? value.includes(optionValue) : false;
    }
    return value === optionValue;
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-primary">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className={cn("grid gap-3 w-full overflow-x-hidden", gridColsClass, className)}>
        {options.map((option) => {
          const Icon = option.icon;
          const selected = isSelected(option.value);
          const isDisabled = option.disabled === true;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => !isDisabled && handleClick(option.value)}
              disabled={isDisabled}
              className={cn(
                "relative rounded-lg border-2 p-4 transition-all flex flex-col items-center justify-center gap-2 min-h-[100px]",
                !selected && "bg-card text-foreground border-border",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              style={
                selected
                  ? {
                      backgroundColor: getTailwindColor(option.backgroundColor),
                      borderColor: getTailwindColor(option.borderColor),
                      boxShadow: `0 0 0 4px ${getTailwindColor(option.borderColor).replace(/[0-9.]+\)$/, "0.5)")}`,
                    }
                  : undefined
              }
              onMouseEnter={(e) => {
                if (!selected && !isDisabled) {
                  e.currentTarget.style.backgroundColor = getTailwindColor(
                    option.backgroundColor
                  );
                  e.currentTarget.style.borderColor = getTailwindColor(
                    option.borderColor
                  );
                }
              }}
              onMouseLeave={(e) => {
                if (!selected && !isDisabled) {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.borderColor = "";
                }
              }}
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
