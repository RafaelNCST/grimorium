import { useTranslation } from "react-i18next";

import { CommunicationPicker } from "@/components/modals/create-race-modal/components/communication-picker";
import { RACE_COMMUNICATIONS } from "@/components/modals/create-race-modal/constants/communications";
import { Badge } from "@/components/ui/badge";

interface CommunicationDisplayProps {
  communications: string[];
  isEditing: boolean;
  otherCommunication: string;
  onCommunicationsChange: (communications: string[]) => void;
  onOtherCommunicationChange: (value: string) => void;
}

export function CommunicationDisplay({
  communications,
  isEditing,
  otherCommunication,
  onCommunicationsChange,
  onOtherCommunicationChange,
}: CommunicationDisplayProps) {
  const { t } = useTranslation("race-detail");

  if (isEditing) {
    return (
      <CommunicationPicker
        values={communications}
        onChange={onCommunicationsChange}
        otherCommunication={otherCommunication}
        onOtherCommunicationChange={onOtherCommunicationChange}
        hideLabel
      />
    );
  }

  if (communications.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
        <p>{t("empty_states.no_communication")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {communications.map((value) => {
        const comm = RACE_COMMUNICATIONS.find((c) => c.value === value);
        if (!comm) return null;
        const Icon = comm.icon;
        return (
          <Badge
            key={value}
            className={`${comm.bgColor} ${comm.borderColor} border flex items-center gap-1.5`}
          >
            <Icon className={`w-3 h-3 ${comm.color}`} />
            <span className={comm.color}>{comm.label}</span>
          </Badge>
        );
      })}
      {communications.includes("other") && otherCommunication && (
        <div className="w-full mt-2 p-3 rounded-lg border bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">
            {t("fields.other_communication")}:
          </p>
          <p className="text-sm">{otherCommunication}</p>
        </div>
      )}
    </div>
  );
}
