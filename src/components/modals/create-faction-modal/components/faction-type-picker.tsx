import { useState } from "react";

import { useTranslation } from "react-i18next";

import { FACTION_TYPES_CONSTANT } from "../constants/faction-types";

interface PropsFactionTypePicker {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function FactionTypePicker({
  value,
  onChange,
  error,
}: PropsFactionTypePicker) {
  const { t } = useTranslation("create-faction");
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("modal.faction_type")} *</label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {FACTION_TYPES_CONSTANT.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.value;
          const isHovered = hoveredType === type.value;
          const isActive = isSelected || isHovered;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              onMouseEnter={() => setHoveredType(type.value)}
              onMouseLeave={() => setHoveredType(null)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all h-32 ${
                isActive
                  ? `${type.bgColorClass} shadow-lg`
                  : "border-muted hover:border-muted-foreground/50"
              }`}
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? type.colorClass : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-medium text-center transition-colors ${
                  isActive ? type.colorClass : "text-muted-foreground"
                }`}
              >
                {t(type.translationKey)}
              </span>
              <p className="text-xs text-center text-muted-foreground">
                {t(type.descriptionKey)}
              </p>
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}
