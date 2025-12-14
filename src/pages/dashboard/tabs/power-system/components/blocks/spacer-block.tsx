import { ArrowDownUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import {
  type IPowerBlock,
  type SpacerContent,
} from "../../types/power-system-types";
import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface SpacerBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: SpacerContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function SpacerBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: SpacerBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as SpacerContent;
  const currentSize = content.size || "medium";

  const handleSizeChange = (size: "small" | "medium" | "large") => {
    onUpdate({ ...content, size });
  };

  const getSpacerHeight = () => {
    switch (currentSize) {
      case "small":
        return "h-4"; // 1rem
      case "large":
        return "h-16"; // 4rem
      default:
        return "h-8"; // 2rem
    }
  };

  if (isEditMode) {
    const spacerHeight = getSpacerHeight();
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2">
          {/* Size controls */}
          <div className="flex gap-2" data-no-drag="true">
            <Button
              type="button"
              variant="ghost-active"
              active={currentSize === "small"}
              onClick={() => handleSizeChange("small")}
            >
              {t("blocks.spacer.size_small")}
            </Button>
            <Button
              type="button"
              variant="ghost-active"
              active={currentSize === "medium"}
              onClick={() => handleSizeChange("medium")}
            >
              {t("blocks.spacer.size_medium")}
            </Button>
            <Button
              type="button"
              variant="ghost-active"
              active={currentSize === "large"}
              onClick={() => handleSizeChange("large")}
            >
              {t("blocks.spacer.size_large")}
            </Button>
          </div>

          <BlockReorderButtons
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>

        {/* Visual preview of the spacer */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowDownUp className="w-4 h-4" />
            <div
              className={`border-2 border-dashed border-muted-foreground/30 rounded w-full ${spacerHeight} flex items-center justify-center`}
            >
              <span className="text-xs text-muted-foreground">
                {t(`blocks.spacer.size_${currentSize}`)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View mode - just the empty space
  const spacerHeight = getSpacerHeight();
  return <div className={spacerHeight} />;
}
