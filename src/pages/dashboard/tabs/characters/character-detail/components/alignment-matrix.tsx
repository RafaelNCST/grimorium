import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface AlignmentValue {
  moral: "good" | "neutral" | "evil";
  ethical: "lawful" | "neutral" | "chaotic";
}

interface AlignmentMatrixProps {
  value?: string;
  onChange?: (value: string) => void;
  isEditable?: boolean;
}

const MORAL_AXIS = ["good", "neutral", "evil"] as const;
const ETHICAL_AXIS = ["lawful", "neutral", "chaotic"] as const;

export function AlignmentMatrix({
  value = "",
  onChange,
  isEditable = false,
}: AlignmentMatrixProps) {
  const { t } = useTranslation("create-character");

  // Parse the alignment value (format: "lawful_good", "chaotic_evil", etc)
  const parseAlignment = (alignmentStr: string): AlignmentValue | null => {
    if (!alignmentStr) return null;
    const parts = alignmentStr.split("_");
    if (parts.length !== 2) return null;

    const ethical = parts[0] as AlignmentValue["ethical"];
    const moral = parts[1] as AlignmentValue["moral"];

    if (
      ETHICAL_AXIS.includes(ethical) &&
      MORAL_AXIS.includes(moral)
    ) {
      return { moral, ethical };
    }
    return null;
  };

  const currentAlignment = parseAlignment(value);

  const isSelected = (moral: string, ethical: string) => {
    if (!currentAlignment) return false;
    return (
      currentAlignment.moral === moral && currentAlignment.ethical === ethical
    );
  };

  const handleCellClick = (moral: string, ethical: string) => {
    if (!isEditable || !onChange) return;
    const newValue = `${ethical}_${moral}`;
    onChange(newValue);
  };

  const getCellColor = (moral: string, ethical: string) => {
    const selected = isSelected(moral, ethical);

    // Base colors by alignment
    let baseColor = "";
    let selectedColor = "";

    if (moral === "good") {
      if (ethical === "lawful") {
        baseColor = "bg-blue-500/10 hover:bg-blue-500/20";
        selectedColor = "bg-blue-500/30 border-blue-500";
      } else if (ethical === "neutral") {
        baseColor = "bg-green-500/10 hover:bg-green-500/20";
        selectedColor = "bg-green-500/30 border-green-500";
      } else {
        baseColor = "bg-cyan-500/10 hover:bg-cyan-500/20";
        selectedColor = "bg-cyan-500/30 border-cyan-500";
      }
    } else if (moral === "neutral") {
      if (ethical === "lawful") {
        baseColor = "bg-slate-500/10 hover:bg-slate-500/20";
        selectedColor = "bg-slate-500/30 border-slate-500";
      } else if (ethical === "neutral") {
        baseColor = "bg-gray-500/10 hover:bg-gray-500/20";
        selectedColor = "bg-gray-500/30 border-gray-500";
      } else {
        baseColor = "bg-zinc-500/10 hover:bg-zinc-500/20";
        selectedColor = "bg-zinc-500/30 border-zinc-500";
      }
    } else {
      // evil
      if (ethical === "lawful") {
        baseColor = "bg-purple-500/10 hover:bg-purple-500/20";
        selectedColor = "bg-purple-500/30 border-purple-500";
      } else if (ethical === "neutral") {
        baseColor = "bg-red-500/10 hover:bg-red-500/20";
        selectedColor = "bg-red-500/30 border-red-500";
      } else {
        baseColor = "bg-orange-500/10 hover:bg-orange-500/20";
        selectedColor = "bg-orange-500/30 border-orange-500";
      }
    }

    return selected ? selectedColor : baseColor;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {/* Header row */}
        <div className="text-xs font-medium text-muted-foreground" />
        {ETHICAL_AXIS.map((ethical) => (
          <div
            key={ethical}
            className="text-xs font-medium text-center text-muted-foreground"
          >
            {t(`alignment.ethical.${ethical}`)}
          </div>
        ))}

        {/* Data rows */}
        {MORAL_AXIS.map((moral) => (
          <React.Fragment key={moral}>
            <div className="text-xs font-medium text-right text-muted-foreground flex items-center justify-end">
              {t(`alignment.moral.${moral}`)}
            </div>
            {ETHICAL_AXIS.map((ethical) => {
              const alignmentKey = `${ethical}-${moral}`;
              const selected = isSelected(moral, ethical);

              return (
                <button
                  key={alignmentKey}
                  type="button"
                  onClick={() => handleCellClick(moral, ethical)}
                  disabled={!isEditable}
                  className={cn(
                    "aspect-square rounded-lg border-2 transition-all",
                    "flex items-center justify-center text-xs font-medium",
                    getCellColor(moral, ethical),
                    selected ? "border-2" : "border-transparent",
                    isEditable && "cursor-pointer hover:scale-105",
                    !isEditable && "cursor-default"
                  )}
                  title={t(`alignment.${alignmentKey}`)}
                >
                  {selected && (
                    <span className="text-lg leading-none">✓</span>
                  )}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Current selection display */}
      {currentAlignment && (
        <div className="text-center">
          <p className="text-sm font-medium">
            {t(`alignment.${value}`)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t(`alignment.${value}_desc`)}
          </p>
        </div>
      )}
    </div>
  );
}
