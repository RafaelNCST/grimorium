import * as React from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { CreateVersionDialog } from "./CreateVersionDialog";
import { VersionCard } from "./VersionCard";

export interface VersionManagerVersion {
  id: string;
  name: string;
  description?: string;
  isMain: boolean;
  createdAt: string | number;
}

export interface CreateVersionData {
  name: string;
  description?: string;
}

export interface VersionManagerProps<T extends VersionManagerVersion> {
  versions: T[];
  currentVersionId?: string | null;
  onVersionSelect: (versionId: string) => void;
  onVersionCreate: (data: CreateVersionData) => Promise<void>;
  onVersionUpdate?: (
    versionId: string,
    data: Partial<CreateVersionData>
  ) => Promise<void>;
  onVersionDelete?: (versionId: string) => Promise<void>;
  onVersionActivate?: (versionId: string) => Promise<void>;
  entityType?: string;
  className?: string;
  showCreateButton?: boolean;
}

/**
 * VersionManager - Complete version management UI
 */
export const VersionManager = React.memo(
  ({
    versions,
    currentVersionId,
    onVersionSelect,
    onVersionCreate,
    onVersionUpdate,
    onVersionDelete,
    onVersionActivate,
    entityType = "entidade",
    className,
    showCreateButton = true,
  }: VersionManagerProps<T>) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {showCreateButton && (
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Nova Versão
          </Button>
        )}

        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {versions.map((version) => (
              <VersionCard
                key={version.id}
                version={version}
                isActive={version.id === currentVersionId}
                onSelect={() => onVersionSelect(version.id)}
                onEdit={
                  onVersionUpdate
                    ? () => {
                        // TODO: Implement edit dialog
                      }
                    : undefined
                }
                onDelete={
                  onVersionDelete && !version.isMain
                    ? () => onVersionDelete(version.id)
                    : undefined
                }
                onActivate={
                  onVersionActivate && !version.isMain
                    ? () => onVersionActivate(version.id)
                    : undefined
                }
              />
            ))}
          </div>
        </ScrollArea>

        <CreateVersionDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={onVersionCreate}
          entityType={entityType}
        />
      </div>
    );
  }
);
VersionManager.displayName = "VersionManager";
