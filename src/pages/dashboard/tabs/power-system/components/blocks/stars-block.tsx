import { Star, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import {
  type IPowerBlock,
  type StarsContent,
} from "../../types/power-system-types";

interface StarsBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: StarsContent) => void;
  onDelete: () => void;
}

export function StarsBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
}: StarsBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as StarsContent;
  const currentSize = content.size || "medium";

  const handleStarClick = (starIndex: number) => {
    if (!isEditMode) return;

    const clickedValue = starIndex + 1;
    const currentValue = content.rating;

    // If clicking the same star
    if (clickedValue === currentValue) {
      // Full star -> half star
      onUpdate({ ...content, rating: clickedValue - 0.5 });
    } else if (clickedValue - 0.5 === currentValue) {
      // Half star -> empty
      onUpdate({ ...content, rating: clickedValue - 1 });
    } else {
      // Empty or different star -> full star
      onUpdate({ ...content, rating: clickedValue });
    }
  };

  const handleSizeChange = (size: "small" | "medium" | "large") => {
    onUpdate({ ...content, size });
  };

  const getStarState = (starIndex: number): "full" | "half" | "empty" => {
    const starValue = starIndex + 1;
    if (content.rating >= starValue) return "full";
    if (content.rating >= starValue - 0.5) return "half";
    return "empty";
  };

  const getStarSize = () => {
    switch (currentSize) {
      case "small":
        return "h-5 w-5";
      case "large":
        return "h-10 w-10";
      default:
        return "h-8 w-8";
    }
  };

  if (!isEditMode && content.rating === 0) {
    return null;
  }

  if (isEditMode) {
    const starSize = getStarSize();
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Size controls */}
          <div className="flex gap-2" data-no-drag="true">
            <button
              type="button"
              onClick={() => handleSizeChange("small")}
              className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                currentSize === "small"
                  ? "border-primary/40 bg-primary/10 shadow-sm"
                  : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
              }`}
            >
              {t("blocks.stars.size_small")}
            </button>
            <button
              type="button"
              onClick={() => handleSizeChange("medium")}
              className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                currentSize === "medium"
                  ? "border-primary/40 bg-primary/10 shadow-sm"
                  : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
              }`}
            >
              {t("blocks.stars.size_medium")}
            </button>
            <button
              type="button"
              onClick={() => handleSizeChange("large")}
              className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                currentSize === "large"
                  ? "border-primary/40 bg-primary/10 shadow-sm"
                  : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
              }`}
            >
              {t("blocks.stars.size_large")}
            </button>
          </div>

          <Button
            data-no-drag="true"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:bg-red-500/20 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((starIndex) => {
              const state = getStarState(starIndex);
              return (
                <button
                  data-no-drag="true"
                  key={starIndex}
                  onClick={() => handleStarClick(starIndex)}
                  className="relative cursor-pointer hover:scale-110 transition-transform"
                >
                  {state === "full" && (
                    <Star
                      className={`${starSize} fill-yellow-500 text-yellow-500`}
                    />
                  )}
                  {state === "half" && (
                    <div className={`relative ${starSize}`}>
                      <Star
                        className={`${starSize} text-muted-foreground absolute inset-0`}
                      />
                      <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star
                          className={`${starSize} fill-yellow-500 text-yellow-500`}
                        />
                      </div>
                    </div>
                  )}
                  {state === "empty" && (
                    <Star className={`${starSize} text-muted-foreground`} />
                  )}
                </button>
              );
            })}
            <span className="ml-2 text-sm text-muted-foreground">
              ({content.rating}/5)
            </span>
          </div>
        </div>
      </div>
    );
  }

  const starSize = getStarSize();
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((starIndex) => {
        const state = getStarState(starIndex);
        return (
          <div key={starIndex} className="relative">
            {state === "full" && (
              <Star className={`${starSize} fill-yellow-500 text-yellow-500`} />
            )}
            {state === "half" && (
              <div className={`relative ${starSize}`}>
                <Star
                  className={`${starSize} text-muted-foreground absolute inset-0`}
                />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={`${starSize} fill-yellow-500 text-yellow-500`}
                  />
                </div>
              </div>
            )}
            {state === "empty" && (
              <Star className={`${starSize} text-muted-foreground`} />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        ({content.rating}/5)
      </span>
    </div>
  );
}
