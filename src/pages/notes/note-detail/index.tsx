import { useState, useCallback, useEffect, useRef } from "react";

import { useNavigate, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { useNotesStore } from "@/stores/notes-store";
import { INote, INoteLink, PaperMode } from "@/types/note-types";

import { NoteDetailView } from "./view";

import type { JSONContent } from "@tiptap/react";

export function NoteDetailPage() {
  const navigate = useNavigate();
  const { noteId } = useParams({ strict: false });
  const { t } = useTranslation(["errors"]);

  // Store
  const getNoteById = useNotesStore((state) => state.getNoteById);
  const updateNoteNameInCache = useNotesStore(
    (state) => state.updateNoteNameInCache
  );
  const updateNoteContentInCache = useNotesStore(
    (state) => state.updateNoteContentInCache
  );
  const updateNotePaperModeInCache = useNotesStore(
    (state) => state.updateNotePaperModeInCache
  );
  const deleteNoteFromCache = useNotesStore(
    (state) => state.deleteNoteFromCache
  );
  const updateNoteLinksInCache = useNotesStore(
    (state) => state.updateNoteLinksInCache
  );

  // State
  const [note, setNote] = useState<INote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [showDeleteStep1, setShowDeleteStep1] = useState(false);
  const [showDeleteStep2, setShowDeleteStep2] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [showLinksManager, setShowLinksManager] = useState(false);

  // Auto-save debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch note on mount
  useEffect(() => {
    async function fetchNote() {
      if (!noteId) return;

      setIsLoading(true);
      const fetchedNote = await getNoteById(noteId);
      setNote(fetchedNote);
      if (fetchedNote) {
        setEditedName(fetchedNote.name);
      }
      setIsLoading(false);
    }

    fetchNote();
  }, [noteId, getNoteById]);

  // Handlers
  const handleBack = useCallback(() => {
    navigate({ to: "/notes" });
  }, [navigate]);

  const handleContentChange = useCallback(
    async (content: JSONContent) => {
      if (!note) return;

      // Update local state immediately
      setNote((prev) => (prev ? { ...prev, content } : null));

      // Debounced save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await updateNoteContentInCache(note.id, content);
        } catch (error) {
          console.error("Error saving content:", error);
        } finally {
          setIsSaving(false);
        }
      }, 500);
    },
    [note, updateNoteContentInCache]
  );

  const handleStartEditName = useCallback(() => {
    if (note) {
      setEditedName(note.name);
      setIsEditingName(true);
    }
  }, [note]);

  const handleSaveName = useCallback(async () => {
    if (!note || !editedName.trim()) return;

    try {
      await updateNoteNameInCache(note.id, editedName.trim());
      setNote((prev) => (prev ? { ...prev, name: editedName.trim() } : null));
      setIsEditingName(false);
    } catch (error) {
      console.error("Error saving name:", error);
    }
  }, [note, editedName, updateNoteNameInCache]);

  const handleCancelEditName = useCallback(() => {
    if (note) {
      setEditedName(note.name);
    }
    setIsEditingName(false);
  }, [note]);

  const handlePaperModeChange = useCallback(
    async (mode: PaperMode) => {
      if (!note) return;

      try {
        await updateNotePaperModeInCache(note.id, mode);
        setNote((prev) => (prev ? { ...prev, paperMode: mode } : null));
      } catch (error) {
        console.error("Error changing paper mode:", error);
      }
    },
    [note, updateNotePaperModeInCache]
  );

  const handleDeleteStep1Continue = useCallback(() => {
    if (!note) return;
    if (deleteConfirmName.trim() === note.name) {
      setShowDeleteStep1(false);
      setShowDeleteStep2(true);
    }
  }, [note, deleteConfirmName]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!note) return;

    try {
      await deleteNoteFromCache(note.id);
      navigate({ to: "/notes" });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }, [note, deleteNoteFromCache, navigate]);

  const handleLinksChange = useCallback(
    async (links: INoteLink[]) => {
      if (!note) return;

      try {
        // Generate IDs for new links
        const linksWithIds = links.map((link) => ({
          ...link,
          id: link.id || crypto.randomUUID(),
          createdAt: link.createdAt || new Date().toISOString(),
        }));

        await updateNoteLinksInCache(note.id, linksWithIds);
        setNote((prev) => (prev ? { ...prev, links: linksWithIds } : null));
      } catch (error) {
        console.error("Error updating links:", error);
      }
    },
    [note, updateNoteLinksInCache]
  );

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">
          {t("errors:not_found.annotation")}
        </p>
      </div>
    );
  }

  return (
    <NoteDetailView
      note={note}
      isSaving={isSaving}
      isEditingName={isEditingName}
      editedName={editedName}
      showDeleteStep1={showDeleteStep1}
      showDeleteStep2={showDeleteStep2}
      deleteConfirmName={deleteConfirmName}
      showLinksManager={showLinksManager}
      onBack={handleBack}
      onContentChange={handleContentChange}
      onStartEditName={handleStartEditName}
      onEditedNameChange={setEditedName}
      onSaveName={handleSaveName}
      onCancelEditName={handleCancelEditName}
      onPaperModeChange={handlePaperModeChange}
      onShowDeleteStep1Change={setShowDeleteStep1}
      onShowDeleteStep2Change={setShowDeleteStep2}
      onDeleteConfirmNameChange={setDeleteConfirmName}
      onDeleteStep1Continue={handleDeleteStep1Continue}
      onDeleteConfirm={handleDeleteConfirm}
      onShowLinksManagerChange={setShowLinksManager}
      onLinksChange={handleLinksChange}
    />
  );
}
