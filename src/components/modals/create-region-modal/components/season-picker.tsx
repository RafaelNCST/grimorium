import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { REGION_SEASONS } from "../constants/seasons";
import { RegionSeason } from "@/pages/dashboard/tabs/world/types/region-types";
import {
  SEASON_BASE_COLOR,
  SEASON_HOVER_COLOR,
  SEASON_ACTIVE_COLOR,
} from "../constants/season-colors";

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

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-primary">
        {t("create_region.current_season_label")}
      </label>

      <div className="grid grid-cols-2 gap-3">
        {REGION_SEASONS.map((season) => {
          const Icon = season.icon;
          const isSelected = value === season.value;
          const isCustomOption = season.value === "custom";

          return (
            <button
              key={season.value}
              type="button"
              onClick={() => onSeasonChange(season.value)}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left cursor-pointer
                ${isCustomOption ? "col-span-2" : ""}
                ${isSelected ? `${SEASON_ACTIVE_COLOR[season.value]} text-foreground` : SEASON_BASE_COLOR}
                ${!isSelected ? `${SEASON_HOVER_COLOR[season.value]} hover:text-foreground` : ""}
              `}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {season.label}
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    {season.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isCustom && (
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium text-primary">
            {t("create_region.custom_season_label")}
          </label>
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
      )}
    </div>
  );
}
