export type ChapterStatus = "Rascunho" | "Revisão" | "Completo" | "Publicado";

export interface ChapterListItem {
  id: string;
  number: number;
  title: string;
  wordCount: number;
  lastModified: string;
  status: ChapterStatus;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
  lastModified: string;
  status: ChapterStatus;
  notes: string;
  tags: string[];
}

export const statusConfig = {
  Rascunho: { color: "bg-gray-500", label: "Rascunho" },
  Revisão: { color: "bg-yellow-500", label: "Revisão" },
  Completo: { color: "bg-green-500", label: "Completo" },
  Publicado: { color: "bg-blue-500", label: "Publicado" },
};

export const mockChapters: ChapterListItem[] = [];
