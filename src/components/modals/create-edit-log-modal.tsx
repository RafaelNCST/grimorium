import { useState, useEffect } from "react";

import { Circle, Star, Zap, FileText, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { IEntityLog, ImportanceLevel } from "@/types/entity-log-types";

interface CreateEditLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (log: Partial<IEntityLog>) => void;
  editingLog?: IEntityLog | null;
}

export function CreateEditLogModal({
  open,
  onOpenChange,
  onSave,
  editingLog,
}: CreateEditLogModalProps) {
  const { t } = useTranslation("entity-logs");
  const isEditing = Boolean(editingLog);

  // Importance options with icons and colors
  const IMPORTANCE_OPTIONS: Array<{
    value: ImportanceLevel;
    label: string;
    icon: typeof Circle;
    color: string;
    bgColor: string;
  }> = [
    {
      value: "minor",
      label: t("fields.importance_minor"),
      icon: Circle,
      color: "text-gray-500",
      bgColor: "bg-gray-500/10 border-gray-500/30",
    },
    {
      value: "major",
      label: t("fields.importance_major"),
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      value: "critical",
      label: t("fields.importance_critical"),
      icon: Zap,
      color: "text-red-500",
      bgColor: "bg-red-500/10 border-red-500/30",
    },
  ];

  // Form state
  const [chapterNumber, setChapterNumber] = useState("");
  const [importance, setImportance] = useState<ImportanceLevel | "">("");
  const [description, setDescription] = useState("");

  // Reset form when modal opens/closes or editing log changes
  useEffect(() => {
    if (open) {
      if (editingLog) {
        setChapterNumber(editingLog.chapterNumber || "");
        setImportance(editingLog.importance);
        setDescription(editingLog.description);
      } else {
        setChapterNumber("1");
        setImportance("");
        setDescription("");
      }
    }
  }, [open, editingLog]);

  // Validation
  const isValid = () => {
    if (!chapterNumber.trim()) return false;
    if (!importance) return false;
    if (!description.trim()) return false;
    return true;
  };

  const handleSave = () => {
    if (!isValid()) return;

    const logData: Partial<IEntityLog> = {
      momentType: "chapter",
      chapterNumber,
      importance: importance as ImportanceLevel,
      description,
    };

    onSave(logData);
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after animation
    setTimeout(() => {
      setChapterNumber("1");
      setImportance("");
      setDescription("");
    }, 200);
  };

  // Chapter number increment/decrement
  const handleIncrement = () => {
    const current = parseFloat(chapterNumber) || 0;
    setChapterNumber(String(Math.floor(current) + 1));
  };

  const handleDecrement = () => {
    const current = parseFloat(chapterNumber) || 0;
    const newValue = Math.max(1, Math.floor(current) - 1);
    setChapterNumber(String(newValue));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      setChapterNumber(inputValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isEditing ? t("create_edit_modal.title_edit") : t("create_edit_modal.title_create")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("create_edit_modal.description_edit")
              : t("create_edit_modal.description_create")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Capítulo */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1 text-primary">
              {t("fields.chapter_label")}
              <span className="text-destructive">*</span>
            </Label>

            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={chapterNumber}
                onChange={handleNumberChange}
                className="w-20 h-9 text-center font-mono font-semibold"
                placeholder="1"
              />
              <div className="flex flex-col gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleIncrement}
                  className="h-4 w-5 p-0"
                >
                  <ChevronUp className="h-3 w-3 text-muted-foreground" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDecrement}
                  className="h-4 w-5 p-0"
                  disabled={parseFloat(chapterNumber) <= 1}
                >
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Importância */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1 text-primary">
              {t("fields.importance")}
              <span className="text-destructive">*</span>
            </Label>

            <div className="grid grid-cols-3 gap-3">
              {IMPORTANCE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = importance === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setImportance(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                      option.bgColor,
                      isSelected
                        ? "border-primary shadow-md"
                        : "border-transparent hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-6 w-6", option.color)} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-primary">
              {t("fields.description")}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("fields.description_placeholder")}
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <div className="flex justify-end">
              <p className="text-xs text-muted-foreground">
                {description.length}/1000
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="secondary" onClick={handleClose}>
            {t("create_edit_modal.cancel")}
          </Button>
          <Button
            variant="magical"
            onClick={handleSave}
            disabled={!isValid()}
          >
            {isEditing ? (
              t("create_edit_modal.save")
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {t("create_edit_modal.create")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
