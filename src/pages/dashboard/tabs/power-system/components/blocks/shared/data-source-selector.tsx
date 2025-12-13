import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import type { DataSourceType } from "../../../types/power-system-types";

interface DataSourceSelectorProps {
  value: DataSourceType;
  onChange: (value: DataSourceType) => void;
}

export function DataSourceSelector({
  value,
  onChange,
}: DataSourceSelectorProps) {
  const { t } = useTranslation("power-system");

  const sources: { value: DataSourceType; label: string }[] = [
    { value: "manual", label: t("blocks.dropdown.data_source_manual") },
    { value: "characters", label: t("blocks.dropdown.data_source_characters") },
    { value: "factions", label: t("blocks.dropdown.data_source_factions") },
    { value: "items", label: t("blocks.dropdown.data_source_items") },
    { value: "races", label: t("blocks.dropdown.data_source_races") },
  ];

  return (
    <div className="flex flex-wrap gap-2" data-no-drag="true">
      {sources.map((source) => (
        <Button
          key={source.value}
          type="button"
          variant="ghost-active"
          size="sm"
          active={value === source.value}
          onClick={() => onChange(source.value)}
          className="cursor-pointer"
        >
          {source.label}
        </Button>
      ))}
    </div>
  );
}
