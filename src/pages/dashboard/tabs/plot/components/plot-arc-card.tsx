import { Clock, CheckCircle2, Circle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { EntityCardWrapper } from "@/components/ui/entity-card-wrapper";
import { Progress } from "@/components/ui/progress";
import type { IPlotArc, IPlotEvent } from "@/types/plot-types";

import { ARC_SIZES_CONSTANT } from "../constants/arc-sizes-constant";
import { ARC_STATUSES_CONSTANT } from "../constants/arc-statuses-constant";

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

interface PropsPlotArcCard {
  arc: IPlotArc;
  onClick?: (arcId: string) => void;
}

function getVisibleEvents(events: IPlotEvent[]): IPlotEvent[] {
  if (events.length === 0) return [];

  // Find the last completed event
  let lastCompletedIndex = -1;
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].completed) {
      lastCompletedIndex = i;
      break;
    }
  }

  // If no event is completed, show the first 3
  if (lastCompletedIndex === -1) {
    return events.slice(0, 3);
  }

  // Find next 2 incomplete events after the last completed
  const eventsAfterLastCompleted = events.slice(lastCompletedIndex + 1);
  const nextTwoIncomplete = eventsAfterLastCompleted.filter(e => !e.completed).slice(0, 2);

  // If we have 2 incomplete events after last completed, show [last completed, next 2 incomplete]
  if (nextTwoIncomplete.length === 2) {
    return [events[lastCompletedIndex], ...nextTwoIncomplete];
  }

  // If we have only 1 incomplete after, check if remaining are all completed
  // In this case, or if all are completed, show last 3
  const allCompleted = events.every(e => e.completed);
  const onlyOneIncompleteLeft = eventsAfterLastCompleted.filter(e => !e.completed).length === 1;

  if (allCompleted || onlyOneIncompleteLeft) {
    return events.slice(-3);
  }

  // Otherwise, show last completed + whatever incomplete we have after + fill with completed if needed
  const result = [events[lastCompletedIndex], ...nextTwoIncomplete];

  // If we have less than 3, fill with more events from the end
  if (result.length < 3) {
    const needed = 3 - result.length;
    const additional = events.slice(Math.max(0, events.length - needed));
    // Merge without duplicates
    const resultIds = new Set(result.map(e => e.id));
    const filtered = additional.filter(e => !resultIds.has(e.id));
    return [...result, ...filtered].slice(0, 3);
  }

  return result.slice(0, 3);
}

export function PlotArcCard({ arc, onClick }: PropsPlotArcCard) {
  const { t } = useTranslation("plot");

  const statusData = ARC_STATUSES_CONSTANT.find((s) => s.value === arc.status);
  const sizeData = ARC_SIZES_CONSTANT.find((s) => s.value === arc.size);

  const visibleEvents = getVisibleEvents(arc.events);

  return (
    <EntityCardWrapper
      onClick={() => onClick?.(arc.id)}
      overlayText={t("page.view_details")}
      contentClassName="p-5"
    >
      <div className="space-y-4">
        {/* Header with name, status and size */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Name */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-1">
              {arc.name}
            </h3>

            {/* Status and Size badges */}
            <div className="flex flex-wrap gap-2">
              {statusData && (
                <Badge
                  className={`pointer-events-none ${STATUS_DISPLAY_COLORS[arc.status]}`}
                >
                  <statusData.icon className="w-3.5 h-3.5 mr-1.5" />
                  {t(statusData.translationKey)}
                </Badge>
              )}
              {sizeData && (
                <Badge
                  className={`pointer-events-none ${SIZE_DISPLAY_COLORS[arc.size]}`}
                >
                  <sizeData.icon className="w-3.5 h-3.5 mr-1.5" />
                  {t(sizeData.translationKey)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {arc.description}
        </p>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{t("detail.progress")}</span>
            <span className="text-sm text-muted-foreground">
              {arc.progress.toFixed(0)}%
            </span>
          </div>
          <Progress value={arc.progress} className="h-2" />
        </div>

        {/* Events preview */}
        {visibleEvents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t("detail.next_events")}
            </h4>
            <div className="space-y-2">
              {visibleEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-2 text-sm">
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
    </EntityCardWrapper>
  );
}
