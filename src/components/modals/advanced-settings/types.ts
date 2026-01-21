/**
 * Advanced Settings Modal Types
 */

export type SettingsSection =
  | "account"
  | "dashboard"
  | "data"
  | "updates"
  | "about";

export interface SettingsSectionConfig {
  id: SettingsSection;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}
