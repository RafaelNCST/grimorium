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
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  } = useSortable({
    id: arc.id,
    transition: null,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const statusConfig = ARC_STATUSES_CONSTANT.find(
    (s) => s.value === arc.status
  );
  const sizeConfig = ARC_SIZES_CONSTANT.find((s) => s.value === arc.size);
  const StatusIcon = statusConfig?.icon;
  const SizeIcon = sizeConfig?.icon;

  const isCurrentArc = arc.status === "atual";

  // Get icon color based on status
  const getStatusIconColor = (status: PlotArcStatus) => {
    switch (status) {
      case "finalizado":
        return "text-emerald-500";
      case "atual":
        return "text-blue-500";
      case "planejamento":
        return "text-amber-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex-shrink-0 w-80 relative group cursor-grab active:cursor-grabbing ${isCurrentArc ? "scale-105" : ""}`}
    >
      {/* Timeline Position Number */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20">
        <span className="text-2xl font-bold text-white">{index + 1}</span>
      </div>

      {/* Arc Card */}
      <Card
        className={`card-magical cursor-pointer relative z-10 ${
          isCurrentArc ? "ring-2 ring-primary shadow-xl" : ""
        } ${!isDragging ? "hover:scale-105" : ""}`}
        onClick={(e) => {
          if (!isDragging) {
            onArcClick(arc.id);
          }
        }}
      >
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-start gap-2 text-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {StatusIcon && <StatusIcon className={`w-5 h-5 flex-shrink-0 ${getStatusIconColor(arc.status)}`} />}
                <span className="line-clamp-2">{arc.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`${getStatusColor(arc.status)} pointer-events-none`}
                >
                  {t(
                    `statuses.${arc.status === "atual" ? "current" : arc.status === "finalizado" ? "finished" : "planning"}`
                  )}
                </Badge>
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
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t("fields.arc_summary")}
            </p>
            <p className="text-sm line-clamp-3">{arc.description}</p>
          </div>

          {/* Focus */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {t("fields.arc_focus")}
            </p>
            <p className="text-sm line-clamp-2">{arc.focus}</p>
          </div>

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
        </CardContent>
      </Card>
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
    <div className="flex-1 h-full flex flex-col space-y-6 -mr-2">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("timeline.title")}</h1>
          <p className="text-muted-foreground">{t("timeline.description")}</p>
        </div>
      </div>

      <div>
        {/* Timeline Container */}
        <div className="relative mb-12">
          {/* Timeline Line - Behind cards in the middle */}
          <div className="absolute top-1/2 left-20 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 transform -translate-y-1/2 z-0" />

          {/* Timeline Content */}
          <div className="relative overflow-x-auto">
            <div className="flex gap-12 pl-20 py-16 min-w-max">
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
                  const iconColor = status.value === "finalizado"
                    ? "text-emerald-500"
                    : status.value === "atual"
                      ? "text-blue-500"
                      : "text-amber-500";
                  return (
                    <div key={status.value} className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg bg-card flex items-center justify-center"
                      >
                        <Icon className={`w-5 h-5 ${iconColor}`} />
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
