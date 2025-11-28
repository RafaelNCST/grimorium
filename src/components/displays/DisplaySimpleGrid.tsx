import { LucideIcon, Target } from "lucide-react";

import { cn } from "@/lib/utils";

// Helper to convert Tailwind colors to CSS values
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
   * Background color (e.g., "blue-500/10")
   */
  backgroundColor?: string;
  /**
   * Border color (e.g., "blue-500/30")
   */
  borderColor?: string;
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
 * />
 * ```
 *
 * @example Empty state (no value)
 * ```tsx
 * <DisplaySimpleGrid
 *   value={null}
 *   options={physicalTypeOptions}
 * />
 * ```
 */
export function DisplaySimpleGrid<T extends string = string>({
  value,
  options,
  className,
}: DisplaySimpleGridProps<T>) {
  // Find the matching option
  const selectedOption = value
    ? options.find((opt) => opt.value === value)
    : null;

  // If no value or option not found, show empty state with same structure and gray colors
  if (!selectedOption) {
    return (
      <div
        className={cn(
          "border-2 p-4 rounded-lg transition-all flex flex-col items-center justify-center gap-2 min-h-[100px]",
          className
        )}
        style={{
          backgroundColor: getTailwindColor("gray-500/10"),
          borderColor: getTailwindColor("gray-500/30"),
          boxShadow: `0 0 0 4px ${getTailwindColor("gray-500/30").replace(/[0-9.]+\)$/, "0.5)")}`,
        }}
      >
        <Target className="w-8 h-8 text-muted-foreground flex-shrink-0" />
        <p className="font-medium text-sm text-center text-muted-foreground">
          Sem dados
        </p>
      </div>
    );
  }

  // Render active state card with colors
  const Icon = selectedOption.icon;

  return (
    <div
      className={cn(
        "border-2 p-4 rounded-lg transition-all flex flex-col items-center justify-center gap-2 min-h-[100px]",
        className
      )}
      style={{
        backgroundColor: selectedOption.backgroundColor
          ? getTailwindColor(selectedOption.backgroundColor)
          : "rgb(var(--primary) / 0.2)",
        borderColor: selectedOption.borderColor
          ? getTailwindColor(selectedOption.borderColor)
          : "rgb(var(--primary) / 0.3)",
        boxShadow: selectedOption.borderColor
          ? `0 0 0 4px ${getTailwindColor(selectedOption.borderColor).replace(/[0-9.]+\)$/, "0.5)")}`
          : "0 0 0 4px rgb(var(--primary) / 0.5)",
      }}
    >
      {Icon && <Icon className="w-8 h-8 flex-shrink-0" />}
      <p className="font-medium text-sm text-center">{selectedOption.label}</p>
    </div>
  );
}
