import React from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  Shield,
  Trash2,
  Clock,
  Users2,
  Settings,
  Image,
  AlertCircle,
  BookOpen,
  ScrollText,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityChapterMetricsSection } from "@/components/chapter-metrics/EntityChapterMetricsSection";
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
import { FormSimpleGrid } from "@/components/forms/FormSimpleGrid";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CreateFactionModal } from "@/components/modals/create-faction-modal";
import { PowerSlider } from "@/components/modals/create-faction-modal/components/power-slider";
import { FACTION_INFLUENCE_OPTIONS } from "@/components/modals/create-faction-modal/constants/faction-influence";
import { FACTION_REPUTATION_OPTIONS } from "@/components/modals/create-faction-modal/constants/faction-reputation";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import {
  FACTION_TYPE_OPTIONS,
  FACTION_TYPES_CONSTANT,
} from "@/components/modals/create-faction-modal/constants/faction-types";
import { DeleteEntityModal } from "@/components/modals/delete-entity-modal";
import { Button } from "@/components/ui/button";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { InfoAlert } from "@/components/ui/info-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { type IFactionFormData, type IFaction } from "@/types/faction-types";

import { AddMemberModal } from "./components/add-member-modal";
import { AlignmentMatrix } from "./components/alignment-matrix";
import { FactionTimeline } from "./components/faction-timeline";
import { HierarchySection } from "./components/hierarchy-section";
import { ManageTitlesModal } from "./components/manage-titles-modal";

interface FactionDetailViewProps {
  faction: IFaction;
  editData: IFaction;
  isEditing: boolean;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  mockCharacters: Array<{ id: string; name: string; image?: string }>;
  mockRaces: Array<{ id: string; name: string; image?: string }>;
  mockFactions: Array<{ id: string; name: string; image?: string }>;
  mockItems: Array<{ id: string; name: string; image?: string }>;
  mockRegions: Array<{ id: string; name: string; image?: string }>;
  statuses: typeof FACTION_STATUS_CONSTANT;
  types: typeof FACTION_TYPES_CONSTANT;
  currentStatus: (typeof FACTION_STATUS_CONSTANT)[0] | undefined;
  currentType: (typeof FACTION_TYPES_CONSTANT)[0] | undefined;
  StatusIcon: React.ComponentType<{ className?: string }>;
  TypeIcon: React.ComponentType<{ className?: string }>;
  advancedSectionOpen: boolean;
  sectionVisibility: Record<string, boolean>;
  bookId: string;
  errors: Record<string, string>;
  validateField: (field: string, value: unknown) => void;
  hasRequiredFieldsEmpty: boolean;
  missingFields: string[];
  hasChapterMetrics: boolean | null;
  setHasChapterMetrics: (value: boolean | null) => void;
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
  onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: unknown) => void;
  onAdvancedSectionToggle: () => void;
  onSectionVisibilityChange: (sectionName: string, isVisible: boolean) => void;
  hasChanges: boolean;
  isLogsModalOpen: boolean;
  onLogsModalToggle: () => void;
}

export function FactionDetailView({
  faction,
  editData,
  isEditing,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  mockCharacters,
  mockRaces,
  mockFactions,
  mockItems,
  mockRegions,
  currentStatus,
  currentType,
  StatusIcon,
  TypeIcon,
  advancedSectionOpen,
  sectionVisibility,
  bookId,
  errors,
  validateField,
  hasRequiredFieldsEmpty,
  missingFields,
  hasChapterMetrics,
  setHasChapterMetrics,
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
  onEditDataChange,
  onAdvancedSectionToggle,
  onSectionVisibilityChange,
  hasChanges,
  isLogsModalOpen,
  onLogsModalToggle,
}: FactionDetailViewProps) {
  const { t } = useTranslation([
    "faction-detail",
    "create-faction",
    "empty-states",
    "chapter-metrics",
  ]);

  // State for controlling dialogs from empty state buttons
  const [isCreateEraDialogOpen, setIsCreateEraDialogOpen] =
    React.useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] =
    React.useState(false);
  const [isManageTitlesDialogOpen, setIsManageTitlesDialogOpen] =
    React.useState(false);
  const [editingMember, setEditingMember] = React.useState<{
    titleId: string;
    characterId: string;
  } | null>(null);

  // Navigation for entity notes
  const navigate = useNavigate();

  // Convert status constants to FormSimpleGrid format
  const statusOptions = FACTION_STATUS_CONSTANT.map((status) => {
    // Extract background and border colors from bgColorClass
    const bgMatch = status.bgColorClass.match(/bg-(\w+-\d+\/\d+)/);
    const borderMatch = status.bgColorClass.match(/border-(\w+-\d+\/\d+)/);

    return {
      value: status.value,
      label: t(`create-faction:${status.translationKey}`),
      icon: status.icon,
      backgroundColor: bgMatch ? bgMatch[1] : "gray-500/10",
      borderColor: borderMatch ? borderMatch[1] : "gray-500/30",
    };
  });

  // Translate faction type options for FormSelectGrid
  const translatedTypeOptions = FACTION_TYPE_OPTIONS.map((opt) => ({
    ...opt,
    label: t(`create-faction:${opt.label}`),
    description: opt.description
      ? t(`create-faction:${opt.description}`)
      : undefined,
  }));

  // Handlers for hierarchy modals
  const handleSaveTitles = (titles: typeof editData.hierarchy) => {
    onEditDataChange("hierarchy", titles);
  };

  const handleSaveMember = (characterId: string, newTitleId: string) => {
    let updated = [...(editData.hierarchy || [])];

    // Se estiver editando, remover do título antigo
    if (editingMember) {
      updated = updated.map((title) => {
        if (title.id === editingMember.titleId) {
          return {
            ...title,
            characterIds: title.characterIds.filter(
              (id: string) => id !== editingMember.characterId
            ),
          };
        }
        return title;
      });
    }

    // Adicionar ao novo título
    updated = updated.map((title) => {
      if (title.id === newTitleId) {
        if (!title.characterIds.includes(characterId)) {
          return {
            ...title,
            characterIds: [...title.characterIds, characterId],
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
                height="h-96"
                shape="rounded"
                imageFit="cover"
                placeholderIcon={Shield}
                id="faction-image-upload"
                sourceMode="both"
                bookId={bookId}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className={`text-sm font-medium ${errors.name ? "text-destructive" : "text-primary"}`}
            >
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
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{editData.name?.length || 0}/200</span>
            </div>
          </div>

          {/* Status Picker */}
          <FormSimpleGrid
            value={editData.status || ""}
            onChange={(value) => {
              onEditDataChange("status", value);
              validateField("status", value);
            }}
            label={t("create-faction:modal.status")}
            required
            options={statusOptions}
            columns={5}
            error={errors.status}
          />

          {/* Faction Type Picker */}
          <FormSelectGrid
            value={editData.factionType || ""}
            onChange={(value) => {
              onEditDataChange("factionType", value);
              validateField("factionType", value);
            }}
            label={t("create-faction:modal.faction_type")}
            required
            columns={4}
            options={translatedTypeOptions}
            error={errors.factionType}
          />

          {/* Summary */}
          <div className="space-y-2">
            <Label
              htmlFor="summary"
              className={`text-sm font-medium ${errors.summary ? "text-destructive" : "text-primary"}`}
            >
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
            {errors.summary && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.summary}
              </p>
            )}
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{editData.summary?.length || 0}/500</span>
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
                  label={t(
                    `create-faction:faction_type.${faction.factionType}`
                  )}
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
      {
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("faction-detail:sections.internal_structure")}
          </h4>

          {/* Government Form */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.government_form")}
              </Label>
              <Textarea
                value={editData.governmentForm || ""}
                onChange={(e) =>
                  onEditDataChange("governmentForm", e.target.value)
                }
                placeholder={t(
                  "create-faction:modal.government_form_placeholder"
                )}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.governmentForm?.length || 0}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.government_form")}
              </Label>
              <DisplayTextarea value={faction.governmentForm} />
            </div>
          )}

          {/* Rules and Laws */}
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

          {/* Main Resources */}
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

          {/* Economy */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.economy")}
              </Label>
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
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.economy")}
              </Label>
              <DisplayTextarea value={faction.economy} />
            </div>
          )}

          {/* Symbols and Secrets */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.symbols_and_secrets")}
              </Label>
              <Textarea
                value={editData.symbolsAndSecrets || ""}
                onChange={(e) =>
                  onEditDataChange("symbolsAndSecrets", e.target.value)
                }
                placeholder={t(
                  "create-faction:modal.symbols_and_secrets_placeholder"
                )}
                rows={6}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.symbolsAndSecrets?.length || 0}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.symbols_and_secrets")}
              </Label>
              <DisplayTextarea value={faction.symbolsAndSecrets} />
            </div>
          )}

          {/* Currencies */}
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
        </div>
      }

      <Separator className="my-6" />

      {/* Territory Section */}
      {
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("faction-detail:sections.territory")}
          </h4>

          {/* Dominated Areas */}
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="region"
              bookId={bookId}
              label={t("faction-detail:fields.dominated_areas")}
              placeholder={t(
                "create-faction:modal.dominated_areas_placeholder"
              )}
              emptyText={t("create-faction:modal.no_regions_warning")}
              noSelectionText={t(
                "create-faction:modal.no_dominated_areas_selected"
              )}
              searchPlaceholder={t("create-faction:modal.search_regions")}
              value={editData.dominatedAreas || []}
              onChange={(value) => onEditDataChange("dominatedAreas", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayEntityList
              label={t("faction-detail:fields.dominated_areas")}
              entities={(() => {
                const regionIds = Array.isArray(faction.dominatedAreas)
                  ? faction.dominatedAreas
                  : [];
                return regionIds
                  .map((regionId: string) => {
                    const region = mockRegions.find((r) => r.id === regionId);
                    return region
                      ? {
                          id: region.id,
                          name: region.name,
                          image: region.image,
                        }
                      : null;
                  })
                  .filter(Boolean) as DisplayEntityItem[];
              })()}
            />
          )}

          {/* Main Base */}
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
                const regionIds = Array.isArray(faction.mainBase)
                  ? faction.mainBase
                  : [];
                return regionIds
                  .map((regionId: string) => {
                    const region = mockRegions.find((r) => r.id === regionId);
                    return region
                      ? {
                          id: region.id,
                          name: region.name,
                          image: region.image,
                        }
                      : null;
                  })
                  .filter(Boolean) as DisplayEntityItem[];
              })()}
            />
          )}

          {/* Areas of Interest */}
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="region"
              bookId={bookId}
              label={t("faction-detail:fields.areas_of_interest")}
              placeholder={t(
                "create-faction:modal.areas_of_interest_placeholder"
              )}
              emptyText={t("create-faction:modal.no_regions_warning")}
              noSelectionText={t(
                "create-faction:modal.no_areas_of_interest_selected"
              )}
              searchPlaceholder={t("create-faction:modal.search_regions")}
              value={editData.areasOfInterest || []}
              onChange={(value) => onEditDataChange("areasOfInterest", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayEntityList
              label={t("faction-detail:fields.areas_of_interest")}
              entities={(() => {
                const regionIds = Array.isArray(faction.areasOfInterest)
                  ? faction.areasOfInterest
                  : [];
                return regionIds
                  .map((regionId: string) => {
                    const region = mockRegions.find((r) => r.id === regionId);
                    return region
                      ? {
                          id: region.id,
                          name: region.name,
                          image: region.image,
                        }
                      : null;
                  })
                  .filter(Boolean) as DisplayEntityItem[];
              })()}
            />
          )}
        </div>
      }

      <Separator className="my-6" />

      {/* Culture Section */}
      {
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("faction-detail:sections.culture")}
          </h4>

          {/* Faction Motto */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.faction_motto")}
              </Label>
              <Textarea
                value={editData.factionMotto || ""}
                onChange={(e) =>
                  onEditDataChange("factionMotto", e.target.value)
                }
                placeholder={t(
                  "create-faction:modal.faction_motto_placeholder"
                )}
                rows={3}
                maxLength={300}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.factionMotto?.length || 0}/300</span>
              </div>
            </div>
          ) : faction.factionMotto ? (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.faction_motto")}
              </Label>
              <p className="text-sm italic whitespace-pre-wrap">
                &quot;{faction.factionMotto}&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.faction_motto")}
              </Label>
              <p className="text-sm italic text-muted-foreground/60">
                {t("common:no_data")}
              </p>
            </div>
          )}

          {/* Traditions and Rituals */}
          {isEditing ? (
            <FormListInput
              value={editData.traditionsAndRituals || []}
              onChange={(value) =>
                onEditDataChange("traditionsAndRituals", value)
              }
              label={t("faction-detail:fields.traditions_and_rituals")}
              placeholder={t(
                "create-faction:modal.traditions_and_rituals_placeholder"
              )}
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

          {/* Beliefs and Values */}
          {isEditing ? (
            <FormListInput
              value={editData.beliefsAndValues || []}
              onChange={(value) => onEditDataChange("beliefsAndValues", value)}
              label={t("faction-detail:fields.beliefs_and_values")}
              placeholder={t(
                "create-faction:modal.beliefs_and_values_placeholder"
              )}
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

          {/* Languages Used */}
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

          {/* Uniform and Aesthetics */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.uniform_and_aesthetics")}
              </Label>
              <Textarea
                value={editData.uniformAndAesthetics || ""}
                onChange={(e) =>
                  onEditDataChange("uniformAndAesthetics", e.target.value)
                }
                placeholder={t(
                  "create-faction:modal.uniform_and_aesthetics_placeholder"
                )}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.uniformAndAesthetics?.length || 0}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.uniform_and_aesthetics")}
              </Label>
              <DisplayTextarea value={faction.uniformAndAesthetics} />
            </div>
          )}

          {/* Races */}
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
                const raceIds = Array.isArray(faction.races)
                  ? faction.races
                  : [];
                return raceIds.map((raceId: string) => {
                  const race = mockRaces.find((r) => r.id === raceId);
                  return race
                    ? { id: race.id, name: race.name, image: race.image }
                    : { id: raceId, name: raceId };
                }) as DisplayEntityItem[];
              })()}
            />
          )}
        </div>
      }

      <Separator className="my-6" />

      {/* History Section */}
      {
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("faction-detail:sections.history")}
          </h4>

          {/* Foundation Date */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.foundation_date")}
              </Label>
              <Input
                value={editData.foundationDate || ""}
                onChange={(e) =>
                  onEditDataChange("foundationDate", e.target.value)
                }
                placeholder={t(
                  "create-faction:modal.foundation_date_placeholder"
                )}
                maxLength={200}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.foundationDate?.length || 0}/200</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.foundation_date")}
              </Label>
              <DisplayText value={faction.foundationDate} />
            </div>
          )}

          {/* Foundation History Summary */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.foundation_history_summary")}
              </Label>
              <Textarea
                value={editData.foundationHistorySummary || ""}
                onChange={(e) =>
                  onEditDataChange("foundationHistorySummary", e.target.value)
                }
                placeholder={t(
                  "create-faction:modal.foundation_history_summary_placeholder"
                )}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>
                  {editData.foundationHistorySummary?.length || 0}/500
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.foundation_history_summary")}
              </Label>
              <DisplayTextarea value={faction.foundationHistorySummary} />
            </div>
          )}

          {/* Founders */}
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
                const founderIds = Array.isArray(faction.founders)
                  ? faction.founders
                  : [];
                return founderIds.map((founderId: string) => {
                  const character = mockCharacters.find(
                    (c) => c.id === founderId
                  );
                  return character
                    ? {
                        id: character.id,
                        name: character.name,
                        image: character.image,
                      }
                    : { id: founderId, name: founderId };
                }) as DisplayEntityItem[];
              })()}
            />
          )}

          {/* Alignment - in History section like create modal */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              {t("faction-detail:fields.alignment")}
            </Label>
            <AlignmentMatrix
              value={isEditing ? editData.alignment : faction.alignment}
              onChange={(value) => onEditDataChange("alignment", value)}
              isEditable={isEditing}
            />
          </div>
        </div>
      }

      <Separator className="my-6" />

      {/* Relationships Section */}
      {
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("faction-detail:sections.relationships")}
          </h4>

          {/* Influence */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.influence")}
              </Label>
              <FormSelectGrid
                value={editData.influence || ""}
                onChange={(value) => onEditDataChange("influence", value)}
                options={FACTION_INFLUENCE_OPTIONS.map((opt) => ({
                  ...opt,
                  label: t(`create-faction:${opt.label}`),
                  description: opt.description
                    ? t(`create-faction:${opt.description}`)
                    : undefined,
                }))}
                columns={3}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.influence")}
              </Label>
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
            </div>
          )}

          {/* Public Reputation */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.public_reputation")}
              </Label>
              <FormSelectGrid
                value={editData.publicReputation || ""}
                onChange={(value) =>
                  onEditDataChange("publicReputation", value)
                }
                options={FACTION_REPUTATION_OPTIONS.map((opt) => ({
                  ...opt,
                  label: t(`create-faction:${opt.label}`),
                  description: opt.description
                    ? t(`create-faction:${opt.description}`)
                    : undefined,
                }))}
                columns={3}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.public_reputation")}
              </Label>
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
            </div>
          )}
        </div>
      }

      <Separator className="my-6" />

      {/* Narrative Section */}
      {
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("faction-detail:sections.narrative")}
          </h4>

          {/* Organization Objectives */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.organization_objectives")}
              </Label>
              <Textarea
                value={editData.organizationObjectives || ""}
                onChange={(e) =>
                  onEditDataChange("organizationObjectives", e.target.value)
                }
                placeholder={t(
                  "create-faction:modal.organization_objectives_placeholder"
                )}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.organizationObjectives?.length || 0}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.organization_objectives")}
              </Label>
              <DisplayTextarea value={faction.organizationObjectives} />
            </div>
          )}

          {/* Narrative Importance */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.narrative_importance")}
              </Label>
              <Textarea
                value={editData.narrativeImportance || ""}
                onChange={(e) =>
                  onEditDataChange("narrativeImportance", e.target.value)
                }
                placeholder={t(
                  "create-faction:modal.narrative_importance_placeholder"
                )}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.narrativeImportance?.length || 0}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.narrative_importance")}
              </Label>
              <DisplayTextarea value={faction.narrativeImportance} />
            </div>
          )}

          {/* Inspirations */}
          {isEditing ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.inspirations")}
              </Label>
              <Textarea
                value={editData.inspirations || ""}
                onChange={(e) =>
                  onEditDataChange("inspirations", e.target.value)
                }
                placeholder={t("create-faction:modal.inspirations_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.inspirations?.length || 0}/500</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-sm font-medium text-primary">
                {t("faction-detail:fields.inspirations")}
              </Label>
              <DisplayTextarea value={faction.inspirations} />
            </div>
          )}

          {/* Power Sliders - in Narrative section like create modal */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              {t("faction-detail:fields.power")}
            </Label>
            {isEditing ? (
              <div className="space-y-4">
                <InfoAlert>
                  {t("create-faction:modal.power_description")}
                </InfoAlert>

                <PowerSlider
                  label={t("create-faction:modal.military_power")}
                  description={t(
                    "create-faction:modal.military_power_description"
                  )}
                  value={editData.militaryPower || 5}
                  onChange={(value) => onEditDataChange("militaryPower", value)}
                />

                <PowerSlider
                  label={t("create-faction:modal.political_power")}
                  description={t(
                    "create-faction:modal.political_power_description"
                  )}
                  value={editData.politicalPower || 5}
                  onChange={(value) =>
                    onEditDataChange("politicalPower", value)
                  }
                />

                <PowerSlider
                  label={t("create-faction:modal.cultural_power")}
                  description={t(
                    "create-faction:modal.cultural_power_description"
                  )}
                  value={editData.culturalPower || 5}
                  onChange={(value) => onEditDataChange("culturalPower", value)}
                />

                <PowerSlider
                  label={t("create-faction:modal.economic_power")}
                  description={t(
                    "create-faction:modal.economic_power_description"
                  )}
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
          </div>
        </div>
      }
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
          bookId={bookId}
          timeline={(editData.timeline || []).map((era, index) => ({
            ...era,
            id: era.id || `era-${index}-${Date.now()}`,
            events: (era.events || []).map((event, eventIndex) => ({
              ...event,
              id: event.id || `event-${eventIndex}-${Date.now()}`,
            })),
          }))}
          isEditing={isEditing}
          onTimelineChange={(timeline) =>
            onEditDataChange("timeline", timeline)
          }
          isCreateEraDialogOpen={isCreateEraDialogOpen}
          onCreateEraDialogOpenChange={setIsCreateEraDialogOpen}
          mockCharacters={mockCharacters}
          mockFactions={mockFactions}
          mockRaces={mockRaces}
          mockItems={mockItems}
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.timeline !== false,
      onVisibilityToggle: () =>
        onSectionVisibilityChange("timeline", !sectionVisibility.timeline),
      // Empty states
      emptyState:
        (editData.timeline || []).length === 0
          ? isEditing
            ? "empty-edit"
            : "empty-view"
          : null,
      emptyIcon: Clock,
      emptyTitle: t("empty-states:timeline.no_timeline_defined"),
      emptyDescription: t("empty-states:timeline.use_edit_mode_to_add_eras"),
      addButtonLabel: t("forms:buttons.create_first_era"),
      onAddClick: () => setIsCreateEraDialogOpen(true),
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
      onVisibilityToggle: () =>
        onSectionVisibilityChange("hierarchy", !sectionVisibility.hierarchy),
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
      emptyTitle: t("empty-states:hierarchy.no_hierarchy_defined"),
      emptyDescription: t(
        "empty-states:hierarchy.use_edit_mode_to_add_members"
      ),
      addButtonLabel: t("forms:buttons.add_member"),
      onAddClick: () => setIsAddMemberDialogOpen(true),
      secondaryButtonLabel: t("forms:buttons.manage_titles"),
      SecondaryButtonIcon: Settings,
      onSecondaryClick: () => setIsManageTitlesDialogOpen(true),
      blockedEntityName: t("characters:header.title").toLowerCase(),
    },
  ];

  // Add Chapter Metrics section (always visible, not editable)
  extraSections.push({
    id: "chapter-metrics",
    title: t("chapter-metrics:entity_section.title"),
    content: (
      <EntityChapterMetricsSection
        bookId={bookId}
        entityId={faction.id}
        entityType="faction"
        isEditMode={isEditing}
        onChapterClick={(chapterId) =>
          navigate({
            to: "/dashboard/$dashboardId/chapters/$chapterId",
            params: { dashboardId: bookId, chapterId },
          })
        }
        onMetricsLoad={setHasChapterMetrics}
      />
    ),
    isCollapsible: true,
    defaultOpen: false,
    isVisible: sectionVisibility["chapter-metrics"] !== false,
    onVisibilityToggle: () =>
      onSectionVisibilityChange(
        "chapter-metrics",
        !sectionVisibility["chapter-metrics"]
      ),
    // Empty state (only for view mode - edit mode shows InfoAlert inside component)
    emptyState: !isEditing && hasChapterMetrics === false ? "empty-view" : null,
    emptyIcon: BookOpen,
    emptyTitle: t("chapter-metrics:entity_section.empty_state_title"),
    emptyDescription: t("chapter-metrics:entity_section.no_mentions.faction"),
  });

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
            menuTooltip={t("common:tooltips.quick_navigation")}
            editTooltip={t("common:tooltips.edit")}
            deleteTooltip={t("common:tooltips.delete")}
            extraActions={[
              {
                label: t("faction-detail:header.logs"),
                icon: ScrollText,
                onClick: onLogsModalToggle,
                tooltip: t("faction-detail:header.logs"),
              },
              {
                label: t("faction-detail:header.gallery"),
                icon: Image,
                onClick: () =>
                  navigate({
                    to: "/dashboard/$dashboardId/gallery/entity/$entityType/$entityId",
                    params: {
                      dashboardId: bookId,
                      entityType: "faction",
                      entityId: faction.id,
                    },
                    search: { entityName: faction.name },
                  }),
                tooltip: t("faction-detail:header.gallery"),
              },
            ]}
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
            missingFields={missingFields}
            fieldNames={{
              name: t("faction-detail:fields.name"),
              summary: t("faction-detail:fields.summary"),
              status: t("faction-detail:fields.status"),
              factionType: t("faction-detail:fields.faction_type"),
            }}
            missingFieldsLabel={t("faction-detail:validation.missing_fields")}
            // Content
            basicFields={basicFields}
            advancedFields={advancedFields}
            advancedSectionTitle={t("faction-detail:sections.advanced_info")}
            advancedSectionOpen={advancedSectionOpen}
            onAdvancedSectionToggle={onAdvancedSectionToggle}
            // Extra sections
            extraSections={extraSections}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteEntityModal
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        entityName={faction.name}
        entityType="faction"
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
        titles={(editData.hierarchy || []).filter((t) => !t.isMembersTitle)}
        availableCharacters={mockCharacters}
        existingMemberIds={(editData.hierarchy || []).flatMap(
          (t) => t.characterIds
        )}
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
