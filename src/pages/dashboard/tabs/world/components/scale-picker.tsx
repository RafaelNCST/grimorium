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
import { FormSelectGrid, GridSelectOption } from "@/components/forms/FormSelectGrid";

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

  const scaleOptions: GridSelectOption<RegionScale>[] = SCALES.map((scale) => ({
    value: scale,
    label: t(`scales.${scale}`),
    description: t(`scale_descriptions.${scale}`),
    icon: SCALE_ICONS[scale],
    baseColorClass: SCALE_BASE_COLOR,
    hoverColorClass: SCALE_HOVER_COLOR[scale],
    activeColorClass: `${SCALE_ACTIVE_COLOR[scale]} text-white`,
  }));

  return (
    <FormSelectGrid
      value={value}
      onChange={onChange}
      options={scaleOptions}
      label="" // Label is handled by parent component
      columns={2}
    />
  );
}
