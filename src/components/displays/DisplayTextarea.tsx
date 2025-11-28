import { cn } from "@/lib/utils";

interface DisplayTextareaProps {
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
 * DisplayTextarea - Display component for long text fields
 *
 * Shows text with preserved line breaks (whitespace-pre-wrap) and automatic empty state handling.
 * Used in view mode to display long text fields like personality, past, descriptions, etc.
 *
 * @example With value
 * ```tsx
 * <DisplayTextarea value={character.personality} />
 * ```
 *
 * @example Empty state
 * ```tsx
 * <DisplayTextarea value={null} />
 * ```
 */
export function DisplayTextarea({ value, className }: DisplayTextareaProps) {
  // If no value, show empty state
  if (!value || value.trim() === "") {
    return (
      <span className={cn("italic text-muted-foreground/60", className)}>
        Sem dados
      </span>
    );
  }

  // Render text value with preserved line breaks
  return (
    <p className={cn("text-sm whitespace-pre-wrap", className)}>{value}</p>
  );
}
