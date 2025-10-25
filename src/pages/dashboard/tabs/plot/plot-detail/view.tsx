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
  GripVertical,
  Check,
  Users,
  Shield,
  Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ARC_SIZES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-sizes-constant";
import { ARC_STATUSES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-statuses-constant";
import type {
  IPlotArc,
  IPlotEvent,
  PlotArcSize,
  PlotArcStatus,
} from "@/types/plot-types";

import { DeleteArcConfirmationDialog } from "./components/delete-arc-confirmation-dialog";

interface PropsPlotArcDetailView {
  arc: IPlotArc;
  isEditing: boolean;
  editForm: Partial<IPlotArc>;
  showDeleteArcDialog: boolean;
  showDeleteEventDialog: boolean;
  advancedSectionOpen: boolean;
  validationErrors: Set<string>;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteArc: () => void;
  onDeleteEvent: () => void;
  onDeleteArcDialogChange: (open: boolean) => void;
  onDeleteEventDialogChange: (open: boolean) => void;
  onEditFormChange: <K extends keyof IPlotArc>(
    field: K,
    value: IPlotArc[K]
  ) => void;
  onToggleEventCompletion: (eventId: string) => void;
  onEventDeleteRequest: (eventId: string) => void;
  onReorderEvents: (events: IPlotEvent[]) => void;
  onAddEvent: (event: Omit<IPlotEvent, "id" | "order">) => void;
  onAdvancedSectionToggle: () => void;
  getSizeColor: (size: PlotArcSize) => string;
  getStatusColor: (status: PlotArcStatus) => string;
  characters?: Array<{ id: string; name: string; image?: string }>;
  factions?: Array<{ id: string; name: string; emblem?: string }>;
  items?: Array<{ id: string; name: string; image?: string }>;
}

interface PropsSortableEvent {
  event: IPlotEvent;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (event: IPlotEvent) => void;
}

function SortableEvent({
  event,
  isEditing,
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
      {!isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(event.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="mt-1 text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          {event.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
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
  advancedSectionOpen,
  validationErrors,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDeleteArc,
  onDeleteEvent,
  onDeleteArcDialogChange,
  onDeleteEventDialogChange,
  onEditFormChange,
  onToggleEventCompletion,
  onEventDeleteRequest,
  onReorderEvents,
  onAddEvent,
  onAdvancedSectionToggle,
  getSizeColor,
  getStatusColor,
  characters = [],
  factions = [],
  items = [],
}: PropsPlotArcDetailView) {
  const { t } = useTranslation("plot");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IPlotEvent | null>(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = arc.events.findIndex((e) => e.id === active.id);
      const newIndex = arc.events.findIndex((e) => e.id === over.id);

      const reordered = arrayMove(arc.events, oldIndex, newIndex).map(
        (e, idx) => ({ ...e, order: idx + 1 })
      );
      onReorderEvents(reordered);
    }
  };

  const handleAddEvent = () => {
    if (!newEventName.trim() || !newEventDescription.trim()) return;

    onAddEvent({
      name: newEventName.trim(),
      description: newEventDescription.trim(),
      completed: false,
    });

    setNewEventName("");
    setNewEventDescription("");
    setIsAddingEvent(false);
  };

  const handleStartEdit = (event: IPlotEvent) => {
    setEditingEvent(event);
    setNewEventName(event.name);
    setNewEventDescription(event.description);
    setIsAddingEvent(false);
  };

  const handleEditEvent = () => {
    if (!editingEvent || !newEventName.trim() || !newEventDescription.trim())
      return;

    // Update via parent component
    const updatedEvents = arc.events.map((e) =>
      e.id === editingEvent.id
        ? {
            ...e,
            name: newEventName.trim(),
            description: newEventDescription.trim(),
          }
        : e
    );

    onReorderEvents(updatedEvents);
    setNewEventName("");
    setNewEventDescription("");
    setEditingEvent(null);
  };

  const handleCancelEdit = () => {
    setNewEventName("");
    setNewEventDescription("");
    setIsAddingEvent(false);
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

  const selectedCharacters = characters.filter((c) =>
    activeArc.importantCharacters?.includes(c.id)
  );
  const selectedFactions = factions.filter((f) =>
    activeArc.importantFactions?.includes(f.id)
  );
  const selectedItems = items.filter((i) =>
    activeArc.importantItems?.includes(i.id)
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isEditing && (
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("button.back")}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={onCancel}>
                    {t("button.cancel")}
                  </Button>
                  <Button
                    variant="magical"
                    className="animate-glow"
                    onClick={onSave}
                  >
                    {t("button.save")}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="icon" onClick={onEdit}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteArcDialogChange(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information Section */}
          <Card className="card-magical">
            <CardHeader>
              {isEditing ? (
                <>
                  <CardTitle>{t("detail.title")}</CardTitle>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>{t("modal.arc_name")} *</Label>
                      <Input
                        value={editForm.name || ""}
                        onChange={(e) =>
                          onEditFormChange("name", e.target.value)
                        }
                        maxLength={200}
                        className={
                          validationErrors.has("name")
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      />
                      {validationErrors.has("name") && (
                        <p className="text-xs text-red-500">
                          Este campo é obrigatório
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>{t("modal.arc_summary")} *</Label>
                      <Textarea
                        value={editForm.description || ""}
                        onChange={(e) =>
                          onEditFormChange("description", e.target.value)
                        }
                        rows={3}
                        maxLength={1000}
                        className={`resize-none ${validationErrors.has("description") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {validationErrors.has("description") && (
                        <p className="text-xs text-red-500">
                          Este campo é obrigatório
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2 flex-wrap">
                    <span>{arc.name}</span>
                    <Badge
                      className={`${getStatusColor(arc.status)} pointer-events-none`}
                    >
                      {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                      {t(
                        `statuses.${arc.status === "atual" ? "current" : arc.status === "finalizado" ? "finished" : "planning"}`
                      )}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{arc.description}</CardDescription>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {t("modal.arc_status")} *
                    </Label>

                    <div className="flex gap-4">
                      {ARC_STATUSES_CONSTANT.map((status) => {
                        const Icon = status.icon;
                        const isSelected = editForm.status === status.value;

                        // Define cores específicas para cada status
                        let activeColor = "";
                        let hoverColor = "";

                        if (status.value === "finalizado") {
                          activeColor = "text-emerald-600";
                          hoverColor = "hover:text-emerald-600";
                        } else if (status.value === "atual") {
                          activeColor = "text-blue-600";
                          hoverColor = "hover:text-blue-600";
                        } else if (status.value === "planejamento") {
                          activeColor = "text-amber-600";
                          hoverColor = "hover:text-amber-600";
                        }

                        return (
                          <div key={status.value} className="flex-1">
                            <button
                              type="button"
                              onClick={() =>
                                onEditFormChange("status", status.value)
                              }
                              className={`
                              w-full flex items-center justify-center gap-3 py-3 transition-all rounded-lg
                              ${isSelected ? `${activeColor} scale-105` : "text-muted-foreground"}
                              ${!isSelected ? `${hoverColor} hover:scale-105` : ""}
                              cursor-pointer
                            `}
                            >
                              <Icon className="w-6 h-6" />
                              <span className="text-base font-medium">
                                {t(status.translationKey)}
                              </span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {validationErrors.has("status") && (
                      <p className="text-xs text-red-500">
                        Selecione um status
                      </p>
                    )}
                  </div>

                  {/* Size */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">
                        {t("modal.arc_size")} *
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("modal.arc_size_intro")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {ARC_SIZES_CONSTANT.map((size) => {
                        const Icon = size.icon;
                        const isSelected = editForm.size === size.value;

                        return (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() => onEditFormChange("size", size.value)}
                            className={`
                            relative p-4 rounded-lg border-2 transition-all text-left
                            ${isSelected ? `${size.activeColor} text-white` : size.color}
                            ${!isSelected ? `${size.hoverColor} hover:text-white` : ""}
                          `}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">
                                  {t(size.translationKey)}
                                </p>
                                <p className="text-xs mt-1 opacity-80">
                                  {t(size.descriptionKey)}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {validationErrors.has("size") && (
                      <p className="text-xs text-red-500">
                        Selecione um tamanho
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("detail.status")}
                    </label>
                    <div className="mt-1">
                      <Badge
                        className={`${getStatusColor(arc.status)} pointer-events-none`}
                      >
                        {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                        {t(
                          `statuses.${arc.status === "atual" ? "current" : arc.status === "finalizado" ? "finished" : "planning"}`
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("detail.size")}
                    </label>
                    <div className="mt-1">
                      <Badge
                        className={`${getSizeColor(arc.size)} pointer-events-none`}
                      >
                        {SizeIcon && <SizeIcon className="w-3 h-3 mr-1" />}
                        {t(
                          `sizes.${arc.size === "mini" ? "mini" : arc.size === "pequeno" ? "small" : arc.size === "médio" ? "medium" : "large"}`
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Focus */}
              <div className="mt-6">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label>{t("modal.arc_focus")} *</Label>
                    <Textarea
                      value={editForm.focus || ""}
                      onChange={(e) =>
                        onEditFormChange("focus", e.target.value)
                      }
                      rows={3}
                      maxLength={500}
                      className={`resize-none ${validationErrors.has("focus") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {validationErrors.has("focus") && (
                      <p className="text-xs text-red-500">
                        Este campo é obrigatório
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("detail.focus")}
                    </label>
                    <p className="mt-1">{arc.focus}</p>
                  </div>
                )}
              </div>

              {/* Progress - Only visible when not editing */}
              {!isEditing && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{t("detail.progress")}</span>
                    <span className="text-sm text-muted-foreground">
                      {arc.progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={arc.progress} className="h-3" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Chain Section */}
          <Card className="card-magical">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t("detail.event_chain")}</CardTitle>
                {isEditing && !isAddingEvent && !editingEvent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingEvent(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("modal.add_event")}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Add/Edit Event Form */}
              {isEditing && (isAddingEvent || editingEvent) && (
                <div className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                  <div className="space-y-2">
                    <Label>{t("modal.event_name")} *</Label>
                    <Input
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("modal.event_description")} *</Label>
                    <Textarea
                      value={newEventDescription}
                      onChange={(e) => setNewEventDescription(e.target.value)}
                      rows={3}
                      maxLength={500}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {t("button.cancel")}
                    </Button>
                    <Button
                      type="button"
                      variant="magical"
                      size="sm"
                      onClick={editingEvent ? handleEditEvent : handleAddEvent}
                      disabled={
                        !newEventName.trim() || !newEventDescription.trim()
                      }
                      className="flex-1 animate-glow"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {editingEvent ? t("button.save") : t("button.add")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Events List */}
              {arc.events.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={arc.events.map((e) => e.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {arc.events.map((event) => (
                        <SortableEvent
                          key={event.id}
                          event={event}
                          isEditing={isEditing}
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
                  <p className="text-sm">{t("detail.no_events")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Section - Collapsible */}
          <Collapsible
            open={advancedSectionOpen}
            onOpenChange={onAdvancedSectionToggle}
          >
            <Card className="card-magical">
              <CardHeader>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <CardTitle>{t("detail.advanced_section")}</CardTitle>
                    <Button variant="outline" size="sm">
                      {advancedSectionOpen
                        ? t("detail.close")
                        : t("detail.open")}
                    </Button>
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {/* Important Characters */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {t("modal.important_characters")}
                    </label>
                    {isEditing ? (
                      <>
                        {characters.filter(
                          (c) =>
                            !(editForm.importantCharacters || []).includes(c.id)
                        ).length > 0 && (
                          <Select
                            onValueChange={(characterId) => {
                              const currentCharacters =
                                editForm.importantCharacters || [];
                              if (!currentCharacters.includes(characterId)) {
                                onEditFormChange("importantCharacters", [
                                  ...currentCharacters,
                                  characterId,
                                ]);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("modal.select_character")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {characters
                                .filter(
                                  (c) =>
                                    !(
                                      editForm.importantCharacters || []
                                    ).includes(c.id)
                                )
                                .map((character) => (
                                  <SelectItem
                                    key={character.id}
                                    value={character.id}
                                    className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage
                                          src={character.image}
                                          alt={character.name}
                                        />
                                        <AvatarFallback className="text-xs !text-foreground">
                                          {getInitials(character.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{character.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                        {selectedCharacters.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {selectedCharacters.map((character) => (
                              <div
                                key={character.id}
                                className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                              >
                                <Avatar className="w-10 h-10">
                                  <AvatarImage
                                    src={character.image}
                                    alt={character.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(character.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {character.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 ml-1"
                                  onClick={() => {
                                    const currentCharacters =
                                      editForm.importantCharacters || [];
                                    onEditFormChange(
                                      "importantCharacters",
                                      currentCharacters.filter(
                                        (id) => id !== character.id
                                      )
                                    );
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                            <p className="text-sm">
                              {t("modal.no_characters_selected")}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {selectedCharacters.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {selectedCharacters.map((character) => (
                              <div
                                key={character.id}
                                className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                              >
                                <Avatar className="w-10 h-10">
                                  <AvatarImage
                                    src={character.image}
                                    alt={character.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(character.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {character.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
                            <p>{t("empty_states.no_characters")}</p>
                            <p className="text-xs mt-1">
                              {t("empty_states.no_characters_hint")}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Important Factions */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {t("modal.important_factions")}
                    </label>
                    {isEditing ? (
                      <>
                        {factions.filter(
                          (f) =>
                            !(editForm.importantFactions || []).includes(f.id)
                        ).length > 0 && (
                          <Select
                            onValueChange={(factionId) => {
                              const currentFactions =
                                editForm.importantFactions || [];
                              if (!currentFactions.includes(factionId)) {
                                onEditFormChange("importantFactions", [
                                  ...currentFactions,
                                  factionId,
                                ]);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("modal.select_faction")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {factions
                                .filter(
                                  (f) =>
                                    !(
                                      editForm.importantFactions || []
                                    ).includes(f.id)
                                )
                                .map((faction) => (
                                  <SelectItem
                                    key={faction.id}
                                    value={faction.id}
                                    className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8 rounded-md">
                                        <AvatarImage
                                          src={faction.emblem}
                                          alt={faction.name}
                                        />
                                        <AvatarFallback className="text-xs !text-foreground rounded-md">
                                          {getInitials(faction.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{faction.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                        {selectedFactions.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {selectedFactions.map((faction) => (
                              <div
                                key={faction.id}
                                className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                              >
                                <Avatar className="w-10 h-10 rounded-md">
                                  <AvatarImage
                                    src={faction.emblem}
                                    alt={faction.name}
                                  />
                                  <AvatarFallback className="text-xs rounded-md">
                                    {getInitials(faction.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {faction.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 ml-1"
                                  onClick={() => {
                                    const currentFactions =
                                      editForm.importantFactions || [];
                                    onEditFormChange(
                                      "importantFactions",
                                      currentFactions.filter(
                                        (id) => id !== faction.id
                                      )
                                    );
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                            <p className="text-sm">
                              {t("modal.no_factions_selected")}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {selectedFactions.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {selectedFactions.map((faction) => (
                              <div
                                key={faction.id}
                                className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                              >
                                <Avatar className="w-10 h-10 rounded-md">
                                  <AvatarImage
                                    src={faction.emblem}
                                    alt={faction.name}
                                  />
                                  <AvatarFallback className="text-xs rounded-md">
                                    {getInitials(faction.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {faction.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
                            <p>{t("empty_states.no_factions")}</p>
                            <p className="text-xs mt-1">
                              {t("empty_states.no_factions_hint")}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Important Items */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t("modal.important_items")}
                    </label>
                    {isEditing ? (
                      <>
                        {items.filter(
                          (i) => !(editForm.importantItems || []).includes(i.id)
                        ).length > 0 && (
                          <Select
                            onValueChange={(itemId) => {
                              const currentItems =
                                editForm.importantItems || [];
                              if (!currentItems.includes(itemId)) {
                                onEditFormChange("importantItems", [
                                  ...currentItems,
                                  itemId,
                                ]);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("modal.select_item")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {items
                                .filter(
                                  (i) =>
                                    !(editForm.importantItems || []).includes(
                                      i.id
                                    )
                                )
                                .map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={item.id}
                                    className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage
                                          src={item.image}
                                          alt={item.name}
                                        />
                                        <AvatarFallback className="text-xs !text-foreground">
                                          {getInitials(item.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{item.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                        {selectedItems.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {selectedItems.map((item) => (
                              <div
                                key={item.id}
                                className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                              >
                                <Avatar className="w-10 h-10">
                                  <AvatarImage
                                    src={item.image}
                                    alt={item.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(item.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {item.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 ml-1"
                                  onClick={() => {
                                    const currentItems =
                                      editForm.importantItems || [];
                                    onEditFormChange(
                                      "importantItems",
                                      currentItems.filter(
                                        (id) => id !== item.id
                                      )
                                    );
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                            <p className="text-sm">
                              {t("modal.no_items_selected")}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {selectedItems.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {selectedItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                              >
                                <Avatar className="w-10 h-10">
                                  <AvatarImage
                                    src={item.image}
                                    alt={item.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(item.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
                            <p>{t("empty_states.no_items")}</p>
                            <p className="text-xs mt-1">
                              {t("empty_states.no_items_hint")}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Arc Message */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("modal.arc_message")}
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={editForm.arcMessage || ""}
                        onChange={(e) =>
                          onEditFormChange("arcMessage", e.target.value)
                        }
                        placeholder={t("modal.arc_message")}
                        rows={3}
                        maxLength={500}
                        className="resize-none"
                      />
                    ) : (
                      <>
                        {arc.arcMessage ? (
                          <p className="p-4 rounded-lg bg-muted/50 border border-border">
                            {arc.arcMessage}
                          </p>
                        ) : (
                          <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
                            <p>{t("empty_states.no_message")}</p>
                            <p className="text-xs mt-1">
                              {t("empty_states.no_message_hint")}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* World Impact */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("modal.world_impact")}
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={editForm.worldImpact || ""}
                        onChange={(e) =>
                          onEditFormChange("worldImpact", e.target.value)
                        }
                        placeholder={t("modal.world_impact")}
                        rows={3}
                        maxLength={500}
                        className="resize-none"
                      />
                    ) : (
                      <>
                        {arc.worldImpact ? (
                          <p className="p-4 rounded-lg bg-muted/50 border border-border">
                            {arc.worldImpact}
                          </p>
                        ) : (
                          <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
                            <p>{t("empty_states.no_impact")}</p>
                            <p className="text-xs mt-1">
                              {t("empty_states.no_impact_hint")}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
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
              {t("detail.confirm_delete_event")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("detail.confirm_delete_event_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("button.cancel")}</AlertDialogCancel>
            <Button onClick={onDeleteEvent} variant="destructive">
              {t("button.delete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
