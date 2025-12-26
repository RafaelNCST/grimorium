import { create } from "zustand";

import type { EntityMention } from "@/components/modals/create-chapter-modal";
import { sortChaptersByNumber } from "@/lib/db/chapters.service";
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
  sortedCache: ChapterData[] | null; // Cache for sorted chapters (performance optimization)

  // Ações do store (agora apenas cache local)
  setCachedChapter: (chapter: ChapterData) => void;
  setCachedChapters: (chapters: ChapterData[]) => void;
  setCachedNavigationData: (navigationData: ChapterNavigationData[]) => void;
  updateCachedChapter: (id: string, updates: Partial<ChapterData>) => void;
  removeCachedChapter: (id: string) => void;
  clearCache: () => void;
  invalidateSortCache: () => void;

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
  sortedCache: null,

  // Definir um capítulo no cache
  setCachedChapter: (chapter) =>
    set((state) => ({
      chapters: { ...state.chapters, [chapter.id]: chapter },
      sortedCache: null, // Invalidate cache on update
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
    set({ chapters: chaptersMap, sortedCache: null }); // Invalidate cache on update
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

  // Atualizar parcialmente um capítulo no cache
  updateCachedChapter: (id, updates) =>
    set((state) => {
      const existingChapter = state.chapters[id];
      if (!existingChapter) return state;

      return {
        chapters: {
          ...state.chapters,
          [id]: {
            ...existingChapter,
            ...updates,
            lastEdited: new Date().toISOString(),
          },
        },
        sortedCache: null, // Invalidate cache on update
      };
    }),

  // Remover capítulo do cache
  removeCachedChapter: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.chapters;
      return { chapters: rest, sortedCache: null }; // Invalidate cache on delete
    }),

  // Limpar todo o cache
  clearCache: () => set({ chapters: {}, sortedCache: null }),

  // Invalidar cache de ordenação
  invalidateSortCache: () => set({ sortedCache: null }),

  // Getters
  getChapter: (id) => get().chapters[id],

  getAllChapters: () => Object.values(get().chapters),

  getChaptersSorted: () => {
    const state = get();

    // Return cached result if available
    if (state.sortedCache) {
      return state.sortedCache;
    }

    // Sort and cache
    const chapters = Object.values(state.chapters);
    const sorted = sortChaptersByNumber(chapters);

    // Update cache
    set({ sortedCache: sorted });

    return sorted;
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
