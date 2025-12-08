/**
 * App Settings Store
 *
 * Gerencia as configurações gerais do aplicativo (notificações, dashboard, etc)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  DashboardTabId,
} from "@/types/app-settings";

interface AppSettingsState extends AppSettings {
  // Actions para Notificações
  setSoundEnabled: (enabled: boolean) => void;

  // Actions para Dashboard
  setDefaultVisibleTabs: (tabs: DashboardTabId[]) => void;
  toggleDefaultTab: (tabId: DashboardTabId) => void;

  // Reset
  resetToDefaults: () => void;
}

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_APP_SETTINGS,

      // Notificações
      setSoundEnabled: (enabled) =>
        set((state) => ({
          notifications: { ...state.notifications, soundEnabled: enabled },
        })),

      // Dashboard
      setDefaultVisibleTabs: (tabs) =>
        set((state) => ({
          dashboard: { ...state.dashboard, defaultVisibleTabs: tabs },
        })),

      toggleDefaultTab: (tabId) =>
        set((state) => {
          const tabs = state.dashboard.defaultVisibleTabs;
          const isVisible = tabs.includes(tabId);

          return {
            dashboard: {
              ...state.dashboard,
              defaultVisibleTabs: isVisible
                ? tabs.filter((id) => id !== tabId)
                : [...tabs, tabId],
            },
          };
        }),

      // Reset
      resetToDefaults: () => set(DEFAULT_APP_SETTINGS),
    }),
    {
      name: "app-settings-storage",
    }
  )
);
