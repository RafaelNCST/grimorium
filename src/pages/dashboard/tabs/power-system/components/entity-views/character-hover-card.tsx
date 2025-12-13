import { useEffect, useState } from "react";

import { Calendar, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { CHARACTER_ROLES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-roles";
import { CHARACTER_STATUS_CONSTANT } from "@/components/modals/create-character-modal/constants/character-status";
import { GENDERS_CONSTANT } from "@/components/modals/create-character-modal/constants/genders";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCharacterById } from "@/lib/db/characters.service";
import type { ICharacter } from "@/types/character-types";

interface CharacterHoverCardProps {
  characterId: string;
  children: React.ReactNode;
}

export function CharacterHoverCard({
  characterId,
  children,
}: CharacterHoverCardProps) {
  const { t } = useTranslation(["power-system", "create-character"]);
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
        console.error("Error loading character:", err);
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
        ) : error || !character ? (
          <div className="text-sm text-muted-foreground">
            {t("power-system:hover_card.character_not_found")}
          </div>
        ) : (
          <div className="p-1 space-y-4">
            {/* Top Section: Image + Name/Age/Gender/Role */}
            <div className="flex gap-4">
              {/* Character Image - Circular */}
              {character.image ? (
                <Avatar className="w-20 h-20 flex-shrink-0">
                  <AvatarImage src={character.image} className="object-cover" />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-primary/10">
                    {character.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <FormImageDisplay
                  icon={User}
                  height="h-20"
                  width="w-20"
                  shape="circle"
                />
              )}

              {/* Name, Age, Gender, and Role/Status */}
              <div className="flex-1 min-w-0 space-y-2">
                <h4 className="text-base font-bold line-clamp-2">
                  {character.name}
                </h4>

                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {character.age && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {character.age}
                      </span>
                    </div>
                  )}
                  {character.gender &&
                    (() => {
                      const genderData = GENDERS_CONSTANT.find(
                        (g) => g.value === character.gender
                      );
                      const GenderIcon = genderData?.icon;
                      return GenderIcon ? (
                        <div className="flex items-center gap-1.5">
                          <GenderIcon className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground capitalize">
                            {t(`create-character:gender.${character.gender}`)}
                          </span>
                        </div>
                      ) : null;
                    })()}
                </div>

                {/* Role and Status Badges */}
                <div className="flex gap-2 flex-wrap">
                  {character.role &&
                    (() => {
                      const roleData = CHARACTER_ROLES_CONSTANT.find(
                        (r) => r.value === character.role
                      );
                      return roleData ? (
                        <EntityTagBadge
                          config={roleData}
                          label={t(`create-character:role.${character.role}`)}
                        />
                      ) : null;
                    })()}
                  {character.status &&
                    (() => {
                      const statusData = CHARACTER_STATUS_CONSTANT.find(
                        (s) => s.value === character.status
                      );
                      return statusData ? (
                        <EntityTagBadge
                          config={statusData}
                          label={t(
                            `create-character:status.${character.status}`
                          )}
                        />
                      ) : null;
                    })()}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {character.description}
            </p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
