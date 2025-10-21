import { useTranslation } from "react-i18next";

import { RACE_DOMAINS } from "../constants/domains";

interface PropsDomainPicker {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  // Light mode colors
  if (className.includes("text-blue-600")) return "rgb(37 99 235)";
  if (className.includes("text-amber-600")) return "rgb(217 119 6)";
  if (className.includes("text-cyan-600")) return "rgb(8 145 178)";
  if (className.includes("text-orange-600")) return "rgb(234 88 12)";
  if (className.includes("text-teal-600")) return "rgb(13 148 136)";
  if (className.includes("text-purple-600")) return "rgb(147 51 234)";
  if (className.includes("text-violet-600")) return "rgb(124 58 237)";
  if (className.includes("text-indigo-600")) return "rgb(79 70 229)";

  return "currentColor";
};

// Helper to get dark mode color
const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-amber-400")) return "rgb(251 191 36)";
  if (className.includes("dark:text-cyan-400")) return "rgb(34 211 238)";
  if (className.includes("dark:text-orange-400")) return "rgb(251 146 60)";
  if (className.includes("dark:text-teal-400")) return "rgb(45 212 191)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";
  if (className.includes("dark:text-violet-400")) return "rgb(167 139 250)";
  if (className.includes("dark:text-indigo-400")) return "rgb(129 140 248)";

  return "currentColor";
};

// Helper function to get background color from Tailwind class
const getBgColorFromTailwindClass = (className: string): string => {
  // Light mode backgrounds
  if (className.includes("bg-blue-50")) return "rgb(239 246 255)";
  if (className.includes("bg-amber-50")) return "rgb(255 251 235)";
  if (className.includes("bg-cyan-50")) return "rgb(236 254 255)";
  if (className.includes("bg-orange-50")) return "rgb(255 247 237)";
  if (className.includes("bg-teal-50")) return "rgb(240 253 250)";
  if (className.includes("bg-purple-50")) return "rgb(250 245 255)";
  if (className.includes("bg-violet-50")) return "rgb(245 243 255)";
  if (className.includes("bg-indigo-50")) return "rgb(238 242 255)";
  return "transparent";
};

const getDarkBgColorFromTailwindClass = (className: string): string => {
  // Dark mode backgrounds
  if (className.includes("dark:bg-blue-950")) return "rgb(23 37 84)";
  if (className.includes("dark:bg-amber-950")) return "rgb(69 26 3)";
  if (className.includes("dark:bg-cyan-950")) return "rgb(8 51 68)";
  if (className.includes("dark:bg-orange-950")) return "rgb(67 20 7)";
  if (className.includes("dark:bg-teal-950")) return "rgb(4 47 46)";
  if (className.includes("dark:bg-purple-950")) return "rgb(59 7 100)";
  if (className.includes("dark:bg-violet-950")) return "rgb(46 16 101)";
  if (className.includes("dark:bg-indigo-950")) return "rgb(30 27 75)";
  return "transparent";
};

// Helper function to get border color from Tailwind class
const getBorderColorFromTailwindClass = (className: string): string => {
  // Light mode borders
  if (className.includes("border-blue-200")) return "rgb(191 219 254)";
  if (className.includes("border-amber-200")) return "rgb(253 230 138)";
  if (className.includes("border-cyan-200")) return "rgb(165 243 252)";
  if (className.includes("border-orange-200")) return "rgb(254 215 170)";
  if (className.includes("border-teal-200")) return "rgb(153 246 228)";
  if (className.includes("border-purple-200")) return "rgb(233 213 255)";
  if (className.includes("border-violet-200")) return "rgb(221 214 254)";
  if (className.includes("border-indigo-200")) return "rgb(199 210 254)";
  return "currentColor";
};

const getDarkBorderColorFromTailwindClass = (className: string): string => {
  // Dark mode borders
  if (className.includes("dark:border-blue-800")) return "rgb(30 64 175)";
  if (className.includes("dark:border-amber-800")) return "rgb(146 64 14)";
  if (className.includes("dark:border-cyan-800")) return "rgb(21 94 117)";
  if (className.includes("dark:border-orange-800")) return "rgb(154 52 18)";
  if (className.includes("dark:border-teal-800")) return "rgb(17 94 89)";
  if (className.includes("dark:border-purple-800")) return "rgb(107 33 168)";
  if (className.includes("dark:border-violet-800")) return "rgb(91 33 182)";
  if (className.includes("dark:border-indigo-800")) return "rgb(55 48 163)";
  return "currentColor";
};

export function DomainPicker({ value, onChange, error }: PropsDomainPicker) {
  const { t } = useTranslation("create-race");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {t("modal.domain")} *
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {RACE_DOMAINS.map((domain) => {
          const Icon = domain.icon;
          const isSelected = value.includes(domain.value);
          const lightTextColor = getColorFromTailwindClass(domain.color);
          const darkTextColor = getDarkColorFromTailwindClass(domain.color);
          const lightBgColor = getBgColorFromTailwindClass(domain.bgColor);
          const darkBgColor = getDarkBgColorFromTailwindClass(domain.bgColor);
          const lightBorderColor = getBorderColorFromTailwindClass(domain.borderColor);
          const darkBorderColor = getDarkBorderColorFromTailwindClass(domain.borderColor);

          return (
            <button
              key={domain.value}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onChange(value.filter((v) => v !== domain.value));
                } else {
                  onChange([...value, domain.value]);
                }
              }}
              data-domain={domain.value}
              className={`domain-picker-item flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${domain.bgColor} ${domain.borderColor} scale-105 shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${isSelected ? domain.color : "text-muted-foreground"}`}
              />
              <span
                className={`text-xs font-medium text-center ${isSelected ? domain.color : "text-muted-foreground"}`}
              >
                {domain.label}
              </span>
              {!isSelected && (
                <style>{`
                  .domain-picker-item[data-domain="${domain.value}"]:hover {
                    background-color: ${lightBgColor} !important;
                    border-color: ${lightBorderColor} !important;
                    cursor: pointer;
                  }
                  .domain-picker-item[data-domain="${domain.value}"]:hover svg,
                  .domain-picker-item[data-domain="${domain.value}"]:hover span {
                    color: ${lightTextColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .domain-picker-item[data-domain="${domain.value}"]:hover {
                      background-color: ${darkBgColor} !important;
                      border-color: ${darkBorderColor} !important;
                    }
                    .domain-picker-item[data-domain="${domain.value}"]:hover svg,
                    .domain-picker-item[data-domain="${domain.value}"]:hover span {
                      color: ${darkTextColor} !important;
                    }
                  }
                  .dark .domain-picker-item[data-domain="${domain.value}"]:hover {
                    background-color: ${darkBgColor} !important;
                    border-color: ${darkBorderColor} !important;
                  }
                  .dark .domain-picker-item[data-domain="${domain.value}"]:hover svg,
                  .dark .domain-picker-item[data-domain="${domain.value}"]:hover span {
                    color: ${darkTextColor} !important;
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
