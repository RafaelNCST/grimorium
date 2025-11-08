import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dna } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getRaceById } from '@/lib/db/races.service';
import type { IRace } from '@/pages/dashboard/tabs/races/types/race-types';
import { Skeleton } from '@/components/ui/skeleton';

interface RaceHoverCardProps {
  raceId: string;
  children: React.ReactNode;
}

export function RaceHoverCard({
  raceId,
  children,
}: RaceHoverCardProps) {
  const { t } = useTranslation(['power-system', 'create-race']);
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
        console.error('Error loading race:', err);
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
              <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
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
            {t('power-system:hover_card.race_not_found')}
          </div>
        ) : (
          <div className="p-1 space-y-4">
            {/* Top Section: Image + Name/Domain */}
            <div className="flex gap-4">
              {/* Race Image - Circular */}
              <Avatar className="w-20 h-20 flex-shrink-0">
                <AvatarImage
                  src={race.image}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  {race.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Name and Domain */}
              <div className="flex-1 min-w-0 space-y-2">
                <h4 className="text-base font-bold line-clamp-2">
                  {race.name}
                </h4>

                {race.scientificName && (
                  <div className="flex items-center gap-1.5">
                    <Dna className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground italic">
                      {race.scientificName}
                    </span>
                  </div>
                )}

                {/* Domain Badges */}
                {race.domain && race.domain.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {race.domain.map((domain) => (
                      <Badge
                        key={domain}
                        variant="secondary"
                        className="px-2 py-0.5"
                      >
                        <span className="text-xs font-medium">
                          {domain}
                        </span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {race.summary && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {race.summary}
              </p>
            )}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
