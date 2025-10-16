import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";

import { ITEM_STATUSES_CONSTANT } from "../constants/item-statuses";

interface PropsStatusPicker {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function StatusPicker({ value, onChange, error }: PropsStatusPicker) {
  const { t } = useTranslation("create-item");

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{t("modal.item_status")} *</Label>
      <div className="flex justify-between items-start gap-2">
        {ITEM_STATUSES_CONSTANT.map((status) => {
          const Icon = status.icon;
          const isSelected = value === status.value;

          // Map colors
          const hoverColor = status.activeColor.includes("green")
            ? "rgb(22 163 74)"
            : status.activeColor.includes("slate")
              ? "rgb(51 65 85)"
              : status.activeColor.includes("red")
                ? "rgb(220 38 38)"
                : status.activeColor.includes("purple")
                  ? "rgb(147 51 234)"
                  : status.activeColor.includes("orange")
                    ? "rgb(234 88 12)"
                    : status.activeColor.includes("blue")
                      ? "rgb(37 99 235)"
                      : status.activeColor.includes("yellow")
                        ? "rgb(202 138 4)"
                        : "currentColor";

          return (
            <button
              key={status.value}
              type="button"
              onClick={() => onChange(status.value)}
              data-status={status.value}
              className={`status-picker-item flex flex-col items-center gap-1.5 group transition-all hover:scale-105 ${
                isSelected ? "scale-110 is-selected" : "scale-100"
              }`}
            >
              <Icon
                className={`w-7 h-7 transition-colors ${
                  isSelected ? status.activeColor : status.color
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected ? status.activeColor : status.color
                }`}
              >
                {t(status.translationKey)}
              </span>
              {!isSelected && (
                <style>{`
                  .status-picker-item[data-status="${status.value}"]:hover svg,
                  .status-picker-item[data-status="${status.value}"]:hover span {
                    color: ${hoverColor} !important;
                  }
                `}</style>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}
