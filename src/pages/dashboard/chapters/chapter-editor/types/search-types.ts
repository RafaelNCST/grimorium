export interface DialogueFormats {
  doubleQuotes: boolean;
  singleQuotes: boolean;
  emDash: boolean;
}

export type SearchMode = "all" | "dialogues" | "narration";

export interface SearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  mode: SearchMode;
  dialogueFormats: DialogueFormats;
}

export interface SearchResult {
  index: number;
  start: number;
  end: number;
  text: string;
}

export interface DialogueRange {
  start: number;
  end: number;
  type: "doubleQuotes" | "singleQuotes" | "emDash";
}
