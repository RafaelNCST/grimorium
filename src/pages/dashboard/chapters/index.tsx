import { useState, useEffect, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FileText, Plus, ArrowLeft, Target, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  CreateChapterModal,
  type IChapterFormData,
  type EntityMention,
} from "@/components/modals/create-chapter-modal";
import { GlobalGoalsModal } from "@/components/modals/global-goals-modal";
import { WarningsSettingsModal } from "@/components/modals/warnings-settings-modal";
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
import { useGlobalGoals } from "@/contexts/GlobalGoalsContext";
import { useWarningsSettings } from "@/contexts/WarningsSettingsContext";
import {
  getChapterMetadataByBookId,
  createChapter,
  deleteChapter as deleteChapterFromDB,
  type ChapterMetadata,
} from "@/lib/db/chapters.service";
import {
  migrateChaptersFromLocalStorage,
  hasChaptersInLocalStorage,
} from "@/lib/db/migrate-chapters";
import { getPlotArcsByBookId } from "@/lib/db/plot.service";
import { type ChapterData } from "@/stores/chapters-store";
import type { IPlotArc } from "@/types/plot-types";

import { ChapterCard } from "./components/chapter-card";

type ChapterStatus =
  | "draft"
  | "in-progress"
  | "review"
  | "finished"
  | "published";

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
  const { t } = useTranslation(["empty-states", "forms"]);
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/chapters/",
  });
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeTab, setActiveTab] = useState<ChapterStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showWarningsSettingsModal, setShowWarningsSettingsModal] =
    useState(false);
  const [plotArcs, setPlotArcs] = useState<IPlotArc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { goals: globalGoals, updateGoals } = useGlobalGoals();
  const { settings: warningsSettings, updateSettings: updateWarningsSettings } =
    useWarningsSettings();

  // Load plot arcs and chapters
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Primeiro, carregar arcos (se necessário para o mapeamento)
        const arcs = await getPlotArcsByBookId(dashboardId);
        setPlotArcs(arcs);

        // Verificar se há dados no localStorage para migrar
        if (hasChaptersInLocalStorage()) {
          console.log(
            "[ChaptersPage] Detectados capítulos no localStorage, migrando..."
          );
          await migrateChaptersFromLocalStorage(dashboardId);
        }

        // Carregar metadados do banco
        const metadata = await getChapterMetadataByBookId(dashboardId);

        console.log("[ChaptersPage] Capítulos carregados:", metadata.length);

        // Mapear para formato da UI
        const mappedChapters: Chapter[] = metadata.map((ch) => ({
          id: ch.id,
          number: parseFloat(ch.chapterNumber),
          title: ch.title,
          status: ch.status,
          wordCount: ch.wordCount,
          characterCount: ch.characterCount,
          characterCountWithSpaces: ch.characterCountWithSpaces,
          lastEdited: new Date(ch.lastEdited),
          summary: ch.summary,
          plotArc: ch.plotArcId
            ? arcs.find((arc) => arc.id === ch.plotArcId)
              ? {
                  id: ch.plotArcId,
                  name: arcs.find((arc) => arc.id === ch.plotArcId)!.name,
                }
              : undefined
            : undefined,
          mentionedCharacters: ch.mentionedCharacters,
          mentionedRegions: ch.mentionedRegions,
          mentionedItems: ch.mentionedItems,
          mentionedFactions: ch.mentionedFactions,
          mentionedRaces: ch.mentionedRaces,
        }));

        setChapters(mappedChapters);
      } catch (error) {
        console.error("[ChaptersPage] Erro ao carregar capítulos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dashboardId]);

  const getFilteredChapters = (status: ChapterStatus | "all") =>
    chapters
      .filter((chapter) => status === "all" || chapter.status === status)
      .filter(
        (chapter) =>
          searchTerm === "" ||
          chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.number.toString().includes(searchTerm)
      )
      .sort((a, b) => a.number - b.number); // Sort by chapter number
  const handleDeleteChapter = async (chapterId: string) => {
    try {
      await deleteChapterFromDB(chapterId);
      setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
      setChapterToDelete(null);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("[ChaptersPage] Erro ao deletar capítulo:", error);
    }
  };

  const handleCreateChapter = async (data: IChapterFormData) => {
    try {
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
        characterCountWithSpaces: 0,
        lastEdited: new Date().toISOString(),
        mentionedCharacters: data.mentionedCharacters || [],
        mentionedRegions: data.mentionedRegions || [],
        mentionedItems: data.mentionedItems || [],
        mentionedFactions: data.mentionedFactions || [],
        mentionedRaces: data.mentionedRaces || [],
        annotations: [],
      };

      // Salvar no banco
      await createChapter(dashboardId, newChapterData);

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
        mentionedCharacters: data.mentionedCharacters || [],
        mentionedRegions: data.mentionedRegions || [],
        mentionedItems: data.mentionedItems || [],
        mentionedFactions: data.mentionedFactions || [],
        mentionedRaces: data.mentionedRaces || [],
      };

      setChapters((prev) => [...prev, newChapter]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("[ChaptersPage] Erro ao criar capítulo:", error);
    }
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

  // Virtualização - Ref para o container
  const parentRef = useRef<HTMLDivElement>(null);

  // Estado para controlar se deve usar virtualização
  const [shouldVirtualize, setShouldVirtualize] = useState(false);

  // Ativar virtualização após montagem inicial
  useEffect(() => {
    // Pequeno delay para garantir que o DOM está montado
    const timer = setTimeout(() => {
      setShouldVirtualize(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Componente auxiliar para lista virtualizada
  const VirtualizedChapterList = ({
    chapters,
    showStatus,
  }: {
    chapters: Chapter[];
    showStatus: boolean;
  }) => {
    const rowVirtualizer = useVirtualizer({
      count: chapters.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 200,
      overscan: 10,
      enabled: shouldVirtualize, // Só ativar após montagem
    });

    if (chapters.length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-medium mb-1">
              {t("empty-states:chapters.not-found.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("empty-states:chapters.not-found.description")}
            </p>
          </div>
        </div>
      );
    }

    // Para poucos capítulos ou antes da virtualização estar pronta, renderizar todos
    if (!shouldVirtualize || chapters.length <= 20) {
      return (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              onClick={handleChapterClick}
              onDelete={handleChapterDelete}
              statusConfig={statusConfig}
              showStatus={showStatus}
            />
          ))}
        </div>
      );
    }

    const virtualItems = rowVirtualizer.getVirtualItems();

    return (
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem) => {
          const chapter = chapters[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="pb-4">
                <ChapterCard
                  chapter={chapter}
                  onClick={handleChapterClick}
                  onDelete={handleChapterDelete}
                  statusConfig={statusConfig}
                  showStatus={showStatus}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando capítulos...</p>
      </div>
    );
  }

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

        <Button
          onClick={() => setShowGoalsModal(true)}
          variant="secondary"
          className="gap-2"
        >
          <Target className="h-4 w-4" />
          Metas
        </Button>

        <Button
          onClick={() => setShowWarningsSettingsModal(true)}
          variant="secondary"
          className="gap-2"
        >
          <Bell className="h-4 w-4" />
          Gerenciar Avisos
        </Button>

        <Button
          onClick={() => setShowCreateModal(true)}
          variant="magical"
          className="gap-2 animate-glow"
        >
          <Plus className="h-4 w-4" />
          Novo Capítulo
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" ref={parentRef}>
        {chapters.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("empty-states:chapters.empty.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("empty-states:chapters.empty.description")}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {/* Tabs for Status Filtering */}
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as ChapterStatus | "all")
                }
              >
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
                    {statusConfig.draft.label} (
                    {chapters.filter((ch) => ch.status === "draft").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="in-progress"
                    className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                  >
                    {statusConfig["in-progress"].label} (
                    {
                      chapters.filter((ch) => ch.status === "in-progress")
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger
                    value="review"
                    className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                  >
                    {statusConfig.review.label} (
                    {chapters.filter((ch) => ch.status === "review").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="finished"
                    className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                  >
                    {statusConfig.finished.label} (
                    {chapters.filter((ch) => ch.status === "finished").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="published"
                    className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                  >
                    {statusConfig.published.label} (
                    {chapters.filter((ch) => ch.status === "published").length})
                  </TabsTrigger>
                </TabsList>

                {/* Search */}
                <Input
                  type="text"
                  placeholder={t("forms:search.chapters")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-1/2 mt-4"
                />

                <TabsContent
                  value="all"
                  className="mt-4 relative"
                  style={{ minHeight: "calc(100vh - 300px)" }}
                >
                  <VirtualizedChapterList
                    chapters={getFilteredChapters("all")}
                    showStatus={true}
                  />
                </TabsContent>

                <TabsContent
                  value="draft"
                  className="mt-4 relative"
                  style={{ minHeight: "calc(100vh - 300px)" }}
                >
                  <VirtualizedChapterList
                    chapters={getFilteredChapters("draft")}
                    showStatus={false}
                  />
                </TabsContent>

                <TabsContent
                  value="in-progress"
                  className="mt-4 relative"
                  style={{ minHeight: "calc(100vh - 300px)" }}
                >
                  <VirtualizedChapterList
                    chapters={getFilteredChapters("in-progress")}
                    showStatus={false}
                  />
                </TabsContent>

                <TabsContent
                  value="review"
                  className="mt-4 relative"
                  style={{ minHeight: "calc(100vh - 300px)" }}
                >
                  <VirtualizedChapterList
                    chapters={getFilteredChapters("review")}
                    showStatus={false}
                  />
                </TabsContent>

                <TabsContent
                  value="finished"
                  className="mt-4 relative"
                  style={{ minHeight: "calc(100vh - 300px)" }}
                >
                  <VirtualizedChapterList
                    chapters={getFilteredChapters("finished")}
                    showStatus={false}
                  />
                </TabsContent>

                <TabsContent
                  value="published"
                  className="mt-4 relative"
                  style={{ minHeight: "calc(100vh - 300px)" }}
                >
                  <VirtualizedChapterList
                    chapters={getFilteredChapters("published")}
                    showStatus={false}
                  />
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

      {/* Global Goals Modal */}
      <GlobalGoalsModal
        open={showGoalsModal}
        onOpenChange={setShowGoalsModal}
        goals={globalGoals}
        onSave={updateGoals}
      />

      {/* Warnings Settings Modal */}
      <WarningsSettingsModal
        open={showWarningsSettingsModal}
        onOpenChange={setShowWarningsSettingsModal}
        settings={warningsSettings}
        onSave={updateWarningsSettings}
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
