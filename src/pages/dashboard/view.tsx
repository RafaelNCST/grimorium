import { useState, useEffect } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UseNavigateResult } from "@tanstack/react-router";
import {
  ArrowLeft,
  Edit2,
  Users,
  MapPin,
  Building,
  Clock,
  Sparkles,
  BookOpen,
  Target,
  Trash2,
  Dna,
  FileText,
  Skull,
  Package,
  EyeOff,
  Eye,
  Palette,
  Book,
  NotebookTabs,
} from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NotesTab } from "./notes";
import { BestiaryTab } from "./tabs/bestiary";
import { BookSpeciesTab } from "./tabs/book-species";
import { CharactersTab } from "./tabs/characters";
import { EncyclopediaTab } from "./tabs/encyclopedia";
import { ItemsTab } from "./tabs/items";
import { OrganizationsTab } from "./tabs/organizations";
import { OverviewTab } from "./tabs/overview";
import { PlotTab } from "./tabs/plot";
import { PowerSystemTab } from "./tabs/power-system";
import { RelationsTab } from "./tabs/characters/character-detail/relations";
import { SpeciesTab } from "./tabs/species";
import { WorldTab } from "./tabs/world";

import { Book as BookType } from "@/stores/book-store";
import { useLanguageStore } from "@/stores/language-store";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

interface PlotArc {
  id: string;
  name: string;
  size: "pequeno" | "médio" | "grande";
  focus: string;
  description: string;
  events: any[];
  progress: number;
  isCurrentArc: boolean;
}

interface SortableTabProps {
  tab: TabConfig;
  isCustomizing: boolean;
  onToggleVisibility: (tabId: string) => void;
}

function SortableTab({
  tab,
  isCustomizing,
  onToggleVisibility,
}: SortableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id, disabled: !isCustomizing || tab.isDefault });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isCustomizing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-md flex-1 min-w-0 ${
          tab.isDefault ? "opacity-75" : ""
        } ${!tab.visible ? "opacity-50" : ""}`}
      >
        {!tab.isDefault && (
          <div
            {...attributes}
            {...listeners}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          />
        )}
        <tab.icon className="w-4 h-4" />
        <span className="flex-1 text-sm">{tab.label}</span>
        {!tab.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleVisibility(tab.id)}
            className="h-6 w-6 p-0 relative z-10"
          >
            {tab.visible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </Button>
        )}
      </div>
    );
  }

  if (!tab.visible) return null;

  return (
    <TabsTrigger value={tab.id} className="flex items-center gap-2 py-3 flex-1">
      <tab.icon className="w-4 h-4" />
      <span className="hidden sm:inline">{tab.label}</span>
    </TabsTrigger>
  );
}

interface DashboardViewProps {
  book: BookType;
  bookId: string;
  onBack: () => void;
  activeTab: string;
  isEditingHeader: boolean;
  isHeaderHidden: boolean;
  isCustomizing: boolean;
  tabs: TabConfig[];
  currentArc?: PlotArc;
  onActiveTabChange: (tab: string) => void;
  onEditingHeaderChange: (editing: boolean) => void;
  onHeaderHiddenChange: (hidden: boolean) => void;
  onCustomizingChange: (customizing: boolean) => void;
  onTabsUpdate: (tabs: TabConfig[]) => void;
  onToggleTabVisibility: (tabId: string) => void;
  onUpdateBook: (updates: Partial<BookType>) => void;
  onDeleteBook: () => void;
  navigate: UseNavigateResult<string>;
}

const genres = [
  "Alta Fantasia",
  "Fantasia Urbana",
  "Épico",
  "Romance",
  "Mistério",
  "Suspense",
  "Terror",
  "Ficção Científica",
  "Distopia",
  "Aventura",
  "Drama",
  "Comédia",
  "Biografia",
  "Histórico",
  "Contemporâneo",
];

const visualStyles = ["Cartoon", "Anime", "Realista"];

const defaultTabs: TabConfig[] = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: BookOpen,
    visible: true,
    isDefault: true,
  },
  { id: "characters", label: "Personagens", icon: Users, visible: true },
  { id: "world", label: "Mundo", icon: MapPin, visible: true },
  { id: "organizations", label: "Organizações", icon: Building, visible: true },
  { id: "plot", label: "Enredo", icon: Target, visible: true },
  { id: "magic", label: "Sistema de Poder", icon: Sparkles, visible: true },
  { id: "species", label: "Espécies", icon: Dna, visible: true },
  { id: "bestiary", label: "Bestiário", icon: Skull, visible: true },
  { id: "items", label: "Itens", icon: Package, visible: true },
  { id: "encyclopedia", label: "Enciclopédia", icon: BookOpen, visible: true },
];

export function DashboardView({
  book,
  bookId,
  onBack,
  activeTab,
  isEditingHeader,
  isHeaderHidden,
  isCustomizing,
  tabs: propsTabs,
  currentArc,
  onActiveTabChange,
  onEditingHeaderChange,
  onHeaderHiddenChange,
  onCustomizingChange,
  onTabsUpdate,
  onToggleTabVisibility,
  onUpdateBook,
  onDeleteBook,
  navigate,
}: DashboardViewProps) {
  const { t } = useLanguageStore();
  const [draftBook, setDraftBook] = useState(book);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [tabs, setTabs] = useState<TabConfig[]>(
    propsTabs.length > 0 ? propsTabs : defaultTabs
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (propsTabs.length === 0) {
      onTabsUpdate(defaultTabs);
    }
  }, [propsTabs, onTabsUpdate]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      onCustomizingChange(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [onCustomizingChange]);

  useEffect(() => {
    if (isCustomizing && activeTab !== "overview") {
      onCustomizingChange(false);
    }
  }, [activeTab, isCustomizing, onCustomizingChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const newTabs = [...tabs];
      const oldIndex = newTabs.findIndex((item) => item.id === active.id);
      const newIndex = newTabs.findIndex((item) => item.id === over.id);

      const updatedTabs = arrayMove(newTabs, oldIndex, newIndex);
      setTabs(updatedTabs);
      onTabsUpdate(updatedTabs);
    }
  };

  const handleToggleVisibility = (tabId: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, visible: !tab.visible } : tab
    );
    setTabs(updatedTabs);
    onToggleTabVisibility(tabId);
  };

  const handleSave = () => {
    onUpdateBook(draftBook);
    onEditingHeaderChange(false);
  };

  const handleCancel = () => {
    setDraftBook(book);
    onEditingHeaderChange(false);
  };

  const handleDelete = () => {
    if (deleteInput === book.title) {
      onDeleteBook();
      setShowDeleteDialog(false);
    }
  };

  const visibleTabs = tabs.filter((tab) => tab.visible);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onBack}
                      className="hover:bg-muted"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">
                      Voltar para biblioteca
                    </p>
                  </TooltipContent>
                </Tooltip>
                <h1 className="text-2xl font-bold">{t("book.dashboard")}</h1>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowDeleteDialog(true)}
                      className="hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">Excluir livro</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate({
                          to: "/dashboard/$dashboardId/chapter/chapters",
                          params: { dashboardId: bookId },
                        })
                      }
                      className="hover:bg-muted"
                    >
                      <Book className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">Capítulos</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate({
                          to: "/dashboard/$dashboardId/notes/notes",
                          params: { dashboardId: bookId },
                        })
                      }
                      className="hover:bg-muted"
                    >
                      <NotebookTabs className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">Anotações</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (!isCustomizing) {
                          onActiveTabChange("overview");
                        }
                        onCustomizingChange(!isCustomizing);
                      }}
                      className={`hover:bg-muted ${isCustomizing ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <Palette className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">
                      {isCustomizing
                        ? "Sair do modo personalizar"
                        : "Personalizar abas"}
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onHeaderHiddenChange(!isHeaderHidden)}
                      className="hover:bg-muted"
                    >
                      {isHeaderHidden ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">
                      {isHeaderHidden
                        ? "Mostrar cabeçalho"
                        : "Ocultar cabeçalho"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {!isHeaderHidden && (
              <div className="flex items-start gap-6">
                <div className="w-32 h-48 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="w-full max-w-3xl">
                      {isEditingHeader ? (
                        <div className="space-y-3">
                          <Input
                            value={draftBook.title}
                            onChange={(e) =>
                              setDraftBook({
                                ...draftBook,
                                title: e.target.value,
                              })
                            }
                            aria-label="Título do livro"
                          />
                          <div className="flex items-center gap-3">
                            <Select
                              value={draftBook.genre}
                              onValueChange={(v) =>
                                setDraftBook({ ...draftBook, genre: v })
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Gênero" />
                              </SelectTrigger>
                              <SelectContent>
                                {genres.map((genre) => (
                                  <SelectItem key={genre} value={genre}>
                                    {genre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={draftBook.visualStyle}
                              onValueChange={(v) =>
                                setDraftBook({ ...draftBook, visualStyle: v })
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Estilo visual" />
                              </SelectTrigger>
                              <SelectContent>
                                {visualStyles.map((style) => (
                                  <SelectItem key={style} value={style}>
                                    {style}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Textarea
                            value={draftBook.storySummary || ""}
                            onChange={(e) =>
                              setDraftBook({
                                ...draftBook,
                                storySummary: e.target.value,
                              })
                            }
                            placeholder="Resumo da História"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCancel}>
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleSave}
                              className="btn-magical"
                            >
                              Salvar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-3xl font-bold mb-2">
                            {book.title}
                          </h2>
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="secondary">{book.genre}</Badge>
                            <Badge variant="outline">{book.visualStyle}</Badge>
                          </div>
                          <p className="text-muted-foreground max-w-2xl">
                            {book.storySummary ||
                              "Ainda não há resumo da história. Clique em 'Editar' para adicionar."}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isEditingHeader && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditingHeaderChange(true)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Capítulos: {book.chapters}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Arco atual: {currentArc?.name || "Nenhum arco definido"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <Tabs
            value={activeTab}
            onValueChange={onActiveTabChange}
            className="w-full"
          >
            {isCustomizing ? (
              <div className={`px-6 ${isHeaderHidden ? "pt-4" : "pt-10"}`}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Personalizar Abas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Arraste para reordenar ou clique no olho para
                    mostrar/ocultar. A aba "Visão Geral" não pode ser movida ou
                    ocultada.
                  </p>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={tabs.map((tab) => tab.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div className="flex gap-2 p-1 bg-muted/50 rounded-md border overflow-x-auto">
                      {tabs.map((tab) => (
                        <SortableTab
                          key={tab.id}
                          tab={tab}
                          isCustomizing={isCustomizing}
                          onToggleVisibility={handleToggleVisibility}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ) : (
              <div className="px-6">
                <TabsList
                  className={`w-full h-10 flex items-center justify-start rounded-md bg-muted p-1 text-muted-foreground ${isHeaderHidden ? "mt-4" : "mt-6"}`}
                >
                  {visibleTabs.map((tab) => (
                    <SortableTab
                      key={tab.id}
                      tab={tab}
                      isCustomizing={isCustomizing}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  ))}
                </TabsList>
              </div>
            )}

            <div className="px-6 mt-6 pb-6">
              <TabsContent value="overview" className="mt-0">
                <OverviewTab
                  book={book}
                  bookId={bookId}
                  isCustomizing={isCustomizing}
                />
              </TabsContent>
              <TabsContent value="characters" className="mt-0">
                <CharactersTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="world" className="mt-0">
                <WorldTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="organizations" className="mt-0">
                <OrganizationsTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="plot" className="mt-0">
                <PlotTab />
              </TabsContent>
              <TabsContent value="magic" className="mt-0">
                <PowerSystemTab />
              </TabsContent>
              <TabsContent value="encyclopedia" className="mt-0">
                <EncyclopediaTab />
              </TabsContent>
              <TabsContent value="species" className="mt-0">
                <SpeciesTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="bestiary" className="mt-0">
                <BestiaryTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="items" className="mt-0">
                <ItemsTab bookId={bookId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Para confirmar a exclusão,
                digite o nome do livro: <strong>{book.title}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4">
              <Input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder={`Digite "${book.title}" para confirmar`}
                className="font-mono"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteInput("");
                  setShowDeleteDialog(false);
                }}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteInput !== book.title}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir Livro
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
