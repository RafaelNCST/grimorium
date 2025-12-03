export type AutoScrollMode = "off" | "near-end" | "center";

export type CursorColor =
  | "default"
  | "primary"
  | "blue"
  | "green"
  | "purple"
  | "orange";

export interface EditorSettings {
  // Auto Scroll
  autoScrollMode: AutoScrollMode;

  // Typography
  lineHeight: number;
  fontSize: number;
  fontFamily: string;

  // Visual Toggles
  showAnnotationHighlights: boolean;
  enableSpellCheck: boolean;

  // Theme
  sepiaMode: boolean;

  // Cursor
  cursorColor: CursorColor;
}

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  autoScrollMode: "near-end",
  lineHeight: 1.6,
  fontSize: 12,
  fontFamily: "Inter",
  showAnnotationHighlights: true,
  enableSpellCheck: true,
  sepiaMode: true,
  cursorColor: "default",
};

export const CURSOR_COLORS: Record<CursorColor, string> = {
  default: "#000000",
  primary: "hsl(var(--primary))",
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  orange: "#f97316",
};
