import { useTranslation } from "react-i18next";

import { TagsInput } from "@/components/modals/create-race-modal/components/tags-input";
import { Badge } from "@/components/ui/badge";

interface AlternativeNamesDisplayProps {
  names: string[];
  isEditing: boolean;
  onNamesChange: (names: string[]) => void;
}

export function AlternativeNamesDisplay({
  names,
  isEditing,
  onNamesChange,
}: AlternativeNamesDisplayProps) {
  const { t } = useTranslation("race-detail");

  if (isEditing) {
    return (
      <TagsInput
        tags={names}
        onChange={onNamesChange}
        label=""
        placeholder={t("placeholders.alternative_name")}
        maxLength={50}
      />
    );
  }

  if (names.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
        <p>{t("empty_states.no_alternative_names")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {names.map((name, index) => (
        <Badge
          key={`${name}-${index}`}
          variant="secondary"
          className="px-3 py-1"
        >
          {name}
        </Badge>
      ))}
    </div>
  );
}
