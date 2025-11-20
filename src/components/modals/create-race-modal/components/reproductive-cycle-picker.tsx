import { useTranslation } from "react-i18next";

import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormTextarea } from "@/components/forms/FormTextarea";

import { REPRODUCTIVE_CYCLE_OPTIONS } from "../constants/reproductive-cycles";

interface PropsReproductiveCyclePicker {
  value: string;
  onChange: (value: string) => void;
  otherCycleDescription?: string;
  onOtherCycleDescriptionChange?: (value: string) => void;
  otherCycleError?: string;
  hideLabel?: boolean;
}

export function ReproductiveCyclePicker({
  value,
  onChange,
  otherCycleDescription = "",
  onOtherCycleDescriptionChange,
  otherCycleError,
  hideLabel,
}: PropsReproductiveCyclePicker) {
  const { t } = useTranslation("create-race");
  const isOther = value === "other";

  return (
    <FormSelectGrid
      value={value}
      onChange={onChange}
      label={hideLabel ? "" : t("modal.reproductive_cycle")}
      options={REPRODUCTIVE_CYCLE_OPTIONS}
      columns={3}
      showExpandedContent={isOther}
      expandedContent={
        <div className="space-y-2">
          <FormTextarea
            value={otherCycleDescription}
            onChange={(e) => onOtherCycleDescriptionChange?.(e.target.value)}
            label={t("modal.other_cycle_description")}
            placeholder={t("modal.other_cycle_placeholder")}
            maxLength={500}
            rows={4}
            showCharCount
            error={otherCycleError ? t(otherCycleError) : undefined}
            labelClassName="text-sm font-medium text-primary"
            className="resize-none"
          />
        </div>
      }
    />
  );
}
