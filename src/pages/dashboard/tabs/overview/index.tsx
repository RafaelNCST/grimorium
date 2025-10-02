import { useState, useCallback, useMemo } from "react";

import {
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { NOTE_COLORS_CONSTANT } from "./constants/note-colors";
import { MOCK_OVERVIEW_STATS } from "./mocks/mock-overview-data";
import {
  PropsOverviewTab,
  IStickyNote,
  IGoals,
  IStoryProgress,
  ISection,
} from "./types/overview-types";
import { OverviewView } from "./view";

export function OverviewTab({ book, bookId, isCustomizing }: PropsOverviewTab) {
  const [goals, setGoals] = useState<IGoals>({
    wordsPerDay: 500,
    chaptersPerWeek: 2,
  });
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [storyProgress, setStoryProgress] = useState<IStoryProgress>({
    estimatedArcs: 3,
    estimatedChapters: 25,
    completedArcs: 1,
    currentArcProgress: 45,
  });
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [authorSummary, setAuthorSummary] = useState(book.authorSummary || "");
  const [isEditingAuthorSummary, setIsEditingAuthorSummary] = useState(false);
  const [storySummary, setStorySummary] = useState(book.storySummary || "");
  const [isEditingStorySummary, setIsEditingStorySummary] = useState(false);
  const [stickyNotes, setStickyNotes] = useState<IStickyNote[]>([
    {
      id: "1",
      content:
        "Desenvolver melhor o relacionamento entre protagonista e mentor",
      color: NOTE_COLORS_CONSTANT[0],
      x: 20,
      y: 20,
    },
    {
      id: "2",
      content: "Adicionar mais detalhes sobre o sistema de magia",
      color: NOTE_COLORS_CONSTANT[1],
      x: 250,
      y: 80,
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [draggedNoteData, setDraggedNoteData] = useState<IStickyNote | null>(
    null
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [sections, setSections] = useState<ISection[]>([
    {
      id: "stats",
      type: "stats",
      title: "Estatísticas",
      visible: true,
      component: null,
    },
    {
      id: "progress",
      type: "progress",
      title: "Progressão da História",
      visible: true,
      component: null,
    },
    {
      id: "author-summary",
      type: "author-summary",
      title: "Resumo do Autor",
      visible: true,
      component: null,
    },
    {
      id: "story-summary",
      type: "story-summary",
      title: "Resumo da História",
      visible: true,
      component: null,
    },
    {
      id: "notes-board",
      type: "notes-board",
      title: "Quadro de Lembretes",
      visible: true,
      component: null,
    },
  ]);

  const overviewStats = useMemo(
    () => ({
      ...MOCK_OVERVIEW_STATS,
      lastChapterNumber: book.chapters,
    }),
    [book.chapters]
  );

  const storyProgressPercentage = useMemo(() => {
    const totalProgress =
      storyProgress.completedArcs + storyProgress.currentArcProgress / 100;
    return Math.round((totalProgress / storyProgress.estimatedArcs) * 100);
  }, [
    storyProgress.completedArcs,
    storyProgress.currentArcProgress,
    storyProgress.estimatedArcs,
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleSectionVisibility = useCallback((sectionId: string) => {
    setSections((sections) =>
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  }, []);

  const handleSectionDragStart = useCallback((event: any) => {
    setActiveId(event.active.id);
  }, []);

  const handleSectionDragEnd = useCallback((event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const handleSaveGoals = useCallback(() => {
    setIsEditingGoals(false);
  }, []);

  const handleSaveAuthorSummary = useCallback(() => {
    setIsEditingAuthorSummary(false);
  }, []);

  const handleSaveStorySummary = useCallback(() => {
    setIsEditingStorySummary(false);
  }, []);

  const handleAddNote = useCallback(() => {
    if (newNote.trim()) {
      const newStickyNote: IStickyNote = {
        id: Date.now().toString(),
        content: newNote,
        color:
          NOTE_COLORS_CONSTANT[
            Math.floor(Math.random() * NOTE_COLORS_CONSTANT.length)
          ],
        x: Math.random() * 300,
        y: Math.random() * 200,
      };
      setStickyNotes((prev) => [...prev, newStickyNote]);
      setNewNote("");
    }
  }, [newNote]);

  const handleDeleteNote = useCallback((id: string) => {
    setStickyNotes((notes) => notes.filter((note) => note.id !== id));
  }, []);

  const handleEditNote = useCallback((id: string, newContent: string) => {
    setStickyNotes((notes) =>
      notes.map((note) =>
        note.id === id ? { ...note, content: newContent } : note
      )
    );
  }, []);

  const handleNoteDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active && active.id.toString().startsWith("note-")) {
      const noteId = active.id.toString().replace("note-", "");
      setStickyNotes((notes) => {
        const note = notes.find((n) => n.id === noteId);
        if (note) {
          setActiveNoteId(noteId);
          setDraggedNoteData(note);
        }
        return notes;
      });
    }
  }, []);

  const handleNoteDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;

    if (active && active.id.toString().startsWith("note-")) {
      const noteId = active.id.toString().replace("note-", "");

      setStickyNotes((notes) =>
        notes.map((note) => {
          if (note.id === noteId) {
            const newX = Math.max(0, note.x + delta.x);
            const newY = Math.max(0, note.y + delta.y);
            return { ...note, x: newX, y: newY };
          }
          return note;
        })
      );
    }

    setActiveNoteId(null);
    setDraggedNoteData(null);
  }, []);

  return (
    <OverviewView
      book={book}
      bookId={bookId}
      isCustomizing={isCustomizing}
      goals={goals}
      isEditingGoals={isEditingGoals}
      storyProgress={storyProgress}
      isEditingProgress={isEditingProgress}
      authorSummary={authorSummary}
      isEditingAuthorSummary={isEditingAuthorSummary}
      storySummary={storySummary}
      isEditingStorySummary={isEditingStorySummary}
      stickyNotes={stickyNotes}
      newNote={newNote}
      editingNote={editingNote}
      editContent={editContent}
      sections={sections}
      activeId={activeId}
      activeNoteId={activeNoteId}
      draggedNoteData={draggedNoteData}
      overviewStats={overviewStats}
      storyProgressPercentage={storyProgressPercentage}
      sensors={sensors}
      onGoalsChange={setGoals}
      onEditingGoalsChange={setIsEditingGoals}
      onStoryProgressChange={setStoryProgress}
      onEditingProgressChange={setIsEditingProgress}
      onAuthorSummaryChange={setAuthorSummary}
      onEditingAuthorSummaryChange={setIsEditingAuthorSummary}
      onStorySummaryChange={setStorySummary}
      onEditingStorySummaryChange={setIsEditingStorySummary}
      onNewNoteChange={setNewNote}
      onEditingNoteChange={setEditingNote}
      onEditContentChange={setEditContent}
      onSectionsChange={setSections}
      onActiveIdChange={setActiveId}
      onActiveNoteIdChange={setActiveNoteId}
      onDraggedNoteDataChange={setDraggedNoteData}
      onAddNote={handleAddNote}
      onDeleteNote={handleDeleteNote}
      onEditNote={handleEditNote}
      onSaveGoals={handleSaveGoals}
      onSaveAuthorSummary={handleSaveAuthorSummary}
      onSaveStorySummary={handleSaveStorySummary}
      onToggleSectionVisibility={handleToggleSectionVisibility}
      onNoteDragStart={handleNoteDragStart}
      onNoteDragEnd={handleNoteDragEnd}
      onSectionDragStart={handleSectionDragStart}
      onSectionDragEnd={handleSectionDragEnd}
    />
  );
}
