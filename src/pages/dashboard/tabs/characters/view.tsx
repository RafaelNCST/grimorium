import { useEffect, useRef, useState } from "react";

import { Calendar, Filter, Plus, Search, SearchX, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/empty-state";
import { CreateCharacterModal } from "@/components/modals/create-character-modal";
import { CHARACTER_ROLES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-roles";
import { GENDERS_CONSTANT } from "@/components/modals/create-character-modal/constants/genders";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ICharacter, ICharacterFormData } from "@/types/character-types";

import { getRoleLabel } from "./utils/get-role-label";

interface IRoleStats {
  total: number;
  protagonist: number;
  antagonist: number;
  secondary: number;
  villain: number;
  extra: number;
}

interface CharactersViewProps {
  bookId: string;
  characters: ICharacter[];
  filteredCharacters: ICharacter[];
  roleStats: IRoleStats;
  searchTerm: string;
  selectedRole: string | null;
  onSearchTermChange: (term: string) => void;
  onRoleFilterChange: (role: string | null) => void;
  onCharacterCreated: (character: ICharacter) => void;
  onCharacterClick: (characterId: string) => void;
}

export function CharactersView({
  characters,
  filteredCharacters,
  roleStats,
  searchTerm,
  selectedRole,
  onSearchTermChange,
  onRoleFilterChange,
  onCharacterCreated,
  onCharacterClick,
}: CharactersViewProps) {
  const { t } = useTranslation(["characters", "create-character"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasMountedRef = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Only animate on initial mount
  useEffect(() => {
    if (!hasMountedRef.current && filteredCharacters.length > 0) {
      hasMountedRef.current = true;
      setShouldAnimate(true);

      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 1000); // Animation duration + stagger delay for last item

      return () => clearTimeout(timer);
    }
  }, [filteredCharacters.length]);

  const handleCreateCharacter = (formData: ICharacterFormData) => {
    const newCharacter: ICharacter = {
      id: Date.now().toString(),
      ...formData,
      qualities: [],
      createdAt: new Date().toISOString(),
    };

    onCharacterCreated(newCharacter);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with compact role stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("characters:page.title")}</h2>
          <p className="text-muted-foreground">
            {t("characters:page.description")}
          </p>
          {characters.length > 0 && (
            <div className="flex items-center gap-4 mt-2">
              <Badge
                className={`cursor-pointer border transition-colors ${
                  selectedRole === null
                    ? "!bg-primary !text-white !border-primary"
                    : "bg-background text-foreground border-border hover:bg-primary hover:text-white hover:border-primary"
                }`}
                onClick={() => onRoleFilterChange(null)}
              >
                {roleStats.total} {t("characters:page.total_badge")}
              </Badge>
              <Badge
                className={`cursor-pointer border transition-colors ${
                  selectedRole === "protagonist"
                    ? "!bg-yellow-500 !text-black !border-yellow-500"
                    : "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500 hover:text-black dark:hover:text-black hover:border-yellow-500"
                }`}
                onClick={() => onRoleFilterChange(selectedRole === "protagonist" ? null : "protagonist")}
              >
                {roleStats.protagonist}{" "}
                {t("characters:page.protagonist_badge")}
              </Badge>
              <Badge
                className={`cursor-pointer border transition-colors ${
                  selectedRole === "antagonist"
                    ? "!bg-orange-500 !text-black !border-orange-500"
                    : "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-black dark:hover:text-black hover:border-orange-500"
                }`}
                onClick={() => onRoleFilterChange(selectedRole === "antagonist" ? null : "antagonist")}
              >
                {roleStats.antagonist} {t("characters:page.antagonist_badge")}
              </Badge>
              <Badge
                className={`cursor-pointer border transition-colors ${
                  selectedRole === "villain"
                    ? "!bg-red-500 !text-black !border-red-500"
                    : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-black dark:hover:text-black hover:border-red-500"
                }`}
                onClick={() => onRoleFilterChange(selectedRole === "villain" ? null : "villain")}
              >
                {roleStats.villain} {t("characters:page.villain_badge")}
              </Badge>
              <Badge
                className={`cursor-pointer border transition-colors ${
                  selectedRole === "secondary"
                    ? "!bg-blue-500 !text-black !border-blue-500"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-black dark:hover:text-black hover:border-blue-500"
                }`}
                onClick={() => onRoleFilterChange(selectedRole === "secondary" ? null : "secondary")}
              >
                {roleStats.secondary} {t("characters:page.secondary_badge")}
              </Badge>
              <Badge
                className={`cursor-pointer border transition-colors ${
                  selectedRole === "extra"
                    ? "!bg-gray-500 !text-black !border-gray-500"
                    : "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400 hover:bg-gray-500 hover:text-black dark:hover:text-black hover:border-gray-500"
                }`}
                onClick={() => onRoleFilterChange(selectedRole === "extra" ? null : "extra")}
              >
                {roleStats.extra} {t("characters:page.extra_badge")}
              </Badge>
            </div>
          )}
        </div>
        <Button
          variant="magical"
          size="lg"
          data-testid="create-character-trigger"
          className="animate-glow"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("characters:page.new_character")}
        </Button>
      </div>

      <CreateCharacterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateCharacter}
      />

      {/* Search Filter */}
      {characters.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("characters:page.search_placeholder")}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Characters List */}
      <div className="flex flex-wrap gap-4">
        {filteredCharacters.map((character) => {
          // Find role data
          const roleData = CHARACTER_ROLES_CONSTANT.find(
            (r) => r.value === character.role
          );
          const RoleIcon = roleData?.icon;

          // Find gender data
          const genderData = GENDERS_CONSTANT.find(
            (g) => g.value === character.gender
          );
          const GenderIcon = genderData?.icon;

          return (
            <Card
              key={character.id}
              className={`card-magical cursor-pointer w-[500px] transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_8px_32px_hsl(240_10%_3.9%_/_0.3),0_0_20px_hsl(263_70%_50%_/_0.3)] hover:bg-card/80 ${shouldAnimate ? "animate-stagger" : ""}`}
              onClick={() => onCharacterClick(character.id)}
            >
              <CardContent className="p-5 space-y-4">
                {/* Top Section: Image + Name/Age/Gender/Role */}
                <div className="flex gap-4">
                  {/* Character Image - Circular */}
                  <Avatar className="w-20 h-20 flex-shrink-0">
                    <AvatarImage
                      src={character.image}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-primary/10">
                      {character.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

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
                            {character.age} {t("characters:card.years")}
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

                    {/* Role Badge */}
                    <div className="flex">
                      <Badge
                        className={`${roleData?.bgColorClass} ${roleData?.colorClass} border px-3 py-1`}
                      >
                        {RoleIcon && (
                          <RoleIcon className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        <span className="text-xs font-medium">
                          {t(`create-character:role.${character.role}`)}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {character.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCharacters.length === 0 && (
        <EmptyState
          icon={
            characters.length === 0
              ? Users
              : selectedRole !== null
                ? Filter
                : SearchX
          }
          title={
            characters.length === 0
              ? t("characters:empty_state.no_characters")
              : selectedRole !== null
                ? t("characters:empty_state.no_role_characters", {
                    role: t(`create-character:role.${selectedRole}`).toLowerCase(),
                  })
                : t("characters:empty_state.no_results")
          }
          description={
            characters.length === 0
              ? t("characters:empty_state.no_characters_description")
              : selectedRole !== null
                ? t("characters:empty_state.no_role_characters_description")
                : t("characters:empty_state.no_results_description")
          }
        />
      )}
    </div>
  );
}
