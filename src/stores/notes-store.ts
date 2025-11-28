import { create } from "zustand";

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  updateNoteContent,
  updateNoteName,
  updateNotePaperMode,
  deleteNote,
  deleteNotes,
  addNoteLink,
  removeNoteLink,
  updateNoteLinks,
} from "@/lib/db/notes.service";
import { INote, INoteLink, PaperMode } from "@/types/note-types";

import type { JSONContent } from "@tiptap/react";

interface NotesState {
  notes: INote[];
  isLoading: boolean;
  lastFetched: number;
  hasAnimated: boolean;

  // Fetch
  fetchNotes: (forceRefresh?: boolean) => Promise<void>;
  getNoteById: (noteId: string) => Promise<INote | null>;

  // CRUD
  addNote: (note: INote) => Promise<void>;
  updateNoteInCache: (
    noteId: string,
    updates: Partial<Omit<INote, "id" | "createdAt" | "links">>
  ) => Promise<void>;
  updateNoteContentInCache: (
    noteId: string,
    content: JSONContent
  ) => Promise<void>;
  updateNoteNameInCache: (noteId: string, name: string) => Promise<void>;
  updateNotePaperModeInCache: (
    noteId: string,
    paperMode: PaperMode
  ) => Promise<void>;
  deleteNoteFromCache: (noteId: string) => Promise<void>;
  deleteNotesFromCache: (noteIds: string[]) => Promise<void>;

  // Links
  addNoteLinkInCache: (noteId: string, link: INoteLink) => Promise<void>;
  removeNoteLinkFromCache: (noteId: string, linkId: string) => Promise<void>;
  updateNoteLinksInCache: (noteId: string, links: INoteLink[]) => Promise<void>;

  // Utils
  invalidateCache: () => void;
  getNotes: () => INote[];
  setHasAnimated: () => void;
}

// Promise para rastrear fetch em andamento
let fetchingPromise: Promise<void> | null = null;

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  lastFetched: 0,
  hasAnimated: false,

  fetchNotes: async (forceRefresh = false) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromise && !forceRefresh) {
      return fetchingPromise;
    }

    const promise = (async () => {
      const state = get();

      // Verificar cache se não for forceRefresh
      if (!forceRefresh && state.notes.length > 0) {
        return;
      }

      // Marcar como loading
      set({ isLoading: true });

      try {
        const fetchedNotes = await getAllNotes();
        const now = Date.now();

        // Apply migration for notes without color or order
        const notes = fetchedNotes.map((note) => {
          const needsMigration = !note.color || note.order === undefined;

          if (needsMigration) {
            return {
              ...note,
              color: note.color || ("sepia" as const),
              order: note.order ?? new Date(note.createdAt).getTime(),
            };
          }

          return note;
        });

        set({
          notes,
          isLoading: false,
          lastFetched: now,
        });
      } catch (error) {
        console.error("Error fetching notes:", error);
        set({ isLoading: false });
        throw error;
      }
    })();

    fetchingPromise = promise;

    try {
      await promise;
    } finally {
      fetchingPromise = null;
    }
  },

  getNoteById: async (noteId: string) => {
    // First check cache
    const cached = get().notes.find((n) => n.id === noteId);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from DB
    try {
      const note = await getNoteById(noteId);
      if (note) {
        // Add to cache
        set((state) => ({
          notes: [...state.notes, note],
        }));
      }
      return note;
    } catch (error) {
      console.error("Error fetching note by id:", error);
      return null;
    }
  },

  addNote: async (note: INote) => {
    try {
      await createNote(note);

      set((state) => ({
        notes: [note, ...state.notes],
      }));
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  },

  updateNoteInCache: async (noteId, updates) => {
    try {
      await updateNote(noteId, updates);

      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? { ...n, ...updates, updatedAt: new Date().toISOString() }
            : n
        ),
      }));
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  updateNoteContentInCache: async (noteId, content) => {
    try {
      await updateNoteContent(noteId, content);

      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? { ...n, content, updatedAt: new Date().toISOString() }
            : n
        ),
      }));
    } catch (error) {
      console.error("Error updating note content:", error);
      throw error;
    }
  },

  updateNoteNameInCache: async (noteId, name) => {
    try {
      await updateNoteName(noteId, name);

      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? { ...n, name, updatedAt: new Date().toISOString() }
            : n
        ),
      }));
    } catch (error) {
      console.error("Error updating note name:", error);
      throw error;
    }
  },

  updateNotePaperModeInCache: async (noteId, paperMode) => {
    try {
      await updateNotePaperMode(noteId, paperMode);

      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? { ...n, paperMode, updatedAt: new Date().toISOString() }
            : n
        ),
      }));
    } catch (error) {
      console.error("Error updating note paper mode:", error);
      throw error;
    }
  },

  deleteNoteFromCache: async (noteId) => {
    try {
      await deleteNote(noteId);

      set((state) => ({
        notes: state.notes.filter((n) => n.id !== noteId),
      }));
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },

  deleteNotesFromCache: async (noteIds) => {
    try {
      await deleteNotes(noteIds);

      set((state) => ({
        notes: state.notes.filter((n) => !noteIds.includes(n.id)),
      }));
    } catch (error) {
      console.error("Error deleting notes:", error);
      throw error;
    }
  },

  addNoteLinkInCache: async (noteId, link) => {
    try {
      await addNoteLink(noteId, link);

      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? {
                ...n,
                links: [...n.links, link],
                updatedAt: new Date().toISOString(),
              }
            : n
        ),
      }));
    } catch (error) {
      console.error("Error adding note link:", error);
      throw error;
    }
  },

  removeNoteLinkFromCache: async (noteId, linkId) => {
    try {
      await removeNoteLink(linkId);

      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? {
                ...n,
                links: n.links.filter((l) => l.id !== linkId),
                updatedAt: new Date().toISOString(),
              }
            : n
        ),
      }));
    } catch (error) {
      console.error("Error removing note link:", error);
      throw error;
    }
  },

  updateNoteLinksInCache: async (noteId, links) => {
    try {
      await updateNoteLinks(noteId, links);

      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? { ...n, links, updatedAt: new Date().toISOString() }
            : n
        ),
      }));
    } catch (error) {
      console.error("Error updating note links:", error);
      throw error;
    }
  },

  invalidateCache: () => {
    set({
      notes: [],
      isLoading: false,
      lastFetched: 0,
    });
  },

  getNotes: () => get().notes,

  setHasAnimated: () => {
    set({ hasAnimated: true });
  },
}));
