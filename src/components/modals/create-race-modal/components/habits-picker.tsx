import { useTranslation } from "react-i18next";

import { FormSelectGrid } from "@/components/forms/FormSelectGrid";

import { getHabitsOptions } from "../constants/habits";

interface PropsHabitsPicker {
  value: string;
  onChange: (value: string) => void;
  hideLabel?: boolean;
}

export function HabitsPicker({
  value,
  onChange,
  hideLabel,
}: PropsHabitsPicker) {
  const { t } = useTranslation("create-race");
  const habitsOptions = getHabitsOptions(t);

  return (
    <FormSelectGrid
      value={value}
      onChange={onChange}
      label={hideLabel ? "" : t("modal.habits")}
      options={habitsOptions}
      columns={4}
    />
  );
}
