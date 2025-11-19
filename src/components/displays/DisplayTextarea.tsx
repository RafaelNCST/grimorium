import { cn } from "@/lib/utils";

interface DisplayTextareaProps {
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
 * DisplayTextarea - Display component for long text fields
 *
 * Shows text with preserved line breaks (whitespace-pre-wrap) and automatic empty state handling.
 * Used in view mode to display long text fields like personality, past, descriptions, etc.
 *
 * @example With value
 * ```tsx
 * <DisplayTextarea
 *   value={character.personality}
 *   emptyText="Personalidade não definida"
 * />
 * ```
 *
 * @example Empty state
 * ```tsx
 * <DisplayTextarea
 *   value={null}
 *   emptyText="Não definido"
 * />
 * ```
 */
export function DisplayTextarea({
  value,
  emptyText = "Não definido",
  className,
}: DisplayTextareaProps) {
  // If no value, show empty state
  if (!value || value.trim() === "") {
    return (
      <span className={cn("italic text-muted-foreground/60", className)}>
        {emptyText}
      </span>
    );
  }

  // Render text value with preserved line breaks
  return (
    <p className={cn("text-sm whitespace-pre-wrap", className)}>{value}</p>
  );
}
