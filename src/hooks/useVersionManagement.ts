import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export interface IVersion<T> {
  id: string;
  name: string;
  description?: string;
  isMain: boolean;
  entityData: T;
  createdAt: string | number;
  updatedAt?: string | number;
}

export interface CreateVersionData {
  name: string;
  description?: string;
}

export interface UpdateVersionData {
  name?: string;
  description?: string;
}

export interface UseVersionManagementOptions<T> {
  entityId: string;
  versions: IVersion<T>[];
  currentVersionId?: string | null;
  onVersionChange?: (versionId: string, version: IVersion<T>) => Promise<void>;
  onVersionCreate?: (versionData: CreateVersionData, currentEntityData: T) => Promise<IVersion<T>>;
  onVersionUpdate?: (versionId: string, updateData: UpdateVersionData) => Promise<void>;
  onVersionDelete?: (versionId: string) => Promise<void>;
  onVersionActivate?: (versionId: string) => Promise<void>;
  hasUnsavedChanges?: boolean;
  entityType?: string; // for toast messages
}

export interface UseVersionManagementReturn<T> {
  currentVersion: IVersion<T> | null;
  isChangingVersion: boolean;
  handleVersionChange: (versionId: string) => Promise<void>;
  handleVersionCreate: (data: CreateVersionData, currentEntityData: T) => Promise<void>;
  handleVersionUpdate: (versionId: string, data: UpdateVersionData) => Promise<void>;
  handleVersionDelete: (versionId: string) => Promise<void>;
  handleVersionActivate: (versionId: string) => Promise<void>;
}

/**
 * Hook for managing entity versions
 * @param options - Configuration options
 * @returns Version management state and functions
 */
export function useVersionManagement<T>({
  entityId,
  versions,
  currentVersionId,
  onVersionChange,
  onVersionCreate,
  onVersionUpdate,
  onVersionDelete,
  onVersionActivate,
  hasUnsavedChanges = false,
  entityType = 'entity',
}: UseVersionManagementOptions<T>): UseVersionManagementReturn<T> {
  const [currentVersion, setCurrentVersion] = useState<IVersion<T> | null>(null);
  const [isChangingVersion, setIsChangingVersion] = useState(false);

  // Initialize current version based on currentVersionId or main version
  useEffect(() => {
    if (versions.length === 0) {
      setCurrentVersion(null);
      return;
    }

    let selectedVersion: IVersion<T> | undefined;

    if (currentVersionId) {
      selectedVersion = versions.find((v) => v.id === currentVersionId);

      // If version from URL doesn't exist, warn user and fall back to main
      if (!selectedVersion) {
        console.warn(`[useVersionManagement] Version ${currentVersionId} not found, falling back to main version`);
        toast.warning('Versão não encontrada, exibindo versão principal');
        selectedVersion = versions.find((v) => v.isMain);
      }
    } else {
      selectedVersion = versions.find((v) => v.isMain);
    }

    if (selectedVersion) {
      setCurrentVersion(selectedVersion);
    }
  }, [versions, currentVersionId]);

  // Handle version change with unsaved changes check
  const handleVersionChange = useCallback(
    async (versionId: string) => {
      if (!onVersionChange) {
        console.warn('[useVersionManagement] No onVersionChange handler provided');
        return;
      }

      const version = versions.find((v) => v.id === versionId);
      if (!version) {
        console.error(`[useVersionManagement] Version ${versionId} not found`);
        toast.error('Versão não encontrada');
        return;
      }

      // Check for unsaved changes
      if (hasUnsavedChanges) {
        const confirmed = window.confirm(
          'Você tem alterações não salvas. Deseja descartá-las e trocar de versão?'
        );
        if (!confirmed) {
          return;
        }
      }

      setIsChangingVersion(true);
      try {
        await onVersionChange(versionId, version);
        setCurrentVersion(version);
      } catch (error) {
        console.error('[useVersionManagement] Error changing version:', error);
        toast.error('Erro ao trocar de versão');

        // Rollback to previous version
        if (currentVersion) {
          setCurrentVersion(currentVersion);
        }
      } finally {
        setIsChangingVersion(false);
      }
    },
    [versions, onVersionChange, hasUnsavedChanges, currentVersion]
  );

  // Handle version creation
  const handleVersionCreate = useCallback(
    async (data: CreateVersionData, currentEntityData: T) => {
      if (!onVersionCreate) {
        console.warn('[useVersionManagement] No onVersionCreate handler provided');
        return;
      }

      try {
        const newVersion = await onVersionCreate(data, currentEntityData);
        setCurrentVersion(newVersion);
        toast.success(`Versão "${data.name}" criada com sucesso!`);
      } catch (error) {
        console.error('[useVersionManagement] Error creating version:', error);
        toast.error('Erro ao criar versão');
      }
    },
    [onVersionCreate]
  );

  // Handle version update
  const handleVersionUpdate = useCallback(
    async (versionId: string, data: UpdateVersionData) => {
      if (!onVersionUpdate) {
        console.warn('[useVersionManagement] No onVersionUpdate handler provided');
        return;
      }

      try {
        await onVersionUpdate(versionId, data);

        // Update current version if it's the one being updated
        if (currentVersion?.id === versionId) {
          setCurrentVersion({
            ...currentVersion,
            name: data.name ?? currentVersion.name,
            description: data.description ?? currentVersion.description,
          });
        }

        toast.success('Versão atualizada com sucesso!');
      } catch (error) {
        console.error('[useVersionManagement] Error updating version:', error);
        toast.error('Erro ao atualizar versão');
      }
    },
    [onVersionUpdate, currentVersion]
  );

  // Handle version deletion
  const handleVersionDelete = useCallback(
    async (versionId: string) => {
      if (!onVersionDelete) {
        console.warn('[useVersionManagement] No onVersionDelete handler provided');
        return;
      }

      const versionToDelete = versions.find((v) => v.id === versionId);

      // Don't allow deleting main version
      if (versionToDelete?.isMain) {
        toast.error('Não é possível excluir a versão principal');
        return;
      }

      try {
        await onVersionDelete(versionId);

        // If deleted version was current, switch to main
        if (currentVersion?.id === versionId) {
          const mainVersion = versions.find((v) => v.isMain);
          if (mainVersion) {
            setCurrentVersion(mainVersion);
          }
        }

        toast.success('Versão excluída com sucesso!');
      } catch (error) {
        console.error('[useVersionManagement] Error deleting version:', error);
        toast.error('Erro ao excluir versão');
      }
    },
    [versions, onVersionDelete, currentVersion]
  );

  // Handle version activation (set as main)
  const handleVersionActivate = useCallback(
    async (versionId: string) => {
      if (!onVersionActivate) {
        console.warn('[useVersionManagement] No onVersionActivate handler provided');
        return;
      }

      try {
        await onVersionActivate(versionId);
        toast.success('Versão ativada como principal!');
      } catch (error) {
        console.error('[useVersionManagement] Error activating version:', error);
        toast.error('Erro ao ativar versão');
      }
    },
    [onVersionActivate]
  );

  return {
    currentVersion,
    isChangingVersion,
    handleVersionChange,
    handleVersionCreate,
    handleVersionUpdate,
    handleVersionDelete,
    handleVersionActivate,
  };
}
