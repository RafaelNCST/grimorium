import { useTranslation } from "react-i18next";

import {
  FormSimpleGrid,
  SimpleGridSelectOption,
} from "@/components/forms/FormSimpleGrid";

import { RACE_DOMAINS, RaceDomain } from "../constants/domains";

interface PropsDomainPicker {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  hideLabel?: boolean;
}

// Map para converter as cores do formato atual para o formato do FormSimpleGrid
const colorMap: Record<string, { bg: string; border: string }> = {
  "text-blue-600 dark:text-blue-400": {
    bg: "blue-500/10",
    border: "blue-500/30",
  },
  "text-amber-600 dark:text-amber-400": {
    bg: "amber-500/10",
    border: "amber-500/30",
  },
  "text-cyan-600 dark:text-cyan-400": {
    bg: "cyan-500/10",
    border: "cyan-500/30",
  },
  "text-orange-600 dark:text-orange-400": {
    bg: "orange-500/10",
    border: "orange-500/30",
  },
  "text-teal-600 dark:text-teal-400": {
    bg: "teal-500/10",
    border: "teal-500/30",
  },
  "text-purple-600 dark:text-purple-400": {
    bg: "purple-500/10",
    border: "purple-500/30",
  },
  "text-violet-600 dark:text-violet-400": {
    bg: "violet-500/10",
    border: "violet-500/30",
  },
  "text-indigo-600 dark:text-indigo-400": {
    bg: "indigo-500/10",
    border: "indigo-500/30",
  },
};

// Map para converter entre português (DomainType - usado no DB) e inglês (RaceDomain - usado no picker)
const domainPtToEn: Record<string, RaceDomain> = {
  Aquático: "aquatic",
  Terrestre: "terrestrial",
  Aéreo: "aerial",
  Subterrâneo: "underground",
  Elevado: "elevated",
  Dimensional: "dimensional",
  Espiritual: "spiritual",
  Cósmico: "cosmic",
};

const domainEnToPt: Record<RaceDomain, string> = {
  aquatic: "Aquático",
  terrestrial: "Terrestre",
  aerial: "Aéreo",
  underground: "Subterrâneo",
  elevated: "Elevado",
  dimensional: "Dimensional",
  spiritual: "Espiritual",
  cosmic: "Cósmico",
};

export function DomainPicker({
  value,
  onChange,
  error,
  hideLabel,
}: PropsDomainPicker) {
  const { t } = useTranslation("create-race");

  // Converter valores do DB (português) para o picker (inglês)
  const pickerValue = value.map((v) => domainPtToEn[v] || v) as RaceDomain[];

  // Converter RACE_DOMAINS para o formato SimpleGridSelectOption
  const options: SimpleGridSelectOption<RaceDomain>[] = RACE_DOMAINS.map(
    (domain) => {
      const colors = colorMap[domain.color] || {
        bg: "gray-500/10",
        border: "gray-500/30",
      };
      return {
        value: domain.value,
        label: domain.label,
        icon: domain.icon,
        backgroundColor: colors.bg,
        borderColor: colors.border,
      };
    }
  );

  // Converter valores do picker (inglês) de volta para o DB (português)
  const handleChange = (newValue: RaceDomain[]) => {
    const dbValue = newValue.map((v) => domainEnToPt[v] || v);
    onChange(dbValue);
  };

  return (
    <FormSimpleGrid
      value={pickerValue}
      onChange={handleChange}
      options={options}
      label={hideLabel ? "" : t("modal.domain")}
      required
      error={error ? t(error) : undefined}
      columns={4}
      multi
    />
  );
}
