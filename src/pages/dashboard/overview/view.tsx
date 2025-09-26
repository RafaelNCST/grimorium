import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Edit2,
  Target,
  BookOpen,
  TrendingUp,
  StickyNote,
  Plus,
  Trash2,
  FileText,
  BarChart3,
  Minus,
  Eye,
  EyeOff,
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

interface Book {
  title: string;
  chapters: number;
  currentArc: string;
  authorSummary: string;
  storySummary: string;
}

interface StickyNote {
  id: string;
  content: string;
  color: string;
  x: number;
  y: number;
}

interface Goals {
  wordsPerDay: number;
  chaptersPerWeek: number;
}

interface StoryProgress {
  estimatedArcs: number;
  estimatedChapters: number;
  completedArcs: number;
  currentArcProgress: number;
}

interface Section {
  id: string;
  type:
    | "stats"
    | "progress"
    | "author-summary"
    | "story-summary"
    | "notes-board";
  title: string;
  visible: boolean;
  component: React.ReactNode;
}

interface OverviewViewProps {
  book: Book;
  bookId: string;
  isCustomizing?: boolean;
  goals: Goals;
  isEditingGoals: boolean;
  storyProgress: StoryProgress;
  isEditingProgress: boolean;
  authorSummary: string;
  isEditingAuthorSummary: boolean;
  storySummary: string;
  isEditingStorySummary: boolean;
  stickyNotes: StickyNote[];
  newNote: string;
  editingNote: string | null;
  editContent: string;
  sections: Section[];
  activeId: string | null;
  activeNoteId: string | null;
  draggedNoteData: StickyNote | null;
  onGoalsChange: (goals: Goals) => void;
  onEditingGoalsChange: (editing: boolean) => void;
  onStoryProgressChange: (progress: StoryProgress) => void;
  onEditingProgressChange: (editing: boolean) => void;
  onAuthorSummaryChange: (summary: string) => void;
  onEditingAuthorSummaryChange: (editing: boolean) => void;
  onStorySummaryChange: (summary: string) => void;
  onEditingStorySummaryChange: (editing: boolean) => void;
  onNewNoteChange: (note: string) => void;
  onEditingNoteChange: (id: string | null) => void;
  onEditContentChange: (content: string) => void;
  onSectionsChange: (sections: Section[]) => void;
  onActiveIdChange: (id: string | null) => void;
  onActiveNoteIdChange: (id: string | null) => void;
  onDraggedNoteDataChange: (data: StickyNote | null) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  onEditNote: (id: string, content: string) => void;
  onSaveGoals: () => void;
  onSaveAuthorSummary: () => void;
  onSaveStorySummary: () => void;
  onToggleSectionVisibility: (sectionId: string) => void;
  onNoteDragStart: (event: DragStartEvent) => void;
  onNoteDragEnd: (event: DragEndEvent) => void;
  onSectionDragStart: (event: any) => void;
  onSectionDragEnd: (event: any) => void;
}

const noteColors = [
  "bg-yellow-200 border-yellow-400 text-yellow-900 shadow-lg",
  "bg-pink-200 border-pink-400 text-pink-900 shadow-lg",
  "bg-green-200 border-green-400 text-green-900 shadow-lg",
  "bg-blue-200 border-blue-400 text-blue-900 shadow-lg",
  "bg-purple-200 border-purple-400 text-purple-900 shadow-lg",
  "bg-orange-200 border-orange-400 text-orange-900 shadow-lg",
];

// SortableNote component for draggable sticky notes
function SortableNote({
  note,
  editingNote,
  editContent,
  setEditingNote,
  setEditContent,
  handleEditNote,
  handleDeleteNote,
  isCustomizing,
}: {
  note: StickyNote;
  editingNote: string | null;
  editContent: string;
  setEditingNote: (id: string | null) => void;
  setEditContent: (content: string) => void;
  handleEditNote: (id: string, content: string) => void;
  handleDeleteNote: (id: string) => void;
  isCustomizing: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: `note-${note.id}` });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: note.x,
    top: note.y,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!isCustomizing ? listeners : {})}
      className={`absolute p-4 rounded-lg border-2 cursor-move min-w-[180px] max-w-[200px] transform rotate-1 hover:rotate-0 transition-all duration-200 ${note.color} ${isCustomizing ? "pointer-events-none" : ""} ${isDragging ? "z-50 shadow-2xl scale-105" : ""}`}
    >
      {/* Pushpin effect */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full shadow-md border border-red-600" />

      <div className="flex items-start justify-between mb-2">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-black/10"
            onClick={() => {
              setEditingNote(note.id);
              setEditContent(note.content);
            }}
            disabled={isCustomizing}
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-black/10"
            onClick={() => handleDeleteNote(note.id)}
            disabled={isCustomizing}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {editingNote === note.id ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 text-xs bg-transparent border border-black/20 rounded resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              className="text-xs h-6"
              onClick={() => {
                handleEditNote(note.id, editContent);
                setEditingNote(null);
              }}
            >
              Salvar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => setEditingNote(null)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <p
          className={`text-xs leading-relaxed font-handwriting ${isCustomizing ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => {
            if (!isCustomizing) {
              setEditingNote(note.id);
              setEditContent(note.content);
            }
          }}
        >
          {note.content}
        </p>
      )}
    </div>
  );
}

function SortableSection({
  section,
  isCustomizing,
  children,
  onToggleVisibility,
}: {
  section: Section;
  isCustomizing: boolean;
  children: React.ReactNode;
  onToggleVisibility: (sectionId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!section.visible && !isCustomizing) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 w-fit ${
        isDragging ? "opacity-50 z-50" : ""
      } ${
        !section.visible
          ? "opacity-50 border-2 border-dashed border-muted-foreground/30"
          : ""
      } ${
        isCustomizing
          ? "hover:shadow-lg cursor-grab active:cursor-grabbing"
          : ""
      }`}
      {...attributes}
      {...(isCustomizing ? listeners : {})}
    >
      {isCustomizing && (
        <div className="absolute -top-2 -right-2 z-10">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(section.id);
            }}
          >
            {section.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}

export function OverviewView(props: OverviewViewProps) {
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
    onSectionsChange,
    onActiveIdChange,
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

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mock stats
  const totalWords = 45678;
  const totalCharacters = totalWords * 5.5;
  const lastChapterNumber = book.chapters;
  const lastChapterName = "A Grande Revelação";

  // Calculate story progress percentage
  const calculateStoryProgress = () => {
    const totalProgress =
      storyProgress.completedArcs + storyProgress.currentArcProgress / 100;
    return Math.round((totalProgress / storyProgress.estimatedArcs) * 100);
  };

  // Render section components
  const renderStatsSection = () => (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {/* Capítulos */}
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

      {/* Média/Semana */}
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

      {/* Último Capítulo */}
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
                Cap. {lastChapterNumber}
              </p>
              <p className="text-xs text-muted-foreground">{lastChapterName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total de Palavras */}
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
                {(totalWords / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total de Caracteres */}
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
                {(totalCharacters / 1000).toFixed(0)}k
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
                      estimatedArcs: Math.max(1, storyProgress.estimatedArcs - 1),
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
                <span>{calculateStoryProgress()}%</span>
              </div>
              <Progress value={calculateStoryProgress()} className="h-2" />
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
            onClick={() => onEditingAuthorSummaryChange(!isEditingAuthorSummary)}
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
                  setEditingNote={onEditingNoteChange}
                  setEditContent={onEditContentChange}
                  handleEditNote={onEditNote}
                  handleDeleteNote={onDeleteNote}
                  isCustomizing={isCustomizing || false}
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

  // Map section types to their render functions
  const sectionRenderers = {
    stats: renderStatsSection,
    progress: renderProgressSection,
    "author-summary": renderAuthorSummarySection,
    "story-summary": renderStorySummarySection,
    "notes-board": renderNotesSection,
  };

  // Update sections with their components
  const sectionsWithComponents = sections.map((section) => ({
    ...section,
    component: sectionRenderers[section.type](),
  }));

  if (!isCustomizing) {
    // Normal view - just render visible sections
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

  // Customizing view - enable drag and drop
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

      {/* Hidden sections panel */}
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