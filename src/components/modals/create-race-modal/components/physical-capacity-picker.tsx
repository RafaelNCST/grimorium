import { useTranslation } from "react-i18next";

import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { InfoAlert } from "@/components/ui/info-alert";

import { PHYSICAL_CAPACITY_OPTIONS } from "../constants/physical-capacities";

interface PropsPhysicalCapacityPicker {
  value: string;
  onChange: (value: string) => void;
  hideLabel?: boolean;
}

export function PhysicalCapacityPicker({
  value,
  onChange,
  hideLabel,
}: PropsPhysicalCapacityPicker) {
  const { t } = useTranslation("create-race");

  return (
    <div className="space-y-3">
      <InfoAlert>{t("modal.physical_capacity_description")}</InfoAlert>

      <FormSelectGrid
        value={value}
        onChange={onChange}
        label={hideLabel ? "" : t("modal.physical_capacity")}
        options={PHYSICAL_CAPACITY_OPTIONS}
        columns={3}
      />
    </div>
  );
}
