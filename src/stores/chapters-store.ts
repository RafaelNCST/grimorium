import { create } from "zustand";

import type { EntityMention } from "@/components/modals/create-chapter-modal";
import type { EntityLink } from "@/pages/dashboard/chapters/chapter-editor/types/entity-link";

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
  entityLinks?: EntityLink[]; // Persistent entity links
}

// Tipo para dados mínimos de navegação
export interface ChapterNavigationData {
  id: string;
  chapterNumber: string;
  title: string;
}

interface ChaptersState {
  // Cache em memória (não persistido)
  chapters: Record<string, ChapterData>;

  // Ações do store (agora apenas cache local)
  setCachedChapter: (chapter: ChapterData) => void;
  setCachedChapters: (chapters: ChapterData[]) => void;
  setCachedNavigationData: (navigationData: ChapterNavigationData[]) => void;
  removeCachedChapter: (id: string) => void;
  clearCache: () => void;

  // Getters para compatibilidade
  getChapter: (id: string) => ChapterData | undefined;
  getAllChapters: () => ChapterData[];
  getChaptersSorted: () => ChapterData[];
  getPreviousChapter: (currentId: string) => ChapterData | undefined;
  getNextChapter: (currentId: string) => ChapterData | undefined;
}

/**
 * Store de capítulos - Agora funciona como cache em memória
 * Os dados reais são armazenados no banco de dados SQL
 * Use chapters.service.ts para operações de persistência
 */
export const useChaptersStore = create<ChaptersState>()((set, get) => ({
  chapters: {},

  // Definir um capítulo no cache
  setCachedChapter: (chapter) =>
    set((state) => ({
      chapters: { ...state.chapters, [chapter.id]: chapter },
    })),

  // Definir múltiplos capítulos no cache
  setCachedChapters: (chapters) => {
    const chaptersMap = chapters.reduce(
      (acc, chapter) => {
        acc[chapter.id] = chapter;
        return acc;
      },
      {} as Record<string, ChapterData>
    );
    set({ chapters: chaptersMap });
  },

  // Definir dados mínimos de navegação no cache (ultra-leve)
  // Cria entradas no cache apenas com id, chapterNumber e title
  // Ideal para popular o cache com 1000+ capítulos sem impacto de performance
  setCachedNavigationData: (navigationData) => {
    set((state) => {
      const updatedChapters = { ...state.chapters };

      navigationData.forEach((navData) => {
        // Só adiciona se ainda não existe no cache
        // Evita sobrescrever dados completos que já foram carregados
        if (!updatedChapters[navData.id]) {
          updatedChapters[navData.id] = {
            id: navData.id,
            chapterNumber: navData.chapterNumber,
            title: navData.title,
            status: "draft",
            summary: "",
            content: "",
            wordCount: 0,
            characterCount: 0,
            lastEdited: new Date().toISOString(),
            mentionedCharacters: [],
            mentionedRegions: [],
            mentionedItems: [],
            mentionedFactions: [],
            mentionedRaces: [],
            annotations: [],
          } as ChapterData;
        }
      });

      return { chapters: updatedChapters };
    });
  },

  // Remover capítulo do cache
  removeCachedChapter: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.chapters;
      return { chapters: rest };
    }),

  // Limpar todo o cache
  clearCache: () => set({ chapters: {} }),

  // Getters
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
}));
