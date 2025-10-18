import { useEffect, useCallback, useRef } from "react";

import {
  updateOverviewData,
  getOverviewData,
  updateBook,
} from "@/lib/db/books.service";

import {
  IGoals,
  IStoryProgress,
  IStickyNote,
  IChecklistItem,
  ISection,
} from "../types/overview-types";

const DEBOUNCE_DELAY = 1000; // 1 second

interface UseOverviewPersistenceProps {
  bookId: string;
  goals: IGoals;
  storyProgress: IStoryProgress;
  stickyNotes: IStickyNote[];
  checklistItems: IChecklistItem[];
  sections: ISection[];
  authorSummary: string;
  storySummary: string;
}

interface UseOverviewPersistenceReturn {
  loadOverviewData: () => Promise<void>;
  saveOverviewData: () => Promise<void>;
}

export function useOverviewPersistence(
  props: UseOverviewPersistenceProps,
  setters: {
    setGoals: (goals: IGoals) => void;
    setStoryProgress: (progress: IStoryProgress) => void;
    setStickyNotes: (notes: IStickyNote[]) => void;
    setChecklistItems: (items: IChecklistItem[]) => void;
    setSections: (sections: ISection[]) => void;
  }
): UseOverviewPersistenceReturn {
  const {
    bookId,
    goals,
    storyProgress,
    stickyNotes,
    checklistItems,
    sections,
    authorSummary,
    storySummary,
  } = props;

  const {
    setGoals,
    setStoryProgress,
    setStickyNotes,
    setChecklistItems,
    setSections,
  } = setters;

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);

  // Load data from database
  const loadOverviewData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      console.log(
        "[useOverviewPersistence] Loading overview data for book:",
        bookId
      );
      const data = await getOverviewData(bookId);

      if (data.goals) {
        setGoals(data.goals);
      }

      if (data.storyProgress) {
        setStoryProgress(data.storyProgress);
      }

      if (data.stickyNotes && data.stickyNotes.length > 0) {
        setStickyNotes(data.stickyNotes);
      }

      if (data.checklistItems) {
        setChecklistItems(data.checklistItems);
      }

      if (data.sectionsConfig) {
        // Merge loaded config with current sections structure
        setSections((currentSections) =>
          currentSections.map((section) => {
            const savedSection = data.sectionsConfig?.find(
              (s) => s.id === section.id
            );
            return savedSection
              ? { ...section, visible: savedSection.visible }
              : section;
          })
        );
      }

      console.log("[useOverviewPersistence] Data loaded successfully");
    } catch (error) {
      console.error(
        "[useOverviewPersistence] Error loading overview data:",
        error
      );
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    bookId,
    setGoals,
    setStoryProgress,
    setStickyNotes,
    setChecklistItems,
    setSections,
  ]);

  // Save data to database
  const saveOverviewData = useCallback(async () => {
    try {
      console.log(
        "[useOverviewPersistence] Saving overview data for book:",
        bookId
      );

      // Save overview-specific data
      await updateOverviewData(bookId, {
        goals,
        storyProgress,
        stickyNotes,
        checklistItems,
        sectionsConfig: sections.map(({ id, type, title, visible }) => ({
          id,
          type,
          title,
          visible,
        })),
      });

      // Save summaries separately (they're part of the main book data)
      await updateBook(bookId, {
        authorSummary,
        storySummary,
      });

      console.log("[useOverviewPersistence] Data saved successfully");
    } catch (error) {
      console.error(
        "[useOverviewPersistence] Error saving overview data:",
        error
      );
    }
  }, [
    bookId,
    goals,
    storyProgress,
    stickyNotes,
    checklistItems,
    sections,
    authorSummary,
    storySummary,
  ]);

  // Debounced save effect
  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      saveOverviewData();
    }, DEBOUNCE_DELAY);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    goals,
    storyProgress,
    stickyNotes,
    checklistItems,
    sections,
    authorSummary,
    storySummary,
    saveOverviewData,
  ]);

  return {
    loadOverviewData,
    saveOverviewData,
  };
}
