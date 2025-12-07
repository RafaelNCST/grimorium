import { useTranslation } from "react-i18next";

import {
  FormSelectGrid,
  GridSelectOption,
} from "@/components/forms/FormSelectGrid";
import { FormTextarea } from "@/components/forms/FormTextarea";

import {
  getRaceCommunications,
  RaceCommunication,
} from "../constants/communications";

interface PropsCommunicationPicker {
  values: string[];
  onChange: (values: string[]) => void;
  otherCommunication?: string;
  onOtherCommunicationChange?: (value: string) => void;
  otherCommunicationError?: string;
  hideLabel?: boolean;
}

// Map para converter as cores do formato atual para o formato do FormSelectGrid
const colorMap: Record<string, { bg: string; border: string }> = {
  "text-blue-600 dark:text-blue-400": {
    bg: "blue-500/10",
    border: "blue-500/30",
  },
  "text-purple-600 dark:text-purple-400": {
    bg: "purple-500/10",
    border: "purple-500/30",
  },
  "text-green-600 dark:text-green-400": {
    bg: "green-500/10",
    border: "green-500/30",
  },
  "text-amber-600 dark:text-amber-400": {
    bg: "amber-500/10",
    border: "amber-500/30",
  },
  "text-violet-600 dark:text-violet-400": {
    bg: "violet-500/10",
    border: "violet-500/30",
  },
};

export function CommunicationPicker({
  values,
  onChange,
  otherCommunication = "",
  onOtherCommunicationChange,
  otherCommunicationError,
  hideLabel,
}: PropsCommunicationPicker) {
  const { t } = useTranslation("create-race");

  // Verificar se "other" está selecionado
  const isOtherSelected = values?.includes("other") ?? false;

  // Converter getRaceCommunications para o formato GridSelectOption
  const raceCommunications = getRaceCommunications(t);
  const options: GridSelectOption<RaceCommunication>[] =
    raceCommunications.map((comm) => {
      const colors = colorMap[comm.color] || {
        bg: "gray-500/10",
        border: "gray-500/30",
      };
      return {
        value: comm.value,
        label: comm.label,
        description: comm.description,
        icon: comm.icon,
        backgroundColor: colors.bg,
        borderColor: colors.border,
      };
    });

  const expandedContent = (
    <FormTextarea
      value={otherCommunication}
      onChange={(e) => onOtherCommunicationChange?.(e.target.value)}
      label={t("modal.other_communication_description")}
      placeholder={t("modal.other_communication_placeholder")}
      maxLength={500}
      rows={4}
      required
      showCharCount
      error={otherCommunicationError ? t(otherCommunicationError) : undefined}
      labelClassName="text-sm font-medium text-primary"
      className="resize-none"
    />
  );

  return (
    <FormSelectGrid
      value={values as RaceCommunication[]}
      onChange={(newValue) => onChange(newValue as string[])}
      options={options}
      label={hideLabel ? "" : t("modal.communication")}
      columns={2}
      multi
      expandedContent={expandedContent}
      showExpandedContent={isOtherSelected}
    />
  );
}
