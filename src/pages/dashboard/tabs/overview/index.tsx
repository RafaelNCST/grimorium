import { useState, useCallback, useMemo, useEffect } from "react";

import {
  DragStartEvent,
  DragEndEvent,
  DragMoveEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  Modifier,
} from "@dnd-kit/core";
import { useTranslation } from "react-i18next";

import { NOTE_COLORS_CONSTANT } from "./constants/note-colors";
import { useOverviewPersistence } from "./hooks/useOverviewPersistence";
import {
  PropsOverviewTab,
  IStickyNote,
  IGoals,
  IStoryProgress,
  ISection,
  IChecklistItem,
} from "./types/overview-types";
import { OverviewView } from "./view";

// Custom modifier to restrict dragging within the notes board container
const restrictToNotesBoard: Modifier = ({
  transform,
  draggingNodeRect,
  containerNodeRect,
}) => {
  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  const padding = 0;

  // Calculate the maximum allowed positions
  const maxX = containerNodeRect.width - draggingNodeRect.width - padding;
  const maxY = containerNodeRect.height - draggingNodeRect.height - padding;

  // Calculate the current position (initial position + transform delta)
  const currentX = draggingNodeRect.left - containerNodeRect.left + transform.x;
  const currentY = draggingNodeRect.top - containerNodeRect.top + transform.y;

  // Constrain the position within boundaries
  const constrainedX = Math.max(padding, Math.min(maxX, currentX));
  const constrainedY = Math.max(padding, Math.min(maxY, currentY));

  // Return adjusted transform that respects boundaries
  return {
    ...transform,
    x: constrainedX - (draggingNodeRect.left - containerNodeRect.left),
    y: constrainedY - (draggingNodeRect.top - containerNodeRect.top),
  };
};

export function OverviewTab({ book, bookId, isCustomizing }: PropsOverviewTab) {
  const { t } = useTranslation("overview");
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
  const [selectedColor, setSelectedColor] = useState<string>(
    NOTE_COLORS_CONSTANT[0]
  );
  const [notesBoardHeight, setNotesBoardHeight] = useState(400);
  const [hasInitialized, setHasInitialized] = useState(false);
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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Persistence hook
  const { loadOverviewData } = useOverviewPersistence(
    {
      bookId,
      goals,
      storyProgress,
      stickyNotes,
      checklistItems,
      sections,
      authorSummary,
      storySummary,
    },
    {
      setGoals,
      setStoryProgress,
      setStickyNotes,
      setChecklistItems,
      setSections,
    }
  );

  // Load data on mount
  useEffect(() => {
    if (!hasInitialized) {
      loadOverviewData().then(() => {
        setHasInitialized(true);
      });
    }
  }, [hasInitialized, loadOverviewData]);

  // Set default note if no notes exist after loading
  useEffect(() => {
    if (hasInitialized && stickyNotes.length === 0) {
      const defaultNote: IStickyNote = {
        id: "default-note",
        content: t("notes_board.default_note"),
        color: NOTE_COLORS_CONSTANT[0],
        x: 10,
        y: 10,
        zIndex: 10,
      };
      setStickyNotes([defaultNote]);
    }
  }, [hasInitialized, stickyNotes.length, t]);

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
      // Find highest z-index among existing notes
      const maxZIndex = stickyNotes.reduce(
        (max, note) => Math.max(max, note.zIndex),
        0
      );

      const newStickyNote: IStickyNote = {
        id: Date.now().toString(),
        content: newNote,
        color: selectedColor,
        x: 10,
        y: 10,
        zIndex: maxZIndex + 1,
      };
      setStickyNotes((prev) => [...prev, newStickyNote]);
      setNewNote("");
    }
  }, [newNote, selectedColor, stickyNotes]);

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

  const handleColorChange = useCallback((id: string, color: string) => {
    setStickyNotes((notes) =>
      notes.map((note) => (note.id === id ? { ...note, color } : note))
    );
  }, []);

  const handleBringToFront = useCallback((id: string) => {
    setStickyNotes((notes) => {
      // Find highest z-index among all notes
      const maxZIndex = notes.reduce(
        (max, note) => Math.max(max, note.zIndex),
        0
      );

      // Set the selected note's z-index to be higher than all others
      return notes.map((note) =>
        note.id === id ? { ...note, zIndex: maxZIndex + 1 } : note
      );
    });
  }, []);

  const handleSendToBack = useCallback((id: string) => {
    setStickyNotes((notes) => {
      // Find lowest z-index among all notes
      const minZIndex = notes.reduce(
        (min, note) => Math.min(min, note.zIndex),
        Infinity
      );

      // Set the selected note's z-index to be lower than all others
      return notes.map((note) =>
        note.id === id ? { ...note, zIndex: minZIndex - 1 } : note
      );
    });
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

  const handleNoteDragMove = useCallback((_event: DragMoveEvent) => {
    // No need to update position during drag - transform handles visual movement
  }, []);

  const handleNoteDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;

    if (active && active.id.toString().startsWith("note-")) {
      const noteId = active.id.toString().replace("note-", "");

      setStickyNotes((notes) => {
        const note = notes.find((n) => n.id === noteId);
        if (!note) return notes;

        const boardElement = document.getElementById("notes-drop-area");
        const noteElement = document.querySelector(
          `[data-note-id="${noteId}"]`
        ) as HTMLElement;

        if (!boardElement || !noteElement) {
          return notes;
        }

        // Get actual dimensions
        const noteWidth = noteElement.offsetWidth;
        const noteHeight = noteElement.offsetHeight;
        const containerWidth = boardElement.clientWidth;
        const containerHeight = boardElement.clientHeight;

        // Calculate boundaries (with padding to keep note inside dotted border)
        const padding = 0;
        const maxX = containerWidth - noteWidth - padding;
        const maxY = containerHeight - noteHeight - padding;

        // Calculate final position: initial position + delta
        // Constrain to boundaries
        const newX = Math.max(padding, Math.min(maxX, note.x + delta.x));
        const newY = Math.max(padding, Math.min(maxY, note.y + delta.y));

        return notes.map((n) =>
          n.id === noteId ? { ...n, x: newX, y: newY } : n
        );
      });
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
      selectedColor={selectedColor}
      notesBoardHeight={notesBoardHeight}
      dragModifiers={[restrictToNotesBoard]}
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
      onSelectedColorChange={setSelectedColor}
      onNotesBoardHeightChange={setNotesBoardHeight}
      onAddNote={handleAddNote}
      onDeleteNote={handleDeleteNote}
      onEditNote={handleEditNote}
      onColorChange={handleColorChange}
      onBringToFront={handleBringToFront}
      onSendToBack={handleSendToBack}
      onSaveGoals={handleSaveGoals}
      onSaveSummaries={handleSaveSummaries}
      onToggleSectionVisibility={handleToggleSectionVisibility}
      onMoveSectionUp={handleMoveSectionUp}
      onMoveSectionDown={handleMoveSectionDown}
      onNoteDragStart={handleNoteDragStart}
      onNoteDragMove={handleNoteDragMove}
      onNoteDragEnd={handleNoteDragEnd}
      onAddChecklistItem={handleAddChecklistItem}
      onToggleChecklistItem={handleToggleChecklistItem}
      onEditChecklistItem={handleEditChecklistItem}
      onDeleteChecklistItem={handleDeleteChecklistItem}
    />
  );
}
