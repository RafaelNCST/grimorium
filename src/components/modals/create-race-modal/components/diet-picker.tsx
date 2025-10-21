import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";

import { RACE_DIETS } from "../constants/diets";

interface PropsDietPicker {
  value: string;
  onChange: (value: string) => void;
  elementalDiet: string;
  onElementalDietChange: (value: string) => void;
  elementalDietError?: string;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  // Light mode colors
  if (className.includes("text-green-600")) return "rgb(22 163 74)";
  if (className.includes("text-red-600")) return "rgb(220 38 38)";
  if (className.includes("text-orange-600")) return "rgb(234 88 12)";
  if (className.includes("text-amber-600")) return "rgb(217 119 6)";
  if (className.includes("text-pink-600")) return "rgb(219 39 119)";
  if (className.includes("text-slate-600")) return "rgb(71 85 105)";
  if (className.includes("text-violet-600")) return "rgb(124 58 237)";
  if (className.includes("text-indigo-600")) return "rgb(79 70 229)";
  if (className.includes("text-cyan-600")) return "rgb(8 145 178)";

  return "currentColor";
};

// Helper to get dark mode color
const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-green-400")) return "rgb(74 222 128)";
  if (className.includes("dark:text-red-400")) return "rgb(248 113 113)";
  if (className.includes("dark:text-orange-400")) return "rgb(251 146 60)";
  if (className.includes("dark:text-amber-400")) return "rgb(251 191 36)";
  if (className.includes("dark:text-pink-400")) return "rgb(244 114 182)";
  if (className.includes("dark:text-slate-400")) return "rgb(148 163 184)";
  if (className.includes("dark:text-violet-400")) return "rgb(167 139 250)";
  if (className.includes("dark:text-indigo-400")) return "rgb(129 140 248)";
  if (className.includes("dark:text-cyan-400")) return "rgb(34 211 238)";

  return "currentColor";
};

// Helper function to get background color from Tailwind class
const getBgColorFromTailwindClass = (className: string): string => {
  // Light mode backgrounds
  if (className.includes("bg-green-50")) return "rgb(240 253 244)";
  if (className.includes("bg-red-50")) return "rgb(254 242 242)";
  if (className.includes("bg-orange-50")) return "rgb(255 247 237)";
  if (className.includes("bg-amber-50")) return "rgb(255 251 235)";
  if (className.includes("bg-pink-50")) return "rgb(253 242 248)";
  if (className.includes("bg-slate-50")) return "rgb(248 250 252)";
  if (className.includes("bg-violet-50")) return "rgb(245 243 255)";
  if (className.includes("bg-indigo-50")) return "rgb(238 242 255)";
  if (className.includes("bg-cyan-50")) return "rgb(236 254 255)";
  return "transparent";
};

const getDarkBgColorFromTailwindClass = (className: string): string => {
  // Dark mode backgrounds
  if (className.includes("dark:bg-green-950")) return "rgb(5 46 22)";
  if (className.includes("dark:bg-red-950")) return "rgb(69 10 10)";
  if (className.includes("dark:bg-orange-950")) return "rgb(67 20 7)";
  if (className.includes("dark:bg-amber-950")) return "rgb(69 26 3)";
  if (className.includes("dark:bg-pink-950")) return "rgb(80 7 36)";
  if (className.includes("dark:bg-slate-950")) return "rgb(2 6 23)";
  if (className.includes("dark:bg-violet-950")) return "rgb(46 16 101)";
  if (className.includes("dark:bg-indigo-950")) return "rgb(30 27 75)";
  if (className.includes("dark:bg-cyan-950")) return "rgb(8 51 68)";
  return "transparent";
};

// Helper function to get border color from Tailwind class
const getBorderColorFromTailwindClass = (className: string): string => {
  // Light mode borders
  if (className.includes("border-green-200")) return "rgb(187 247 208)";
  if (className.includes("border-red-200")) return "rgb(254 202 202)";
  if (className.includes("border-orange-200")) return "rgb(254 215 170)";
  if (className.includes("border-amber-200")) return "rgb(253 230 138)";
  if (className.includes("border-pink-200")) return "rgb(251 207 232)";
  if (className.includes("border-slate-200")) return "rgb(226 232 240)";
  if (className.includes("border-violet-200")) return "rgb(221 214 254)";
  if (className.includes("border-indigo-200")) return "rgb(199 210 254)";
  if (className.includes("border-cyan-200")) return "rgb(165 243 252)";
  return "currentColor";
};

const getDarkBorderColorFromTailwindClass = (className: string): string => {
  // Dark mode borders
  if (className.includes("dark:border-green-800")) return "rgb(22 101 52)";
  if (className.includes("dark:border-red-800")) return "rgb(153 27 27)";
  if (className.includes("dark:border-orange-800")) return "rgb(154 52 18)";
  if (className.includes("dark:border-amber-800")) return "rgb(146 64 14)";
  if (className.includes("dark:border-pink-800")) return "rgb(157 23 77)";
  if (className.includes("dark:border-slate-800")) return "rgb(30 41 59)";
  if (className.includes("dark:border-violet-800")) return "rgb(91 33 182)";
  if (className.includes("dark:border-indigo-800")) return "rgb(55 48 163)";
  if (className.includes("dark:border-cyan-800")) return "rgb(21 94 117)";
  return "currentColor";
};

export function DietPicker({
  value,
  onChange,
  elementalDiet,
  onElementalDietChange,
  elementalDietError
}: PropsDietPicker) {
  const { t } = useTranslation("create-race");
  const isOther = value === "other";

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t("modal.diet")}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {RACE_DIETS.map((diet) => {
          const Icon = diet.icon;
          const isSelected = value === diet.value;
          const lightTextColor = getColorFromTailwindClass(diet.color);
          const darkTextColor = getDarkColorFromTailwindClass(diet.color);
          const lightBgColor = getBgColorFromTailwindClass(diet.bgColor);
          const darkBgColor = getDarkBgColorFromTailwindClass(diet.bgColor);
          const lightBorderColor = getBorderColorFromTailwindClass(diet.borderColor);
          const darkBorderColor = getDarkBorderColorFromTailwindClass(diet.borderColor);

          return (
            <button
              key={diet.value}
              type="button"
              onClick={() => onChange(diet.value)}
              data-diet={diet.value}
              className={`diet-picker-item flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${diet.bgColor} ${diet.borderColor} scale-105 shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`w-5 h-5 ${isSelected ? diet.color : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${isSelected ? diet.color : "text-muted-foreground"}`}
                >
                  {diet.label}
                </span>
              </div>
              <p
                className={`text-xs ${isSelected ? "text-foreground/80" : "text-muted-foreground/70"}`}
              >
                {diet.description}
              </p>
              {!isSelected && (
                <style>{`
                  .diet-picker-item[data-diet="${diet.value}"]:hover {
                    background-color: ${lightBgColor} !important;
                    border-color: ${lightBorderColor} !important;
                    cursor: pointer;
                  }
                  .diet-picker-item[data-diet="${diet.value}"]:hover svg,
                  .diet-picker-item[data-diet="${diet.value}"]:hover span {
                    color: ${lightTextColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .diet-picker-item[data-diet="${diet.value}"]:hover {
                      background-color: ${darkBgColor} !important;
                      border-color: ${darkBorderColor} !important;
                    }
                    .diet-picker-item[data-diet="${diet.value}"]:hover svg,
                    .diet-picker-item[data-diet="${diet.value}"]:hover span {
                      color: ${darkTextColor} !important;
                    }
                  }
                  .dark .diet-picker-item[data-diet="${diet.value}"]:hover {
                    background-color: ${darkBgColor} !important;
                    border-color: ${darkBorderColor} !important;
                  }
                  .dark .diet-picker-item[data-diet="${diet.value}"]:hover svg,
                  .dark .diet-picker-item[data-diet="${diet.value}"]:hover span {
                    color: ${darkTextColor} !important;
                  }
                `}</style>
              )}
            </button>
          );
        })}
      </div>

      {isOther && (
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">
            {t("modal.elemental_diet_type")} *
          </label>
          <Input
            value={elementalDiet}
            onChange={(e) => onElementalDietChange(e.target.value)}
            placeholder={t("modal.elemental_diet_placeholder")}
            maxLength={50}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{elementalDiet?.length || 0}/50</span>
          </div>
          {elementalDietError && (
            <p className="text-sm text-destructive">{t(elementalDietError)}</p>
          )}
        </div>
      )}
    </div>
  );
}
