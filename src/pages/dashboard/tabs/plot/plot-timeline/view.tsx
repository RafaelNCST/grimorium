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
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, GripVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ARC_SIZES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-sizes-constant";
import { ARC_STATUSES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-statuses-constant";
import type { IPlotArc, PlotArcSize, PlotArcStatus } from "@/types/plot-types";

interface PropsPlotTimelineView {
  sortedArcs: IPlotArc[];
  onBack: () => void;
  onArcClick: (arcId: string) => void;
  onReorderArcs: (arcs: IPlotArc[]) => void;
  getSizeColor: (size: PlotArcSize) => string;
  getStatusColor: (status: PlotArcStatus) => string;
}

interface PropsSortableArcCard {
  arc: IPlotArc;
  index: number;
  onArcClick: (arcId: string) => void;
  getSizeColor: (size: PlotArcSize) => string;
  getStatusColor: (status: PlotArcStatus) => string;
}

function SortableArcCard({
  arc,
  index,
  onArcClick,
  getSizeColor,
  getStatusColor,
}: PropsSortableArcCard) {
  const { t } = useTranslation("plot");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: arc.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusConfig = ARC_STATUSES_CONSTANT.find(
    (s) => s.value === arc.status
  );
  const sizeConfig = ARC_SIZES_CONSTANT.find((s) => s.value === arc.size);
  const StatusIcon = statusConfig?.icon;
  const SizeIcon = sizeConfig?.icon;

  const isCurrentArc = arc.status === "atual";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex-shrink-0 w-80 relative group ${isCurrentArc ? "scale-105" : ""}`}
    >
      {/* Timeline Position Number */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
          {index + 1}
        </div>
        <button
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2 rounded-lg bg-card border border-border hover:bg-muted"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Arc Card */}
      <Card
        className={`card-magical cursor-pointer transition-all duration-300 hover:scale-105 ${
          isCurrentArc ? "ring-2 ring-primary shadow-xl" : ""
        }`}
        onClick={() => onArcClick(arc.id)}
      >
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-start gap-2 text-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {StatusIcon && <StatusIcon className="w-5 h-5 flex-shrink-0" />}
                <span className="line-clamp-2">{arc.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(arc.status)}>
                  {t(
                    `statuses.${arc.status === "atual" ? "current" : arc.status === "finalizado" ? "finished" : "planning"}`
                  )}
                </Badge>
                <Badge className={getSizeColor(arc.size)}>
                  {SizeIcon && <SizeIcon className="w-3 h-3 mr-1" />}
                  {t(
                    `sizes.${arc.size === "mini" ? "mini" : arc.size === "pequeno" ? "small" : arc.size === "médio" ? "medium" : "large"}`
                  )}
                </Badge>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {arc.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">
                {t("detail.progress")}
              </span>
              <span className="text-xs text-muted-foreground">
                {arc.progress.toFixed(0)}%
              </span>
            </div>
            <Progress value={arc.progress} className="h-2" />
          </div>

          {/* Event Count */}
          {arc.events.length > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {t("detail.events")}
              </span>
              <span className="font-medium">
                {arc.events.filter((e) => e.completed).length} /{" "}
                {arc.events.length}
              </span>
            </div>
          )}

          {/* Focus */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t("detail.focus")}:
            </p>
            <p className="text-sm line-clamp-2">{arc.focus}</p>
          </div>
        </CardContent>
      </Card>

      {/* Connection Line Indicator */}
      {index > 0 && (
        <div className="absolute top-1/2 -left-6 w-6 h-1 bg-gradient-to-r from-primary/50 to-primary transform -translate-y-1/2" />
      )}
    </div>
  );
}

export function PlotTimelineView({
  sortedArcs,
  onBack,
  onArcClick,
  onReorderArcs,
  getSizeColor,
  getStatusColor,
}: PropsPlotTimelineView) {
  const { t } = useTranslation("plot");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedArcs.findIndex((a) => a.id === active.id);
      const newIndex = sortedArcs.findIndex((a) => a.id === over.id);

      const reordered = arrayMove(sortedArcs, oldIndex, newIndex);
      onReorderArcs(reordered);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">{t("timeline.title")}</h1>
          </div>
          <p className="text-muted-foreground ml-14">
            {t("timeline.description")}
          </p>
        </div>
      </div>

      <div className="px-6 py-12">
        {/* Timeline Container */}
        <div className="relative mb-12">
          {/* Timeline Line */}
          <div className="absolute top-24 left-20 right-20 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 transform z-0" />

          {/* Timeline Content */}
          <div className="relative z-10 overflow-x-auto">
            <div className="flex gap-12 px-20 py-16 min-w-max">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortedArcs.map((a) => a.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {sortedArcs.map((arc, index) => (
                    <SortableArcCard
                      key={arc.id}
                      arc={arc}
                      index={index}
                      onArcClick={onArcClick}
                      getSizeColor={getSizeColor}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("timeline.legend")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ARC_STATUSES_CONSTANT.map((status) => {
                  const Icon = status.icon;
                  return (
                    <div key={status.value} className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${status.color} flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {t(status.translationKey)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(
                            `timeline.legend_${status.value === "atual" ? "current" : status.value === "finalizado" ? "finished" : "planning"}`
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {t("timeline.help_text")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
