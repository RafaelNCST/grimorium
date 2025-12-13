import { useEffect, useState } from "react";

import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DisplayImage } from "@/components/displays";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFactionById } from "@/lib/db/factions.service";
import type { IFaction } from "@/types/faction-types";

interface FactionHoverCardProps {
  factionId: string;
  children: React.ReactNode;
}

export function FactionHoverCard({
  factionId,
  children,
}: FactionHoverCardProps) {
  const { t } = useTranslation(["power-system", "create-faction"]);
  const [faction, setFaction] = useState<IFaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadFaction() {
      try {
        setIsLoading(true);
        setError(false);
        const data = await getFactionById(factionId);
        if (mounted) {
          setFaction(data);
          if (!data) {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error loading faction:", err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadFaction();

    return () => {
      mounted = false;
    };
  }, [factionId]);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[400px]" align="start">
        {isLoading ? (
          <div className="p-1 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error || !faction ? (
          <div className="text-sm text-muted-foreground">
            {t("power-system:hover_card.faction_not_found")}
          </div>
        ) : (
          <div className="p-1 space-y-4">
            {/* Top Section: Image + Name/Type/Status */}
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

              {/* Name, Type, and Status */}
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                  {faction.name}
                </h3>

                {/* Status and Faction Type badges */}
                <div className="flex flex-wrap gap-2">
                  {faction.status &&
                    (() => {
                      const statusData = FACTION_STATUS_CONSTANT.find(
                        (s) => s.value === faction.status
                      );
                      return statusData ? (
                        <EntityTagBadge
                          config={statusData}
                          label={t(`create-faction:status.${faction.status}`)}
                        />
                      ) : null;
                    })()}
                  {faction.factionType &&
                    (() => {
                      const typeData = FACTION_TYPES_CONSTANT.find(
                        (c) => c.value === faction.factionType
                      );
                      return typeData ? (
                        <EntityTagBadge
                          config={typeData}
                          label={t(
                            `create-faction:faction_type.${faction.factionType}`
                          )}
                        />
                      ) : null;
                    })()}
                </div>
              </div>
            </div>

            {/* Summary */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {faction.summary}
            </p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
