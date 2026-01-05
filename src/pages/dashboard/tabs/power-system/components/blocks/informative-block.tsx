import { useEffect, useRef } from "react";

import { AlertTriangle, Info, Star, Lightbulb, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  type IPowerBlock,
  type InformativeContent,
} from "../../types/power-system-types";

import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface InformativeBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: InformativeContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const iconMap = {
  alert: AlertTriangle,
  info: Info,
  star: Star,
  idea: Lightbulb,
  check: Check,
  x: X,
};

const iconColorMap = {
  alert: "text-yellow-500",
  info: "text-blue-500",
  star: "text-amber-500",
  idea: "text-purple-500",
  check: "text-green-500",
  x: "text-red-500",
};

// Hook customizado para auto-crescimento do textarea
function useAutoResizeTextarea(value: string, isEditMode: boolean) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Função para ajustar a altura do textarea
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set height based on scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Ajusta altura quando o valor muda ou quando entra em modo de edição
  useEffect(() => {
    adjustHeight();
  }, [value, isEditMode]);

  // Ajusta altura quando o textarea é montado/renderizado
  useEffect(() => {
    if (textareaRef.current) {
      // Pequeno delay para garantir que o DOM está pronto
      const timeoutId = setTimeout(adjustHeight, 0);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return textareaRef;
}

export function InformativeBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: InformativeBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as InformativeContent;
  const Icon = iconMap[content.icon];
  const textareaRef = useAutoResizeTextarea(content.text, isEditMode);

  if (!isEditMode && !content.text) {
    return null;
  }

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2">
          <Select
            value={content.icon}
            onValueChange={(value) =>
              onUpdate({
                ...content,
                icon: value as InformativeContent["icon"],
              })
            }
          >
            <SelectTrigger data-no-drag="true" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alert">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>{t("blocks.informative.icons.alert")}</span>
                </div>
              </SelectItem>
              <SelectItem value="info">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span>{t("blocks.informative.icons.info")}</span>
                </div>
              </SelectItem>
              <SelectItem value="star">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>{t("blocks.informative.icons.star")}</span>
                </div>
              </SelectItem>
              <SelectItem value="idea">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-purple-500" />
                  <span>{t("blocks.informative.icons.idea")}</span>
                </div>
              </SelectItem>
              <SelectItem value="check">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{t("blocks.informative.icons.check")}</span>
                </div>
              </SelectItem>
              <SelectItem value="x">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" />
                  <span>{t("blocks.informative.icons.x")}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <BlockReorderButtons
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">
            <Icon className={`h-5 w-5 ${iconColorMap[content.icon]}`} />
          </div>
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              data-no-drag="true"
              placeholder={t("blocks.informative.text_placeholder")}
              value={content.text}
              onChange={(e) => onUpdate({ ...content, text: e.target.value })}
              className="min-h-[40px] resize-none overflow-hidden"
              rows={1}
            />
          </div>
        </div>
      </div>
    );
  }

  return content.text ? (
    <div className="flex gap-3 p-3 rounded-md bg-muted/30 border">
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`h-5 w-5 ${iconColorMap[content.icon]}`} />
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap flex-1">
        {content.text}
      </p>
    </div>
  ) : null;
}
