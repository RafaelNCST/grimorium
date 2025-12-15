import { useTranslation } from "react-i18next";

import {
  FormSimpleGrid,
  type SimpleGridSelectOption,
} from "@/components/forms/FormSimpleGrid";
import { InfoAlert } from "@/components/ui/info-alert";
import { Label } from "@/components/ui/label";
import { ARC_STATUSES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-statuses-constant";
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

  const STATUS_OPTIONS: SimpleGridSelectOption<PlotArcStatus>[] =
    ARC_STATUSES_CONSTANT.filter((status) => status.value !== "finished") // Exclude finished status from creation
      .map((status) => ({
        value: status.value,
        label: t(`statuses.${status.value}`),
        icon: status.icon,
        backgroundColor:
          status.value === "current" ? "blue-500/10" : "amber-500/10",
        borderColor:
          status.value === "current" ? "blue-500/30" : "amber-500/30",
      }));

  // Filter out "current" option if there's already a current arc
  const availableOptions = STATUS_OPTIONS.map((option) => ({
    ...option,
    disabled: option.value === "current" && hasCurrentArc,
  }));

  const handleChange = (newValue: PlotArcStatus | PlotArcStatus[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    // Don't allow selecting "current" if there's already a current arc
    if (val === "current" && hasCurrentArc) return;
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
        columns={2}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
