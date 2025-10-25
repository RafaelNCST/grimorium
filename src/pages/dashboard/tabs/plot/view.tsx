import { useState } from "react";

import {
  DndContext,
  closestCenter,
  closestCorners,
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
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  GitBranch,
  BookOpen,
  SearchX,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/empty-state";
import { CreatePlotArcModal } from "@/components/modals/create-plot-arc-modal";
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
import { Progress } from "@/components/ui/progress";
import { ARC_SIZES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-sizes-constant";
import { ARC_STATUSES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-statuses-constant";
import type {
  IPlotArc,
  IPlotEvent,
  PlotArcSize,
  PlotArcStatus,
} from "@/types/plot-types";

interface Character {
  id: string;
  name: string;
  image?: string;
}

interface Faction {
  id: string;
  name: string;
  emblem?: string;
}

interface Item {
  id: string;
  name: string;
  image?: string;
}

interface PropsPlotView {
  arcs: IPlotArc[];
  characters: Character[];
  factions: Faction[];
  items: Item[];
  showCreateModal: boolean;
  selectedStatuses: PlotArcStatus[];
  selectedSizes: PlotArcSize[];
  filteredAndSortedArcs: IPlotArc[];
  bookId: string;
  onSetShowCreateModal: (show: boolean) => void;
  onStatusFilterChange: (status: PlotArcStatus) => void;
  onSizeFilterChange: (size: PlotArcSize) => void;
  onClearFilters: () => void;
  onCreateArc: (arcData: Omit<IPlotArc, "id" | "progress" | "order">) => void;
  onMoveArc: (arcId: string, direction: "up" | "down") => void;
  onReorderArcs: (arcs: IPlotArc[]) => void;
  onPlotTimelineClick: (bookId: string) => void;
  onArcClick: (arcId: string, bookId: string) => void;
  getSizeColor: (size: PlotArcSize) => string;
  getStatusColor: (status: PlotArcStatus) => string;
  getVisibleEvents: (events: IPlotEvent[]) => IPlotEvent[];
}

interface PropsSortableArcCard {
  arc: IPlotArc;
  onArcClick: (arcId: string, bookId: string) => void;
  getSizeColor: (size: PlotArcSize) => string;
  getStatusColor: (status: PlotArcStatus) => string;
  getVisibleEvents: (events: IPlotEvent[]) => IPlotEvent[];
  bookId: string;
  isDragDisabled: boolean;
}

function SortableArcCard({
  arc,
  onArcClick,
  getSizeColor,
  getStatusColor,
  getVisibleEvents,
  bookId,
  isDragDisabled,
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
    disabled: isDragDisabled,
    transition: {
      duration: 200,
      easing: "ease",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if not dragging
    if (!isDragging) {
      onArcClick(arc.id, bookId);
    }
  };

  const statusConfig = ARC_STATUSES_CONSTANT.find(
    (s) => s.value === arc.status
  );
  const sizeConfig = ARC_SIZES_CONSTANT.find((s) => s.value === arc.size);
  const StatusIcon = statusConfig?.icon;
  const SizeIcon = sizeConfig?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="will-change-transform"
      {...(!isDragDisabled ? attributes : {})}
      {...(!isDragDisabled ? listeners : {})}
    >
      <Card
        className={`${
          !isDragging
            ? "transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 hover:shadow-[0_8px_32px_hsl(240_10%_3.9%_/_0.3),0_0_20px_hsl(263_70%_50%_/_0.3)] hover:bg-card/80"
            : ""
        } ${isDragDisabled ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}`}
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 flex-wrap">
                <span className="truncate">{arc.name}</span>
                <Badge className={`${getStatusColor(arc.status)} pointer-events-none`}>
                  {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                  {t(
                    `statuses.${arc.status === "atual" ? "current" : arc.status === "finalizado" ? "finished" : "planning"}`
                  )}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {arc.description}
              </CardDescription>
            </div>

            <Badge className={`${getSizeColor(arc.size)} pointer-events-none`}>
              {SizeIcon && <SizeIcon className="w-3 h-3 mr-1" />}
              {t(
                `sizes.${arc.size === "mini" ? "mini" : arc.size === "pequeno" ? "small" : arc.size === "médio" ? "medium" : "large"}`
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {t("detail.progress")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {arc.progress.toFixed(0)}%
                </span>
              </div>
              <Progress value={arc.progress} className="h-2" />
            </div>

            {arc.events.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t("detail.next_events")}
                </h4>
                <div className="space-y-2">
                  {getVisibleEvents(arc.events).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      {event.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span
                        className={
                          event.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }
                      >
                        {event.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function PlotView({
  arcs,
  characters,
  factions,
  items,
  showCreateModal,
  selectedStatuses,
  selectedSizes,
  filteredAndSortedArcs,
  bookId,
  onSetShowCreateModal,
  onStatusFilterChange,
  onSizeFilterChange,
  onClearFilters,
  onCreateArc,
  onReorderArcs,
  onPlotTimelineClick,
  onArcClick,
  getSizeColor,
  getStatusColor,
  getVisibleEvents,
}: PropsPlotView) {
  const { t } = useTranslation("plot");
  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check if status/size filters are active (search doesn't count as blocking filter)
  const hasBlockingFilters =
    selectedStatuses.length > 0 || selectedSizes.length > 0;

  // When no blocking filters are active, use arcs sorted ONLY by order (not by status priority)
  // When blocking filters are active, use the pre-sorted filteredAndSortedArcs
  const baseArcs = hasBlockingFilters
    ? filteredAndSortedArcs
    : [...arcs].sort((a, b) => a.order - b.order);

  // Apply search filter
  const displayArcs = baseArcs.filter((arc) =>
    arc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Don't allow reordering when filters are active
    if (hasBlockingFilters) {
      return;
    }

    if (over && active.id !== over.id) {
      const oldIndex = displayArcs.findIndex((a) => a.id === active.id);
      const newIndex = displayArcs.findIndex((a) => a.id === over.id);

      const reordered = arrayMove(displayArcs, oldIndex, newIndex);
      onReorderArcs(reordered);
    }
  };

  // Count arcs by status
  const statusCounts = {
    todos: arcs.length,
    planejamento: arcs.filter((a) => a.status === "planejamento").length,
    atual: arcs.filter((a) => a.status === "atual").length,
    finalizado: arcs.filter((a) => a.status === "finalizado").length,
  };

  // Count arcs by size
  const sizeCounts = {
    todos: arcs.length,
    mini: arcs.filter((a) => a.size === "mini").length,
    pequeno: arcs.filter((a) => a.size === "pequeno").length,
    médio: arcs.filter((a) => a.size === "médio").length,
    grande: arcs.filter((a) => a.size === "grande").length,
  };

  // Empty state when no arcs exist
  if (arcs.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t("page.title")}</h2>
            <p className="text-muted-foreground">{t("page.description")}</p>
          </div>
          <Button
            variant="magical"
            size="lg"
            onClick={() => onSetShowCreateModal(true)}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("page.new_arc")}
          </Button>
        </div>

        <EmptyState
          icon={BookOpen}
          title={t("empty_state.no_arcs")}
          description={t("empty_state.no_arcs_description")}
        />

        <CreatePlotArcModal
          open={showCreateModal}
          onOpenChange={onSetShowCreateModal}
          onCreateArc={onCreateArc}
          existingArcs={arcs}
          characters={characters}
          factions={factions}
          items={items}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col space-y-6 pb-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("page.title")}</h2>
          <p className="text-muted-foreground">{t("page.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onPlotTimelineClick(bookId)}
            className="hover:bg-muted"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            {t("page.visual_tree")}
          </Button>
          <Button
            variant="magical"
            size="lg"
            onClick={() => onSetShowCreateModal(true)}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("page.new_arc")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        {/* Total Badge - First Line */}
        <div className="flex flex-wrap gap-2">
          <Badge
            className={`cursor-pointer border transition-colors ${
              selectedStatuses.length === 0 && selectedSizes.length === 0
                ? "!bg-primary !text-white !border-primary"
                : "bg-background text-foreground border-border hover:!bg-primary hover:!text-white hover:!border-primary"
            }`}
            onClick={onClearFilters}
          >
            {arcs.length} {t("page.total_arcs")}
          </Badge>
        </div>

        {/* Status Filters - Second Line */}
        <div className="flex flex-wrap gap-2">
          {ARC_STATUSES_CONSTANT.map((status) => {
            const Icon = status.icon;
            const isActive = selectedStatuses.includes(status.value);
            const count =
              statusCounts[
                status.value === "atual"
                  ? "atual"
                  : status.value === "finalizado"
                    ? "finalizado"
                    : "planejamento"
              ];

            // Define cores para cada status
            let badgeClass = "";
            if (status.value === "finalizado") {
              badgeClass = isActive
                ? "!bg-emerald-500 !text-black !border-emerald-500"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:!bg-emerald-500 hover:!text-black hover:!border-emerald-500";
            } else if (status.value === "atual") {
              badgeClass = isActive
                ? "!bg-blue-500 !text-black !border-blue-500"
                : "bg-blue-500/10 border-blue-500/30 text-blue-600 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500";
            } else if (status.value === "planejamento") {
              badgeClass = isActive
                ? "!bg-amber-500 !text-black !border-amber-500"
                : "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:!bg-amber-500 hover:!text-black hover:!border-amber-500";
            }

            return (
              <Badge
                key={status.value}
                className={`cursor-pointer border transition-colors ${badgeClass}`}
                onClick={() => onStatusFilterChange(status.value)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {t(status.translationKey)} ({count})
              </Badge>
            );
          })}
        </div>

        {/* Size Filters - Third Line */}
        <div className="flex flex-wrap gap-2">
          {ARC_SIZES_CONSTANT.map((size) => {
            const Icon = size.icon;
            const isActive = selectedSizes.includes(size.value);
            const count = sizeCounts[size.value];

            // Define cores para cada tamanho
            let badgeClass = "";
            if (size.value === "mini") {
              badgeClass = isActive
                ? "!bg-violet-500 !text-black !border-violet-500"
                : "bg-violet-500/10 border-violet-500/30 text-violet-600 hover:!bg-violet-500 hover:!text-black hover:!border-violet-500";
            } else if (size.value === "pequeno") {
              badgeClass = isActive
                ? "!bg-blue-500 !text-black !border-blue-500"
                : "bg-blue-500/10 border-blue-500/30 text-blue-600 hover:!bg-blue-500 hover:!text-black hover:!border-blue-500";
            } else if (size.value === "médio") {
              badgeClass = isActive
                ? "!bg-indigo-500 !text-black !border-indigo-500"
                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 hover:!bg-indigo-500 hover:!text-black hover:!border-indigo-500";
            } else if (size.value === "grande") {
              badgeClass = isActive
                ? "!bg-purple-500 !text-black !border-purple-500"
                : "bg-purple-500/10 border-purple-500/30 text-purple-600 hover:!bg-purple-500 hover:!text-black hover:!border-purple-500";
            }

            return (
              <Badge
                key={size.value}
                className={`cursor-pointer border transition-colors ${badgeClass}`}
                onClick={() => onSizeFilterChange(size.value)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {t(size.translationKey)} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("page.search_placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Empty state when no filtered results */}
      {displayArcs.length === 0 && (
        <EmptyState
          icon={searchQuery ? SearchX : BookOpen}
          title={t("empty_state.no_results")}
          description={t("empty_state.no_results_description")}
        />
      )}

      {/* Arcs List with DnD */}
      {displayArcs.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayArcs.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-6 pb-6">
              {displayArcs.map((arc) => (
                <SortableArcCard
                  key={arc.id}
                  arc={arc}
                  onArcClick={onArcClick}
                  getSizeColor={getSizeColor}
                  getStatusColor={getStatusColor}
                  getVisibleEvents={getVisibleEvents}
                  bookId={bookId}
                  isDragDisabled={hasBlockingFilters}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <CreatePlotArcModal
        open={showCreateModal}
        onOpenChange={onSetShowCreateModal}
        onCreateArc={onCreateArc}
        existingArcs={arcs}
        characters={characters}
        factions={factions}
        items={items}
      />
    </div>
  );
}
