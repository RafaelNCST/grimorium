import { memo } from "react";

import { ArrowLeft, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import type {
  INote,
  INoteLink,
  NoteColor,
  EntityType,
} from "@/types/note-types";

import { CreateNoteModal } from "../components/create-note-modal";
import { EntityNotesEmptyState } from "../components/entity-notes-empty-state";
import { NoteDetailModal } from "../components/note-detail-modal";
import { NoteGrid } from "../components/note-grid";

import type { JSONContent } from "@tiptap/react";

interface EntityNotesViewProps {
  notes: INote[];
  isLoading: boolean;
  showCreateModal: boolean;
  selectedNoteId: string | null;
  entityId: string;
  entityName: string;
  entityType: EntityType;
  onBack: () => void;
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

function EntityNotesViewComponent({
  notes,
  isLoading,
  showCreateModal,
  selectedNoteId,
  entityId,
  entityName,
  entityType,
  onBack,
  onNoteClick,
  onShowCreateModalChange,
  onCreateNote,
  onReorder,
  onUpdateNote,
  onDeleteNote,
}: EntityNotesViewProps) {
  const { t } = useTranslation("notes");

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">
            {t("entity_notes.title", { entityName })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("entity_notes.subtitle", {
              count: notes.length,
            })}
          </p>
        </div>

        <Button
          variant="magical"
          onClick={() => onShowCreateModalChange(true)}
          className="gap-2 animate-glow"
        >
          <Plus className="h-4 w-4" />
          {t("entity_notes.new_note")}
        </Button>
      </div>

      {/* Content - Grid */}
      <div className="flex-1 overflow-auto p-6">
        {notes.length === 0 ? (
          <EntityNotesEmptyState entityName={entityName} />
        ) : (
          <NoteGrid
            notes={notes}
            onNoteClick={onNoteClick}
            onReorder={onReorder}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
          />
        )}
      </div>

      {/* Modals */}
      <CreateNoteModal
        open={showCreateModal}
        onOpenChange={onShowCreateModalChange}
        onCreateNote={onCreateNote}
        showManageLinks={false}
      />

      <NoteDetailModal
        note={selectedNote}
        open={selectedNoteId !== null}
        onOpenChange={(open) => {
          if (!open) onNoteClick("");
        }}
        onUpdate={onUpdateNote}
        onDelete={onDeleteNote}
        showManageLinks={false}
      />
    </div>
  );
}

export const EntityNotesView = memo(EntityNotesViewComponent);
