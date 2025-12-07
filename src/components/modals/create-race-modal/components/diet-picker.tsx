import { useTranslation } from "react-i18next";

import { FormInput } from "@/components/forms/FormInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";

import { getRaceDiets } from "../constants/diets";

interface PropsDietPicker {
  value: string;
  onChange: (value: string) => void;
  elementalDiet: string;
  onElementalDietChange: (value: string) => void;
  elementalDietError?: string;
  hideLabel?: boolean;
}

export function DietPicker({
  value,
  onChange,
  elementalDiet,
  onElementalDietChange,
  elementalDietError,
  hideLabel,
}: PropsDietPicker) {
  const { t } = useTranslation("create-race");
  const isOther = value === "other";
  const dietOptions = getRaceDiets(t);

  return (
    <FormSelectGrid
      value={value}
      onChange={onChange}
      label={hideLabel ? "" : t("modal.diet")}
      options={dietOptions}
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
