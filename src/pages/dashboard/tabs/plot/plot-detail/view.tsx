import { useState } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  Save,
  X,
  Check,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { PlotArcChapterMetricsSection } from "@/components/chapter-metrics/PlotArcChapterMetricsSection";
import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayTextarea,
  DisplayEntityList,
  type DisplayEntityItem,
} from "@/components/displays";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { CollapsibleSection } from "@/components/layouts/CollapsibleSection";
import { ValidationBanner } from "@/components/layouts/ValidationBanner";
import { EventModal } from "@/components/modals/create-plot-arc-modal/components/event-modal";
import { StatusSelector } from "@/components/modals/create-plot-arc-modal/components/status-selector";
import { ARC_SIZE_OPTIONS } from "@/components/modals/create-plot-arc-modal/constants/arc-size-options";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SectionTitle } from "@/components/ui/section-title";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ARC_SIZES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-sizes-constant";
import { ARC_STATUSES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-statuses-constant";
import type {
  IPlotArc,
  IPlotEvent,
  PlotArcSize,
  PlotArcStatus,
} from "@/types/plot-types";

import { DeleteArcConfirmationDialog } from "./components/delete-arc-confirmation-dialog";
import { FinishArcWarningDialog } from "./components/finish-arc-warning-dialog";
import { UnsavedChangesDialog } from "./components/unsaved-changes-dialog";

// Map status values to their display colors (matching filter badges)
const STATUS_DISPLAY_COLORS: Record<string, string> = {
  finished:
    "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  current: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  planning:
    "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
};

// Map size values to their display colors (matching filter badges)
const SIZE_DISPLAY_COLORS: Record<string, string> = {
  mini: "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400",
  small: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  medium:
    "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
  large:
    "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
};

interface PropsPlotArcDetailView {
  arc: IPlotArc;
  isEditing: boolean;
  editForm: Partial<IPlotArc>;
  showDeleteArcDialog: boolean;
  showDeleteEventDialog: boolean;
  showUnsavedChangesDialog: boolean;
  showFinishWarningDialog: boolean;
  finishWarningReason: {
    hasNoEvents: boolean;
    hasNoCompletedEvents: boolean;
  };
  eventChainSectionOpen: boolean;
  advancedSectionOpen: boolean;
  validationErrors: Record<string, string>;
  hasChanges: boolean;
  hasRequiredFieldsEmpty: boolean;
  missingFields: string[];
  hasCurrentArc: boolean;
  bookId: string;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onConfirmCancel: () => void;
  onDeleteArc: () => void;
  onDeleteEvent: () => void;
  onDeleteArcDialogChange: (open: boolean) => void;
  onDeleteEventDialogChange: (open: boolean) => void;
  onUnsavedChangesDialogChange: (open: boolean) => void;
  onFinishWarningDialogChange: (open: boolean) => void;
  onFinishOrActivateArc: () => void;
  onEditFormChange: <K extends keyof IPlotArc>(
    field: K,
    value: IPlotArc[K]
  ) => void;
  validateField: (field: string, value: unknown) => boolean;
  onToggleEventCompletion: (eventId: string) => void;
  onEventDeleteRequest: (eventId: string) => void;
  onReorderEvents: (events: IPlotEvent[]) => void;
  onAddEvent: (event: Omit<IPlotEvent, "id" | "order">) => void;
  onEventChainSectionToggle: () => void;
  onAdvancedSectionToggle: () => void;
  fieldVisibility: Record<string, boolean>;
  onFieldVisibilityToggle: (fieldName: string) => void;
  characters?: Array<{ id: string; name: string; image?: string }>;
  factions?: Array<{ id: string; name: string; emblem?: string }>;
  items?: Array<{ id: string; name: string; image?: string }>;
  regions?: Array<{ id: string; name: string; image?: string }>;
  extraSectionsOpenState: Record<string, boolean>;
  onExtraSectionsOpenStateChange: (state: Record<string, boolean>) => void;
}

interface PropsSortableEvent {
  event: IPlotEvent;
  isEditing: boolean;
  arcStatus: PlotArcStatus;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (event: IPlotEvent) => void;
}

function SortableEvent({
  event,
  isEditing,
  arcStatus,
  onToggle,
  onDelete,
  onEdit,
}: PropsSortableEvent) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: event.id,
    disabled: !isEditing,
    transition: null,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? attributes : {})}
      {...(isEditing ? listeners : {})}
      className={`flex items-start gap-3 p-3 rounded-lg border border-border bg-card ${isEditing ? "cursor-grab active:cursor-grabbing" : "hover:bg-muted/30"}`}
    >
      {!isEditing && arcStatus !== "finished" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(event.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="mt-1 text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          {event.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
      )}
      {!isEditing && arcStatus === "finished" && (
        <div className="mt-1 text-emerald-500">
          {event.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-foreground">
            {event.order}
          </span>
          <div className="h-5 w-px bg-border" />
          <h4
            className={`font-medium ${event.completed ? "line-through text-muted-foreground" : ""}`}
          >
            {event.name}
          </h4>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {event.description}
        </p>
      </div>

      {isEditing && (
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="cursor-pointer hover:bg-amber-500/10 hover:text-amber-500"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="cursor-pointer hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function PlotArcDetailView({
  arc,
  isEditing,
  editForm,
  showDeleteArcDialog,
  showDeleteEventDialog,
  showUnsavedChangesDialog,
  showFinishWarningDialog,
  finishWarningReason,
  eventChainSectionOpen,
  advancedSectionOpen,
  validationErrors,
  hasChanges,
  hasRequiredFieldsEmpty,
  missingFields,
  hasCurrentArc,
  bookId,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onConfirmCancel,
  onDeleteArc,
  onDeleteEvent,
  onDeleteArcDialogChange,
  onDeleteEventDialogChange,
  onUnsavedChangesDialogChange,
  onFinishWarningDialogChange,
  onFinishOrActivateArc,
  onEditFormChange,
  validateField,
  onToggleEventCompletion,
  onEventDeleteRequest,
  onReorderEvents,
  onAddEvent,
  onEventChainSectionToggle,
  onAdvancedSectionToggle,
  fieldVisibility,
  onFieldVisibilityToggle,
  characters = [],
  factions = [],
  items = [],
  regions = [],
  extraSectionsOpenState,
  onExtraSectionsOpenStateChange,
}: PropsPlotArcDetailView) {
  const { t } = useTranslation(["plot", "create-plot-arc", "tooltips"]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IPlotEvent | null>(null);

  // Chapter Metrics Section state - managed locally in view (appropriate for this entity)
  const [chapterMetricsSectionOpen, setChapterMetricsSectionOpen] =
    useState(false);
  const [hasChapterMetrics, setHasChapterMetrics] = useState<boolean | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const currentEvents = isEditing
      ? editForm.events || arc.events
      : arc.events;

    if (over && active.id !== over.id) {
      const oldIndex = currentEvents.findIndex((e) => e.id === active.id);
      const newIndex = currentEvents.findIndex((e) => e.id === over.id);

      const reordered = arrayMove(currentEvents, oldIndex, newIndex).map(
        (e, idx) => ({ ...e, order: idx + 1 })
      );
      onReorderEvents(reordered);
    }
  };

  const handleEventModalConfirm = (name: string, description: string) => {
    if (editingEvent) {
      // Editing existing event
      const currentEvents = isEditing
        ? editForm.events || arc.events
        : arc.events;
      const updatedEvents = currentEvents.map((e) =>
        e.id === editingEvent.id
          ? {
              ...e,
              name,
              description,
            }
          : e
      );
      onReorderEvents(updatedEvents);
      setEditingEvent(null);
    } else {
      // Adding new event
      onAddEvent({
        name,
        description,
        completed: false,
      });
    }
    setShowEventModal(false);
  };

  const handleStartEdit = (event: IPlotEvent) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleEventModalClose = () => {
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const statusConfig = ARC_STATUSES_CONSTANT.find(
    (s) => s.value === arc.status
  );
  const sizeConfig = ARC_SIZES_CONSTANT.find((s) => s.value === arc.size);
  const StatusIcon = statusConfig?.icon;
  const SizeIcon = sizeConfig?.icon;

  // Use editForm when editing, otherwise use arc
  const activeArc = isEditing ? editForm : arc;
  const currentEvents = isEditing ? editForm.events || arc.events : arc.events;

  // Translate options for FormSelectGrid
  const translatedSizeOptions = ARC_SIZE_OPTIONS.map((opt) => ({
    ...opt,
    label: t(`create-plot-arc:${opt.label}`),
    description: opt.description
      ? t(`create-plot-arc:${opt.description}`)
      : undefined,
  }));

  // Map entities for display
  const selectedCharacters: DisplayEntityItem[] = characters
    .filter((c) => activeArc.importantCharacters?.includes(c.id))
    .map((c) => ({ id: c.id, name: c.name, image: c.image }));

  const selectedFactions: DisplayEntityItem[] = factions
    .filter((f) => activeArc.importantFactions?.includes(f.id))
    .map((f) => ({ id: f.id, name: f.name, image: f.emblem }));

  const selectedItems: DisplayEntityItem[] = items
    .filter((i) => activeArc.importantItems?.includes(i.id))
    .map((i) => ({ id: i.id, name: i.name, image: i.image }));

  const selectedRegions: DisplayEntityItem[] = regions
    .filter((r) => activeArc.importantRegions?.includes(r.id))
    .map((r) => ({ id: r.id, name: r.name, image: r.image }));

  return (
    <TooltipProvider>
      <div className="bg-background">
        {/* Fixed Header */}
        <header className="fixed top-8 left-0 right-0 z-50 bg-background border-b shadow-sm py-3 px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Back button */}
            {!isEditing && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("plot:header.back")}
                </Button>
              </div>
            )}

            {/* Right side - Action buttons */}
            <div className="flex flex-col items-end gap-1 shrink-0 ml-auto">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={onCancel}>
                    <X className="w-4 h-4 mr-2" />
                    {t("plot:header.cancel")}
                  </Button>
                  <Button
                    variant="magical"
                    className="animate-glow"
                    onClick={onSave}
                    disabled={!hasChanges || hasRequiredFieldsEmpty}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t("plot:header.save")}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          arc.status === "finished" ? "ghost" : "magical"
                        }
                        size="icon"
                        onClick={onFinishOrActivateArc}
                        className={
                          arc.status === "finished" ? "" : "animate-glow"
                        }
                      >
                        {arc.status === "finished" ? (
                          <RotateCcw className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {arc.status === "finished"
                        ? t("tooltips:plot_arc.activate_arc")
                        : t("tooltips:plot_arc.finish_arc")}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        disabled={arc.status === "finished"}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {arc.status === "finished"
                        ? t("tooltips:plot_arc.arc_is_finished")
                        : t("plot:header.edit")}
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    variant="ghost-destructive"
                    size="icon"
                    onClick={() => onDeleteArcDialogChange(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ValidationBanner */}
        {isEditing && hasRequiredFieldsEmpty && (
          <ValidationBanner
            missingFields={missingFields}
            fieldNames={{
              name: t("plot:fields.name"),
              description: t("plot:fields.description"),
              status: t("plot:fields.status"),
              size: t("plot:fields.size"),
              focus: t("plot:fields.focus"),
            }}
            missingFieldsLabel={t("plot:validation.missing_fields")}
          />
        )}

        {/* Spacer for fixed header */}
        <div className="h-[72px]" />

        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <Card className="card-magical">
              <CardHeader>
                <CardTitle>{t("plot:detail.basic_info")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Arc Name */}
                    <FormInput
                      label={t("create-plot-arc:modal.arc_name")}
                      placeholder={t(
                        "create-plot-arc:modal.arc_name_placeholder"
                      )}
                      value={editForm.name || ""}
                      onChange={(e) => {
                        onEditFormChange("name", e.target.value);
                        validateField("name", e.target.value);
                      }}
                      onBlur={(e) => validateField("name", e.target.value)}
                      maxLength={200}
                      required
                      showCharCount
                      error={validationErrors.name}
                      labelClassName={
                        validationErrors.name
                          ? "text-destructive"
                          : "text-primary"
                      }
                    />

                    {/* Arc Summary */}
                    <FormTextarea
                      label={t("create-plot-arc:modal.arc_summary")}
                      placeholder={t(
                        "create-plot-arc:modal.arc_summary_placeholder"
                      )}
                      value={editForm.description || ""}
                      onChange={(e) => {
                        onEditFormChange("description", e.target.value);
                        validateField("description", e.target.value);
                      }}
                      onBlur={(e) =>
                        validateField("description", e.target.value)
                      }
                      maxLength={1000}
                      rows={4}
                      showCharCount
                      required
                      showOptionalLabel={false}
                      error={validationErrors.description}
                      labelClassName={
                        validationErrors.description
                          ? "text-destructive"
                          : "text-primary"
                      }
                      className="resize-none"
                    />

                    {/* Arc Focus */}
                    <FormTextarea
                      label={t("create-plot-arc:modal.arc_focus")}
                      placeholder={t(
                        "create-plot-arc:modal.arc_focus_placeholder"
                      )}
                      value={editForm.focus || ""}
                      onChange={(e) => {
                        onEditFormChange("focus", e.target.value);
                        validateField("focus", e.target.value);
                      }}
                      onBlur={(e) => validateField("focus", e.target.value)}
                      maxLength={500}
                      rows={3}
                      showCharCount
                      required
                      showOptionalLabel={false}
                      error={validationErrors.focus}
                      labelClassName={
                        validationErrors.focus
                          ? "text-destructive"
                          : "text-primary"
                      }
                      className="resize-none"
                    />

                    {/* Status Selector */}
                    <StatusSelector
                      value={editForm.status as PlotArcStatus | ""}
                      onChange={(value) => {
                        onEditFormChange("status", value);
                        validateField("status", value);
                      }}
                      hasCurrentArc={hasCurrentArc}
                      error={validationErrors.status}
                    />

                    {/* Size Selector */}
                    <FormSelectGrid
                      value={editForm.size || ""}
                      onChange={(value) => {
                        onEditFormChange("size", value as PlotArcSize);
                        validateField("size", value);
                      }}
                      label={t("create-plot-arc:modal.arc_size")}
                      required
                      columns={2}
                      options={translatedSizeOptions}
                      error={validationErrors.size}
                      alertText={t("create-plot-arc:modal.arc_size_intro")}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Arc Title and Badges */}
                    <div>
                      <h2 className="text-3xl font-bold mb-3">{arc.name}</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge
                          className={`pointer-events-none ${STATUS_DISPLAY_COLORS[arc.status]}`}
                        >
                          {StatusIcon && (
                            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          {statusConfig
                            ? t(`plot:${statusConfig.translationKey}`)
                            : arc.status}
                        </Badge>
                        <Badge
                          className={`pointer-events-none ${SIZE_DISPLAY_COLORS[arc.size]}`}
                        >
                          {SizeIcon && (
                            <SizeIcon className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          {sizeConfig
                            ? t(`plot:${sizeConfig.translationKey}`)
                            : arc.size}
                        </Badge>
                        {arc.status === "finished" && (
                          <Badge
                            variant="outline"
                            className="pointer-events-none bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          >
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                            {t("plot:finish_arc.finished_badge")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <Label className="text-sm font-medium text-primary">
                        {t("plot:fields.summary")}
                      </Label>
                      <p className="mt-1 text-foreground whitespace-pre-wrap">
                        {arc.description}
                      </p>
                    </div>

                    {/* Focus */}
                    <div>
                      <Label className="text-sm font-medium text-primary">
                        {t("create-plot-arc:modal.arc_focus")}
                      </Label>
                      <p className="mt-1 text-foreground">{arc.focus}</p>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-primary">
                          {t("plot:detail.progress")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {arc.progress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={arc.progress} className="h-3" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Chain Section - Collapsible */}
            <CollapsibleSection
              title={t("plot:detail.event_chain")}
              isOpen={eventChainSectionOpen}
              onToggle={onEventChainSectionToggle}
            >
              {/* Add Event Button */}
              {isEditing && (
                <div className="mb-4">
                  <Button
                    variant="magical"
                    size="sm"
                    onClick={() => setShowEventModal(true)}
                    className="w-full animate-glow-purple"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("create-plot-arc:modal.add_event")}
                  </Button>
                </div>
              )}

              {/* Events List */}
              {currentEvents.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={currentEvents.map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {currentEvents.map((event) => (
                        <SortableEvent
                          key={event.id}
                          event={event}
                          isEditing={isEditing}
                          arcStatus={arc.status}
                          onToggle={onToggleEventCompletion}
                          onDelete={onEventDeleteRequest}
                          onEdit={handleStartEdit}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                  <p className="text-sm">{t("plot:detail.no_events")}</p>
                </div>
              )}
            </CollapsibleSection>

            {/* Advanced Section - Collapsible - Hide entirely if all fields are hidden in view mode */}
            {(isEditing ||
              fieldVisibility.importantCharacters !== false ||
              fieldVisibility.importantFactions !== false ||
              fieldVisibility.importantItems !== false ||
              fieldVisibility.importantRegions !== false ||
              fieldVisibility.arcMessage !== false ||
              fieldVisibility.worldImpact !== false) && (
              <CollapsibleSection
                title={t("plot:detail.advanced_section")}
                isOpen={advancedSectionOpen}
                onToggle={onAdvancedSectionToggle}
              >
                {/* Relationships Section - Only show if editing or at least one field is visible */}
                {(isEditing ||
                  fieldVisibility.importantCharacters !== false ||
                  fieldVisibility.importantFactions !== false ||
                  fieldVisibility.importantItems !== false ||
                  fieldVisibility.importantRegions !== false) && (
                  <div className="space-y-6">
                    <SectionTitle>
                      {t("plot:detail.relationships_section")}
                    </SectionTitle>

                    {/* Important Characters */}
                    {isEditing ? (
                      <FieldWithVisibilityToggle
                        fieldName="importantCharacters"
                        label={t("plot:fields.important_characters")}
                        fieldVisibility={fieldVisibility}
                        isEditing={isEditing}
                        onFieldVisibilityToggle={onFieldVisibilityToggle}
                      >
                        <FormEntityMultiSelectAuto
                          entityType="character"
                          bookId={bookId}
                          placeholder={t(
                            "create-plot-arc:modal.select_character"
                          )}
                          emptyText={t(
                            "create-plot-arc:modal.no_characters_available"
                          )}
                          noSelectionText={t(
                            "create-plot-arc:modal.no_characters_selected"
                          )}
                          searchPlaceholder={t(
                            "create-plot-arc:modal.search_character"
                          )}
                          value={editForm.importantCharacters || []}
                          onChange={(value) =>
                            onEditFormChange("importantCharacters", value)
                          }
                        />
                      </FieldWithVisibilityToggle>
                    ) : (
                      fieldVisibility.importantCharacters !== false && (
                        <DisplayEntityList
                          label={t("plot:fields.important_characters")}
                          entities={selectedCharacters}
                        />
                      )
                    )}

                    {/* Important Factions */}
                    {isEditing ? (
                      <FieldWithVisibilityToggle
                        fieldName="importantFactions"
                        label={t("plot:fields.important_factions")}
                        fieldVisibility={fieldVisibility}
                        isEditing={isEditing}
                        onFieldVisibilityToggle={onFieldVisibilityToggle}
                      >
                        <FormEntityMultiSelectAuto
                          entityType="faction"
                          bookId={bookId}
                          placeholder={t(
                            "create-plot-arc:modal.select_faction"
                          )}
                          emptyText={t(
                            "create-plot-arc:modal.no_factions_available"
                          )}
                          noSelectionText={t(
                            "create-plot-arc:modal.no_factions_selected"
                          )}
                          searchPlaceholder={t(
                            "create-plot-arc:modal.search_faction"
                          )}
                          value={editForm.importantFactions || []}
                          onChange={(value) =>
                            onEditFormChange("importantFactions", value)
                          }
                        />
                      </FieldWithVisibilityToggle>
                    ) : (
                      fieldVisibility.importantFactions !== false && (
                        <DisplayEntityList
                          label={t("plot:fields.important_factions")}
                          entities={selectedFactions}
                        />
                      )
                    )}

                    {/* Important Items */}
                    {isEditing ? (
                      <FieldWithVisibilityToggle
                        fieldName="importantItems"
                        label={t("plot:fields.important_items")}
                        fieldVisibility={fieldVisibility}
                        isEditing={isEditing}
                        onFieldVisibilityToggle={onFieldVisibilityToggle}
                      >
                        <FormEntityMultiSelectAuto
                          entityType="item"
                          bookId={bookId}
                          placeholder={t("create-plot-arc:modal.select_item")}
                          emptyText={t(
                            "create-plot-arc:modal.no_items_available"
                          )}
                          noSelectionText={t(
                            "create-plot-arc:modal.no_items_selected"
                          )}
                          searchPlaceholder={t(
                            "create-plot-arc:modal.search_item"
                          )}
                          value={editForm.importantItems || []}
                          onChange={(value) =>
                            onEditFormChange("importantItems", value)
                          }
                        />
                      </FieldWithVisibilityToggle>
                    ) : (
                      fieldVisibility.importantItems !== false && (
                        <DisplayEntityList
                          label={t("plot:fields.important_items")}
                          entities={selectedItems}
                        />
                      )
                    )}

                    {/* Important Regions */}
                    {isEditing ? (
                      <FieldWithVisibilityToggle
                        fieldName="importantRegions"
                        label={t("plot:fields.important_regions")}
                        fieldVisibility={fieldVisibility}
                        isEditing={isEditing}
                        onFieldVisibilityToggle={onFieldVisibilityToggle}
                      >
                        <FormEntityMultiSelectAuto
                          entityType="region"
                          bookId={bookId}
                          placeholder={t("create-plot-arc:modal.select_region")}
                          emptyText={t(
                            "create-plot-arc:modal.no_regions_available"
                          )}
                          noSelectionText={t(
                            "create-plot-arc:modal.no_regions_selected"
                          )}
                          searchPlaceholder={t(
                            "create-plot-arc:modal.search_region"
                          )}
                          value={editForm.importantRegions || []}
                          onChange={(value) =>
                            onEditFormChange("importantRegions", value)
                          }
                        />
                      </FieldWithVisibilityToggle>
                    ) : (
                      fieldVisibility.importantRegions !== false && (
                        <DisplayEntityList
                          label={t("plot:fields.important_regions")}
                          entities={selectedRegions}
                        />
                      )
                    )}
                  </div>
                )}

                {/* Separator - Only show if both sections are visible */}
                {(isEditing ||
                  fieldVisibility.importantCharacters !== false ||
                  fieldVisibility.importantFactions !== false ||
                  fieldVisibility.importantItems !== false ||
                  fieldVisibility.importantRegions !== false) &&
                  (isEditing ||
                    fieldVisibility.arcMessage !== false ||
                    fieldVisibility.worldImpact !== false) && (
                    <Separator className="my-6" />
                  )}

                {/* Narrative Section - Only show if editing or at least one field is visible */}
                {(isEditing ||
                  fieldVisibility.arcMessage !== false ||
                  fieldVisibility.worldImpact !== false) && (
                  <div className="space-y-6">
                    <SectionTitle>
                      {t("plot:detail.narrative_section")}
                    </SectionTitle>

                    {/* Arc Message */}
                    <FieldWithVisibilityToggle
                      fieldName="arcMessage"
                      label={t("plot:fields.arc_message")}
                      fieldVisibility={fieldVisibility}
                      isEditing={isEditing}
                      onFieldVisibilityToggle={onFieldVisibilityToggle}
                    >
                      {isEditing ? (
                        <FormTextarea
                          placeholder={t(
                            "create-plot-arc:modal.arc_message_placeholder"
                          )}
                          value={editForm.arcMessage || ""}
                          onChange={(e) =>
                            onEditFormChange("arcMessage", e.target.value)
                          }
                          maxLength={500}
                          rows={3}
                          showCharCount
                          className="resize-none"
                        />
                      ) : (
                        <DisplayTextarea value={arc.arcMessage} />
                      )}
                    </FieldWithVisibilityToggle>

                    {/* World Impact */}
                    <FieldWithVisibilityToggle
                      fieldName="worldImpact"
                      label={t("plot:fields.world_impact")}
                      fieldVisibility={fieldVisibility}
                      isEditing={isEditing}
                      onFieldVisibilityToggle={onFieldVisibilityToggle}
                    >
                      {isEditing ? (
                        <FormTextarea
                          placeholder={t(
                            "create-plot-arc:modal.world_impact_placeholder"
                          )}
                          value={editForm.worldImpact || ""}
                          onChange={(e) =>
                            onEditFormChange("worldImpact", e.target.value)
                          }
                          maxLength={500}
                          rows={3}
                          showCharCount
                          className="resize-none"
                        />
                      ) : (
                        <DisplayTextarea value={arc.worldImpact} />
                      )}
                    </FieldWithVisibilityToggle>
                  </div>
                )}
              </CollapsibleSection>
            )}

            {/* Chapter Metrics Section */}
            {(isEditing || fieldVisibility["chapterMetrics"] !== false) && (
              <CollapsibleSection
                title={t("chapter-metrics:plot_section.title")}
                isOpen={extraSectionsOpenState["chapterMetrics"] ?? false}
                onToggle={() =>
                  onExtraSectionsOpenStateChange({
                    ...extraSectionsOpenState,
                    chapterMetrics: !(extraSectionsOpenState["chapterMetrics"] ?? false),
                  })
                }
                isEditMode={isEditing}
                isVisible={fieldVisibility["chapterMetrics"] !== false}
                onVisibilityToggle={() => onFieldVisibilityToggle("chapterMetrics")}
                isCollapsible={true}
                emptyState={!isEditing && hasChapterMetrics === false ? "empty-view" : null}
                emptyIcon={BookOpen}
                emptyTitle={t("chapter-metrics:plot_section.empty_state_title")}
                emptyDescription={t("chapter-metrics:plot_section.no_chapters")}
              >
                <PlotArcChapterMetricsSection
                  bookId={bookId}
                  plotArcId={arc.id}
                  arcSize={arc.size}
                  onChapterClick={(chapterId) =>
                    (window.location.href = `/dashboard/chapters/${chapterId}`)
                  }
                  onMetricsLoad={setHasChapterMetrics}
                  isEditMode={isEditing}
                />
              </CollapsibleSection>
            )}
          </div>
        </div>

        {/* Delete Arc Dialog */}
        <DeleteArcConfirmationDialog
          isOpen={showDeleteArcDialog}
          onClose={() => onDeleteArcDialogChange(false)}
          arcName={arc.name}
          eventCount={arc.events.length}
          onConfirmDelete={onDeleteArc}
        />

        {/* Delete Event Dialog */}
        <AlertDialog
          open={showDeleteEventDialog}
          onOpenChange={onDeleteEventDialogChange}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("plot:detail.confirm_delete_event")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("plot:detail.confirm_delete_event_description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("plot:button.cancel")}</AlertDialogCancel>
              <Button
                onClick={onDeleteEvent}
                variant="destructive"
                size="lg"
                className="animate-glow-red"
              >
                {t("plot:button.delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Unsaved Changes Dialog */}
        <UnsavedChangesDialog
          open={showUnsavedChangesDialog}
          onOpenChange={onUnsavedChangesDialogChange}
          onConfirm={onConfirmCancel}
        />

        {/* Finish Arc Warning Dialog */}
        <FinishArcWarningDialog
          isOpen={showFinishWarningDialog}
          onClose={() => onFinishWarningDialogChange(false)}
          hasNoEvents={finishWarningReason.hasNoEvents}
          hasNoCompletedEvents={finishWarningReason.hasNoCompletedEvents}
        />

        {/* Event Modal */}
        <EventModal
          open={showEventModal}
          onClose={handleEventModalClose}
          onConfirm={handleEventModalConfirm}
          event={editingEvent}
        />
      </div>
    </TooltipProvider>
  );
}
