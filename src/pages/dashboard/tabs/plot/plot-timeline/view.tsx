import { useState, useCallback, useRef } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragMoveEvent,
  type Modifier,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  lastInteractedId: string | null;
  onCardInteract: (arcId: string) => void;
}

// Card width (w-80 = 320px) + gap (gap-12 = 48px)
const CARD_WIDTH = 320;
const CARD_GAP = 48;
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_GAP;

interface PropsSortableArcCard {
  arc: IPlotArc;
  index: number;
  onArcClick: (arcId: string) => void;
  getSizeColor: (size: PlotArcSize) => string;
  getStatusColor: (status: PlotArcStatus) => string;
  activeId: string | null;
  lastInteractedId: string | null;
  onCardInteract: (arcId: string) => void;
}

function SortableArcCard({
  arc,
  index,
  onArcClick,
  getSizeColor,
  getStatusColor,
  activeId,
  lastInteractedId,
  onCardInteract,
}: PropsSortableArcCard) {
  const { t } = useTranslation("plot");
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: arc.id,
    });

  // Check if any drag is happening
  const isAnyDragging = activeId !== null;
  // Check if this card is being displaced by the dragged item
  const isDisplaced = isAnyDragging && !isDragging && transform;
  // Check if this card is highlighted (being dragged or was last interacted)
  const isHighlighted =
    isDragging || (!isAnyDragging && lastInteractedId === arc.id);

  const style = {
    // Only apply transform, no transition to avoid flash
    transform: CSS.Transform.toString(transform),
    // Smooth transition only for displaced items during drag
    transition: isDisplaced ? "transform 200ms ease" : undefined,
    // Keep full opacity - no transparency during drag
    opacity: 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const statusConfig = ARC_STATUSES_CONSTANT.find(
    (s) => s.value === arc.status
  );
  const sizeConfig = ARC_SIZES_CONSTANT.find((s) => s.value === arc.size);
  const StatusIcon = statusConfig?.icon;
  const SizeIcon = sizeConfig?.icon;

  // Get icon color based on status
  const getStatusIconColor = (status: PlotArcStatus) => {
    switch (status) {
      case "finished":
        return "text-emerald-500";
      case "current":
        return "text-blue-500";
      case "planning":
        return "text-amber-500";
      default:
        return "text-muted-foreground";
    }
  };

  const handleCardClick = () => {
    if (!isDragging) {
      onCardInteract(arc.id);
      onArcClick(arc.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex-shrink-0 w-80 relative group cursor-grab active:cursor-grabbing ${isHighlighted ? "scale-105" : ""}`}
    >
      {/* Timeline Position Number */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-20">
        <span className={`text-2xl font-bold ${arc.status === "current" ? "text-purple-400" : "text-white"}`}>
          {index + 1}
        </span>
      </div>

      {/* Arc Card */}
      <Card
        className={`card-magical cursor-pointer relative z-10 h-[340px] flex flex-col ${
          arc.status === "current" ? "ring-2 ring-purple-500 shadow-xl" : isHighlighted ? "ring-2 ring-primary shadow-xl" : ""
        } ${!isDragging && !isHighlighted ? "hover:scale-105" : ""}`}
        onClick={handleCardClick}
      >
        <CardHeader className="space-y-3 flex-shrink-0">
          <CardTitle className="flex items-start gap-2 text-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {StatusIcon && (
                  <StatusIcon
                    className={`w-5 h-5 flex-shrink-0 ${getStatusIconColor(arc.status)}`}
                  />
                )}
                <span className="truncate" title={arc.name}>
                  {arc.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`${getStatusColor(arc.status)} pointer-events-none`}
                >
                  {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                  {t(statusConfig?.translationKey || "statuses.planning")}
                </Badge>
                <Badge
                  className={`${getSizeColor(arc.size)} pointer-events-none`}
                >
                  {SizeIcon && <SizeIcon className="w-3 h-3 mr-1" />}
                  {t(sizeConfig?.translationKey || "sizes.medium")}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Summary */}
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground mb-1">
              {t("fields.arc_summary")}
            </p>
            <p className="text-sm line-clamp-2" title={arc.description}>
              {arc.description}
            </p>
          </div>

          {/* Focus */}
          <div className="flex-shrink-0">
            <p className="text-xs text-muted-foreground mb-1">
              {t("fields.arc_focus")}
            </p>
            <p className="text-sm line-clamp-2" title={arc.focus}>
              {arc.focus}
            </p>
          </div>

          {/* Progress */}
          <div className="flex-shrink-0 mt-auto">
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
          <div className="flex items-center justify-between text-xs flex-shrink-0">
            <span className="text-muted-foreground">{t("detail.events")}</span>
            <span className="font-medium">
              {arc.events.filter((e) => e.completed).length} /{" "}
              {arc.events.length}
            </span>
          </div>
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
  lastInteractedId,
  onCardInteract,
}: PropsPlotTimelineView) {
  const { t } = useTranslation("plot");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  // Local optimistic state to prevent flash
  const [localArcs, setLocalArcs] = useState<IPlotArc[] | null>(null);
  // Ref to track the scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Store initial scroll position when drag starts
  const [initialScroll, setInitialScroll] = useState(0);

  // Use local state if available, otherwise use props (moved up to be available for callbacks)
  const displayArcs = localArcs ?? sortedArcs;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Modifier that restricts to horizontal axis and limits drag distance
  const createBoundedModifier = useCallback(
    (
      totalItems: number,
      currentIndex: number,
      scrollStart: number,
      containerRef: React.RefObject<HTMLDivElement>
    ): Modifier =>
      ({ transform }) => {
        if (currentIndex < 0 || totalItems <= 1) {
          return { ...transform, y: 0 };
        }

        // Calculate max distances based on index positions
        const maxLeftDistance = currentIndex * CARD_TOTAL_WIDTH;
        const maxRightDistance =
          (totalItems - 1 - currentIndex) * CARD_TOTAL_WIDTH;

        // Get current scroll position
        const currentScroll = containerRef.current?.scrollLeft ?? 0;
        // Calculate how much the scroll has changed since drag started
        const scrollDelta = currentScroll - scrollStart;

        // The real displacement is the transform + scroll change
        const realDisplacement = transform.x + scrollDelta;

        // Clamp the real displacement
        const clampedDisplacement = Math.max(
          -maxLeftDistance,
          Math.min(maxRightDistance, realDisplacement)
        );

        // Convert back to transform value (subtract scroll delta)
        const clampedX = clampedDisplacement - scrollDelta;

        return {
          ...transform,
          x: clampedX,
          y: 0, // Restrict to horizontal only
        };
      },
    []
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const index = sortedArcs.findIndex((a) => a.id === id);
    setActiveId(id);
    setActiveIndex(index);
    onCardInteract(id);
    // Store the initial scroll position
    setInitialScroll(scrollContainerRef.current?.scrollLeft ?? 0);
  };

  const handleDragMove = useCallback(
    (_event: DragMoveEvent) => {
      // Limit the scroll to not go beyond the last card position
      if (!scrollContainerRef.current || activeIndex < 0) return;

      const container = scrollContainerRef.current;
      const totalItems = displayArcs.length;

      // Calculate the maximum scroll position
      // Content width = (totalItems * CARD_WIDTH) + ((totalItems - 1) * CARD_GAP) + padding (pl-20=80 + pr-12=48)
      const contentWidth =
        totalItems * CARD_WIDTH + (totalItems - 1) * CARD_GAP + 80 + 48;
      const maxScroll = Math.max(0, contentWidth - container.clientWidth);

      // If scroll exceeds max, clamp it
      if (container.scrollLeft > maxScroll) {
        container.scrollLeft = maxScroll;
      }
    },
    [activeIndex, displayArcs.length]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveIndex(-1);
    setInitialScroll(0);

    if (over && active.id !== over.id) {
      const oldIndex = sortedArcs.findIndex((a) => a.id === active.id);
      const newIndex = sortedArcs.findIndex((a) => a.id === over.id);

      const reordered = arrayMove(sortedArcs, oldIndex, newIndex);

      // Apply optimistic update immediately to prevent flash
      setLocalArcs(reordered);

      // Then persist to database
      onReorderArcs(reordered);

      // Clear local state after a short delay to let parent update
      setTimeout(() => setLocalArcs(null), 50);
    }
  };

  // Create the bounded modifier based on current drag state
  const boundedModifier = createBoundedModifier(
    displayArcs.length,
    activeIndex,
    initialScroll,
    scrollContainerRef
  );

  return (
    <div className="flex-1 h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("timeline.title")}</h1>
          <p className="text-muted-foreground">{t("timeline.description")}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Timeline Container */}
        <div className="relative mb-12 overflow-hidden">
          {/* Timeline Line - Behind cards in the middle */}
          <div className="absolute top-1/2 left-20 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 transform -translate-y-1/2 z-0" />

          {/* Timeline Content */}
          <div
            ref={scrollContainerRef}
            className="relative overflow-x-auto scrollbar-offset-left"
          >
            <div className="flex gap-12 pl-20 pr-12 py-16 min-w-max">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[boundedModifier]}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                autoScroll={{
                  layoutShiftCompensation: false,
                  acceleration: 5,
                  interval: 5,
                }}
              >
                <SortableContext
                  items={displayArcs.map((a) => a.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {displayArcs.map((arc, index) => (
                    <SortableArcCard
                      key={arc.id}
                      arc={arc}
                      index={index}
                      onArcClick={onArcClick}
                      getSizeColor={getSizeColor}
                      getStatusColor={getStatusColor}
                      activeId={activeId}
                      lastInteractedId={lastInteractedId}
                      onCardInteract={onCardInteract}
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
                  const iconColor =
                    status.value === "finished"
                      ? "text-emerald-500"
                      : status.value === "current"
                        ? "text-blue-500"
                        : "text-amber-500";
                  return (
                    <div key={status.value} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-card flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {t(status.translationKey)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t(`timeline.legend_${status.value}`)}
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
