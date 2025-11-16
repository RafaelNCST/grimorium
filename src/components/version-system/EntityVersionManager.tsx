import { useState, ReactNode } from "react";
import { Plus, GitBranch } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface BaseVersion {
  id: string;
  name: string;
  description?: string;
  isMain: boolean;
  createdAt?: string | number;
}

export interface EntityVersionManagerProps<TVersion extends BaseVersion, TEntity, TEntityData> {
  /** Array of versions */
  versions: TVersion[];
  /** Currently selected version */
  currentVersion: TVersion | null;
  /** Callback when a version is selected */
  onVersionChange: (versionId: string | null) => void;
  /** Callback when a new version is created */
  onVersionCreate: (versionData: {
    name: string;
    description: string;
    entityData: TEntityData;
  }) => void;
  /** Base entity data for creating new versions */
  baseEntity: TEntity;
  /** i18n namespace for translations */
  i18nNamespace: string;
  /** Render prop for version card component */
  renderVersionCard: (props: {
    version: TVersion;
    isSelected: boolean;
    onClick: () => void;
  }) => ReactNode;
  /** Render prop for the create version dialog */
  renderCreateDialog: (props: {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: { name: string; description: string; entityData: TEntityData }) => void;
    baseEntity: TEntity;
  }) => ReactNode;
}

/**
 * EntityVersionManager - Generic version manager component for any entity type
 *
 * Provides a complete version management UI with:
 * - Version list with custom card rendering
 * - Create new version button
 * - Empty state
 * - Scrollable version list
 * - Helpful hints
 *
 * @example
 * ```tsx
 * <EntityVersionManager
 *   versions={regionVersions}
 *   currentVersion={currentVersion}
 *   onVersionChange={handleVersionChange}
 *   onVersionCreate={handleVersionCreate}
 *   baseEntity={region}
 *   i18nNamespace="world"
 *   renderVersionCard={({ version, isSelected, onClick }) => (
 *     <VersionCard
 *       version={version}
 *       isSelected={isSelected}
 *       onClick={onClick}
 *     />
 *   )}
 *   renderCreateDialog={({ open, onClose, onConfirm, baseEntity }) => (
 *     <CreateVersionWithEntityDialog
 *       open={open}
 *       onClose={onClose}
 *       onConfirm={onConfirm}
 *       baseEntity={baseEntity}
 *       i18nNamespace="world"
 *       renderEntityModal={...}
 *     />
 *   )}
 * />
 * ```
 */
export function EntityVersionManager<
  TVersion extends BaseVersion,
  TEntity,
  TEntityData
>({
  versions,
  currentVersion,
  onVersionChange,
  onVersionCreate,
  baseEntity,
  i18nNamespace,
  renderVersionCard,
  renderCreateDialog,
}: EntityVersionManagerProps<TVersion, TEntity, TEntityData>) {
  const { t } = useTranslation(i18nNamespace);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const mainVersion = versions.find((v) => v.isMain);
  const alternativeVersions = versions.filter((v) => !v.isMain);

  const handleVersionClick = (version: TVersion) => {
    if (currentVersion?.id !== version.id) {
      onVersionChange(version.id);
    }
  };

  const handleCreateVersion = (versionData: {
    name: string;
    description: string;
    entityData: TEntityData;
  }) => {
    onVersionCreate(versionData);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Add Button */}
      <div className="pb-3 flex-shrink-0">
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

      <Separator className="mb-3 flex-shrink-0" />

      {/* Versions List with Scroll - Fixed height for ~4 cards */}
      <ScrollArea className="h-[520px] flex-shrink-0">
        <div className="space-y-3 w-full pr-4 pb-3">
          {/* Main Version */}
          {mainVersion && renderVersionCard({
            version: mainVersion,
            isSelected: currentVersion?.id === mainVersion.id,
            onClick: () => handleVersionClick(mainVersion),
          })}

          {/* Alternative Versions */}
          {alternativeVersions.length > 0 && (
            <div className="space-y-3 w-full">
              {alternativeVersions.map((version) => (
                <div key={version.id}>
                  {renderVersionCard({
                    version,
                    isSelected: currentVersion?.id === version.id,
                    onClick: () => handleVersionClick(version),
                  })}
                </div>
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
      <div className="border-t pt-3 flex-shrink-0">
        <div className="w-full text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          <p className="mb-1">
            <strong>{t("versions.hint.title")}</strong>
          </p>
          <p>{t("versions.hint.description")}</p>
        </div>
      </div>

      {/* Create Version Dialog */}
      {renderCreateDialog({
        open: isCreateDialogOpen,
        onClose: () => setIsCreateDialogOpen(false),
        onConfirm: handleCreateVersion,
        baseEntity,
      })}
    </div>
  );
}
