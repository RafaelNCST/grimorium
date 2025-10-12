import { useState } from "react";

import { Plus, GitBranch } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  type ICharacter,
  type ICharacterVersion,
  type ICharacterFormData,
} from "@/types/character-types";

import { CreateVersionDialog } from "./create-version-dialog";
import { VersionCard } from "./version-card";

interface VersionManagerProps {
  versions: ICharacterVersion[];
  currentVersion: ICharacterVersion | null;
  onVersionChange: (versionId: string | null) => void;
  onVersionCreate: (versionData: {
    name: string;
    description: string;
    characterData: ICharacterFormData;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  isEditMode: boolean;
  mainCharacterData: ICharacter;
}

export function VersionManager({
  versions,
  currentVersion,
  onVersionChange,
  onVersionCreate,
  isEditMode,
  mainCharacterData,
}: VersionManagerProps) {
  const { t } = useTranslation("character-detail");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const mainVersion = versions.find((v) => v.isMain);
  const alternativeVersions = versions.filter((v) => !v.isMain);

  const handleVersionClick = (version: ICharacterVersion) => {
    if (currentVersion?.id !== version.id) {
      onVersionChange(version.id);
    }
  };

  const handleCreateVersion = (versionData: {
    name: string;
    description: string;
    characterData: ICharacterFormData;
  }) => {
    onVersionCreate(versionData);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Add Button */}
      <div className="pb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("versions.add_version")}
        </Button>
      </div>

      <Separator className="mb-3" />

      {/* Versions List with Scroll */}
      <ScrollArea className="flex-1 pr-3">
        <div className="space-y-3">
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
            <>
              <Separator className="my-3" />
              <div className="space-y-3">
                {alternativeVersions.map((version) => (
                  <VersionCard
                    key={version.id}
                    version={version}
                    isSelected={currentVersion?.id === version.id}
                    onClick={() => handleVersionClick(version)}
                  />
                ))}
              </div>
            </>
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
      <CreateVersionDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConfirm={handleCreateVersion}
        baseCharacter={mainCharacterData}
      />
    </div>
  );
}
