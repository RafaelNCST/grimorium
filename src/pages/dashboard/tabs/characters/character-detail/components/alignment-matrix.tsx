import { Target } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CHARACTER_ALIGNMENTS_CONSTANT } from "@/components/modals/create-character-modal/constants/character-alignments";

interface AlignmentMatrixProps {
  value?: string;
  onChange?: (value: string) => void;
  isEditable?: boolean;
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

const ALIGNMENT_HOVER: Record<string, string> = {
  "lawful-good":
    "hover:bg-gradient-to-br hover:from-green-500/20 hover:to-blue-500/20 hover:border-green-500/40",
  "neutral-good":
    "hover:bg-gradient-to-br hover:from-green-500/20 hover:to-gray-500/20 hover:border-green-500/40",
  "chaotic-good":
    "hover:bg-gradient-to-br hover:from-green-500/20 hover:to-red-500/20 hover:border-green-500/40",
  "lawful-neutral":
    "hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-gray-500/20 hover:border-gray-500/40",
  "true-neutral":
    "hover:bg-gradient-to-br hover:from-gray-500/20 hover:to-gray-500/20 hover:border-gray-500/40",
  "chaotic-neutral":
    "hover:bg-gradient-to-br hover:from-red-500/20 hover:to-gray-500/20 hover:border-gray-500/40",
  "lawful-evil":
    "hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-purple-500/20 hover:border-purple-500/40",
  "neutral-evil":
    "hover:bg-gradient-to-br hover:from-gray-500/20 hover:to-purple-500/20 hover:border-purple-500/40",
  "chaotic-evil":
    "hover:bg-gradient-to-br hover:from-red-500/20 hover:to-purple-500/20 hover:border-red-500/40",
};

const ALIGNMENT_RING: Record<string, string> = {
  "lawful-good": "ring-4 ring-green-500/50",
  "neutral-good": "ring-4 ring-green-500/50",
  "chaotic-good": "ring-4 ring-green-500/50",
  "lawful-neutral": "ring-4 ring-gray-500/50",
  "true-neutral": "ring-4 ring-gray-500/50",
  "chaotic-neutral": "ring-4 ring-gray-500/50",
  "lawful-evil": "ring-4 ring-purple-500/50",
  "neutral-evil": "ring-4 ring-purple-500/50",
  "chaotic-evil": "ring-4 ring-red-500/50",
};

export function AlignmentMatrix({
  value = "",
  onChange,
  isEditable = false,
}: AlignmentMatrixProps) {
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

  // If not editable, show only selected alignment or empty state
  if (!isEditable) {
    if (!value) {
      return (
        <div className="border-2 border-muted-foreground/30 bg-muted/20 p-6 rounded-lg text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Target className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Nenhum alinhamento escolhido
              </p>
              <p className="text-xs text-muted-foreground">
                Use o modo de edição para selecionar um alinhamento
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Show only selected alignment in view mode
    const selectedAlignment = CHARACTER_ALIGNMENTS_CONSTANT.find(
      (a) => a.value === value
    );

    if (!selectedAlignment) return null;

    const Icon = selectedAlignment.icon;
    const gradientClass = ALIGNMENT_GRADIENTS[selectedAlignment.value] || "";

    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 p-6 rounded-lg border-2 ${gradientClass} shadow-md`}
      >
        <Icon className="w-12 h-12" />
        <span className="text-lg font-semibold text-center">
          {t(selectedAlignment.translationKey)}
        </span>
        <p className="text-sm text-center text-muted-foreground max-w-md">
          {t(selectedAlignment.descriptionKey)}
        </p>
      </div>
    );
  }

  // Edit mode - show all alignments
  return (
    <div className="grid grid-cols-3 gap-3">
      {alignmentOrder.map((alignmentValue) => {
        const alignment = CHARACTER_ALIGNMENTS_CONSTANT.find(
          (a) => a.value === alignmentValue
        );
        if (!alignment) return null;

        const Icon = alignment.icon;
        const isSelected = value === alignment.value;
        const gradientClass = ALIGNMENT_GRADIENTS[alignment.value] || "";
        const hoverClass = ALIGNMENT_HOVER[alignment.value] || "";
        const ringClass = ALIGNMENT_RING[alignment.value] || "";

        return (
          <button
            key={alignment.value}
            type="button"
            onClick={() => {
              if (isEditable && onChange) {
                onChange(isSelected ? "" : alignment.value);
              }
            }}
            disabled={!isEditable}
            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-lg border-2 transition-all min-h-[140px] ${
              isSelected
                ? `${gradientClass} ${ringClass}`
                : `bg-card border-border ${hoverClass}`
            } ${isEditable ? "cursor-pointer" : "cursor-default"}`}
          >
            <Icon
              className={`w-7 h-7 ${isSelected ? "" : "text-muted-foreground"}`}
            />
            <span
              className={`text-xs font-medium text-center leading-tight ${isSelected ? "" : "text-muted-foreground"}`}
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
