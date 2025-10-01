import { useState, createElement } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Plus,
  Filter,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Edit3,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  X,
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ChapterStatus,
  Chapter,
  statusConfig,
  mockChapters,
} from "@/mocks/local/chapters-data";

export function ChaptersPage() {
  const { dashboardId } = useParams({ from: "/dashboard/$dashboardId/chapter/chapters" });
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>(mockChapters);
  const [showDetails, setShowDetails] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ChapterStatus | "all">(
    "all"
  );
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const filteredChapters = chapters.filter(
    (chapter) => statusFilter === "all" || chapter.status === statusFilter
  );

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleEnterSelectMode = () => {
    setIsSelectMode(true);
    setSelectedChapters([]);
  };

  const handleExitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedChapters([]);
  };

  const handleDeleteChapter = (chapterId: string) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
    setChapterToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleBulkDelete = () => {
    setChapters((prev) =>
      prev.filter((ch) => !selectedChapters.includes(ch.id))
    );
    setSelectedChapters([]);
    setShowBulkDeleteDialog(false);
    setIsSelectMode(false);
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
      to: "/dashboard/$dashboardId/chapter/editor-chapters/$editor-chapters-id",
      params: { dashboardId: dashboardId, "editor-chapters-id": newChapter.id },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: "/" })}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">Capítulos</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleCreateChapter} className="btn-magical">
                <Plus className="w-4 h-4 mr-2" />
                Novo Capítulo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 bg-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showDetails ? "Ocultar" : "Mostrar"} Detalhes
            </Button>

            {!isSelectMode && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEnterSelectMode}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Múltiplos
              </Button>
            )}
          </div>

          {isSelectMode && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedChapters.length} selecionado
                {selectedChapters.length > 1 ? "s" : ""}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExitSelectMode}
              >
                Cancelar
              </Button>
              {selectedChapters.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowBulkDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Selecionados
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <div className="px-6 py-6">
        <div className="grid gap-4">
          {filteredChapters.map((chapter) => (
            <Card
              key={chapter.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-0 flex-1">
                    {isSelectMode && (
                      <div
                        className={`flex items-center justify-center w-12 h-16 -ml-6 mr-3 rounded-r-lg cursor-pointer transition-all duration-200 ${
                          selectedChapters.includes(chapter.id)
                            ? "bg-destructive/90 hover:bg-destructive text-destructive-foreground shadow-lg"
                            : "bg-muted/50 hover:bg-muted border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50"
                        }`}
                        onClick={() => handleSelectChapter(chapter.id)}
                      >
                        {selectedChapters.includes(chapter.id) ? (
                          <X className="w-5 h-5" />
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-muted-foreground/50" />
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 text-sm font-semibold bg-primary/10 text-primary border-primary/20"
                        >
                          Cap. {chapter.number}
                        </Badge>
                        <CardTitle
                          className={`text-xl font-bold transition-colors ${
                            isSelectMode
                              ? "cursor-default text-muted-foreground"
                              : "cursor-pointer hover:text-primary"
                          }`}
                          onClick={() =>
                            !isSelectMode &&
                            navigate({
                              to: "/dashboard/$dashboardId/chapter/editor-chapters/$editor-chapters-id",
                              params: { dashboardId: dashboardId, "editor-chapters-id": chapter.id },
                            })
                          }
                        >
                          {chapter.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={statusConfig[chapter.status].color}>
                          {createElement(statusConfig[chapter.status].icon, {
                            className: "w-3 h-3 mr-1",
                          })}
                          {statusConfig[chapter.status].label}
                        </Badge>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {chapter.wordCount.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              palavras
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                            <span className="text-sm font-mono font-medium">
                              {chapter.characterCount.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              chars
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {chapter.lastEdited.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isSelectMode && (
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            Exportar como Word
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            Exportar como PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setChapterToDelete(chapter.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              {showDetails && (
                <>
                  <Separator />
                  <CardContent className="pt-4">
                    {chapter.summary && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Resumo</h4>
                        <p className="text-sm text-muted-foreground">
                          {chapter.summary}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chapter.characters && chapter.characters.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Personagens
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {chapter.characters.map((char) => (
                              <Badge
                                key={char}
                                variant="outline"
                                className="text-xs"
                              >
                                {char}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {chapter.items && chapter.items.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Itens</h4>
                          <div className="flex flex-wrap gap-1">
                            {chapter.items.map((item) => (
                              <Badge
                                key={item}
                                variant="outline"
                                className="text-xs"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {chapter.locations && chapter.locations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Localizações
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {chapter.locations.map((location) => (
                              <Badge
                                key={location}
                                variant="outline"
                                className="text-xs"
                              >
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>

        {filteredChapters.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum capítulo encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === "all"
                ? "Comece criando seu primeiro capítulo"
                : `Nenhum capítulo com status "${statusConfig[statusFilter as ChapterStatus]?.label}"`}
            </p>
            <Button onClick={handleCreateChapter} className="btn-magical">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Capítulo
            </Button>
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
            <AlertDialogAction
              onClick={() =>
                chapterToDelete && handleDeleteChapter(chapterToDelete)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Múltiplos Capítulos</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedChapters.length} capítulo
              {selectedChapters.length > 1 ? "s" : ""}? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              placeholder={`Digite "EXCLUIR ${selectedChapters.length} CAPÍTULOS" para confirmar`}
              onChange={(e) => {
                const confirmText = `EXCLUIR ${selectedChapters.length} CAPÍTULOS`;
                if (e.target.value === confirmText) {
                  e.target.dataset.confirmed = "true";
                } else {
                  e.target.dataset.confirmed = "false";
                }
              }}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowBulkDeleteDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                const input =
                  e.currentTarget.parentElement?.parentElement?.querySelector(
                    "input"
                  );
                if (input?.dataset.confirmed === "true") {
                  handleBulkDelete();
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled
            >
              Excluir Capítulos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
