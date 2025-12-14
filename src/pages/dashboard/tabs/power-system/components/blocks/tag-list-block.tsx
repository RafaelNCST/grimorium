import { useState } from "react";

import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  type IPowerBlock,
  type TagListContent,
} from "../../types/power-system-types";
import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface TagListBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: TagListContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function TagListBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: TagListBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as TagListContent;
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !content.tags.includes(newTag.trim())) {
      onUpdate({
        ...content,
        tags: [...content.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleDeleteTag = (tag: string) => {
    onUpdate({
      ...content,
      tags: content.tags.filter((t) => t !== tag),
    });
  };

  if (!isEditMode && content.tags.length === 0) {
    return null;
  }

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-end gap-2 mb-2">
          <BlockReorderButtons
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            data-no-drag="true"
            placeholder={t("blocks.tag_list.tag_placeholder")}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1"
          />
          <Button
            data-no-drag="true"
            onClick={handleAddTag}
            size="sm"
            variant="secondary"
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("blocks.tag_list.add_button")}
          </Button>
        </div>

        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 text-sm group"
              >
                {tag}
                <button
                  data-no-drag="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTag(tag);
                  }}
                  className="ml-2 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  return content.tags.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {content.tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
          {tag}
        </Badge>
      ))}
    </div>
  ) : null;
}
