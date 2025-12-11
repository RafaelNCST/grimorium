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
  // Show up to 3 events, prioritizing incomplete ones
  const incomplete = events.filter((e) => !e.completed);
  const complete = events.filter((e) => e.completed);
  return [...incomplete, ...complete].slice(0, 3);
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
