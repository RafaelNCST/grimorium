import { FileText, Edit3, AlertTriangle, CheckCircle } from "lucide-react";

export type ChapterStatus = "draft" | "in-progress" | "review" | "finished";

export interface Chapter {
  id: string;
  number: number;
  title: string;
  status: ChapterStatus;
  wordCount: number;
  characterCount: number;
  lastEdited: Date;
  summary?: string;
  characters?: string[];
  items?: string[];
  organizations?: string[];
  beasts?: string[];
  locations?: string[];
}

export const statusConfig = {
  draft: {
    label: "Rascunho",
    icon: FileText,
    color: "bg-muted text-muted-foreground",
    variant: "secondary" as const,
  },
  "in-progress": {
    label: "Em andamento",
    icon: Edit3,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    variant: "default" as const,
  },
  review: {
    label: "Em revisão",
    icon: AlertTriangle,
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    variant: "outline" as const,
  },
  finished: {
    label: "Finalizado",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    variant: "default" as const,
  },
};

export const mockChapters: Chapter[] = [
  {
    id: "1",
    number: 1,
    title: "O Chamado da Aventura",
    status: "finished",
    wordCount: 3245,
    characterCount: 18670,
    lastEdited: new Date("2024-01-15"),
    summary:
      "O protagonista descobre seus poderes mágicos e recebe o chamado para a jornada.",
    characters: ["Aragorn", "Gandalf"],
    items: ["Espada Élfica"],
    locations: ["Vila do Condado"],
  },
  {
    id: "2",
    number: 2,
    title: "Através da Floresta Sombria",
    status: "review",
    wordCount: 2890,
    characterCount: 16125,
    lastEdited: new Date("2024-01-20"),
    summary: "A jornada pela floresta perigosa revela os primeiros desafios.",
    characters: ["Aragorn", "Legolas"],
    locations: ["Floresta Sombria"],
  },
  {
    id: "3",
    number: 3,
    title: "O Encontro com o Mentor",
    status: "in-progress",
    wordCount: 1560,
    characterCount: 8934,
    lastEdited: new Date("2024-01-25"),
    characters: ["Gandalf"],
    locations: ["Torre de Minas Tirith"],
  },
  {
    id: "4",
    number: 4,
    title: "A Primeira Batalha",
    status: "draft",
    wordCount: 0,
    characterCount: 0,
    lastEdited: new Date("2024-01-26"),
  },
];
