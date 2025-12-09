import { create } from "zustand";

import {
  getOverviewData,
  updateOverviewData,
  updateBook,
} from "@/lib/db/books.service";
import { getChapterMetadataByBookId } from "@/lib/db/chapters.service";
import { getPlotArcsByBookId } from "@/lib/db/plot.service";

import type {
  IGoals,
  IStoryProgress,
  IStickyNote,
  IChecklistItem,
  ISection,
  IOverviewStats,
} from "@/pages/dashboard/tabs/overview/types/overview-types";

interface OverviewCache {
  [bookId: string]: {
    goals: IGoals;
    storyProgress: IStoryProgress;
    stickyNotes: IStickyNote[];
    checklistItems: IChecklistItem[];
    sections: ISection[];
    authorSummary: string;
    storySummary: string;
    overviewStats: IOverviewStats;
    allArcsProgress: number[];
    isLoading: boolean;
    lastFetched: number;
  };
}

interface OverviewState {
  cache: OverviewCache;
  saveTimeouts: Map<string, NodeJS.Timeout>;

  // Fetch and save
  fetchOverview: (bookId: string, forceRefresh?: boolean) => Promise<void>;
  saveOverview: (bookId: string) => Promise<void>;
  debouncedSave: (bookId: string) => void;

  // Getters
  getGoals: (bookId: string) => IGoals;
  getStoryProgress: (bookId: string) => IStoryProgress;
  getStickyNotes: (bookId: string) => IStickyNote[];
  getChecklistItems: (bookId: string) => IChecklistItem[];
  getSections: (bookId: string) => ISection[];
  getAuthorSummary: (bookId: string) => string;
  getStorySummary: (bookId: string) => string;
  getOverviewStats: (bookId: string) => IOverviewStats;
  getAllArcsProgress: (bookId: string) => number[];
  isLoading: (bookId: string) => boolean;

  // Setters
  setGoals: (bookId: string, goals: IGoals) => void;
  setStoryProgress: (bookId: string, progress: IStoryProgress) => void;
  setStickyNotes: (bookId: string, notes: IStickyNote[]) => void;
  setChecklistItems: (bookId: string, items: IChecklistItem[]) => void;
  setSections: (bookId: string, sections: ISection[]) => void;
  setAuthorSummary: (bookId: string, summary: string) => void;
  setStorySummary: (bookId: string, summary: string) => void;

  // Sticky notes operations
  addStickyNote: (bookId: string, note: IStickyNote) => void;
  updateStickyNote: (
    bookId: string,
    noteId: string,
    updates: Partial<IStickyNote>
  ) => void;
  deleteStickyNote: (bookId: string, noteId: string) => void;
  bringNoteToFront: (bookId: string, noteId: string) => void;
  sendNoteToBack: (bookId: string, noteId: string) => void;

  // Checklist operations
  addChecklistItem: (bookId: string, item: IChecklistItem) => void;
  updateChecklistItem: (
    bookId: string,
    itemId: string,
    updates: Partial<IChecklistItem>
  ) => void;
  deleteChecklistItem: (bookId: string, itemId: string) => void;
  toggleChecklistItem: (bookId: string, itemId: string) => void;

  // Sections operations
  toggleSectionVisibility: (bookId: string, sectionId: string) => void;
  moveSectionUp: (bookId: string, sectionId: string) => void;
  moveSectionDown: (bookId: string, sectionId: string) => void;

  // Stats calculation
  calculateStats: (bookId: string) => Promise<void>;
  calculateArcsProgress: (bookId: string) => Promise<void>;

  // Cache management
  invalidateCache: (bookId: string) => void;
}

const DEBOUNCE_DELAY = 1000; // 1 second

const DEFAULT_GOALS: IGoals = {
  wordsPerDay: 0,
  chaptersPerWeek: 0,
};

const DEFAULT_STORY_PROGRESS: IStoryProgress = {
  estimatedArcs: 0,
  estimatedChapters: 0,
  completedArcs: 0,
  currentArcProgress: 0,
};

const DEFAULT_OVERVIEW_STATS: IOverviewStats = {
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
  chaptersPlanning: 0,
  averageWordsPerChapter: 0,
  averageCharactersPerChapter: 0,
};

const DEFAULT_SECTIONS: ISection[] = [
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
];

// Map para rastrear fetches em andamento
const fetchingPromises = new Map<string, Promise<void>>();

export const useOverviewStore = create<OverviewState>((set, get) => ({
  cache: {},
  saveTimeouts: new Map(),

  fetchOverview: async (bookId: string, forceRefresh = false) => {
    // Se já está fetchando e não é force refresh, retornar a promise existente
    if (fetchingPromises.has(bookId) && !forceRefresh) {
      return fetchingPromises.get(bookId);
    }

    const promise = (async () => {
      const cached = get().cache[bookId];

      // Verificar cache se não for forceRefresh
      if (!forceRefresh && cached && cached.lastFetched > 0) {
        return;
      }

      // Marcar como loading
      set((state) => ({
        cache: {
          ...state.cache,
          [bookId]: {
            goals: cached?.goals || DEFAULT_GOALS,
            storyProgress: cached?.storyProgress || DEFAULT_STORY_PROGRESS,
            stickyNotes: cached?.stickyNotes || [],
            checklistItems: cached?.checklistItems || [],
            sections: cached?.sections || DEFAULT_SECTIONS,
            authorSummary: cached?.authorSummary || "",
            storySummary: cached?.storySummary || "",
            overviewStats: cached?.overviewStats || DEFAULT_OVERVIEW_STATS,
            allArcsProgress: cached?.allArcsProgress || [],
            isLoading: true,
            lastFetched: cached?.lastFetched || 0,
          },
        },
      }));

      try {
        // Fetch do DB
        const data = await getOverviewData(bookId);
        const now = Date.now();

        // Atualizar cache com sucesso
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              goals: data.goals || DEFAULT_GOALS,
              storyProgress: data.storyProgress || DEFAULT_STORY_PROGRESS,
              stickyNotes: data.stickyNotes || [],
              checklistItems: data.checklistItems || [],
              sections: data.sectionsConfig
                ? DEFAULT_SECTIONS.map((section) => {
                    const savedSection = data.sectionsConfig?.find(
                      (s) => s.id === section.id
                    );
                    return savedSection
                      ? { ...section, visible: savedSection.visible }
                      : section;
                  })
                : DEFAULT_SECTIONS,
              authorSummary: data.authorSummary || "",
              storySummary: data.storySummary || "",
              overviewStats: cached?.overviewStats || DEFAULT_OVERVIEW_STATS,
              allArcsProgress: cached?.allArcsProgress || [],
              isLoading: false,
              lastFetched: now,
            },
          },
        }));

        // Calcular stats e progress após carregar
        await Promise.all([
          get().calculateStats(bookId),
          get().calculateArcsProgress(bookId),
        ]);
      } catch (error) {
        console.error("Error fetching overview:", error);
        // Atualizar cache com erro
        set((state) => ({
          cache: {
            ...state.cache,
            [bookId]: {
              ...(cached || {
                goals: DEFAULT_GOALS,
                storyProgress: DEFAULT_STORY_PROGRESS,
                stickyNotes: [],
                checklistItems: [],
                sections: DEFAULT_SECTIONS,
                authorSummary: "",
                storySummary: "",
                overviewStats: DEFAULT_OVERVIEW_STATS,
                allArcsProgress: [],
                lastFetched: 0,
              }),
              isLoading: false,
            },
          },
        }));
        throw error;
      }
    })();

    fetchingPromises.set(bookId, promise);

    try {
      await promise;
    } finally {
      // Limpar após conclusão
      fetchingPromises.delete(bookId);
    }
  },

  saveOverview: async (bookId: string) => {
    const cached = get().cache[bookId];
    if (!cached) return;

    try {
      console.log("[useOverviewStore] Saving overview data for book:", bookId);

      // Save overview-specific data
      await updateOverviewData(bookId, {
        goals: cached.goals,
        storyProgress: cached.storyProgress,
        stickyNotes: cached.stickyNotes,
        checklistItems: cached.checklistItems,
        sectionsConfig: cached.sections.map(({ id, type, title, visible }) => ({
          id,
          type,
          title,
          visible,
        })),
      });

      // Save summaries separately
      await updateBook(bookId, {
        authorSummary: cached.authorSummary,
        storySummary: cached.storySummary,
      });

      console.log("[useOverviewStore] Data saved successfully");
    } catch (error) {
      console.error("[useOverviewStore] Error saving overview data:", error);
      throw error;
    }
  },

  debouncedSave: (bookId: string) => {
    const { saveTimeouts } = get();
    const existingTimeout = saveTimeouts.get(bookId);

    // Clear existing timeout
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const newTimeout = setTimeout(() => {
      get().saveOverview(bookId);
      saveTimeouts.delete(bookId);
    }, DEBOUNCE_DELAY);

    saveTimeouts.set(bookId, newTimeout);
  },

  // Getters
  getGoals: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.goals || DEFAULT_GOALS;
  },

  getStoryProgress: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.storyProgress || DEFAULT_STORY_PROGRESS;
  },

  getStickyNotes: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.stickyNotes || [];
  },

  getChecklistItems: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.checklistItems || [];
  },

  getSections: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.sections || DEFAULT_SECTIONS;
  },

  getAuthorSummary: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.authorSummary || "";
  },

  getStorySummary: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.storySummary || "";
  },

  getOverviewStats: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.overviewStats || DEFAULT_OVERVIEW_STATS;
  },

  getAllArcsProgress: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.allArcsProgress || [];
  },

  isLoading: (bookId: string) => {
    const { cache } = get();
    return cache[bookId]?.isLoading || false;
  },

  // Setters
  setGoals: (bookId: string, goals: IGoals) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            goals,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  setStoryProgress: (bookId: string, progress: IStoryProgress) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            storyProgress: progress,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  setStickyNotes: (bookId: string, notes: IStickyNote[]) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            stickyNotes: notes,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  setChecklistItems: (bookId: string, items: IChecklistItem[]) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            checklistItems: items,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  setSections: (bookId: string, sections: ISection[]) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            sections,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  setAuthorSummary: (bookId: string, summary: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            authorSummary: summary,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  setStorySummary: (bookId: string, summary: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            storySummary: summary,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  // Sticky notes operations
  addStickyNote: (bookId: string, note: IStickyNote) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            stickyNotes: [...cached.stickyNotes, note],
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  updateStickyNote: (
    bookId: string,
    noteId: string,
    updates: Partial<IStickyNote>
  ) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            stickyNotes: cached.stickyNotes.map((note) =>
              note.id === noteId ? { ...note, ...updates } : note
            ),
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  deleteStickyNote: (bookId: string, noteId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            stickyNotes: cached.stickyNotes.filter((note) => note.id !== noteId),
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  bringNoteToFront: (bookId: string, noteId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      const maxZIndex = cached.stickyNotes.reduce(
        (max, note) => Math.max(max, note.zIndex),
        0
      );

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            stickyNotes: cached.stickyNotes.map((note) =>
              note.id === noteId ? { ...note, zIndex: maxZIndex + 1 } : note
            ),
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  sendNoteToBack: (bookId: string, noteId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      const minZIndex = cached.stickyNotes.reduce(
        (min, note) => Math.min(min, note.zIndex),
        Infinity
      );

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            stickyNotes: cached.stickyNotes.map((note) =>
              note.id === noteId ? { ...note, zIndex: minZIndex - 1 } : note
            ),
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  // Checklist operations
  addChecklistItem: (bookId: string, item: IChecklistItem) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            checklistItems: [...cached.checklistItems, item],
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  updateChecklistItem: (
    bookId: string,
    itemId: string,
    updates: Partial<IChecklistItem>
  ) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            checklistItems: cached.checklistItems.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  deleteChecklistItem: (bookId: string, itemId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            checklistItems: cached.checklistItems.filter(
              (item) => item.id !== itemId
            ),
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  toggleChecklistItem: (bookId: string, itemId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            checklistItems: cached.checklistItems.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  // Sections operations
  toggleSectionVisibility: (bookId: string, sectionId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            sections: cached.sections.map((section) =>
              section.id === sectionId
                ? { ...section, visible: !section.visible }
                : section
            ),
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  moveSectionUp: (bookId: string, sectionId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      const sections = [...cached.sections];
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index <= 0) return state;

      const temp = sections[index];
      sections[index] = sections[index - 1];
      sections[index - 1] = temp;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            sections,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  moveSectionDown: (bookId: string, sectionId: string) => {
    set((state) => {
      const cached = state.cache[bookId];
      if (!cached) return state;

      const sections = [...cached.sections];
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index < 0 || index >= sections.length - 1) return state;

      const temp = sections[index];
      sections[index] = sections[index + 1];
      sections[index + 1] = temp;

      return {
        cache: {
          ...state.cache,
          [bookId]: {
            ...cached,
            sections,
          },
        },
      };
    });
    get().debouncedSave(bookId);
  },

  // Stats calculation
  calculateStats: async (bookId: string) => {
    try {
      const chapters = await getChapterMetadataByBookId(bookId);

      if (chapters.length === 0) {
        set((state) => {
          const cached = state.cache[bookId];
          if (!cached) return state;

          return {
            cache: {
              ...state.cache,
              [bookId]: {
                ...cached,
                overviewStats: DEFAULT_OVERVIEW_STATS,
              },
            },
          };
        });
        return;
      }

      // Calculate stats
      const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
      const totalCharacters = chapters.reduce(
        (sum, ch) => sum + ch.characterCount,
        0
      );
      const totalChapters = chapters.length;

      const finishedChapters = chapters.filter((ch) => ch.status === "finished");
      const lastFinishedChapter =
        finishedChapters.length > 0
          ? finishedChapters.reduce((prev, current) => {
              const prevNum = parseInt(prev.chapterNumber) || 0;
              const currentNum = parseInt(current.chapterNumber) || 0;
              return currentNum > prevNum ? current : prev;
            })
          : null;

      const lastChapterNumber = lastFinishedChapter
        ? parseInt(lastFinishedChapter.chapterNumber) || 0
        : 0;
      const lastChapterName = lastFinishedChapter?.title || "";

      const averageWordsPerChapter =
        totalChapters > 0 ? Math.round(totalWords / totalChapters) : 0;
      const averageCharactersPerChapter =
        totalChapters > 0 ? Math.round(totalCharacters / totalChapters) : 0;

      let averagePerWeek = 0;
      let averagePerMonth = 0;

      if (finishedChapters.length >= 2) {
        const sortedFinished = [...finishedChapters].sort((a, b) => {
          const dateA = new Date(a.lastEdited).getTime();
          const dateB = new Date(b.lastEdited).getTime();
          return dateA - dateB;
        });

        const firstDate = new Date(sortedFinished[0].lastEdited);
        const lastDate = new Date(
          sortedFinished[sortedFinished.length - 1].lastEdited
        );

        const diffMs = lastDate.getTime() - firstDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays >= 1) {
          const weeks = diffDays / 7;
          const months = diffDays / 30;

          averagePerWeek =
            weeks > 0
              ? parseFloat((finishedChapters.length / weeks).toFixed(1))
              : 0;
          averagePerMonth =
            months > 0
              ? parseFloat((finishedChapters.length / months).toFixed(1))
              : 0;
        }
      }

      const chaptersInProgress = chapters.filter(
        (ch) => ch.status === "in-progress"
      ).length;
      const chaptersFinished = chapters.filter(
        (ch) => ch.status === "finished"
      ).length;
      const chaptersDraft = chapters.filter(
        (ch) => ch.status === "draft"
      ).length;
      const chaptersPlanning = chapters.filter(
        (ch) => ch.status === "planning"
      ).length;

      set((state) => {
        const cached = state.cache[bookId];
        if (!cached) return state;

        return {
          cache: {
            ...state.cache,
            [bookId]: {
              ...cached,
              overviewStats: {
                totalWords,
                totalCharacters,
                totalChapters,
                lastChapterNumber,
                lastChapterName,
                averagePerWeek,
                averagePerMonth,
                chaptersInProgress,
                chaptersFinished,
                chaptersDraft,
                chaptersPlanning,
                averageWordsPerChapter,
                averageCharactersPerChapter,
              },
            },
          },
        };
      });
    } catch (error) {
      console.error("Failed to calculate overview stats:", error);
    }
  },

  calculateArcsProgress: async (bookId: string) => {
    try {
      const arcs = await getPlotArcsByBookId(bookId);
      const progressValues = arcs.map((arc) => {
        return arc.status === "finished" ? 100 : arc.progress;
      });

      set((state) => {
        const cached = state.cache[bookId];
        if (!cached) return state;

        return {
          cache: {
            ...state.cache,
            [bookId]: {
              ...cached,
              allArcsProgress: progressValues,
            },
          },
        };
      });

      // Also update story progress based on arcs
      if (arcs.length === 0) {
        set((state) => {
          const cached = state.cache[bookId];
          if (!cached) return state;

          return {
            cache: {
              ...state.cache,
              [bookId]: {
                ...cached,
                storyProgress: DEFAULT_STORY_PROGRESS,
              },
            },
          };
        });
        return;
      }

      const completedArcs = arcs.filter((arc) => arc.status === "finished").length;
      const currentArc = arcs.find((arc) => arc.status === "current");
      const currentArcProgress = currentArc ? currentArc.progress : 0;

      const estimatedChapters = arcs.reduce((sum) => {
        return sum + 10; // Placeholder
      }, 0);

      set((state) => {
        const cached = state.cache[bookId];
        if (!cached) return state;

        return {
          cache: {
            ...state.cache,
            [bookId]: {
              ...cached,
              storyProgress: {
                estimatedArcs: arcs.length,
                estimatedChapters,
                completedArcs,
                currentArcProgress,
              },
            },
          },
        };
      });
    } catch (error) {
      console.error("Failed to calculate arcs progress:", error);
    }
  },

  invalidateCache: (bookId: string) => {
    // Clear timeout if exists
    const { saveTimeouts } = get();
    const timeout = saveTimeouts.get(bookId);
    if (timeout) {
      clearTimeout(timeout);
      saveTimeouts.delete(bookId);
    }

    // Clear cache
    set((state) => {
      const newCache = { ...state.cache };
      delete newCache[bookId];
      return { cache: newCache };
    });
  },
}));
