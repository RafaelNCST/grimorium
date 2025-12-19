import { UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  type IPowerBlock,
  type IconContent,
} from "../../types/power-system-types";
import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface IconBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: IconContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function IconBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: IconBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as IconContent;

  const handleImageChange = (value: string) => {
    onUpdate({ ...content, imageUrl: value });
  };

  const handleAlignmentChange = (value: string) => {
    if (!value) return; // Prevent deselecting all options
    onUpdate({
      ...content,
      alignment: value as "start" | "center" | "end",
    });
  };

  if (!isEditMode && !content.title && !content.description) {
    return null;
  }

  // Get alignment classes
  const getAlignmentClasses = () => {
    const alignment = content.alignment || "center";
    switch (alignment) {
      case "start":
        return "items-start text-left";
      case "end":
        return "items-end text-right";
      case "center":
      default:
        return "items-center text-center";
    }
  };

  if (isEditMode) {
    return (
      <div className="space-y-4 p-4 rounded-lg border bg-card">
        {/* Top row: Alignment buttons and delete button */}
        <div className="flex items-center justify-between gap-2">
          {/* Alignment controls */}
          <div className="flex gap-2" data-no-drag="true">
            <Button
              type="button"
              variant="ghost-active"
              size="sm"
              active={(content.alignment || "center") === "start"}
              onClick={() => handleAlignmentChange("start")}
            >
              {t("blocks.icon.align_start")}
            </Button>
            <Button
              type="button"
              variant="ghost-active"
              size="sm"
              active={(content.alignment || "center") === "center"}
              onClick={() => handleAlignmentChange("center")}
            >
              {t("blocks.icon.align_center")}
            </Button>
            <Button
              type="button"
              variant="ghost-active"
              size="sm"
              active={(content.alignment || "center") === "end"}
              onClick={() => handleAlignmentChange("end")}
            >
              {t("blocks.icon.align_end")}
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

        {/* Icon upload area */}
        <div className={`flex flex-col gap-4 ${getAlignmentClasses()}`}>
          <div data-no-drag="true">
            <FormImageUpload
              value={content.imageUrl}
              onChange={handleImageChange}
              label=""
              height="h-24"
              width="w-24"
              shape="circle"
              imageFit="cover"
              showLabel={false}
              compact
              placeholderIcon={UserCircle}
              id={`icon-upload-${block.id}`}
            />
          </div>

          {/* Title and description inputs */}
          <div className="w-full space-y-3">
            <Input
              data-no-drag="true"
              placeholder={t("blocks.icon.title_placeholder")}
              value={content.title}
              onChange={(e) => onUpdate({ ...content, title: e.target.value })}
            />

            <Textarea
              data-no-drag="true"
              placeholder={t("blocks.icon.description_placeholder")}
              value={content.description}
              onChange={(e) =>
                onUpdate({ ...content, description: e.target.value })
              }
              className="min-h-[80px] resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  }

  // View mode - vertical layout
  return (
    <div className={`flex flex-col gap-3 ${getAlignmentClasses()}`}>
      <div className="w-24 h-24 rounded-full overflow-hidden border">
        {content.imageUrl ? (
          <img
            src={content.imageUrl}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <UserCircle className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {content.title && (
          <h3 className="font-semibold text-lg">{content.title}</h3>
        )}
        {content.description && (
          <p className="text-sm text-muted-foreground">{content.description}</p>
        )}
      </div>
    </div>
  );
}
