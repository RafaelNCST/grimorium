import React from "react";

import { Shield, Trash2, Clock, Handshake, Users2, Settings } from "lucide-react";
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
import { FactionNavigationSidebar } from "@/components/faction-navigation-sidebar";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormListInput } from "@/components/forms/FormListInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CreateFactionModal } from "@/components/modals/create-faction-modal";
import { FactionTypePicker } from "@/components/modals/create-faction-modal/components/faction-type-picker";
import { PowerSlider } from "@/components/modals/create-faction-modal/components/power-slider";
import { StatusPicker } from "@/components/modals/create-faction-modal/components/status-picker";
import { FACTION_INFLUENCE_OPTIONS } from "@/components/modals/create-faction-modal/constants/faction-influence";
import { FACTION_REPUTATION_OPTIONS } from "@/components/modals/create-faction-modal/constants/faction-reputation";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { DeleteEntityModal } from "@/components/modals/delete-entity-modal";
import { InfoAlert } from "@/components/ui/info-alert";
import { Button } from "@/components/ui/button";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  type DiplomaticStatus,
} from "@/types/faction-types";

import { AddMemberModal } from "./components/add-member-modal";
import { AlignmentMatrix } from "./components/alignment-matrix";
import { DiplomacySection } from "./components/diplomacy-section";
import { FactionTimeline } from "./components/faction-timeline";
import { HierarchySection } from "./components/hierarchy-section";
import { ManageTitlesModal } from "./components/manage-titles-modal";
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
  mockCharacters: Array<{ id: string; name: string; image?: string }>;
  mockRaces: Array<{ id: string; name: string; image?: string }>;
  mockFactions: Array<{ id: string; name: string; image?: string }>;
  mockItems: Array<{ id: string; name: string; image?: string }>;
  statuses: typeof FACTION_STATUS_CONSTANT;
  types: typeof FACTION_TYPES_CONSTANT;
  currentStatus: (typeof FACTION_STATUS_CONSTANT)[0] | undefined;
  currentType: (typeof FACTION_TYPES_CONSTANT)[0] | undefined;
  StatusIcon: React.ComponentType<{ className?: string }>;
  TypeIcon: React.ComponentType<{ className?: string }>;
  fieldVisibility: IFieldVisibility;
  advancedSectionOpen: boolean;
  sectionVisibility: Record<string, boolean>;
  activeDiplomacyTab: DiplomaticStatus;
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
    entityData: IFactionFormData;
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
  onSectionVisibilityChange: (sectionName: string, isVisible: boolean) => void;
  onActiveDiplomacyTabChange: (tab: DiplomaticStatus) => void;
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
  mockRaces,
  mockFactions,
  mockItems,
  currentStatus,
  currentType,
  StatusIcon,
  TypeIcon,
  fieldVisibility,
  advancedSectionOpen,
  sectionVisibility,
  activeDiplomacyTab,
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
  onSectionVisibilityChange,
  onActiveDiplomacyTabChange,
  hasChanges,
}: FactionDetailViewProps) {
  const { t } = useTranslation(["faction-detail", "create-faction"]);

  // State for controlling dialogs from empty state buttons
  const [isCreateEraDialogOpen, setIsCreateEraDialogOpen] = React.useState(false);
  const [isAddDiplomacyDialogOpen, setIsAddDiplomacyDialogOpen] = React.useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = React.useState(false);
  const [isManageTitlesDialogOpen, setIsManageTitlesDialogOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<{ titleId: string; characterId: string } | null>(null);

  // Handlers for hierarchy modals
  const handleSaveTitles = (titles: typeof editData.hierarchy) => {
    onEditDataChange("hierarchy", titles);
  };

  const handleSaveMember = (characterId: string, newTitleId: string) => {
    let updated = [...(editData.hierarchy || [])];

    // Se estiver editando, remover do título antigo
    if (editingMember) {
      updated = updated.map(title => {
        if (title.id === editingMember.titleId) {
          return {
            ...title,
            characterIds: title.characterIds.filter((id: string) => id !== editingMember.characterId)
          };
        }
        return title;
      });
    }

    // Adicionar ao novo título
    updated = updated.map(title => {
      if (title.id === newTitleId) {
        if (!title.characterIds.includes(characterId)) {
          return {
            ...title,
            characterIds: [...title.characterIds, characterId]
          };
        }
      }
      return title;
    });

    onEditDataChange("hierarchy", updated);
    setIsAddMemberDialogOpen(false);
    setEditingMember(null);
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

  // Helper function to check if all fields in a group are hidden
  const areAllFieldsHidden = (fieldNames: string[]): boolean => {
    if (isEditing) return false; // Never hide sections in edit mode
    return fieldNames.every(fieldName => fieldVisibility[fieldName] === false);
  };

  // Define field groups for each mini-section
  const internalStructureFields = [
    'governmentForm', 'rulesAndLaws', 'mainResources',
    'economy', 'symbolsAndSecrets', 'currencies'
  ];
  const territoryFields = ['dominatedAreas', 'mainBase', 'areasOfInterest'];
  const cultureFields = [
    'factionMotto', 'traditionsAndRituals', 'beliefsAndValues',
    'languagesUsed', 'uniformAndAesthetics', 'races'
  ];
  const historyFields = ['foundationDate', 'foundationHistorySummary', 'founders', 'alignment'];
  const relationshipsFields = ['influence', 'publicReputation'];
  const narrativeFields = [
    'organizationObjectives', 'narrativeImportance', 'inspirations', 'power'
  ];

  // Check if mini-sections should be hidden
  const hideInternalStructureSection = areAllFieldsHidden(internalStructureFields);
  const hideTerritorySection = areAllFieldsHidden(territoryFields);
  const hideCultureSection = areAllFieldsHidden(cultureFields);
  const hideHistorySection = areAllFieldsHidden(historyFields);
  const hideRelationshipsSection = areAllFieldsHidden(relationshipsFields);
  const hideNarrativeSection = areAllFieldsHidden(narrativeFields);

  // Check if entire advanced section should be hidden
  const hideEntireAdvancedSection =
    hideInternalStructureSection && hideTerritorySection && hideCultureSection &&
    hideHistorySection && hideRelationshipsSection && hideNarrativeSection;

  const advancedFields = hideEntireAdvancedSection ? null : (
    <>
      {/* Internal Structure Section */}
      {!hideInternalStructureSection && (
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

        {/* Rules and Laws */}
        <FieldWithVisibilityToggle
          fieldName="rulesAndLaws"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormListInput
              value={editData.rulesAndLaws || []}
              onChange={(value) => onEditDataChange("rulesAndLaws", value)}
              label={t("faction-detail:fields.rules_and_laws")}
              placeholder={t("create-faction:modal.rules_and_laws_placeholder")}
              buttonText={t("create-faction:modal.add_rule")}
              maxLength={200}
              inputSize="large"
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayStringList
              label={t("faction-detail:fields.rules_and_laws")}
              items={faction.rulesAndLaws}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Main Resources */}
        <FieldWithVisibilityToggle
          fieldName="mainResources"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormListInput
              value={editData.mainResources || []}
              onChange={(value) => onEditDataChange("mainResources", value)}
              label={t("faction-detail:fields.main_resources")}
              placeholder={t("create-faction:modal.main_resources_placeholder")}
              buttonText={t("create-faction:modal.add_resource")}
              maxLength={50}
              inputSize="small"
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayStringList
              label={t("faction-detail:fields.main_resources")}
              items={faction.mainResources}
            />
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

        {/* Currencies */}
        <FieldWithVisibilityToggle
          fieldName="currencies"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormListInput
              value={editData.currencies || []}
              onChange={(value) => onEditDataChange("currencies", value)}
              label={t("faction-detail:fields.currencies")}
              placeholder={t("create-faction:modal.currencies_placeholder")}
              buttonText={t("create-faction:modal.add_currency")}
              maxLength={50}
              inputSize="small"
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayStringList
              label={t("faction-detail:fields.currencies")}
              items={faction.currencies}
            />
          )}
        </FieldWithVisibilityToggle>
        </div>
      )}

      {/* Separator between Internal Structure and Territory - only show if both sections are visible */}
      {!hideInternalStructureSection && !hideTerritorySection && (
        <Separator className="my-6" />
      )}

      {/* Territory Section */}
      {!hideTerritorySection && (
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
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="region"
              bookId={bookId}
              label={t("faction-detail:fields.dominated_areas")}
              placeholder={t("create-faction:modal.dominated_areas_placeholder")}
              emptyText={t("create-faction:modal.no_regions_warning")}
              noSelectionText={t("create-faction:modal.no_dominated_areas_selected")}
              searchPlaceholder={t("create-faction:modal.search_regions")}
              value={editData.dominatedAreas || []}
              onChange={(value) => onEditDataChange("dominatedAreas", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayEntityList
              label={t("faction-detail:fields.dominated_areas")}
              entities={(() => {
                const regions = editData.dominatedAreas || [];
                return regions.map((regionId: string) => ({
                  id: regionId,
                  name: regionId,
                })) as DisplayEntityItem[];
              })()}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Main Base */}
        <FieldWithVisibilityToggle
          fieldName="mainBase"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="region"
              bookId={bookId}
              label={t("faction-detail:fields.main_base")}
              placeholder={t("create-faction:modal.main_base_placeholder")}
              emptyText={t("create-faction:modal.no_regions_warning")}
              noSelectionText={t("create-faction:modal.no_main_base_selected")}
              searchPlaceholder={t("create-faction:modal.search_regions")}
              value={editData.mainBase || []}
              onChange={(value) => onEditDataChange("mainBase", value)}
              labelClassName="text-sm font-medium text-primary"
              maxSelections={1}
            />
          ) : (
            <DisplayEntityList
              label={t("faction-detail:fields.main_base")}
              entities={(() => {
                const regions = editData.mainBase || [];
                return regions.map((regionId: string) => ({
                  id: regionId,
                  name: regionId,
                })) as DisplayEntityItem[];
              })()}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Areas of Interest */}
        <FieldWithVisibilityToggle
          fieldName="areasOfInterest"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="region"
              bookId={bookId}
              label={t("faction-detail:fields.areas_of_interest")}
              placeholder={t("create-faction:modal.areas_of_interest_placeholder")}
              emptyText={t("create-faction:modal.no_regions_warning")}
              noSelectionText={t("create-faction:modal.no_areas_of_interest_selected")}
              searchPlaceholder={t("create-faction:modal.search_regions")}
              value={editData.areasOfInterest || []}
              onChange={(value) => onEditDataChange("areasOfInterest", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayEntityList
              label={t("faction-detail:fields.areas_of_interest")}
              entities={(() => {
                const regions = editData.areasOfInterest || [];
                return regions.map((regionId: string) => ({
                  id: regionId,
                  name: regionId,
                })) as DisplayEntityItem[];
              })()}
            />
          )}
        </FieldWithVisibilityToggle>
        </div>
      )}

      {/* Separator between Territory and Culture - only show if both sections are visible */}
      {!hideTerritorySection && !hideCultureSection && (
        <Separator className="my-6" />
      )}

      {/* Culture Section */}
      {!hideCultureSection && (
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

        {/* Traditions and Rituals */}
        <FieldWithVisibilityToggle
          fieldName="traditionsAndRituals"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormListInput
              value={editData.traditionsAndRituals || []}
              onChange={(value) => onEditDataChange("traditionsAndRituals", value)}
              label={t("faction-detail:fields.traditions_and_rituals")}
              placeholder={t("create-faction:modal.traditions_and_rituals_placeholder")}
              buttonText={t("create-faction:modal.add_tradition")}
              maxLength={200}
              inputSize="large"
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayStringList
              label={t("faction-detail:fields.traditions_and_rituals")}
              items={faction.traditionsAndRituals}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Beliefs and Values */}
        <FieldWithVisibilityToggle
          fieldName="beliefsAndValues"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormListInput
              value={editData.beliefsAndValues || []}
              onChange={(value) => onEditDataChange("beliefsAndValues", value)}
              label={t("faction-detail:fields.beliefs_and_values")}
              placeholder={t("create-faction:modal.beliefs_and_values_placeholder")}
              buttonText={t("create-faction:modal.add_belief")}
              maxLength={200}
              inputSize="large"
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayStringList
              label={t("faction-detail:fields.beliefs_and_values")}
              items={faction.beliefsAndValues}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Languages Used */}
        <FieldWithVisibilityToggle
          fieldName="languagesUsed"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormListInput
              value={editData.languagesUsed || []}
              onChange={(value) => onEditDataChange("languagesUsed", value)}
              label={t("faction-detail:fields.languages_used")}
              placeholder={t("create-faction:modal.languages_used_placeholder")}
              buttonText={t("create-faction:modal.add_language")}
              maxLength={50}
              inputSize="small"
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayStringList
              label={t("faction-detail:fields.languages_used")}
              items={faction.languagesUsed}
            />
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

        {/* Races */}
        <FieldWithVisibilityToggle
          fieldName="races"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="race"
              bookId={bookId}
              label={t("faction-detail:fields.races")}
              placeholder={t("create-faction:modal.races_placeholder")}
              emptyText={t("create-faction:modal.no_races_warning")}
              noSelectionText={t("create-faction:modal.no_races_selected")}
              searchPlaceholder={t("create-faction:modal.search_races")}
              value={editData.races || []}
              onChange={(value) => onEditDataChange("races", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayEntityList
              label={t("faction-detail:fields.races")}
              entities={(() => {
                const raceIds = faction.races || [];
                return raceIds.map((raceId: string) => {
                  const race = mockRaces.find((r) => r.id === raceId);
                  return race ? { id: race.id, name: race.name, image: race.image } : { id: raceId, name: raceId };
                }) as DisplayEntityItem[];
              })()}
            />
          )}
        </FieldWithVisibilityToggle>
        </div>
      )}

      {/* Separator between Culture and History - only show if both sections are visible */}
      {!hideCultureSection && !hideHistorySection && (
        <Separator className="my-6" />
      )}

      {/* History Section */}
      {!hideHistorySection && (
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

        {/* Founders */}
        <FieldWithVisibilityToggle
          fieldName="founders"
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="character"
              bookId={bookId}
              label={t("faction-detail:fields.founders")}
              placeholder={t("create-faction:modal.founders_placeholder")}
              emptyText={t("create-faction:modal.no_characters_warning")}
              noSelectionText={t("create-faction:modal.no_founders_selected")}
              searchPlaceholder={t("create-faction:modal.search_characters")}
              value={editData.founders || []}
              onChange={(value) => onEditDataChange("founders", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayEntityList
              label={t("faction-detail:fields.founders")}
              entities={(() => {
                const founderIds = faction.founders || [];
                return founderIds.map((founderId: string) => {
                  const character = mockCharacters.find((c) => c.id === founderId);
                  return character ? { id: character.id, name: character.name, image: character.image } : { id: founderId, name: founderId };
                }) as DisplayEntityItem[];
              })()}
            />
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
      )}

      {/* Separator between History and Relationships - only show if both sections are visible */}
      {!hideHistorySection && !hideRelationshipsSection && (
        <Separator className="my-6" />
      )}

      {/* Relationships Section */}
      {!hideRelationshipsSection && (
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
            <FormSelectGrid
              value={editData.influence || ""}
              onChange={(value) => onEditDataChange("influence", value)}
              options={FACTION_INFLUENCE_OPTIONS.map((opt) => ({
                ...opt,
                label: t(`create-faction:${opt.label}`),
                description: opt.description ? t(`create-faction:${opt.description}`) : undefined,
              }))}
              columns={3}
            />
          ) : (
            <DisplaySelectGrid
              value={faction.influence}
              options={FACTION_INFLUENCE_OPTIONS.map((opt) => ({
                ...opt,
                label: t(`create-faction:${opt.label}`),
                description: opt.description ? t(`create-faction:${opt.description}`) : undefined,
              }))}
              emptyTitle={t("faction-detail:empty_states.no_influence")}
              emptyDescription={t("faction-detail:empty_states.no_influence_hint")}
            />
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
            <FormSelectGrid
              value={editData.publicReputation || ""}
              onChange={(value) => onEditDataChange("publicReputation", value)}
              options={FACTION_REPUTATION_OPTIONS.map((opt) => ({
                ...opt,
                label: t(`create-faction:${opt.label}`),
                description: opt.description ? t(`create-faction:${opt.description}`) : undefined,
              }))}
              columns={3}
            />
          ) : (
            <DisplaySelectGrid
              value={faction.publicReputation}
              options={FACTION_REPUTATION_OPTIONS.map((opt) => ({
                ...opt,
                label: t(`create-faction:${opt.label}`),
                description: opt.description ? t(`create-faction:${opt.description}`) : undefined,
              }))}
              emptyTitle={t("faction-detail:empty_states.no_reputation")}
              emptyDescription={t("faction-detail:empty_states.no_reputation_hint")}
            />
          )}
        </FieldWithVisibilityToggle>
        </div>
      )}

      {/* Separator between Relationships and Narrative - only show if both sections are visible */}
      {!hideRelationshipsSection && !hideNarrativeSection && (
        <Separator className="my-6" />
      )}

      {/* Narrative Section */}
      {!hideNarrativeSection && (
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
      )}
    </>
  );

  // ==================
  // EXTRA SECTIONS
  // ==================
  const extraSections = [
    {
      id: "timeline",
      title: t("faction-detail:sections.timeline"),
      content: (
        <FactionTimeline
          factionId={faction.id}
          timeline={editData.timeline || []}
          isEditing={isEditing}
          onTimelineChange={(timeline) =>
            onEditDataChange("timeline", timeline)
          }
          characters={mockCharacters}
          factions={mockFactions}
          races={mockRaces}
          items={mockItems}
          isCreateEraDialogOpen={isCreateEraDialogOpen}
          onCreateEraDialogOpenChange={setIsCreateEraDialogOpen}
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.timeline !== false,
      onVisibilityToggle: () => onSectionVisibilityChange("timeline", !sectionVisibility.timeline),
      // Empty states
      emptyState: (editData.timeline || []).length === 0
        ? (isEditing ? "empty-edit" : "empty-view")
        : null,
      emptyIcon: Clock,
      emptyTitle: "Nenhuma linha do tempo definida",
      emptyDescription: "Use o modo de edição para adicionar eras",
      addButtonLabel: "Criar Primeira Era",
      onAddClick: () => setIsCreateEraDialogOpen(true),
    },
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
          activeTab={activeDiplomacyTab}
          onActiveTabChange={onActiveDiplomacyTabChange}
          isAddDialogOpen={isAddDiplomacyDialogOpen}
          onAddDialogOpenChange={setIsAddDiplomacyDialogOpen}
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.diplomacy !== false,
      onVisibilityToggle: () => onSectionVisibilityChange("diplomacy", !sectionVisibility.diplomacy),
      // Empty states
      emptyState: (() => {
        const otherFactions = mockFactions.filter((f) => f.id !== faction.id);
        const relations = editData.diplomaticRelations || [];

        // Estado 3: Bloqueado - não há outras facções
        if (otherFactions.length === 0 && isEditing) {
          return "blocked-no-data";
        }

        // Estado 4: Bloqueado - todas as facções têm relações
        if (isEditing && relations.length > 0 && relations.length === otherFactions.length) {
          return "blocked-all-used";
        }

        // Estado 1: Vazio em visualização
        if (relations.length === 0 && !isEditing) {
          return "empty-view";
        }

        // Estado 2: Vazio em edição
        if (relations.length === 0 && isEditing) {
          return "empty-edit";
        }

        return null;
      })(),
      emptyIcon: Handshake,
      emptyTitle: "Nenhuma relação diplomática definida",
      emptyDescription: "Use o modo de edição para adicionar relações",
      addButtonLabel: "Adicionar Relação Diplomática",
      onAddClick: () => setIsAddDiplomacyDialogOpen(true),
      blockedEntityName: "facções",
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
          onOpenAddMemberModal={(member) => {
            setEditingMember(member);
            setIsAddMemberDialogOpen(true);
          }}
          onOpenManageTitlesModal={() => setIsManageTitlesDialogOpen(true)}
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.hierarchy !== false,
      onVisibilityToggle: () => onSectionVisibilityChange("hierarchy", !sectionVisibility.hierarchy),
      // Empty states
      emptyState: (() => {
        const hierarchy = editData.hierarchy || [];

        // Estado 3: Bloqueado - não há personagens
        if (mockCharacters.length === 0 && isEditing) {
          return "blocked-no-data";
        }

        // Estado 1: Vazio em visualização
        if (hierarchy.length === 0 && !isEditing) {
          return "empty-view";
        }

        // Estado 2: Vazio em edição
        if (hierarchy.length === 0 && isEditing) {
          return "empty-edit";
        }

        return null;
      })(),
      emptyIcon: Users2,
      emptyTitle: "Nenhuma hierarquia definida",
      emptyDescription: "Use o modo de edição para adicionar membros",
      addButtonLabel: "Adicionar Membro",
      onAddClick: () => setIsAddMemberDialogOpen(true),
      secondaryButtonLabel: "Gerenciar Títulos",
      SecondaryButtonIcon: Settings,
      onSecondaryClick: () => setIsManageTitlesDialogOpen(true),
      blockedEntityName: "personagens",
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
    <div className="relative">
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

      {/* Hierarchy Modals - Rendered at root level to prevent flickering */}
      <ManageTitlesModal
        isOpen={isManageTitlesDialogOpen}
        onClose={() => setIsManageTitlesDialogOpen(false)}
        titles={editData.hierarchy || []}
        onSave={handleSaveTitles}
      />

      <AddMemberModal
        isOpen={isAddMemberDialogOpen}
        onClose={() => {
          setIsAddMemberDialogOpen(false);
          setEditingMember(null);
        }}
        titles={(editData.hierarchy || []).filter(t => !t.isMembersTitle)}
        availableCharacters={mockCharacters}
        existingMemberIds={(editData.hierarchy || []).flatMap(t => t.characterIds)}
        editingMember={editingMember}
        onSave={handleSaveMember}
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
