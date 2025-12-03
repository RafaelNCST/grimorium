import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate, useParams, useSearch } from "@tanstack/react-router";

import { useBookStore } from "@/stores/book-store";
import { useNotesStore } from "@/stores/notes-store";
import type {
  EntityType,
  INote,
  INoteLink,
  NoteColor,
} from "@/types/note-types";

import { EntityNotesView } from "./view";

import type { JSONContent } from "@tiptap/react";

export function EntityNotesPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const search = useSearch({ strict: false }) as { entityName?: string };

  const entityId = params.entityId as string;
  const entityType = params.entityType as EntityType;
  const entityName = search.entityName || "Entity";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const addNote = useNotesStore((state) => state.addNote);
  const updateNoteInCache = useNotesStore((state) => state.updateNoteInCache);
  const updateNoteLinksInCache = useNotesStore(
    (state) => state.updateNoteLinksInCache
  );
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const reorderNotes = useNotesStore((state) => state.reorderNotes);
  const currentBook = useBookStore((state) => state.currentBook);

  // Filter notes linked to this entity
  const filteredNotes = useMemo(
    () =>
      notes.filter((note) =>
        note.links.some((link) => link.entityId === entityId)
      ),
    [notes, entityId]
  );

  // Load notes on mount
  useEffect(() => {
    const loadNotes = async () => {
      if (currentBook) {
        await useNotesStore.getState().fetchNotes(false, currentBook.id);
      }
    };
    loadNotes();
  }, [currentBook]);

  const handleBack = useCallback(() => {
    // Use window.history.back() to preserve application state
    window.history.back();
  }, []);

  const handleNoteClick = useCallback((noteId: string) => {
    setSelectedNoteId(noteId);
  }, []);

  const handleCreateNote = useCallback(
    async (formData: {
      content: JSONContent;
      color: NoteColor;
      links: INoteLink[];
    }) => {
      if (!currentBook?.id) {
        console.error("No current book found");
        return;
      }

      const now = new Date().toISOString();

      // Calculate max order
      const maxOrder = notes.reduce((max, note) => {
        const noteOrder = note.order ?? new Date(note.createdAt).getTime();
        return Math.max(max, noteOrder);
      }, 0);

      // Create note with automatic link to this entity
      const autoLink: INoteLink = {
        id: crypto.randomUUID(),
        entityId,
        entityType,
        bookId: currentBook.id,
        entityName,
        createdAt: now,
      };

      const newNote: INote = {
        id: crypto.randomUUID(),
        bookId: currentBook.id,
        name: "", // DEPRECATED - keeping for backwards compatibility
        content: formData.content,
        color: formData.color,
        order: maxOrder + 1000, // Add with gap
        paperMode: "light",
        links: [autoLink], // Only link to this entity
        createdAt: now,
        updatedAt: now,
      };

      try {
        await addNote(newNote);
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error creating note:", error);
      }
    },
    [entityId, entityType, entityName, addNote, currentBook, notes]
  );

  const handleReorder = useCallback(
    async (reorderedNotes: typeof filteredNotes) => {
      // Update all reordered notes
      for (const note of reorderedNotes) {
        try {
          await updateNoteInCache(note.id, { order: note.order });
        } catch (error) {
          console.error(`Error updating note ${note.id}:`, error);
        }
      }
    },
    [updateNoteInCache]
  );

  const handleUpdateNote = useCallback(
    async (noteId: string, updates: Partial<INote>) => {
      try {
        // Separate links from other updates
        const { links, ...otherUpdates } = updates;

        // Update links if provided
        if (links !== undefined) {
          await updateNoteLinksInCache(noteId, links);
        }

        // Update other fields if any
        if (Object.keys(otherUpdates).length > 0) {
          await updateNoteInCache(noteId, otherUpdates);
        }
      } catch (error) {
        console.error("Error updating note:", error);
      }
    },
    [updateNoteInCache, updateNoteLinksInCache]
  );

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      try {
        await deleteNote(noteId);
        setSelectedNoteId(null);
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    },
    [deleteNote]
  );

  return (
    <EntityNotesView
      notes={filteredNotes}
      isLoading={isLoading}
      showCreateModal={showCreateModal}
      selectedNoteId={selectedNoteId}
      entityId={entityId}
      entityName={entityName}
      entityType={entityType}
      onBack={handleBack}
      onNoteClick={handleNoteClick}
      onShowCreateModalChange={setShowCreateModal}
      onCreateNote={handleCreateNote}
      onReorder={handleReorder}
      onUpdateNote={handleUpdateNote}
      onDeleteNote={handleDeleteNote}
    />
  );
}
