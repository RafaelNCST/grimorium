import React, { useState, useEffect } from "react";

import { convertFileSrc } from "@tauri-apps/api/core";
import {
  Map,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  type IFieldVisibility,
  type ISectionVisibility,
  FieldWithVisibilityToggle,
  hasVisibleFields,
  isSectionVisible,
} from "@/components/detail-page";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CreateRegionModal } from "@/components/modals/create-region-modal";
import { ListInput } from "@/components/modals/create-region-modal/components/list-input";
import { SeasonPicker } from "@/components/modals/create-region-modal/components/season-picker";
import { REGION_SEASONS } from "@/components/modals/create-region-modal/constants/seasons";
import { RegionNavigationSidebar } from "@/components/region-navigation-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { ScalePicker } from "@/pages/dashboard/tabs/world/components/scale-picker";
import {
  type IRegion,
  type IRegionFormData,
} from "@/pages/dashboard/tabs/world/types/region-types";
import { type IRegionVersion } from "@/lib/db/regions.service";
import { REGION_SCALES_CONSTANT } from "@/pages/dashboard/tabs/world/constants/scale-colors";
import { Badge } from "@/components/ui/badge";
import { SEASON_ACTIVE_COLOR } from "@/components/modals/create-region-modal/constants/season-colors";
import { Button } from "@/components/ui/button";
import {
  DeleteEntityModal,
  type IEntityVersion,
} from "@/components/modals/delete-entity-modal";
import {
  EntityVersionManager,
  CreateVersionWithEntityDialog,
} from "@/components/version-system";

import { RegionTimeline } from "./components/region-timeline";
import { VersionCard } from "./components/version-card";

import { type ITimelineEra } from "@/lib/db/regions.service";

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

// Helper component for empty state
const EmptyFieldState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("region-detail:empty_states.no_data")}</p>
  </div>
);

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
  const { t } = useTranslation(["region-detail", "world"]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Find scale data
  const scaleData = REGION_SCALES_CONSTANT.find((s) => s.value === region.scale);

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
                helperText={`opcional - ${t("world:create_region.image_recommended")}`}
                height="h-[28rem]"
                shape="rounded"
                placeholderIcon={Map}
                placeholderText={t("world:create_region.upload_image")}
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
              <div className="relative w-full h-[28rem] bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                <Map className="w-16 h-16 text-muted-foreground/30" />
              </div>
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

  // Render advanced fields content
  const renderAdvancedFields = () => (
    <div className="space-y-6">
      {/* Environment Section */}
      {(isEditing ||
        hasVisibleFields(
          ["climate", "currentSeason", "generalDescription", "regionAnomalies"],
          fieldVisibility
        )) && (
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
              ) : region.climate ? (
                <p className="text-sm">{region.climate}</p>
              ) : (
                <EmptyFieldState t={t} />
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
              ) : region.currentSeason ? (
                (() => {
                  const selectedSeason = REGION_SEASONS.find(
                    (s) => s.value === region.currentSeason
                  );
                  if (!selectedSeason) return null;

                  const Icon = selectedSeason.icon;
                  const displayLabel =
                    region.currentSeason === "custom" && region.customSeasonName
                      ? region.customSeasonName
                      : t(`world:seasons.${region.currentSeason}`);

                  return (
                    <div
                      className={`
                          relative p-4 rounded-lg border-2 text-left
                          ${SEASON_ACTIVE_COLOR[region.currentSeason]} text-foreground
                        `}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{displayLabel}</p>
                          <p className="text-xs mt-1 opacity-80">
                            {selectedSeason.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <EmptyFieldState t={t} />
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
                    <span>{editData.generalDescription?.length || 0}/1000</span>
                  </div>
                </>
              ) : region.generalDescription ? (
                <p className="text-sm whitespace-pre-wrap">
                  {region.generalDescription}
                </p>
              ) : (
                <EmptyFieldState t={t} />
              )}
            </FieldWithVisibilityToggle>

            {/* Region Anomalies */}
            <FieldWithVisibilityToggle
              fieldName="regionAnomalies"
              label={
                isEditing ? t("world:create_region.region_anomalies_label") : ""
              }
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <ListInput
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
                <Collapsible
                  open={openSections.regionAnomalies}
                  onOpenChange={() => toggleSection("regionAnomalies")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <p className="text-sm font-semibold text-primary">
                      {t("world:create_region.region_anomalies_label")}
                      {safeJsonParse(region.regionAnomalies).length > 0 && (
                        <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                          ({safeJsonParse(region.regionAnomalies).length})
                        </span>
                      )}
                    </p>
                    {openSections.regionAnomalies ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {safeJsonParse(region.regionAnomalies).length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {safeJsonParse(region.regionAnomalies).map(
                          (anomaly: string, index: number) => (
                            <li key={index} className="text-sm">
                              {anomaly}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <EmptyFieldState t={t} />
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </FieldWithVisibilityToggle>
          </div>

          {/* Separator - only show if Information section will be visible */}
          {(isEditing ||
            hasVisibleFields(
              [
                "residentFactions",
                "dominantFactions",
                "importantCharacters",
                "racesFound",
                "itemsFound",
              ],
              fieldVisibility
            )) && <Separator />}
        </>
      )}

      {/* Information Section */}
      {(isEditing ||
        hasVisibleFields(
          [
            "residentFactions",
            "dominantFactions",
            "importantCharacters",
            "racesFound",
            "itemsFound",
          ],
          fieldVisibility
        )) && (
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
                    onEditDataChange("residentFactions", JSON.stringify(value))
                  }
                  labelClassName="text-sm font-medium text-primary"
                />
              ) : (
                <Collapsible
                  open={openSections.residentFactions}
                  onOpenChange={() => toggleSection("residentFactions")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <p className="text-sm font-semibold text-primary">
                      {t("world:create_region.resident_factions_label")}
                      {safeJsonParse(region.residentFactions).length > 0 && (
                        <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                          ({safeJsonParse(region.residentFactions).length})
                        </span>
                      )}
                    </p>
                    {openSections.residentFactions ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {safeJsonParse(region.residentFactions).length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {safeJsonParse(region.residentFactions).map(
                          (factionId: string) => {
                            const faction = factions.find(
                              (f) => f.id === factionId
                            );
                            return faction ? (
                              <div
                                key={factionId}
                                className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                              >
                                {faction.image ? (
                                  <img
                                    src={convertFileSrc(faction.image)}
                                    alt={faction.name}
                                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs text-muted-foreground font-semibold">
                                      {faction.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className="text-sm font-medium">
                                  {faction.name}
                                </span>
                              </div>
                            ) : null;
                          }
                        )}
                      </div>
                    ) : (
                      <EmptyFieldState t={t} />
                    )}
                  </CollapsibleContent>
                </Collapsible>
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
                    onEditDataChange("dominantFactions", JSON.stringify(value))
                  }
                  labelClassName="text-sm font-medium text-primary"
                />
              ) : (
                <Collapsible
                  open={openSections.dominantFactions}
                  onOpenChange={() => toggleSection("dominantFactions")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <p className="text-sm font-semibold text-primary">
                      {t("world:create_region.dominant_factions_label")}
                      {safeJsonParse(region.dominantFactions).length > 0 && (
                        <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                          ({safeJsonParse(region.dominantFactions).length})
                        </span>
                      )}
                    </p>
                    {openSections.dominantFactions ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {safeJsonParse(region.dominantFactions).length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {safeJsonParse(region.dominantFactions).map(
                          (factionId: string) => {
                            const faction = factions.find(
                              (f) => f.id === factionId
                            );
                            return faction ? (
                              <div
                                key={factionId}
                                className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                              >
                                {faction.image ? (
                                  <img
                                    src={convertFileSrc(faction.image)}
                                    alt={faction.name}
                                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs text-muted-foreground font-semibold">
                                      {faction.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className="text-sm font-medium">
                                  {faction.name}
                                </span>
                              </div>
                            ) : null;
                          }
                        )}
                      </div>
                    ) : (
                      <EmptyFieldState t={t} />
                    )}
                  </CollapsibleContent>
                </Collapsible>
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
                  searchPlaceholder={t("world:create_region.search_character")}
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
                <Collapsible
                  open={openSections.importantCharacters}
                  onOpenChange={() => toggleSection("importantCharacters")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <p className="text-sm font-semibold text-primary">
                      {t("world:create_region.important_characters_label")}
                      {safeJsonParse(region.importantCharacters).length > 0 && (
                        <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                          ({safeJsonParse(region.importantCharacters).length})
                        </span>
                      )}
                    </p>
                    {openSections.importantCharacters ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {safeJsonParse(region.importantCharacters).length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {safeJsonParse(region.importantCharacters).map(
                          (characterId: string) => {
                            const character = characters.find(
                              (c) => c.id === characterId
                            );
                            return character ? (
                              <div
                                key={characterId}
                                className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                              >
                                {character.image ? (
                                  <img
                                    src={convertFileSrc(character.image)}
                                    alt={character.name}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs text-muted-foreground font-semibold">
                                      {character.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className="text-sm font-medium">
                                  {character.name}
                                </span>
                              </div>
                            ) : null;
                          }
                        )}
                      </div>
                    ) : (
                      <EmptyFieldState t={t} />
                    )}
                  </CollapsibleContent>
                </Collapsible>
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
                  placeholder={t("world:create_region.races_found_placeholder")}
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
                <Collapsible
                  open={openSections.racesFound}
                  onOpenChange={() => toggleSection("racesFound")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <p className="text-sm font-semibold text-primary">
                      {t("world:create_region.races_found_label")}
                      {safeJsonParse(region.racesFound).length > 0 && (
                        <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                          ({safeJsonParse(region.racesFound).length})
                        </span>
                      )}
                    </p>
                    {openSections.racesFound ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {safeJsonParse(region.racesFound).length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {safeJsonParse(region.racesFound).map(
                          (raceId: string) => {
                            const race = races.find((r) => r.id === raceId);
                            return race ? (
                              <div
                                key={raceId}
                                className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                              >
                                {race.image ? (
                                  <img
                                    src={convertFileSrc(race.image)}
                                    alt={race.name}
                                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs text-muted-foreground font-semibold">
                                      {race.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className="text-sm font-medium">
                                  {race.name}
                                </span>
                              </div>
                            ) : null;
                          }
                        )}
                      </div>
                    ) : (
                      <EmptyFieldState t={t} />
                    )}
                  </CollapsibleContent>
                </Collapsible>
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
                  placeholder={t("world:create_region.items_found_placeholder")}
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
                <Collapsible
                  open={openSections.itemsFound}
                  onOpenChange={() => toggleSection("itemsFound")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                    <p className="text-sm font-semibold text-primary">
                      {t("world:create_region.items_found_label")}
                      {safeJsonParse(region.itemsFound).length > 0 && (
                        <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                          ({safeJsonParse(region.itemsFound).length})
                        </span>
                      )}
                    </p>
                    {openSections.itemsFound ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {safeJsonParse(region.itemsFound).length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {safeJsonParse(region.itemsFound).map(
                          (itemId: string) => {
                            const item = items.find((i) => i.id === itemId);
                            return item ? (
                              <div
                                key={itemId}
                                className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                              >
                                {item.image ? (
                                  <img
                                    src={convertFileSrc(item.image)}
                                    alt={item.name}
                                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs text-muted-foreground font-semibold">
                                      {item.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className="text-sm font-medium">
                                  {item.name}
                                </span>
                              </div>
                            ) : null;
                          }
                        )}
                      </div>
                    ) : (
                      <EmptyFieldState t={t} />
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </FieldWithVisibilityToggle>
          </div>

          {/* Separator - only show if Narrative section will be visible */}
          {(isEditing ||
            hasVisibleFields(
              [
                "narrativePurpose",
                "uniqueCharacteristics",
                "politicalImportance",
                "religiousImportance",
                "worldPerception",
                "regionMysteries",
                "inspirations",
              ],
              fieldVisibility
            )) && <Separator />}
        </>
      )}

      {/* Narrative Section */}
      {(isEditing ||
        hasVisibleFields(
          [
            "narrativePurpose",
            "uniqueCharacteristics",
            "politicalImportance",
            "religiousImportance",
            "worldPerception",
            "regionMysteries",
            "inspirations",
          ],
          fieldVisibility
        )) && (
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
            ) : region.narrativePurpose ? (
              <p className="text-sm whitespace-pre-wrap">
                {region.narrativePurpose}
              </p>
            ) : (
              <EmptyFieldState t={t} />
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
            ) : region.uniqueCharacteristics ? (
              <p className="text-sm whitespace-pre-wrap">
                {region.uniqueCharacteristics}
              </p>
            ) : (
              <EmptyFieldState t={t} />
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
            ) : region.politicalImportance ? (
              <p className="text-sm whitespace-pre-wrap">
                {region.politicalImportance}
              </p>
            ) : (
              <EmptyFieldState t={t} />
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
            ) : region.religiousImportance ? (
              <p className="text-sm whitespace-pre-wrap">
                {region.religiousImportance}
              </p>
            ) : (
              <EmptyFieldState t={t} />
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
            ) : region.worldPerception ? (
              <p className="text-sm whitespace-pre-wrap">
                {region.worldPerception}
              </p>
            ) : (
              <EmptyFieldState t={t} />
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
              <ListInput
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
              <Collapsible
                open={openSections.regionMysteries}
                onOpenChange={() => toggleSection("regionMysteries")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                  <p className="text-sm font-semibold text-primary">
                    {t("world:create_region.region_mysteries_label")}
                    {safeJsonParse(region.regionMysteries).length > 0 && (
                      <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                        ({safeJsonParse(region.regionMysteries).length})
                      </span>
                    )}
                  </p>
                  {openSections.regionMysteries ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  {safeJsonParse(region.regionMysteries).length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {safeJsonParse(region.regionMysteries).map(
                        (mystery: string, index: number) => (
                          <li key={index} className="text-sm">
                            {mystery}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <EmptyFieldState t={t} />
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}
          </FieldWithVisibilityToggle>

          {/* Inspirations */}
          <FieldWithVisibilityToggle
            fieldName="inspirations"
            label={isEditing ? t("world:create_region.inspirations_label") : ""}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <ListInput
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
              <Collapsible
                open={openSections.inspirations}
                onOpenChange={() => toggleSection("inspirations")}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                  <p className="text-sm font-semibold text-primary">
                    {t("world:create_region.inspirations_label")}
                    {safeJsonParse(region.inspirations).length > 0 && (
                      <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                        ({safeJsonParse(region.inspirations).length})
                      </span>
                    )}
                  </p>
                  {openSections.inspirations ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  {safeJsonParse(region.inspirations).length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {safeJsonParse(region.inspirations).map(
                        (inspiration: string, index: number) => (
                          <li key={index} className="text-sm">
                            {inspiration}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <EmptyFieldState t={t} />
                  )}
                </CollapsibleContent>
              </Collapsible>
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
      <div className="w-full overflow-hidden">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <EntityDetailLayout
            // Header
            onBack={onBack}
            backLabel={t("region-detail:header.back")}
            showMenuButton
            onMenuToggle={onNavigationSidebarToggle}
            // Mode
            isEditMode={isEditing}
            // Actions
            onEdit={onEdit}
            onDelete={onDeleteModalOpen}
            extraActions={[
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
            advancedFields={
              isEditing ||
              hasVisibleFields(
                [
                  "climate",
                  "currentSeason",
                  "generalDescription",
                  "regionAnomalies",
                  "residentFactions",
                  "dominantFactions",
                  "importantCharacters",
                  "racesFound",
                  "itemsFound",
                  "narrativePurpose",
                  "uniqueCharacteristics",
                  "politicalImportance",
                  "religiousImportance",
                  "worldPerception",
                  "regionMysteries",
                  "inspirations",
                ],
                fieldVisibility
              )
                ? renderAdvancedFields()
                : undefined
            }
            advancedSectionTitle={t("region-detail:sections.advanced_info")}
            advancedSectionOpen={advancedSectionOpen}
            onAdvancedSectionToggle={onAdvancedSectionToggle}
            // Extra sections
            extraSections={[
              {
                id: "timeline",
                title: "Linha do Tempo da Região",
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
                  />
                ),
                isCollapsible: true,
                defaultOpen: timelineSectionOpen,
                isVisible: isSectionVisible("timeline", sectionVisibility),
                onVisibilityToggle: () => onSectionVisibilityToggle("timeline"),
              },
            ]}
            // Versions panel
            versionsPanel={
              <Card className="card-magical sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-base">
                    {t("region-detail:sections.versions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-6 pt-0 overflow-hidden">
                  <EntityVersionManager<
                    IRegionVersion,
                    IRegion,
                    IRegionFormData
                  >
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
                              !hasValidData
                                ? "opacity-50 cursor-not-allowed"
                                : ""
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
                                Excluir
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
                </CardContent>
              </Card>
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
