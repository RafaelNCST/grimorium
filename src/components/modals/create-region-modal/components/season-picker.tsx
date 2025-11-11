import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { REGION_SEASONS } from "../constants/seasons";
import { RegionSeason } from "@/pages/dashboard/tabs/world/types/region-types";

interface SeasonPickerProps {
  value?: RegionSeason;
  customSeasonName?: string;
  onSeasonChange: (season: RegionSeason) => void;
  onCustomNameChange: (name: string) => void;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  if (className.includes("text-green-600")) return "rgb(22 163 74)";
  if (className.includes("text-amber-600")) return "rgb(217 119 6)";
  if (className.includes("text-orange-600")) return "rgb(234 88 12)";
  if (className.includes("text-blue-600")) return "rgb(37 99 235)";
  if (className.includes("text-purple-600")) return "rgb(147 51 234)";
  return "currentColor";
};

const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-green-400")) return "rgb(74 222 128)";
  if (className.includes("dark:text-amber-400")) return "rgb(251 191 36)";
  if (className.includes("dark:text-orange-400")) return "rgb(251 146 60)";
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";
  return "currentColor";
};

const getBgColorFromTailwindClass = (className: string): string => {
  if (className.includes("bg-green-50")) return "rgb(240 253 244)";
  if (className.includes("bg-amber-50")) return "rgb(255 251 235)";
  if (className.includes("bg-orange-50")) return "rgb(255 247 237)";
  if (className.includes("bg-blue-50")) return "rgb(239 246 255)";
  if (className.includes("bg-purple-50")) return "rgb(250 245 255)";
  return "transparent";
};

const getDarkBgColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:bg-green-950")) return "rgb(5 46 22)";
  if (className.includes("dark:bg-amber-950")) return "rgb(69 26 3)";
  if (className.includes("dark:bg-orange-950")) return "rgb(67 20 7)";
  if (className.includes("dark:bg-blue-950")) return "rgb(23 37 84)";
  if (className.includes("dark:bg-purple-950")) return "rgb(59 7 100)";
  return "transparent";
};

const getBorderColorFromTailwindClass = (className: string): string => {
  if (className.includes("border-green-200")) return "rgb(187 247 208)";
  if (className.includes("border-amber-200")) return "rgb(253 230 138)";
  if (className.includes("border-orange-200")) return "rgb(254 215 170)";
  if (className.includes("border-blue-200")) return "rgb(191 219 254)";
  if (className.includes("border-purple-200")) return "rgb(233 213 255)";
  return "currentColor";
};

const getDarkBorderColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:border-green-800")) return "rgb(22 101 52)";
  if (className.includes("dark:border-amber-800")) return "rgb(146 64 14)";
  if (className.includes("dark:border-orange-800")) return "rgb(154 52 18)";
  if (className.includes("dark:border-blue-800")) return "rgb(30 64 175)";
  if (className.includes("dark:border-purple-800")) return "rgb(107 33 168)";
  return "currentColor";
};

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
      <label className="text-sm font-medium">
        {t("create_region.current_season_label")}
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {REGION_SEASONS.map((season) => {
          const Icon = season.icon;
          const isSelected = value === season.value;
          const lightTextColor = getColorFromTailwindClass(season.color);
          const darkTextColor = getDarkColorFromTailwindClass(season.color);
          const lightBgColor = getBgColorFromTailwindClass(season.bgColor);
          const darkBgColor = getDarkBgColorFromTailwindClass(season.bgColor);
          const lightBorderColor = getBorderColorFromTailwindClass(
            season.borderColor
          );
          const darkBorderColor = getDarkBorderColorFromTailwindClass(
            season.borderColor
          );
          const isCustomOption = season.value === "custom";

          return (
            <button
              key={season.value}
              type="button"
              onClick={() => onSeasonChange(season.value)}
              data-season={season.value}
              className={`season-picker-item flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isCustomOption ? "col-span-2 md:col-span-4" : ""
              } ${
                isSelected
                  ? `${season.bgColor} ${season.borderColor} shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`w-5 h-5 ${isSelected ? season.color : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${isSelected ? season.color : "text-muted-foreground"}`}
                >
                  {season.label}
                </span>
              </div>
              <p
                className={`text-xs ${isSelected ? "text-foreground/80" : "text-muted-foreground/70"}`}
              >
                {season.description}
              </p>
              {!isSelected && (
                <style>{`
                  .season-picker-item[data-season="${season.value}"]:hover {
                    background-color: ${lightBgColor} !important;
                    border-color: ${lightBorderColor} !important;
                    cursor: pointer;
                  }
                  .season-picker-item[data-season="${season.value}"]:hover svg,
                  .season-picker-item[data-season="${season.value}"]:hover span {
                    color: ${lightTextColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .season-picker-item[data-season="${season.value}"]:hover {
                      background-color: ${darkBgColor} !important;
                      border-color: ${darkBorderColor} !important;
                    }
                    .season-picker-item[data-season="${season.value}"]:hover svg,
                    .season-picker-item[data-season="${season.value}"]:hover span {
                      color: ${darkTextColor} !important;
                    }
                  }
                  .dark .season-picker-item[data-season="${season.value}"]:hover {
                    background-color: ${darkBgColor} !important;
                    border-color: ${darkBorderColor} !important;
                  }
                  .dark .season-picker-item[data-season="${season.value}"]:hover svg,
                  .dark .season-picker-item[data-season="${season.value}"]:hover span {
                    color: ${darkTextColor} !important;
                  }
                `}</style>
              )}
            </button>
          );
        })}
      </div>

      {isCustom && (
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">
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
