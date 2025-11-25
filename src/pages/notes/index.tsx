import { useState, useCallback, useEffect, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useNotesStore } from "@/stores/notes-store";
import {
  EntityType,
  INote,
  INoteFormData,
  NoteSortOrder,
} from "@/types/note-types";

import { NotesView } from "./view";

export function NotesPage() {
  const navigate = useNavigate();

  // Store
  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const addNote = useNotesStore((state) => state.addNote);
  const deleteNotesFromCache = useNotesStore(
    (state) => state.deleteNotesFromCache
  );

  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeletionMode, setIsDeletionMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<NoteSortOrder>("recent");
  const [entityTypeFilters, setEntityTypeFilters] = useState<EntityType[]>([]);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by search term (name only)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((note) => note.name.toLowerCase().includes(term));
    }

    // Filter by entity type
    if (entityTypeFilters.length > 0) {
      result = result.filter((note) =>
        note.links.some((link) => entityTypeFilters.includes(link.entityType))
      );
    }

    // Sort
    if (sortOrder === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // recent - by updatedAt DESC
      result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return result;
  }, [notes, searchTerm, sortOrder, entityTypeFilters]);

  // Handlers
  const handleBackToDashboard = useCallback(() => {
    navigate({ to: "/" });
  }, [navigate]);

  const handleNoteClick = useCallback(
    (noteId: string) => {
      if (isDeletionMode) {
        setSelectedNoteIds((prev) =>
          prev.includes(noteId)
            ? prev.filter((id) => id !== noteId)
            : [...prev, noteId]
        );
      } else {
        navigate({
          to: "/notes/$noteId",
          params: { noteId },
        });
      }
    },
    [isDeletionMode, navigate]
  );

  const handleCreateNote = useCallback(
    async (formData: INoteFormData) => {
      const now = new Date().toISOString();
      const newNote: INote = {
        id: crypto.randomUUID(),
        name: formData.name,
        content: undefined,
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
        // Navigate to the new note
        navigate({
          to: "/notes/$noteId",
          params: { noteId: newNote.id },
        });
      } catch (error) {
        console.error("Error creating note:", error);
      }
    },
    [addNote, navigate]
  );

  const handleToggleDeletionMode = useCallback(() => {
    if (isDeletionMode) {
      // Exiting deletion mode
      setSelectedNoteIds([]);
    }
    setIsDeletionMode(!isDeletionMode);
  }, [isDeletionMode]);

  const handleCancelDeletionMode = useCallback(() => {
    setIsDeletionMode(false);
    setSelectedNoteIds([]);
  }, []);

  const handleDeleteSelectedNotes = useCallback(() => {
    if (selectedNoteIds.length > 0) {
      setShowDeleteConfirmModal(true);
    }
  }, [selectedNoteIds]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteNotesFromCache(selectedNoteIds);
      setShowDeleteConfirmModal(false);
      setSelectedNoteIds([]);
      setIsDeletionMode(false);
    } catch (error) {
      console.error("Error deleting notes:", error);
    }
  }, [selectedNoteIds, deleteNotesFromCache]);

  const handleEntityTypeFilterToggle = useCallback((entityType: EntityType) => {
    setEntityTypeFilters((prev) =>
      prev.includes(entityType)
        ? prev.filter((t) => t !== entityType)
        : [...prev, entityType]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setEntityTypeFilters([]);
    setSortOrder("recent");
  }, []);

  return (
    <NotesView
      notes={notes}
      filteredNotes={filteredNotes}
      isLoading={isLoading}
      searchTerm={searchTerm}
      sortOrder={sortOrder}
      entityTypeFilters={entityTypeFilters}
      showCreateModal={showCreateModal}
      isDeletionMode={isDeletionMode}
      selectedNoteIds={selectedNoteIds}
      showDeleteConfirmModal={showDeleteConfirmModal}
      onBackToDashboard={handleBackToDashboard}
      onSearchTermChange={setSearchTerm}
      onSortOrderChange={setSortOrder}
      onEntityTypeFilterToggle={handleEntityTypeFilterToggle}
      onClearFilters={handleClearFilters}
      onNoteClick={handleNoteClick}
      onShowCreateModalChange={setShowCreateModal}
      onCreateNote={handleCreateNote}
      onToggleDeletionMode={handleToggleDeletionMode}
      onCancelDeletionMode={handleCancelDeletionMode}
      onDeleteSelectedNotes={handleDeleteSelectedNotes}
      onConfirmDelete={handleConfirmDelete}
      onShowDeleteConfirmModalChange={setShowDeleteConfirmModal}
    />
  );
}
