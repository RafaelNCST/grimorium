import { useState } from "react";
import { ArrowLeft, Edit2, Users, MapPin, Building, Clock, Sparkles, BookOpen, Network, Target, Trash2, Dna, FileText, Skull, Package } from "lucide-react";
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
  const currentArc = arcs.find((a) => a.isCurrentArc) || arcs[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
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

          {/* Book Header */}
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
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-12 h-auto p-1 bg-muted/30 mt-6">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">{t('book.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="characters" className="flex items-center gap-2 py-3">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{t('book.characters')}</span>
            </TabsTrigger>
            <TabsTrigger value="world" className="flex items-center gap-2 py-3">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">{t('book.world')}</span>
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center gap-2 py-3">
              <Building className="w-4 h-4" />
              <span className="hidden sm:inline">{t('book.organizations')}</span>
            </TabsTrigger>
            <TabsTrigger value="plot" className="flex items-center gap-2 py-3">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">{t('book.plot')}</span>
            </TabsTrigger>
            <TabsTrigger value="magic" className="flex items-center gap-2 py-3">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">{t('book.magic_system')}</span>
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" className="flex items-center gap-2 py-3">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">{t('book.encyclopedia')}</span>
            </TabsTrigger>
            <TabsTrigger value="species" className="flex items-center gap-2 py-3">
              <Dna className="w-4 h-4" />
              <span className="hidden sm:inline">Espécies</span>
            </TabsTrigger>
            <TabsTrigger value="bestiary" className="flex items-center gap-2 py-3">
              <Skull className="w-4 h-4" />
              <span className="hidden sm:inline">Bestiário</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2 py-3">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Itens</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2 py-3">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Anotações</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 pb-6">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab book={book} bookId={bookId} />
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