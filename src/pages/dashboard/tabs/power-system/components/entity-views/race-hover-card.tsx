import { useEffect, useState } from "react";

import { Dna } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { getRaceDomains } from "@/components/modals/create-race-modal/constants/domains";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRaceById } from "@/lib/db/races.service";
import { getDomainDisplayData } from "@/pages/dashboard/tabs/races/helpers/domain-filter-config";
import type { IRace } from "@/pages/dashboard/tabs/races/types/race-types";

interface RaceHoverCardProps {
  raceId: string;
  children: React.ReactNode;
}

export function RaceHoverCard({ raceId, children }: RaceHoverCardProps) {
  const { t } = useTranslation(["power-system", "create-race", "races"]);
  const [race, setRace] = useState<IRace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadRace() {
      try {
        setIsLoading(true);
        setError(false);
        const data = await getRaceById(raceId);
        if (mounted) {
          setRace(data);
          if (!data) {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error loading race:", err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadRace();

    return () => {
      mounted = false;
    };
  }, [raceId]);

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
        ) : error || !race ? (
          <div className="text-sm text-muted-foreground">
            {t("power-system:hover_card.race_not_found")}
          </div>
        ) : (
          <div className="p-1 space-y-4">
            {/* Top Section: Image + Name/Scientific Name/Domain */}
            <div className="flex gap-4">
              {/* Race Image - Square with rounded corners */}
              {race?.image ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={race.image}
                    alt={race?.name || "Race"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <FormImageDisplay
                  icon={Dna}
                  height="h-20"
                  width="w-20"
                  shape="square"
                  className="rounded-lg"
                />
              )}

              {/* Names and Domains */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Names Section */}
                <div>
                  <h3 className="font-semibold text-lg leading-tight">
                    {race.name}
                  </h3>
                  {race.scientificName && (
                    <p className="text-sm italic text-muted-foreground mt-1">
                      {race.scientificName}
                    </p>
                  )}
                </div>

                {/* Domains */}
                <div className="flex flex-wrap gap-1.5">
                  {race.domain.map((domainValue) => {
                    const raceDomains = getRaceDomains(t);
                    const domainData = raceDomains.find(
                      (d) => d.value === domainValue
                    );
                    const { icon: DomainIcon, colorConfig } =
                      getDomainDisplayData(domainValue, t);

                    if (!DomainIcon || !colorConfig || !domainData) return null;

                    return (
                      <Badge
                        key={domainValue}
                        className={`flex items-center gap-1 ${colorConfig.inactiveClasses} px-2 py-0.5 pointer-events-none`}
                      >
                        <DomainIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">
                          {domainData.label}
                        </span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {race.summary}
            </p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
