import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { RACE_COMMUNICATIONS } from "../constants/communications";

interface PropsCommunicationPicker {
  values: string[];
  onChange: (values: string[]) => void;
  otherCommunication: string;
  onOtherCommunicationChange: (value: string) => void;
  otherCommunicationError?: string;
}

// Helper function to get the CSS color from Tailwind class
const getColorFromTailwindClass = (className: string): string => {
  if (className.includes("text-blue-600")) return "rgb(37 99 235)";
  if (className.includes("text-purple-600")) return "rgb(147 51 234)";
  if (className.includes("text-green-600")) return "rgb(22 163 74)";
  if (className.includes("text-amber-600")) return "rgb(217 119 6)";
  if (className.includes("text-violet-600")) return "rgb(124 58 237)";
  return "currentColor";
};

const getDarkColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:text-blue-400")) return "rgb(96 165 250)";
  if (className.includes("dark:text-purple-400")) return "rgb(192 132 252)";
  if (className.includes("dark:text-green-400")) return "rgb(74 222 128)";
  if (className.includes("dark:text-amber-400")) return "rgb(251 191 36)";
  if (className.includes("dark:text-violet-400")) return "rgb(167 139 250)";
  return "currentColor";
};

const getBgColorFromTailwindClass = (className: string): string => {
  if (className.includes("bg-blue-50")) return "rgb(239 246 255)";
  if (className.includes("bg-purple-50")) return "rgb(250 245 255)";
  if (className.includes("bg-green-50")) return "rgb(240 253 244)";
  if (className.includes("bg-amber-50")) return "rgb(255 251 235)";
  if (className.includes("bg-violet-50")) return "rgb(245 243 255)";
  return "transparent";
};

const getDarkBgColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:bg-blue-950")) return "rgb(23 37 84)";
  if (className.includes("dark:bg-purple-950")) return "rgb(59 7 100)";
  if (className.includes("dark:bg-green-950")) return "rgb(5 46 22)";
  if (className.includes("dark:bg-amber-950")) return "rgb(69 26 3)";
  if (className.includes("dark:bg-violet-950")) return "rgb(46 16 101)";
  return "transparent";
};

const getBorderColorFromTailwindClass = (className: string): string => {
  if (className.includes("border-blue-200")) return "rgb(191 219 254)";
  if (className.includes("border-purple-200")) return "rgb(233 213 255)";
  if (className.includes("border-green-200")) return "rgb(187 247 208)";
  if (className.includes("border-amber-200")) return "rgb(253 230 138)";
  if (className.includes("border-violet-200")) return "rgb(221 214 254)";
  return "currentColor";
};

const getDarkBorderColorFromTailwindClass = (className: string): string => {
  if (className.includes("dark:border-blue-800")) return "rgb(30 64 175)";
  if (className.includes("dark:border-purple-800")) return "rgb(107 33 168)";
  if (className.includes("dark:border-green-800")) return "rgb(22 101 52)";
  if (className.includes("dark:border-amber-800")) return "rgb(146 64 14)";
  if (className.includes("dark:border-violet-800")) return "rgb(91 33 182)";
  return "currentColor";
};

export function CommunicationPicker({
  values,
  onChange,
  otherCommunication,
  onOtherCommunicationChange,
  otherCommunicationError
}: PropsCommunicationPicker) {
  const { t } = useTranslation("create-race");
  const isOther = values?.includes("other") ?? false;

  const toggleCommunication = (value: string) => {
    if (values?.includes(value)) {
      onChange((values || []).filter((v) => v !== value));
    } else {
      onChange([...(values || []), value]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t("modal.communication")}
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RACE_COMMUNICATIONS.map((comm) => {
          const Icon = comm.icon;
          const isSelected = values?.includes(comm.value) ?? false;
          const lightTextColor = getColorFromTailwindClass(comm.color);
          const darkTextColor = getDarkColorFromTailwindClass(comm.color);
          const lightBgColor = getBgColorFromTailwindClass(comm.bgColor);
          const darkBgColor = getDarkBgColorFromTailwindClass(comm.bgColor);
          const lightBorderColor = getBorderColorFromTailwindClass(comm.borderColor);
          const darkBorderColor = getDarkBorderColorFromTailwindClass(comm.borderColor);
          const isOtherOption = comm.value === 'other';

          return (
            <button
              key={comm.value}
              type="button"
              onClick={() => toggleCommunication(comm.value)}
              data-communication={comm.value}
              className={`communication-picker-item flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isOtherOption ? 'col-span-2 md:col-span-4' : ''
              } ${
                isSelected
                  ? `${comm.bgColor} ${comm.borderColor} shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`w-5 h-5 ${isSelected ? comm.color : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${isSelected ? comm.color : "text-muted-foreground"}`}
                >
                  {comm.label}
                </span>
              </div>
              <p
                className={`text-xs ${isSelected ? "text-foreground/80" : "text-muted-foreground/70"}`}
              >
                {comm.description}
              </p>
              {!isSelected && (
                <style>{`
                  .communication-picker-item[data-communication="${comm.value}"]:hover {
                    background-color: ${lightBgColor} !important;
                    border-color: ${lightBorderColor} !important;
                    cursor: pointer;
                  }
                  .communication-picker-item[data-communication="${comm.value}"]:hover svg,
                  .communication-picker-item[data-communication="${comm.value}"]:hover span {
                    color: ${lightTextColor} !important;
                  }
                  @media (prefers-color-scheme: dark) {
                    .communication-picker-item[data-communication="${comm.value}"]:hover {
                      background-color: ${darkBgColor} !important;
                      border-color: ${darkBorderColor} !important;
                    }
                    .communication-picker-item[data-communication="${comm.value}"]:hover svg,
                    .communication-picker-item[data-communication="${comm.value}"]:hover span {
                      color: ${darkTextColor} !important;
                    }
                  }
                  .dark .communication-picker-item[data-communication="${comm.value}"]:hover {
                    background-color: ${darkBgColor} !important;
                    border-color: ${darkBorderColor} !important;
                  }
                  .dark .communication-picker-item[data-communication="${comm.value}"]:hover svg,
                  .dark .communication-picker-item[data-communication="${comm.value}"]:hover span {
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
            {t("modal.other_communication_description")} *
          </label>
          <Textarea
            value={otherCommunication}
            onChange={(e) => onOtherCommunicationChange(e.target.value)}
            placeholder={t("modal.other_communication_placeholder")}
            maxLength={300}
            rows={3}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{otherCommunication?.length || 0}/300</span>
          </div>
          {otherCommunicationError && (
            <p className="text-sm text-destructive">{t(otherCommunicationError)}</p>
          )}
        </div>
      )}

      {(values || []).length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {(values || []).map((value) => {
            const comm = RACE_COMMUNICATIONS.find((c) => c.value === value);
            if (!comm) return null;
            const Icon = comm.icon;
            return (
              <Badge
                key={value}
                className={`${comm.bgColor} ${comm.borderColor} border flex items-center gap-1.5`}
              >
                <Icon className={`w-3 h-3 ${comm.color}`} />
                <span className={comm.color}>{comm.label}</span>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
