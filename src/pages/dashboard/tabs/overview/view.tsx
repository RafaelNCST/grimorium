import {
  DndContext,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Edit2,
  Target,
  BookOpen,
  TrendingUp,
  StickyNote,
  Plus,
  FileText,
  Minus,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import { SortableNote } from "./components/sortable-note";
import { SortableSection } from "./components/sortable-section";
import { PropsOverviewView, ISection } from "./types/overview-types";

export function OverviewView(props: PropsOverviewView) {
  const {
    book,
    isCustomizing,
    goals,
    isEditingGoals,
    storyProgress,
    isEditingProgress,
    authorSummary,
    isEditingAuthorSummary,
    storySummary,
    isEditingStorySummary,
    stickyNotes,
    newNote,
    editingNote,
    editContent,
    sections,
    activeId,
    overviewStats,
    storyProgressPercentage,
    sensors,
    onGoalsChange,
    onEditingGoalsChange,
    onStoryProgressChange,
    onEditingProgressChange,
    onAuthorSummaryChange,
    onEditingAuthorSummaryChange,
    onStorySummaryChange,
    onEditingStorySummaryChange,
    onNewNoteChange,
    onEditingNoteChange,
    onEditContentChange,
    onAddNote,
    onDeleteNote,
    onEditNote,
    onSaveGoals,
    onSaveAuthorSummary,
    onSaveStorySummary,
    onToggleSectionVisibility,
    onNoteDragStart,
    onNoteDragEnd,
    onSectionDragStart,
    onSectionDragEnd,
  } = props;

  const renderStatsSection = () => (
    <div className="flex gap-4 overflow-x-auto pb-2">
      <Card className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Capítulos
              </p>
              <p className="text-xl font-bold text-foreground">
                {book.chapters}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Média/Semana
              </p>
              <p className="text-xl font-bold text-foreground">2.1</p>
              <p className="text-xs text-muted-foreground">Capítulos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.2s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Último Capítulo
              </p>
              <p className="text-xl font-bold text-foreground">
                Cap. {overviewStats.lastChapterNumber}
              </p>
              <p className="text-xs text-muted-foreground">
                {overviewStats.lastChapterName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Palavras
              </p>
              <p className="text-xl font-bold text-foreground">
                {(overviewStats.totalWords / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Caracteres
              </p>
              <p className="text-xl font-bold text-foreground">
                {(overviewStats.totalCharacters / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProgressSection = () => (
    <Card className="card-magical m-1 min-w-[280px] h-fit animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Progressão da História</CardTitle>
        </div>
        {!isCustomizing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditingProgressChange(!isEditingProgress)}
            className="h-6 w-6"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {isEditingProgress && !isCustomizing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">
                Estimativa de arcos
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() =>
                    onStoryProgressChange({
                      ...storyProgress,
                      estimatedArcs: Math.max(
                        1,
                        storyProgress.estimatedArcs - 1
                      ),
                    })
                  }
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Input
                  type="number"
                  value={storyProgress.estimatedArcs}
                  onChange={(e) =>
                    onStoryProgressChange({
                      ...storyProgress,
                      estimatedArcs: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="h-7 text-xs text-center"
                  min="1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() =>
                    onStoryProgressChange({
                      ...storyProgress,
                      estimatedArcs: storyProgress.estimatedArcs + 1,
                    })
                  }
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="accent"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onEditingProgressChange(false)}
              >
                Salvar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onEditingProgressChange(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Progresso Geral</span>
                <span>{storyProgressPercentage}%</span>
              </div>
              <Progress value={storyProgressPercentage} className="h-2" />
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Arcos completos:</span>
                <span>
                  {storyProgress.completedArcs}/{storyProgress.estimatedArcs}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Progresso do arco atual:</span>
                <span>{storyProgress.currentArcProgress}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAuthorSummarySection = () => (
    <Card className="card-magical m-1 h-fit animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Resumo do Autor</CardTitle>
          <CardDescription className="text-xs">
            Para controle interno
          </CardDescription>
        </div>
        {!isCustomizing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onEditingAuthorSummaryChange(!isEditingAuthorSummary)
            }
            className="h-6 w-6"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {isEditingAuthorSummary && !isCustomizing ? (
          <div className="space-y-3">
            <Textarea
              value={authorSummary}
              onChange={(e) => onAuthorSummaryChange(e.target.value)}
              className="min-h-[80px] text-xs"
              placeholder="Resumo interno para controle do autor..."
            />
            <div className="flex gap-2">
              <Button
                variant="accent"
                size="sm"
                className="h-6 text-xs"
                onClick={onSaveAuthorSummary}
              >
                Salvar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onEditingAuthorSummaryChange(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-foreground leading-relaxed">
            {authorSummary}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderStorySummarySection = () => (
    <Card className="card-magical m-1 h-fit animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Resumo da História</CardTitle>
          <CardDescription className="text-xs">
            Para apresentação
          </CardDescription>
        </div>
        {!isCustomizing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditingStorySummaryChange(!isEditingStorySummary)}
            className="h-6 w-6"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {isEditingStorySummary && !isCustomizing ? (
          <div className="space-y-3">
            <Textarea
              value={storySummary}
              onChange={(e) => onStorySummaryChange(e.target.value)}
              className="min-h-[80px] text-xs"
              placeholder="Resumo da história para apresentação..."
            />
            <div className="flex gap-2">
              <Button
                variant="accent"
                size="sm"
                className="h-6 text-xs"
                onClick={onSaveStorySummary}
              >
                Salvar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onEditingStorySummaryChange(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-foreground leading-relaxed">
            {storySummary}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderNotesSection = () => (
    <Card className="card-magical m-1 h-fit animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Quadro de Lembretes
          </CardTitle>
          <CardDescription>Arraste as notas para organizá-las</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onNoteDragStart}
          onDragEnd={onNoteDragEnd}
        >
          <SortableContext
            items={stickyNotes.map((note) => `note-${note.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <div
              id="notes-drop-area"
              className="relative min-h-[300px] bg-muted/10 rounded-lg border-2 border-dashed border-muted-foreground/20 mb-4"
            >
              {stickyNotes.map((note) => (
                <SortableNote
                  key={note.id}
                  note={note}
                  editingNote={editingNote}
                  editContent={editContent}
                  isCustomizing={isCustomizing || false}
                  onEditingNoteChange={onEditingNoteChange}
                  onEditContentChange={onEditContentChange}
                  onEditNote={onEditNote}
                  onDeleteNote={onDeleteNote}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex gap-2">
          <Textarea
            placeholder="Adicionar nova nota..."
            value={newNote}
            onChange={(e) => onNewNoteChange(e.target.value)}
            className="min-h-[60px]"
            disabled={isCustomizing}
          />
          <Button
            variant="outline"
            onClick={onAddNote}
            disabled={isCustomizing}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const sectionRenderers: Record<ISection["type"], () => React.ReactNode> = {
    stats: renderStatsSection,
    progress: renderProgressSection,
    "author-summary": renderAuthorSummarySection,
    "story-summary": renderStorySummarySection,
    "notes-board": renderNotesSection,
  };

  const sectionsWithComponents = sections.map((section) => ({
    ...section,
    component: sectionRenderers[section.type](),
  }));

  if (!isCustomizing) {
    return (
      <div className="space-y-4">
        {sectionsWithComponents
          .filter((section) => section.visible)
          .map((section) => (
            <div key={section.id} className="animate-fade-in">
              {section.component}
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
        <h3 className="font-semibold text-primary mb-2">
          Modo Personalizar Ativo
        </h3>
        <p className="text-sm text-muted-foreground">
          Arraste as seções para reordená-las e use os botões de visibilidade
          para mostrar/esconder seções. A edição de conteúdo está desabilitada
          neste modo.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onSectionDragStart}
        onDragEnd={onSectionDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sectionsWithComponents.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              isCustomizing={isCustomizing || false}
              onToggleVisibility={onToggleSectionVisibility}
            >
              <div className="animate-fade-in">{section.component}</div>
            </SortableSection>
          ))}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-80 animate-scale-in">
              {sectionsWithComponents.find((s) => s.id === activeId)?.component}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-6 p-4 bg-muted/20 border border-dashed border-muted-foreground/30 rounded-lg animate-fade-in">
        <h4 className="font-semibold mb-3 text-muted-foreground">
          Seções Ocultas
        </h4>
        <div className="flex flex-wrap gap-2">
          {sections
            .filter((section) => !section.visible)
            .map((section) => (
              <Button
                key={section.id}
                variant="outline"
                size="sm"
                onClick={() => onToggleSectionVisibility(section.id)}
                className="hover-scale"
              >
                <Eye className="w-4 h-4 mr-2" />
                {section.title}
              </Button>
            ))}
          {sections.filter((s) => !s.visible).length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Todas as seções estão visíveis
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
