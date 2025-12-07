import { SensorDescriptor, SensorOptions, Modifier } from "@dnd-kit/core";

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
  zIndex: number;
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

export interface IChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface ISection {
  id: string;
  type: "stats" | "progress" | "summaries" | "notes-board" | "checklist";
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
  checklistItems: IChecklistItem[];
  selectedColor: string;
  notesBoardHeight: number;
  dragModifiers: Modifier[];
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
  onSelectedColorChange: (color: string) => void;
  onNotesBoardHeightChange: (height: number) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  onEditNote: (id: string, content: string) => void;
  onColorChange: (id: string, color: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onSaveGoals: () => void;
  onSaveSummaries: () => void;
  onToggleSectionVisibility: (sectionId: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
  onNoteDragStart: (event: any) => void;
  onNoteDragMove: (event: any) => void;
  onNoteDragEnd: (event: any) => void;
  onAddChecklistItem: (text: string) => void;
  onToggleChecklistItem: (id: string) => void;
  onEditChecklistItem: (id: string, text: string) => void;
  onDeleteChecklistItem: (id: string) => void;
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
  onColorChange: (id: string, color: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
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

export interface PropsChecklistCard {
  checklistItems: IChecklistItem[];
  isCustomizing: boolean;
  onAddItem: (text: string) => void;
  onToggleItem: (id: string) => void;
  onEditItem: (id: string, text: string) => void;
  onDeleteItem: (id: string) => void;
}
