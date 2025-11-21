import { cn } from "@/lib/utils";

interface DisplayTextProps {
  /**
   * Text value to display (if null/undefined, shows empty state)
   */
  value: string | null | undefined;
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
 * <DisplayText value={character.height} />
 * ```
 *
 * @example Empty state
 * ```tsx
 * <DisplayText value={null} />
 * ```
 */
export function DisplayText({
  value,
  className,
}: DisplayTextProps) {
  // If no value, show empty state
  if (!value || value.trim() === "") {
    return (
      <span className={cn("italic text-muted-foreground/60", className)}>
        Sem dados
      </span>
    );
  }

  // Render text value
  return <p className={cn("text-sm", className)}>{value}</p>;
}
