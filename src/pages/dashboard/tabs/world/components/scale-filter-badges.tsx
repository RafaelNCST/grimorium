import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { RegionScale } from "../types/region-types";
import { SCALE_BADGE_COLORS } from "../constants/scale-colors";

interface ScaleStats {
  local: number;
  continental: number;
  planetary: number;
  galactic: number;
  universal: number;
  multiversal: number;
}

interface ScaleFilterBadgesProps {
  totalRegions: number;
  scaleStats: ScaleStats;
  selectedScales: RegionScale[];
  onScaleToggle: (scale: RegionScale) => void;
}

const SCALES: RegionScale[] = [
  "local",
  "continental",
  "planetary",
  "galactic",
  "universal",
  "multiversal",
];

export function ScaleFilterBadges({
  totalRegions,
  scaleStats,
  selectedScales,
  onScaleToggle,
}: ScaleFilterBadgesProps) {
  const { t } = useTranslation("world");

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Total Badge */}
      <Badge
        variant="secondary"
        className="bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
        onClick={() => {
          // Clear all filters when clicking total
          if (selectedScales.length > 0) {
            SCALES.forEach(scale => onScaleToggle(scale));
          }
        }}
      >
        {totalRegions} {t("filters.all")}
      </Badge>

      {/* Scale Filter Badges */}
      {SCALES.map((scale) => {
        const count = scaleStats[scale];
        const isActive = selectedScales.includes(scale);

        return (
          <Badge
            key={scale}
            variant="secondary"
            className={`cursor-pointer transition-all ${
              isActive
                ? SCALE_BADGE_COLORS[scale]
                : "bg-muted/50 text-muted-foreground border-muted hover:border-primary/30"
            }`}
            onClick={() => onScaleToggle(scale)}
          >
            {count} {t(`scales.${scale}`)}
          </Badge>
        );
      })}
    </div>
  );
}
