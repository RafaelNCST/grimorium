import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { RitesManager } from "@/components/modals/create-race-modal/components/rites-manager";
import type { RiteItem } from "@/components/modals/create-race-modal/components/rites-manager";

interface RitesDisplayProps {
  items: RiteItem[];
  isEditing: boolean;
  onItemsChange: (items: RiteItem[]) => void;
}

export function RitesDisplay({
  items,
  isEditing,
  onItemsChange,
}: RitesDisplayProps) {
  const { t } = useTranslation("race-detail");

  if (isEditing) {
    return (
      <RitesManager
        items={items}
        onChange={onItemsChange}
        label={t("fields.cultural_notes")}
        buttonLabel={t("buttons.add_note")}
        modalTitle={t("modals.add_cultural_note")}
        placeholder={t("placeholders.cultural_note")}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
        <p>{t("empty_states.no_cultural_notes")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 rounded-lg border bg-muted/30 transition-colors"
        >
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
