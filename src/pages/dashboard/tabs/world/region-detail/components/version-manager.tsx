import { useState } from "react";

import { Plus, GitBranch } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type IRegion, type IRegionFormData } from "@/pages/dashboard/tabs/world/types/region-types";
import { type IRegionVersion } from "@/lib/db/regions.service";

import { VersionCard } from "./version-card";
import { CreateVersionDialog } from "./create-version-dialog";

interface VersionManagerProps {
  versions: IRegionVersion[];
  currentVersion: IRegionVersion | null;
  onVersionChange: (versionId: string | null) => void;
  onVersionCreate: (versionData: {
    name: string;
    description: string;
    regionData: IRegionFormData;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  isEditMode: boolean;
  mainRegionData: IRegion;
  translationNamespace?: string;
}

export function VersionManager({
  versions,
  currentVersion,
  onVersionChange,
  onVersionCreate,
  isEditMode,
  mainRegionData,
  translationNamespace = "region-detail",
}: VersionManagerProps) {
  const { t } = useTranslation(translationNamespace);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const mainVersion = versions.find((v) => v.isMain);
  const alternativeVersions = versions.filter((v) => !v.isMain);

  const handleVersionClick = (version: IRegionVersion) => {
    if (currentVersion?.id !== version.id) {
      onVersionChange(version.id);
    }
  };

  const handleCreateVersion = (versionData: {
    name: string;
    description: string;
    regionData: IRegionFormData;
  }) => {
    onVersionCreate(versionData);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col -mx-6 px-6">
      {/* Header with Add Button */}
      <div className="pb-3">
        <Button
          variant="magical"
          size="lg"
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full animate-glow"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("versions.add_version")}
        </Button>
      </div>

      <Separator className="mb-3" />

      {/* Versions List with Scroll */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 w-full">
          {/* Main Version */}
          {mainVersion && (
            <VersionCard
              version={mainVersion}
              isSelected={currentVersion?.id === mainVersion.id}
              onClick={() => handleVersionClick(mainVersion)}
            />
          )}

          {/* Alternative Versions */}
          {alternativeVersions.length > 0 && (
            <div className="space-y-3 w-full">
              {alternativeVersions.map((version) => (
                <VersionCard
                  key={version.id}
                  version={version}
                  isSelected={currentVersion?.id === version.id}
                  onClick={() => handleVersionClick(version)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {alternativeVersions.length === 0 && (
            <div className="w-full text-center py-6 px-4 bg-muted/30 rounded-lg">
              <GitBranch className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground mb-1">
                {t("versions.empty_state.title")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("versions.empty_state.description")}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Hint at the bottom */}
      <div className="pt-3 mt-3 border-t">
        <div className="w-full text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          <p className="mb-1">
            <strong>{t("versions.hint.title")}</strong>
          </p>
          <p>{t("versions.hint.description")}</p>
        </div>
      </div>

      {/* Create Version Dialog */}
      <CreateVersionDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConfirm={handleCreateVersion}
        baseRegion={mainRegionData}
      />
    </div>
  );
}
