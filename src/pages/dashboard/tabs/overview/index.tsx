import { useState, useCallback, useMemo } from "react";

import {
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { NOTE_COLORS_CONSTANT } from "./constants/note-colors";
import {
  PropsOverviewTab,
  IStickyNote,
  IGoals,
  IStoryProgress,
  ISection,
  IChecklistItem,
} from "./types/overview-types";
import { OverviewView } from "./view";

export function OverviewTab({ book, bookId, isCustomizing }: PropsOverviewTab) {
  const [goals, setGoals] = useState<IGoals>({
    wordsPerDay: 0,
    chaptersPerWeek: 0,
  });
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [storyProgress, setStoryProgress] = useState<IStoryProgress>({
    estimatedArcs: 0,
    estimatedChapters: 0,
    completedArcs: 0,
    currentArcProgress: 0,
  });
  const [authorSummary, setAuthorSummary] = useState(book.authorSummary || "");
  const [storySummary, setStorySummary] = useState(book.storySummary || "");
  const [isEditingSummaries, setIsEditingSummaries] = useState(false);
  const [stickyNotes, setStickyNotes] = useState<IStickyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [draggedNoteData, setDraggedNoteData] = useState<IStickyNote | null>(
    null
  );
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [checklistItems, setChecklistItems] = useState<IChecklistItem[]>([]);
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
      id: "summaries",
      type: "summaries",
      title: "Resumos",
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
    {
      id: "checklist",
      type: "checklist",
      title: "Lista de Tarefas",
      visible: true,
      component: null,
    },
  ]);

  const overviewStats = useMemo(
    () => ({
      totalWords: 0,
      totalCharacters: 0,
      totalChapters: book.chapters || 0,
      lastChapterNumber: 0,
      lastChapterName: "",
      averagePerWeek: 0,
      averagePerMonth: 0,
      chaptersInProgress: 0,
      chaptersFinished: 0,
      chaptersDraft: 0,
      chaptersPlanning: 0,
      averageWordsPerChapter: 0,
      averageCharactersPerChapter: 0,
    }),
    [book.chapters]
  );

  const storyProgressPercentage = useMemo(() => {
    if (storyProgress.estimatedArcs === 0) return 0;
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

  const handleMoveSectionUp = useCallback((sectionId: string) => {
    setSections((sections) => {
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index <= 0) return sections;

      const newSections = [...sections];
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
      return newSections;
    });
  }, []);

  const handleMoveSectionDown = useCallback((sectionId: string) => {
    setSections((sections) => {
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index < 0 || index >= sections.length - 1) return sections;

      const newSections = [...sections];
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
      return newSections;
    });
  }, []);

  const handleSaveGoals = useCallback(() => {
    setIsEditingGoals(false);
  }, []);

  const handleSaveSummaries = useCallback(() => {
    setIsEditingSummaries(false);
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

  const handleAddChecklistItem = useCallback((text: string) => {
    const newItem: IChecklistItem = {
      id: Date.now().toString(),
      text,
      checked: false,
    };
    setChecklistItems((prev) => [...prev, newItem]);
  }, []);

  const handleToggleChecklistItem = useCallback((id: string) => {
    setChecklistItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const handleEditChecklistItem = useCallback((id: string, text: string) => {
    setChecklistItems((items) =>
      items.map((item) => (item.id === id ? { ...item, text } : item))
    );
  }, []);

  const handleDeleteChecklistItem = useCallback((id: string) => {
    setChecklistItems((items) => items.filter((item) => item.id !== id));
  }, []);

  return (
    <OverviewView
      book={book}
      bookId={bookId}
      isCustomizing={isCustomizing}
      goals={goals}
      isEditingGoals={isEditingGoals}
      storyProgress={storyProgress}
      authorSummary={authorSummary}
      storySummary={storySummary}
      isEditingSummaries={isEditingSummaries}
      stickyNotes={stickyNotes}
      newNote={newNote}
      editingNote={editingNote}
      editContent={editContent}
      sections={sections}
      activeNoteId={activeNoteId}
      draggedNoteData={draggedNoteData}
      overviewStats={overviewStats}
      storyProgressPercentage={storyProgressPercentage}
      sensors={sensors}
      checklistItems={checklistItems}
      onGoalsChange={setGoals}
      onEditingGoalsChange={setIsEditingGoals}
      onAuthorSummaryChange={setAuthorSummary}
      onStorySummaryChange={setStorySummary}
      onEditingSummariesChange={setIsEditingSummaries}
      onNewNoteChange={setNewNote}
      onEditingNoteChange={setEditingNote}
      onEditContentChange={setEditContent}
      onSectionsChange={setSections}
      onActiveNoteIdChange={setActiveNoteId}
      onDraggedNoteDataChange={setDraggedNoteData}
      onAddNote={handleAddNote}
      onDeleteNote={handleDeleteNote}
      onEditNote={handleEditNote}
      onSaveGoals={handleSaveGoals}
      onSaveSummaries={handleSaveSummaries}
      onToggleSectionVisibility={handleToggleSectionVisibility}
      onMoveSectionUp={handleMoveSectionUp}
      onMoveSectionDown={handleMoveSectionDown}
      onNoteDragStart={handleNoteDragStart}
      onNoteDragEnd={handleNoteDragEnd}
      onAddChecklistItem={handleAddChecklistItem}
      onToggleChecklistItem={handleToggleChecklistItem}
      onEditChecklistItem={handleEditChecklistItem}
      onDeleteChecklistItem={handleDeleteChecklistItem}
    />
  );
}
