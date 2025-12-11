import { memo, useState, useRef, useEffect } from "react";

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ColorOption {
  color: string;
  translationKey: string;
  hex: string;
  className: string;
}

interface PropsColorPicker {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}

const COLOR_OPTIONS: ColorOption[] = [
  {
    color: "yellow",
    translationKey: "colors.yellow",
    hex: "#FEF08A",
    className: "bg-yellow-200 border-yellow-400 text-yellow-900 shadow-lg",
  },
  {
    color: "pink",
    translationKey: "colors.pink",
    hex: "#FBCFE8",
    className: "bg-pink-200 border-pink-400 text-pink-900 shadow-lg",
  },
  {
    color: "green",
    translationKey: "colors.green",
    hex: "#BBF7D0",
    className: "bg-green-200 border-green-400 text-green-900 shadow-lg",
  },
  {
    color: "blue",
    translationKey: "colors.blue",
    hex: "#BFDBFE",
    className: "bg-blue-200 border-blue-400 text-blue-900 shadow-lg",
  },
  {
    color: "purple",
    translationKey: "colors.purple",
    hex: "#DDD6FE",
    className: "bg-purple-200 border-purple-400 text-purple-900 shadow-lg",
  },
  {
    color: "orange",
    translationKey: "colors.orange",
    hex: "#FED7AA",
    className: "bg-orange-200 border-orange-400 text-orange-900 shadow-lg",
  },
];

interface ColorButtonProps {
  option: ColorOption & { label: string };
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ColorButton({
  option,
  isSelected,
  onClick,
  disabled = false,
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
          disabled={disabled}
          tabIndex={-1}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className={cn(
            "w-8 h-8 aspect-square rounded-lg border transition-all flex items-center justify-center",
            isSelected ? "opacity-60 border-foreground" : "border-border",
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:opacity-60"
          )}
          style={{ backgroundColor: option.hex }}
        >
          {isSelected && (
            <Check
              className="w-5 h-5 text-purple-600 dark:text-purple-400 drop-shadow-lg"
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
  selectedColor,
  onColorSelect,
  disabled = false,
}: PropsColorPicker) {
  const { t } = useTranslation("overview");

  return (
    <div className="flex gap-2 flex-wrap">
      {COLOR_OPTIONS.map((option) => (
        <ColorButton
          key={option.color}
          option={{ ...option, label: t(option.translationKey) }}
          isSelected={selectedColor === option.className}
          onClick={() => onColorSelect(option.className)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export const ColorPicker = memo(ColorPickerComponent);
