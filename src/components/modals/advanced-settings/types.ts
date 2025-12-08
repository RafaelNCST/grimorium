/**
 * Advanced Settings Modal Types
 */

export type SettingsSection =
  | "account"
  | "dashboard"
  | "notifications"
  | "data"
  | "about";

export interface SettingsSectionConfig {
  id: SettingsSection;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}
