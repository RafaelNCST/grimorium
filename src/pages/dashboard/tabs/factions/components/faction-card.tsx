import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DisplayImage } from "@/components/displays";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { EntityCardWrapper } from "@/components/ui/entity-card-wrapper";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
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

  const typeData = FACTION_TYPES_CONSTANT.find(
    (c) => c.value === faction.factionType
  );

  return (
    <EntityCardWrapper
      onClick={() => onClick?.(faction.id)}
      overlayText="Ver detalhes"
      contentClassName="p-5"
    >
      <div className="flex gap-4">
        {/* Faction Symbol - Square with rounded corners */}
        {faction.image ? (
          <Avatar className="w-24 h-24 rounded-lg flex-shrink-0">
            <AvatarImage src={faction.image} className="object-cover" />
          </Avatar>
        ) : (
          <DisplayImage
            icon={Shield}
            height="h-24"
            width="w-24"
            shape="square"
          />
        )}

        {/* Right side content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {faction.name}
          </h3>

          {/* Status and Faction Type badges */}
          <div className="flex flex-wrap gap-2">
            {statusData && (
              <EntityTagBadge
                config={statusData}
                label={t(`create-faction:status.${faction.status}`)}
              />
            )}
            {typeData && (
              <EntityTagBadge
                config={typeData}
                label={t(`create-faction:faction_type.${faction.factionType}`)}
              />
            )}
          </div>

          {/* Summary text with character limit */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {faction.summary}
          </p>
        </div>
      </div>
    </EntityCardWrapper>
  );
}
