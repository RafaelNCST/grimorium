import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { ARC_SIZES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-sizes-constant";
import type { PlotArcSize } from "@/types/plot-types";

interface PropsSizeSelector {
  value: PlotArcSize | "";
  onChange: (value: PlotArcSize) => void;
  error?: string;
}

export function SizeSelector({ value, onChange, error }: PropsSizeSelector) {
  const { t } = useTranslation("create-plot-arc");

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">{t("modal.arc_size")} *</Label>
        <p className="text-xs text-muted-foreground mt-1">
          {t("modal.arc_size_intro")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ARC_SIZES_CONSTANT.map((size) => {
          const Icon = size.icon;
          const isSelected = value === size.value;

          return (
            <button
              key={size.value}
              type="button"
              onClick={() => onChange(size.value)}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left
                ${isSelected ? `${size.activeColor} text-white` : size.color}
                ${!isSelected ? `${size.hoverColor} hover:text-white` : ""}
              `}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {t(size.translationKey)}
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    {t(size.descriptionKey)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
