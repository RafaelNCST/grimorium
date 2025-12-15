import { memo } from "react";

import { ArrowLeft, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { INote, INoteLink, NoteColor } from "@/types/note-types";

import { CreateNoteModal } from "./components/create-note-modal";
import { NoteDetailModal } from "./components/note-detail-modal";
import { NoteGrid } from "./components/note-grid";
import { NotesEmptyState } from "./components/notes-empty-state";

import type { JSONContent } from "@tiptap/react";

interface NotesViewProps {
  notes: INote[];
  isLoading: boolean;
  showCreateModal: boolean;
  selectedNoteId: string | null;
  onBackToDashboard: () => void;
  onNoteClick: (noteId: string) => void;
  onShowCreateModalChange: (show: boolean) => void;
  onCreateNote: (formData: {
    content: JSONContent;
    color: NoteColor;
    links: INoteLink[];
  }) => void;
  onReorder: (reorderedNotes: INote[]) => void;
  onUpdateNote: (noteId: string, updates: Partial<INote>) => void;
  onDeleteNote: (noteId: string) => void;
}

function NotesViewComponent({
  notes,
  isLoading,
  showCreateModal,
  selectedNoteId,
  onBackToDashboard,
  onNoteClick,
  onShowCreateModalChange,
  onCreateNote,
  onReorder,
  onUpdateNote,
  onDeleteNote,
}: NotesViewProps) {
  const { t } = useTranslation("notes");

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackToDashboard}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{t("page.title")}</h1>

        <div className="flex-1" />

        <Button
          variant="magical"
          onClick={() => onShowCreateModalChange(true)}
          className="gap-2 animate-glow"
        >
          <Plus className="h-4 w-4" />
          {t("page.new_note")}
        </Button>
      </div>

      {/* Content - Grid */}
      <div className="flex-1 overflow-auto">
        {notes.length === 0 ? (
          <NotesEmptyState />
        ) : (
          <div className="p-6">
            <NoteGrid
              notes={notes}
              onNoteClick={onNoteClick}
              onReorder={onReorder}
              onUpdateNote={onUpdateNote}
              onDeleteNote={onDeleteNote}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateNoteModal
        open={showCreateModal}
        onOpenChange={onShowCreateModalChange}
        onCreateNote={onCreateNote}
      />

      <NoteDetailModal
        note={selectedNote}
        open={selectedNoteId !== null}
        onOpenChange={(open) => {
          if (!open) onNoteClick("");
        }}
        onUpdate={onUpdateNote}
        onDelete={onDeleteNote}
      />
    </div>
  );
}

export const NotesView = memo(NotesViewComponent);
