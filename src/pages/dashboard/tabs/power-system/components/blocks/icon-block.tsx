import { UserCircle, Upload, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type IPowerBlock,
  type IconContent,
} from "../../types/power-system-types";

interface IconBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: IconContent) => void;
  onDelete: () => void;
}

export function IconBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
}: IconBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as IconContent;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onUpdate({ ...content, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
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
          <div className="flex-1">
            <Label className="text-sm mb-2 block">
              {t("blocks.icon.alignment_label")}
            </Label>
            <div className="flex gap-2" data-no-drag="true">
              <button
                type="button"
                onClick={() => handleAlignmentChange("start")}
                className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                  (content.alignment || "center") === "start"
                    ? "border-primary/40 bg-primary/10 shadow-sm"
                    : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
                }`}
              >
                {t("blocks.icon.align_start")}
              </button>
              <button
                type="button"
                onClick={() => handleAlignmentChange("center")}
                className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                  (content.alignment || "center") === "center"
                    ? "border-primary/40 bg-primary/10 shadow-sm"
                    : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
                }`}
              >
                {t("blocks.icon.align_center")}
              </button>
              <button
                type="button"
                onClick={() => handleAlignmentChange("end")}
                className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                  (content.alignment || "center") === "end"
                    ? "border-primary/40 bg-primary/10 shadow-sm"
                    : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
                }`}
              >
                {t("blocks.icon.align_end")}
              </button>
            </div>
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

        {/* Icon upload area */}
        <div className={`flex flex-col gap-4 ${getAlignmentClasses()}`}>
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors group">
            {content.imageUrl ? (
              <>
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label
                    data-no-drag="true"
                    htmlFor={`icon-upload-${block.id}`}
                    className="cursor-pointer"
                  >
                    <Upload className="h-6 w-6 text-white" />
                  </label>
                  <input
                    data-no-drag="true"
                    id={`icon-upload-${block.id}`}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <label
                  data-no-drag="true"
                  htmlFor={`icon-upload-${block.id}`}
                  className="cursor-pointer flex flex-col items-center gap-1"
                >
                  <UserCircle className="w-12 h-12 text-muted-foreground" />
                  <input
                    data-no-drag="true"
                    id={`icon-upload-${block.id}`}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Title and description inputs */}
          <div className="w-full space-y-3">
            <Input
              data-no-drag="true"
              placeholder={t("blocks.icon.title_placeholder")}
              value={content.title}
              onChange={(e) => onUpdate({ ...content, title: e.target.value })}
              required
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
              required
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
          <p className="text-sm text-muted-foreground">
            {content.description}
          </p>
        )}
      </div>
    </div>
  );
}
