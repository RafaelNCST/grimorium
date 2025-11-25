import type { JSONContent } from "@tiptap/react";

export type EntityType = "character" | "region" | "faction" | "race" | "item";

export type PaperMode = "light" | "dark";

export type NoteSortOrder = "alphabetical" | "recent";

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
  name: string;
  content?: JSONContent; // TipTap JSON content
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
