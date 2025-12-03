import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { EntityMention } from "@/components/modals/create-chapter-modal";

export type ChapterStatus =
  | "draft"
  | "in-progress"
  | "review"
  | "finished"
  | "published";

export interface Annotation {
  id: string;
  startOffset: number;
  endOffset: number;
  text: string;
  notes: AnnotationNote[];
  createdAt: string;
}

export interface AnnotationNote {
  id: string;
  text: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterData {
  id: string;
  chapterNumber: string;
  title: string;
  status: ChapterStatus;
  plotArcId?: string;
  summary: string;
  content: string;
  wordCount: number;
  characterCount: number;
  characterCountWithSpaces?: number;
  lastEdited: string;
  mentionedCharacters: EntityMention[];
  mentionedRegions: EntityMention[];
  mentionedItems: EntityMention[];
  mentionedFactions: EntityMention[];
  mentionedRaces: EntityMention[];
  annotations: Annotation[];
  // Editor formatting settings (individual per chapter)
  fontSize?: number;
  fontFamily?: string;
}

interface ChaptersState {
  chapters: Record<string, ChapterData>;
  addChapter: (chapter: ChapterData) => void;
  updateChapter: (id: string, updates: Partial<ChapterData>) => void;
  deleteChapter: (id: string) => void;
  getChapter: (id: string) => ChapterData | undefined;
  getAllChapters: () => ChapterData[];
  getChaptersSorted: () => ChapterData[];
  getPreviousChapter: (currentId: string) => ChapterData | undefined;
  getNextChapter: (currentId: string) => ChapterData | undefined;
}

export const useChaptersStore = create<ChaptersState>()(
  persist(
    (set, get) => ({
      chapters: {},

      addChapter: (chapter) =>
        set((state) => ({
          chapters: { ...state.chapters, [chapter.id]: chapter },
        })),

      updateChapter: (id, updates) =>
        set((state) => ({
          chapters: {
            ...state.chapters,
            [id]: state.chapters[id]
              ? {
                  ...state.chapters[id],
                  ...updates,
                  lastEdited: new Date().toISOString(),
                }
              : state.chapters[id],
          },
        })),

      deleteChapter: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.chapters;
          return { chapters: rest };
        }),

      getChapter: (id) => get().chapters[id],

      getAllChapters: () => Object.values(get().chapters),

      getChaptersSorted: () => {
        const chapters = Object.values(get().chapters);
        return chapters.sort((a, b) => {
          const numA = parseFloat(a.chapterNumber) || 0;
          const numB = parseFloat(b.chapterNumber) || 0;
          return numA - numB;
        });
      },

      getPreviousChapter: (currentId) => {
        const sorted = get().getChaptersSorted();
        const currentIndex = sorted.findIndex((ch) => ch.id === currentId);
        if (currentIndex > 0) {
          return sorted[currentIndex - 1];
        }
        return undefined;
      },

      getNextChapter: (currentId) => {
        const sorted = get().getChaptersSorted();
        const currentIndex = sorted.findIndex((ch) => ch.id === currentId);
        if (currentIndex !== -1 && currentIndex < sorted.length - 1) {
          return sorted[currentIndex + 1];
        }
        return undefined;
      },
    }),
    {
      name: "chapters-storage",
    }
  )
);
