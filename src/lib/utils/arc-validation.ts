import type { IPlotArc } from "@/types/plot-types";

/**
 * Validates if an arc can be finished
 * Requirements:
 * - Must have at least 1 event
 * - Must have at least 1 completed event
 */
export function canFinishArc(arc: IPlotArc): {
  canFinish: boolean;
  hasNoEvents: boolean;
  hasNoCompletedEvents: boolean;
} {
  const hasEvents = arc.events.length > 0;
  const hasCompletedEvents = arc.events.some((event) => event.completed);

  return {
    canFinish: hasEvents && hasCompletedEvents,
    hasNoEvents: !hasEvents,
    hasNoCompletedEvents: hasEvents && !hasCompletedEvents,
  };
}
