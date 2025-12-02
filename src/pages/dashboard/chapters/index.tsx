import { useState, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { FileText, Plus, ArrowLeft } from "lucide-react";
import { getPlotArcsByBookId } from "@/lib/db/plot.service";
import type { IPlotArc } from "@/types/plot-types";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreateChapterModal,
  type IChapterFormData,
  type EntityMention,
} from "@/components/modals/create-chapter-modal";
import { useChaptersStore, type ChapterData } from "@/stores/chapters-store";

import { ChapterCard } from "./components/chapter-card";

type ChapterStatus = "draft" | "in-progress" | "review" | "finished" | "published";

interface Chapter {
  id: string;
  number: number;
  title: string;
  status: ChapterStatus;
  wordCount: number;
  characterCount: number;
  characterCountWithSpaces: number;
  lastEdited: Date;
  summary?: string;
  plotArc?: { id: string; name: string };
  mentionedCharacters?: EntityMention[];
  mentionedRegions?: EntityMention[];
  mentionedItems?: EntityMention[];
  mentionedFactions?: EntityMention[];
  mentionedRaces?: EntityMention[];
}

const statusConfig: Record<
  ChapterStatus,
  { label: string; color: string; icon: any }
> = {
  draft: { label: "Rascunho", color: "bg-gray-500", icon: null },
  "in-progress": { label: "Em andamento", color: "bg-blue-500", icon: null },
  review: { label: "Em revisão", color: "bg-amber-600", icon: null },
  finished: { label: "Finalizado", color: "bg-emerald-600", icon: null },
  published: { label: "Lançado", color: "bg-purple-500", icon: null },
};

export function ChaptersPage() {
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/chapters/",
  });
  const navigate = useNavigate();

  const { getAllChapters, addChapter, deleteChapter: deleteChapterFromStore } = useChaptersStore();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeTab, setActiveTab] = useState<ChapterStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [plotArcs, setPlotArcs] = useState<IPlotArc[]>([]);

  // Load chapters from store
  useEffect(() => {
    const storedChapters = getAllChapters();
    const mappedChapters: Chapter[] = storedChapters.map((ch) => ({
      id: ch.id,
      number: parseFloat(ch.chapterNumber),
      title: ch.title,
      status: ch.status,
      wordCount: ch.wordCount,
      characterCount: ch.characterCount,
      characterCountWithSpaces: ch.characterCountWithSpaces || ch.characterCount,
      lastEdited: ch.lastEdited ? new Date(ch.lastEdited) : new Date(),
      summary: ch.summary,
      plotArc: ch.plotArcId
        ? plotArcs.find((arc) => arc.id === ch.plotArcId)
          ? { id: ch.plotArcId, name: plotArcs.find((arc) => arc.id === ch.plotArcId)!.name }
          : undefined
        : undefined,
      mentionedCharacters: ch.mentionedCharacters,
      mentionedRegions: ch.mentionedRegions,
      mentionedItems: ch.mentionedItems,
      mentionedFactions: ch.mentionedFactions,
      mentionedRaces: ch.mentionedRaces,
    }));
    setChapters(mappedChapters);
  }, [getAllChapters, plotArcs]);

  // Load plot arcs
  useEffect(() => {
    const loadArcs = async () => {
      try {
        const arcs = await getPlotArcsByBookId(dashboardId);
        setPlotArcs(arcs);
      } catch (error) {
        console.error("Error loading plot arcs:", error);
      }
    };
    loadArcs();
  }, [dashboardId]);

  const getFilteredChapters = (status: ChapterStatus | "all") => {
    return chapters
      .filter((chapter) => status === "all" || chapter.status === status)
      .filter(
        (chapter) =>
          searchTerm === "" ||
          chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.number.toString().includes(searchTerm)
      )
      .sort((a, b) => a.number - b.number); // Sort by chapter number
  };

  const handleDeleteChapter = (chapterId: string) => {
    deleteChapterFromStore(chapterId);
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
    setChapterToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleCreateChapter = (data: IChapterFormData) => {
    const newChapterId = String(Date.now());

    const newChapterData: ChapterData = {
      id: newChapterId,
      chapterNumber: data.chapterNumber,
      title: data.name,
      status: data.status,
      plotArcId: data.plotArcId,
      summary: data.summary || "",
      content: "",
      wordCount: 0,
      characterCount: 0,
      lastEdited: new Date().toISOString(),
      mentionedCharacters: data.mentionedCharacters || [],
      mentionedRegions: data.mentionedRegions || [],
      mentionedItems: data.mentionedItems || [],
      mentionedFactions: data.mentionedFactions || [],
      mentionedRaces: data.mentionedRaces || [],
      annotations: [],
    };

    // Add to store
    addChapter(newChapterData);

    // Find plot arc for display
    const plotArc = data.plotArcId
      ? plotArcs.find((arc) => arc.id === data.plotArcId)
      : undefined;

    const newChapter: Chapter = {
      id: newChapterId,
      number: parseFloat(data.chapterNumber),
      title: data.name,
      status: data.status,
      wordCount: 0,
      characterCount: 0,
      characterCountWithSpaces: 0,
      lastEdited: new Date(),
      summary: data.summary,
      plotArc: plotArc ? { id: plotArc.id, name: plotArc.name } : undefined,
      mentionedCharacters: data.mentionedCharacters,
      mentionedRegions: data.mentionedRegions,
      mentionedItems: data.mentionedItems,
      mentionedFactions: data.mentionedFactions,
      mentionedRaces: data.mentionedRaces,
    };

    setChapters((prev) => [...prev, newChapter]);
    setShowCreateModal(false);
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

        <Button onClick={() => setShowCreateModal(true)} variant="magical" className="gap-2 animate-glow">
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
            {/* Tabs for Status Filtering */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ChapterStatus | "all")}>
              <TabsList className="w-full h-10 flex items-center justify-start rounded-md bg-transparent p-1 text-muted-foreground">
                <TabsTrigger
                  value="all"
                  className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  Todos ({chapters.length})
                </TabsTrigger>
                <TabsTrigger
                  value="draft"
                  className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  {statusConfig.draft.label} ({chapters.filter(ch => ch.status === "draft").length})
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  {statusConfig["in-progress"].label} ({chapters.filter(ch => ch.status === "in-progress").length})
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  {statusConfig.review.label} ({chapters.filter(ch => ch.status === "review").length})
                </TabsTrigger>
                <TabsTrigger
                  value="finished"
                  className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  {statusConfig.finished.label} ({chapters.filter(ch => ch.status === "finished").length})
                </TabsTrigger>
                <TabsTrigger
                  value="published"
                  className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  {statusConfig.published.label} ({chapters.filter(ch => ch.status === "published").length})
                </TabsTrigger>
              </TabsList>

              {/* Search */}
              <Input
                type="text"
                placeholder="Buscar capítulos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/2 mt-4"
              />

              <TabsContent value="all" className="space-y-4 mt-4">
                {getFilteredChapters("all").map((chapter) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    onClick={handleChapterClick}
                    onDelete={handleChapterDelete}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>

              <TabsContent value="draft" className="space-y-4 mt-4">
                {getFilteredChapters("draft").map((chapter) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    onClick={handleChapterClick}
                    onDelete={handleChapterDelete}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>

              <TabsContent value="in-progress" className="space-y-4 mt-4">
                {getFilteredChapters("in-progress").map((chapter) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    onClick={handleChapterClick}
                    onDelete={handleChapterDelete}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>

              <TabsContent value="review" className="space-y-4 mt-4">
                {getFilteredChapters("review").map((chapter) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    onClick={handleChapterClick}
                    onDelete={handleChapterDelete}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>

              <TabsContent value="finished" className="space-y-4 mt-4">
                {getFilteredChapters("finished").map((chapter) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    onClick={handleChapterClick}
                    onDelete={handleChapterDelete}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>

              <TabsContent value="published" className="space-y-4 mt-4">
                {getFilteredChapters("published").map((chapter) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    onClick={handleChapterClick}
                    onDelete={handleChapterDelete}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
      </div>

      {/* Create Chapter Modal */}
      <CreateChapterModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onConfirm={handleCreateChapter}
        bookId={dashboardId}
        existingChapters={chapters.map((ch) => ({
          chapterNumber: String(ch.number),
        }))}
      />

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
