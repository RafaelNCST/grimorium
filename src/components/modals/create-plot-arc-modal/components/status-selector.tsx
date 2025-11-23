import { CheckCircle2, Clock, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

import { InfoAlert } from "@/components/ui/info-alert";
import { Label } from "@/components/ui/label";
import type { PlotArcStatus } from "@/types/plot-types";

interface PropsStatusSelector {
  value: PlotArcStatus | "";
  onChange: (value: PlotArcStatus) => void;
  hasCurrentArc: boolean;
  error?: string;
}

const STATUS_OPTIONS = [
  {
    value: "planejamento" as PlotArcStatus,
    icon: Pencil,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/20",
    activeColor:
      "bg-amber-500/20 text-amber-600 border-amber-500/30 ring-2 ring-amber-500/50",
    translationKey: "statuses.planning",
  },
  {
    value: "atual" as PlotArcStatus,
    icon: Clock,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/20",
    activeColor:
      "bg-blue-500/20 text-blue-600 border-blue-500/30 ring-2 ring-blue-500/50",
    translationKey: "statuses.current",
  },
  {
    value: "finalizado" as PlotArcStatus,
    icon: CheckCircle2,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/20",
    activeColor:
      "bg-green-500/20 text-green-600 border-green-500/30 ring-2 ring-green-500/50",
    translationKey: "statuses.finished",
  },
];

export function StatusSelector({
  value,
  onChange,
  hasCurrentArc,
  error,
}: PropsStatusSelector) {
  const { t } = useTranslation("create-plot-arc");

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-primary">
        {t("modal.arc_status")} <span className="text-destructive">*</span>
      </Label>

      <InfoAlert>{t("modal.current_arc_warning")}</InfoAlert>

      <div className="grid grid-cols-3 gap-3">
        {STATUS_OPTIONS.map((status) => {
          const Icon = status.icon;
          const isSelected = value === status.value;
          const isDisabled = status.value === "atual" && hasCurrentArc;

          return (
            <button
              key={status.value}
              type="button"
              onClick={() => !isDisabled && onChange(status.value)}
              disabled={isDisabled}
              className={`
                relative p-3 rounded-lg border-2 transition-all text-center
                ${isSelected ? status.activeColor : status.color}
                ${!isSelected && !isDisabled ? status.hoverColor : ""}
                ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {t(status.translationKey)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
