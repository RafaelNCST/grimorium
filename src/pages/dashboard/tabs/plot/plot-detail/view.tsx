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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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

interface PropsPlotArcDetailView {
  arc: IPlotArc;
  isEditing: boolean;
  editForm: Partial<IPlotArc>;
  showDeleteArcDialog: boolean;
  showDeleteEventDialog: boolean;
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
  getSizeColor: (size: PlotArcSize) => string;
  getStatusColor: (status: PlotArcStatus) => string;
  characters?: Array<{ id: string; name: string; image?: string }>;
  factions?: Array<{ id: string; name: string; emblem?: string }>;
}

interface PropsSortableEvent {
  event: IPlotEvent;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableEvent({
  event,
  isEditing,
  onToggle,
  onDelete,
}: PropsSortableEvent) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
    >
      {isEditing && (
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={() => onToggle(event.id)}
        className="mt-1 text-primary hover:text-primary/80 transition-colors"
        disabled={isEditing}
      >
        {event.completed ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-muted-foreground">
            #{event.order}
          </span>
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(event.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
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
  getSizeColor,
  getStatusColor,
  characters = [],
  factions = [],
}: PropsPlotArcDetailView) {
  const { t } = useTranslation("plot");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
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

  const statusConfig = ARC_STATUSES_CONSTANT.find(
    (s) => s.value === arc.status
  );
  const sizeConfig = ARC_SIZES_CONSTANT.find((s) => s.value === arc.size);
  const StatusIcon = statusConfig?.icon;
  const SizeIcon = sizeConfig?.icon;

  const selectedCharacters = characters.filter((c) =>
    arc.importantCharacters?.includes(c.id)
  );
  const selectedFactions = factions.filter((f) =>
    arc.importantFactions?.includes(f.id)
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
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">{t("detail.title")}</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* Basic Information Section */}
        <Card className="card-magical">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t("modal.arc_name")} *</Label>
                      <Input
                        value={editForm.name || ""}
                        onChange={(e) =>
                          onEditFormChange("name", e.target.value)
                        }
                        maxLength={200}
                      />
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
                        className="resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <CardTitle className="flex items-center gap-2 mb-2 flex-wrap">
                      <span>{arc.name}</span>
                      <Badge className={getStatusColor(arc.status)}>
                        {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                        {t(
                          `statuses.${arc.status === "atual" ? "current" : arc.status === "finalizado" ? "finished" : "planning"}`
                        )}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{arc.description}</CardDescription>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={onCancel}>
                      <X className="w-4 h-4 mr-2" />
                      {t("button.cancel")}
                    </Button>
                    <Button onClick={onSave}>
                      <Save className="w-4 h-4 mr-2" />
                      {t("button.save")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={onEdit}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      {t("button.edit")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDeleteArcDialogChange(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t("button.delete_arc")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              {isEditing ? (
                <div className="space-y-2">
                  <Label>{t("modal.arc_status")} *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {ARC_STATUSES_CONSTANT.map((status) => {
                      const Icon = status.icon;
                      const isSelected = editForm.status === status.value;

                      return (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() =>
                            onEditFormChange("status", status.value)
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            isSelected ? status.activeColor : status.color
                          } ${!isSelected ? status.hoverColor : ""}`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">
                              {t(status.translationKey)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("detail.status")}
                  </label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(arc.status)}>
                      {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                      {t(
                        `statuses.${arc.status === "atual" ? "current" : arc.status === "finalizado" ? "finished" : "planning"}`
                      )}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Size */}
              {isEditing ? (
                <div className="space-y-2">
                  <Label>{t("modal.arc_size")} *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ARC_SIZES_CONSTANT.map((size) => {
                      const Icon = size.icon;
                      const isSelected = editForm.size === size.value;

                      return (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() => onEditFormChange("size", size.value)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            isSelected ? size.activeColor : size.color
                          } ${!isSelected ? size.hoverColor : ""}`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs font-medium">
                              {t(size.translationKey)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("detail.size")}
                  </label>
                  <div className="mt-1">
                    <Badge className={getSizeColor(arc.size)}>
                      {SizeIcon && <SizeIcon className="w-3 h-3 mr-1" />}
                      {t(
                        `sizes.${arc.size === "mini" ? "mini" : arc.size === "pequeno" ? "small" : arc.size === "médio" ? "medium" : "large"}`
                      )}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Focus */}
            <div className="mt-6">
              {isEditing ? (
                <div className="space-y-2">
                  <Label>{t("modal.arc_focus")} *</Label>
                  <Textarea
                    value={editForm.focus || ""}
                    onChange={(e) => onEditFormChange("focus", e.target.value)}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
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
              {isEditing && !isAddingEvent && (
                <Button size="sm" onClick={() => setIsAddingEvent(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("modal.add_event")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Event Form */}
            {isEditing && isAddingEvent && (
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
                    onClick={() => {
                      setIsAddingEvent(false);
                      setNewEventName("");
                      setNewEventDescription("");
                    }}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t("button.cancel")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddEvent}
                    disabled={
                      !newEventName.trim() || !newEventDescription.trim()
                    }
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {t("button.add")}
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

        <Separator />

        {/* Advanced Section - Read Only */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t("detail.advanced_section")}
          </h3>

          {/* Important Characters */}
          {selectedCharacters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  {t("modal.important_characters")}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          {/* Important Factions */}
          {selectedFactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5" />
                  {t("modal.important_factions")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {selectedFactions.map((faction) => (
                    <div
                      key={faction.id}
                      className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                    >
                      <Avatar className="w-10 h-10 rounded-md">
                        <AvatarImage src={faction.emblem} alt={faction.name} />
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
              </CardContent>
            </Card>
          )}

          {/* Arc Message */}
          {arc.arcMessage && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("modal.arc_message")}
              </label>
              <p className="mt-2 p-4 rounded-lg bg-muted/50 border border-border">
                {arc.arcMessage}
              </p>
            </div>
          )}

          {/* World Impact */}
          {arc.worldImpact && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("modal.world_impact")}
              </label>
              <p className="mt-2 p-4 rounded-lg bg-muted/50 border border-border">
                {arc.worldImpact}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Arc Dialog */}
      <AlertDialog
        open={showDeleteArcDialog}
        onOpenChange={onDeleteArcDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("detail.confirm_delete_arc")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("detail.confirm_delete_arc_description", { name: arc.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("button.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteArc}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("button.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <AlertDialogAction
              onClick={onDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("button.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
