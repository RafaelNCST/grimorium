import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FACTION_INFLUENCE_CONSTANT } from "../constants/faction-influence";

interface PropsInfluencePicker {
  value: string;
  onChange: (value: string) => void;
}

export function InfluencePicker({ value, onChange }: PropsInfluencePicker) {
  const { t } = useTranslation("create-faction");
  const [hoveredInfluence, setHoveredInfluence] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("modal.influence")}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {FACTION_INFLUENCE_CONSTANT.map((influence) => {
          const Icon = influence.icon;
          const isSelected = value === influence.value;
          const isHovered = hoveredInfluence === influence.value;
          const isActive = isSelected || isHovered;
          return (
            <button
              key={influence.value}
              type="button"
              onClick={() => onChange(influence.value)}
              onMouseEnter={() => setHoveredInfluence(influence.value)}
              onMouseLeave={() => setHoveredInfluence(null)}
              className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all text-left ${
                isActive
                  ? `${influence.bgColorClass} shadow-lg`
                  : "border-muted hover:border-muted-foreground/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? influence.colorClass
                    : "text-muted-foreground"
                }`}
              />
              <div className="space-y-1">
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? influence.colorClass
                      : "text-muted-foreground"
                  }`}
                >
                  {t(influence.translationKey)}
                </span>
                <p
                  className="text-xs leading-tight text-muted-foreground"
                >
                  {t(influence.descriptionKey)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
