import { StickyNote } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EntityNotesEmptyStateProps {
  entityName: string;
}

export function EntityNotesEmptyState({
  entityName,
}: EntityNotesEmptyStateProps) {
  const { t } = useTranslation("notes");

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <StickyNote className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">
        {t("entity_notes.empty_state.title")}
      </h3>
      <p className="text-muted-foreground mt-1 max-w-sm">
        {t("entity_notes.empty_state.description", { entityName })}
      </p>
    </div>
  );
}
