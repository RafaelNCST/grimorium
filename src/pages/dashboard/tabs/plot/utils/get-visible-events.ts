import type { IPlotEvent } from "@/types/plot-types";

export function getVisibleEvents(events: IPlotEvent[]): IPlotEvent[] {
  const sortedEvents = [...events].sort((a, b) => a.order - b.order);
  const currentIndex = sortedEvents.findIndex((e) => !e.completed);

  if (currentIndex === -1) {
    return sortedEvents.slice(-3);
  }

  return sortedEvents.slice(currentIndex, currentIndex + 3);
}
