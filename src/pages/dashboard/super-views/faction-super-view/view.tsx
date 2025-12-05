import React from "react";

import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayText,
  DisplayTextarea,
  DisplayStringList,
  DisplayEntityList,
  DisplaySelectGrid,
  type DisplayEntityItem,
} from "@/components/displays";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { FACTION_INFLUENCE_OPTIONS } from "@/components/modals/create-faction-modal/constants/faction-influence";
import { FACTION_REPUTATION_OPTIONS } from "@/components/modals/create-faction-modal/constants/faction-reputation";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { IFaction } from "@/types/faction-types";

import { AlignmentMatrix } from "../../tabs/factions/faction-detail/components/alignment-matrix";

interface FactionSuperViewProps {
  faction: IFaction;
  displayData: IFaction;
  bookId: string;
  onBack: () => void;
}

// Helper component for empty state
const EmptyFieldState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("faction-detail:empty_states.no_data")}</p>
  </div>
);

export function FactionSuperView({
  faction,
  displayData,
  bookId,
  onBack,
}: FactionSuperViewProps) {
  const { t } = useTranslation(["faction-detail", "create-faction"] as any);

  // Mock field visibility - all visible in read-only mode
  const fieldVisibility: Record<string, boolean> = {};
  const isEditing = false;
  const onFieldVisibilityToggle = () => {};

  // Get current status and type
  const currentStatus = FACTION_STATUS_CONSTANT.find(
    (s) => s.value === faction.status
  );
  const currentType = FACTION_TYPES_CONSTANT.find(
    (t) => t.value === faction.factionType
  );

  // ==================
  // BASIC FIELDS
  // ==================
  const basicFields = (
    <div className="space-y-6">
      {/* Image Display */}
      <div className="flex justify-center -mx-6">
        <div className="w-full max-w-[587px] px-6">
          {faction.image ? (
            <div className="relative w-full h-96 rounded-lg overflow-hidden border">
              <img
                src={faction.image}
                alt={faction.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <FormImageDisplay
                icon={Shield}
                height="h-full"
                width="w-full"
                shape="rounded"
                className="rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Faction Info - Card style with fields stacked */}
      <div className="space-y-3">
        {/* Name */}
        <div>
          <h2 className="text-3xl font-bold">{faction.name}</h2>
        </div>

        {/* Status and Type badges */}
        {(currentStatus || currentType) && (
          <div className="flex flex-wrap gap-2">
            {currentStatus && (
              <EntityTagBadge
                config={currentStatus}
                label={t(`create-faction:status.${faction.status}`)}
              />
            )}
            {currentType && (
              <EntityTagBadge
                config={currentType}
                label={t(`create-faction:faction_type.${faction.factionType}`)}
              />
            )}
          </div>
        )}

        {/* Summary */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {faction.summary || (
              <span className="italic text-muted-foreground/60">
                {t("faction-detail:empty_states.no_data")}
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
      {/* INTERNAL STRUCTURE Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("faction-detail:sections.internal_structure")}
        </h4>

        {/* Government Form */}
        <FieldWithVisibilityToggle
          fieldName="governmentForm"
          label={t("faction-detail:fields.government_form")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={faction.governmentForm} />
        </FieldWithVisibilityToggle>

        {/* Rules and Laws */}
        <FieldWithVisibilityToggle
          fieldName="rulesAndLaws"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("faction-detail:fields.rules_and_laws")}
            items={faction.rulesAndLaws}
          />
        </FieldWithVisibilityToggle>

        {/* Main Resources */}
        <FieldWithVisibilityToggle
          fieldName="mainResources"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("faction-detail:fields.main_resources")}
            items={faction.mainResources}
          />
        </FieldWithVisibilityToggle>

        {/* Economy */}
        <FieldWithVisibilityToggle
          fieldName="economy"
          label={t("faction-detail:fields.economy")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={faction.economy} />
        </FieldWithVisibilityToggle>

        {/* Symbols and Secrets */}
        <FieldWithVisibilityToggle
          fieldName="symbolsAndSecrets"
          label={t("faction-detail:fields.symbols_and_secrets")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={faction.symbolsAndSecrets} />
        </FieldWithVisibilityToggle>

        {/* Currencies */}
        <FieldWithVisibilityToggle
          fieldName="currencies"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("faction-detail:fields.currencies")}
            items={faction.currencies}
          />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* TERRITORY Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("faction-detail:sections.territory")}
        </h4>

        {/* Dominated Areas */}
        <FieldWithVisibilityToggle
          fieldName="dominatedAreas"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayEntityList
            label={t("faction-detail:fields.dominated_areas")}
            entities={(() => {
              const regions = faction.dominatedAreas || [];
              return regions.map((regionId: string) => ({
                id: regionId,
                name: regionId,
              })) as DisplayEntityItem[];
            })()}
          />
        </FieldWithVisibilityToggle>

        {/* Main Base */}
        <FieldWithVisibilityToggle
          fieldName="mainBase"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayEntityList
            label={t("faction-detail:fields.main_base")}
            entities={(() => {
              const regions = faction.mainBase || [];
              return regions.map((regionId: string) => ({
                id: regionId,
                name: regionId,
              })) as DisplayEntityItem[];
            })()}
          />
        </FieldWithVisibilityToggle>

        {/* Areas of Interest */}
        <FieldWithVisibilityToggle
          fieldName="areasOfInterest"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayEntityList
            label={t("faction-detail:fields.areas_of_interest")}
            entities={(() => {
              const regions = faction.areasOfInterest || [];
              return regions.map((regionId: string) => ({
                id: regionId,
                name: regionId,
              })) as DisplayEntityItem[];
            })()}
          />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* CULTURE Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("faction-detail:sections.culture")}
        </h4>

        {/* Faction Motto */}
        <FieldWithVisibilityToggle
          fieldName="factionMotto"
          label={t("faction-detail:fields.faction_motto")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {faction.factionMotto ? (
            <p className="text-sm italic whitespace-pre-wrap">
              &quot;{faction.factionMotto}&quot;
            </p>
          ) : (
            <DisplayTextarea value={undefined} />
          )}
        </FieldWithVisibilityToggle>

        {/* Traditions and Rituals */}
        <FieldWithVisibilityToggle
          fieldName="traditionsAndRituals"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("faction-detail:fields.traditions_and_rituals")}
            items={faction.traditionsAndRituals}
          />
        </FieldWithVisibilityToggle>

        {/* Beliefs and Values */}
        <FieldWithVisibilityToggle
          fieldName="beliefsAndValues"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("faction-detail:fields.beliefs_and_values")}
            items={faction.beliefsAndValues}
          />
        </FieldWithVisibilityToggle>

        {/* Languages Used */}
        <FieldWithVisibilityToggle
          fieldName="languagesUsed"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("faction-detail:fields.languages_used")}
            items={faction.languagesUsed}
          />
        </FieldWithVisibilityToggle>

        {/* Uniform and Aesthetics */}
        <FieldWithVisibilityToggle
          fieldName="uniformAndAesthetics"
          label={t("faction-detail:fields.uniform_and_aesthetics")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={faction.uniformAndAesthetics} />
        </FieldWithVisibilityToggle>

        {/* Races */}
        <FieldWithVisibilityToggle
          fieldName="races"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayEntityList
            label={t("faction-detail:fields.races")}
            entities={(() => {
              const raceIds = faction.races || [];
              return raceIds.map((raceId: string) => ({
                id: raceId,
                name: raceId,
              })) as DisplayEntityItem[];
            })()}
          />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* HISTORY Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("faction-detail:sections.history")}
        </h4>

        {/* Foundation Date */}
        <FieldWithVisibilityToggle
          fieldName="foundationDate"
          label={t("faction-detail:fields.foundation_date")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayText value={faction.foundationDate} />
        </FieldWithVisibilityToggle>

        {/* Foundation History Summary */}
        <FieldWithVisibilityToggle
          fieldName="foundationHistorySummary"
          label={t("faction-detail:fields.foundation_history_summary")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={faction.foundationHistorySummary} />
        </FieldWithVisibilityToggle>

        {/* Founders */}
        <FieldWithVisibilityToggle
          fieldName="founders"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayEntityList
            label={t("faction-detail:fields.founders")}
            entities={(() => {
              const founderIds = faction.founders || [];
              return founderIds.map((founderId: string) => ({
                id: founderId,
                name: founderId,
              })) as DisplayEntityItem[];
            })()}
          />
        </FieldWithVisibilityToggle>

        {/* Alignment */}
        <FieldWithVisibilityToggle
          fieldName="alignment"
          label={t("faction-detail:fields.alignment")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <AlignmentMatrix
            value={faction.alignment}
            onChange={() => {}}
            isEditable={false}
          />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* RELATIONSHIPS Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("faction-detail:sections.relationships")}
        </h4>

        {/* Influence */}
        <FieldWithVisibilityToggle
          fieldName="influence"
          label={t("faction-detail:fields.influence")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid
            value={faction.influence}
            options={FACTION_INFLUENCE_OPTIONS.map((opt) => ({
              ...opt,
              label: t(`create-faction:${opt.label}`),
              description: opt.description
                ? t(`create-faction:${opt.description}`)
                : undefined,
            }))}
            emptyTitle={t("faction-detail:empty_states.no_influence")}
            emptyDescription={t(
              "faction-detail:empty_states.no_influence_hint"
            )}
          />
        </FieldWithVisibilityToggle>

        {/* Public Reputation */}
        <FieldWithVisibilityToggle
          fieldName="publicReputation"
          label={t("faction-detail:fields.public_reputation")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid
            value={faction.publicReputation}
            options={FACTION_REPUTATION_OPTIONS.map((opt) => ({
              ...opt,
              label: t(`create-faction:${opt.label}`),
              description: opt.description
                ? t(`create-faction:${opt.description}`)
                : undefined,
            }))}
            emptyTitle={t("faction-detail:empty_states.no_reputation")}
            emptyDescription={t(
              "faction-detail:empty_states.no_reputation_hint"
            )}
          />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* NARRATIVE Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("faction-detail:sections.narrative")}
        </h4>

        {/* Organization Objectives */}
        <FieldWithVisibilityToggle
          fieldName="organizationObjectives"
          label={t("faction-detail:fields.organization_objectives")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={faction.organizationObjectives} />
        </FieldWithVisibilityToggle>

        {/* Narrative Importance */}
        <FieldWithVisibilityToggle
          fieldName="narrativeImportance"
          label={t("faction-detail:fields.narrative_importance")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={faction.narrativeImportance} />
        </FieldWithVisibilityToggle>

        {/* Inspirations */}
        <FieldWithVisibilityToggle
          fieldName="inspirations"
          label={t("faction-detail:fields.inspirations")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={faction.inspirations} />
        </FieldWithVisibilityToggle>

        {/* Power Display */}
        <FieldWithVisibilityToggle
          fieldName="power"
          label={t("faction-detail:fields.power")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <PowerDisplay
            militaryPower={faction.militaryPower || 5}
            politicalPower={faction.politicalPower || 5}
            culturalPower={faction.culturalPower || 5}
            economicPower={faction.economicPower || 5}
          />
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
          backLabel={t("faction-detail:buttons.back")}
          // Mode
          isEditMode={false}
          // Content
          basicFields={basicFields}
          advancedFields={advancedFields}
          advancedSectionTitle={t("faction-detail:sections.advanced_info")}
          advancedSectionOpen={true}
        />
      </div>
    </div>
  );
}

// ==================
// HELPER COMPONENT: PowerDisplay (View Mode)
// ==================
interface PowerDisplayProps {
  militaryPower: number;
  politicalPower: number;
  culturalPower: number;
  economicPower: number;
}

function PowerDisplay({
  militaryPower,
  politicalPower,
  culturalPower,
  economicPower,
}: PowerDisplayProps) {
  const { t } = useTranslation("create-faction");

  const powers = [
    { label: t("modal.military_power"), value: militaryPower },
    { label: t("modal.political_power"), value: politicalPower },
    { label: t("modal.cultural_power"), value: culturalPower },
    { label: t("modal.economic_power"), value: economicPower },
  ];

  return (
    <div className="space-y-4">
      {powers.map((power) => {
        const isMaxPower = power.value === 10;
        return (
          <div key={power.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{power.label}</Label>
              <span
                className={`text-lg font-bold w-8 text-center transition-colors ${
                  isMaxPower ? "text-amber-500" : "text-primary"
                }`}
              >
                {power.value}
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => {
                const isFilled = i < power.value;
                return (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-sm ${
                      isFilled
                        ? isMaxPower
                          ? "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 bg-[length:200%_100%] animate-[flowingEnergy_2s_ease-in-out_infinite]"
                          : "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
