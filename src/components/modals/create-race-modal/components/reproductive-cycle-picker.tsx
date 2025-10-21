import { useTranslation } from "react-i18next";

import { Textarea } from "@/components/ui/textarea";

import { RACE_REPRODUCTIVE_CYCLES } from "../constants/reproductive-cycles";

interface PropsReproductiveCyclePicker {
  value: string;
  onChange: (value: string) => void;
  otherCycleDescription: string;
  onOtherCycleDescriptionChange: (value: string) => void;
  otherCycleError?: string;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  // Light mode colors
  if (className.includes("text-pink-600")) return "rgb(219 39 119)";
  if (className.includes("text-green-600")) return "rgb(22 163 74)";
  if (className.includes("text-purple-600")) return "rgb(147 51 234)";
  if (className.includes("text-teal-600")) return "rgb(13 148 136)";
  if (className.includes("text-blue-600")) return "rgb(37 99 235)";
  if (className.includes("text-violet-600")) return "rgb(124 58 237)";
  if (className.includes("text-slate-600")) return "rgb(71 85 105)";
  if (className.includes("text-indigo-600")) return "rgb(79 70 229)";
  if (className.includes("text-amber-600")) return "rgb(217 119 6)";
  if (className.includes("text-cyan-600")) return "rgb(8 145 178)";

  return "currentColor";
};

// Helper to get dark mode color
const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-pink-400")) return "rgb(244 114 182)";
  if (className.includes("dark:text-green-400")) return "rgb(74 222 128)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";
  if (className.includes("dark:text-teal-400")) return "rgb(45 212 191)";
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-violet-400")) return "rgb(167 139 250)";
  if (className.includes("dark:text-slate-400")) return "rgb(148 163 184)";
  if (className.includes("dark:text-indigo-400")) return "rgb(129 140 248)";
  if (className.includes("dark:text-amber-400")) return "rgb(251 191 36)";
  if (className.includes("dark:text-cyan-400")) return "rgb(34 211 238)";

  return "currentColor";
};

// Helper function to get background color from Tailwind class
const getBgColorFromTailwindClass = (className: string): string => {
  // Light mode backgrounds
  if (className.includes("bg-pink-50")) return "rgb(253 242 248)";
  if (className.includes("bg-green-50")) return "rgb(240 253 244)";
  if (className.includes("bg-purple-50")) return "rgb(250 245 255)";
  if (className.includes("bg-teal-50")) return "rgb(240 253 250)";
  if (className.includes("bg-blue-50")) return "rgb(239 246 255)";
  if (className.includes("bg-violet-50")) return "rgb(245 243 255)";
  if (className.includes("bg-slate-50")) return "rgb(248 250 252)";
  if (className.includes("bg-indigo-50")) return "rgb(238 242 255)";
  if (className.includes("bg-amber-50")) return "rgb(255 251 235)";
  if (className.includes("bg-cyan-50")) return "rgb(236 254 255)";
  return "transparent";
};

const getDarkBgColorFromTailwindClass = (className: string): string => {
  // Dark mode backgrounds
  if (className.includes("dark:bg-pink-950")) return "rgb(80 7 36)";
  if (className.includes("dark:bg-green-950")) return "rgb(5 46 22)";
  if (className.includes("dark:bg-purple-950")) return "rgb(59 7 100)";
  if (className.includes("dark:bg-teal-950")) return "rgb(4 47 46)";
  if (className.includes("dark:bg-blue-950")) return "rgb(23 37 84)";
  if (className.includes("dark:bg-violet-950")) return "rgb(46 16 101)";
  if (className.includes("dark:bg-slate-950")) return "rgb(2 6 23)";
  if (className.includes("dark:bg-indigo-950")) return "rgb(30 27 75)";
  if (className.includes("dark:bg-amber-950")) return "rgb(69 26 3)";
  if (className.includes("dark:bg-cyan-950")) return "rgb(8 51 68)";
  return "transparent";
};

// Helper function to get border color from Tailwind class
const getBorderColorFromTailwindClass = (className: string): string => {
  // Light mode borders
  if (className.includes("border-pink-200")) return "rgb(251 207 232)";
  if (className.includes("border-green-200")) return "rgb(187 247 208)";
  if (className.includes("border-purple-200")) return "rgb(233 213 255)";
  if (className.includes("border-teal-200")) return "rgb(153 246 228)";
  if (className.includes("border-blue-200")) return "rgb(191 219 254)";
  if (className.includes("border-violet-200")) return "rgb(221 214 254)";
  if (className.includes("border-slate-200")) return "rgb(226 232 240)";
  if (className.includes("border-indigo-200")) return "rgb(199 210 254)";
  if (className.includes("border-amber-200")) return "rgb(253 230 138)";
  if (className.includes("border-cyan-200")) return "rgb(165 243 252)";
  return "currentColor";
};

const getDarkBorderColorFromTailwindClass = (className: string): string => {
  // Dark mode borders
  if (className.includes("dark:border-pink-800")) return "rgb(157 23 77)";
  if (className.includes("dark:border-green-800")) return "rgb(22 101 52)";
  if (className.includes("dark:border-purple-800")) return "rgb(107 33 168)";
  if (className.includes("dark:border-teal-800")) return "rgb(17 94 89)";
  if (className.includes("dark:border-blue-800")) return "rgb(30 64 175)";
  if (className.includes("dark:border-violet-800")) return "rgb(91 33 182)";
  if (className.includes("dark:border-slate-800")) return "rgb(30 41 59)";
  if (className.includes("dark:border-indigo-800")) return "rgb(55 48 163)";
  if (className.includes("dark:border-amber-800")) return "rgb(146 64 14)";
  if (className.includes("dark:border-cyan-800")) return "rgb(21 94 117)";
  return "currentColor";
};

export function ReproductiveCyclePicker({
  value,
  onChange,
  otherCycleDescription,
  onOtherCycleDescriptionChange,
  otherCycleError
}: PropsReproductiveCyclePicker) {
  const { t } = useTranslation("create-race");
  const isOther = value === "other";

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t("modal.reproductive_cycle")}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {RACE_REPRODUCTIVE_CYCLES.map((cycle) => {
          const Icon = cycle.icon;
          const isSelected = value === cycle.value;
          const lightTextColor = getColorFromTailwindClass(cycle.color);
          const darkTextColor = getDarkColorFromTailwindClass(cycle.color);
          const lightBgColor = getBgColorFromTailwindClass(cycle.bgColor);
          const darkBgColor = getDarkBgColorFromTailwindClass(cycle.bgColor);
          const lightBorderColor = getBorderColorFromTailwindClass(cycle.borderColor);
          const darkBorderColor = getDarkBorderColorFromTailwindClass(cycle.borderColor);

          return (
            <button
              key={cycle.value}
              type="button"
              onClick={() => onChange(cycle.value)}
              data-cycle={cycle.value}
              className={`reproductive-cycle-picker-item flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${cycle.bgColor} ${cycle.borderColor} scale-105 shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`w-5 h-5 ${isSelected ? cycle.color : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${isSelected ? cycle.color : "text-muted-foreground"}`}
                >
                  {cycle.label}
                </span>
              </div>
              <p
                className={`text-xs ${isSelected ? "text-foreground/80" : "text-muted-foreground/70"}`}
              >
                {cycle.description}
              </p>
              {!isSelected && (
                <style>{`
                  .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover {
                    background-color: ${lightBgColor} !important;
                    border-color: ${lightBorderColor} !important;
                    cursor: pointer;
                  }
                  .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover svg,
                  .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover span {
                    color: ${lightTextColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover {
                      background-color: ${darkBgColor} !important;
                      border-color: ${darkBorderColor} !important;
                    }
                    .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover svg,
                    .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover span {
                      color: ${darkTextColor} !important;
                    }
                  }
                  .dark .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover {
                    background-color: ${darkBgColor} !important;
                    border-color: ${darkBorderColor} !important;
                  }
                  .dark .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover svg,
                  .dark .reproductive-cycle-picker-item[data-cycle="${cycle.value}"]:hover span {
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
            {t("modal.other_cycle_description")} *
          </label>
          <Textarea
            value={otherCycleDescription}
            onChange={(e) => onOtherCycleDescriptionChange(e.target.value)}
            placeholder={t("modal.other_cycle_placeholder")}
            maxLength={500}
            rows={4}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{otherCycleDescription?.length || 0}/500</span>
          </div>
          {otherCycleError && (
            <p className="text-sm text-destructive">{t(otherCycleError)}</p>
          )}
        </div>
      )}
    </div>
  );
}
