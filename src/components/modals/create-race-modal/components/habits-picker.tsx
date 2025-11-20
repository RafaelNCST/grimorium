import { useTranslation } from "react-i18next";

import { FormSelectGrid } from "@/components/forms/FormSelectGrid";

import { HABITS_OPTIONS } from "../constants/habits";

interface PropsHabitsPicker {
  value: string;
  onChange: (value: string) => void;
  hideLabel?: boolean;
}

export function HabitsPicker({ value, onChange, hideLabel }: PropsHabitsPicker) {
  const { t } = useTranslation("create-race");

  return (
    <FormSelectGrid
      value={value}
      onChange={onChange}
      label={hideLabel ? "" : t("modal.habits")}
      options={HABITS_OPTIONS}
      columns={4}
    />
  );
}
