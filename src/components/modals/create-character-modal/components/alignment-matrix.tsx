import { useTranslation } from "react-i18next";

import { CHARACTER_ALIGNMENTS_CONSTANT } from "../constants/character-alignments";

interface PropsAlignmentMatrix {
  value: string;
  onChange: (value: string) => void;
}

const ALIGNMENT_GRADIENTS: Record<string, string> = {
  "lawful-good":
    "bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/40",
  "neutral-good":
    "bg-gradient-to-br from-green-500/20 to-gray-500/20 border-green-500/40",
  "chaotic-good":
    "bg-gradient-to-br from-green-500/20 to-red-500/20 border-green-500/40",
  "lawful-neutral":
    "bg-gradient-to-br from-blue-500/20 to-gray-500/20 border-gray-500/40",
  "true-neutral":
    "bg-gradient-to-br from-gray-500/20 to-gray-500/20 border-gray-500/40",
  "chaotic-neutral":
    "bg-gradient-to-br from-red-500/20 to-gray-500/20 border-gray-500/40",
  "lawful-evil":
    "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-purple-500/40",
  "neutral-evil":
    "bg-gradient-to-br from-gray-500/20 to-purple-500/20 border-purple-500/40",
  "chaotic-evil":
    "bg-gradient-to-br from-red-500/20 to-purple-500/20 border-red-500/40",
};

export function AlignmentMatrix({ value, onChange }: PropsAlignmentMatrix) {
  const { t } = useTranslation("create-character");

  const alignmentOrder = [
    "lawful-good",
    "neutral-good",
    "chaotic-good",
    "lawful-neutral",
    "true-neutral",
    "chaotic-neutral",
    "lawful-evil",
    "neutral-evil",
    "chaotic-evil",
  ];

  return (
    <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
      {alignmentOrder.map((alignmentValue) => {
        const alignment = CHARACTER_ALIGNMENTS_CONSTANT.find(
          (a) => a.value === alignmentValue
        );
        if (!alignment) return null;

        const Icon = alignment.icon;
        const isSelected = value === alignment.value;
        const gradientClass = ALIGNMENT_GRADIENTS[alignment.value] || "";

        return (
          <button
            key={alignment.value}
            type="button"
            onClick={() => onChange(isSelected ? "" : alignment.value)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all min-h-[120px] ${
              isSelected
                ? `${gradientClass} scale-105 shadow-lg`
                : "bg-muted/30 border-muted hover:bg-muted/50 hover:border-muted-foreground/30"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${isSelected ? "" : "text-muted-foreground"}`}
            />
            <span
              className={`text-[10px] font-medium text-center leading-tight ${isSelected ? "" : "text-muted-foreground"}`}
            >
              {t(alignment.translationKey)}
            </span>
            <p
              className={`text-xs text-center line-clamp-2 ${isSelected ? "text-muted-foreground" : "text-muted-foreground/70"}`}
            >
              {t(alignment.descriptionKey)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
