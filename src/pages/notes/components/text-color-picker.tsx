import { memo, useState, useRef, useEffect } from "react";

import { Check } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NoteTextColor } from "@/types/note-types";

interface TextColorPickerProps {
  value: NoteTextColor;
  onChange: (color: NoteTextColor) => void;
  size?: "sm" | "md";
}

const TEXT_COLOR_OPTIONS: Array<{
  color: NoteTextColor;
  label: string;
  hex: string;
}> = [
  { color: "black", label: "Preto", hex: "#000000" },
  { color: "white", label: "Branco", hex: "#FFFFFF" },
];

interface TextColorButtonProps {
  option: { color: NoteTextColor; label: string; hex: string };
  isSelected: boolean;
  onClick: () => void;
  isSmall: boolean;
}

function TextColorButton({
  option,
  isSelected,
  onClick,
  isSmall,
}: TextColorButtonProps) {
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

function TextColorPickerComponent({
  value,
  onChange,
  size = "md",
}: TextColorPickerProps) {
  const isSmall = size === "sm";

  return (
    <div
      className={cn("grid grid-cols-2", isSmall ? "gap-1.5 w-[44px]" : "gap-2")}
    >
      {TEXT_COLOR_OPTIONS.map((option) => (
        <TextColorButton
          key={option.color}
          option={option}
          isSelected={value === option.color}
          onClick={() => onChange(option.color)}
          isSmall={isSmall}
        />
      ))}
    </div>
  );
}

export const TextColorPicker = memo(TextColorPickerComponent);
