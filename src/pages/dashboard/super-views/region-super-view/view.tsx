import React, { useState, useEffect } from "react";

import { Map } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayImage,
  DisplayTextarea,
  DisplayStringList,
  DisplaySelectGrid,
  type DisplaySelectGridOption,
} from "@/components/displays";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { REGION_SEASONS } from "@/components/modals/create-region-modal/constants/seasons";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Separator } from "@/components/ui/separator";
import { REGION_SCALES_CONSTANT } from "@/pages/dashboard/tabs/world/constants/scale-colors";
import type { IRegion } from "@/pages/dashboard/tabs/world/types/region-types";

interface RegionSuperViewProps {
  region: IRegion;
  displayData: IRegion;
  bookId: string;
  onBack: () => void;
}

// Helper component for empty state
const _EmptyFieldState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("region-detail:empty_states.no_data")}</p>
  </div>
);

export function RegionSuperView({
  region,
  displayData: _displayData,
  bookId: _bookId,
  onBack,
}: RegionSuperViewProps) {
  const { t } = useTranslation(["region-detail", "world"] as any);

  // Mock field visibility - all visible in read-only mode
  const fieldVisibility: Record<string, boolean> = {};
  const isEditing = false;
  const onFieldVisibilityToggle = () => {};

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

  // Find scale data
  const scaleData = REGION_SCALES_CONSTANT.find(
    (s) => s.value === region.scale
  );

  // Load initial state from localStorage or use defaults
  const getInitialSectionState = () => {
    const stored = localStorage.getItem("regionDetailAdvancedSections");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          regionAnomalies: false,
          regionMysteries: false,
          inspirations: false,
        };
      }
    }
    return {
      regionAnomalies: false,
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

  // ==================
  // BASIC FIELDS
  // ==================
  const basicFields = (
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
              text={t("world:region_map.no_image")}
              height="h-[28rem]"
              width="w-full"
              shape="rounded"
            />
          )}
        </div>
      </div>

      {/* Region Info - Card style with fields stacked */}
      <div className="space-y-3">
        {/* Name and Scale Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">{region.name}</h2>
          {scaleData && (
            <EntityTagBadge
              config={scaleData}
              label={t(`world:scales.${region.scale}`)}
            />
          )}
        </div>

        {/* Summary */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {region.summary || (
              <span className="italic text-muted-foreground/60">
                {t("region-detail:empty_states.no_data")}
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
      {/* AMBIENTE Section */}
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
          <DisplayTextarea value={region.climate} />
        </FieldWithVisibilityToggle>

        {/* Current Season */}
        <FieldWithVisibilityToggle
          fieldName="currentSeason"
          label={t("world:create_region.current_season_label")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
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
          <DisplayTextarea value={region.generalDescription} />
        </FieldWithVisibilityToggle>

        {/* Region Anomalies */}
        <FieldWithVisibilityToggle
          fieldName="regionAnomalies"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("world:create_region.region_anomalies_label")}
            items={safeJsonParse(region.regionAnomalies)}
            open={openSections.regionAnomalies}
            onOpenChange={() => toggleSection("regionAnomalies")}
          />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* NARRATIVA Section */}
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
          <DisplayTextarea value={region.narrativePurpose} />
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
          <DisplayTextarea value={region.uniqueCharacteristics} />
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
          <DisplayTextarea value={region.politicalImportance} />
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
          <DisplayTextarea value={region.religiousImportance} />
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
          <DisplayTextarea value={region.worldPerception} />
        </FieldWithVisibilityToggle>

        {/* Region Mysteries */}
        <FieldWithVisibilityToggle
          fieldName="regionMysteries"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("world:create_region.region_mysteries_label")}
            items={safeJsonParse(region.regionMysteries)}
            open={openSections.regionMysteries}
            onOpenChange={() => toggleSection("regionMysteries")}
          />
        </FieldWithVisibilityToggle>

        {/* Inspirations */}
        <FieldWithVisibilityToggle
          fieldName="inspirations"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayStringList
            label={t("world:create_region.inspirations_label")}
            items={safeJsonParse(region.inspirations)}
            open={openSections.inspirations}
            onOpenChange={() => toggleSection("inspirations")}
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
          backLabel={t("region-detail:header.back")}
          // Mode
          isEditMode={false}
          // Content
          basicFields={basicFields}
          advancedFields={advancedFields}
          advancedSectionTitle={t("region-detail:sections.advanced_info")}
          advancedSectionOpen
        />
      </div>
    </div>
  );
}
