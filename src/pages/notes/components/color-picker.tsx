import { memo, useState, useRef, useEffect } from "react";

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NoteColor } from "@/types/note-types";

interface ColorPickerProps {
  value: NoteColor;
  onChange: (color: NoteColor) => void;
  size?: "sm" | "md";
}

const COLOR_OPTIONS: Array<{
  color: NoteColor;
  translationKey: string;
  hex: string;
}> = [
  { color: "sepia", translationKey: "colors.sepia", hex: "#FFF176" },
  { color: "purple", translationKey: "colors.purple", hex: "#E879F9" },
  { color: "green", translationKey: "colors.green", hex: "#6EE7B7" },
  { color: "blue", translationKey: "colors.blue", hex: "#60A5FA" },
  { color: "red", translationKey: "colors.red", hex: "#F9A8D4" },
  { color: "gold", translationKey: "colors.gold", hex: "#FDBA74" },
  { color: "cyan", translationKey: "colors.cyan", hex: "#67E8F9" },
  { color: "indigo", translationKey: "colors.indigo", hex: "#C4B5FD" },
  { color: "lime", translationKey: "colors.lime", hex: "#BEF264" },
];

interface ColorButtonProps {
  option: {
    color: NoteColor;
    translationKey: string;
    hex: string;
    label: string;
  };
  isSelected: boolean;
  onClick: () => void;
  isSmall: boolean;
}

function ColorButton({
  option,
  isSelected,
  onClick,
  isSmall,
}: ColorButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const handlePointerEnter = () => {
    setShowTooltip(true);
    // Esconde o tooltip após 800ms
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 800);
  };

  const handlePointerLeave = () => {
    setShowTooltip(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          tabIndex={-1}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className={cn(
            "w-full aspect-square rounded border transition-all hover:opacity-60 flex items-center justify-center",
            isSmall ? "rounded-sm" : "rounded-lg",
            isSelected ? "opacity-60 border-foreground" : "border-border"
          )}
          style={{ backgroundColor: option.hex }}
        >
          {isSelected && (
            <Check
              className={cn(
                "text-purple-600 dark:text-purple-400 drop-shadow-lg",
                isSmall ? "w-3 h-3" : "w-5 h-5"
              )}
              strokeWidth={3}
            />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{option.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ColorPickerComponent({
  value,
  onChange,
  size = "md",
}: ColorPickerProps) {
  const { t } = useTranslation("notes");
  const isSmall = size === "sm";

  return (
    <div
      className={cn(
        "grid grid-cols-9",
        isSmall ? "gap-1.5 w-[220px]" : "gap-2"
      )}
    >
      {COLOR_OPTIONS.map((option) => (
        <ColorButton
          key={option.color}
          option={{ ...option, label: t(option.translationKey) }}
          isSelected={value === option.color}
          onClick={() => onChange(option.color)}
          isSmall={isSmall}
        />
      ))}
    </div>
  );
}

export const ColorPicker = memo(ColorPickerComponent);
