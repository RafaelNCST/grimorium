import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { EditorSettings } from "@/pages/dashboard/chapters/chapter-editor/types/editor-settings";
import { DEFAULT_EDITOR_SETTINGS } from "@/pages/dashboard/chapters/chapter-editor/types/editor-settings";

interface BookEditorSettingsState {
  // Record of bookId -> EditorSettings
  bookSettings: Record<string, EditorSettings>;

  // Get settings for a specific book (returns defaults if not found)
  getBookSettings: (bookId: string) => EditorSettings;

  // Update settings for a specific book
  updateBookSettings: (
    bookId: string,
    updates: Partial<EditorSettings>
  ) => void;

  // Set complete settings for a specific book
  setBookSettings: (bookId: string, settings: EditorSettings) => void;
}

export const useBookEditorSettingsStore = create<BookEditorSettingsState>()(
  persist(
    (set, get) => ({
      bookSettings: {},

      getBookSettings: (bookId) => {
        const settings = get().bookSettings[bookId];
        return settings || DEFAULT_EDITOR_SETTINGS;
      },

      updateBookSettings: (bookId, updates) =>
        set((state) => {
          const currentSettings =
            state.bookSettings[bookId] || DEFAULT_EDITOR_SETTINGS;
          return {
            bookSettings: {
              ...state.bookSettings,
              [bookId]: {
                ...currentSettings,
                ...updates,
              },
            },
          };
        }),

      setBookSettings: (bookId, settings) =>
        set((state) => ({
          bookSettings: {
            ...state.bookSettings,
            [bookId]: settings,
          },
        })),
    }),
    {
      name: "book-editor-settings-storage",
    }
  )
);
