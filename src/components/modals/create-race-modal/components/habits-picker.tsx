import { useTranslation } from "react-i18next";

import { RACE_HABITS } from "../constants/habits";

interface PropsHabitsPicker {
  value: string;
  onChange: (value: string) => void;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  // Light mode colors
  if (className.includes("text-indigo-600")) return "rgb(79 70 229)";
  if (className.includes("text-yellow-600")) return "rgb(202 138 4)";
  if (className.includes("text-orange-600")) return "rgb(234 88 12)";
  if (className.includes("text-blue-600")) return "rgb(37 99 235)";
  if (className.includes("text-slate-600")) return "rgb(71 85 105)";
  if (className.includes("text-amber-600")) return "rgb(217 119 6)";
  if (className.includes("text-purple-600")) return "rgb(147 51 234)";
  if (className.includes("text-red-600")) return "rgb(220 38 38)";

  return "currentColor";
};

// Helper to get dark mode color
const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-indigo-400")) return "rgb(129 140 248)";
  if (className.includes("dark:text-yellow-400")) return "rgb(250 204 21)";
  if (className.includes("dark:text-orange-400")) return "rgb(251 146 60)";
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-slate-400")) return "rgb(148 163 184)";
  if (className.includes("dark:text-amber-400")) return "rgb(251 191 36)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";
  if (className.includes("dark:text-red-400")) return "rgb(248 113 113)";

  return "currentColor";
};

// Helper function to get background color from Tailwind class
const getBgColorFromTailwindClass = (className: string): string => {
  // Light mode backgrounds
  if (className.includes("bg-indigo-50")) return "rgb(238 242 255)";
  if (className.includes("bg-yellow-50")) return "rgb(254 252 232)";
  if (className.includes("bg-orange-50")) return "rgb(255 247 237)";
  if (className.includes("bg-blue-50")) return "rgb(239 246 255)";
  if (className.includes("bg-slate-50")) return "rgb(248 250 252)";
  if (className.includes("bg-amber-50")) return "rgb(255 251 235)";
  if (className.includes("bg-purple-50")) return "rgb(250 245 255)";
  if (className.includes("bg-red-50")) return "rgb(254 242 242)";
  return "transparent";
};

const getDarkBgColorFromTailwindClass = (className: string): string => {
  // Dark mode backgrounds
  if (className.includes("dark:bg-indigo-950")) return "rgb(30 27 75)";
  if (className.includes("dark:bg-yellow-950")) return "rgb(66 32 6)";
  if (className.includes("dark:bg-orange-950")) return "rgb(67 20 7)";
  if (className.includes("dark:bg-blue-950")) return "rgb(23 37 84)";
  if (className.includes("dark:bg-slate-950")) return "rgb(2 6 23)";
  if (className.includes("dark:bg-amber-950")) return "rgb(69 26 3)";
  if (className.includes("dark:bg-purple-950")) return "rgb(59 7 100)";
  if (className.includes("dark:bg-red-950")) return "rgb(69 10 10)";
  return "transparent";
};

// Helper function to get border color from Tailwind class
const getBorderColorFromTailwindClass = (className: string): string => {
  // Light mode borders
  if (className.includes("border-indigo-200")) return "rgb(199 210 254)";
  if (className.includes("border-yellow-200")) return "rgb(254 240 138)";
  if (className.includes("border-orange-200")) return "rgb(254 215 170)";
  if (className.includes("border-blue-200")) return "rgb(191 219 254)";
  if (className.includes("border-slate-200")) return "rgb(226 232 240)";
  if (className.includes("border-amber-200")) return "rgb(253 230 138)";
  if (className.includes("border-purple-200")) return "rgb(233 213 255)";
  if (className.includes("border-red-200")) return "rgb(254 202 202)";
  return "currentColor";
};

const getDarkBorderColorFromTailwindClass = (className: string): string => {
  // Dark mode borders
  if (className.includes("dark:border-indigo-800")) return "rgb(55 48 163)";
  if (className.includes("dark:border-yellow-800")) return "rgb(133 77 14)";
  if (className.includes("dark:border-orange-800")) return "rgb(154 52 18)";
  if (className.includes("dark:border-blue-800")) return "rgb(30 64 175)";
  if (className.includes("dark:border-slate-800")) return "rgb(30 41 59)";
  if (className.includes("dark:border-amber-800")) return "rgb(146 64 14)";
  if (className.includes("dark:border-purple-800")) return "rgb(107 33 168)";
  if (className.includes("dark:border-red-800")) return "rgb(153 27 27)";
  return "currentColor";
};

export function HabitsPicker({ value, onChange }: PropsHabitsPicker) {
  const { t } = useTranslation("create-race");

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t("modal.habits")}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {RACE_HABITS.map((habit) => {
          const Icon = habit.icon;
          const isSelected = value === habit.value;
          const lightTextColor = getColorFromTailwindClass(habit.color);
          const darkTextColor = getDarkColorFromTailwindClass(habit.color);
          const lightBgColor = getBgColorFromTailwindClass(habit.bgColor);
          const darkBgColor = getDarkBgColorFromTailwindClass(habit.bgColor);
          const lightBorderColor = getBorderColorFromTailwindClass(habit.borderColor);
          const darkBorderColor = getDarkBorderColorFromTailwindClass(habit.borderColor);

          return (
            <button
              key={habit.value}
              type="button"
              onClick={() => onChange(habit.value)}
              data-habit={habit.value}
              className={`habits-picker-item flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${habit.bgColor} ${habit.borderColor} scale-105 shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`w-5 h-5 ${isSelected ? habit.color : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${isSelected ? habit.color : "text-muted-foreground"}`}
                >
                  {habit.label}
                </span>
              </div>
              <p
                className={`text-xs ${isSelected ? "text-foreground/80" : "text-muted-foreground/70"}`}
              >
                {habit.description}
              </p>
              {!isSelected && (
                <style>{`
                  .habits-picker-item[data-habit="${habit.value}"]:hover {
                    background-color: ${lightBgColor} !important;
                    border-color: ${lightBorderColor} !important;
                    cursor: pointer;
                  }
                  .habits-picker-item[data-habit="${habit.value}"]:hover svg,
                  .habits-picker-item[data-habit="${habit.value}"]:hover span {
                    color: ${lightTextColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .habits-picker-item[data-habit="${habit.value}"]:hover {
                      background-color: ${darkBgColor} !important;
                      border-color: ${darkBorderColor} !important;
                    }
                    .habits-picker-item[data-habit="${habit.value}"]:hover svg,
                    .habits-picker-item[data-habit="${habit.value}"]:hover span {
                      color: ${darkTextColor} !important;
                    }
                  }
                  .dark .habits-picker-item[data-habit="${habit.value}"]:hover {
                    background-color: ${darkBgColor} !important;
                    border-color: ${darkBorderColor} !important;
                  }
                  .dark .habits-picker-item[data-habit="${habit.value}"]:hover svg,
                  .dark .habits-picker-item[data-habit="${habit.value}"]:hover span {
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
