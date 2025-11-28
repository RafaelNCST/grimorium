import type { JSONContent } from "@tiptap/react";

export type EntityType = "character" | "region" | "faction" | "race" | "item" | "arc";

export type PaperMode = "light" | "dark";

export type NoteSortOrder = "alphabetical" | "recent";

export type NoteColor = "sepia" | "purple" | "green" | "blue" | "red" | "gold" | "cyan" | "indigo" | "lime";

export type NoteTextColor = "black" | "white";

export interface INoteLink {
  id: string;
  entityId: string;
  entityType: EntityType;
  bookId: string;
  entityName?: string; // Populated when fetching for display
  createdAt?: string;
}

export interface INote {
  id: string;
  bookId: string;
  name: string; // DEPRECATED - kept for migration
  content?: JSONContent; // TipTap JSON content
  color?: NoteColor; // Color for post-it display
  textColor?: NoteTextColor; // Text color (black or white)
  order?: number; // Manual ordering (lower = earlier)
  paperMode: PaperMode;
  links: INoteLink[];
  createdAt: string;
  updatedAt: string;
}

export interface INoteFormData {
  name: string;
  links: INoteLink[];
}

export interface INoteFilters {
  searchTerm: string;
  sortOrder: NoteSortOrder;
  entityTypeFilters: EntityType[];
}
