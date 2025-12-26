import { create } from "zustand";

interface ChapterOrderWarningStore {
  showWarning: boolean;
  setShowWarning: (show: boolean) => void;
}

/**
 * Global store for chapter order warning modal
 * Used to show a warning when chapters are detected to be out of order
 */
export const useChapterOrderWarningStore = create<ChapterOrderWarningStore>(
  (set) => ({
    showWarning: false,
    setShowWarning: (show: boolean) => set({ showWarning: show }),
  })
);
