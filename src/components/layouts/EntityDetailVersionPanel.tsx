import * as React from "react";
import { type ReactNode } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface Version {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isMain?: boolean;
}

export interface EntityDetailVersionPanelProps {
  versions: Version[];
  currentVersionId: string;
  isMainVersion: boolean;
  onCreate: () => void;
  onSelect: (versionId: string) => void;
  createLabel?: string;
  title?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  hintTitle?: string;
  hintDescription?: string;
  renderVersionCard: (version: Version, isSelected: boolean) => ReactNode;
  renderEmptyState?: () => ReactNode;
}

/**
 * EntityDetailVersionPanel - Generic version management panel for entity detail pages
 *
 * Provides a reusable sidebar component for managing entity versions with:
 * - Create new version button
 * - Version list with custom card rendering
 * - Empty state
 * - Informational hint
 *
 * @example
 * ```tsx
 * <EntityDetailVersionPanel
 *   versions={versions}
 *   currentVersionId={currentVersion.id}
 *   isMainVersion={currentVersion.isMain}
 *   onCreate={handleCreateVersion}
 *   onSelect={handleSelectVersion}
 *   renderVersionCard={(version, isSelected) => (
 *     <VersionCard
 *       version={version}
 *       isSelected={isSelected}
 *       onClick={() => onSelect(version.id)}
 *     />
 *   )}
 * />
 * ```
 */
export function EntityDetailVersionPanel({
  versions,
  currentVersionId,
  onCreate,
  onSelect,
  createLabel = "Nova Versão",
  title = "Versões",
  emptyStateTitle = "Nenhuma versão alternativa",
  emptyStateDescription = "Crie versões alternativas para explorar diferentes possibilidades",
  hintTitle = "Dica:",
  hintDescription = "Versões permitem manter variações da entidade sem afetar a versão principal",
  renderVersionCard,
  renderEmptyState,
}: EntityDetailVersionPanelProps) {
  const mainVersion = versions.find((v) => v.isMain);
  const alternativeVersions = versions.filter((v) => !v.isMain);

  return (
    <Card className="card-magical sticky top-24 h-[600px]">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full p-6 pt-0">
        <div className="h-full flex flex-col -mx-6 px-6">
          {/* Create Button */}
          <div className="pb-3">
            <Button
              variant="magical"
              size="lg"
              onClick={onCreate}
              className="w-full animate-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              {createLabel}
            </Button>
          </div>

          <Separator className="mb-3" />

          {/* Versions List */}
          <ScrollArea className="flex-1">
            <div className="space-y-3 w-full pr-4">
              {/* Main Version */}
              {mainVersion && (
                <div>
                  {renderVersionCard(
                    mainVersion,
                    currentVersionId === mainVersion.id
                  )}
                </div>
              )}

              {/* Alternative Versions */}
              {alternativeVersions.length > 0 && (
                <div className="space-y-3 w-full">
                  {alternativeVersions.map((version) => (
                    <div key={version.id}>
                      {renderVersionCard(
                        version,
                        currentVersionId === version.id
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {alternativeVersions.length === 0 && (
                <div>
                  {renderEmptyState ? (
                    renderEmptyState()
                  ) : (
                    <div className="w-full text-center py-6 px-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">
                        {emptyStateTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {emptyStateDescription}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Hint */}
          <div className="pt-3 mt-3 border-t">
            <div className="w-full text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              <p className="mb-1">
                <strong>{hintTitle}</strong>
              </p>
              <p>{hintDescription}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
