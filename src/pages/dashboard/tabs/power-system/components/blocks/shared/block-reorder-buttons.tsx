import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlockReorderButtonsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function BlockReorderButtons({
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst = false,
  isLast = false,
}: BlockReorderButtonsProps) {
  const { t } = useTranslation("power-system");

  return (
    <div className="flex gap-2" data-no-drag="true">
      {/* Move up button */}
      {onMoveUp && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              disabled={isFirst}
              className="cursor-pointer"
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">{t("blocks.move_up")}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Move down button */}
      {onMoveDown && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              disabled={isLast}
              className="cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">{t("blocks.move_down")}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* Delete button */}
      <Button
        variant="ghost-destructive"
        size="icon"
        onClick={onDelete}
        className="cursor-pointer"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
}
