import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";

import { ITEM_STATUSES_CONSTANT } from "../constants/item-statuses";

interface PropsStatusPicker {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  // Extract the base color from classes like "text-green-600 dark:text-green-400"
  // In light mode, we use the first color (e.g., green-600)
  // In dark mode, the dark: variant will apply automatically via the Tailwind class

  // For light mode
  if (className.includes("text-green-600")) return "rgb(22 163 74)";
  if (className.includes("text-slate-700")) return "rgb(51 65 85)";
  if (className.includes("text-red-600")) return "rgb(220 38 38)";
  if (className.includes("text-purple-600")) return "rgb(147 51 234)";
  if (className.includes("text-orange-600")) return "rgb(234 88 12)";
  if (className.includes("text-blue-600")) return "rgb(37 99 235)";
  if (className.includes("text-yellow-600")) return "rgb(202 138 4)";

  return "currentColor";
};

// Helper to get dark mode color
const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-green-400")) return "rgb(74 222 128)";
  if (className.includes("dark:text-slate-300")) return "rgb(203 213 225)";
  if (className.includes("dark:text-red-400")) return "rgb(248 113 113)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";
  if (className.includes("dark:text-orange-400")) return "rgb(251 146 60)";
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-yellow-400")) return "rgb(250 204 21)";

  return "currentColor";
};

export function StatusPicker({ value, onChange, error }: PropsStatusPicker) {
  const { t } = useTranslation("create-item");

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{t("modal.item_status")} *</Label>
      <div className="flex justify-between items-start gap-2">
        {ITEM_STATUSES_CONSTANT.map((status) => {
          const Icon = status.icon;
          const isSelected = value === status.value;
          const lightColor = getColorFromTailwindClass(status.activeColor);
          const darkColor = getDarkColorFromTailwindClass(status.activeColor);

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
                    color: ${lightColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .status-picker-item[data-status="${status.value}"]:hover svg,
                    .status-picker-item[data-status="${status.value}"]:hover span {
                      color: ${darkColor} !important;
                    }
                  }
                  .dark .status-picker-item[data-status="${status.value}"]:hover svg,
                  .dark .status-picker-item[data-status="${status.value}"]:hover span {
                    color: ${darkColor} !important;
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
