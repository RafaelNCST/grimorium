import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export function NotesEmptyState() {
  const { t } = useTranslation("notes");

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{t("empty_state.no_notes")}</h3>
      <p className="text-muted-foreground mt-1 max-w-sm">
        {t("empty_state.no_notes_description")}
      </p>
    </div>
  );
}
