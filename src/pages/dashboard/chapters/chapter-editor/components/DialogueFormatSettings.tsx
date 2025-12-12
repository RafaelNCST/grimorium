import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import type { DialogueFormats } from "../types/search-types";

interface DialogueFormatSettingsProps {
  open: boolean;
  formats: DialogueFormats;
  onOpenChange: (open: boolean) => void;
  onApply: (formats: DialogueFormats) => void;
}

interface FormatOption {
  id: keyof DialogueFormats;
  labelKey: string;
  symbol: string;
  exampleKey: string;
}

export function DialogueFormatSettings({
  open,
  formats,
  onOpenChange,
  onApply,
}: DialogueFormatSettingsProps) {
  const { t } = useTranslation("chapter-editor");
  const [localFormats, setLocalFormats] = useState<DialogueFormats>(formats);

  const formatOptions: FormatOption[] = [
    {
      id: "doubleQuotes",
      labelKey: "dialogue_formats.double_quotes",
      symbol: '" "',
      exampleKey: "dialogue_formats.example_double",
    },
    {
      id: "singleQuotes",
      labelKey: "dialogue_formats.single_quotes",
      symbol: "' '",
      exampleKey: "dialogue_formats.example_single",
    },
    {
      id: "emDash",
      labelKey: "dialogue_formats.em_dash",
      symbol: "—",
      exampleKey: "dialogue_formats.example_dash",
    },
  ];

  // Update local state when formats prop changes
  useEffect(() => {
    setLocalFormats(formats);
  }, [formats]);

  const handleToggle = (formatId: keyof DialogueFormats) => {
    setLocalFormats((prev) => {
      const newFormats = { ...prev, [formatId]: !prev[formatId] };

      // Ensure at least one format is selected
      const hasAtLeastOne = Object.values(newFormats).some((value) => value);
      if (!hasAtLeastOne) {
        return prev; // Don't allow deselecting the last one
      }

      return newFormats;
    });
  };

  const handleSelectAll = () => {
    setLocalFormats({
      doubleQuotes: true,
      singleQuotes: true,
      emDash: true,
    });
  };

  const handleApply = () => {
    onApply(localFormats);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalFormats(formats); // Reset to original
    onOpenChange(false);
  };

  const selectedCount = Object.values(localFormats).filter(Boolean).length;
  const isOnlyOneSelected = selectedCount === 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{t("dialogue_formats.title")}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            {t("dialogue_formats.description")}
          </p>

          <div className="space-y-3">
            {formatOptions.map((option) => {
              const isChecked = localFormats[option.id];
              const isDisabled = isOnlyOneSelected && isChecked;

              return (
                <div
                  key={option.id}
                  className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    id={option.id}
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(option.id)}
                    disabled={isDisabled}
                  />
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor={option.id}
                      className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer"
                    >
                      <span className="font-mono text-primary">
                        {option.symbol}
                      </span>
                      <span>{t(option.labelKey)}</span>
                    </label>
                    <p className="text-xs text-muted-foreground font-mono">
                      {t("dialogue_formats.example_prefix")}{" "}
                      {t(option.exampleKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={handleSelectAll}
          >
            <Checkbox
              id="select-all"
              checked={selectedCount === formatOptions.length}
              onCheckedChange={handleSelectAll}
            />
            <div className="flex-1 space-y-1">
              <label
                htmlFor="select-all"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {t("dialogue_formats.select_all")}
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleApply}>
            {t("dialogue_formats.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
