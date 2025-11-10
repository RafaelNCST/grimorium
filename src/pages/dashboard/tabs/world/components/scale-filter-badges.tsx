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

  const handleTotalClick = () => {
    // Clear all filters when clicking total
    if (selectedScales.length > 0) {
      selectedScales.forEach(scale => onScaleToggle(scale));
    }
  };

  // Map scales to their colors
  const scaleColorMap: Record<RegionScale, { color: string; activeClasses: string; inactiveClasses: string }> = {
    local: {
      color: "emerald",
      activeClasses: "!bg-emerald-500 !text-black !border-emerald-500",
      inactiveClasses: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:!bg-emerald-500 hover:!text-black hover:!border-emerald-500"
    },
    continental: {
      color: "blue",
      activeClasses: "!bg-blue-500 !text-black !border-blue-500",
      inactiveClasses: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500"
    },
    planetary: {
      color: "violet",
      activeClasses: "!bg-violet-500 !text-black !border-violet-500",
      inactiveClasses: "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:!bg-violet-500 hover:!text-black hover:!border-violet-500"
    },
    galactic: {
      color: "purple",
      activeClasses: "!bg-purple-500 !text-black !border-purple-500",
      inactiveClasses: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400 hover:!bg-purple-500 hover:!text-black hover:!border-purple-500"
    },
    universal: {
      color: "amber",
      activeClasses: "!bg-amber-500 !text-black !border-amber-500",
      inactiveClasses: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:!bg-amber-500 hover:!text-black hover:!border-amber-500"
    },
    multiversal: {
      color: "pink",
      activeClasses: "!bg-pink-500 !text-black !border-pink-500",
      inactiveClasses: "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400 hover:!bg-pink-500 hover:!text-black hover:!border-pink-500"
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Total Badge */}
      <Badge
        className={`cursor-pointer border transition-colors ${
          selectedScales.length === 0
            ? "!bg-primary !text-white !border-primary"
            : "bg-background text-foreground border-border hover:!bg-primary hover:!text-white hover:!border-primary"
        }`}
        onClick={handleTotalClick}
      >
        {totalRegions} {t("filters.all")}
      </Badge>

      {/* Scale Filter Badges */}
      {SCALES.map((scale) => {
        const count = scaleStats[scale];
        const isActive = selectedScales.includes(scale);
        const colorConfig = scaleColorMap[scale];

        return (
          <Badge
            key={scale}
            className={`cursor-pointer border transition-colors ${
              isActive
                ? colorConfig.activeClasses
                : colorConfig.inactiveClasses
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
