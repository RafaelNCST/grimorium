import { useState } from "react";

import { X, Star, Trash2, Edit, Save, Plus } from "lucide-react";
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

import type { Annotation, AnnotationNote } from "../types";

interface AnnotationsSidebarProps {
  annotation: Annotation | null;
  onClose: () => void;
  onAddNote: (text: string, isImportant: boolean) => void;
  onEditNote: (noteId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleImportant: (noteId: string) => void;
}

export function AnnotationsSidebar({
  annotation,
  onClose,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onToggleImportant,
}: AnnotationsSidebarProps) {
  const { t } = useTranslation("chapter-editor");
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  if (!annotation) return null;

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
        <p className="text-sm text-muted-foreground mb-1">{t("annotations.selected_text")}:</p>
        <p className="text-sm font-medium italic">"{annotation.text}"</p>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {annotation.notes.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            {t("annotations.no_annotations")}
          </div>
        ) : (
          annotation.notes.map((note) => (
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
                    <Button size="sm" variant="magical" onClick={handleSaveEdit}>
                      <Save className="w-3 h-3 mr-1" />
                      {t("annotations.save")}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
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
                              note.isImportant && "text-amber-500 hover:text-amber-600"
                            )}
                            onClick={() => onToggleImportant(note.id)}
                          >
                            <Star
                              className={cn("w-4 h-4", note.isImportant && "fill-current")}
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
                            variant="ghost-bright"
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
                    {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : ''}
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
