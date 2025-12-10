import React, { useState, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";
import { convertFileSrc } from "@tauri-apps/api/core";
import { Map, AlertCircle, Trash2, Clock, NotebookPen } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityChapterMetricsSection } from "@/components/chapter-metrics/EntityChapterMetricsSection";
import {
  type IFieldVisibility,
  type ISectionVisibility,
  FieldWithVisibilityToggle,
  hasVisibleFields,
  isSectionVisible,
} from "@/components/detail-page";
import {
  DisplayImage,
  DisplayTextarea,
  DisplayStringList,
  DisplayEntityList,
  DisplaySelectGrid,
  type DisplayEntityItem,
  type DisplaySelectGridOption,
} from "@/components/displays";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormListInput } from "@/components/forms/FormListInput";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CreateRegionModal } from "@/components/modals/create-region-modal";
import { SeasonPicker } from "@/components/modals/create-region-modal/components/season-picker";
import { REGION_SEASONS } from "@/components/modals/create-region-modal/constants/seasons";
import {
  DeleteEntityModal,
  type IEntityVersion,
} from "@/components/modals/delete-entity-modal";
import { RegionNavigationSidebar } from "@/components/region-navigation-sidebar";
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
  type IRegionVersion,
  type ITimelineEra,
} from "@/lib/db/regions.service";
import { ScalePicker } from "@/pages/dashboard/tabs/world/components/scale-picker";
import { REGION_SCALES_CONSTANT } from "@/pages/dashboard/tabs/world/constants/scale-colors";
import {
  type IRegion,
  type IRegionFormData,
} from "@/pages/dashboard/tabs/world/types/region-types";

import { RegionTimeline } from "./components/region-timeline";
import { VersionCard } from "./components/version-card";

// Import the new EntityDetailLayout

interface RegionDetailViewProps {
  region: IRegion;
  editData: IRegion;
  isEditing: boolean;
  hasChanges: boolean;
  versions: IRegionVersion[];
  currentVersion: IRegionVersion | null;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allRegions: IRegion[];
  advancedSectionOpen: boolean;
  timelineSectionOpen: boolean;
  bookId: string;
  // Related data for multi-selects (legacy - não mais usados)
  characters?: Array<{ id: string; name: string; image?: string }>;
  factions?: Array<{ id: string; name: string; image?: string }>;
  races?: Array<{ id: string; name: string; image?: string }>;
  items?: Array<{ id: string; name: string; image?: string }>;
  // Timeline
  timeline: ITimelineEra[];
  onTimelineChange: (timeline: ITimelineEra[]) => void;
  // Validation
  errors: Record<string, string>;
  validateField: (field: string, value: any) => void;
  hasRequiredFieldsEmpty: boolean;
  missingFields: string[];
  // Visibility
  fieldVisibility: IFieldVisibility;
  sectionVisibility: ISectionVisibility;
  onFieldVisibilityToggle: (fieldName: string) => void;
  onSectionVisibilityToggle: (sectionName: string) => void;
  onBack: () => void;
  onViewMap: () => void;
  onNavigationSidebarToggle: () => void;
  onNavigationSidebarClose: () => void;
  onRegionSelect: (regionId: string) => void;
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
    regionData: IRegionFormData;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
  onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: unknown) => void;
  onAdvancedSectionToggle: () => void;
  onTimelineSectionToggle: () => void;
}

export function RegionDetailView({
  region,
  editData,
  isEditing,
  hasChanges,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  fileInputRef,
  allRegions,
  advancedSectionOpen,
  timelineSectionOpen,
  bookId,
  characters = [],
  factions = [],
  races = [],
  items = [],
  timeline,
  onTimelineChange,
  errors,
  validateField,
  hasRequiredFieldsEmpty,
  missingFields,
  fieldVisibility,
  sectionVisibility,
  onFieldVisibilityToggle,
  onSectionVisibilityToggle,
  onBack,
  onViewMap,
  onNavigationSidebarToggle,
  onNavigationSidebarClose,
  onRegionSelect,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onConfirmDelete,
  onVersionChange,
  onVersionCreate,
  onVersionDelete,
  onVersionUpdate,
  onImageFileChange,
  onEditDataChange,
  onAdvancedSectionToggle,
  onTimelineSectionToggle,
}: RegionDetailViewProps) {
  const { t } = useTranslation([
    "region-detail",
    "world",
    "empty-states",
    "common",
  ]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // State for controlling the create era dialog from the empty state button
  const [isCreateEraDialogOpen, setIsCreateEraDialogOpen] = useState(false);

  // Navigation for entity notes
  const navigate = useNavigate();

  // Find scale data
  const scaleData = REGION_SCALES_CONSTANT.find(
    (s) => s.value === region.scale
  );

  // Force refresh of entity selects when entering edit mode
  React.useEffect(() => {
    if (isEditing) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [isEditing]);

  // Load initial state from localStorage or use defaults
  const getInitialSectionState = () => {
    const stored = localStorage.getItem("regionDetailAdvancedSections");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          regionAnomalies: false,
          residentFactions: false,
          dominantFactions: false,
          importantCharacters: false,
          racesFound: false,
          itemsFound: false,
          regionMysteries: false,
          inspirations: false,
        };
      }
    }
    return {
      regionAnomalies: false,
      residentFactions: false,
      dominantFactions: false,
      importantCharacters: false,
      racesFound: false,
      itemsFound: false,
      regionMysteries: false,
      inspirations: false,
    };
  };

  const [openSections, setOpenSections] = useState(getInitialSectionState);

  // Save to localStorage whenever sections state changes
  useEffect(() => {
    localStorage.setItem(
      "regionDetailAdvancedSections",
      JSON.stringify(openSections)
    );
  }, [openSections]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper function to safely parse JSON arrays
  const safeJsonParse = (value: string | undefined): string[] => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Get parent region for display
  const parentRegion = region.parentId
    ? allRegions.find((r) => r.id === region.parentId)
    : null;

  // Available parent regions (excluding self)
  const availableParentRegions = allRegions.filter((r) => r.id !== region.id);

  // Render basic fields content
  const renderBasicFields = () => {
    if (isEditing) {
      return (
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="flex justify-center -mx-6">
            <div className="w-full max-w-[587px] px-6">
              <FormImageUpload
                value={imagePreview}
                onChange={(value) => onEditDataChange("image", value)}
                label={t("region-detail:fields.image")}
                helperText="opcional"
                height="h-[28rem]"
                shape="rounded"
                placeholderIcon={Map}
                id="region-image-upload"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-primary">
              {t("region-detail:fields.name")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              value={editData.name}
              onChange={(e) => onEditDataChange("name", e.target.value)}
              onBlur={() => validateField("name", editData.name)}
              placeholder={t("world:create_region.name_placeholder")}
              maxLength={200}
              className={errors.name ? "border-destructive" : ""}
              required
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

          {/* Parent Region */}
          <div className="space-y-2">
            <Label className="text-primary">
              {t("region-detail:fields.parent")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select
              value={editData.parentId || "neutral"}
              onValueChange={(value) =>
                onEditDataChange("parentId", value === "neutral" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("world:create_region.parent_placeholder")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">
                  {t("world:create_region.parent_neutral")}
                </SelectItem>
                {availableParentRegions.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scale Picker */}
          <div className="space-y-2">
            <Label className="text-primary">
              {t("region-detail:fields.scale")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <ScalePicker
              value={editData.scale}
              onChange={(value) => onEditDataChange("scale", value)}
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label className="text-primary">
              {t("region-detail:fields.summary")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              value={editData.summary || ""}
              onChange={(e) => onEditDataChange("summary", e.target.value)}
              onBlur={() => validateField("summary", editData.summary)}
              placeholder={t("world:create_region.summary_placeholder")}
              rows={4}
              maxLength={500}
              className={
                errors.summary
                  ? "resize-none border-destructive"
                  : "resize-none"
              }
            />
            {errors.summary && (
              <p className="text-xs text-destructive">{errors.summary}</p>
            )}
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{editData.summary?.length || 0}/500</span>
            </div>
          </div>
        </div>
      );
    }

    // View mode
    return (
      <div className="space-y-6">
        {/* Image Display */}
        <div className="flex justify-center -mx-6">
          <div className="w-full max-w-[587px] px-6">
            {region.image ? (
              <div className="relative w-full h-[28rem] rounded-lg overflow-hidden border">
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-fill"
                />
              </div>
            ) : (
              <DisplayImage
                icon={Map}
                height="h-[28rem]"
                width="w-full"
                shape="rounded"
              />
            )}
          </div>
        </div>

        {/* Region Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">{region.name}</h2>
            {scaleData && (
              <EntityTagBadge
                config={scaleData}
                label={t(`world:scales.${region.scale}`)}
              />
            )}
          </div>

          {parentRegion && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Map className="w-4 h-4" />
              <span>
                {t("region-detail:fields.parent_of")}: {parentRegion.name}
              </span>
            </div>
          )}

          {/* Summary - sem label no modo visualização */}
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {region.summary || (
              <span className="italic text-muted-foreground/60">
                Não especificado
              </span>
            )}
          </p>
        </div>
      </div>
    );
  };

  // Helper function to check if all fields in a group are hidden
  const areAllFieldsHidden = (fieldNames: string[]): boolean => {
    if (isEditing) return false; // Never hide sections in edit mode
    return fieldNames.every(
      (fieldName) => fieldVisibility[fieldName] === false
    );
  };

  // Define field groups for each mini-section
  const environmentFields = [
    "climate",
    "currentSeason",
    "generalDescription",
    "regionAnomalies",
  ];
  const informationFields = [
    "residentFactions",
    "dominantFactions",
    "importantCharacters",
    "racesFound",
    "itemsFound",
  ];
  const narrativeFields = [
    "narrativePurpose",
    "uniqueCharacteristics",
    "politicalImportance",
    "religiousImportance",
    "worldPerception",
    "regionMysteries",
    "inspirations",
  ];

  // Check if mini-sections should be hidden
  const hideEnvironmentSection = areAllFieldsHidden(environmentFields);
  const hideInformationSection = areAllFieldsHidden(informationFields);
  const hideNarrativeSection = areAllFieldsHidden(narrativeFields);

  // Check if entire advanced section should be hidden
  const hideEntireAdvancedSection =
    hideEnvironmentSection && hideInformationSection && hideNarrativeSection;

  // Render advanced fields content
  const renderAdvancedFields = () =>
    hideEntireAdvancedSection ? null : (
      <div className="space-y-6">
        {/* Environment Section */}
        {!hideEnvironmentSection && (
          <>
            <div className="space-y-4">
              <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
                {t("world:create_region.environment_section")}
              </h4>

              {/* Climate */}
              <FieldWithVisibilityToggle
                fieldName="climate"
                label={t("world:create_region.climate_label")}
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <>
                    <Textarea
                      value={editData.climate || ""}
                      onChange={(e) =>
                        onEditDataChange("climate", e.target.value)
                      }
                      placeholder={t("world:create_region.climate_placeholder")}
                      maxLength={500}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{editData.climate?.length || 0}/500</span>
                    </div>
                  </>
                ) : (
                  <DisplayTextarea value={region.climate} />
                )}
              </FieldWithVisibilityToggle>

              {/* Season Picker */}
              <FieldWithVisibilityToggle
                fieldName="currentSeason"
                label={
                  isEditing ? "" : t("world:create_region.current_season_label")
                }
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <SeasonPicker
                    value={editData.currentSeason}
                    customSeasonName={editData.customSeasonName}
                    onSeasonChange={(season) =>
                      onEditDataChange("currentSeason", season)
                    }
                    onCustomNameChange={(name) =>
                      onEditDataChange("customSeasonName", name)
                    }
                  />
                ) : (
                  <DisplaySelectGrid
                    value={region.currentSeason}
                    options={REGION_SEASONS.map(
                      (season): DisplaySelectGridOption => ({
                        value: season.value,
                        label:
                          season.value === "custom" && region.customSeasonName
                            ? region.customSeasonName
                            : t(`world:seasons.${season.value}`),
                        description: season.description,
                        icon: season.icon,
                        backgroundColor:
                          season.value === "spring"
                            ? "green-500/20"
                            : season.value === "summer"
                              ? "red-500/20"
                              : season.value === "autumn"
                                ? "orange-500/20"
                                : season.value === "winter"
                                  ? "blue-500/20"
                                  : "purple-500/20",
                        borderColor:
                          season.value === "spring"
                            ? "green-500/30"
                            : season.value === "summer"
                              ? "red-500/30"
                              : season.value === "autumn"
                                ? "orange-500/30"
                                : season.value === "winter"
                                  ? "blue-500/30"
                                  : "purple-500/30",
                      })
                    )}
                  />
                )}
              </FieldWithVisibilityToggle>

              {/* General Description */}
              <FieldWithVisibilityToggle
                fieldName="generalDescription"
                label={t("world:create_region.general_description_label")}
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <>
                    <Textarea
                      value={editData.generalDescription || ""}
                      onChange={(e) =>
                        onEditDataChange("generalDescription", e.target.value)
                      }
                      placeholder={t(
                        "world:create_region.general_description_placeholder"
                      )}
                      rows={5}
                      maxLength={1000}
                      className="resize-none"
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>
                        {editData.generalDescription?.length || 0}/1000
                      </span>
                    </div>
                  </>
                ) : (
                  <DisplayTextarea value={region.generalDescription} />
                )}
              </FieldWithVisibilityToggle>

              {/* Region Anomalies */}
              <FieldWithVisibilityToggle
                fieldName="regionAnomalies"
                label={
                  isEditing
                    ? t("world:create_region.region_anomalies_label")
                    : ""
                }
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <FormListInput
                    label=""
                    placeholder={t("world:create_region.anomaly_placeholder")}
                    buttonText={t("world:create_region.add_anomaly")}
                    value={
                      editData.regionAnomalies
                        ? safeJsonParse(editData.regionAnomalies)
                        : []
                    }
                    onChange={(value) =>
                      onEditDataChange("regionAnomalies", JSON.stringify(value))
                    }
                    labelClassName="text-sm font-medium text-primary"
                  />
                ) : (
                  <DisplayStringList
                    label={t("world:create_region.region_anomalies_label")}
                    items={safeJsonParse(region.regionAnomalies)}
                    open={openSections.regionAnomalies}
                    onOpenChange={() => toggleSection("regionAnomalies")}
                  />
                )}
              </FieldWithVisibilityToggle>
            </div>

            {/* Separator between Environment and Information - only show if both sections are visible */}
            {!hideInformationSection && <Separator />}
          </>
        )}

        {/* Information Section */}
        {!hideInformationSection && (
          <>
            <div className="space-y-4">
              <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
                {t("world:create_region.information_section")}
              </h4>

              {/* Resident Factions */}
              <FieldWithVisibilityToggle
                fieldName="residentFactions"
                label={
                  isEditing
                    ? t("world:create_region.resident_factions_label")
                    : ""
                }
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <FormEntityMultiSelectAuto
                    key={`resident-factions-${refreshKey}`}
                    entityType="faction"
                    bookId={bookId}
                    label=""
                    placeholder={t(
                      "world:create_region.resident_factions_placeholder"
                    )}
                    emptyText={t("world:create_region.no_factions_warning")}
                    noSelectionText={t(
                      "world:create_region.no_factions_selected"
                    )}
                    searchPlaceholder={t("world:create_region.search_faction")}
                    value={
                      editData.residentFactions
                        ? safeJsonParse(editData.residentFactions)
                        : []
                    }
                    onChange={(value) =>
                      onEditDataChange(
                        "residentFactions",
                        JSON.stringify(value)
                      )
                    }
                    labelClassName="text-sm font-medium text-primary"
                  />
                ) : (
                  <DisplayEntityList
                    label={t("world:create_region.resident_factions_label")}
                    entities={
                      safeJsonParse(region.residentFactions)
                        .map((factionId: string): DisplayEntityItem | null => {
                          const faction = factions.find(
                            (f) => f.id === factionId
                          );
                          return faction
                            ? {
                                id: faction.id,
                                name: faction.name,
                                image: faction.image
                                  ? convertFileSrc(faction.image)
                                  : undefined,
                              }
                            : null;
                        })
                        .filter(Boolean) as DisplayEntityItem[]
                    }
                    open={openSections.residentFactions}
                    onOpenChange={() => toggleSection("residentFactions")}
                  />
                )}
              </FieldWithVisibilityToggle>

              {/* Dominant Factions */}
              <FieldWithVisibilityToggle
                fieldName="dominantFactions"
                label={
                  isEditing
                    ? t("world:create_region.dominant_factions_label")
                    : ""
                }
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <FormEntityMultiSelectAuto
                    key={`dominant-factions-${refreshKey}`}
                    entityType="faction"
                    bookId={bookId}
                    label=""
                    placeholder={t(
                      "world:create_region.dominant_factions_placeholder"
                    )}
                    emptyText={t("world:create_region.no_factions_warning")}
                    noSelectionText={t(
                      "world:create_region.no_factions_selected"
                    )}
                    searchPlaceholder={t("world:create_region.search_faction")}
                    value={
                      editData.dominantFactions
                        ? safeJsonParse(editData.dominantFactions)
                        : []
                    }
                    onChange={(value) =>
                      onEditDataChange(
                        "dominantFactions",
                        JSON.stringify(value)
                      )
                    }
                    labelClassName="text-sm font-medium text-primary"
                  />
                ) : (
                  <DisplayEntityList
                    label={t("world:create_region.dominant_factions_label")}
                    entities={
                      safeJsonParse(region.dominantFactions)
                        .map((factionId: string): DisplayEntityItem | null => {
                          const faction = factions.find(
                            (f) => f.id === factionId
                          );
                          return faction
                            ? {
                                id: faction.id,
                                name: faction.name,
                                image: faction.image
                                  ? convertFileSrc(faction.image)
                                  : undefined,
                              }
                            : null;
                        })
                        .filter(Boolean) as DisplayEntityItem[]
                    }
                    open={openSections.dominantFactions}
                    onOpenChange={() => toggleSection("dominantFactions")}
                  />
                )}
              </FieldWithVisibilityToggle>

              {/* Important Characters */}
              <FieldWithVisibilityToggle
                fieldName="importantCharacters"
                label={
                  isEditing
                    ? t("world:create_region.important_characters_label")
                    : ""
                }
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <FormEntityMultiSelectAuto
                    key={`important-characters-${refreshKey}`}
                    entityType="character"
                    bookId={bookId}
                    label=""
                    placeholder={t(
                      "world:create_region.important_characters_placeholder"
                    )}
                    emptyText={t("world:create_region.no_characters_warning")}
                    noSelectionText={t(
                      "world:create_region.no_characters_selected"
                    )}
                    searchPlaceholder={t(
                      "world:create_region.search_character"
                    )}
                    value={
                      editData.importantCharacters
                        ? safeJsonParse(editData.importantCharacters)
                        : []
                    }
                    onChange={(value) =>
                      onEditDataChange(
                        "importantCharacters",
                        JSON.stringify(value)
                      )
                    }
                    labelClassName="text-sm font-medium text-primary"
                  />
                ) : (
                  <DisplayEntityList
                    label={t("world:create_region.important_characters_label")}
                    entities={
                      safeJsonParse(region.importantCharacters)
                        .map(
                          (characterId: string): DisplayEntityItem | null => {
                            const character = characters.find(
                              (c) => c.id === characterId
                            );
                            return character
                              ? {
                                  id: character.id,
                                  name: character.name,
                                  image: character.image
                                    ? convertFileSrc(character.image)
                                    : undefined,
                                }
                              : null;
                          }
                        )
                        .filter(Boolean) as DisplayEntityItem[]
                    }
                    open={openSections.importantCharacters}
                    onOpenChange={() => toggleSection("importantCharacters")}
                  />
                )}
              </FieldWithVisibilityToggle>

              {/* Races Found */}
              <FieldWithVisibilityToggle
                fieldName="racesFound"
                label={
                  isEditing ? t("world:create_region.races_found_label") : ""
                }
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <FormEntityMultiSelectAuto
                    key={`races-found-${refreshKey}`}
                    entityType="race"
                    bookId={bookId}
                    label=""
                    placeholder={t(
                      "world:create_region.races_found_placeholder"
                    )}
                    emptyText={t("world:create_region.no_races_warning")}
                    noSelectionText={t("world:create_region.no_races_selected")}
                    searchPlaceholder={t("world:create_region.search_race")}
                    value={
                      editData.racesFound
                        ? safeJsonParse(editData.racesFound)
                        : []
                    }
                    onChange={(value) =>
                      onEditDataChange("racesFound", JSON.stringify(value))
                    }
                    labelClassName="text-sm font-medium text-primary"
                  />
                ) : (
                  <DisplayEntityList
                    label={t("world:create_region.races_found_label")}
                    entities={
                      safeJsonParse(region.racesFound)
                        .map((raceId: string): DisplayEntityItem | null => {
                          const race = races.find((r) => r.id === raceId);
                          return race
                            ? {
                                id: race.id,
                                name: race.name,
                                image: race.image
                                  ? convertFileSrc(race.image)
                                  : undefined,
                              }
                            : null;
                        })
                        .filter(Boolean) as DisplayEntityItem[]
                    }
                    open={openSections.racesFound}
                    onOpenChange={() => toggleSection("racesFound")}
                  />
                )}
              </FieldWithVisibilityToggle>

              {/* Items Found */}
              <FieldWithVisibilityToggle
                fieldName="itemsFound"
                label={
                  isEditing ? t("world:create_region.items_found_label") : ""
                }
                isOptional
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
              >
                {isEditing ? (
                  <FormEntityMultiSelectAuto
                    key={`items-found-${refreshKey}`}
                    entityType="item"
                    bookId={bookId}
                    label=""
                    placeholder={t(
                      "world:create_region.items_found_placeholder"
                    )}
                    emptyText={t("world:create_region.no_items_warning")}
                    noSelectionText={t("world:create_region.no_items_selected")}
                    searchPlaceholder={t("world:create_region.search_item")}
                    value={
                      editData.itemsFound
                        ? safeJsonParse(editData.itemsFound)
                        : []
                    }
                    onChange={(value) =>
                      onEditDataChange("itemsFound", JSON.stringify(value))
                    }
                    labelClassName="text-sm font-medium text-primary"
                  />
                ) : (
                  <DisplayEntityList
                    label={t("world:create_region.items_found_label")}
                    entities={
                      safeJsonParse(region.itemsFound)
                        .map((itemId: string): DisplayEntityItem | null => {
                          const item = items.find((i) => i.id === itemId);
                          return item
                            ? {
                                id: item.id,
                                name: item.name,
                                image: item.image
                                  ? convertFileSrc(item.image)
                                  : undefined,
                              }
                            : null;
                        })
                        .filter(Boolean) as DisplayEntityItem[]
                    }
                    open={openSections.itemsFound}
                    onOpenChange={() => toggleSection("itemsFound")}
                  />
                )}
              </FieldWithVisibilityToggle>
            </div>

            {/* Separator between Information and Narrative - only show if both sections are visible */}
            {!hideNarrativeSection && <Separator />}
          </>
        )}

        {/* Narrative Section */}
        {!hideNarrativeSection && (
          <div className="space-y-4">
            <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
              {t("world:create_region.narrative_section")}
            </h4>

            {/* Narrative Purpose */}
            <FieldWithVisibilityToggle
              fieldName="narrativePurpose"
              label={t("world:create_region.narrative_purpose_label")}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Textarea
                    value={editData.narrativePurpose || ""}
                    onChange={(e) =>
                      onEditDataChange("narrativePurpose", e.target.value)
                    }
                    placeholder={t(
                      "world:create_region.narrative_purpose_placeholder"
                    )}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.narrativePurpose?.length || 0}/500</span>
                  </div>
                </>
              ) : (
                <DisplayTextarea value={region.narrativePurpose} />
              )}
            </FieldWithVisibilityToggle>

            {/* Unique Characteristics */}
            <FieldWithVisibilityToggle
              fieldName="uniqueCharacteristics"
              label={t("world:create_region.unique_characteristics_label")}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Textarea
                    value={editData.uniqueCharacteristics || ""}
                    onChange={(e) =>
                      onEditDataChange("uniqueCharacteristics", e.target.value)
                    }
                    placeholder={t(
                      "world:create_region.unique_characteristics_placeholder"
                    )}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>
                      {editData.uniqueCharacteristics?.length || 0}
                      /500
                    </span>
                  </div>
                </>
              ) : (
                <DisplayTextarea value={region.uniqueCharacteristics} />
              )}
            </FieldWithVisibilityToggle>

            {/* Political Importance */}
            <FieldWithVisibilityToggle
              fieldName="politicalImportance"
              label={t("world:create_region.political_importance_label")}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Textarea
                    value={editData.politicalImportance || ""}
                    onChange={(e) =>
                      onEditDataChange("politicalImportance", e.target.value)
                    }
                    placeholder={t(
                      "world:create_region.political_importance_placeholder"
                    )}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.politicalImportance?.length || 0}/500</span>
                  </div>
                </>
              ) : (
                <DisplayTextarea value={region.politicalImportance} />
              )}
            </FieldWithVisibilityToggle>

            {/* Religious Importance */}
            <FieldWithVisibilityToggle
              fieldName="religiousImportance"
              label={t("world:create_region.religious_importance_label")}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Textarea
                    value={editData.religiousImportance || ""}
                    onChange={(e) =>
                      onEditDataChange("religiousImportance", e.target.value)
                    }
                    placeholder={t(
                      "world:create_region.religious_importance_placeholder"
                    )}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.religiousImportance?.length || 0}/500</span>
                  </div>
                </>
              ) : (
                <DisplayTextarea value={region.religiousImportance} />
              )}
            </FieldWithVisibilityToggle>

            {/* World Perception */}
            <FieldWithVisibilityToggle
              fieldName="worldPerception"
              label={t("world:create_region.world_perception_label")}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Textarea
                    value={editData.worldPerception || ""}
                    onChange={(e) =>
                      onEditDataChange("worldPerception", e.target.value)
                    }
                    placeholder={t(
                      "world:create_region.world_perception_placeholder"
                    )}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.worldPerception?.length || 0}/500</span>
                  </div>
                </>
              ) : (
                <DisplayTextarea value={region.worldPerception} />
              )}
            </FieldWithVisibilityToggle>

            {/* Region Mysteries */}
            <FieldWithVisibilityToggle
              fieldName="regionMysteries"
              label={
                isEditing ? t("world:create_region.region_mysteries_label") : ""
              }
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <FormListInput
                  label=""
                  placeholder={t("world:create_region.mystery_placeholder")}
                  buttonText={t("world:create_region.add_mystery")}
                  value={
                    editData.regionMysteries
                      ? safeJsonParse(editData.regionMysteries)
                      : []
                  }
                  onChange={(value) =>
                    onEditDataChange("regionMysteries", JSON.stringify(value))
                  }
                  labelClassName="text-sm font-medium text-primary"
                />
              ) : (
                <DisplayStringList
                  label={t("world:create_region.region_mysteries_label")}
                  items={safeJsonParse(region.regionMysteries)}
                  open={openSections.regionMysteries}
                  onOpenChange={() => toggleSection("regionMysteries")}
                />
              )}
            </FieldWithVisibilityToggle>

            {/* Inspirations */}
            <FieldWithVisibilityToggle
              fieldName="inspirations"
              label={
                isEditing ? t("world:create_region.inspirations_label") : ""
              }
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <FormListInput
                  label=""
                  placeholder={t("world:create_region.inspiration_placeholder")}
                  buttonText={t("world:create_region.add_inspiration")}
                  value={
                    editData.inspirations
                      ? safeJsonParse(editData.inspirations)
                      : []
                  }
                  onChange={(value) =>
                    onEditDataChange("inspirations", JSON.stringify(value))
                  }
                  labelClassName="text-sm font-medium text-primary"
                />
              ) : (
                <DisplayStringList
                  label={t("world:create_region.inspirations_label")}
                  items={safeJsonParse(region.inspirations)}
                  open={openSections.inspirations}
                  onOpenChange={() => toggleSection("inspirations")}
                />
              )}
            </FieldWithVisibilityToggle>
          </div>
        )}
      </div>
    );

  // Validation message
  const validationMessage = hasRequiredFieldsEmpty ? (
    <p className="text-xs text-destructive">
      {missingFields.length > 0 ? (
        <>
          {t("region-detail:missing_fields")}:{" "}
          {missingFields
            .map((field) => {
              const fieldNames: Record<string, string> = {
                name: t("region-detail:fields.name"),
                scale: t("region-detail:fields.scale"),
                summary: t("region-detail:fields.summary"),
              };
              return fieldNames[field] || field;
            })
            .join(", ")}
        </>
      ) : (
        t("region-detail:fill_required_fields")
      )}
    </p>
  ) : undefined;

  return (
    <div className="relative">
      {/* Navigation Sidebar */}
      <RegionNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        regions={allRegions.map((r) => ({
          id: r.id,
          name: r.name,
          image: r.image,
        }))}
        currentRegionId={region.id}
        onRegionSelect={onRegionSelect}
      />

      {/* Main Layout */}
      <div className="w-full">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <EntityDetailLayout
            // Header
            onBack={onBack}
            backLabel={t("region-detail:header.back")}
            showMenuButton
            onMenuToggle={onNavigationSidebarToggle}
            menuTooltip={t("common:tooltips.quick_navigation")}
            // Mode
            isEditMode={isEditing}
            // Actions
            onEdit={onEdit}
            onDelete={onDeleteModalOpen}
            editTooltip={t("common:tooltips.edit")}
            deleteTooltip={t("common:tooltips.delete")}
            extraActions={[
              {
                label: t("region-detail:header.notes"),
                icon: NotebookPen,
                onClick: () =>
                  navigate({
                    to: "/dashboard/$dashboardId/notes/entity/$entityType/$entityId",
                    params: {
                      dashboardId: bookId,
                      entityType: "region",
                      entityId: region.id,
                    },
                    search: { entityName: region.name },
                  }),
                tooltip: t("region-detail:header.notes"),
              },
              {
                label: t("region-detail:header.view_map"),
                icon: Map,
                onClick: onViewMap,
                tooltip: t("region-detail:header.view_map"),
              },
            ]}
            editLabel={t("region-detail:header.edit")}
            deleteLabel={t("region-detail:header.delete")}
            // Edit mode actions
            onSave={onSave}
            onCancel={onCancel}
            saveLabel={t("region-detail:header.save")}
            cancelLabel={t("region-detail:header.cancel")}
            hasChanges={hasChanges}
            hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
            validationMessage={validationMessage}
            // Content
            basicFields={renderBasicFields()}
            advancedFields={renderAdvancedFields()}
            advancedSectionTitle={t("region-detail:sections.advanced_info")}
            advancedSectionOpen={advancedSectionOpen}
            onAdvancedSectionToggle={onAdvancedSectionToggle}
            // Extra sections
            extraSections={[
              {
                id: "timeline",
                title: t("empty-states:timeline.timeline_title"),
                content: (
                  <RegionTimeline
                    regionId={region.id}
                    isEditing={isEditing}
                    timeline={timeline}
                    onTimelineChange={onTimelineChange}
                    characters={characters}
                    factions={factions}
                    races={races}
                    items={items}
                    isCreateEraDialogOpen={isCreateEraDialogOpen}
                    onCreateEraDialogOpenChange={setIsCreateEraDialogOpen}
                  />
                ),
                isCollapsible: true,
                defaultOpen: timelineSectionOpen,
                isVisible: isSectionVisible("timeline", sectionVisibility),
                onVisibilityToggle: () => onSectionVisibilityToggle("timeline"),
                // Empty states
                emptyState:
                  timeline.length === 0
                    ? isEditing
                      ? "empty-edit"
                      : "empty-view"
                    : null,
                emptyIcon: Clock,
                emptyTitle: t("empty-states:timeline.no_timeline_defined"),
                emptyDescription: t("empty-states:timeline.use_edit_mode_to_add_eras"),
                addButtonLabel: t("empty-states:timeline.create_first_era"),
                onAddClick: () => setIsCreateEraDialogOpen(true),
              },
              // Chapter Metrics section (only visible in view mode)
              ...(!isEditing
                ? [
                    {
                      id: "chapter-metrics",
                      title: t("chapter-metrics:entity_section.title"),
                      content: (
                        <EntityChapterMetricsSection
                          bookId={bookId}
                          entityId={region.id}
                          entityType="region"
                          onChapterClick={(chapterId) =>
                            navigate({
                              to: "/dashboard/$dashboardId/chapters/$chapterId",
                              params: { dashboardId: bookId, chapterId },
                            })
                          }
                        />
                      ),
                      isCollapsible: true,
                      defaultOpen: false,
                    },
                  ]
                : []),
            ]}
            // Versions panel
            versionsPanel={
              <VersionsPanel title={t("region-detail:sections.versions")}>
                <EntityVersionManager<IRegionVersion, IRegion, IRegionFormData>
                  versions={versions}
                  currentVersion={currentVersion}
                  onVersionChange={onVersionChange}
                  onVersionCreate={onVersionCreate}
                  baseEntity={region}
                  i18nNamespace="region-detail"
                  renderVersionCard={({ version, isSelected, onClick }) => {
                    // Check if version has valid data
                    const hasValidData = !!version.regionData;

                    return (
                      <div className="relative">
                        <div
                          className={
                            !hasValidData ? "opacity-50 cursor-not-allowed" : ""
                          }
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
                              {t("common:actions.delete")}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  }}
                  renderCreateDialog={({
                    open,
                    onClose,
                    onConfirm,
                    baseEntity,
                  }) => (
                    <CreateVersionWithEntityDialog<IRegion, IRegionFormData>
                      open={open}
                      onClose={onClose}
                      onConfirm={onConfirm}
                      baseEntity={baseEntity}
                      i18nNamespace="region-detail"
                      renderEntityModal={({
                        open,
                        onOpenChange,
                        onConfirm,
                      }) => (
                        <CreateRegionModal
                          open={open}
                          onOpenChange={onOpenChange}
                          onConfirm={onConfirm}
                          availableRegions={[]}
                        />
                      )}
                    />
                  )}
                />
              </VersionsPanel>
            }
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteEntityModal<IRegionVersion>
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        entityName={region.name}
        entityType="region"
        currentVersion={currentVersion}
        versionName={currentVersion?.name}
        totalVersions={versions.length}
        onConfirmDelete={onConfirmDelete}
        i18nNamespace="world"
      />
    </div>
  );
}
