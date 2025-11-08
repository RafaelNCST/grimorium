import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";

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
    <div className="space-y-2">
      <Label>{t("blocks.dropdown.data_source_label")}</Label>
      <div className="flex flex-wrap gap-2" data-no-drag="true">
        {sources.map((source) => (
          <button
            key={source.value}
            type="button"
            onClick={() => onChange(source.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
              value === source.value
                ? "border-primary/40 bg-primary/10 shadow-sm"
                : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
            }`}
          >
            {source.label}
          </button>
        ))}
      </div>
    </div>
  );
}
