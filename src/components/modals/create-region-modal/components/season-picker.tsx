import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REGION_SEASONS } from "../constants/seasons";
import { RegionSeason } from "@/pages/dashboard/tabs/world/types/region-types";
import {
  SEASON_BASE_COLOR,
  SEASON_HOVER_COLOR,
  SEASON_ACTIVE_COLOR,
} from "../constants/season-colors";
import { FormSelectGrid, GridSelectOption } from "@/components/forms/FormSelectGrid";

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

  const seasonOptions: GridSelectOption<RegionSeason>[] = REGION_SEASONS.map((season) => ({
    value: season.value,
    label: season.label,
    description: season.description,
    icon: season.icon,
    baseColorClass: SEASON_BASE_COLOR,
    hoverColorClass: `${SEASON_HOVER_COLOR[season.value]} hover:text-foreground`,
    activeColorClass: `${SEASON_ACTIVE_COLOR[season.value]} text-foreground`,
    colSpan: season.value === "custom" ? 2 : undefined,
  }));

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
