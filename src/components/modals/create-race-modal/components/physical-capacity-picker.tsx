import { useTranslation } from "react-i18next";

import { RACE_PHYSICAL_CAPACITIES } from "../constants/physical-capacities";

interface PropsPhysicalCapacityPicker {
  value: string;
  onChange: (value: string) => void;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  // Light mode colors
  if (className.includes("text-red-600")) return "rgb(220 38 38)";
  if (className.includes("text-orange-600")) return "rgb(234 88 12)";
  if (className.includes("text-blue-600")) return "rgb(37 99 235)";
  if (className.includes("text-green-600")) return "rgb(22 163 74)";
  if (className.includes("text-purple-600")) return "rgb(147 51 234)";

  return "currentColor";
};

// Helper to get dark mode color
const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-red-400")) return "rgb(248 113 113)";
  if (className.includes("dark:text-orange-400")) return "rgb(251 146 60)";
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-green-400")) return "rgb(74 222 128)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";

  return "currentColor";
};

// Helper function to get background color from Tailwind class
const getBgColorFromTailwindClass = (className: string): string => {
  // Light mode backgrounds
  if (className.includes("bg-red-50")) return "rgb(254 242 242)";
  if (className.includes("bg-orange-50")) return "rgb(255 247 237)";
  if (className.includes("bg-blue-50")) return "rgb(239 246 255)";
  if (className.includes("bg-green-50")) return "rgb(240 253 244)";
  if (className.includes("bg-purple-50")) return "rgb(250 245 255)";
  return "transparent";
};

const getDarkBgColorFromTailwindClass = (className: string): string => {
  // Dark mode backgrounds
  if (className.includes("dark:bg-red-950")) return "rgb(69 10 10)";
  if (className.includes("dark:bg-orange-950")) return "rgb(67 20 7)";
  if (className.includes("dark:bg-blue-950")) return "rgb(23 37 84)";
  if (className.includes("dark:bg-green-950")) return "rgb(5 46 22)";
  if (className.includes("dark:bg-purple-950")) return "rgb(59 7 100)";
  return "transparent";
};

// Helper function to get border color from Tailwind class
const getBorderColorFromTailwindClass = (className: string): string => {
  // Light mode borders
  if (className.includes("border-red-200")) return "rgb(254 202 202)";
  if (className.includes("border-orange-200")) return "rgb(254 215 170)";
  if (className.includes("border-blue-200")) return "rgb(191 219 254)";
  if (className.includes("border-green-200")) return "rgb(187 247 208)";
  if (className.includes("border-purple-200")) return "rgb(233 213 255)";
  return "currentColor";
};

const getDarkBorderColorFromTailwindClass = (className: string): string => {
  // Dark mode borders
  if (className.includes("dark:border-red-800")) return "rgb(153 27 27)";
  if (className.includes("dark:border-orange-800")) return "rgb(154 52 18)";
  if (className.includes("dark:border-blue-800")) return "rgb(30 64 175)";
  if (className.includes("dark:border-green-800")) return "rgb(22 101 52)";
  if (className.includes("dark:border-purple-800")) return "rgb(107 33 168)";
  return "currentColor";
};

export function PhysicalCapacityPicker({
  value,
  onChange,
}: PropsPhysicalCapacityPicker) {
  const { t } = useTranslation("create-race");

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t("modal.physical_capacity")}
      </label>

      <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md border border-muted">
        {t("modal.physical_capacity_description")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {RACE_PHYSICAL_CAPACITIES.map((capacity) => {
          const Icon = capacity.icon;
          const isSelected = value === capacity.value;
          const lightTextColor = getColorFromTailwindClass(capacity.color);
          const darkTextColor = getDarkColorFromTailwindClass(capacity.color);
          const lightBgColor = getBgColorFromTailwindClass(capacity.bgColor);
          const darkBgColor = getDarkBgColorFromTailwindClass(capacity.bgColor);
          const lightBorderColor = getBorderColorFromTailwindClass(
            capacity.borderColor
          );
          const darkBorderColor = getDarkBorderColorFromTailwindClass(
            capacity.borderColor
          );

          return (
            <button
              key={capacity.value}
              type="button"
              onClick={() => onChange(capacity.value)}
              data-capacity={capacity.value}
              className={`physical-capacity-picker-item flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${capacity.bgColor} ${capacity.borderColor} shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`w-5 h-5 ${isSelected ? capacity.color : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${isSelected ? capacity.color : "text-muted-foreground"}`}
                >
                  {capacity.label}
                </span>
              </div>
              <p
                className={`text-xs ${isSelected ? "text-foreground/80" : "text-muted-foreground/70"}`}
              >
                {capacity.description}
              </p>
              {!isSelected && (
                <style>{`
                  .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover {
                    background-color: ${lightBgColor} !important;
                    border-color: ${lightBorderColor} !important;
                    cursor: pointer;
                  }
                  .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover svg,
                  .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover span {
                    color: ${lightTextColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover {
                      background-color: ${darkBgColor} !important;
                      border-color: ${darkBorderColor} !important;
                    }
                    .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover svg,
                    .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover span {
                      color: ${darkTextColor} !important;
                    }
                  }
                  .dark .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover {
                    background-color: ${darkBgColor} !important;
                    border-color: ${darkBorderColor} !important;
                  }
                  .dark .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover svg,
                  .dark .physical-capacity-picker-item[data-capacity="${capacity.value}"]:hover span {
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
