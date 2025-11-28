import { useState, useCallback, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";
import type { JSONContent } from "@tiptap/react";

import { useNotesStore } from "@/stores/notes-store";
import type { INote, INoteLink, NoteColor } from "@/types/note-types";

import { DEFAULT_NOTE_COLOR } from "./constants";
import { NotesView } from "./view";

export function NotesPage() {
  const navigate = useNavigate();

  // Store
  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const addNote = useNotesStore((state) => state.addNote);
  const updateNoteInCache = useNotesStore((state) => state.updateNoteInCache);
  const deleteNoteFromCache = useNotesStore((state) => state.deleteNoteFromCache);

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handlers
  const handleBackToDashboard = useCallback(() => {
    navigate({ to: "/" });
  }, [navigate]);

  const handleNoteClick = useCallback((noteId: string) => {
    setSelectedNoteId(noteId || null);
  }, []);

  const handleCreateNote = useCallback(
    async (formData: {
      content: JSONContent;
      color: NoteColor;
      links: INoteLink[];
    }) => {
      const now = new Date().toISOString();

      // Calculate max order
      const maxOrder = notes.reduce((max, note) => {
        const noteOrder = note.order ?? new Date(note.createdAt).getTime();
        return Math.max(max, noteOrder);
      }, 0);

      const newNote: INote = {
        id: crypto.randomUUID(),
        name: "", // DEPRECATED - keeping for backwards compatibility
        content: formData.content,
        color: formData.color,
        order: maxOrder + 1000, // Add with gap
        paperMode: "light",
        links: formData.links.map((link) => ({
          ...link,
          id: crypto.randomUUID(),
          createdAt: now,
        })),
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
    [notes, addNote]
  );

  const handleReorder = useCallback(
    async (reorderedNotes: INote[]) => {
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
        await updateNoteInCache(noteId, updates);
      } catch (error) {
        console.error("Error updating note:", error);
      }
    },
    [updateNoteInCache]
  );

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      try {
        await deleteNoteFromCache(noteId);
        setSelectedNoteId(null);
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    },
    [deleteNoteFromCache]
  );

  return (
    <NotesView
      notes={notes}
      isLoading={isLoading}
      showCreateModal={showCreateModal}
      selectedNoteId={selectedNoteId}
      onBackToDashboard={handleBackToDashboard}
      onNoteClick={handleNoteClick}
      onShowCreateModalChange={setShowCreateModal}
      onCreateNote={handleCreateNote}
      onReorder={handleReorder}
      onUpdateNote={handleUpdateNote}
      onDeleteNote={handleDeleteNote}
    />
  );
}
