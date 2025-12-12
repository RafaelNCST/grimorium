import { AlignCenter, AlignLeft, AlignRight, Trash2 } from "lucide-react";
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
  type HeadingContent,
  type IPowerBlock,
} from "../../types/power-system-types";

interface HeadingBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: HeadingContent) => void;
  onDelete: () => void;
}

export function HeadingBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
                <SelectItem value="5">H5</SelectItem>
              </SelectContent>
            </Select>

            {/* Alignment buttons */}
            <Button
              type="button"
              variant="ghost-active"
              size="icon"
              active={content.alignment === "left"}
              onClick={() => onUpdate({ ...content, alignment: "left" })}
              title={t("blocks.heading.alignment_left")}
            >
              <AlignLeft className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="ghost-active"
              size="icon"
              active={content.alignment === "center"}
              onClick={() => onUpdate({ ...content, alignment: "center" })}
              title={t("blocks.heading.alignment_center")}
            >
              <AlignCenter className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="ghost-active"
              size="icon"
              active={content.alignment === "right"}
              onClick={() => onUpdate({ ...content, alignment: "right" })}
              title={t("blocks.heading.alignment_right")}
            >
              <AlignRight className="w-5 h-5" />
            </Button>
          </div>

          <Button
            data-no-drag="true"
            variant="ghost-destructive"
            size="icon"
            onClick={onDelete}
            className="cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
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
