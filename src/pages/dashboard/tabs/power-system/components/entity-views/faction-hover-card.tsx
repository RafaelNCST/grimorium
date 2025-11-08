import { useEffect, useState } from "react";

import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
              <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
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
              {/* Faction Image - Circular */}
              <Avatar className="w-20 h-20 flex-shrink-0">
                <AvatarImage src={faction.image} className="object-cover" />
                <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  {faction.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Name, Type, and Status */}
              <div className="flex-1 min-w-0 space-y-2">
                <h4 className="text-base font-bold line-clamp-2">
                  {faction.name}
                </h4>

                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {faction.factionType && (
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground capitalize">
                        {t(
                          `create-faction:faction_type.${faction.factionType}`
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                {faction.status && (
                  <div className="flex">
                    <Badge variant="secondary" className="px-3 py-1">
                      <span className="text-xs font-medium capitalize">
                        {t(`create-faction:status.${faction.status}`)}
                      </span>
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {faction.summary && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {faction.summary}
              </p>
            )}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
