export type ChapterStatus =
  | "in-progress"
  | "draft"
  | "review"
  | "finished"
  | "published";

export type AnnotationColor =
  | "purple"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "pink";

// Annotation color styles with weak (default) and strong (selected) tones
// Color names are localized via i18n: annotation_colors.{colorKey}
export const ANNOTATION_COLORS: Record<
  AnnotationColor,
  {
    weak: string; // Background when annotation exists but is not selected
    strong: string; // Background when annotation is selected
  }
> = {
  purple: {
    weak: "rgba(147, 51, 234, 0.15)", // purple-600 with 15% opacity
    strong: "rgba(147, 51, 234, 0.40)", // purple-600 with 40% opacity
  },
  blue: {
    weak: "rgba(59, 130, 246, 0.15)", // blue-500 with 15% opacity
    strong: "rgba(59, 130, 246, 0.40)", // blue-500 with 40% opacity
  },
  green: {
    weak: "rgba(34, 197, 94, 0.15)", // green-500 with 15% opacity
    strong: "rgba(34, 197, 94, 0.40)", // green-500 with 40% opacity
  },
  yellow: {
    weak: "rgba(234, 179, 8, 0.15)", // yellow-500 with 15% opacity
    strong: "rgba(234, 179, 8, 0.40)", // yellow-500 with 40% opacity
  },
  orange: {
    weak: "rgba(249, 115, 22, 0.15)", // orange-500 with 15% opacity
    strong: "rgba(249, 115, 22, 0.40)", // orange-500 with 40% opacity
  },
  pink: {
    weak: "rgba(236, 72, 153, 0.15)", // pink-500 with 15% opacity
    strong: "rgba(236, 72, 153, 0.40)", // pink-500 with 40% opacity
  },
};

export interface Annotation {
  id: string;
  startOffset: number;
  endOffset: number;
  text: string;
  notes: AnnotationNote[];
  createdAt: string;
  color?: AnnotationColor; // Default: purple
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
}
