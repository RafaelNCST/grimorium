import { useState } from "react";

import { Calendar, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { CHARACTER_ROLES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-roles";
import { CHARACTER_STATUS_CONSTANT } from "@/components/modals/create-character-modal/constants/character-status";
import { GENDERS_CONSTANT } from "@/components/modals/create-character-modal/constants/genders";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ICharacter } from "@/types/character-types";

interface CharacterCardProps {
  character: ICharacter;
  onClick?: (characterId: string) => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation(["characters", "create-character"]);

  // Find role data
  const roleData = CHARACTER_ROLES_CONSTANT.find((r) => r.value === character.role);

  // Find status data
  const statusData = CHARACTER_STATUS_CONSTANT.find((s) => s.value === character.status);

  // Find gender data
  const genderData = GENDERS_CONSTANT.find((g) => g.value === character.gender);
  const GenderIcon = genderData?.icon;

  return (
    <Card
      className="relative cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
      onClick={() => onClick?.(character.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-5 space-y-4">
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

          {/* Name, Age, Gender, and Role */}
          <div className="flex-1 min-w-0 space-y-2">
            <CardTitle className="text-base font-bold line-clamp-2">
              {character.name}
            </CardTitle>

            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {character.age && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {character.age}
                  </span>
                </div>
              )}
              {character.gender && GenderIcon && (
                <div className="flex items-center gap-1.5">
                  <GenderIcon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground capitalize">
                    {t(`create-character:gender.${character.gender}`)}
                  </span>
                </div>
              )}
            </div>

            {/* Role and Status Badges */}
            <div className="flex gap-2 flex-wrap">
              {roleData && (
                <EntityTagBadge
                  config={roleData}
                  label={t(`create-character:role.${character.role}`)}
                />
              )}
              {statusData && (
                <EntityTagBadge
                  config={statusData}
                  label={t(`create-character:status.${character.status}`)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {character.description}
        </p>
      </CardContent>

      {/* Overlay covering entire card */}
      <div
        className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-lg font-semibold">
          Ver detalhes
        </span>
      </div>
    </Card>
  );
}
