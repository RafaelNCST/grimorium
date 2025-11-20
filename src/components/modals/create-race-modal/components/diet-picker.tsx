import { useTranslation } from "react-i18next";

import { FormInput } from "@/components/forms/FormInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";

import { DIET_OPTIONS } from "../constants/diets";

interface PropsDietPicker {
  value: string;
  onChange: (value: string) => void;
  elementalDiet: string;
  onElementalDietChange: (value: string) => void;
  elementalDietError?: string;
}

export function DietPicker({
  value,
  onChange,
  elementalDiet,
  onElementalDietChange,
  elementalDietError,
}: PropsDietPicker) {
  const { t } = useTranslation("create-race");
  const isOther = value === "other";

  return (
    <FormSelectGrid
      value={value}
      onChange={onChange}
      label={t("modal.diet")}
      options={DIET_OPTIONS}
      columns={3}
      showExpandedContent={isOther}
      expandedContent={
        <div className="space-y-2">
          <FormInput
            value={elementalDiet}
            onChange={(e) => onElementalDietChange(e.target.value)}
            label={t("modal.elemental_diet_type")}
            placeholder={t("modal.elemental_diet_placeholder")}
            maxLength={50}
            showCharCount
            error={elementalDietError ? t(elementalDietError) : undefined}
            labelClassName="text-sm font-medium text-primary"
          />
        </div>
      }
    />
  );
}
