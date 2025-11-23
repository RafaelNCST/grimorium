import { CheckCircle2, Clock, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  FormSimpleGrid,
  type SimpleGridSelectOption,
} from "@/components/forms/FormSimpleGrid";
import { InfoAlert } from "@/components/ui/info-alert";
import { Label } from "@/components/ui/label";
import type { PlotArcStatus } from "@/types/plot-types";

interface PropsStatusSelector {
  value: PlotArcStatus | "";
  onChange: (value: PlotArcStatus | "") => void;
  hasCurrentArc: boolean;
  error?: string;
}

export function StatusSelector({
  value,
  onChange,
  hasCurrentArc,
  error,
}: PropsStatusSelector) {
  const { t } = useTranslation("create-plot-arc");

  const STATUS_OPTIONS: SimpleGridSelectOption<PlotArcStatus>[] = [
    {
      value: "planejamento",
      label: t("statuses.planning"),
      icon: Pencil,
      backgroundColor: "amber-500/10",
      borderColor: "amber-500/30",
    },
    {
      value: "atual",
      label: t("statuses.current"),
      icon: Clock,
      backgroundColor: "blue-500/10",
      borderColor: "blue-500/30",
    },
    {
      value: "finalizado",
      label: t("statuses.finished"),
      icon: CheckCircle2,
      backgroundColor: "green-500/10",
      borderColor: "green-500/30",
    },
  ];

  // Filter out "atual" option if there's already a current arc
  const availableOptions = STATUS_OPTIONS.map((option) => ({
    ...option,
    disabled: option.value === "atual" && hasCurrentArc,
  }));

  const handleChange = (newValue: PlotArcStatus | PlotArcStatus[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    // Don't allow selecting "atual" if there's already a current arc
    if (val === "atual" && hasCurrentArc) return;
    onChange(val || "");
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-primary">
        {t("modal.arc_status")} <span className="text-destructive">*</span>
      </Label>

      <InfoAlert>{t("modal.current_arc_warning")}</InfoAlert>

      <FormSimpleGrid<PlotArcStatus>
        value={value || null}
        onChange={handleChange}
        options={availableOptions}
        label=""
        columns={3}
        error={error}
      />
    </div>
  );
}
