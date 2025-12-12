import { useState, useCallback, useMemo, useEffect, useRef } from "react";

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

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useOverviewStore } from "@/stores/overview-store";

import { NOTE_COLORS_CONSTANT } from "./constants/note-colors";
import {
  PropsOverviewTab,
  IStickyNote,
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

const EMPTY_ARRAY: IStickyNote[] = [];
const EMPTY_CHECKLIST: IChecklistItem[] = [];
const EMPTY_PROGRESS: number[] = [];
const DEFAULT_GOALS = { wordsPerDay: 0, chaptersPerWeek: 0 };
const DEFAULT_STORY_PROGRESS = {
  estimatedArcs: 0,
  estimatedChapters: 0,
  completedArcs: 0,
  currentArcProgress: 0,
};
const DEFAULT_OVERVIEW_STATS = {
  totalWords: 0,
  totalCharacters: 0,
  totalChapters: 0,
  lastChapterNumber: 0,
  lastChapterName: "",
  averagePerWeek: 0,
  averagePerMonth: 0,
  chaptersInProgress: 0,
  chaptersFinished: 0,
  chaptersDraft: 0,
  chaptersReview: 0,
  averageWordsPerChapter: 0,
  averageCharactersPerChapter: 0,
};
const DEFAULT_SECTIONS = [
  {
    id: "stats",
    type: "stats" as const,
    title: "Estatísticas",
    visible: true,
    component: null,
  },
  {
    id: "progress",
    type: "progress" as const,
    title: "Progressão da História",
    visible: true,
    component: null,
  },
  {
    id: "summaries",
    type: "summaries" as const,
    title: "Resumos",
    visible: true,
    component: null,
  },
  {
    id: "notes-board",
    type: "notes-board" as const,
    title: "Quadro de Lembretes",
    visible: true,
    component: null,
  },
  {
    id: "checklist",
    type: "checklist" as const,
    title: "Lista de Tarefas",
    visible: true,
    component: null,
  },
];

export function OverviewTab({ book, bookId, isCustomizing }: PropsOverviewTab) {
  const { t } = useTranslation("overview");

  // Store selectors - acesso direto ao cache para evitar re-renders
  const goals = useOverviewStore(
    (state) => state.cache[bookId]?.goals ?? DEFAULT_GOALS
  );
  const storyProgress = useOverviewStore(
    (state) => state.cache[bookId]?.storyProgress ?? DEFAULT_STORY_PROGRESS
  );
  const stickyNotes = useOverviewStore(
    (state) => state.cache[bookId]?.stickyNotes ?? EMPTY_ARRAY
  );
  const checklistItems = useOverviewStore(
    (state) => state.cache[bookId]?.checklistItems ?? EMPTY_CHECKLIST
  );
  const sections = useOverviewStore(
    (state) => state.cache[bookId]?.sections ?? DEFAULT_SECTIONS
  );
  const authorSummary = useOverviewStore(
    (state) => state.cache[bookId]?.authorSummary ?? ""
  );
  const storySummary = useOverviewStore(
    (state) => state.cache[bookId]?.storySummary ?? ""
  );
  const overviewStats = useOverviewStore(
    (state) => state.cache[bookId]?.overviewStats ?? DEFAULT_OVERVIEW_STATS
  );
  const allArcsProgress = useOverviewStore(
    (state) => state.cache[bookId]?.allArcsProgress ?? EMPTY_PROGRESS
  );
  const isLoading = useOverviewStore(
    (state) => state.cache[bookId]?.isLoading ?? false
  );

  // Store actions
  const fetchOverview = useOverviewStore((state) => state.fetchOverview);
  const setGoals = useOverviewStore((state) => state.setGoals);
  const setStickyNotes = useOverviewStore((state) => state.setStickyNotes);
  const setChecklistItems = useOverviewStore(
    (state) => state.setChecklistItems
  );
  const setSections = useOverviewStore((state) => state.setSections);
  const setAuthorSummary = useOverviewStore((state) => state.setAuthorSummary);
  const setStorySummary = useOverviewStore((state) => state.setStorySummary);
  const addStickyNote = useOverviewStore((state) => state.addStickyNote);
  const updateStickyNote = useOverviewStore((state) => state.updateStickyNote);
  const deleteStickyNote = useOverviewStore((state) => state.deleteStickyNote);
  const bringNoteToFront = useOverviewStore((state) => state.bringNoteToFront);
  const sendNoteToBack = useOverviewStore((state) => state.sendNoteToBack);
  const addChecklistItem = useOverviewStore((state) => state.addChecklistItem);
  const updateChecklistItem = useOverviewStore(
    (state) => state.updateChecklistItem
  );
  const deleteChecklistItem = useOverviewStore(
    (state) => state.deleteChecklistItem
  );
  const toggleChecklistItem = useOverviewStore(
    (state) => state.toggleChecklistItem
  );
  const toggleSectionVisibility = useOverviewStore(
    (state) => state.toggleSectionVisibility
  );
  const moveSectionUp = useOverviewStore((state) => state.moveSectionUp);
  const moveSectionDown = useOverviewStore((state) => state.moveSectionDown);

  // Local UI state
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingSummaries, setIsEditingSummaries] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [draggedNoteData, setDraggedNoteData] = useState<IStickyNote | null>(
    null
  );
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(
    NOTE_COLORS_CONSTANT[0]
  );
  const [notesBoardHeight, setNotesBoardHeight] = useState(() => {
    // Load saved height from localStorage on mount
    const savedHeight = localStorage.getItem(`notesBoard-height-${bookId}`);
    return savedHeight ? parseInt(savedHeight, 10) : 400;
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const mountCountRef = useRef(0);

  // Load saved height when bookId changes
  useEffect(() => {
    const savedHeight = localStorage.getItem(`notesBoard-height-${bookId}`);
    if (savedHeight) {
      setNotesBoardHeight(parseInt(savedHeight, 10));
    } else {
      setNotesBoardHeight(400); // Reset to default if no saved height
    }
  }, [bookId]);

  // Save notes board height to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      `notesBoard-height-${bookId}`,
      notesBoardHeight.toString()
    );
  }, [notesBoardHeight, bookId]);

  // Load data on mount (APENAS na primeira vez)
  useEffect(() => {
    if (!hasInitialized) {
      fetchOverview(bookId).then(() => {
        setHasInitialized(true);
      });
    }
  }, [bookId, hasInitialized, fetchOverview]);

  // Recalculate stats silently every time we return to this tab
  // Não causa loading, apenas atualiza os dados do cache
  useEffect(() => {
    mountCountRef.current += 1;

    // Apenas recalcular se já foi inicializado E não é o primeiro mount
    if (hasInitialized && mountCountRef.current > 1) {
      Promise.all([
        useOverviewStore.getState().calculateStats(bookId),
        useOverviewStore.getState().calculateArcsProgress(bookId),
      ]);
    }
  }, [bookId, hasInitialized]); // Re-executar quando bookId muda ou quando volta

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
      setStickyNotes(bookId, [defaultNote]);
    }
  }, [hasInitialized, stickyNotes.length, t, bookId, setStickyNotes]);

  const storyProgressPercentage = useMemo(() => {
    if (allArcsProgress.length === 0) return 0;

    // Calculate average progress across all arcs
    const totalProgress = allArcsProgress.reduce(
      (sum, progress) => sum + progress,
      0
    );
    const averageProgress = totalProgress / allArcsProgress.length;

    return Math.round(averageProgress);
  }, [allArcsProgress]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleToggleSectionVisibility = useCallback(
    (sectionId: string) => {
      toggleSectionVisibility(bookId, sectionId);
    },
    [bookId, toggleSectionVisibility]
  );

  const handleMoveSectionUp = useCallback(
    (sectionId: string) => {
      moveSectionUp(bookId, sectionId);
    },
    [bookId, moveSectionUp]
  );

  const handleMoveSectionDown = useCallback(
    (sectionId: string) => {
      moveSectionDown(bookId, sectionId);
    },
    [bookId, moveSectionDown]
  );

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
      addStickyNote(bookId, newStickyNote);
      setNewNote("");
    }
  }, [newNote, selectedColor, stickyNotes, bookId, addStickyNote]);

  const handleDeleteNote = useCallback(
    (id: string) => {
      deleteStickyNote(bookId, id);
    },
    [bookId, deleteStickyNote]
  );

  const handleEditNote = useCallback(
    (id: string, newContent: string) => {
      updateStickyNote(bookId, id, { content: newContent });
    },
    [bookId, updateStickyNote]
  );

  const handleColorChange = useCallback(
    (id: string, color: string) => {
      updateStickyNote(bookId, id, { color });
    },
    [bookId, updateStickyNote]
  );

  const handleBringToFront = useCallback(
    (id: string) => {
      bringNoteToFront(bookId, id);
    },
    [bookId, bringNoteToFront]
  );

  const handleSendToBack = useCallback(
    (id: string) => {
      sendNoteToBack(bookId, id);
    },
    [bookId, sendNoteToBack]
  );

  const handleNoteDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      if (active && active.id.toString().startsWith("note-")) {
        const noteId = active.id.toString().replace("note-", "");
        const note = stickyNotes.find((n) => n.id === noteId);
        if (note) {
          setActiveNoteId(noteId);
          setDraggedNoteData(note);
        }
      }
    },
    [stickyNotes]
  );

  const handleNoteDragMove = useCallback((_event: DragMoveEvent) => {
    // No need to update position during drag - transform handles visual movement
  }, []);

  const handleNoteDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;

      if (active && active.id.toString().startsWith("note-")) {
        const noteId = active.id.toString().replace("note-", "");

        const note = stickyNotes.find((n) => n.id === noteId);
        if (!note) return;

        const boardElement = document.getElementById("notes-drop-area");
        const noteElement = document.querySelector(
          `[data-note-id="${noteId}"]`
        ) as HTMLElement;

        if (!boardElement || !noteElement) {
          return;
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

        updateStickyNote(bookId, noteId, { x: newX, y: newY });
      }

      setActiveNoteId(null);
      setDraggedNoteData(null);
    },
    [stickyNotes, bookId, updateStickyNote]
  );

  const handleAddChecklistItem = useCallback(
    (text: string) => {
      const newItem: IChecklistItem = {
        id: Date.now().toString(),
        text,
        checked: false,
      };
      addChecklistItem(bookId, newItem);
    },
    [bookId, addChecklistItem]
  );

  const handleToggleChecklistItem = useCallback(
    (id: string) => {
      toggleChecklistItem(bookId, id);
    },
    [bookId, toggleChecklistItem]
  );

  const handleEditChecklistItem = useCallback(
    (id: string, text: string) => {
      updateChecklistItem(bookId, id, { text });
    },
    [bookId, updateChecklistItem]
  );

  const handleDeleteChecklistItem = useCallback(
    (id: string) => {
      deleteChecklistItem(bookId, id);
    },
    [bookId, deleteChecklistItem]
  );

  const handleGoalsChange = useCallback(
    (newGoals: typeof goals) => {
      setGoals(bookId, newGoals);
    },
    [bookId, setGoals]
  );

  const handleSectionsChange = useCallback(
    (newSections: typeof sections) => {
      setSections(bookId, newSections);
    },
    [bookId, setSections]
  );

  const handleAuthorSummaryChange = useCallback(
    (summary: string) => {
      setAuthorSummary(bookId, summary);
    },
    [bookId, setAuthorSummary]
  );

  const handleStorySummaryChange = useCallback(
    (summary: string) => {
      setStorySummary(bookId, summary);
    },
    [bookId, setStorySummary]
  );

  if (!hasInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

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
      onGoalsChange={handleGoalsChange}
      onEditingGoalsChange={setIsEditingGoals}
      onAuthorSummaryChange={handleAuthorSummaryChange}
      onStorySummaryChange={handleStorySummaryChange}
      onEditingSummariesChange={setIsEditingSummaries}
      onNewNoteChange={setNewNote}
      onEditingNoteChange={setEditingNote}
      onEditContentChange={setEditContent}
      onSectionsChange={handleSectionsChange}
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
