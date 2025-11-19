import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";

import type { IconType } from "react-icons";

/**
 * Option configuration for simple picker
 */
export interface SimplePickerOption<T = string> {
  /**
   * Unique value for this option
   */
  value: T;
  /**
   * Translation key for label text
   */
  translationKey: string;
  /**
   * Icon component from react-icons or lucide-react
   */
  icon: IconType;
  /**
   * Base color class when not selected (e.g., "text-muted-foreground")
   */
  color: string;
  /**
   * Active color class when selected (e.g., "text-green-600 dark:text-green-400")
   * Supports light and dark mode variants
   */
  activeColor: string;
}

interface FormSimplePickerProps<T = string> {
  /**
   * Selected value
   */
  value: T | null | undefined;
  /**
   * Callback when value changes
   */
  onChange: (value: T) => void;
  /**
   * Available options
   */
  options: SimplePickerOption<T>[];
  /**
   * Label for the field
   */
  label: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Optional error message
   */
  error?: string;
  /**
   * Translation namespace to use (default: "translation")
   */
  translationNamespace?: string;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string | undefined): string => {
  // Guard against undefined or null className
  if (!className) return "currentColor";

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
  if (className.includes("text-cyan-600")) return "rgb(8 145 178)";
  if (className.includes("text-pink-600")) return "rgb(219 39 119)";
  if (className.includes("text-indigo-600")) return "rgb(79 70 229)";
  if (className.includes("text-emerald-600")) return "rgb(5 150 105)";
  if (className.includes("text-lime-600")) return "rgb(101 163 13)";
  if (className.includes("text-amber-600")) return "rgb(217 119 6)";
  if (className.includes("text-teal-600")) return "rgb(13 148 136)";
  if (className.includes("text-sky-600")) return "rgb(2 132 199)";

  return "currentColor";
};

// Helper to get dark mode color
const getDarkColorFromTailwindClass = (className: string | undefined): string => {
  // Guard against undefined or null className
  if (!className) return "currentColor";

  if (className.includes("dark:text-green-400")) return "rgb(74 222 128)";
  if (className.includes("dark:text-slate-300")) return "rgb(203 213 225)";
  if (className.includes("dark:text-red-400")) return "rgb(248 113 113)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";
  if (className.includes("dark:text-orange-400")) return "rgb(251 146 60)";
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-yellow-400")) return "rgb(250 204 21)";
  if (className.includes("dark:text-cyan-400")) return "rgb(34 211 238)";
  if (className.includes("dark:text-pink-400")) return "rgb(244 114 182)";
  if (className.includes("dark:text-indigo-400")) return "rgb(129 140 248)";
  if (className.includes("dark:text-emerald-400")) return "rgb(52 211 153)";
  if (className.includes("dark:text-lime-400")) return "rgb(163 230 53)";
  if (className.includes("dark:text-amber-400")) return "rgb(251 191 36)";
  if (className.includes("dark:text-teal-400")) return "rgb(45 212 191)";
  if (className.includes("dark:text-sky-400")) return "rgb(56 189 248)";

  return "currentColor";
};

/**
 * FormSimplePicker - Lightweight picker component with icon and label in vertical layout
 *
 * A simplified version of StatusPicker made generic and reusable.
 * Perfect for visual selection with hover effects (like item status, priority levels, etc.)
 *
 * Features:
 * - Icon on top, label below
 * - Hover effects with color transitions
 * - Scale effects on hover/selection
 * - Customizable colors via Tailwind classes
 * - Support for light/dark mode color variants
 * - Translation support via react-i18next
 *
 * @example Basic usage (Item Status)
 * ```tsx
 * import { GiBroadsword, GiBrokenShield } from "react-icons/gi";
 *
 * const STATUS_OPTIONS = [
 *   {
 *     value: "complete",
 *     translationKey: "status.complete",
 *     icon: GiBroadsword,
 *     color: "text-muted-foreground",
 *     activeColor: "text-green-600 dark:text-green-400",
 *   },
 *   {
 *     value: "destroyed",
 *     translationKey: "status.destroyed",
 *     icon: GiBrokenShield,
 *     color: "text-muted-foreground",
 *     activeColor: "text-red-600 dark:text-red-400",
 *   },
 * ];
 *
 * <FormSimplePicker
 *   value={status}
 *   onChange={setStatus}
 *   label="Item Status"
 *   required
 *   options={STATUS_OPTIONS}
 *   translationNamespace="create-item"
 * />
 * ```
 *
 * @example Priority Picker
 * ```tsx
 * import { AlertCircle, TrendingUp, Zap } from "lucide-react";
 *
 * const PRIORITY_OPTIONS = [
 *   {
 *     value: "low",
 *     translationKey: "priority.low",
 *     icon: AlertCircle,
 *     color: "text-muted-foreground",
 *     activeColor: "text-blue-600 dark:text-blue-400",
 *   },
 *   {
 *     value: "medium",
 *     translationKey: "priority.medium",
 *     icon: TrendingUp,
 *     color: "text-muted-foreground",
 *     activeColor: "text-yellow-600 dark:text-yellow-400",
 *   },
 *   {
 *     value: "high",
 *     translationKey: "priority.high",
 *     icon: Zap,
 *     color: "text-muted-foreground",
 *     activeColor: "text-red-600 dark:text-red-400",
 *   },
 * ];
 *
 * <FormSimplePicker
 *   value={priority}
 *   onChange={setPriority}
 *   label="Priority Level"
 *   options={PRIORITY_OPTIONS}
 * />
 * ```
 */
export function FormSimplePicker<T extends string = string>({
  value,
  onChange,
  options,
  label,
  required = false,
  error,
  translationNamespace = "translation",
}: FormSimplePickerProps<T>) {
  const { t } = useTranslation(translationNamespace);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-primary">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="flex justify-between items-start gap-2">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          const lightColor = getColorFromTailwindClass(option.activeColor);
          const darkColor = getDarkColorFromTailwindClass(option.activeColor);

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              data-picker-value={option.value}
              className={`simple-picker-item flex flex-col items-center gap-1.5 group transition-all hover:scale-105 ${
                isSelected ? "scale-110 is-selected" : "scale-100"
              }`}
            >
              <Icon
                className={`w-7 h-7 transition-colors ${
                  isSelected ? option.activeColor : option.color
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected ? option.activeColor : option.color
                }`}
              >
                {t(option.translationKey)}
              </span>
              {!isSelected && (
                <style>{`
                  .simple-picker-item[data-picker-value="${option.value}"]:hover svg,
                  .simple-picker-item[data-picker-value="${option.value}"]:hover span {
                    color: ${lightColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .simple-picker-item[data-picker-value="${option.value}"]:hover svg,
                    .simple-picker-item[data-picker-value="${option.value}"]:hover span {
                      color: ${darkColor} !important;
                    }
                  }
                  .dark .simple-picker-item[data-picker-value="${option.value}"]:hover svg,
                  .dark .simple-picker-item[data-picker-value="${option.value}"]:hover span {
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
