import React from "react";

import {
  ArrowLeft,
  Edit2,
  Trash2,
  Menu,
  Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { RACE_DOMAINS } from "@/components/modals/create-race-modal/constants/domains";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type IRace } from "@/pages/dashboard/tabs/races/types/race-types";

import { type IRaceVersion } from "../types/race-detail-types";

interface RaceDetailHeaderProps {
  race: IRace;
  editData: IRace;
  isEditing: boolean;
  currentVersion: IRaceVersion | null;
  versions: IRaceVersion[];
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onBack: () => void;
  onNavigationSidebarToggle: () => void;
  onVersionChange: (versionId: string) => void;
  onVersionCreate: (data: {
    name: string;
    description: string;
    raceData: IRace;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: any) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  imagePreview: string;
}

export function RaceDetailHeader({
  race,
  editData,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onBack,
  onNavigationSidebarToggle,
  onImageFileChange,
  onEditDataChange,
  fileInputRef,
  imagePreview,
}: RaceDetailHeaderProps) {
  const { t } = useTranslation("race-detail");

  const getDomainData = (domainLabel: string) => {
    return RACE_DOMAINS.find((d) => d.label === domainLabel);
  };

  return (
    <div className="relative w-full mb-8">
      {/* Image Section */}
      <div className="relative w-full h-72 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
        {isEditing ? (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Race Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="w-8 h-8 text-white mb-2" />
                  <p className="text-white text-sm">
                    {t("buttons.change_image")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {t("buttons.upload_image")}
                </p>
              </div>
            )}
          </div>
        ) : race?.image ? (
          <img
            src={race.image}
            alt={race?.name || "Race"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted-foreground text-lg">
              {t("empty_states.no_image")}
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageFileChange}
          className="hidden"
        />
      </div>

      {/* Action Buttons - Fixed at top */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onBack}
                className="bg-background/80 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("buttons.back")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onNavigationSidebarToggle}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="bg-background/80 backdrop-blur-sm"
              >
                {t("buttons.cancel")}
              </Button>
              <Button
                variant="magical"
                size="sm"
                onClick={onSave}
                className="animate-glow"
              >
                {t("buttons.save")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onEdit}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t("buttons.edit")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDeleteModalOpen}
                className="bg-destructive/80 backdrop-blur-sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Race Info - Overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                value={editData.name}
                onChange={(e) => onEditDataChange("name", e.target.value)}
                placeholder={t("placeholders.name")}
                className="text-3xl font-bold bg-background/80 backdrop-blur-sm"
                maxLength={100}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.name?.length || 0}/100</span>
              </div>
            </div>
            <div className="space-y-2">
              <Input
                value={editData.scientificName || ""}
                onChange={(e) =>
                  onEditDataChange("scientificName", e.target.value)
                }
                placeholder={t("placeholders.scientific_name")}
                className="text-lg italic text-muted-foreground bg-background/80 backdrop-blur-sm"
                maxLength={100}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.scientificName?.length || 0}/100</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground drop-shadow-lg">
              {race.name}
            </h1>
            {race.scientificName && (
              <p className="text-lg italic text-muted-foreground drop-shadow">
                {race.scientificName}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {race.domain?.map((domainLabel) => {
                const domainData = getDomainData(domainLabel);
                if (!domainData) return null;
                const Icon = domainData.icon;
                return (
                  <Badge
                    key={domainLabel}
                    className={`${domainData.bgColor} ${domainData.borderColor} ${domainData.color} border flex items-center gap-1.5 px-3 py-1`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{domainData.label}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
