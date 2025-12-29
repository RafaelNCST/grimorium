import { useState } from "react";

import { X, Star, Trash2, Edit, Save, Plus, MapPin, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { Annotation, AnnotationNote, AnnotationColor } from "../types";
import { ANNOTATION_COLORS } from "../types";

interface AnnotationsSidebarProps {
  annotation: Annotation | null;
  onClose: () => void;
  onAddNote: (text: string, isImportant: boolean) => void;
  onEditNote: (noteId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleImportant: (noteId: string) => void;
  onNavigateToAnnotation?: (annotationId: string) => void;
  onColorChange?: (annotationId: string, color: AnnotationColor) => void;
}

export function AnnotationsSidebar({
  annotation,
  onClose,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onToggleImportant,
  onNavigateToAnnotation,
  onColorChange,
}: AnnotationsSidebarProps) {
  const { t } = useTranslation("chapter-editor");
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!annotation) return null;

  const currentColor = annotation.color || "purple";

  // Sort notes: important notes first, then by creation date (newest first)
  const sortedNotes = [...annotation.notes].sort((a, b) => {
    // Important notes come first
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    // If both are important or both are not, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      onAddNote(newNoteText, false);
      setNewNoteText("");
    }
  };

  const handleStartEdit = (note: AnnotationNote) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.text);
  };

  const handleSaveEdit = () => {
    if (editingNoteId && editingNoteText.trim()) {
      onEditNote(editingNoteId, editingNoteText);
      setEditingNoteId(null);
      setEditingNoteText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed right-0 top-8 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-lg">{t("annotations.create")}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Selected Text */}
        <div className="p-4 bg-muted/30 border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">
            {t("annotations.selected_text")}:
          </p>
          <button
            onClick={() => onNavigateToAnnotation?.(annotation.id)}
            className="text-sm font-medium italic text-left w-full hover:text-primary transition-colors cursor-pointer flex items-start gap-2 group"
          >
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
            <span className="flex-1">&quot;{annotation.text}&quot;</span>
          </button>
        </div>

        {/* Color Picker */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              {t("annotations.color_label")}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="h-7 px-2"
            >
              <Palette className="w-4 h-4 mr-1" />
              {showColorPicker
                ? t("annotations.close_picker")
                : t("annotations.choose_color")}
            </Button>
          </div>

          {/* Current Color Preview */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: ANNOTATION_COLORS[currentColor].weak }}
            />
            <span className="text-sm font-medium">
              {t(`annotation_colors.${currentColor}`)}
            </span>
          </div>

          {/* Color Options */}
          {showColorPicker && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {(Object.keys(ANNOTATION_COLORS) as AnnotationColor[]).map(
                (colorKey) => {
                  const colorData = ANNOTATION_COLORS[colorKey];
                  const isSelected = colorKey === currentColor;

                  return (
                    <Tooltip key={colorKey}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            onColorChange?.(annotation.id, colorKey);
                            setShowColorPicker(false);
                          }}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all hover:scale-105",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex gap-1">
                            {/* Weak tone */}
                            <div
                              className="w-5 h-5 rounded border border-border"
                              style={{ backgroundColor: colorData.weak }}
                            />
                            {/* Strong tone */}
                            <div
                              className="w-5 h-5 rounded border border-border"
                              style={{ backgroundColor: colorData.strong }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {t(`annotation_colors.${colorKey}`)}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {t("annotations.color_tone_tooltip", {
                            color: t(`annotation_colors.${colorKey}`),
                          })}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Notes List */}
        <div
          className={cn(
            "flex-1 min-h-0",
            sortedNotes.length === 0
              ? "flex items-center justify-center"
              : "overflow-y-auto p-4 space-y-3"
          )}
        >
          {sortedNotes.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm px-4">
              {t("annotations.no_annotations")}
            </div>
          ) : (
            sortedNotes.map((note) => (
              <Card
                key={note.id}
                className={cn(
                  "p-3",
                  note.isImportant && "border-2 border-amber-500 bg-amber-500/5"
                )}
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      className="min-h-[80px]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="magical"
                        onClick={handleSaveEdit}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        {t("annotations.save")}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCancelEdit}
                      >
                        {t("annotations.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm flex-1">{note.text}</p>
                      <div className="flex gap-1 shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={cn(
                                "h-7 w-7",
                                note.isImportant &&
                                  "text-amber-500 hover:text-amber-600"
                              )}
                              onClick={() => onToggleImportant(note.id)}
                            >
                              <Star
                                className={cn(
                                  "w-4 h-4",
                                  note.isImportant && "fill-current"
                                )}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("annotations.mark_important")}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => handleStartEdit(note)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("annotations.edit")}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost-destructive"
                              className="h-7 w-7"
                              onClick={() => onDeleteNote(note.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("annotations.delete")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {note.updatedAt
                        ? new Date(note.updatedAt).toLocaleString()
                        : ""}
                    </p>
                  </>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Add Note */}
        <div className="p-4 border-t border-border space-y-2">
          <Textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("annotations.annotation_text")}
            rows={3}
            className="resize-none"
          />
          <Button
            onClick={handleAddNote}
            disabled={!newNoteText.trim()}
            className="w-full"
            variant="magical"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("annotations.add_annotation")}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
