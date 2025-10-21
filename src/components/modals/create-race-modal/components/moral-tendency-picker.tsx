import { useTranslation } from "react-i18next";

import { RACE_MORAL_TENDENCIES } from "../constants/moral-tendencies";

interface PropsMoralTendencyPicker {
  value: string;
  onChange: (value: string) => void;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  // Light mode colors
  if (className.includes("text-red-600")) return "rgb(220 38 38)";
  if (className.includes("text-slate-600")) return "rgb(71 85 105)";
  if (className.includes("text-blue-600")) return "rgb(37 99 235)";
  if (className.includes("text-orange-600")) return "rgb(234 88 12)";
  if (className.includes("text-amber-600")) return "rgb(217 119 6)";
  if (className.includes("text-purple-600")) return "rgb(147 51 234)";

  return "currentColor";
};

// Helper to get dark mode color
const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-red-400")) return "rgb(248 113 113)";
  if (className.includes("dark:text-slate-400")) return "rgb(148 163 184)";
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-orange-400")) return "rgb(251 146 60)";
  if (className.includes("dark:text-amber-400")) return "rgb(251 191 36)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";

  return "currentColor";
};

// Helper function to get background color from Tailwind class
const getBgColorFromTailwindClass = (className: string): string => {
  // Light mode backgrounds
  if (className.includes("bg-red-50")) return "rgb(254 242 242)";
  if (className.includes("bg-slate-50")) return "rgb(248 250 252)";
  if (className.includes("bg-blue-50")) return "rgb(239 246 255)";
  if (className.includes("bg-orange-50")) return "rgb(255 247 237)";
  if (className.includes("bg-amber-50")) return "rgb(255 251 235)";
  if (className.includes("bg-purple-50")) return "rgb(250 245 255)";
  return "transparent";
};

const getDarkBgColorFromTailwindClass = (className: string): string => {
  // Dark mode backgrounds
  if (className.includes("dark:bg-red-950")) return "rgb(69 10 10)";
  if (className.includes("dark:bg-slate-950")) return "rgb(2 6 23)";
  if (className.includes("dark:bg-blue-950")) return "rgb(23 37 84)";
  if (className.includes("dark:bg-orange-950")) return "rgb(67 20 7)";
  if (className.includes("dark:bg-amber-950")) return "rgb(69 26 3)";
  if (className.includes("dark:bg-purple-950")) return "rgb(59 7 100)";
  return "transparent";
};

// Helper function to get border color from Tailwind class
const getBorderColorFromTailwindClass = (className: string): string => {
  // Light mode borders
  if (className.includes("border-red-200")) return "rgb(254 202 202)";
  if (className.includes("border-slate-200")) return "rgb(226 232 240)";
  if (className.includes("border-blue-200")) return "rgb(191 219 254)";
  if (className.includes("border-orange-200")) return "rgb(254 215 170)";
  if (className.includes("border-amber-200")) return "rgb(253 230 138)";
  if (className.includes("border-purple-200")) return "rgb(233 213 255)";
  return "currentColor";
};

const getDarkBorderColorFromTailwindClass = (className: string): string => {
  // Dark mode borders
  if (className.includes("dark:border-red-800")) return "rgb(153 27 27)";
  if (className.includes("dark:border-slate-800")) return "rgb(30 41 59)";
  if (className.includes("dark:border-blue-800")) return "rgb(30 64 175)";
  if (className.includes("dark:border-orange-800")) return "rgb(154 52 18)";
  if (className.includes("dark:border-amber-800")) return "rgb(146 64 14)";
  if (className.includes("dark:border-purple-800")) return "rgb(107 33 168)";
  return "currentColor";
};

export function MoralTendencyPicker({ value, onChange }: PropsMoralTendencyPicker) {
  const { t } = useTranslation("create-race");

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t("modal.moral_tendency")}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {RACE_MORAL_TENDENCIES.map((tendency) => {
          const Icon = tendency.icon;
          const isSelected = value === tendency.value;
          const lightTextColor = getColorFromTailwindClass(tendency.color);
          const darkTextColor = getDarkColorFromTailwindClass(tendency.color);
          const lightBgColor = getBgColorFromTailwindClass(tendency.bgColor);
          const darkBgColor = getDarkBgColorFromTailwindClass(tendency.bgColor);
          const lightBorderColor = getBorderColorFromTailwindClass(tendency.borderColor);
          const darkBorderColor = getDarkBorderColorFromTailwindClass(tendency.borderColor);

          return (
            <button
              key={tendency.value}
              type="button"
              onClick={() => onChange(tendency.value)}
              data-tendency={tendency.value}
              className={`moral-tendency-picker-item flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${tendency.bgColor} ${tendency.borderColor} scale-105 shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`w-5 h-5 ${isSelected ? tendency.color : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${isSelected ? tendency.color : "text-muted-foreground"}`}
                >
                  {tendency.label}
                </span>
              </div>
              <p
                className={`text-xs ${isSelected ? "text-foreground/80" : "text-muted-foreground/70"}`}
              >
                {tendency.description}
              </p>
              {!isSelected && (
                <style>{`
                  .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover {
                    background-color: ${lightBgColor} !important;
                    border-color: ${lightBorderColor} !important;
                    cursor: pointer;
                  }
                  .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover svg,
                  .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover span {
                    color: ${lightTextColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover {
                      background-color: ${darkBgColor} !important;
                      border-color: ${darkBorderColor} !important;
                    }
                    .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover svg,
                    .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover span {
                      color: ${darkTextColor} !important;
                    }
                  }
                  .dark .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover {
                    background-color: ${darkBgColor} !important;
                    border-color: ${darkBorderColor} !important;
                  }
                  .dark .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover svg,
                  .dark .moral-tendency-picker-item[data-tendency="${tendency.value}"]:hover span {
                    color: ${darkTextColor} !important;
                  }
                `}</style>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
