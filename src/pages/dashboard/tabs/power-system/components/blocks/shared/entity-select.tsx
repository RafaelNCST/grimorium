import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EntityOption {
  id: string;
  name: string;
  image?: string;
}

interface EntitySelectProps {
  entities: EntityOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function EntitySelect({
  entities,
  selectedId,
  onSelect,
  isLoading,
  placeholder,
}: EntitySelectProps) {
  const { t } = useTranslation("power-system");

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        {t("blocks.dropdown.loading_entities")}
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {t("blocks.dropdown.no_entities")}
      </div>
    );
  }

  return (
    <Select value={selectedId} onValueChange={onSelect}>
      <SelectTrigger data-no-drag="true">
        <SelectValue
          placeholder={placeholder ?? t("blocks.dropdown.select_entity")}
        />
      </SelectTrigger>
      <SelectContent>
        {entities.map((entity) => (
          <SelectItem key={entity.id} value={entity.id}>
            {entity.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
