import { useState } from "react";

import { Calendar, Plus, Search, Users } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICharacter, ICharacterFormData } from "@/types/character-types";

import { getRoleLabel } from "./utils/get-role-label";

interface IRoleStats {
  total: number;
  protagonista: number;
  antagonista: number;
  secundario: number;
  vilao: number;
}

interface CharactersViewProps {
  bookId: string;
  characters: ICharacter[];
  filteredCharacters: ICharacter[];
  organizations: string[];
  locations: string[];
  roleStats: IRoleStats;
  searchTerm: string;
  selectedOrg: string;
  selectedLocation: string;
  onSearchTermChange: (term: string) => void;
  onSelectedOrgChange: (org: string) => void;
  onSelectedLocationChange: (location: string) => void;
  onCharacterCreated: (character: ICharacter) => void;
  onCharacterClick: (characterId: string) => void;
}

export function CharactersView({
  characters,
  filteredCharacters,
  organizations,
  locations,
  roleStats,
  searchTerm,
  selectedOrg,
  selectedLocation,
  onSearchTermChange,
  onSelectedOrgChange,
  onSelectedLocationChange,
  onCharacterCreated,
  onCharacterClick,
}: CharactersViewProps) {
  const { t } = useTranslation(["characters", "create-character"]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <Badge variant="outline">
                {roleStats.total} {t("characters:page.total_badge")}
              </Badge>
              <Badge className="bg-accent/10 text-accent">
                {roleStats.protagonista}{" "}
                {t("characters:page.protagonist_badge")}
              </Badge>
              <Badge className="bg-destructive/10 text-destructive">
                {roleStats.antagonista} {t("characters:page.antagonist_badge")}
              </Badge>
              <Badge className="bg-primary/10 text-primary">
                {roleStats.secundario} {t("characters:page.secondary_badge")}
              </Badge>
              <Badge className="bg-muted/50 text-muted-foreground">
                {roleStats.vilao} {t("characters:page.villain_badge")}
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

      {/* Filters */}
      {characters.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("characters:page.search_placeholder")}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedOrg} onValueChange={onSelectedOrgChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue
                placeholder={t("characters:page.organization_filter")}
              />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectItem value="all">
                {t("characters:page.all_organizations")}
              </SelectItem>
              {organizations.slice(1).map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedLocation}
            onValueChange={onSelectedLocationChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("characters:page.location_filter")} />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectItem value="all">
                {t("characters:page.all_locations")}
              </SelectItem>
              {locations.slice(1).map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              className="card-magical animate-stagger cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all w-[500px]"
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
          icon={Users}
          title={
            characters.length === 0
              ? t("characters:empty_state.no_characters")
              : t("characters:empty_state.no_results")
          }
          description={
            characters.length === 0
              ? t("characters:empty_state.no_characters_description")
              : t("characters:empty_state.no_results_description")
          }
        />
      )}
    </div>
  );
}
