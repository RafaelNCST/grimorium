import { useTranslation } from "react-i18next";

import { TagsInput } from "@/components/modals/create-race-modal/components/tags-input";
import { Badge } from "@/components/ui/badge";

interface HabitatDisplayProps {
  habitats: string[];
  isEditing: boolean;
  onHabitatsChange: (habitats: string[]) => void;
}

export function HabitatDisplay({
  habitats,
  isEditing,
  onHabitatsChange,
}: HabitatDisplayProps) {
  const { t } = useTranslation("race-detail");

  if (isEditing) {
    return (
      <TagsInput
        tags={habitats}
        onChange={onHabitatsChange}
        label=""
        placeholder={t("placeholders.habitat")}
        maxLength={100}
      />
    );
  }

  if (habitats.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
        <p>{t("empty_states.no_habitat")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {habitats.map((habitat, index) => (
        <Badge
          key={`${habitat}-${index}`}
          variant="secondary"
          className="px-3 py-1"
        >
          {habitat}
        </Badge>
      ))}
    </div>
  );
}
