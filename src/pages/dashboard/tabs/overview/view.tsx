import { DndContext, closestCenter } from "@dnd-kit/core";
import { StickyNote as StickyNoteIcon, Plus } from "lucide-react";
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

import { ChecklistCard } from "./components/checklist-card";
import { ColorPicker } from "./components/color-picker";
import { MetricsCard } from "./components/metrics-card";
import { SortableSection } from "./components/sortable-section";
import { StickyNote } from "./components/sticky-note";
import { SummariesCard } from "./components/summaries-card";
import { PropsOverviewView, ISection } from "./types/overview-types";

const MAX_NOTE_CHARACTER_LIMIT = 200;

export function OverviewView(props: PropsOverviewView) {
  const { t } = useTranslation("overview");

  const {
    book: _book,
    isCustomizing,
    goals: _goals,
    isEditingGoals: _isEditingGoals,
    storyProgress,
    authorSummary,
    storySummary,
    isEditingSummaries,
    stickyNotes,
    newNote,
    editingNote,
    editContent,
    sections,
    activeNoteId,
    draggedNoteData,
    overviewStats,
    storyProgressPercentage,
    sensors,
    checklistItems,
    selectedColor,
    dragModifiers,
    onGoalsChange: _onGoalsChange,
    onEditingGoalsChange: _onEditingGoalsChange,
    onAuthorSummaryChange,
    onStorySummaryChange,
    onEditingSummariesChange,
    onNewNoteChange,
    onEditingNoteChange,
    onEditContentChange,
    onSelectedColorChange,
    onAddNote,
    onDeleteNote,
    onEditNote,
    onColorChange,
    onBringToFront,
    onSendToBack,
    onSaveGoals: _onSaveGoals,
    onSaveSummaries,
    onToggleSectionVisibility,
    onMoveSectionUp,
    onMoveSectionDown,
    onNoteDragStart,
    onNoteDragMove,
    onNoteDragEnd,
    onAddChecklistItem,
    onToggleChecklistItem,
    onEditChecklistItem,
    onDeleteChecklistItem,
  } = props;

  const renderStatsSection = () => (
    <MetricsCard stats={overviewStats} isCustomizing={isCustomizing} />
  );

  const renderProgressSection = () => (
    <Card className="card-magical w-full h-fit animate-fade-in">
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

  const renderSummariesSection = () => (
    <SummariesCard
      authorSummary={authorSummary}
      storySummary={storySummary}
      isEditingSummaries={isEditingSummaries}
      isCustomizing={isCustomizing}
      onAuthorSummaryChange={onAuthorSummaryChange}
      onStorySummaryChange={onStorySummaryChange}
      onEditingSummariesChange={onEditingSummariesChange}
      onSaveSummaries={onSaveSummaries}
    />
  );

  const renderNotesSection = () => (
    <Card className="card-magical w-full h-fit animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <StickyNoteIcon className="w-5 h-5" />
            {t("notes_board.title")}
          </CardTitle>
          <CardDescription>{t("notes_board.description")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={dragModifiers}
          onDragStart={onNoteDragStart}
          onDragMove={onNoteDragMove}
          onDragEnd={onNoteDragEnd}
        >
          <div
            id="notes-drop-area"
            className="relative min-h-[400px] bg-muted/10 rounded-lg border-2 border-dashed border-muted-foreground/20 mb-4 overflow-hidden select-none"
            style={{ touchAction: "none" }}
          >
            {stickyNotes.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  {t("notes_board.empty_state")}
                </p>
              </div>
            ) : (
              stickyNotes.map((note) => (
                <StickyNote
                  key={note.id}
                  note={note}
                  editingNote={editingNote}
                  editContent={editContent}
                  isCustomizing={isCustomizing || false}
                  onEditingNoteChange={onEditingNoteChange}
                  onEditContentChange={onEditContentChange}
                  onEditNote={onEditNote}
                  onDeleteNote={onDeleteNote}
                  onColorChange={onColorChange}
                  onBringToFront={onBringToFront}
                  onSendToBack={onSendToBack}
                />
              ))
            )}
          </div>
        </DndContext>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t("notes_board.select_color")}
            </label>
            <ColorPicker
              selectedColor={selectedColor}
              onColorSelect={onSelectedColorChange}
              disabled={isCustomizing}
            />
          </div>
          <div className="space-y-1">
            <div className="flex gap-2">
              <Textarea
                placeholder={t("notes_board.add_note_placeholder")}
                value={newNote}
                onChange={(e) => {
                  const { value } = e.target;
                  if (value.length <= MAX_NOTE_CHARACTER_LIMIT) {
                    onNewNoteChange(value);
                  }
                }}
                className="min-h-[60px]"
                disabled={isCustomizing}
                maxLength={MAX_NOTE_CHARACTER_LIMIT}
              />
              <Button
                variant="outline"
                onClick={onAddNote}
                disabled={isCustomizing || !newNote.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">
              {newNote.length}/{MAX_NOTE_CHARACTER_LIMIT}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderChecklistSection = () => (
    <ChecklistCard
      checklistItems={checklistItems}
      isCustomizing={isCustomizing || false}
      onAddItem={onAddChecklistItem}
      onToggleItem={onToggleChecklistItem}
      onEditItem={onEditChecklistItem}
      onDeleteItem={onDeleteChecklistItem}
    />
  );

  const sectionRenderers: Record<ISection["type"], () => React.ReactNode> = {
    stats: renderStatsSection,
    progress: renderProgressSection,
    summaries: renderSummariesSection,
    "notes-board": renderNotesSection,
    checklist: renderChecklistSection,
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

      {sectionsWithComponents.map((section, index) => (
        <SortableSection
          key={section.id}
          section={section}
          isCustomizing={isCustomizing || false}
          isFirst={index === 0}
          isLast={index === sectionsWithComponents.length - 1}
          onToggleVisibility={onToggleSectionVisibility}
          onMoveUp={onMoveSectionUp}
          onMoveDown={onMoveSectionDown}
        >
          <div className="animate-fade-in">{section.component}</div>
        </SortableSection>
      ))}
    </div>
  );
}
