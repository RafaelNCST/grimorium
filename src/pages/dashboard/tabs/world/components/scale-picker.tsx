import { useTranslation } from "react-i18next";
import { RegionScale } from "../types/region-types";
import {
  SCALE_BASE_COLOR,
  SCALE_HOVER_COLOR,
  SCALE_ACTIVE_COLOR,
} from "../constants/scale-colors";
import {
  MapPin,
  Mountain,
  Globe,
  Sparkles,
  Infinity,
  Layers
} from "lucide-react";

interface ScalePickerProps {
  value: RegionScale | null | undefined;
  onChange: (scale: RegionScale) => void;
}

const SCALE_ICONS: Record<RegionScale, React.ComponentType<{ className?: string }>> = {
  local: MapPin,
  continental: Mountain,
  planetary: Globe,
  galactic: Sparkles,
  universal: Infinity,
  multiversal: Layers,
};

const SCALES: RegionScale[] = [
  "local",
  "continental",
  "planetary",
  "galactic",
  "universal",
  "multiversal",
];

export function ScalePicker({ value, onChange }: ScalePickerProps) {
  const { t } = useTranslation("world");

  return (
    <div className="space-y-3">
      {/* Label removed - not needed (duplicate title) */}
      <div className="grid grid-cols-2 gap-3">
        {SCALES.map((scale) => {
          const Icon = SCALE_ICONS[scale];
          const isSelected = value === scale;

          return (
            <button
              key={scale}
              type="button"
              onClick={() => onChange(scale)}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left
                ${isSelected ? `${SCALE_ACTIVE_COLOR[scale]} text-white` : SCALE_BASE_COLOR}
                ${!isSelected ? `${SCALE_HOVER_COLOR[scale]} hover:text-white` : ""}
              `}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {t(`scales.${scale}`)}
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    {t(`scale_descriptions.${scale}`)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
