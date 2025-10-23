import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FACTION_REPUTATION_CONSTANT } from "../constants/faction-reputation";

interface PropsReputationPicker {
  value: string;
  onChange: (value: string) => void;
}

export function ReputationPicker({ value, onChange }: PropsReputationPicker) {
  const { t } = useTranslation("create-faction");
  const [hoveredReputation, setHoveredReputation] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {t("modal.public_reputation")}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {FACTION_REPUTATION_CONSTANT.map((reputation) => {
          const Icon = reputation.icon;
          const isSelected = value === reputation.value;
          const isHovered = hoveredReputation === reputation.value;
          const isActive = isSelected || isHovered;
          return (
            <button
              key={reputation.value}
              type="button"
              onClick={() => onChange(reputation.value)}
              onMouseEnter={() => setHoveredReputation(reputation.value)}
              onMouseLeave={() => setHoveredReputation(null)}
              className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all text-left ${
                isActive
                  ? `${reputation.bgColorClass} shadow-lg`
                  : "border-muted hover:border-muted-foreground/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? reputation.colorClass
                    : "text-muted-foreground"
                }`}
              />
              <div className="space-y-1">
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? reputation.colorClass
                      : "text-muted-foreground"
                  }`}
                >
                  {t(reputation.translationKey)}
                </span>
                <p
                  className="text-xs leading-tight text-muted-foreground"
                >
                  {t(reputation.descriptionKey)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
