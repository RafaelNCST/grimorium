export type ChapterStatus =
  | "in-progress"
  | "draft"
  | "review"
  | "finished"
  | "published";

export interface Annotation {
  id: string;
  startOffset: number;
  endOffset: number;
  text: string;
  notes: AnnotationNote[];
  createdAt: string;
}

export interface AnnotationNote {
  id: string;
  text: string;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EntityMention {
  id: string;
  name: string;
  image?: string;
  // Character fields
  age?: string;
  gender?: string;
  role?: string;
  status?: string;
  description?: string;
  // Item fields
  category?: string;
  basicDescription?: string;
  // Faction fields
  summary?: string;
  factionType?: string;
  // Race fields
  scientificName?: string;
  domain?: string[];
  // Region fields
  scale?: string;
  parentId?: string;
  parentName?: string;
}

export type TextAlignment = "left" | "center" | "right" | "justify";

export interface ChapterData {
  id: string;
  chapterNumber: string;
  title: string;
  status: ChapterStatus;
  plotArcId?: string;
  summary: string;
  content: string;
  textAlignment?: TextAlignment;
  wordCount: number;
  characterCount: number;
  characterCountWithSpaces?: number;
  lastEdited: string;
  mentionedCharacters: EntityMention[];
  mentionedRegions: EntityMention[];
  mentionedItems: EntityMention[];
  mentionedFactions: EntityMention[];
  mentionedRaces: EntityMention[];
  annotations: Annotation[];
}
