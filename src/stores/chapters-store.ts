import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { EntityMention } from "@/components/modals/create-chapter-modal";

export type ChapterStatus = "draft" | "in-progress" | "review" | "finished" | "published";

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
}

interface ChaptersState {
  chapters: Record<string, ChapterData>;
  addChapter: (chapter: ChapterData) => void;
  updateChapter: (id: string, updates: Partial<ChapterData>) => void;
  deleteChapter: (id: string) => void;
  getChapter: (id: string) => ChapterData | undefined;
  getAllChapters: () => ChapterData[];
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
              ? { ...state.chapters[id], ...updates, lastEdited: new Date().toISOString() }
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
    }),
    {
      name: "chapters-storage",
    }
  )
);
