import { memo, useMemo } from "react";

import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import {
  ArrowLeft,
  Trash2,
  Link,
  Sun,
  Moon,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { INote, INoteLink, PaperMode } from "@/types/note-types";

import { NoteEditor } from "./components/note-editor";
import { NoteLinksList } from "./components/note-links-list";

import type { JSONContent } from "@tiptap/react";

interface NoteDetailViewProps {
  note: INote;
  isSaving: boolean;
  isEditingName: boolean;
  editedName: string;
  showDeleteStep1: boolean;
  showDeleteStep2: boolean;
  deleteConfirmName: string;
  showLinksManager: boolean;
  onBack: () => void;
  onContentChange: (content: JSONContent) => void;
  onStartEditName: () => void;
  onEditedNameChange: (name: string) => void;
  onSaveName: () => void;
  onCancelEditName: () => void;
  onPaperModeChange: (mode: PaperMode) => void;
  onShowDeleteStep1Change: (show: boolean) => void;
  onShowDeleteStep2Change: (show: boolean) => void;
  onDeleteConfirmNameChange: (name: string) => void;
  onDeleteStep1Continue: () => void;
  onDeleteConfirm: () => void;
  onShowLinksManagerChange: (show: boolean) => void;
  onLinksChange: (links: INoteLink[]) => void;
}

function NoteDetailViewComponent({
  note,
  isSaving,
  isEditingName,
  editedName,
  showDeleteStep1,
  showDeleteStep2,
  deleteConfirmName,
  showLinksManager,
  onBack,
  onContentChange,
  onStartEditName,
  onEditedNameChange,
  onSaveName,
  onCancelEditName,
  onPaperModeChange,
  onShowDeleteStep1Change,
  onShowDeleteStep2Change,
  onDeleteConfirmNameChange,
  onDeleteStep1Continue,
  onDeleteConfirm,
  onShowLinksManagerChange,
  onLinksChange,
}: NoteDetailViewProps) {
  const { t, i18n } = useTranslation("note-detail");

  const locale = i18n.language === "pt" ? ptBR : enUS;

  const formattedCreatedAt = useMemo(
    () => format(new Date(note.createdAt), "PPP", { locale }),
    [note.createdAt, locale]
  );

  const formattedUpdatedAt = useMemo(
    () => format(new Date(note.updatedAt), "PPP 'às' HH:mm", { locale }),
    [note.updatedAt, locale]
  );

  const isDeleteNameMatch = deleteConfirmName.trim() === note.name;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Name */}
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedName}
                onChange={(e) => onEditedNameChange(e.target.value)}
                className="w-64"
                maxLength={200}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveName();
                  if (e.key === "Escape") onCancelEditName();
                }}
              />
              <Button size="icon" variant="ghost" onClick={onSaveName}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onCancelEditName}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <h1
              className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
              onDoubleClick={onStartEditName}
              title="Duplo clique para editar"
            >
              {note.name || t("header.untitled")}
            </h1>
          )}

          {/* Save indicator */}
          {isSaving && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{t("autosave.saving")}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Links button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onShowLinksManagerChange(true)}
              >
                <Link className="h-4 w-4" />
                {note.links.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {note.links.length}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("links.manage")}</TooltipContent>
          </Tooltip>

          {/* Paper mode toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onPaperModeChange(
                    note.paperMode === "light" ? "dark" : "light"
                  )
                }
              >
                {note.paperMode === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {note.paperMode === "light"
                ? t("paper_mode.dark")
                : t("paper_mode.light")}
            </TooltipContent>
          </Tooltip>

          {/* Delete button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onShowDeleteStep1Change(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("delete.button")}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Dates */}
      <div className="px-6 py-2 border-b bg-muted/30 flex items-center gap-6 text-sm text-muted-foreground">
        <span>
          {t("dates.created")}: {formattedCreatedAt}
        </span>
        <span>
          {t("dates.updated")}: {formattedUpdatedAt}
        </span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <NoteEditor
          content={note.content}
          paperMode={note.paperMode}
          onChange={onContentChange}
        />
      </div>

      {/* Links Manager Dialog */}
      <Dialog open={showLinksManager} onOpenChange={onShowLinksManagerChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("links.title")}</DialogTitle>
          </DialogHeader>
          <NoteLinksList links={note.links} onLinksChange={onLinksChange} />
        </DialogContent>
      </Dialog>

      {/* Delete Step 1 Dialog */}
      <AlertDialog
        open={showDeleteStep1}
        onOpenChange={onShowDeleteStep1Change}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.step1.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.step1.message", { noteName: note.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="delete-confirm">
              {t("delete.step1.input_label")}
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmName}
              onChange={(e) => onDeleteConfirmNameChange(e.target.value)}
              placeholder={t("delete.step1.input_placeholder")}
            />
            {deleteConfirmName && !isDeleteNameMatch && (
              <p className="text-sm text-destructive">
                {t("delete.step1.name_mismatch")}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                onDeleteConfirmNameChange("");
              }}
            >
              {t("delete.step1.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteStep1Continue}
              disabled={!isDeleteNameMatch}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete.step1.continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Step 2 Dialog */}
      <AlertDialog
        open={showDeleteStep2}
        onOpenChange={onShowDeleteStep2Change}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete.step2.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete.step2.message", { noteName: note.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                onDeleteConfirmNameChange("");
              }}
            >
              {t("delete.step2.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete.step2.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const NoteDetailView = memo(NoteDetailViewComponent);
