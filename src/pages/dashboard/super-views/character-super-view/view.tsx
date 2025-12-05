import React, { useState } from "react";

import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayText,
  DisplayTextarea,
  DisplayStringList,
  DisplaySelectGrid,
  DisplaySimpleGrid,
  DisplayEntityList,
} from "@/components/displays";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CHARACTER_ARCHETYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-archetypes";
import { CHARACTER_ROLES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-roles";
import { CHARACTER_STATUS_CONSTANT } from "@/components/modals/create-character-modal/constants/character-status";
import { GENDERS_CONSTANT } from "@/components/modals/create-character-modal/constants/genders";
import { PHYSICAL_TYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/physical-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Separator } from "@/components/ui/separator";
import { AlignmentMatrix } from "@/pages/dashboard/tabs/characters/character-detail/components/alignment-matrix";
import { FamilySection } from "@/pages/dashboard/tabs/characters/character-detail/components/family-section";
import { RelationshipsSection } from "@/pages/dashboard/tabs/characters/character-detail/components/relationships-section";
import type { ICharacter } from "@/types/character-types";

interface CharacterSuperViewProps {
  character: ICharacter;
  displayData: ICharacter;
  bookId: string;
  onBack: () => void;
}

export function CharacterSuperView({
  character,
  displayData,
  bookId,
  onBack,
}: CharacterSuperViewProps) {
  const { t } = useTranslation(["character-detail", "create-character"] as any);

  // Mock field visibility - all visible in read-only mode
  const fieldVisibility: Record<string, boolean> = {};
  const isEditing = false;
  const onFieldVisibilityToggle = () => {};

  // Local state for collapsible sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Get current role, gender, status data
  const currentRole = CHARACTER_ROLES_CONSTANT.find(
    (r) => r.value === character.role
  );
  const currentGender = GENDERS_CONSTANT.find(
    (g) => g.value === character.gender
  );
  const currentStatus = CHARACTER_STATUS_CONSTANT.find(
    (s) => s.value === character.status
  );

  // Mock data for entities (in a real app, these would be fetched from the database)
  const mockCharacters: ICharacter[] = [];
  const regions: Array<{ id: string; name: string; image?: string }> = [];
  const races: Array<{ id: string; name: string; image?: string }> = [];

  // Convert archetype constants to display format
  const archetypeOptions = CHARACTER_ARCHETYPES_CONSTANT.map((archetype) => ({
    value: archetype.value,
    label: t(`create-character:${archetype.translationKey}`),
    description: t(`create-character:${archetype.descriptionKey}`),
    icon: archetype.icon,
    backgroundColor: "purple-500/10",
    borderColor: "purple-500/20",
  }));

  // Convert physical type constants to display format
  const physicalTypeOptions = PHYSICAL_TYPES_CONSTANT.map((type) => ({
    value: type.value,
    label: t(`create-character:${type.translationKey}`),
    icon: type.icon,
    backgroundColor:
      type.value === "malnourished"
        ? "orange-500/10"
        : type.value === "thin"
          ? "sky-500/10"
          : type.value === "athletic"
            ? "emerald-500/10"
            : type.value === "robust"
              ? "blue-500/10"
              : type.value === "corpulent"
                ? "purple-500/10"
                : "red-500/10",
    borderColor:
      type.value === "malnourished"
        ? "orange-500/20"
        : type.value === "thin"
          ? "sky-500/20"
          : type.value === "athletic"
            ? "emerald-500/20"
            : type.value === "robust"
              ? "blue-500/20"
              : type.value === "corpulent"
                ? "purple-500/20"
                : "red-500/20",
  }));

  // ==================
  // BASIC FIELDS
  // ==================
  const basicFields = (
    <div className="space-y-6">
      {/* Image Display */}
      <div className="flex justify-center -mx-6">
        <div className="w-full max-w-[587px] px-6">
          {character.image ? (
            <div className="flex justify-center">
              <Avatar className="w-48 h-48">
                <AvatarImage src={character.image} className="object-cover" />
                <AvatarFallback className="text-4xl">
                  {character.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="flex justify-center">
              <FormImageDisplay
                icon={User}
                height="h-48"
                width="w-48"
                shape="circle"
              />
            </div>
          )}
        </div>
      </div>

      {/* Character Info - Card style with fields stacked */}
      <div className="space-y-3">
        {/* Name */}
        <div>
          <h2 className="text-3xl font-bold">{character.name}</h2>
        </div>

        {/* Age and Gender */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{character.age}</span>
          {currentGender && (
            <div className="flex items-center gap-2">
              {(() => {
                const GenderIcon = currentGender.icon;
                return <GenderIcon className="w-4 h-4 text-primary" />;
              })()}
              <span>{t(`create-character:${currentGender.translationKey}`)}</span>
            </div>
          )}
        </div>

        {/* Role, Status */}
        {(currentRole || currentStatus) && (
          <div className="flex flex-wrap gap-1.5">
            {currentRole && (
              <EntityTagBadge
                config={currentRole}
                label={t(`create-character:${currentRole.translationKey}`)}
              />
            )}
            {currentStatus && (
              <EntityTagBadge
                config={currentStatus}
                label={t(`create-character:${currentStatus.translationKey}`)}
              />
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {character.description || (
              <span className="italic text-muted-foreground/60">
                {t("character-detail:empty_states.no_data")}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );

  // ==================
  // ADVANCED FIELDS
  // ==================
  const advancedFields = (
    <div className="space-y-6">
      {/* APARÊNCIA Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.appearance")}
        </h4>

        {/* Height and Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldWithVisibilityToggle
            fieldName="height"
            label={t("character-detail:fields.height")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            <DisplayText value={character.height} />
          </FieldWithVisibilityToggle>

          <FieldWithVisibilityToggle
            fieldName="weight"
            label={t("character-detail:fields.weight")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            <DisplayText value={character.weight} />
          </FieldWithVisibilityToggle>
        </div>

        {/* Skin Tone */}
        <FieldWithVisibilityToggle
          fieldName="skinTone"
          label={t("character-detail:fields.skin_tone")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayText value={character.skinTone} />
        </FieldWithVisibilityToggle>

        {/* Hair */}
        <FieldWithVisibilityToggle
          fieldName="hair"
          label={t("character-detail:fields.hair")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayText value={character.hair} />
        </FieldWithVisibilityToggle>

        {/* Eyes */}
        <FieldWithVisibilityToggle
          fieldName="eyes"
          label={t("character-detail:fields.eyes")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayText value={character.eyes} />
        </FieldWithVisibilityToggle>

        {/* Face */}
        <FieldWithVisibilityToggle
          fieldName="face"
          label={t("character-detail:fields.face")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayText value={character.face} />
        </FieldWithVisibilityToggle>

        {/* Species and Race */}
        <FieldWithVisibilityToggle
          fieldName="speciesAndRace"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayEntityList
            label={t("create-character:modal.species_and_race")}
            entities={
              character.speciesAndRace
                ?.map((raceId) => {
                  const race = races.find((r) => r.id === raceId);
                  return race
                    ? { id: race.id, name: race.name, image: race.image }
                    : null;
                })
                .filter(Boolean) as Array<{
                id: string;
                name: string;
                image?: string;
              }>
            }
            open={openSections.speciesAndRace}
            onOpenChange={() => toggleSection("speciesAndRace")}
          />
        </FieldWithVisibilityToggle>

        {/* Physical Type */}
        <FieldWithVisibilityToggle
          fieldName="physicalType"
          label={t("character-detail:fields.physical_type")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySimpleGrid
            value={character.physicalType}
            options={physicalTypeOptions}
          />
        </FieldWithVisibilityToggle>

        {/* Distinguishing Features */}
        <FieldWithVisibilityToggle
          fieldName="distinguishingFeatures"
          label={t("character-detail:fields.distinguishing_features")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={character.distinguishingFeatures} />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* COMPORTAMENTO Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.behavior")}
        </h4>

        {/* Archetype */}
        <FieldWithVisibilityToggle
          fieldName="archetype"
          label={t("character-detail:fields.archetype")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid
            value={character.archetype}
            options={archetypeOptions}
          />
        </FieldWithVisibilityToggle>

        {/* Alignment */}
        <FieldWithVisibilityToggle
          fieldName="alignment"
          label={t("character-detail:fields.alignment")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <AlignmentMatrix
            value={character.alignment}
            onChange={() => {}}
            isEditable={false}
          />
        </FieldWithVisibilityToggle>

        {/* Favorite Food */}
        <FieldWithVisibilityToggle
          fieldName="favoriteFood"
          label={t("character-detail:fields.favorite_food")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayText value={character.favoriteFood} />
        </FieldWithVisibilityToggle>

        {/* Favorite Music */}
        <FieldWithVisibilityToggle
          fieldName="favoriteMusic"
          label={t("character-detail:fields.favorite_music")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayText value={character.favoriteMusic} />
        </FieldWithVisibilityToggle>

        {/* Personality */}
        <FieldWithVisibilityToggle
          fieldName="personality"
          label={t("character-detail:fields.personality")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={character.personality} />
        </FieldWithVisibilityToggle>

        {/* Hobbies */}
        <FieldWithVisibilityToggle
          fieldName="hobbies"
          label={t("character-detail:fields.hobbies")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={character.hobbies} />
        </FieldWithVisibilityToggle>

        {/* Dreams and Goals */}
        <FieldWithVisibilityToggle
          fieldName="dreamsAndGoals"
          label={t("character-detail:fields.dreams_and_goals")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={character.dreamsAndGoals} />
        </FieldWithVisibilityToggle>

        {/* Fears and Traumas */}
        <FieldWithVisibilityToggle
          fieldName="fearsAndTraumas"
          label={t("character-detail:fields.fears_and_traumas")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={character.fearsAndTraumas} />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* HISTÓRIA Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.locations_orgs")}
        </h4>

        {/* Birth Place */}
        <FieldWithVisibilityToggle
          fieldName="birthPlace"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayEntityList
            label={t("character-detail:fields.birth_place")}
            entities={
              character.birthPlace
                ?.map((regionId) => {
                  const region = regions.find((r) => r.id === regionId);
                  return region
                    ? {
                        id: region.id,
                        name: region.name,
                        image: region.image,
                      }
                    : null;
                })
                .filter(Boolean) as Array<{
                id: string;
                name: string;
                image?: string;
              }>
            }
            open={openSections.birthPlace}
            onOpenChange={() => toggleSection("birthPlace")}
          />
        </FieldWithVisibilityToggle>

        {/* Nicknames */}
        <FieldWithVisibilityToggle
          fieldName="nicknames"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("character-detail:fields.nicknames")}
            items={character.nicknames}
            open={openSections.nicknames}
            onOpenChange={() => toggleSection("nicknames")}
          />
        </FieldWithVisibilityToggle>

        {/* Past */}
        <FieldWithVisibilityToggle
          fieldName="past"
          label={t("character-detail:fields.past")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={character.past} />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* RELACIONAMENTOS Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.relationships")}
        </h4>

        <RelationshipsSection
          relationships={character.relationships || []}
          allCharacters={mockCharacters}
          currentCharacterId={character.id}
          isEditMode={false}
          onRelationshipsChange={() => {}}
          isAddDialogOpen={false}
          onAddDialogOpenChange={() => {}}
        />
      </div>

      <Separator />

      {/* FAMÍLIA Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.family")}
        </h4>

        <FamilySection
          family={
            character.family || {
              grandparents: [],
              parents: [],
              spouses: [],
              unclesAunts: [],
              cousins: [],
              children: [],
              siblings: [],
              halfSiblings: [],
            }
          }
          allCharacters={mockCharacters}
          currentCharacterId={character.id}
          bookId={bookId}
          isEditMode={false}
          fieldVisibility={fieldVisibility}
          onFamilyChange={() => {}}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <EntityDetailLayout
          // Header
          onBack={onBack}
          backLabel={t("character-detail:header.back")}
          // Mode
          isEditMode={false}
          // Content
          basicFields={basicFields}
          advancedFields={advancedFields}
          advancedSectionTitle={t("character-detail:sections.advanced_info")}
          advancedSectionOpen={true}
        />
      </div>
    </div>
  );
}
