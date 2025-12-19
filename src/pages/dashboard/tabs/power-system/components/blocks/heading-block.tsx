import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  type HeadingContent,
  type IPowerBlock,
} from "../../types/power-system-types";
import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface HeadingBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: HeadingContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function HeadingBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: HeadingBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as HeadingContent;

  if (!isEditMode && !content.text) {
    return null;
  }

  const getHeadingClass = (level: number, alignment: string) => {
    const sizeClasses = {
      1: "text-4xl font-bold",
      2: "text-3xl font-bold",
      3: "text-2xl font-semibold",
      4: "text-xl font-semibold",
      5: "text-lg font-semibold",
    };

    const alignmentClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return `${sizeClasses[level as keyof typeof sizeClasses]} ${
      alignmentClasses[alignment as keyof typeof alignmentClasses]
    }`;
  };

  const getAlignmentClass = (alignment: string) => {
    const alignmentClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return (
      alignmentClasses[alignment as keyof typeof alignmentClasses] ||
      "text-left"
    );
  };

  const HeadingTag = `h${content.level}` as keyof JSX.IntrinsicElements;

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Level and alignment controls */}
          <div className="flex gap-2" data-no-drag="true">
            {/* Level selector */}
            <Select
              value={String(content.level)}
              onValueChange={(value) =>
                onUpdate({
                  ...content,
                  level: Number(value) as 1 | 2 | 3 | 4 | 5,
                })
              }
            >
              <SelectTrigger data-no-drag="true" className="w-20">
                <SelectValue>H{content.level}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="text-4xl font-bold">H1</span>
                </SelectItem>
                <SelectItem value="2">
                  <span className="text-3xl font-bold">H2</span>
                </SelectItem>
                <SelectItem value="3">
                  <span className="text-2xl font-semibold">H3</span>
                </SelectItem>
                <SelectItem value="4">
                  <span className="text-xl font-semibold">H4</span>
                </SelectItem>
                <SelectItem value="5">
                  <span className="text-lg font-semibold">H5</span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Alignment buttons */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost-active"
                  size="icon"
                  active={content.alignment === "left"}
                  onClick={() => onUpdate({ ...content, alignment: "left" })}
                >
                  <AlignLeft className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("blocks.heading.alignment_left")}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost-active"
                  size="icon"
                  active={content.alignment === "center"}
                  onClick={() => onUpdate({ ...content, alignment: "center" })}
                >
                  <AlignCenter className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("blocks.heading.alignment_center")}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost-active"
                  size="icon"
                  active={content.alignment === "right"}
                  onClick={() => onUpdate({ ...content, alignment: "right" })}
                >
                  <AlignRight className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("blocks.heading.alignment_right")}
              </TooltipContent>
            </Tooltip>
          </div>

          <BlockReorderButtons
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>

        <Input
          data-no-drag="true"
          placeholder={t("blocks.heading.text_placeholder")}
          value={content.text}
          onChange={(e) => onUpdate({ ...content, text: e.target.value })}
          className={`font-semibold ${getAlignmentClass(content.alignment)}`}
        />
      </div>
    );
  }

  return content.text ? (
    <HeadingTag className={`${getHeadingClass(content.level, content.alignment)} mb-6`}>
      {content.text}
    </HeadingTag>
  ) : null;
}
