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
   * Background color (e.g., "blue-500/10")
   */
  backgroundColor?: string;
  /**
   * Border color (e.g., "blue-500/30")
   */
  borderColor?: string;
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

  // If no value or option not found, show empty state with same structure and gray colors
  if (!selectedOption) {
    return (
      <div
        className={cn(
          "p-4 rounded-lg border-2 transition-all",
          className
        )}
        style={{
          backgroundColor: getTailwindColor("gray-500/10"),
          borderColor: getTailwindColor("gray-500/30"),
          boxShadow: `0 0 0 4px ${getTailwindColor("gray-500/30").replace(/[0-9.]+\)$/, '0.5)')}`,
        }}
      >
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-muted-foreground">
              {emptyText}
            </p>
            {emptyDescription && (
              <p className="text-xs mt-1 opacity-60 text-muted-foreground">
                {emptyDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render active state card with colors
  const Icon = selectedOption.icon;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 transition-all",
        className
      )}
      style={{
        backgroundColor: selectedOption.backgroundColor
          ? getTailwindColor(selectedOption.backgroundColor)
          : 'rgb(var(--primary) / 0.2)',
        borderColor: selectedOption.borderColor
          ? getTailwindColor(selectedOption.borderColor)
          : 'rgb(var(--primary) / 0.3)',
        boxShadow: selectedOption.borderColor
          ? `0 0 0 4px ${getTailwindColor(selectedOption.borderColor).replace(/[0-9.]+\)$/, '0.5)')}`
          : '0 0 0 4px rgb(var(--primary) / 0.5)',
      }}
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
