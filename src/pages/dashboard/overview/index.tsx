import { useState } from "react";

import {
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
} from "@dnd-kit/sortable";

import { useLanguageStore } from "@/stores/language-store";

import { OverviewView } from "./view";

interface Book {
  title: string;
  chapters: number;
  currentArc: string;
  authorSummary: string;
  storySummary: string;
}

interface PropsOverviewTab {
  book: Book;
  bookId: string;
  isCustomizing?: boolean;
}

interface StickyNote {
  id: string;
  content: string;
  color: string;
  x: number;
  y: number;
}

interface Goals {
  wordsPerDay: number;
  chaptersPerWeek: number;
}

interface StoryProgress {
  estimatedArcs: number;
  estimatedChapters: number;
  completedArcs: number;
  currentArcProgress: number;
}

interface Section {
  id: string;
  type:
    | "stats"
    | "progress"
    | "author-summary"
    | "story-summary"
    | "notes-board";
  title: string;
  visible: boolean;
  component: React.ReactNode;
}

const noteColors = [
  "bg-yellow-200 border-yellow-400 text-yellow-900 shadow-lg",
  "bg-pink-200 border-pink-400 text-pink-900 shadow-lg",
  "bg-green-200 border-green-400 text-green-900 shadow-lg",
  "bg-blue-200 border-blue-400 text-blue-900 shadow-lg",
  "bg-purple-200 border-purple-400 text-purple-900 shadow-lg",
  "bg-orange-200 border-orange-400 text-orange-900 shadow-lg",
];

export function OverviewTab({ book, bookId, isCustomizing }: PropsOverviewTab) {
  const { t } = useLanguageStore();

  // Stats state
  const [goals, setGoals] = useState<Goals>({
    wordsPerDay: 500,
    chaptersPerWeek: 2,
  });
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  // Story progress state
  const [storyProgress, setStoryProgress] = useState<StoryProgress>({
    estimatedArcs: 3,
    estimatedChapters: 25,
    completedArcs: 1,
    currentArcProgress: 45,
  });
  const [isEditingProgress, setIsEditingProgress] = useState(false);

  // Summary states
  const [authorSummary, setAuthorSummary] = useState(book.authorSummary);
  const [isEditingAuthorSummary, setIsEditingAuthorSummary] = useState(false);
  const [storySummary, setStorySummary] = useState(book.storySummary);
  const [isEditingStorySummary, setIsEditingStorySummary] = useState(false);

  // Sticky notes state
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    {
      id: "1",
      content:
        "Desenvolver melhor o relacionamento entre protagonista e mentor",
      color: noteColors[0],
      x: 20,
      y: 20,
    },
    {
      id: "2",
      content: "Adicionar mais detalhes sobre o sistema de magia",
      color: noteColors[1],
      x: 250,
      y: 80,
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [draggedNoteData, setDraggedNoteData] = useState<StickyNote | null>(
    null
  );

  // Section management
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Section management functions
  const [sections, setSections] = useState<Section[]>([
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

  const toggleSectionVisibility = (sectionId: string) => {
    setSections((sections) =>
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  };

  const handleSectionDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleSectionDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  // Save functions
  const saveGoals = () => {
    setIsEditingGoals(false);
  };

  const saveAuthorSummary = () => {
    setIsEditingAuthorSummary(false);
  };

  const saveStorySummary = () => {
    setIsEditingStorySummary(false);
  };

  // Sticky notes functions
  const handleAddNote = () => {
    if (newNote.trim()) {
      const newStickyNote: StickyNote = {
        id: Date.now().toString(),
        content: newNote,
        color: noteColors[Math.floor(Math.random() * noteColors.length)],
        x: Math.random() * 300,
        y: Math.random() * 200,
      };
      setStickyNotes([...stickyNotes, newStickyNote]);
      setNewNote("");
    }
  };

  const handleDeleteNote = (id: string) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  const handleEditNote = (id: string, newContent: string) => {
    setStickyNotes((notes) =>
      notes.map((note) =>
        note.id === id ? { ...note, content: newContent } : note
      )
    );
  };

  const handleNoteDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active && active.id.toString().startsWith("note-")) {
      const noteId = active.id.toString().replace("note-", "");
      const note = stickyNotes.find((n) => n.id === noteId);
      if (note) {
        setActiveNoteId(noteId);
        setDraggedNoteData(note);
      }
    }
  };

  const handleNoteDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    if (active && active.id.toString().startsWith("note-")) {
      const noteId = active.id.toString().replace("note-", "");

      // Update position based on drag delta
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
  };

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
      onSaveGoals={saveGoals}
      onSaveAuthorSummary={saveAuthorSummary}
      onSaveStorySummary={saveStorySummary}
      onToggleSectionVisibility={toggleSectionVisibility}
      onNoteDragStart={handleNoteDragStart}
      onNoteDragEnd={handleNoteDragEnd}
      onSectionDragStart={handleSectionDragStart}
      onSectionDragEnd={handleSectionDragEnd}
    />
  );
}