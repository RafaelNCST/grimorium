import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { ARC_STATUSES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-statuses-constant";
import type { PlotArcStatus } from "@/types/plot-types";

interface PropsStatusSelector {
  value: PlotArcStatus | "";
  onChange: (value: PlotArcStatus) => void;
  error?: string;
  hasCurrentArc?: boolean;
}

export function StatusSelector({
  value,
  onChange,
  error,
  hasCurrentArc = false,
}: PropsStatusSelector) {
  const { t } = useTranslation("create-plot-arc");

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{t("modal.arc_status")} *</Label>

      <div className="flex gap-4">
        {ARC_STATUSES_CONSTANT.map((status) => {
          const Icon = status.icon;
          const isSelected = value === status.value;
          const isDisabled =
            status.value === "atual" && hasCurrentArc && !isSelected;

          // Define cores específicas para cada status
          let activeColor = "";
          let hoverColor = "";

          if (status.value === "finalizado") {
            activeColor = "text-emerald-600";
            hoverColor = "hover:text-emerald-600";
          } else if (status.value === "atual") {
            activeColor = "text-blue-600";
            hoverColor = "hover:text-blue-600";
          } else if (status.value === "planejamento") {
            activeColor = "text-amber-600";
            hoverColor = "hover:text-amber-600";
          }

          return (
            <div key={status.value} className="flex-1 relative group">
              <button
                type="button"
                onClick={() => !isDisabled && onChange(status.value)}
                disabled={isDisabled}
                className={`
                  w-full flex items-center justify-center gap-3 py-3 transition-all rounded-lg
                  ${isSelected ? activeColor + " scale-105" : "text-muted-foreground"}
                  ${!isSelected && !isDisabled ? hoverColor + " hover:scale-105" : ""}
                  ${isDisabled ? "opacity-30 relative" : "cursor-pointer"}
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="text-base font-medium">
                  {t(status.translationKey)}
                </span>
              </button>

              {isDisabled && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg" />
                  <p className="relative text-xs text-center px-2 font-medium text-muted-foreground">
                    {t("modal.current_arc_warning")}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
