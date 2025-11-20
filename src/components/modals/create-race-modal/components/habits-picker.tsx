import { useTranslation } from "react-i18next";

import { FormSelectGrid } from "@/components/forms/FormSelectGrid";

import { HABITS_OPTIONS } from "../constants/habits";

interface PropsHabitsPicker {
  value: string;
  onChange: (value: string) => void;
}

export function HabitsPicker({ value, onChange }: PropsHabitsPicker) {
  const { t } = useTranslation("create-race");

  return (
    <FormSelectGrid
      value={value}
      onChange={onChange}
      label={t("modal.habits")}
      options={HABITS_OPTIONS}
      columns={4}
    />
  );
}
