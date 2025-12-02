export type ChapterStatus = "in-progress" | "draft" | "review" | "finished" | "published";

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
}

export interface ChapterData {
  id: string;
  chapterNumber: string;
  title: string;
  status: ChapterStatus;
  plotArcId?: string;
  summary: string;
  content: string;
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
  // Editor formatting settings (individual per chapter)
  fontSize?: number;
  fontFamily?: string;
}
