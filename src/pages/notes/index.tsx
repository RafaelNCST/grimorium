import { useState, useCallback, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useBookStore } from "@/stores/book-store";
import { useNotesStore } from "@/stores/notes-store";
import type { INote, INoteLink, NoteColor } from "@/types/note-types";

import { DEFAULT_NOTE_COLOR } from "./constants";
import { NotesView } from "./view";

import type { JSONContent } from "@tiptap/react";

export function NotesPage() {
  const navigate = useNavigate();

  // Book Store
  const currentBook = useBookStore((state) => state.currentBook);
  const books = useBookStore((state) => state.books);
  const setCurrentBook = useBookStore((state) => state.setCurrentBook);

  // Notes Store
  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const addNote = useNotesStore((state) => state.addNote);
  const updateNoteInCache = useNotesStore((state) => state.updateNoteInCache);
  const deleteNoteFromCache = useNotesStore(
    (state) => state.deleteNoteFromCache
  );

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Auto-select first book if no current book
  useEffect(() => {
    if (!currentBook && books.length > 0) {
      setCurrentBook(books[0]);
    }
  }, [currentBook, books, setCurrentBook]);

  // Fetch notes on mount or when book changes
  useEffect(() => {
    if (currentBook?.id) {
      fetchNotes(false, currentBook.id);
    }
  }, [fetchNotes, currentBook?.id]);

  // Handlers
  const handleBackToDashboard = useCallback(() => {
    if (currentBook?.id) {
      navigate({
        to: "/dashboard/$dashboardId",
        params: { dashboardId: currentBook.id },
      });
    } else {
      navigate({ to: "/" });
    }
  }, [navigate, currentBook?.id]);

  const handleNoteClick = useCallback((noteId: string) => {
    setSelectedNoteId(noteId || null);
  }, []);

  const handleCreateNote = useCallback(
    async (formData: {
      content: JSONContent;
      color: NoteColor;
      links: INoteLink[];
    }) => {
      if (!currentBook?.id) {
        console.error("No book selected");
        return;
      }

      const now = new Date().toISOString();

      // Calculate max order
      const maxOrder = notes.reduce((max, note) => {
        const noteOrder = note.order ?? new Date(note.createdAt).getTime();
        return Math.max(max, noteOrder);
      }, 0);

      const newNote: INote = {
        id: crypto.randomUUID(),
        bookId: currentBook.id,
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
    [notes, addNote, currentBook?.id]
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
