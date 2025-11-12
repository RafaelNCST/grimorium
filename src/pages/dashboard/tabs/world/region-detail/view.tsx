import React from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Menu,
  Upload,
  Map,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { RegionNavigationSidebar } from "@/components/region-navigation-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SCALE_COLORS } from "@/pages/dashboard/tabs/world/constants/scale-colors";
import { Badge } from "@/components/ui/badge";
import { SeasonPicker } from "@/components/modals/create-region-modal/components/season-picker";
import { ListInput } from "@/components/modals/create-region-modal/components/list-input";
import { MultiSelect } from "@/components/modals/create-region-modal/components/multi-select";
import { REGION_SEASONS } from "@/components/modals/create-region-modal/constants/seasons";

import { DeleteRegionConfirmationDialog } from "../components/delete-region-confirmation-dialog";
import { VersionManager } from "./components/version-manager";
import { RegionTimeline } from "./components/region-timeline";
import { type ITimelineEra } from "@/lib/db/regions.service";

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
  // Related data for multi-selects
  characters: Array<{ id: string; name: string; image?: string }>;
  factions: Array<{ id: string; name: string; image?: string }>;
  races: Array<{ id: string; name: string; image?: string }>;
  items: Array<{ id: string; name: string; image?: string }>;
  // Timeline
  timeline: ITimelineEra[];
  onTimelineChange: (timeline: ITimelineEra[]) => void;
  onBack: () => void;
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
  characters,
  factions,
  races,
  items,
  timeline,
  onTimelineChange,
  onBack,
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
}: RegionDetailViewProps) {
  const { t } = useTranslation(["region-detail", "world"]);

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

  return (
    <div className="relative">
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

      <div className="w-full overflow-hidden">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isEditing && (
                  <>
                    <Button variant="ghost" onClick={onBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("region-detail:header.back")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onNavigationSidebarToggle}
                      className="hover:bg-muted"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={onCancel}>
                      {t("region-detail:header.cancel")}
                    </Button>
                    <Button
                      variant="magical"
                      className="animate-glow"
                      onClick={onSave}
                      disabled={!hasChanges}
                    >
                      {t("region-detail:header.save")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="icon" onClick={onEdit}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={onDeleteModalOpen}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content - 3 columns */}
            <div
              className={`${isEditing ? "lg:col-span-4" : "lg:col-span-3"} space-y-6`}
            >
              {/* Basic Information Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>
                    {t("region-detail:sections.basic_info")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label>
                          {t("region-detail:fields.image")}
                          <span className="text-xs text-muted-foreground ml-2">
                            ({t("world:create_region.image_recommended")})
                          </span>
                        </Label>
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                            onChange={onImageFileChange}
                            className="hidden"
                            ref={fileInputRef}
                            id="region-image-upload"
                          />
                          {imagePreview ? (
                            <div className="relative w-full h-[28rem] rounded-lg overflow-hidden border">
                              <img
                                src={imagePreview}
                                alt="Region preview"
                                className="w-full h-full object-fill"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  onEditDataChange("image", "");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <label
                              htmlFor="region-image-upload"
                              className="cursor-pointer block"
                            >
                              <div className="w-full h-[28rem] border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors rounded-lg flex flex-col items-center justify-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {t("world:create_region.upload_image")}
                                </span>
                              </div>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Name */}
                      <div className="space-y-2">
                        <Label>{t("region-detail:fields.name")} *</Label>
                        <Input
                          value={editData.name}
                          onChange={(e) =>
                            onEditDataChange("name", e.target.value)
                          }
                          placeholder={t("world:create_region.name_placeholder")}
                          maxLength={200}
                          required
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                          <span>{editData.name?.length || 0}/200</span>
                        </div>
                      </div>

                      {/* Parent Region */}
                      <div className="space-y-2">
                        <Label>{t("region-detail:fields.parent")}</Label>
                        <Select
                          value={editData.parentId || "neutral"}
                          onValueChange={(value) =>
                            onEditDataChange(
                              "parentId",
                              value === "neutral" ? null : value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "world:create_region.parent_placeholder"
                              )}
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
                        <Label>{t("region-detail:fields.scale")} *</Label>
                        <ScalePicker
                          value={editData.scale}
                          onChange={(value) => onEditDataChange("scale", value)}
                        />
                      </div>

                      {/* Summary */}
                      <div className="space-y-2">
                        <Label>{t("region-detail:fields.summary")}</Label>
                        <Textarea
                          value={editData.summary || ""}
                          onChange={(e) =>
                            onEditDataChange("summary", e.target.value)
                          }
                          placeholder={t(
                            "world:create_region.summary_placeholder"
                          )}
                          rows={4}
                          maxLength={500}
                          className="resize-none"
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                          <span>{editData.summary?.length || 0}/500</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Image Display */}
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

                      {/* Region Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-3xl font-bold">{region.name}</h2>
                          <Badge
                            className={`${SCALE_COLORS[region.scale]} bg-transparent border px-2 py-1`}
                          >
                            <span className="text-sm font-medium">
                              {t(`world:scales.${region.scale}`)}
                            </span>
                          </Badge>
                        </div>

                        {parentRegion && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Map className="w-4 h-4" />
                            <span>
                              {t("region-detail:fields.parent_of")}:{" "}
                              {parentRegion.name}
                            </span>
                          </div>
                        )}

                        {region.summary && (
                          <div className="space-y-2">
                            <Label className="text-base">
                              {t("region-detail:fields.summary")}
                            </Label>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {region.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Advanced Section - Collapsible */}
              <Collapsible
                open={advancedSectionOpen}
                onOpenChange={onAdvancedSectionToggle}
              >
                <Card className="card-magical">
                  <CardHeader>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer">
                        <CardTitle>
                          {t("region-detail:sections.advanced_info")}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          {advancedSectionOpen
                            ? t("region-detail:actions.close")
                            : t("region-detail:actions.open")}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      {/* Environment Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("world:create_region.environment_section")}
                        </h4>

                        {/* Climate */}
                        <div className="space-y-2">
                          <Label className="text-purple-600 dark:text-purple-400">{t("world:create_region.climate_label")}</Label>
                          {isEditing ? (
                            <>
                              <Input
                                value={editData.climate || ""}
                                onChange={(e) =>
                                  onEditDataChange("climate", e.target.value)
                                }
                                placeholder={t(
                                  "world:create_region.climate_placeholder"
                                )}
                                maxLength={200}
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.climate?.length || 0}/200</span>
                              </div>
                            </>
                          ) : region.climate ? (
                            <p className="text-sm">{region.climate}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </div>

                        {/* Season Picker */}
                        <div className="space-y-2">
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
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.current_season_label")}
                              </Label>
                              {(() => {
                                const selectedSeason = REGION_SEASONS.find(
                                  (s) => s.value === region.currentSeason
                                );
                                if (!selectedSeason) return null;

                                const Icon = selectedSeason.icon;
                                const displayLabel =
                                  region.currentSeason === "custom" &&
                                  region.customSeasonName
                                    ? region.customSeasonName
                                    : t(`world:seasons.${region.currentSeason}`);

                                // Extract RGB values from color classes
                                const colorMap: Record<string, string> = {
                                  "text-green-600 dark:text-green-400": "34, 197, 94",
                                  "text-amber-600 dark:text-amber-400": "251, 191, 36",
                                  "text-orange-600 dark:text-orange-400": "251, 146, 60",
                                  "text-blue-600 dark:text-blue-400": "37, 99, 235",
                                  "text-purple-600 dark:text-purple-400": "147, 51, 234",
                                };
                                const rgb = colorMap[selectedSeason.color] || "147, 51, 234";

                                return (
                                  <button
                                    type="button"
                                    disabled
                                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${selectedSeason.bgColor} ${selectedSeason.borderColor}`}
                                  >
                                    <div className={`p-3 rounded-lg ${selectedSeason.bgColor}`}>
                                      <Icon className={`w-6 h-6 ${selectedSeason.color}`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                      <p className={`font-semibold text-base ${selectedSeason.color}`}>
                                        {displayLabel}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {selectedSeason.description}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.current_season_label")}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>

                        {/* General Description */}
                        <div className="space-y-2">
                          <Label className="text-purple-600 dark:text-purple-400">
                            {t("world:create_region.general_description_label")}
                          </Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.generalDescription || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "generalDescription",
                                    e.target.value
                                  )
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
                          ) : region.generalDescription ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {region.generalDescription}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </div>

                        {/* Region Anomalies */}
                        <div className="space-y-2">
                          {isEditing ? (
                            <ListInput
                              label={t("world:create_region.region_anomalies_label")}
                              placeholder={t(
                                "world:create_region.anomaly_placeholder"
                              )}
                              buttonText={t("world:create_region.add_anomaly")}
                              value={
                                editData.regionAnomalies
                                  ? safeJsonParse(editData.regionAnomalies)
                                  : []
                              }
                              onChange={(value) =>
                                onEditDataChange(
                                  "regionAnomalies",
                                  JSON.stringify(value)
                                )
                              }
                            />
                          ) : safeJsonParse(region.regionAnomalies).length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.region_anomalies_label")}
                              </Label>
                              <ul className="list-disc list-inside space-y-1">
                                {safeJsonParse(region.regionAnomalies).map(
                                  (anomaly: string, index: number) => (
                                    <li key={index} className="text-sm">
                                      {anomaly}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.region_anomalies_label")}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Information Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("world:create_region.information_section")}
                        </h4>

                        {/* Resident Factions */}
                        <div className="space-y-2">
                          {isEditing ? (
                            <MultiSelect
                              label={t(
                                "world:create_region.resident_factions_label"
                              )}
                              placeholder={t(
                                "world:create_region.resident_factions_placeholder"
                              )}
                              emptyText={t(
                                "world:create_region.no_factions_warning"
                              )}
                              noSelectionText={t(
                                "world:create_region.no_factions_selected"
                              )}
                              searchPlaceholder={t(
                                "world:create_region.search_faction"
                              )}
                              options={factions}
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
                            />
                          ) : region.residentFactions &&
                            safeJsonParse(region.residentFactions).length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t(
                                  "world:create_region.resident_factions_label"
                                )}
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {safeJsonParse(region.residentFactions).map(
                                  (factionId: string) => {
                                    const faction = factions.find(
                                      (f) => f.id === factionId
                                    );
                                    return faction ? (
                                      <Badge key={factionId} variant="secondary">
                                        {faction.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t(
                                  "world:create_region.resident_factions_label"
                                )}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>

                        {/* Dominant Factions */}
                        <div className="space-y-2">
                          {isEditing ? (
                            <MultiSelect
                              label={t(
                                "world:create_region.dominant_factions_label"
                              )}
                              placeholder={t(
                                "world:create_region.dominant_factions_placeholder"
                              )}
                              emptyText={t(
                                "world:create_region.no_factions_warning"
                              )}
                              noSelectionText={t(
                                "world:create_region.no_factions_selected"
                              )}
                              searchPlaceholder={t(
                                "world:create_region.search_faction"
                              )}
                              options={factions}
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
                            />
                          ) : region.dominantFactions &&
                            safeJsonParse(region.dominantFactions).length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t(
                                  "world:create_region.dominant_factions_label"
                                )}
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {safeJsonParse(region.dominantFactions).map(
                                  (factionId: string) => {
                                    const faction = factions.find(
                                      (f) => f.id === factionId
                                    );
                                    return faction ? (
                                      <Badge key={factionId} variant="secondary">
                                        {faction.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t(
                                  "world:create_region.dominant_factions_label"
                                )}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>

                        {/* Important Characters */}
                        <div className="space-y-2">
                          {isEditing ? (
                            <MultiSelect
                              label={t(
                                "world:create_region.important_characters_label"
                              )}
                              placeholder={t(
                                "world:create_region.important_characters_placeholder"
                              )}
                              emptyText={t(
                                "world:create_region.no_characters_warning"
                              )}
                              noSelectionText={t(
                                "world:create_region.no_characters_selected"
                              )}
                              searchPlaceholder={t(
                                "world:create_region.search_character"
                              )}
                              options={characters}
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
                            />
                          ) : region.importantCharacters &&
                            safeJsonParse(region.importantCharacters).length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t(
                                  "world:create_region.important_characters_label"
                                )}
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {safeJsonParse(region.importantCharacters).map(
                                  (characterId: string) => {
                                    const character = characters.find(
                                      (c) => c.id === characterId
                                    );
                                    return character ? (
                                      <Badge
                                        key={characterId}
                                        variant="secondary"
                                      >
                                        {character.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t(
                                  "world:create_region.important_characters_label"
                                )}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>

                        {/* Races Found */}
                        <div className="space-y-2">
                          {isEditing ? (
                            <MultiSelect
                              label={t("world:create_region.races_found_label")}
                              placeholder={t(
                                "world:create_region.races_found_placeholder"
                              )}
                              emptyText={t(
                                "world:create_region.no_races_warning"
                              )}
                              noSelectionText={t(
                                "world:create_region.no_races_selected"
                              )}
                              searchPlaceholder={t(
                                "world:create_region.search_race"
                              )}
                              options={races}
                              value={
                                editData.racesFound
                                  ? safeJsonParse(editData.racesFound)
                                  : []
                              }
                              onChange={(value) =>
                                onEditDataChange(
                                  "racesFound",
                                  JSON.stringify(value)
                                )
                              }
                            />
                          ) : region.racesFound &&
                            safeJsonParse(region.racesFound).length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.races_found_label")}
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {safeJsonParse(region.racesFound).map(
                                  (raceId: string) => {
                                    const race = races.find(
                                      (r) => r.id === raceId
                                    );
                                    return race ? (
                                      <Badge key={raceId} variant="secondary">
                                        {race.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.races_found_label")}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>

                        {/* Items Found */}
                        <div className="space-y-2">
                          {isEditing ? (
                            <MultiSelect
                              label={t("world:create_region.items_found_label")}
                              placeholder={t(
                                "world:create_region.items_found_placeholder"
                              )}
                              emptyText={t(
                                "world:create_region.no_items_warning"
                              )}
                              noSelectionText={t(
                                "world:create_region.no_items_selected"
                              )}
                              searchPlaceholder={t(
                                "world:create_region.search_item"
                              )}
                              options={items}
                              value={
                                editData.itemsFound
                                  ? safeJsonParse(editData.itemsFound)
                                  : []
                              }
                              onChange={(value) =>
                                onEditDataChange(
                                  "itemsFound",
                                  JSON.stringify(value)
                                )
                              }
                            />
                          ) : region.itemsFound &&
                            safeJsonParse(region.itemsFound).length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.items_found_label")}
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {safeJsonParse(region.itemsFound).map(
                                  (itemId: string) => {
                                    const item = items.find(
                                      (i) => i.id === itemId
                                    );
                                    return item ? (
                                      <Badge key={itemId} variant="secondary">
                                        {item.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.items_found_label")}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Narrative Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("world:create_region.narrative_section")}
                        </h4>

                        {/* Narrative Purpose */}
                        <div className="space-y-2">
                          <Label className="text-purple-600 dark:text-purple-400">
                            {t("world:create_region.narrative_purpose_label")}
                          </Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.narrativePurpose || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "narrativePurpose",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "world:create_region.narrative_purpose_placeholder"
                                )}
                                rows={3}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.narrativePurpose?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : region.narrativePurpose ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {region.narrativePurpose}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </div>

                        {/* Unique Characteristics */}
                        <div className="space-y-2">
                          <Label className="text-purple-600 dark:text-purple-400">
                            {t(
                              "world:create_region.unique_characteristics_label"
                            )}
                          </Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.uniqueCharacteristics || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "uniqueCharacteristics",
                                    e.target.value
                                  )
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
                        </div>

                        {/* Political Importance */}
                        <div className="space-y-2">
                          <Label className="text-purple-600 dark:text-purple-400">
                            {t("world:create_region.political_importance_label")}
                          </Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.politicalImportance || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "politicalImportance",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "world:create_region.political_importance_placeholder"
                                )}
                                rows={3}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.politicalImportance?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : region.politicalImportance ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {region.politicalImportance}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </div>

                        {/* Religious Importance */}
                        <div className="space-y-2">
                          <Label className="text-purple-600 dark:text-purple-400">
                            {t("world:create_region.religious_importance_label")}
                          </Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.religiousImportance || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "religiousImportance",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "world:create_region.religious_importance_placeholder"
                                )}
                                rows={3}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.religiousImportance?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : region.religiousImportance ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {region.religiousImportance}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </div>

                        {/* World Perception */}
                        <div className="space-y-2">
                          <Label className="text-purple-600 dark:text-purple-400">
                            {t("world:create_region.world_perception_label")}
                          </Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.worldPerception || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "worldPerception",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "world:create_region.world_perception_placeholder"
                                )}
                                rows={3}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.worldPerception?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : region.worldPerception ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {region.worldPerception}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </div>

                        {/* Region Mysteries */}
                        <div className="space-y-2">
                          {isEditing ? (
                            <ListInput
                              label={t("world:create_region.region_mysteries_label")}
                              placeholder={t(
                                "world:create_region.mystery_placeholder"
                              )}
                              buttonText={t("world:create_region.add_mystery")}
                              value={
                                editData.regionMysteries
                                  ? safeJsonParse(editData.regionMysteries)
                                  : []
                              }
                              onChange={(value) =>
                                onEditDataChange(
                                  "regionMysteries",
                                  JSON.stringify(value)
                                )
                              }
                            />
                          ) : region.regionMysteries &&
                            safeJsonParse(region.regionMysteries).length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.region_mysteries_label")}
                              </Label>
                              <ul className="list-disc list-inside space-y-1">
                                {safeJsonParse(region.regionMysteries).map(
                                  (mystery: string, index: number) => (
                                    <li key={index} className="text-sm">
                                      {mystery}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.region_mysteries_label")}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>

                        {/* Inspirations */}
                        <div className="space-y-2">
                          {isEditing ? (
                            <ListInput
                              label={t("world:create_region.inspirations_label")}
                              placeholder={t(
                                "world:create_region.inspiration_placeholder"
                              )}
                              buttonText={t(
                                "world:create_region.add_inspiration"
                              )}
                              value={
                                editData.inspirations
                                  ? safeJsonParse(editData.inspirations)
                                  : []
                              }
                              onChange={(value) =>
                                onEditDataChange(
                                  "inspirations",
                                  JSON.stringify(value)
                                )
                              }
                            />
                          ) : region.inspirations &&
                            safeJsonParse(region.inspirations).length > 0 ? (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.inspirations_label")}
                              </Label>
                              <ul className="list-disc list-inside space-y-1">
                                {safeJsonParse(region.inspirations).map(
                                  (inspiration: string, index: number) => (
                                    <li key={index} className="text-sm">
                                      {inspiration}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-purple-600 dark:text-purple-400">
                                {t("world:create_region.inspirations_label")}
                              </Label>
                              <EmptyFieldState t={t} />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Timeline Section - Separate from Advanced */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>Linha do Tempo da Região</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Versions - 1 column */}
            {!isEditing && (
              <div className="lg:col-span-1 space-y-6">
                <Card className="card-magical sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {t("region-detail:sections.versions")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[600px]">
                    <VersionManager
                      versions={versions}
                      currentVersion={currentVersion}
                      onVersionChange={onVersionChange}
                      onVersionCreate={onVersionCreate}
                      onVersionDelete={onVersionDelete}
                      isEditMode={isEditing}
                      mainRegionData={region}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteRegionConfirmationDialog
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        regionName={region.name}
        currentVersion={currentVersion}
        versionName={currentVersion?.name}
        totalVersions={versions.length}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  );
}
