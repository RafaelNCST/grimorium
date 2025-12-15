import { useTranslation } from "react-i18next";

import { FormSelectGrid } from "@/components/forms/FormSelectGrid";

import { getMoralTendencyOptions } from "../constants/moral-tendencies";

interface PropsMoralTendencyPicker {
  value: string;
  onChange: (value: string) => void;
  hideLabel?: boolean;
}

export function MoralTendencyPicker({
  value,
  onChange,
  hideLabel,
}: PropsMoralTendencyPicker) {
  const { t } = useTranslation("create-race");
  const moralTendencyOptions = getMoralTendencyOptions(t);

  return (
    <FormSelectGrid
      value={value}
      onChange={onChange}
      label={hideLabel ? "" : t("modal.moral_tendency")}
      options={moralTendencyOptions}
      columns={3}
    />
  );
}
