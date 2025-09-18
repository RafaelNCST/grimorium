import { useState, useEffect } from "react";
import { ArrowLeft, Edit2, Users, MapPin, Building, Clock, Sparkles, BookOpen, Network, Target, Trash2, Dna, FileText, Skull, Package, EyeOff, Eye, Palette, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { CharactersTab } from "@/components/tabs/CharactersTab";
import { WorldTab } from "@/components/tabs/WorldTab";
import { OrganizationsTab } from "@/components/tabs/OrganizationsTab";
import { MagicSystemTab } from "@/components/tabs/MagicSystemTab";
import { EncyclopediaTab } from "@/components/tabs/EncyclopediaTab";
import { PlotTab } from "@/components/tabs/PlotTab";
import { BookSpeciesTab } from "@/components/tabs/BookSpeciesTab";
import { BestiaryTab } from "@/components/tabs/BestiaryTab";
import { ItemsTab } from "@/components/tabs/ItemsTab";
import { NotesTab } from "@/components/tabs/NotesTab";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import bookCover1 from "@/assets/book-cover-1.jpg";

interface BookDashboardProps {
  bookId: string;
  onBack: () => void;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

interface SortableTabProps {
  tab: TabConfig;
  isCustomizing: boolean;
  onToggleVisibility: (tabId: string) => void;
}

function SortableTab({ tab, isCustomizing, onToggleVisibility }: SortableTabProps) {
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
          tab.isDefault ? 'opacity-75' : ''
        } ${!tab.visible ? 'opacity-50' : ''}`}
      >
        {!tab.isDefault && (
          <div {...attributes} {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
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
            {tab.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </Button>
        )}
      </div>
    );
  }

  // Normal tab trigger
  if (!tab.visible) return null;
  
  return (
    <TabsTrigger value={tab.id} className="flex items-center gap-2 py-3 flex-1">
      <tab.icon className="w-4 h-4" />
      <span className="hidden sm:inline">{tab.label}</span>
    </TabsTrigger>
  );
}

// Types for Plot (Enredo)
interface PlotEvent {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

interface PlotArc {
  id: string;
  name: string;
  size: 'pequeno' | 'médio' | 'grande';
  focus: string;
  description: string;
  events: PlotEvent[];
  progress: number;
  isCurrentArc: boolean;
}

// Genre and visual style options (consistent with CreateBookModal)
const genres = [
  "Alta Fantasia", "Fantasia Urbana", "Épico", "Romance", "Mistério", 
  "Suspense", "Terror", "Ficção Científica", "Distopia", "Aventura",
  "Drama", "Comédia", "Biografia", "Histórico", "Contemporâneo"
];

const visualStyles = [
  "Cartoon", "Anime", "Realista"
];

// Default tab configuration
const defaultTabs: TabConfig[] = [
  { id: "overview", label: "Visão Geral", icon: BookOpen, visible: true, isDefault: true },
  { id: "characters", label: "Personagens", icon: Users, visible: true },
  { id: "world", label: "Mundo", icon: MapPin, visible: true },
  { id: "organizations", label: "Organizações", icon: Building, visible: true },
  { id: "plot", label: "Enredo", icon: Target, visible: true },
  { id: "magic", label: "Sistema Mágico", icon: Sparkles, visible: true },
  { id: "encyclopedia", label: "Enciclopédia", icon: BookOpen, visible: true },
  { id: "species", label: "Espécies", icon: Dna, visible: true },
  { id: "bestiary", label: "Bestiário", icon: Skull, visible: true },
  { id: "items", label: "Itens", icon: Package, visible: true },
  { id: "notes", label: "Anotações", icon: FileText, visible: true },
];

// Mock book data - different based on bookId to show empty vs filled states
const getBookData = (bookId: string) => {
  if (bookId === "4") {
    // Empty/new book with minimal required fields
    return {
      id: "4",
      title: "Nova História",
      genre: "Fantasia",
      visualStyle: "Realista",
      coverImage: "/placeholder.svg",
      chapters: 0,
      currentArc: "Ainda não definido",
      authorSummary: "",
      storySummary: "",
    };
  }
  
  // Default filled book
  return {
    id: "1",
    title: "As Crônicas do Reino Perdido",
    genre: "Alta Fantasia",
    visualStyle: "Realista",
    coverImage: bookCover1,
    chapters: 12,
    currentArc: "A Ascensão do Herói",
    authorSummary: "Para mim como autor: explorar temas de crescimento pessoal através da jornada do herói. Focar na dualidade luz/trevas como metáfora.",
    storySummary: "Em um reino onde a magia está desaparecendo, um jovem pastor descobre que carrega o poder de restaurar o equilíbrio entre luz e trevas.",
  };
};

const initialArcs: PlotArc[] = [
  {
    id: "1",
    name: "A Ascensão do Herói",
    size: "grande",
    focus: "Desenvolvimento do protagonista",
    description: "O jovem pastor descobre seus poderes e aprende a controlá-los enquanto enfrenta os primeiros desafios.",
    progress: 65,
    isCurrentArc: true,
    events: [
      { id: "1", name: "Descoberta dos poderes", description: "O protagonista manifesta sua magia pela primeira vez", completed: true, order: 1 },
      { id: "2", name: "Encontro com o mentor", description: "Conhece o sábio que o guiará", completed: true, order: 2 },
      { id: "3", name: "Primeiro desafio", description: "Enfrenta seu primeiro inimigo real", completed: false, order: 3 },
      { id: "4", name: "Revelação sobre o passado", description: "Descobre a verdade sobre sua origem", completed: false, order: 4 },
    ]
  },
  {
    id: "2", 
    name: "A Guerra das Sombras",
    size: "grande",
    focus: "Conflito principal",
    description: "O protagonista lidera uma guerra contra as forças das trevas que ameaçam consumir o reino.",
    progress: 0,
    isCurrentArc: false,
    events: [
      { id: "5", name: "Chamado à guerra", description: "O reino pede ajuda ao protagonista", completed: false, order: 1 },
      { id: "6", name: "Formação da aliança", description: "Reúne heróis para a batalha final", completed: false, order: 2 },
    ]
  },
  {
    id: "3",
    name: "O Preço da Vitória", 
    size: "médio",
    focus: "Resolução e consequências",
    description: "As consequências da guerra e o estabelecimento de uma nova ordem.",
    progress: 0,
    isCurrentArc: false,
    events: []
  }
];

export function BookDashboard({ bookId, onBack }: BookDashboardProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const initialBook = getBookData(bookId);
  const [book, setBook] = useState(initialBook);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [draftBook, setDraftBook] = useState(initialBook);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [arcs, setArcs] = useState<PlotArc[]>(initialArcs);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  
  // Tab customization state
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [tabs, setTabs] = useState<TabConfig[]>(defaultTabs);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentArc = arcs.find((a) => a.isCurrentArc) || arcs[0];

  // Close customize mode when navigating
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsCustomizing(false);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Close customize mode when activeTab changes (navigation)
  useEffect(() => {
    if (isCustomizing && activeTab !== "overview") {
      setIsCustomizing(false);
    }
  }, [activeTab, isCustomizing]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleToggleVisibility = (tabId: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, visible: !tab.visible } : tab
      )
    );
  };


  const visibleTabs = tabs.filter((tab) => tab.visible);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">{t('book.dashboard')}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (!isCustomizing) {
                    setActiveTab("overview");
                  }
                  setIsCustomizing(!isCustomizing);
                }}
                className={`hover:bg-muted ${isCustomizing ? 'bg-primary/10 text-primary' : ''}`}
                title={isCustomizing ? 'Sair do modo personalizar' : 'Personalizar abas'}
              >
                <Palette className={`w-5 h-5`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsHeaderHidden(!isHeaderHidden)}
                className="hover:bg-muted"
              >
                {isHeaderHidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Book Header */}
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
                          onChange={(e) => setDraftBook({ ...draftBook, title: e.target.value })}
                          aria-label="Título do livro"
                        />
                        <div className="flex items-center gap-3">
                          <Select value={draftBook.genre} onValueChange={(v) => setDraftBook({ ...draftBook, genre: v })}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Gênero" />
                            </SelectTrigger>
                            <SelectContent side="bottom">
                              {genres.map((genre) => (
                                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={draftBook.visualStyle} onValueChange={(v) => setDraftBook({ ...draftBook, visualStyle: v })}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Estilo visual" />
                            </SelectTrigger>
                            <SelectContent side="bottom">
                              {visualStyles.map((style) => (
                                <SelectItem key={style} value={style}>{style}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          value={draftBook.storySummary}
                          onChange={(e) => setDraftBook({ ...draftBook, storySummary: e.target.value })}
                          placeholder="Resumo da História"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setDraftBook(book);
                              setIsEditingHeader(false);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => {
                              setBook(draftBook);
                              setIsEditingHeader(false);
                            }}
                            className="btn-magical"
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary">{book.genre}</Badge>
                          <Badge variant="outline">{book.visualStyle}</Badge>
                        </div>
                        <p className="text-muted-foreground max-w-2xl">
                          {book.storySummary || "Ainda não há resumo da história. Clique em 'Editar' para adicionar."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEditingHeader && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setIsEditingHeader(true)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      </>
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
                    <span>Arco atual: {currentArc?.name || "Nenhum arco definido"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {isCustomizing ? (
            <div className={`px-6 ${isHeaderHidden ? 'pt-4' : 'pt-10'}`}>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Personalizar Abas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Arraste para reordenar ou clique no olho para mostrar/ocultar.
                  A aba "Visão Geral" não pode ser movida ou ocultada.
                </p>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={tabs.map(tab => tab.id)} strategy={horizontalListSortingStrategy}>
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
              <TabsList className={`w-full h-10 flex items-center justify-start rounded-md bg-muted p-1 text-muted-foreground ${isHeaderHidden ? 'mt-4' : 'mt-6'}`}>
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
              <OverviewTab book={book} bookId={bookId} isCustomizing={isCustomizing} />
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
                <MagicSystemTab />
              </TabsContent>
              <TabsContent value="encyclopedia" className="mt-0">
                <EncyclopediaTab />
              </TabsContent>
              <TabsContent value="species" className="mt-0">
                <BookSpeciesTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="bestiary" className="mt-0">
                <BestiaryTab bookId={bookId} />
              </TabsContent>
              <TabsContent value="items" className="mt-0">
                <ItemsTab />
              </TabsContent>
            <TabsContent value="notes" className="mt-0">
              <NotesTab bookId={bookId} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Para confirmar a exclusão, digite o nome do livro: <strong>{book.title}</strong>
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
            <AlertDialogCancel onClick={() => {
              setDeleteInput("");
              setShowDeleteDialog(false);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteInput === book.title) {
                  console.log('Deleting book:', book.title);
                  onBack(); // Go back to home after deletion
                }
              }}
              disabled={deleteInput !== book.title}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir Livro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}