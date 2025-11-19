import { useTranslation } from "react-i18next";

import {
  FormSelectGrid,
  GridSelectOption,
} from "@/components/forms/FormSelectGrid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegionSeason } from "@/pages/dashboard/tabs/world/types/region-types";

import { REGION_SEASONS } from "../constants/seasons";

interface SeasonPickerProps {
  value?: RegionSeason;
  customSeasonName?: string;
  onSeasonChange: (season: RegionSeason) => void;
  onCustomNameChange: (name: string) => void;
}

export function SeasonPicker({
  value,
  customSeasonName,
  onSeasonChange,
  onCustomNameChange,
}: SeasonPickerProps) {
  const { t } = useTranslation("world");
  const isCustom = value === "custom";

  const seasonColorMap: Record<RegionSeason, { bg: string; border: string }> = {
    spring: { bg: "green-500/10", border: "green-500/20" },
    summer: { bg: "red-500/10", border: "red-500/20" },
    autumn: { bg: "orange-500/10", border: "orange-500/20" },
    winter: { bg: "blue-500/10", border: "blue-500/20" },
    custom: { bg: "purple-500/10", border: "purple-500/20" },
  };

  const seasonOptions: GridSelectOption<RegionSeason>[] = REGION_SEASONS.map(
    (season) => ({
      value: season.value,
      label: season.label,
      description: season.description,
      icon: season.icon,
      backgroundColor: seasonColorMap[season.value].bg,
      borderColor: seasonColorMap[season.value].border,
      colSpan: season.value === "custom" ? 2 : undefined,
    })
  );

  const expandedContent = (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-primary">
        {t("create_region.custom_season_label")}
      </Label>
      <Input
        value={customSeasonName || ""}
        onChange={(e) => onCustomNameChange(e.target.value)}
        placeholder={t("create_region.custom_season_placeholder")}
        maxLength={50}
      />
      <div className="flex justify-end text-xs text-muted-foreground">
        <span>{customSeasonName?.length || 0}/50</span>
      </div>
    </div>
  );

  return (
    <FormSelectGrid
      value={value}
      onChange={onSeasonChange}
      options={seasonOptions}
      label={t("create_region.current_season_label")}
      columns={2}
      expandedContent={expandedContent}
      showExpandedContent={isCustom}
    />
  );
}
