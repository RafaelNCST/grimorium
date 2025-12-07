import React from "react";

import { Dna } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayText,
  DisplayTextarea,
  DisplayStringList,
  DisplaySelectGrid,
} from "@/components/displays";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { getRaceCommunications } from "@/components/modals/create-race-modal/constants/communications";
import { getRaceDiets } from "@/components/modals/create-race-modal/constants/diets";
import { getRaceHabits } from "@/components/modals/create-race-modal/constants/habits";
import { getRaceMoralTendencies } from "@/components/modals/create-race-modal/constants/moral-tendencies";
import { getRacePhysicalCapacities } from "@/components/modals/create-race-modal/constants/physical-capacities";
import { getRaceReproductiveCycles } from "@/components/modals/create-race-modal/constants/reproductive-cycles";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { IRace } from "@/pages/dashboard/tabs/races/types/race-types";

import { getDomainDisplayData } from "../../tabs/races/helpers/domain-filter-config";

interface RaceSuperViewProps {
  race: IRace;
  displayData: IRace;
  bookId: string;
  onBack: () => void;
}

// Helper component for empty state
const EmptyFieldState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("race-detail:empty_states.no_data")}</p>
  </div>
);

export function RaceSuperView({
  race,
  displayData,
  bookId,
  onBack,
}: RaceSuperViewProps) {
  const { t } = useTranslation(["race-detail", "create-race"] as any);

  // Mock field visibility - all visible in read-only mode
  const fieldVisibility: Record<string, boolean> = {};
  const isEditing = false;
  const onFieldVisibilityToggle = () => {};

  // ==================
  // BASIC FIELDS
  // ==================
  const basicFields = (
    <div className="space-y-6">
      {/* Image Display */}
      <div className="flex justify-center -mx-6">
        <div className="w-full max-w-[587px] px-6">
          {race.image ? (
            <div className="relative w-full h-80 rounded-lg overflow-hidden border">
              <img
                src={race.image}
                alt={race.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
              <FormImageDisplay
                icon={Dna}
                height="h-full"
                width="w-full"
                shape="square"
                className="rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Race Info - Card style with fields stacked */}
      <div className="space-y-3">
        {/* Name */}
        <div>
          <h2 className="text-3xl font-bold">{race.name}</h2>
        </div>

        {/* Scientific Name */}
        {race.scientificName && (
          <div>
            <p className="text-sm italic text-muted-foreground mt-1">
              {race.scientificName}
            </p>
          </div>
        )}

        {/* Domains */}
        {race.domain && race.domain.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {race.domain.map((domainValue) => {
              const { icon: DomainIcon, colorConfig } =
                getDomainDisplayData(domainValue, t);

              if (!DomainIcon || !colorConfig) return null;

              return (
                <Badge
                  key={domainValue}
                  className={`flex items-center gap-1 ${colorConfig.inactiveClasses} px-2 py-0.5 pointer-events-none`}
                >
                  <DomainIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{domainValue}</span>
                </Badge>
              );
            })}
          </div>
        )}

        {/* Summary */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {race.summary || (
              <span className="italic text-muted-foreground/60">
                {t("race-detail:empty_states.no_data")}
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
      {/* CULTURA Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("race-detail:sections.culture")}
        </h4>

        {/* Alternative Names */}
        <FieldWithVisibilityToggle
          fieldName="alternativeNames"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("race-detail:fields.alternative_names")}
            items={race.alternativeNames}
          />
        </FieldWithVisibilityToggle>

        {/* Cultural Notes */}
        <FieldWithVisibilityToggle
          fieldName="culturalNotes"
          label={t("race-detail:fields.cultural_notes")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={race.culturalNotes} />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* APARÊNCIA Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("race-detail:sections.appearance")}
        </h4>

        {/* General Appearance */}
        <FieldWithVisibilityToggle
          fieldName="generalAppearance"
          label={t("race-detail:fields.general_appearance")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={race.generalAppearance} />
        </FieldWithVisibilityToggle>

        {/* Life Expectancy, Height, Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldWithVisibilityToggle
            fieldName="lifeExpectancy"
            label={t("race-detail:fields.life_expectancy")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            <DisplayText value={race.lifeExpectancy} />
          </FieldWithVisibilityToggle>

          <FieldWithVisibilityToggle
            fieldName="averageHeight"
            label={t("race-detail:fields.average_height")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            <DisplayText value={race.averageHeight} />
          </FieldWithVisibilityToggle>

          <FieldWithVisibilityToggle
            fieldName="averageWeight"
            label={t("race-detail:fields.average_weight")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            <DisplayText value={race.averageWeight} />
          </FieldWithVisibilityToggle>
        </div>

        {/* Special Physical Characteristics */}
        <FieldWithVisibilityToggle
          fieldName="specialPhysicalCharacteristics"
          label={t("race-detail:fields.special_physical_characteristics")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={race.specialPhysicalCharacteristics} />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* COMPORTAMENTOS Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("race-detail:sections.behaviors")}
        </h4>

        {/* Habits */}
        <FieldWithVisibilityToggle
          fieldName="habits"
          label={t("race-detail:fields.habits")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid value={race.habits} options={getRaceHabits(t)} />
        </FieldWithVisibilityToggle>

        {/* Reproductive Cycle */}
        <FieldWithVisibilityToggle
          fieldName="reproductiveCycle"
          label={t("race-detail:fields.reproductive_cycle")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid
            value={race.reproductiveCycle}
            options={getRaceReproductiveCycles(t)}
          />
        </FieldWithVisibilityToggle>

        {/* Diet */}
        <FieldWithVisibilityToggle
          fieldName="diet"
          label={t("race-detail:fields.diet")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid value={race.diet} options={getRaceDiets(t)} />
        </FieldWithVisibilityToggle>

        {/* Communication */}
        <FieldWithVisibilityToggle
          fieldName="communication"
          label={t("race-detail:fields.communication")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {race.communication && race.communication.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {race.communication.map((commValue) => {
                const commOption = getRaceCommunications(t).find(
                  (c) => c.value === commValue
                );
                if (!commOption) return null;

                const displayOption = {
                  value: commOption.value,
                  label: commOption.label,
                  description: commOption.description,
                  icon: commOption.icon,
                  backgroundColor: commOption.color.includes("blue")
                    ? "blue-500/10"
                    : commOption.color.includes("purple")
                      ? "purple-500/10"
                      : commOption.color.includes("green")
                        ? "green-500/10"
                        : commOption.color.includes("amber")
                          ? "amber-500/10"
                          : commOption.color.includes("violet")
                            ? "violet-500/10"
                            : "gray-500/10",
                  borderColor: commOption.color.includes("blue")
                    ? "blue-500/30"
                    : commOption.color.includes("purple")
                      ? "purple-500/30"
                      : commOption.color.includes("green")
                        ? "green-500/30"
                        : commOption.color.includes("amber")
                          ? "amber-500/30"
                          : commOption.color.includes("violet")
                            ? "violet-500/30"
                            : "gray-500/30",
                };

                return (
                  <DisplaySelectGrid
                    key={commValue}
                    value={commValue}
                    options={[displayOption]}
                  />
                );
              })}
            </div>
          ) : (
            <DisplaySelectGrid
              value={null}
              options={getRaceCommunications(t).map((c) => ({
                value: c.value,
                label: c.label,
                description: c.description,
                icon: c.icon,
                backgroundColor: c.color.includes("blue")
                  ? "blue-500/10"
                  : c.color.includes("purple")
                    ? "purple-500/10"
                    : c.color.includes("green")
                      ? "green-500/10"
                      : c.color.includes("amber")
                        ? "amber-500/10"
                        : c.color.includes("violet")
                          ? "violet-500/10"
                          : "gray-500/10",
                borderColor: c.color.includes("blue")
                  ? "blue-500/30"
                  : c.color.includes("purple")
                    ? "purple-500/30"
                    : c.color.includes("green")
                      ? "green-500/30"
                      : c.color.includes("amber")
                        ? "amber-500/30"
                        : c.color.includes("violet")
                          ? "violet-500/30"
                          : "gray-500/30",
              }))}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Moral Tendency */}
        <FieldWithVisibilityToggle
          fieldName="moralTendency"
          label={t("race-detail:fields.moral_tendency")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid
            value={race.moralTendency}
            options={getRaceMoralTendencies(t)}
          />
        </FieldWithVisibilityToggle>

        {/* Social Organization */}
        <FieldWithVisibilityToggle
          fieldName="socialOrganization"
          label={t("race-detail:fields.social_organization")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={race.socialOrganization} />
        </FieldWithVisibilityToggle>

        {/* Habitat */}
        <FieldWithVisibilityToggle
          fieldName="habitat"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("race-detail:fields.habitat")}
            items={race.habitat}
          />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* PODER Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("race-detail:sections.power")}
        </h4>

        {/* Physical Capacity */}
        <FieldWithVisibilityToggle
          fieldName="physicalCapacity"
          label={t("race-detail:fields.physical_capacity")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid
            value={race.physicalCapacity}
            options={getRacePhysicalCapacities(t)}
          />
        </FieldWithVisibilityToggle>

        {/* Special Characteristics */}
        <FieldWithVisibilityToggle
          fieldName="specialCharacteristics"
          label={t("race-detail:fields.special_characteristics")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={race.specialCharacteristics} />
        </FieldWithVisibilityToggle>

        {/* Weaknesses */}
        <FieldWithVisibilityToggle
          fieldName="weaknesses"
          label={t("race-detail:fields.weaknesses")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={race.weaknesses} />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* NARRATIVA Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("race-detail:sections.narrative")}
        </h4>

        {/* Story Motivation */}
        <FieldWithVisibilityToggle
          fieldName="storyMotivation"
          label={t("race-detail:fields.story_motivation")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={race.storyMotivation} />
        </FieldWithVisibilityToggle>

        {/* Inspirations */}
        <FieldWithVisibilityToggle
          fieldName="inspirations"
          label={t("race-detail:fields.inspirations")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={race.inspirations} />
        </FieldWithVisibilityToggle>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <EntityDetailLayout
          // Header
          onBack={onBack}
          backLabel={t("race-detail:buttons.back")}
          // Mode
          isEditMode={false}
          // Content
          basicFields={basicFields}
          advancedFields={advancedFields}
          advancedSectionTitle={t("race-detail:sections.advanced_info")}
          advancedSectionOpen
        />
      </div>
    </div>
  );
}
