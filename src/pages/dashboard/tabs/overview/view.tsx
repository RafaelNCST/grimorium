import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
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
  Eye,
  Calendar,
  CheckCircle,
  FileEdit,
  ClipboardList,
  Type,
  Hash,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import { SortableNote } from "./components/sortable-note";
import { SortableSection } from "./components/sortable-section";
import { PropsOverviewView, ISection } from "./types/overview-types";

export function OverviewView(props: PropsOverviewView) {
  const { t } = useTranslation("overview");

  const {
    book,
    isCustomizing,
    goals,
    isEditingGoals,
    storyProgress,
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
      {/* Total Chapters */}
      <Card className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.chapters")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.totalChapters}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average per Week */}
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
                {t("stats.average_per_week")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.averagePerWeek}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("stats.chapters_unit")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average per Month */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.15s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.average_per_month")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.averagePerMonth}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("stats.chapters_unit")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Released Chapter */}
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
                {t("stats.last_released_chapter")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.lastChapterNumber > 0
                  ? `Cap. ${overviewStats.lastChapterNumber}`
                  : t("stats.no_chapter")}
              </p>
              {overviewStats.lastChapterName && (
                <p className="text-xs text-muted-foreground">
                  {overviewStats.lastChapterName}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Words */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.25s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Type className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.total_words")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.totalWords > 0
                  ? `${(overviewStats.totalWords / 1000).toFixed(1)}k`
                  : "0"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Characters */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.total_characters")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.totalCharacters > 0
                  ? `${(overviewStats.totalCharacters / 1000).toFixed(0)}k`
                  : "0"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapters in Progress */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.35s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileEdit className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.chapters_in_progress")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.chaptersInProgress}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapters Finished */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.chapters_finished")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.chaptersFinished}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapters Draft */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.45s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.chapters_draft")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.chaptersDraft}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapters Planning */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.5s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.chapters_planning")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.chaptersPlanning}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Words per Chapter */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.55s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Type className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.average_words_per_chapter")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.averageWordsPerChapter}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Characters per Chapter */}
      <Card
        className="card-magical flex-shrink-0 m-1 h-fit animate-fade-in"
        style={{ animationDelay: "0.6s" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("stats.average_characters_per_chapter")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {overviewStats.averageCharactersPerChapter}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProgressSection = () => (
    <Card className="card-magical m-1 min-w-[280px] h-fit animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("story_progress.title")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>{t("story_progress.overall_progress")}</span>
              <span>{storyProgressPercentage}%</span>
            </div>
            <Progress value={storyProgressPercentage} className="h-2" />
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>{t("story_progress.completed_arcs")}</span>
              <span>
                {storyProgress.completedArcs}/{storyProgress.estimatedArcs}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("story_progress.current_arc_progress")}</span>
              <span>{storyProgress.currentArcProgress}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAuthorSummarySection = () => (
    <Card className="card-magical m-1 h-fit animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{t("author_summary.title")}</CardTitle>
          <CardDescription className="text-xs">
            {t("author_summary.description")}
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
              placeholder={t("author_summary.placeholder")}
            />
            <div className="flex gap-2">
              <Button
                variant="accent"
                size="sm"
                className="h-6 text-xs"
                onClick={onSaveAuthorSummary}
              >
                {t("author_summary.save")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onEditingAuthorSummaryChange(false)}
              >
                {t("author_summary.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-foreground leading-relaxed">
            {authorSummary || (
              <span className="text-muted-foreground italic">
                {t("author_summary.empty_message")}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderStorySummarySection = () => (
    <Card className="card-magical m-1 h-fit animate-fade-in">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{t("story_summary.title")}</CardTitle>
          <CardDescription className="text-xs">
            {t("story_summary.description")}
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
              placeholder={t("story_summary.placeholder")}
            />
            <div className="flex gap-2">
              <Button
                variant="accent"
                size="sm"
                className="h-6 text-xs"
                onClick={onSaveStorySummary}
              >
                {t("story_summary.save")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onEditingStorySummaryChange(false)}
              >
                {t("story_summary.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-foreground leading-relaxed">
            {storySummary || (
              <span className="text-muted-foreground italic">
                {t("story_summary.empty_message")}
              </span>
            )}
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
            {t("notes_board.title")}
          </CardTitle>
          <CardDescription>{t("notes_board.description")}</CardDescription>
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
            placeholder={t("notes_board.add_note_placeholder")}
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
          {t("customize_mode.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("customize_mode.description")}
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
          {t("customize_mode.hidden_sections")}
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
              {t("customize_mode.all_sections_visible")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
