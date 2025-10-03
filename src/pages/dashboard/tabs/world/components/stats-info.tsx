import { Badge } from "@/components/ui/badge";

import { IWorldEntityStats } from "../types/world-types";

interface PropsStatsInfo {
  stats: IWorldEntityStats;
}

export function StatsInfo({ stats }: PropsStatsInfo) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge variant="secondary">
        {stats.totalWorlds} mundo{stats.totalWorlds !== 1 ? "s" : ""}
      </Badge>
      <Badge variant="secondary">
        {stats.totalContinents} continente
        {stats.totalContinents !== 1 ? "s" : ""}
      </Badge>
      <Badge variant="secondary">
        {stats.totalLocations} local{stats.totalLocations !== 1 ? "is" : ""}
      </Badge>
    </div>
  );
}
