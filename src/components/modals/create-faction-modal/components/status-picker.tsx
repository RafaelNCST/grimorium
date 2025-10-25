import { useState } from "react";

import { useTranslation } from "react-i18next";

import { FACTION_STATUS_CONSTANT } from "../constants/faction-status";

interface PropsStatusPicker {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function StatusPicker({ value, onChange, error }: PropsStatusPicker) {
  const { t } = useTranslation("create-faction");
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("modal.status")} *</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {FACTION_STATUS_CONSTANT.map((status) => {
          const Icon = status.icon;
          const isSelected = value === status.value;
          const isHovered = hoveredStatus === status.value;
          return (
            <button
              key={status.value}
              type="button"
              onClick={() => onChange(status.value)}
              onMouseEnter={() => setHoveredStatus(status.value)}
              onMouseLeave={() => setHoveredStatus(null)}
              className={`flex flex-col items-center justify-center gap-2 p-2 transition-all ${
                isSelected || isHovered ? "scale-110" : ""
              }`}
            >
              <Icon
                className={`w-8 h-8 transition-colors ${
                  isSelected || isHovered
                    ? status.colorClass
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-medium text-center transition-colors ${
                  isSelected || isHovered
                    ? status.colorClass
                    : "text-muted-foreground"
                }`}
              >
                {t(status.translationKey)}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}
