import { useState } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { FileText, Plus, Filter, ArrowLeft } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChapterCard } from "./components/chapter-card";

type ChapterStatus = "draft" | "in-progress" | "review" | "finished";

interface Chapter {
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
  locations?: string[];
}

const statusConfig: Record<
  ChapterStatus,
  { label: string; color: string; icon: any }
> = {
  draft: { label: "Rascunho", color: "bg-gray-500", icon: null },
  "in-progress": { label: "Em andamento", color: "bg-blue-500", icon: null },
  review: { label: "Em revisão", color: "bg-yellow-500", icon: null },
  finished: { label: "Finalizado", color: "bg-green-500", icon: null },
};

const mockChapters: Chapter[] = [];

export function ChaptersPage() {
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/chapters/",
  });
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<Chapter[]>(mockChapters);
  const [statusFilter, setStatusFilter] = useState<ChapterStatus | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  const filteredChapters = chapters
    .filter((chapter) => statusFilter === "all" || chapter.status === statusFilter)
    .filter(
      (chapter) =>
        searchTerm === "" ||
        chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chapter.number.toString().includes(searchTerm)
    );

  const handleDeleteChapter = (chapterId: string) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
    setChapterToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleCreateChapter = () => {
    const newChapter: Chapter = {
      id: String(Date.now()),
      number: chapters.length + 1,
      title: `Capítulo ${chapters.length + 1}`,
      status: "draft",
      wordCount: 0,
      characterCount: 0,
      lastEdited: new Date(),
    };
    setChapters((prev) => [...prev, newChapter]);
    navigate({
      to: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
      params: { dashboardId, "editor-chapters-id": newChapter.id },
    });
  };

  const handleChapterClick = (chapterId: string) => {
    navigate({
      to: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
      params: { dashboardId, "editor-chapters-id": chapterId },
    });
  };

  const handleChapterDelete = (chapterId: string) => {
    setChapterToDelete(chapterId);
    setShowDeleteDialog(true);
  };

  const handleBack = () => {
    navigate({ to: "/dashboard/$dashboardId", params: { dashboardId } });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Capítulos</h1>

        <div className="flex-1" />

        <Button onClick={handleCreateChapter} variant="magical" className="gap-2 animate-glow">
          <Plus className="h-4 w-4" />
          Novo Capítulo
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
      {chapters.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum capítulo criado</h3>
            <p className="text-muted-foreground mb-4">
              Comece a escrever sua história criando seu primeiro capítulo
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <Input
              type="text"
              placeholder="Buscar capítulos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value: ChapterStatus | "all") =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="in-progress">Em andamento</SelectItem>
                  <SelectItem value="review">Em revisão</SelectItem>
                  <SelectItem value="finished">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chapter Cards */}
          <div className="space-y-4">
            {filteredChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                onClick={handleChapterClick}
                onDelete={handleChapterDelete}
                statusConfig={statusConfig}
              />
            ))}
          </div>
        </div>
        </div>
      )}
      </div>

      {/* Delete Single Chapter Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Capítulo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este capítulo? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setChapterToDelete(null);
                setShowDeleteDialog(false);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              variant="destructive"
              size="lg"
              className="animate-glow-red"
              onClick={() =>
                chapterToDelete && handleDeleteChapter(chapterToDelete)
              }
            >
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
