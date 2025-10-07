import { SensorDescriptor, SensorOptions } from "@dnd-kit/core";

export interface IBook {
  title: string;
  chapters: number;
  currentArc?: string;
  authorSummary?: string;
  storySummary?: string;
}

export interface IStickyNote {
  id: string;
  content: string;
  color: string;
  x: number;
  y: number;
}

export interface IGoals {
  wordsPerDay: number;
  chaptersPerWeek: number;
}

export interface IStoryProgress {
  estimatedArcs: number;
  estimatedChapters: number;
  completedArcs: number;
  currentArcProgress: number;
}

export interface ISection {
  id: string;
  type: "stats" | "progress" | "summaries" | "notes-board";
  title: string;
  visible: boolean;
  component: React.ReactNode;
}

export interface IOverviewStats {
  totalWords: number;
  totalCharacters: number;
  totalChapters: number;
  lastChapterNumber: number;
  lastChapterName: string;
  averagePerWeek: number;
  averagePerMonth: number;
  chaptersInProgress: number;
  chaptersFinished: number;
  chaptersDraft: number;
  chaptersPlanning: number;
  averageWordsPerChapter: number;
  averageCharactersPerChapter: number;
}

export interface PropsOverviewTab {
  book: IBook;
  bookId: string;
  isCustomizing?: boolean;
}

export interface PropsOverviewView {
  book: IBook;
  bookId: string;
  isCustomizing?: boolean;
  goals: IGoals;
  isEditingGoals: boolean;
  storyProgress: IStoryProgress;
  authorSummary: string;
  storySummary: string;
  isEditingSummaries: boolean;
  stickyNotes: IStickyNote[];
  newNote: string;
  editingNote: string | null;
  editContent: string;
  sections: ISection[];
  activeNoteId: string | null;
  draggedNoteData: IStickyNote | null;
  overviewStats: IOverviewStats;
  storyProgressPercentage: number;
  sensors: SensorDescriptor<SensorOptions>[];
  onGoalsChange: (goals: IGoals) => void;
  onEditingGoalsChange: (editing: boolean) => void;
  onAuthorSummaryChange: (summary: string) => void;
  onStorySummaryChange: (summary: string) => void;
  onEditingSummariesChange: (editing: boolean) => void;
  onNewNoteChange: (note: string) => void;
  onEditingNoteChange: (id: string | null) => void;
  onEditContentChange: (content: string) => void;
  onSectionsChange: (sections: ISection[]) => void;
  onActiveNoteIdChange: (id: string | null) => void;
  onDraggedNoteDataChange: (data: IStickyNote | null) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  onEditNote: (id: string, content: string) => void;
  onSaveGoals: () => void;
  onSaveSummaries: () => void;
  onToggleSectionVisibility: (sectionId: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
  onNoteDragStart: (event: any) => void;
  onNoteDragEnd: (event: any) => void;
}

export interface PropsSortableNote {
  note: IStickyNote;
  editingNote: string | null;
  editContent: string;
  isCustomizing: boolean;
  onEditingNoteChange: (id: string | null) => void;
  onEditContentChange: (content: string) => void;
  onEditNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export interface PropsSortableSection {
  section: ISection;
  isCustomizing: boolean;
  children: React.ReactNode;
  isFirst: boolean;
  isLast: boolean;
  onToggleVisibility: (sectionId: string) => void;
  onMoveUp: (sectionId: string) => void;
  onMoveDown: (sectionId: string) => void;
}
