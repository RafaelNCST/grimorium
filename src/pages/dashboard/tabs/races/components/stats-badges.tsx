import { Badge } from "@/components/ui/badge";

import { TYPE_BADGE_COLORS_CONSTANT } from "../constants/type-colors-constant";
import { IRaceTypeStats } from "../types/race-types";

interface PropsStatsBadges {
  totalSpecies: number;
  raceTypeStats: IRaceTypeStats;
}

export function StatsBadges({ totalSpecies, raceTypeStats }: PropsStatsBadges) {
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="secondary"
        className="bg-primary/10 text-primary border-primary/20"
      >
        {totalSpecies} Total
      </Badge>
      <Badge
        variant="secondary"
        className={TYPE_BADGE_COLORS_CONSTANT.Aquática}
      >
        {raceTypeStats.Aquática} Aquática
      </Badge>
      <Badge
        variant="secondary"
        className={TYPE_BADGE_COLORS_CONSTANT.Terrestre}
      >
        {raceTypeStats.Terrestre} Terrestre
      </Badge>
      <Badge variant="secondary" className={TYPE_BADGE_COLORS_CONSTANT.Voadora}>
        {raceTypeStats.Voadora} Voadora
      </Badge>
    </div>
  );
}
