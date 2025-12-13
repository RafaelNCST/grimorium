import { useState, useEffect } from "react";

import { Trash2, Plus, Minus, Palette, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  type IPowerBlock,
  type AttributesContent,
} from "../../types/power-system-types";

// Define bar colors with vibrant shades similar to primary
const BAR_COLORS = {
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  cyan: "bg-cyan-500",
} as const;

const COLOR_HEX_MAP: Record<BarColor, string> = {
  purple: "#a855f7",
  blue: "#3b82f6",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#f97316",
  pink: "#ec4899",
  yellow: "#eab308",
  cyan: "#06b6d4",
};

type BarColor = keyof typeof BAR_COLORS;

interface AttributesBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: AttributesContent) => void;
  onDelete: () => void;
}

export function AttributesBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
}: AttributesBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as AttributesContent;
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(false);

  // Habilita tooltips após o popover abrir completamente
  useEffect(() => {
    if (isColorPickerOpen) {
      const timer = setTimeout(() => setTooltipsEnabled(true), 100);
      return () => clearTimeout(timer);
    } else {
      setTooltipsEnabled(false);
    }
  }, [isColorPickerOpen]);

  const handleAddBar = () => {
    if (content.max < 10) {
      onUpdate({
        ...content,
        max: content.max + 1,
      });
    }
  };

  const handleRemoveBar = () => {
    if (content.max > 1) {
      onUpdate({
        ...content,
        max: content.max - 1,
        current: Math.min(content.current, content.max - 1),
      });
    }
  };

  const handleBarClick = (index: number) => {
    if (isEditMode) {
      onUpdate({
        ...content,
        current: index + 1,
      });
    }
  };

  const handleColorChange = (color: BarColor) => {
    onUpdate({
      ...content,
      color,
    });
  };

  // Get the current color class, default to purple if not set
  const currentColor = (content.color as BarColor) || "purple";
  const barColorClass = BAR_COLORS[currentColor];

  if (!isEditMode && content.max === 0) {
    return null;
  }

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              data-no-drag="true"
              variant="secondary"
              size="icon"
              onClick={handleRemoveBar}
              disabled={content.max <= 1}
              className="h-8 w-8 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              data-no-drag="true"
              variant="secondary"
              size="icon"
              onClick={handleAddBar}
              disabled={content.max >= 10}
              className="h-8 w-8 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </Button>

            <Popover
              open={isColorPickerOpen}
              onOpenChange={setIsColorPickerOpen}
              modal={false}
            >
              <PopoverTrigger asChild>
                <Button
                  data-no-drag="true"
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-3 z-[9999]"
                side="bottom"
                align="start"
                sideOffset={15}
                collisionPadding={20}
                avoidCollisions={true}
              >
                <div className="flex gap-2">
                  {(Object.keys(BAR_COLORS) as BarColor[]).map((color) => (
                    <Tooltip key={color} delayDuration={300} open={tooltipsEnabled ? undefined : false}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          data-no-drag="true"
                          onClick={() => handleColorChange(color)}
                          className={`w-8 h-8 aspect-square rounded-lg border transition-all flex items-center justify-center ${
                            currentColor === color
                              ? "opacity-60 border-foreground"
                              : "border-border cursor-pointer hover:opacity-60"
                          }`}
                          style={{ backgroundColor: COLOR_HEX_MAP[color] }}
                        >
                          {currentColor === color && (
                            <Check
                              className="w-5 h-5 text-purple-600 dark:text-purple-400 drop-shadow-lg"
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{t(`blocks.attributes.colors.${color}`)}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            data-no-drag="true"
            variant="ghost-destructive"
            size="icon"
            onClick={onDelete}
            className="cursor-pointer h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex h-3 rounded-md overflow-hidden border bg-muted/30">
            {Array.from({ length: content.max }, (_, index) => (
              <button
                key={`attr-bar-${index}`}
                data-no-drag="true"
                onClick={() => handleBarClick(index)}
                className={`flex-1 border-r-[3px] border-r-border/60 last:border-r-0 transition-all cursor-pointer hover:opacity-80 ${
                  index < content.current ? barColorClass : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>
              {content.current}/{content.max} (
              {content.max > 0
                ? Math.round((content.current / content.max) * 100)
                : 0}
              %)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex h-3 rounded-md overflow-hidden border bg-muted/30">
        {Array.from({ length: content.max }, (_, index) => (
          <div
            key={`attr-readonly-${index}`}
            className={`flex-1 border-r-[3px] border-r-border/60 last:border-r-0 transition-colors ${
              index < content.current ? barColorClass : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-end text-xs text-muted-foreground">
        <span>
          {content.current}/{content.max} (
          {content.max > 0
            ? Math.round((content.current / content.max) * 100)
            : 0}
          %)
        </span>
      </div>
    </div>
  );
}
