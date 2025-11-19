import { cn } from "@/lib/utils";

interface DisplayTextProps {
  /**
   * Text value to display (if null/undefined, shows empty state)
   */
  value: string | null | undefined;
  /**
   * Empty state text when no value is provided
   */
  emptyText?: string;
  /**
   * Optional custom className for the text element
   */
  className?: string;
}

/**
 * DisplayText - Display component for simple text fields
 *
 * Shows text in a consistent style with automatic empty state handling.
 * Used in view mode to display short text fields like height, weight, etc.
 *
 * @example With value
 * ```tsx
 * <DisplayText
 *   value={character.height}
 *   emptyText="Altura não definida"
 * />
 * ```
 *
 * @example Empty state
 * ```tsx
 * <DisplayText
 *   value={null}
 *   emptyText="Não definido"
 * />
 * ```
 */
export function DisplayText({
  value,
  emptyText = "Não definido",
  className,
}: DisplayTextProps) {
  // If no value, show empty state
  if (!value || value.trim() === "") {
    return (
      <span className={cn("italic text-muted-foreground/60", className)}>
        {emptyText}
      </span>
    );
  }

  // Render text value
  return <p className={cn("text-sm", className)}>{value}</p>;
}
