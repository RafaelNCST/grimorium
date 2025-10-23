import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IFaction } from "@/types/faction-types";

interface PropsFactionCard {
  faction: IFaction;
  onClick?: (factionId: string) => void;
}

export function FactionCard({ faction, onClick }: PropsFactionCard) {
  const { t } = useTranslation(["factions", "create-faction"]);

  const statusData = FACTION_STATUS_CONSTANT.find(
    (s) => s.value === faction.status
  );
  const StatusIcon = statusData?.icon;

  const typeData = FACTION_TYPES_CONSTANT.find(
    (c) => c.value === faction.factionType
  );
  const TypeIcon = typeData?.icon;

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-primary/50 hover:shadow-[0_8px_32px_hsl(240_10%_3.9%_/_0.3),0_0_20px_hsl(263_70%_50%_/_0.3)] hover:bg-card/80"
      onClick={() => onClick?.(faction.id)}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Faction Symbol - Square with rounded corners */}
          <Avatar className="w-24 h-24 rounded-lg flex-shrink-0">
            <AvatarImage src={faction.image} className="object-cover" />
            <AvatarFallback className="text-xl rounded-lg">
              <Shield className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>

          {/* Right side content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Name */}
            <h3 className="font-semibold text-lg leading-tight line-clamp-1">
              {faction.name}
            </h3>

            {/* Status and Faction Type badges */}
            <div className="flex flex-wrap gap-2">
              {statusData && StatusIcon && (
                <Badge
                  className={`flex items-center gap-1.5 ${statusData.bgColorClass} ${statusData.colorClass} border px-2 py-1`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span className="text-xs">
                    {t(`create-faction:status.${faction.status}`)}
                  </span>
                </Badge>
              )}
              {typeData && TypeIcon && (
                <Badge
                  className={`flex items-center gap-1.5 ${typeData.bgColorClass} ${typeData.colorClass} border px-2 py-1`}
                >
                  <TypeIcon className="w-3.5 h-3.5" />
                  <span className="text-xs">
                    {t(`create-faction:faction_type.${faction.factionType}`)}
                  </span>
                </Badge>
              )}
            </div>

            {/* Summary text with character limit */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {faction.summary}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
