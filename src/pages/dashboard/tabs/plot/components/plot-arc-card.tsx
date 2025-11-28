import { Clock, CheckCircle2, Circle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityCardWrapper } from "@/components/ui/entity-card-wrapper";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Progress } from "@/components/ui/progress";
import type { IPlotArc, IPlotEvent } from "@/types/plot-types";

import { ARC_SIZES_CONSTANT } from "../constants/arc-sizes-constant";
import { ARC_STATUSES_CONSTANT } from "../constants/arc-statuses-constant";

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
                <EntityTagBadge
                  config={{
                    value: statusData.value,
                    icon: statusData.icon,
                    translationKey: statusData.translationKey,
                    colorClass:
                      statusData.activeColor.split(" ")[1] ||
                      "text-muted-foreground",
                    bgColorClass:
                      statusData.activeColor.split(" ")[0] || "bg-muted",
                  }}
                  label={t(statusData.translationKey)}
                />
              )}
              {sizeData && (
                <EntityTagBadge
                  config={{
                    value: sizeData.value,
                    icon: sizeData.icon,
                    translationKey: sizeData.translationKey,
                    colorClass:
                      sizeData.activeColor.split(" ")[1] ||
                      "text-muted-foreground",
                    bgColorClass:
                      sizeData.activeColor.split(" ")[0] || "bg-muted",
                  }}
                  label={t(sizeData.translationKey)}
                />
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
