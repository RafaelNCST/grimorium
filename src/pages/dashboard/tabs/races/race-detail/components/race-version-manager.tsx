import { useState } from "react";

import { Plus, GitBranch } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { CreateRaceVersionDialog } from "./create-race-version-dialog";
import { RaceVersionCard } from "./race-version-card";

import type { IRace } from "../../types/race-types";
import type { IRaceVersion } from "../types/race-detail-types";

interface RaceVersionManagerProps {
  versions: IRaceVersion[];
  currentVersion: IRaceVersion | null;
  onVersionChange: (versionId: string | null) => void;
  onVersionCreate: (data: {
    name: string;
    description: string;
    raceData: IRace;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  isEditMode: boolean;
  mainRaceData: IRace;
  translationNamespace?: string;
}

export function RaceVersionManager({
  versions,
  currentVersion,
  onVersionChange,
  onVersionCreate,
  isEditMode,
  mainRaceData,
  translationNamespace = "race-detail",
}: RaceVersionManagerProps) {
  const { t } = useTranslation(translationNamespace);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const mainVersion = versions.find((v) => v.isMain);
  const alternativeVersions = versions.filter((v) => !v.isMain);

  const handleVersionClick = (version: IRaceVersion) => {
    if (currentVersion?.id !== version.id) {
      onVersionChange(version.id);
    }
  };

  const handleCreateVersion = (data: {
    name: string;
    description: string;
    raceData: IRace;
  }) => {
    onVersionCreate(data);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
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
      <ScrollArea className="flex-1 pr-3">
        <div className="space-y-3">
          {/* Main Version */}
          {mainVersion && (
            <RaceVersionCard
              version={mainVersion}
              isSelected={currentVersion?.id === mainVersion.id}
              onClick={() => handleVersionClick(mainVersion)}
            />
          )}

          {/* Alternative Versions */}
          {alternativeVersions.length > 0 && (
            <div className="space-y-3">
              {alternativeVersions.map((version) => (
                <RaceVersionCard
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
            <div className="text-center py-6 px-4 bg-muted/30 rounded-lg">
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
        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          <p className="mb-1">
            <strong>{t("versions.hint.title")}</strong>
          </p>
          <p>{t("versions.hint.description")}</p>
        </div>
      </div>

      {/* Create Version Dialog */}
      <CreateRaceVersionDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConfirm={handleCreateVersion}
        baseRace={mainRaceData}
      />
    </div>
  );
}
