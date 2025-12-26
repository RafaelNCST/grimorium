import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FileText, Plus, ArrowLeft, ListOrdered } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntitySearchBar } from "@/components/entity-list";
import {
  CreateChapterModal,
  type IChapterFormData,
  type EntityMention,
} from "@/components/modals/create-chapter-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getChapterMetadataByBookId,
  createChapter,
  deleteChapter as deleteChapterFromDB,
  sortChaptersByNumber,
  detectChapterOrderIssues,
} from "@/lib/db/chapters.service";
import {
  migrateChaptersFromLocalStorage,
  hasChaptersInLocalStorage,
} from "@/lib/db/migrate-chapters";
import { getPlotArcsByBookId, getPlotArcById } from "@/lib/db/plot.service";
import { checkAndShowArcWarning } from "@/lib/helpers/chapter-arc-warning";
import { type ChapterData, useChaptersStore } from "@/stores/chapters-store";
import { useChapterOrderWarningStore } from "@/stores/chapter-order-warning-store";
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
  chapterNumber: string; // String version for validation and sorting
  title: string;
  status: ChapterStatus;
  wordCount: number;
  characterCount: number;
  characterCountWithSpaces: number;
  lastEdited: Date;
  summary?: string;
  plotArc?: { id: string; name: string; status?: import("@/types/plot-types").PlotArcStatus };
  mentionedCharacters?: EntityMention[];
  mentionedRegions?: EntityMention[];
  mentionedItems?: EntityMention[];
  mentionedFactions?: EntityMention[];
  mentionedRaces?: EntityMention[];
}

// Status configuration function that uses i18n
const getStatusConfig = (
  t: (key: string) => string
): Record<ChapterStatus, { label: string; color: string; icon: any }> => ({
  draft: {
    label: t("chapters:status.draft"),
    color: "bg-gray-500",
    icon: null,
  },
  "in-progress": {
    label: t("chapters:status.in_progress"),
    color: "bg-blue-500",
    icon: null,
  },
  review: {
    label: t("chapters:status.review"),
    color: "bg-amber-600",
    icon: null,
  },
  finished: {
    label: t("chapters:status.finished"),
    color: "bg-emerald-600",
    icon: null,
  },
  published: {
    label: t("chapters:status.published"),
    color: "bg-purple-500",
    icon: null,
  },
});

export function ChaptersPage() {
  const { t } = useTranslation(["empty-states", "forms", "chapters"]);
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/chapters/",
  });
  const navigate = useNavigate();

  // Store selectors - pegar o objeto chapters diretamente (referência estável)
  const chaptersCache = useChaptersStore((state) => state.chapters);
  const setCachedChapters = useChaptersStore(
    (state) => state.setCachedChapters
  );
  const removeCachedChapter = useChaptersStore(
    (state) => state.removeCachedChapter
  );

  // Chapter order warning store
  const setShowWarning = useChapterOrderWarningStore(
    (state) => state.setShowWarning
  );

  const [activeTab, setActiveTab] = useState<ChapterStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEnumerateDialog, setShowEnumerateDialog] = useState(false);
  const [chaptersToReorder, setChaptersToReorder] = useState(0);
  const [reorderMode, setReorderMode] = useState<"auto" | "push">("auto");
  const [pushFromChapterId, setPushFromChapterId] = useState<string>("");
  const [plotArcs, setPlotArcs] = useState<IPlotArc[]>([]);

  // Inicializar loading com base no cache - se já tem cache, não mostrar loading
  const [isLoading, setIsLoading] = useState(() => {
    const hasCache = Object.keys(chaptersCache).length > 0;
    return !hasCache; // Se tem cache, não está loading
  });

  // Use ref to track if we've already loaded to prevent infinite loops
  // Track by dashboardId to reload when switching books
  const hasLoadedRef = useRef<Record<string, boolean>>({});

  // Get translated status config
  const statusConfig = getStatusConfig(t);

  // Convert cached chapters to UI format - REATIVO às mudanças do store
  const chapters = useMemo(() => {
    const cachedChapters = Object.values(chaptersCache);

    if (cachedChapters.length === 0) return [];

    return cachedChapters.map((ch) => {
      const arc = ch.plotArcId ? plotArcs.find((arc) => arc.id === ch.plotArcId) : undefined;

      return {
        id: ch.id,
        number: parseFloat(ch.chapterNumber),
        chapterNumber: ch.chapterNumber, // Keep string version
        title: ch.title,
        status: ch.status,
        wordCount: ch.wordCount,
        characterCount: ch.characterCount,
        characterCountWithSpaces: ch.characterCountWithSpaces || 0,
        lastEdited: new Date(ch.lastEdited),
        summary: ch.summary,
        plotArc: arc
          ? {
              id: arc.id,
              name: arc.name,
              status: arc.status,
            }
          : undefined,
        mentionedCharacters: ch.mentionedCharacters || [],
        mentionedRegions: ch.mentionedRegions || [],
        mentionedItems: ch.mentionedItems || [],
        mentionedFactions: ch.mentionedFactions || [],
        mentionedRaces: ch.mentionedRaces || [],
      };
    });
  }, [chaptersCache, plotArcs]);

  // Remover loading quando houver cache
  useEffect(() => {
    if (Object.keys(chaptersCache).length > 0 && isLoading) {
      setIsLoading(false);
      hasLoadedRef.current[dashboardId] = true;
    }
  }, [chaptersCache, dashboardId, isLoading]);

  // Load plot arcs and fresh data from database if needed
  useEffect(() => {
    const loadData = async () => {
      // Always load plot arcs
      const arcs = await getPlotArcsByBookId(dashboardId);
      setPlotArcs(arcs);

      // Check if we need to load from database
      // Only load from database if no cache AND not already loaded
      const hasCachedChapters = Object.keys(chaptersCache).length > 0;
      if (!hasCachedChapters && !hasLoadedRef.current[dashboardId]) {
        try {
          setIsLoading(true);

          // Verificar se há dados no localStorage para migrar
          if (hasChaptersInLocalStorage()) {
            await migrateChaptersFromLocalStorage(dashboardId);
          }

          // Carregar metadados do banco
          const metadata = await getChapterMetadataByBookId(dashboardId);

          // Salvar no cache do store (o useMemo acima converterá para UI)
          const chaptersForCache: ChapterData[] = metadata.map((ch) => ({
            id: ch.id,
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            status: ch.status,
            plotArcId: ch.plotArcId,
            summary: ch.summary || "",
            content: "", // Não carregamos o conteúdo aqui
            wordCount: ch.wordCount,
            characterCount: ch.characterCount,
            characterCountWithSpaces: ch.characterCountWithSpaces,
            lastEdited: ch.lastEdited,
            mentionedCharacters: ch.mentionedCharacters || [],
            mentionedRegions: ch.mentionedRegions || [],
            mentionedItems: ch.mentionedItems || [],
            mentionedFactions: ch.mentionedFactions || [],
            mentionedRaces: ch.mentionedRaces || [],
            annotations: [],
          }));

          setCachedChapters(chaptersForCache);
          hasLoadedRef.current[dashboardId] = true;
        } catch (error) {
          console.error("[ChaptersPage] Erro ao carregar capítulos:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (hasCachedChapters) {
        // Se já tem cache, marcar como carregado e remover loading
        setIsLoading(false);
        hasLoadedRef.current[dashboardId] = true;
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardId]); // Only depend on dashboardId to prevent infinite loops

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
      removeCachedChapter(chapterId); // Remover do cache (UI se atualiza automaticamente)
      setChapterToDelete(null);
      setShowDeleteDialog(false);

      // Check chapter order after deletion
      const remainingChapters = useChaptersStore.getState().getChaptersSorted();
      const hasOrderIssues = detectChapterOrderIssues(
        remainingChapters.map((ch) => ({
          id: ch.id,
          chapterNumber: ch.chapterNumber,
          status: ch.status,
        }))
      );

      if (hasOrderIssues) {
        setShowWarning(true);
      }
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

      // Adicionar ao cache (UI se atualiza automaticamente via useMemo)
      const currentCache = useChaptersStore.getState().getAllChapters();
      useChaptersStore
        .getState()
        .setCachedChapters([...currentCache, newChapterData]);

      setShowCreateModal(false);

      // Check chapter order after creation
      const allChapters = useChaptersStore.getState().getChaptersSorted();
      const hasOrderIssues = detectChapterOrderIssues(
        allChapters.map((ch) => ({
          id: ch.id,
          chapterNumber: ch.chapterNumber,
          status: ch.status,
        }))
      );

      if (hasOrderIssues) {
        setShowWarning(true);
      }

      if (data.plotArcId) {
        try {
          const arc = await getPlotArcById(data.plotArcId);
          if (arc) {
            await checkAndShowArcWarning(dashboardId, data.plotArcId, arc);
          }
        } catch (error) {
          console.error("Failed to check arc warning:", error);
        }
      }
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
    // Capturar posição do scroll antes de abrir o modal
    if (parentRef.current) {
      scrollPositionRef.current = parentRef.current.scrollTop;
    }
    setChapterToDelete(chapterId);
    setShowDeleteDialog(true);
  };

  const handleBack = () => {
    navigate({ to: "/dashboard/$dashboardId", params: { dashboardId } });
  };

  // Função para verificar se os capítulos estão fora de ordem
  const needsReordering = useMemo(() => {
    if (chapters.length === 0) return false;

    // Use optimized detection function
    return detectChapterOrderIssues(
      chapters.map((ch) => ({
        id: ch.id,
        chapterNumber: ch.chapterNumber,
        status: ch.status,
      }))
    );
  }, [chapters]);

  // Calculate push preview - how many chapters will be affected
  const pushPreview = useMemo(() => {
    if (reorderMode !== "push" || !pushFromChapterId) return { count: 0, examples: [] };

    // Sort chapters first
    const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);

    // Find the index of the selected chapter
    const selectedIndex = sortedChapters.findIndex((ch) => ch.id === pushFromChapterId);
    if (selectedIndex === -1) return { count: 0, examples: [] };

    // Get all chapters from this position onwards (including the selected one)
    const affectedChapters = sortedChapters.slice(selectedIndex);

    // Create examples (first 5)
    const examples = affectedChapters.slice(0, 5).map((ch) => {
      const oldNum = ch.chapterNumber;
      const newNum = String(parseInt(oldNum, 10) + 1);
      return { oldNum, newNum, title: ch.title };
    });

    return {
      count: affectedChapters.length,
      examples,
      hasMore: affectedChapters.length > 5,
    };
  }, [reorderMode, pushFromChapterId, chapters]);

  // Função para reordenar os capítulos automaticamente
  const handleReorderChapters = async () => {
    try {
      const { updateChapter } = await import("@/lib/db/chapters.service");
      let allUpdates: Array<{ id: string; originalNumber: string; newNumber: string }> = [];

      if (reorderMode === "push") {
        // MODO PUSH: Empurrar capítulos a partir de um capítulo específico (por ID)
        // Sort chapters first to find correct position
        const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);

        // Find the index of the selected chapter
        const selectedIndex = sortedChapters.findIndex((ch) => ch.id === pushFromChapterId);

        if (selectedIndex === -1) {
          console.error("Selected chapter not found");
          return;
        }

        // Create a Set of IDs that should be pushed (from selected position onwards)
        const chaptersToPush = new Set(
          sortedChapters.slice(selectedIndex).map((ch) => ch.id)
        );

        // Map all chapters and push only those in the set
        allUpdates = chapters.map((ch) => {
          if (chaptersToPush.has(ch.id)) {
            // Empurra +1
            const chapterNum = parseInt(ch.chapterNumber, 10);
            return {
              id: ch.id,
              originalNumber: ch.chapterNumber,
              newNumber: String(chapterNum + 1),
            };
          }

          // Não muda
          return {
            id: ch.id,
            originalNumber: ch.chapterNumber,
            newNumber: ch.chapterNumber,
          };
        });
      } else {
        // MODO AUTO: Reordenação automática (comportamento original)
        // 1. Sort chapters using sorting logic (integer, status)
        const sortedChapters = sortChaptersByNumber(
          chapters.map((ch) => ({
            id: ch.id,
            chapterNumber: ch.chapterNumber,
            status: ch.status,
          }))
        );

        // 2. Renumber maintaining duplicates together, removing gaps
        // Example: [1, 3, 5, 5, 5, 7] → [1, 2, 3, 3, 3, 4]
        let currentNumber = 1;
        let previousOriginalNumber: number | null = null;

        allUpdates = sortedChapters.map((chapter) => {
          const originalNumber = parseInt(chapter.chapterNumber, 10);

          // If this is a different number than previous, increment counter
          if (previousOriginalNumber !== null && originalNumber !== previousOriginalNumber) {
            currentNumber++;
          }

          previousOriginalNumber = originalNumber;

          return {
            id: chapter.id,
            originalNumber: chapter.chapterNumber,
            newNumber: String(currentNumber),
          };
        });
      }

      // 3. Filter only chapters that actually changed
      // This is crucial for performance with 1000+ chapters!
      const changedChapters = allUpdates.filter(
        (update) => update.originalNumber !== update.newNumber
      );

      console.log(
        `[Reordenação ${reorderMode}] ${changedChapters.length} de ${allUpdates.length} capítulos precisam ser atualizados`
      );

      // If no chapters need to be updated, just close the dialog
      if (changedChapters.length === 0) {
        setShowEnumerateDialog(false);
        return;
      }

      // 4. Update database only for changed chapters
      for (const update of changedChapters) {
        await updateChapter(update.id, {
          chapterNumber: update.newNumber,
        });
      }

      // 5. Update cache with all new numbers (even unchanged, for consistency)
      const currentChapters = useChaptersStore.getState().getAllChapters();
      const updatedChapters = currentChapters.map((cached) => {
        const update = allUpdates.find((u) => u.id === cached.id);
        if (update) {
          return {
            ...cached,
            chapterNumber: update.newNumber,
          };
        }
        return cached;
      });

      setCachedChapters(updatedChapters);
      setShowEnumerateDialog(false);

      // Check chapter order after reordering (especially for push mode which creates gaps)
      const reorderedChapters = sortChaptersByNumber(updatedChapters);
      const hasOrderIssues = detectChapterOrderIssues(
        reorderedChapters.map((ch) => ({
          id: ch.id,
          chapterNumber: ch.chapterNumber,
          status: ch.status,
        }))
      );

      if (hasOrderIssues) {
        setShowWarning(true);
      }
    } catch (error) {
      console.error("[ChaptersPage] Erro ao reordenar capítulos:", error);
    }
  };

  // Virtualização - Ref para o container
  const parentRef = useRef<HTMLDivElement>(null);

  // Ref para armazenar a posição do scroll
  const scrollPositionRef = useRef<number>(0);

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

  // Prevenir scroll jump quando modal abre/fecha usando useLayoutEffect (síncrono)
  useLayoutEffect(() => {
    if (!parentRef.current) return;

    const container = parentRef.current;
    const savedPosition = scrollPositionRef.current;

    // Restaurar posição imediatamente quando o modal muda de estado
    if (savedPosition !== 0) {
      container.scrollTop = savedPosition;
    }

    // Observar mudanças no scroll e forçar a posição quando o modal está aberto
    const observer = new MutationObserver(() => {
      if (showDeleteDialog && container.scrollTop !== savedPosition) {
        container.scrollTop = savedPosition;
      }
    });

    // Observar mudanças no DOM que possam afetar o scroll
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-scroll-locked', 'style'],
    });

    return () => observer.disconnect();
  }, [showDeleteDialog]);

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
        <LoadingSpinner size="lg" />
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
        <h1 className="text-xl font-semibold">{t("chapters:page.title")}</h1>

        <div className="flex-1" />

        <Button
          onClick={() => {
            // Reset to auto mode and set first chapter as default for push
            setReorderMode("auto");
            const firstChapter = chapters.length > 0 ? chapters[0].id : "";
            setPushFromChapterId(firstChapter);

            // Calculate how many chapters need reordering before opening modal
            const sortedChapters = sortChaptersByNumber(
              chapters.map((ch) => ({
                id: ch.id,
                chapterNumber: ch.chapterNumber,
                status: ch.status,
              }))
            );

            let currentNumber = 1;
            let previousOriginalNumber: number | null = null;
            let changedCount = 0;

            for (const chapter of sortedChapters) {
              const originalNumber = parseInt(chapter.chapterNumber, 10);

              if (previousOriginalNumber !== null && originalNumber !== previousOriginalNumber) {
                currentNumber++;
              }

              const newNumber = String(currentNumber);
              if (chapter.chapterNumber !== newNumber) {
                changedCount++;
              }

              previousOriginalNumber = originalNumber;
            }

            setChaptersToReorder(changedCount);
            setShowEnumerateDialog(true);
          }}
          variant="secondary"
          className="gap-2"
        >
          <ListOrdered className="h-4 w-4" />
          Reordenar Capítulos
        </Button>

        <Button
          onClick={() => setShowCreateModal(true)}
          variant="magical"
          className="gap-2 animate-glow"
        >
          <Plus className="h-4 w-4" />
          {t("chapters:page.new_chapter")}
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
                    {t("chapters:page.total_badge")} ({chapters.length})
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

                {/* Search - only show when there are chapters */}
                {chapters.length > 0 && (
                  <EntitySearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder={t("chapters:page.search_placeholder")}
                    maxWidth="max-w-[50%]"
                    className="mt-4"
                  />
                )}

                <TabsContent
                  value="all"
                  className="mt-4 relative"
                  style={{ minHeight: "calc(100vh - 300px)" }}
                >
                  <VirtualizedChapterList
                    chapters={getFilteredChapters("all")}
                    showStatus
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

      {/* Delete Single Chapter Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent
          onOverlayClick={() => {
            setChapterToDelete(null);
            setShowDeleteDialog(false);
          }}
          onOpenAutoFocus={(e) => {
            // Prevent auto-focus to avoid scrolling the list when modal opens
            e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            // Prevent auto-focus to avoid scrolling when modal closes
            e.preventDefault();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{t("chapters:delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("chapters:delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setChapterToDelete(null);
                setShowDeleteDialog(false);
              }}
            >
              {t("chapters:delete.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="animate-glow-red"
              onClick={() =>
                chapterToDelete && handleDeleteChapter(chapterToDelete)
              }
            >
              {t("chapters:delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enumerate Chapters Dialog */}
      <AlertDialog open={showEnumerateDialog} onOpenChange={setShowEnumerateDialog}>
        <AlertDialogContent
          onOverlayClick={() => setShowEnumerateDialog(false)}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <ListOrdered className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              Reordenar Capítulos
            </AlertDialogTitle>
            <AlertDialogDescription>
              Escolha o tipo de reordenação que deseja aplicar:
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Mode Selection */}
          <RadioGroup
            value={reorderMode}
            onValueChange={(value) => setReorderMode(value as "auto" | "push")}
            className="space-y-3"
          >
            {/* Auto Mode */}
            <label
              htmlFor="mode-auto"
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                reorderMode === "auto"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value="auto" id="mode-auto" className="mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Reordenar automaticamente</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Remove lacunas e organiza tudo em ordem
                </div>
                {reorderMode === "auto" && chaptersToReorder > 0 && (
                  <div className="text-xs text-primary mt-2">
                    → {chaptersToReorder} {chaptersToReorder === 1 ? "capítulo será atualizado" : "capítulos serão atualizados"}
                  </div>
                )}
                {reorderMode === "auto" && chaptersToReorder === 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Todos os capítulos já estão organizados
                  </div>
                )}
              </div>
            </label>

            {/* Push Mode */}
            <label
              htmlFor="mode-push"
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                reorderMode === "push"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value="push" id="mode-push" className="mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Empurrar capítulos</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Abre espaço para inserir novo capítulo
                </div>

                {reorderMode === "push" && (
                  <div className="mt-3 space-y-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Empurrar a partir do capítulo:</label>
                      <Select
                        value={pushFromChapterId}
                        onValueChange={(value) => setPushFromChapterId(value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Selecione um capítulo" />
                        </SelectTrigger>
                        <SelectContent>
                          {chapters
                            .sort((a, b) => a.number - b.number)
                            .map((chapter) => (
                              <SelectItem
                                key={chapter.id}
                                value={chapter.id}
                              >
                                {chapter.chapterNumber} - {chapter.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {pushPreview.count > 0 && (
                      <div className="rounded-md bg-muted p-3 space-y-1 text-xs">
                        <div className="font-medium text-primary">
                          {pushPreview.count} {pushPreview.count === 1 ? "capítulo será empurrado" : "capítulos serão empurrados"}:
                        </div>
                        {pushPreview.examples.map((ex, idx) => (
                          <div key={idx} className="text-muted-foreground">
                            • Cap {ex.oldNum} → Cap {ex.newNum}
                          </div>
                        ))}
                        {pushPreview.hasMore && (
                          <div className="text-muted-foreground italic">
                            ... e mais {pushPreview.count - 5} capítulos
                          </div>
                        )}
                      </div>
                    )}
                    {pushPreview.count === 0 && (
                      <div className="text-xs text-muted-foreground italic">
                        Nenhum capítulo será afetado
                      </div>
                    )}
                  </div>
                )}
              </div>
            </label>
          </RadioGroup>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReorderChapters}
              variant="magical"
              className="animate-glow"
              disabled={
                (reorderMode === "auto" && chaptersToReorder === 0) ||
                (reorderMode === "push" && pushPreview.count === 0)
              }
            >
              Executar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
