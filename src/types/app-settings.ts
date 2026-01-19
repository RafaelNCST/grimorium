/**
 * Application Settings Types
 *
 * Configurações gerais do aplicativo
 */

// Configurações de Notificações
export interface NotificationSettings {
  soundEnabled: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  soundEnabled: true,
};

// IDs das tabs do dashboard (baseado em dashboard-constants.ts)
export type DashboardTabId =
  | "overview"
  | "characters"
  | "world"
  | "factions"
  | "plot"
  | "magic"
  | "species"
  | "items";

// Configurações de Dashboard
export interface DashboardSettings {
  defaultVisibleTabs: DashboardTabId[];
}

export const ALL_DASHBOARD_TABS: DashboardTabId[] = [
  "overview",
  "characters",
  "world",
  "factions",
  "plot",
  "magic",
  "species",
  "items",
];

export const DEFAULT_DASHBOARD_SETTINGS: DashboardSettings = {
  defaultVisibleTabs: ALL_DASHBOARD_TABS, // All tabs visible by default for new books
};

// Configurações gerais da aplicação (consolidado)
export interface AppSettings {
  notifications: NotificationSettings;
  dashboard: DashboardSettings;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  dashboard: DEFAULT_DASHBOARD_SETTINGS,
};
