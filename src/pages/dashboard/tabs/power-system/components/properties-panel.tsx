import { useState, useEffect } from "react";

import {
  X,
  Trash2,
  ImageIcon,
  Copy,
  Bold,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Square,
  Minus,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  type CardSize,
  DEFAULT_CARD_SIZE,
} from "../constants/card-sizes-constant";
import { DEFAULT_COLORS_CONSTANT } from "../constants/default-colors-constant";
import { SHAPES_CONSTANT } from "../constants/shapes-constant";
import { IPowerElement } from "../types/power-system-types";

interface PropsPropertiesPanel {
  element: IPowerElement;
  selectedCount?: number;
  onUpdate: (updates: Partial<IPowerElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onClose: () => void;
}

export function PropertiesPanel({
  element,
  selectedCount = 1,
  onUpdate,
  onDelete,
  onDuplicate,
  onClose,
}: PropsPropertiesPanel) {
  const { t } = useTranslation("power-system");
  const isMultiSelection = selectedCount > 1;
  const [fontSizeInput, setFontSizeInput] = useState(
    element.type === "text" ? String(element.fontSize) : ""
  );

  // Sync local state when fontSize changes externally (e.g., from buttons)
  useEffect(() => {
    if (element.type === "text") {
      setFontSizeInput(String(element.fontSize));
    }
  }, [element.fontSize, element.type]);

  const renderColorPicker = (
    label: string,
    value: string | undefined,
    onChange: (color: string) => void
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-6 gap-2">
        {DEFAULT_COLORS_CONSTANT.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 ${
              value === color
                ? "border-primary ring-2 ring-primary"
                : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );

  const renderParagraphBlockProperties = () => {
    if (element.type !== "paragraph-block") return null;

    return (
      <>
        {/* Properties Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.properties")}
          </Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("properties_panel.navigation_hint")}
            </span>
            <Switch
              checked={element.canNavigate}
              onCheckedChange={(checked) => onUpdate({ canNavigate: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("properties_panel.show_content_border")}
            </span>
            <Switch
              checked={element.showContentBorder !== false}
              onCheckedChange={(checked) => onUpdate({ showContentBorder: checked })}
            />
          </div>
        </div>

        <Separator />

        {/* Text Alignment */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.text_align")}
          </Label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={element.textAlign === "left" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ textAlign: "left" })}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === "center" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ textAlign: "center" })}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ textAlign: "right" })}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === "justify" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ textAlign: "justify" })}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {renderColorPicker(
          t("properties_panel.background_color"),
          element.backgroundColor,
          (color) => onUpdate({ backgroundColor: color })
        )}
        <Separator />
        {renderColorPicker(
          t("properties_panel.text_color"),
          element.textColor,
          (color) => onUpdate({ textColor: color })
        )}
        <Separator />
        {renderColorPicker(
          t("properties_panel.border_color"),
          element.borderColor,
          (color) => onUpdate({ borderColor: color })
        )}
      </>
    );
  };

  const renderImageBlockProperties = () => {
    if (element.type !== "image-block") return null;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUpdate({
            imageUrl: event.target?.result as string,
            // Reset offsets when new image is loaded
            imageOffsetX: 0,
            imageOffsetY: 0
          });
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <>
        {/* Properties Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.properties")}
          </Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("properties_panel.navigation_hint")}
            </span>
            <Switch
              checked={element.canNavigate}
              onCheckedChange={(checked) => onUpdate({ canNavigate: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("properties_panel.show_caption_border")}
            </span>
            <Switch
              checked={element.showCaptionBorder !== false}
              onCheckedChange={(checked) => onUpdate({ showCaptionBorder: checked })}
            />
          </div>
        </div>

        <Separator />

        {/* Image Upload Section - Hidden in multi-selection */}
        {!isMultiSelection && (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("properties_panel.upload_image")}
              </Label>

              {element.imageUrl ? (
                <div className="flex flex-col items-center gap-3">
                  {/* Image Preview */}
                  <div className="w-full h-32 rounded overflow-hidden border-2">
                    <img
                      src={element.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Image Name */}
                  <p className="text-xs text-center text-muted-foreground">
                    {element.imageUrl.substring(0, 30)}...
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        document.getElementById("image-block-input")?.click()
                      }
                    >
                      <ImageIcon className="w-3 h-3 mr-2" />
                      Nova Imagem
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onUpdate({ imageUrl: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  <input
                    id="image-block-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document
                        .getElementById("image-block-input-empty")
                        ?.click()
                    }
                  >
                    <ImageIcon className="w-3 h-3 mr-2" />
                    Escolher Arquivo
                  </Button>
                  <input
                    id="image-block-input-empty"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              )}
            </div>

            <Separator />
          </>
        )}

        {/* Image Area Width Control */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Largura da Imagem</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentWidth = element.width;
                const newWidth = Math.max(200, currentWidth - 50);
                onUpdate({ width: newWidth });
              }}
              disabled={element.width <= 200}
            >
              <Minus className="h-3 w-3 mr-1" />
              50
            </Button>
            <div className="flex-1 text-center font-mono text-sm">
              {element.width}px
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentWidth = element.width;
                const newWidth = Math.min(1200, currentWidth + 50);
                onUpdate({ width: newWidth });
              }}
              disabled={element.width >= 1200}
            >
              <Plus className="h-3 w-3 mr-1" />
              50
            </Button>
          </div>
        </div>

        <Separator />

        {/* Image Area Height Control */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.image_area_height")}
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentHeight = element.imageAreaHeight ?? 300;
                const newHeight = Math.max(200, currentHeight - 50);
                onUpdate({ imageAreaHeight: newHeight });
              }}
              disabled={(element.imageAreaHeight ?? 300) <= 200}
            >
              <Minus className="h-3 w-3 mr-1" />
              50
            </Button>
            <div className="flex-1 text-center font-mono text-sm">
              {element.imageAreaHeight ?? 300}px
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentHeight = element.imageAreaHeight ?? 300;
                const newHeight = Math.min(1200, currentHeight + 50);
                onUpdate({ imageAreaHeight: newHeight });
              }}
              disabled={(element.imageAreaHeight ?? 300) >= 1200}
            >
              <Plus className="h-3 w-3 mr-1" />
              50
            </Button>
          </div>
        </div>

        <Separator />

        {/* Image Mode Selector */}
        {element.imageUrl && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Modo de Preenchimento</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={(!element.imageMode || element.imageMode === "fill") ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdate({ imageMode: "fill", imageOffsetX: 0, imageOffsetY: 0 })}
                  className={`text-xs ${(!element.imageMode || element.imageMode === "fill") ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none" : ""}`}
                >
                  Fill
                </Button>
                <Button
                  variant={element.imageMode === "fit" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdate({ imageMode: "fit", imageOffsetX: 0, imageOffsetY: 0 })}
                  className={`text-xs ${element.imageMode === "fit" ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none" : ""}`}
                >
                  Fit
                </Button>
                <Button
                  variant={element.imageMode === "tile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdate({ imageMode: "tile", imageOffsetX: 0, imageOffsetY: 0 })}
                  className={`text-xs ${element.imageMode === "tile" ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none" : ""}`}
                >
                  Tile
                </Button>
                <Button
                  variant={element.imageMode === "crop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdate({ imageMode: "crop" })}
                  className={`text-xs ${element.imageMode === "crop" ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none" : ""}`}
                >
                  Crop
                </Button>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Caption Alignment */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.caption_align")}
          </Label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={element.captionAlign === "left" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ captionAlign: "left" })}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={element.captionAlign === "center" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ captionAlign: "center" })}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={element.captionAlign === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ captionAlign: "right" })}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={element.captionAlign === "justify" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ captionAlign: "justify" })}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {renderColorPicker(
          t("properties_panel.background_color"),
          element.backgroundColor,
          (color) => onUpdate({ backgroundColor: color })
        )}
        <Separator />
        {renderColorPicker(
          t("properties_panel.text_color"),
          element.textColor,
          (color) => onUpdate({ textColor: color })
        )}
        <Separator />
        {renderColorPicker(
          t("properties_panel.border_color"),
          element.borderColor,
          (color) => onUpdate({ borderColor: color })
        )}
      </>
    );
  };

  const renderSectionBlockProperties = () => {
    if (element.type !== "section-block") return null;

    return (
      <>
        {/* Properties Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.properties")}
          </Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("properties_panel.navigation_hint")}
            </span>
            <Switch
              checked={element.canNavigate}
              onCheckedChange={(checked) => onUpdate({ canNavigate: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("properties_panel.show_title_border")}
            </span>
            <Switch
              checked={element.showTitleBorder !== false}
              onCheckedChange={(checked) => onUpdate({ showTitleBorder: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("properties_panel.show_content_border")}
            </span>
            <Switch
              checked={element.showContentBorder !== false}
              onCheckedChange={(checked) => onUpdate({ showContentBorder: checked })}
            />
          </div>
        </div>

        <Separator />

        {/* Title Alignment */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.title_align")}
          </Label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={element.titleAlign === "left" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ titleAlign: "left" })}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={element.titleAlign === "center" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ titleAlign: "center" })}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={element.titleAlign === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ titleAlign: "right" })}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={element.titleAlign === "justify" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ titleAlign: "justify" })}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Content Alignment */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.content_align")}
          </Label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={element.contentAlign === "left" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ contentAlign: "left" })}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={
                element.contentAlign === "center" ? "default" : "outline"
              }
              size="sm"
              onClick={() => onUpdate({ contentAlign: "center" })}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={element.contentAlign === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ contentAlign: "right" })}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={
                element.contentAlign === "justify" ? "default" : "outline"
              }
              size="sm"
              onClick={() => onUpdate({ contentAlign: "justify" })}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {renderColorPicker(
          t("properties_panel.background_color"),
          element.backgroundColor,
          (color) => onUpdate({ backgroundColor: color })
        )}
        <Separator />
        {renderColorPicker(
          t("properties_panel.text_color"),
          element.textColor,
          (color) => onUpdate({ textColor: color })
        )}
        <Separator />
        {renderColorPicker(
          t("properties_panel.border_color"),
          element.borderColor,
          (color) => onUpdate({ borderColor: color })
        )}
      </>
    );
  };

  const renderVisualSectionProperties = () => {
    if (element.type !== "visual-section") return null;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onUpdate({ imageUrl: event.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <>
        {/* Configurações da Form */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Configurações da Form</Label>

          {/* Navigation Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("properties_panel.navigation_hint")}
            </span>
            <Switch
              checked={element.canNavigate}
              onCheckedChange={(checked) => onUpdate({ canNavigate: checked })}
            />
          </div>

          {/* Hover Card Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Mostrar card ao passar o mouse
            </span>
            <Switch
              checked={element.showHoverCard}
              onCheckedChange={(checked) =>
                onUpdate({ showHoverCard: checked })
              }
            />
          </div>
        </div>

        {/* Hover Card Fields - Hidden in multi-selection */}
        {element.showHoverCard && !isMultiSelection && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Conteúdo do Card</Label>

              <div className="space-y-2">
                <Label className="text-xs">
                  {t("properties_panel.hover_title")}
                </Label>
                <Input
                  value={element.hoverTitle || ""}
                  onChange={(e) => onUpdate({ hoverTitle: e.target.value })}
                  placeholder={t("elements.visual_section.default_hover_title")}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">
                  {t("properties_panel.hover_subtitle")}
                </Label>
                <Input
                  value={element.hoverSubtitle || ""}
                  onChange={(e) => onUpdate({ hoverSubtitle: e.target.value })}
                  placeholder={t(
                    "elements.visual_section.default_hover_subtitle"
                  )}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">
                  {t("properties_panel.hover_description")}
                </Label>
                <Textarea
                  value={element.hoverDescription || ""}
                  onChange={(e) =>
                    onUpdate({ hoverDescription: e.target.value })
                  }
                  placeholder={t(
                    "elements.visual_section.default_hover_description"
                  )}
                  className="min-h-[120px] max-h-[120px] text-sm resize-none"
                  maxLength={500}
                />
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Appearance Section - Hidden in multi-selection */}
        {!isMultiSelection && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label>{t("properties_panel.image_background")}</Label>

              {element.imageUrl ? (
                <div className="flex flex-col items-center gap-3">
                  {/* Image Preview */}
                  <div className="w-full h-32 rounded overflow-hidden border-2">
                    <img
                      src={element.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Image Name */}
                  <p className="text-xs text-center text-muted-foreground">
                    {element.imageUrl.substring(0, 30)}...
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        document.getElementById("visual-image-input")?.click()
                      }
                    >
                      <ImageIcon className="w-3 h-3 mr-2" />
                      Nova Imagem
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onUpdate({ imageUrl: undefined })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  <input
                    id="visual-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document
                        .getElementById("visual-image-input-empty")
                        ?.click()
                    }
                  >
                    <ImageIcon className="w-3 h-3 mr-2" />
                    Escolher Arquivo
                  </Button>
                  <input
                    id="visual-image-input-empty"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
              )}
            </div>

            <Separator />
          </>
        )}

        {!element.imageUrl &&
          renderColorPicker(
            t("properties_panel.background_color"),
            element.backgroundColor,
            (color) => onUpdate({ backgroundColor: color })
          )}
      </>
    );
  };

  // Helper function to measure text dimensions (same as in text-element.tsx)
  const measureTextDimensions = (
    text: string,
    fontSize: number,
    fontWeight: string,
    maxWidth?: number
  ): { width: number; height: number } => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return { width: 50, height: 24 };

    context.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;

    const lineHeight = fontSize * 1.5;
    const horizontalPadding = 8;
    const verticalPadding = 8;

    if (!text || text.trim().length === 0) {
      return {
        width: 16,
        height: Math.max(Math.ceil(lineHeight) + verticalPadding, 24),
      };
    }

    const lines = text.split("\n");

    if (!maxWidth) {
      let maxLineWidth = 0;
      lines.forEach((line) => {
        if (line.length === 0) {
          maxLineWidth = Math.max(maxLineWidth, fontSize);
        } else {
          const metrics = context.measureText(line);
          maxLineWidth = Math.max(maxLineWidth, metrics.width);
        }
      });

      return {
        width: Math.max(Math.ceil(maxLineWidth) + horizontalPadding, 16),
        height: Math.max(
          Math.ceil(lines.length * lineHeight) + verticalPadding,
          24
        ),
      };
    }

    const contentWidth = Math.max(maxWidth - horizontalPadding, 8);
    let totalLines = 0;

    lines.forEach((line) => {
      if (line.length === 0) {
        totalLines += 1;
      } else {
        const words = line.split(" ");
        let currentLine = "";
        let lineCount = 0;

        words.forEach((word) => {
          const wordWidth = context.measureText(word).width;

          if (wordWidth > contentWidth) {
            if (currentLine) {
              lineCount++;
              currentLine = "";
            }

            let remainingWord = word;
            while (remainingWord.length > 0) {
              let chunk = "";
              for (let i = 0; i < remainingWord.length; i++) {
                const testChunk = chunk + remainingWord[i];
                const testWidth = context.measureText(testChunk).width;

                if (testWidth > contentWidth && chunk.length > 0) {
                  break;
                }
                chunk = testChunk;
              }

              if (chunk.length === 0) {
                chunk = remainingWord[0];
              }

              lineCount++;
              remainingWord = remainingWord.substring(chunk.length);
            }
          } else {
            const testLine = currentLine + (currentLine ? " " : "") + word;
            const metrics = context.measureText(testLine);

            if (metrics.width > contentWidth && currentLine) {
              lineCount++;
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
        });

        if (currentLine) lineCount++;
        totalLines += Math.max(lineCount, 1);
      }
    });

    const calculatedHeight = Math.max(
      Math.ceil(totalLines * lineHeight) + verticalPadding,
      24
    );

    return {
      width: maxWidth,
      height: calculatedHeight,
    };
  };

  // Handle fontSize change with dimension recalculation
  const handleFontSizeChange = (newFontSize: number) => {
    if (element.type !== "text") return;

    const fontWeight = element.fontWeight === "bold" ? "bold" : "normal";
    const oldFontSize = element.fontSize;
    const fontSizeRatio = newFontSize / oldFontSize;

    // Scale width proportionally to maintain text structure
    const scaledWidth = element.width * fontSizeRatio;

    // Recalculate dimensions with new font size and scaled width
    const dimensions = measureTextDimensions(
      element.content,
      newFontSize,
      fontWeight,
      scaledWidth
    );

    // Update fontSize and dimensions
    onUpdate({
      fontSize: newFontSize,
      width: dimensions.width,
      height: dimensions.height,
    });
  };

  const renderTextElementProperties = () => {
    if (element.type !== "text") return null;

    return (
      <>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.font_size")}
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                const newSize = Math.max(8, element.fontSize - 1);
                handleFontSizeChange(newSize);
                setFontSizeInput(String(newSize));
              }}
              disabled={element.fontSize <= 8}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="text"
              value={fontSizeInput}
              onChange={(e) => {
                const input = e.target.value;
                // Allow only numbers, comma, and dot
                if (/^[0-9,\.]*$/.test(input)) {
                  setFontSizeInput(input);
                }
              }}
              onBlur={() => {
                // Validate and update on blur
                const sanitized = fontSizeInput.replace(",", ".");
                const value = parseFloat(sanitized);
                if (!isNaN(value) && value >= 8 && value <= 128) {
                  handleFontSizeChange(value);
                  setFontSizeInput(String(value));
                } else {
                  // Reset to current valid value
                  setFontSizeInput(String(element.fontSize));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="h-8 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                const newSize = Math.min(128, element.fontSize + 1);
                handleFontSizeChange(newSize);
                setFontSizeInput(String(newSize));
              }}
              disabled={element.fontSize >= 128}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.font_weight")}
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={element.fontWeight === "normal" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ fontWeight: "normal" })}
              className={
                element.fontWeight === "normal"
                  ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none"
                  : ""
              }
            >
              <span className="text-sm font-normal">A</span>
            </Button>
            <Button
              variant={element.fontWeight === "bold" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ fontWeight: "bold" })}
              className={
                element.fontWeight === "bold"
                  ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none"
                  : ""
              }
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={
                element.fontWeight === "underline" ? "default" : "outline"
              }
              size="sm"
              onClick={() => onUpdate({ fontWeight: "underline" })}
              className={
                element.fontWeight === "underline"
                  ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none"
                  : ""
              }
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("properties_panel.text_align")}
          </Label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={element.textAlign === "left" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ textAlign: "left" })}
              className={
                element.textAlign === "left"
                  ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none"
                  : ""
              }
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === "center" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ textAlign: "center" })}
              className={
                element.textAlign === "center"
                  ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none"
                  : ""
              }
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === "right" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ textAlign: "right" })}
              className={
                element.textAlign === "right"
                  ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none"
                  : ""
              }
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant={element.textAlign === "justify" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ textAlign: "justify" })}
              className={
                element.textAlign === "justify"
                  ? "hover:bg-primary hover:shadow-glow hover:!translate-y-0 hover:!transform-none"
                  : ""
              }
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {renderColorPicker(
          t("properties_panel.text_color"),
          element.textColor,
          (color) => onUpdate({ textColor: color })
        )}
      </>
    );
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-background border-l flex flex-col shadow-2xl z-50">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">{t("properties_panel.title")}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Multi-selection indicator */}
      {isMultiSelection && (
        <div className="px-4 pt-4">
          <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
            <p className="text-sm font-medium text-primary">
              {selectedCount} elementos selecionados
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              As alterações serão aplicadas a todos
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Type-specific properties */}
          <div className="space-y-4">
            {renderParagraphBlockProperties()}
            {renderSectionBlockProperties()}
            {renderImageBlockProperties()}
            {renderVisualSectionProperties()}
            {renderTextElementProperties()}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button variant="outline" className="w-full" onClick={onDuplicate}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicar
        </Button>
        <Button variant="destructive" className="w-full" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          {t("properties_panel.delete")}
        </Button>
      </div>

    </div>
  );
}
