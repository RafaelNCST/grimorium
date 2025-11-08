import { useEffect, useState } from 'react';
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
import { getCharacterById } from '@/lib/db/characters.service';
import type { ICharacter } from '@/types/character-types';
import { Skeleton } from '@/components/ui/skeleton';

interface CharacterHoverCardProps {
  characterId: string;
  children: React.ReactNode;
}

export function CharacterHoverCard({
  characterId,
  children,
}: CharacterHoverCardProps) {
  const [character, setCharacter] = useState<ICharacter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCharacter() {
      try {
        setIsLoading(true);
        setError(false);
        const data = await getCharacterById(characterId);
        if (mounted) {
          setCharacter(data);
          if (!data) {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Error loading character:', err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadCharacter();

    return () => {
      mounted = false;
    };
  }, [characterId]);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        {isLoading ? (
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ) : error || !character ? (
          <div className="text-sm text-muted-foreground">
            Character not found
          </div>
        ) : (
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              {character.image && (
                <AvatarImage src={character.image} alt={character.name} />
              )}
              <AvatarFallback className="text-lg font-semibold">
                {character.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-semibold leading-none">
                {character.name}
              </h4>
              {character.role && (
                <p className="text-xs text-muted-foreground leading-none">
                  {character.role}
                </p>
              )}
              <div className="flex gap-2 text-xs text-muted-foreground pt-1">
                {character.age && <span>{character.age}</span>}
                {character.age && character.gender && <span>•</span>}
                {character.gender && <span>{character.gender}</span>}
              </div>
              {character.description && (
                <p className="text-xs text-muted-foreground line-clamp-3 pt-2">
                  {character.description.length > 150
                    ? `${character.description.substring(0, 150)}...`
                    : character.description}
                </p>
              )}
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
