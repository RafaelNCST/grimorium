interface EmptyFieldStateProps {
  t: (key: string) => string;
}

/**
 * EmptyFieldState - Component to show when a field is empty
 */
export function EmptyFieldState({ t }: EmptyFieldStateProps) {
  return (
    <span className="italic text-muted-foreground/60">
      {t("common:empty_field")}
    </span>
  );
}
