import {
  MapPin,
  Mountain,
  Globe,
  Sparkles,
  Infinity,
  Layers,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  FormSelectGrid,
  GridSelectOption,
} from "@/components/forms/FormSelectGrid";

import { RegionScale } from "../types/region-types";

interface ScalePickerProps {
  value: RegionScale | null | undefined;
  onChange: (scale: RegionScale) => void;
}

const SCALE_ICONS: Record<
  RegionScale,
  React.ComponentType<{ className?: string }>
> = {
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

  const scaleColorMap: Record<RegionScale, { bg: string; border: string }> = {
    local: { bg: "emerald-500/10", border: "emerald-500/20" },
    continental: { bg: "blue-500/10", border: "blue-500/20" },
    planetary: { bg: "violet-500/10", border: "violet-500/20" },
    galactic: { bg: "purple-500/10", border: "purple-500/20" },
    universal: { bg: "amber-500/10", border: "amber-500/20" },
    multiversal: { bg: "pink-500/10", border: "pink-500/20" },
  };

  const scaleOptions: GridSelectOption<RegionScale>[] = SCALES.map((scale) => ({
    value: scale,
    label: t(`scales.${scale}`),
    description: t(`scale_descriptions.${scale}`),
    icon: SCALE_ICONS[scale],
    backgroundColor: scaleColorMap[scale].bg,
    borderColor: scaleColorMap[scale].border,
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
