import { Settings, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CURSOR_COLORS } from "../types/editor-settings";

import type {
  EditorSettings,
  AutoScrollMode,
  CursorColor,
} from "../types/editor-settings";

interface EditorSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

export function EditorSettingsModal({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: EditorSettingsModalProps) {
  const { t } = useTranslation(["chapter-editor", "dialogs"]);

  const updateSetting = <K extends keyof EditorSettings>(
    key: K,
    value: EditorSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const FONT_OPTIONS = [
    { value: "Inter", label: "Inter" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Courier New", label: "Courier New" },
    { value: "Arial", label: "Arial" },
    { value: "sans-serif", label: "Sans Serif" },
  ];

  const handleFontSizeIncrement = () => {
    const newSize = Math.min(24, settings.fontSize + 1);
    updateSetting("fontSize", newSize);
  };

  const handleFontSizeDecrement = () => {
    const newSize = Math.max(8, settings.fontSize - 1);
    updateSetting("fontSize", newSize);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[75vw] max-h-[85vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <DialogTitle>{t("editor_settings_modal.title")}</DialogTitle>
            </div>
            <DialogDescription>
              {t("editor_settings_modal.description")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 [&>*:not(:last-child)]:mb-6">
          {/* First Row: Auto Scroll + Typography */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Auto Scroll */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">
                  {t("editor_settings_modal.auto_scroll.title")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("editor_settings_modal.auto_scroll.description")}
                </p>
              </div>
              <Select
                value={settings.autoScrollMode}
                onValueChange={(value: AutoScrollMode) =>
                  updateSetting("autoScrollMode", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">
                    {t("editor_settings_modal.auto_scroll.none")}
                  </SelectItem>
                  <SelectItem value="near-end">
                    {t("editor_settings_modal.auto_scroll.near_end")}
                  </SelectItem>
                  <SelectItem value="center">
                    {t("editor_settings_modal.auto_scroll.center")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visual Toggles */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  {t("editor_settings_modal.visual_elements.title")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("editor_settings_modal.visual_elements.description")}
                </p>
              </div>

              {/* Annotation Highlights */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    {t(
                      "editor_settings_modal.visual_elements.annotation_highlights"
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "editor_settings_modal.visual_elements.annotation_highlights_description"
                    )}
                  </p>
                </div>
                <Switch
                  checked={settings.showAnnotationHighlights}
                  onCheckedChange={(checked) =>
                    updateSetting("showAnnotationHighlights", checked)
                  }
                />
              </div>

              {/* Spell Check */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    {t("editor_settings_modal.visual_elements.spell_check")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "editor_settings_modal.visual_elements.spell_check_description"
                    )}
                  </p>
                </div>
                <Switch
                  checked={settings.enableSpellCheck}
                  onCheckedChange={(checked) =>
                    updateSetting("enableSpellCheck", checked)
                  }
                />
              </div>

              {/* Summary Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    {t("dialogs:editor_settings.summary_and_entities")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "editor_settings_modal.visual_elements.summary_section_description"
                    )}
                  </p>
                </div>
                <Switch
                  checked={settings.showSummarySection}
                  onCheckedChange={(checked) =>
                    updateSetting("showSummarySection", checked)
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Typography Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">
                {t("editor_settings_modal.typography.title")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("editor_settings_modal.typography.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Font Family */}
              <div className="space-y-2">
                <Label>
                  {t("editor_settings_modal.typography.font_family")}
                </Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) => updateSetting("fontFamily", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem
                        key={font.value}
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "editor_settings_modal.typography.font_family_description"
                  )}
                </p>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label>{t("editor_settings_modal.typography.font_size")}</Label>
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={settings.fontSize}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 8 && value <= 24) {
                          updateSetting("fontSize", value);
                        }
                      }}
                      min={8}
                      max={24}
                      className="flex-1 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <div className="flex flex-col gap-0.5">
                      <Tooltip delayDuration={300} disableHoverableContent>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleFontSizeIncrement}
                            className="h-5 px-2"
                            disabled={settings.fontSize >= 24}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {t(
                              "editor_settings_modal.typography.increase_size"
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip delayDuration={300} disableHoverableContent>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleFontSizeDecrement}
                            className="h-5 px-2"
                            disabled={settings.fontSize <= 8}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {t(
                              "editor_settings_modal.typography.decrease_size"
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {t("editor_settings_modal.typography.pt")}
                    </span>
                  </div>
                </TooltipProvider>
                <p className="text-xs text-muted-foreground">
                  {t("editor_settings_modal.typography.font_size_description")}
                </p>
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>
                  {t("editor_settings_modal.typography.line_height")}
                </Label>
                <span className="text-sm text-muted-foreground">
                  {settings.lineHeight}
                </span>
              </div>
              <Slider
                value={[settings.lineHeight]}
                onValueChange={([value]) => updateSetting("lineHeight", value)}
                min={1.0}
                max={2.5}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {t("editor_settings_modal.typography.line_height_description")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Third Row: Theme + Cursor Color */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">
                  {t("dialogs:editor_settings.visual_theme")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("editor_settings_modal.visual_theme.description")}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>
                    {t("editor_settings_modal.visual_theme.reduce_eye_strain")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "editor_settings_modal.visual_theme.reduce_eye_strain_description"
                    )}
                  </p>
                </div>
                <Switch
                  checked={settings.sepiaMode}
                  onCheckedChange={(checked) =>
                    updateSetting("sepiaMode", checked)
                  }
                />
              </div>
            </div>

            {/* Cursor Color */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">
                  {t("editor_settings_modal.cursor_color.title")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("editor_settings_modal.cursor_color.description")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CURSOR_COLORS).map(([key, color]) => {
                  const colorKey = key as CursorColor;
                  const isSelected = settings.cursorColor === colorKey;

                  // Labels amigáveis
                  const labels: Record<CursorColor, string> = {
                    default: t("cursor_colors.default"),
                    primary: t("cursor_colors.primary"),
                    blue: t("cursor_colors.blue"),
                    green: t("cursor_colors.green"),
                    purple: t("cursor_colors.purple"),
                    orange: t("cursor_colors.orange"),
                  };

                  return (
                    <button
                      key={key}
                      onClick={() => updateSetting("cursorColor", colorKey)}
                      className={`
                        flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all
                        ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }
                      `}
                    >
                      <div
                        className="w-5 h-5 rounded border border-border flex-shrink-0"
                        style={{
                          background: color.startsWith("hsl") ? color : color,
                        }}
                      />
                      <span className="text-sm font-medium">
                        {labels[colorKey]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-background rounded-b-lg">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("editor_settings_modal.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
