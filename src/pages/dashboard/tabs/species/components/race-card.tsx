import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TYPE_COLORS_CONSTANT } from "../constants/type-colors-constant";
import { IRace } from "../types/species-types";

interface PropsRaceCard {
  race: IRace;
  onClick: (raceId: string) => void;
}

export function RaceCard({ race, onClick }: PropsRaceCard) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(race.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{race.name}</CardTitle>
          <Badge className={TYPE_COLORS_CONSTANT[race.type]}>{race.type}</Badge>
        </div>
        <CardDescription className="line-clamp-1">
          {race.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
