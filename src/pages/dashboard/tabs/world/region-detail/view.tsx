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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScalePicker } from "@/pages/dashboard/tabs/world/components/scale-picker";
import {
  type IRegion,
  type IRegionFormData,
} from "@/pages/dashboard/tabs/world/types/region-types";
import { type IRegionVersion } from "@/lib/db/regions.service";
import { SCALE_COLORS } from "@/pages/dashboard/tabs/world/constants/scale-colors";
import { Badge } from "@/components/ui/badge";

import { DeleteRegionConfirmationDialog } from "../components/delete-region-confirmation-dialog";
import { VersionManager } from "./components/version-manager";

interface RegionDetailViewProps {
  region: IRegion;
  editData: IRegion;
  isEditing: boolean;
  versions: IRegionVersion[];
  currentVersion: IRegionVersion | null;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allRegions: IRegion[];
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
}

export function RegionDetailView({
  region,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  fileInputRef,
  allRegions,
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
}: RegionDetailViewProps) {
  const { t } = useTranslation(["region-detail", "world"]);

  // Get parent region for display
  const parentRegion = region.parentId
    ? allRegions.find((r) => r.id === region.parentId)
    : null;

  // Available parent regions (excluding self)
  const availableParentRegions = allRegions.filter((r) => r.id !== region.id);

  return (
    <div className="relative min-h-screen">
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
