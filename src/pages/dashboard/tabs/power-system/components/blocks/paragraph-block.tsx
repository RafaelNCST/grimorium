import { useEffect, useRef } from "react";

import { Lock, LockOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  type IPowerBlock,
  type ParagraphContent,
} from "../../types/power-system-types";

import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface ParagraphBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: ParagraphContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

// Constantes para altura mínima
const MIN_HEIGHT_PX = 200; // Height mínimo maior que o bloco informativo (40px)
const MIN_HEIGHT_CLASS = "min-h-[200px]";

// Hook customizado para auto-crescimento do textarea com suporte a locked state
function useAutoResizeTextarea(
  value: string,
  isEditMode: boolean,
  isLocked: boolean
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Função para ajustar a altura do textarea
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea || isLocked) return;

    // Reset height to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height
    const { scrollHeight } = textarea;

    // Only grow if content exceeds minimum height
    if (scrollHeight > MIN_HEIGHT_PX) {
      textarea.style.height = `${scrollHeight}px`;
    } else {
      textarea.style.height = `${MIN_HEIGHT_PX}px`;
    }
  };

  // Ajusta altura quando o valor muda, modo de edição muda, ou locked state muda
  useEffect(() => {
    if (isEditMode && !isLocked) {
      adjustHeight();
    } else if (isEditMode && isLocked) {
      // When locked, reset to minimum height
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = `${MIN_HEIGHT_PX}px`;
      }
    }
  }, [value, isEditMode, isLocked]);

  // Ajusta altura quando o textarea é montado/renderizado
  useEffect(() => {
    if (textareaRef.current && isEditMode) {
      // Pequeno delay para garantir que o DOM está pronto
      const timeoutId = setTimeout(() => {
        if (!isLocked) {
          adjustHeight();
        } else {
          const textarea = textareaRef.current;
          if (textarea) {
            textarea.style.height = `${MIN_HEIGHT_PX}px`;
          }
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isEditMode, isLocked]);

  return textareaRef;
}

export function ParagraphBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: ParagraphBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as ParagraphContent;
  const isLocked = content.locked ?? false;

  const textareaRef = useAutoResizeTextarea(content.text, isEditMode, isLocked);

  if (!isEditMode && !content.text) {
    return null;
  }

  const handleToggleLock = () => {
    onUpdate({ ...content, locked: !isLocked });
  };

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Lock toggle control */}
          <div className="flex gap-2" data-no-drag="true">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost-active"
                  size="icon"
                  active={isLocked}
                  onClick={handleToggleLock}
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <LockOpen className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isLocked
                  ? t("blocks.paragraph.unlock_height")
                  : t("blocks.paragraph.lock_height")}
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

        <Textarea
          ref={textareaRef}
          data-no-drag="true"
          placeholder={t("blocks.paragraph.text_placeholder")}
          value={content.text}
          onChange={(e) => onUpdate({ ...content, text: e.target.value })}
          className={`${MIN_HEIGHT_CLASS} resize-none ${
            isLocked ? "overflow-y-auto" : "overflow-hidden"
          }`}
        />
      </div>
    );
  }

  return content.text ? (
    <div
      className={`${
        isLocked
          ? "h-[200px] overflow-y-auto border border-border rounded-lg p-4"
          : ""
      }`}
    >
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
        {content.text}
      </p>
    </div>
  ) : null;
}
