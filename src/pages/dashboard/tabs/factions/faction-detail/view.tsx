import React from "react";

import { Shield, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayText,
  DisplayTextarea,
} from "@/components/displays";
import { FactionNavigationSidebar } from "@/components/faction-navigation-sidebar";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CreateFactionModal } from "@/components/modals/create-faction-modal";
import { FactionTypePicker } from "@/components/modals/create-faction-modal/components/faction-type-picker";
import { PowerSlider } from "@/components/modals/create-faction-modal/components/power-slider";
import { StatusPicker } from "@/components/modals/create-faction-modal/components/status-picker";
import { FACTION_INFLUENCE_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-influence";
import { FACTION_REPUTATION_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-reputation";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { DeleteEntityModal } from "@/components/modals/delete-entity-modal";
import { Badge } from "@/components/ui/badge";
import { InfoAlert } from "@/components/ui/info-alert";
import { Button } from "@/components/ui/button";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  EntityVersionManager,
  CreateVersionWithEntityDialog,
  VersionsPanel,
} from "@/components/version-system";
import {
  type IFactionVersion,
  type IFactionFormData,
  type IFaction,
} from "@/types/faction-types";

import { AlignmentMatrix } from "./components/alignment-matrix";
import { DiplomacySection } from "./components/diplomacy-section";
import { HierarchySection } from "./components/hierarchy-section";
import { VersionCard } from "./components/version-card";

interface IFieldVisibility {
  [key: string]: boolean;
}

interface FactionDetailViewProps {
  faction: IFaction;
  editData: IFaction;
  isEditing: boolean;
  versions: IFactionVersion[];
  currentVersion: IFactionVersion | null;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  mockCharacters: Array<{ id: string; name: string }>;
  mockRaces: Array<{ id: string; name: string }>;
  mockFactions: Array<{ id: string; name: string; image?: string }>;
  statuses: typeof FACTION_STATUS_CONSTANT;
  types: typeof FACTION_TYPES_CONSTANT;
  influences: typeof FACTION_INFLUENCE_CONSTANT;
  reputations: typeof FACTION_REPUTATION_CONSTANT;
  currentStatus: (typeof FACTION_STATUS_CONSTANT)[0] | undefined;
  currentType: (typeof FACTION_TYPES_CONSTANT)[0] | undefined;
  currentInfluence: (typeof FACTION_INFLUENCE_CONSTANT)[0] | undefined;
  currentReputation: (typeof FACTION_REPUTATION_CONSTANT)[0] | undefined;
  StatusIcon: React.ComponentType<{ className?: string }>;
  TypeIcon: React.ComponentType<{ className?: string }>;
  fieldVisibility: IFieldVisibility;
  advancedSectionOpen: boolean;
  bookId: string;
  errors: Record<string, string>;
  validateField: (field: string, value: unknown) => void;
  hasRequiredFieldsEmpty: boolean;
  missingFields: string[];
  onBack: () => void;
  onNavigationSidebarToggle: () => void;
  onNavigationSidebarClose: () => void;
  onFactionSelect: (factionId: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onConfirmDelete: () => void;
  onVersionChange: (versionId: string | null) => void;
  onVersionCreate: (versionData: {
    name: string;
    description: string;
    factionData: IFactionFormData;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
  onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: unknown) => void;
  onFieldVisibilityToggle: (field: string) => void;
  onAdvancedSectionToggle: () => void;
  hasChanges: boolean;
}

export function FactionDetailView({
  faction,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  mockCharacters,
  mockFactions,
  influences,
  reputations,
  currentStatus,
  currentType,
  currentInfluence,
  currentReputation,
  StatusIcon,
  TypeIcon,
  fieldVisibility,
  advancedSectionOpen,
  bookId,
  errors,
  validateField,
  hasRequiredFieldsEmpty,
  missingFields,
  onBack,
  onNavigationSidebarToggle,
  onNavigationSidebarClose,
  onFactionSelect,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onConfirmDelete,
  onVersionChange,
  onVersionCreate,
  onVersionDelete,
  onEditDataChange,
  onFieldVisibilityToggle,
  onAdvancedSectionToggle,
  hasChanges,
}: FactionDetailViewProps) {
  const { t } = useTranslation(["faction-detail", "create-faction"]);

  // Section visibility state
  const [sectionVisibility, setSectionVisibility] = React.useState<
    Record<string, boolean>
  >({
    diplomacy: true,
    hierarchy: true,
  });

  const handleSectionVisibilityToggle = (sectionName: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // ==================
  // BASIC FIELDS
  // ==================
  const basicFields = (
    <div className="space-y-6">
      {isEditing ? (
        <>
          {/* Faction Image Upload */}
          <div className="flex justify-center -mx-6">
            <div className="w-full max-w-[587px] px-6">
              <FormImageUpload
                value={imagePreview}
                onChange={(value) => onEditDataChange("image", value)}
                label={t("faction-detail:fields.image")}
                helperText="opcional"
                height="h-96"
                shape="rounded"
                imageFit="cover"
                placeholderIcon={Shield}
                id="faction-image-upload"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-primary">
              {t("faction-detail:fields.name")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="name"
              value={editData.name}
              onChange={(e) => onEditDataChange("name", e.target.value)}
              onBlur={(e) => validateField("name", e.target.value)}
              placeholder={t("create-faction:modal.name_placeholder")}
              maxLength={200}
              required
              className={errors.name ? "border-destructive" : ""}
            />
            <div className="flex justify-between text-xs">
              {errors.name ? (
                <span className="text-destructive">{errors.name}</span>
              ) : (
                <span />
              )}
              <span className="text-muted-foreground">{editData.name?.length || 0}/200</span>
            </div>
          </div>

          {/* Status Picker */}
          <StatusPicker
            value={editData.status || ""}
            onChange={(value) => onEditDataChange("status", value)}
          />

          {/* Faction Type Picker */}
          <FactionTypePicker
            value={editData.factionType || ""}
            onChange={(value) => onEditDataChange("factionType", value)}
          />

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium text-primary">
              {t("faction-detail:fields.summary")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="summary"
              value={editData.summary}
              onChange={(e) => onEditDataChange("summary", e.target.value)}
              onBlur={(e) => validateField("summary", e.target.value)}
              placeholder={t("create-faction:modal.summary_placeholder")}
              rows={8}
              maxLength={500}
              className={`resize-none ${errors.summary ? "border-destructive" : ""}`}
              required
            />
            <div className="flex justify-between text-xs">
              {errors.summary ? (
                <span className="text-destructive">{errors.summary}</span>
              ) : (
                <span />
              )}
              <span className="text-muted-foreground">{editData.summary?.length || 0}/500</span>
            </div>
          </div>
        </>
      ) : (
        // View Mode
        <>
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
                <FormImageDisplay
                  icon={Shield}
                  height="h-96"
                  width="w-full"
                  shape="rounded"
                />
              )}
            </div>
          </div>

          {/* Faction Info */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{faction.name}</h2>

            {/* Status and Type badges */}
            <div className="flex flex-wrap gap-2">
              {currentStatus && StatusIcon && (
                <EntityTagBadge
                  config={currentStatus}
                  label={t(`create-faction:status.${faction.status}`)}
                />
              )}
              {currentType && TypeIcon && (
                <EntityTagBadge
                  config={currentType}
                  label={t(`create-faction:faction_type.${faction.factionType}`)}
                />
              )}
            </div>

            <p className="text-foreground text-base whitespace-pre-wrap">
              {faction.summary}
            </p>
          </div>
        </>
      )}
    </div>
  );

  // ==================
  // ADVANCED FIELDS
  // ==================
  const advancedFields = (
    <>
      {/* Internal Structure Section */}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.governmentForm || ""}
                onChange={(e) => onEditDataChange("governmentForm", e.target.value)}
                placeholder={t("create-faction:modal.government_form_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.governmentForm?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.governmentForm} />
          )}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.economy || ""}
                onChange={(e) => onEditDataChange("economy", e.target.value)}
                placeholder={t("create-faction:modal.economy_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.economy?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.economy} />
          )}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.symbolsAndSecrets || ""}
                onChange={(e) => onEditDataChange("symbolsAndSecrets", e.target.value)}
                placeholder={t("create-faction:modal.symbols_and_secrets_placeholder")}
                rows={6}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.symbolsAndSecrets?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.symbolsAndSecrets} />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator className="my-6" />

      {/* Culture Section */}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.factionMotto || ""}
                onChange={(e) => onEditDataChange("factionMotto", e.target.value)}
                placeholder={t("create-faction:modal.faction_motto_placeholder")}
                rows={3}
                maxLength={300}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.factionMotto?.length || 0}/300</span>
              </div>
            </>
          ) : faction.factionMotto ? (
            <p className="text-sm italic whitespace-pre-wrap">
              &quot;{faction.factionMotto}&quot;
            </p>
          ) : (
            <DisplayTextarea value={undefined} />
          )}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.uniformAndAesthetics || ""}
                onChange={(e) => onEditDataChange("uniformAndAesthetics", e.target.value)}
                placeholder={t("create-faction:modal.uniform_and_aesthetics_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.uniformAndAesthetics?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.uniformAndAesthetics} />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator className="my-6" />

      {/* History Section */}
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
          {isEditing ? (
            <>
              <Input
                value={editData.foundationDate || ""}
                onChange={(e) => onEditDataChange("foundationDate", e.target.value)}
                placeholder={t("create-faction:modal.foundation_date_placeholder")}
                maxLength={200}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.foundationDate?.length || 0}/200</span>
              </div>
            </>
          ) : (
            <DisplayText value={faction.foundationDate} />
          )}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.foundationHistorySummary || ""}
                onChange={(e) => onEditDataChange("foundationHistorySummary", e.target.value)}
                placeholder={t("create-faction:modal.foundation_history_summary_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.foundationHistorySummary?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.foundationHistorySummary} />
          )}
        </FieldWithVisibilityToggle>

        {/* Alignment - in History section like create modal */}
        <FieldWithVisibilityToggle
          fieldName="alignment"
          label={t("faction-detail:fields.alignment")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <AlignmentMatrix
            value={isEditing ? editData.alignment : faction.alignment}
            onChange={(value) => onEditDataChange("alignment", value)}
            isEditable={isEditing}
          />
        </FieldWithVisibilityToggle>
      </div>

      <Separator className="my-6" />

      {/* Relationships Section */}
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
          {isEditing ? (
            <Select
              value={editData.influence || ""}
              onValueChange={(value) => onEditDataChange("influence", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("create-faction:modal.influence_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {influences.map((influence) => (
                  <SelectItem key={influence.value} value={influence.value}>
                    {t(`create-faction:${influence.translationKey}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : faction.influence ? (
            <Badge className={currentInfluence?.bgColor}>
              {t(`create-faction:influence.${faction.influence}`)}
            </Badge>
          ) : (
            <DisplayText value={undefined} />
          )}
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
          {isEditing ? (
            <Select
              value={editData.publicReputation || ""}
              onValueChange={(value) => onEditDataChange("publicReputation", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("create-faction:modal.reputation_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {reputations.map((reputation) => (
                  <SelectItem key={reputation.value} value={reputation.value}>
                    {t(`create-faction:${reputation.translationKey}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : faction.publicReputation ? (
            <Badge className={currentReputation?.bgColor}>
              {t(`create-faction:reputation.${faction.publicReputation}`)}
            </Badge>
          ) : (
            <DisplayText value={undefined} />
          )}
        </FieldWithVisibilityToggle>

        {/* External Influence */}
        <FieldWithVisibilityToggle
          fieldName="externalInfluence"
          label={t("faction-detail:fields.external_influence")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.externalInfluence || ""}
                onChange={(e) => onEditDataChange("externalInfluence", e.target.value)}
                placeholder={t("create-faction:modal.external_influence_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.externalInfluence?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.externalInfluence} />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator className="my-6" />

      {/* Narrative Section */}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.organizationObjectives || ""}
                onChange={(e) => onEditDataChange("organizationObjectives", e.target.value)}
                placeholder={t("create-faction:modal.organization_objectives_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.organizationObjectives?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.organizationObjectives} />
          )}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.narrativeImportance || ""}
                onChange={(e) => onEditDataChange("narrativeImportance", e.target.value)}
                placeholder={t("create-faction:modal.narrative_importance_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.narrativeImportance?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.narrativeImportance} />
          )}
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
          {isEditing ? (
            <>
              <Textarea
                value={editData.inspirations || ""}
                onChange={(e) => onEditDataChange("inspirations", e.target.value)}
                placeholder={t("create-faction:modal.inspirations_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.inspirations?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea value={faction.inspirations} />
          )}
        </FieldWithVisibilityToggle>

        {/* Power Sliders - in Narrative section like create modal */}
        <FieldWithVisibilityToggle
          fieldName="power"
          label={t("faction-detail:fields.power")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <div className="space-y-4">
              <InfoAlert>{t("create-faction:modal.power_description")}</InfoAlert>

              <PowerSlider
                label={t("create-faction:modal.military_power")}
                description={t("create-faction:modal.military_power_description")}
                value={editData.militaryPower || 5}
                onChange={(value) => onEditDataChange("militaryPower", value)}
              />

              <PowerSlider
                label={t("create-faction:modal.political_power")}
                description={t("create-faction:modal.political_power_description")}
                value={editData.politicalPower || 5}
                onChange={(value) => onEditDataChange("politicalPower", value)}
              />

              <PowerSlider
                label={t("create-faction:modal.cultural_power")}
                description={t("create-faction:modal.cultural_power_description")}
                value={editData.culturalPower || 5}
                onChange={(value) => onEditDataChange("culturalPower", value)}
              />

              <PowerSlider
                label={t("create-faction:modal.economic_power")}
                description={t("create-faction:modal.economic_power_description")}
                value={editData.economicPower || 5}
                onChange={(value) => onEditDataChange("economicPower", value)}
              />
            </div>
          ) : (
            <PowerDisplay
              militaryPower={faction.militaryPower || 5}
              politicalPower={faction.politicalPower || 5}
              culturalPower={faction.culturalPower || 5}
              economicPower={faction.economicPower || 5}
            />
          )}
        </FieldWithVisibilityToggle>
      </div>
    </>
  );

  // ==================
  // EXTRA SECTIONS
  // ==================
  const extraSections = [
    {
      id: "diplomacy",
      title: t("faction-detail:sections.diplomacy"),
      content: (
        <DiplomacySection
          currentFactionId={faction.id}
          diplomaticRelations={editData.diplomaticRelations || []}
          availableFactions={mockFactions}
          isEditing={isEditing}
          onRelationsChange={(relations) =>
            onEditDataChange("diplomaticRelations", relations)
          }
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.diplomacy !== false,
      onVisibilityToggle: () => handleSectionVisibilityToggle("diplomacy"),
    },
    {
      id: "hierarchy",
      title: t("faction-detail:sections.hierarchy"),
      content: (
        <HierarchySection
          hierarchy={editData.hierarchy || []}
          availableCharacters={mockCharacters}
          isEditing={isEditing}
          onHierarchyChange={(hierarchy) =>
            onEditDataChange("hierarchy", hierarchy)
          }
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.hierarchy !== false,
      onVisibilityToggle: () => handleSectionVisibilityToggle("hierarchy"),
    },
  ];

  // ==================
  // VERSIONS PANEL
  // ==================
  const versionsPanel = (
    <VersionsPanel title={t("faction-detail:sections.versions")}>
      <EntityVersionManager<IFactionVersion, IFaction, IFactionFormData>
        versions={versions}
        currentVersion={currentVersion}
        onVersionChange={onVersionChange}
        onVersionCreate={onVersionCreate}
        baseEntity={faction}
        i18nNamespace="faction-detail"
        renderVersionCard={({ version, isSelected, onClick }) => {
          const hasValidData = !!version.factionData;

          return (
            <div className="relative">
              <div
                className={!hasValidData ? "opacity-50 cursor-not-allowed" : ""}
              >
                <VersionCard
                  version={version}
                  isSelected={isSelected}
                  onClick={hasValidData ? onClick : () => {}}
                />
              </div>
              {!hasValidData && !version.isMain && (
                <div className="flex items-center justify-between mt-1 px-2">
                  <div className="text-xs text-destructive">
                    ⚠️ Dados corrompidos
                  </div>
                  <Button
                    variant="ghost-destructive"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVersionDelete(version.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              )}
            </div>
          );
        }}
        renderCreateDialog={({ open, onClose, onConfirm, baseEntity }) => (
          <CreateVersionWithEntityDialog<IFaction, IFactionFormData>
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            baseEntity={baseEntity}
            i18nNamespace="faction-detail"
            renderEntityModal={({ open, onOpenChange, onConfirm }) => (
              <CreateFactionModal
                open={open}
                onClose={() => onOpenChange(false)}
                onConfirm={onConfirm}
                bookId={bookId}
              />
            )}
          />
        )}
      />
    </VersionsPanel>
  );

  // ==================
  // RENDER
  // ==================
  return (
    <div className="relative min-h-screen">
      <FactionNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        factions={mockFactions.map((faction) => ({
          id: faction.id,
          name: faction.name,
          image: faction.image,
        }))}
        currentFactionId={faction.id}
        onFactionSelect={onFactionSelect}
      />

      <div className="w-full">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <EntityDetailLayout
            // Header
            onBack={onBack}
            backLabel={t("faction-detail:header.back")}
            showMenuButton
            onMenuToggle={onNavigationSidebarToggle}
            // Mode
            isEditMode={isEditing}
            // Actions
            onEdit={onEdit}
            onDelete={onDeleteModalOpen}
            editLabel={t("faction-detail:header.edit")}
            deleteLabel={t("faction-detail:header.delete")}
            // Edit mode actions
            onSave={onSave}
            onCancel={onCancel}
            saveLabel={t("faction-detail:header.save")}
            cancelLabel={t("faction-detail:header.cancel")}
            hasChanges={hasChanges}
            hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
            validationMessage={
              hasRequiredFieldsEmpty && isEditing ? (
                <p className="text-xs text-destructive">
                  {missingFields.length > 0 ? (
                    <>
                      {t("faction-detail:validation.missing_fields")}:{" "}
                      {missingFields
                        .map((field) => {
                          const fieldNames: Record<string, string> = {
                            name: t("faction-detail:fields.name"),
                            summary: t("faction-detail:fields.summary"),
                            status: t("faction-detail:fields.status"),
                            factionType: t("faction-detail:fields.faction_type"),
                          };
                          return fieldNames[field] || field;
                        })
                        .join(", ")}
                    </>
                  ) : (
                    t("faction-detail:validation.fill_required_fields")
                  )}
                </p>
              ) : undefined
            }
            // Content
            basicFields={basicFields}
            advancedFields={advancedFields}
            advancedSectionTitle={t("faction-detail:sections.advanced_info")}
            advancedSectionOpen={advancedSectionOpen}
            onAdvancedSectionToggle={onAdvancedSectionToggle}
            // Extra sections
            extraSections={extraSections}
            // Versions panel
            versionsPanel={versionsPanel}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteEntityModal<IFactionVersion>
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        entityName={faction.name}
        entityType="faction"
        currentVersion={currentVersion}
        versionName={currentVersion?.name}
        totalVersions={versions.length}
        onConfirmDelete={onConfirmDelete}
        i18nNamespace="faction-detail"
      />
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
