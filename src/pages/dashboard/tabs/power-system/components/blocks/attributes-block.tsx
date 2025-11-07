import { Trash2, Plus, Minus, Palette, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
              variant="outline"
              size="icon"
              onClick={handleRemoveBar}
              disabled={content.max <= 1}
              className="h-8 w-8 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              data-no-drag="true"
              variant="outline"
              size="icon"
              onClick={handleAddBar}
              disabled={content.max >= 10}
              className="h-8 w-8 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </Button>

            <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  data-no-drag="true"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t("blocks.attributes.color_picker")}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(BAR_COLORS) as BarColor[]).map((color) => (
                      <button
                        key={color}
                        data-no-drag="true"
                        onClick={() => handleColorChange(color)}
                        className={`relative w-8 h-8 rounded-md border transition-all ${
                          BAR_COLORS[color]
                        } ${
                          currentColor === color
                            ? "border-foreground/40 shadow-lg scale-105"
                            : "border-transparent hover:scale-105 hover:shadow-md"
                        } cursor-pointer flex items-center justify-center`}
                        title={t(`blocks.attributes.colors.${color}`)}
                        aria-label={t(`blocks.attributes.colors.${color}`)}
                      >
                        {currentColor === color && (
                          <Check className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            data-no-drag="true"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:bg-red-500/20 hover:text-red-600 cursor-pointer h-8 w-8"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex h-3 rounded-md overflow-hidden border bg-muted/30">
            {Array.from({ length: content.max }, (_, index) => (
              <button
                key={index}
                data-no-drag="true"
                onClick={() => handleBarClick(index)}
                className={`flex-1 border-r-[3px] border-r-border/60 last:border-r-0 transition-all cursor-pointer hover:opacity-80 ${
                  index < content.current
                    ? barColorClass
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>
              {content.current}/{content.max} ({content.max > 0
                ? Math.round((content.current / content.max) * 100)
                : 0}%)
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
            key={index}
            className={`flex-1 border-r-[3px] border-r-border/60 last:border-r-0 transition-colors ${
              index < content.current
                ? barColorClass
                : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-end text-xs text-muted-foreground">
        <span>
          {content.current}/{content.max} ({content.max > 0
            ? Math.round((content.current / content.max) * 100)
            : 0}%)
        </span>
      </div>
    </div>
  );
}
