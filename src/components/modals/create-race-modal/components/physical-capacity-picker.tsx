import { useTranslation } from "react-i18next";

import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { InfoAlert } from "@/components/ui/info-alert";

import { getRacePhysicalCapacities } from "../constants/physical-capacities";

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
  const physicalCapacityOptions = getRacePhysicalCapacities(t);

  return (
    <div className="space-y-3">
      <FormSelectGrid
        value={value}
        onChange={onChange}
        label={hideLabel ? "" : t("modal.physical_capacity")}
        alertText={t("modal.physical_capacity_description")}
        options={physicalCapacityOptions}
        columns={3}
      />
    </div>
  );
}
