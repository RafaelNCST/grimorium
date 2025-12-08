import React from "react";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

/**
 * Generic version interface - any entity version must have these properties
 */
export interface IEntityVersion {
  isMain: boolean;
}

export interface DeleteEntityModalProps<T extends IEntityVersion> {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** The name of the entity being deleted */
  entityName: string;
  /** The type of entity (e.g., "região", "personagem", "item") - used for i18n keys */
  entityType: string;
  /** Current version object - if isMain=false, shows simple version deletion flow */
  currentVersion: T | null;
  /** Name of the version being deleted (for version deletion) */
  versionName?: string;
  /** Total number of versions (shown in final confirmation) */
  totalVersions?: number;
  /** Callback when user confirms deletion */
  onConfirmDelete: () => void;
  /** i18n namespace to use for translations (e.g., "world", "character-detail") */
  i18nNamespace: string;
}

/**
 * DeleteEntityModal - Generic delete confirmation modal with version support
 *
 * Features:
 * - Simple one-step confirmation flow for both entities and versions
 * - Fully configurable via i18n
 * - Type-safe with generics
 *
 * @example
 * ```tsx
 * <DeleteEntityModal
 *   isOpen={showDeleteDialog}
 *   onClose={() => setShowDeleteDialog(false)}
 *   entityName={region.name}
 *   entityType="region"
 *   currentVersion={currentVersion}
 *   versionName={versionName}
 *   totalVersions={versions.length}
 *   onConfirmDelete={handleDelete}
 *   i18nNamespace="world"
 * />
 * ```
 *
 * Required i18n keys structure:
 * ```json
 * {
 *   "delete": {
 *     "version": {
 *       "title": "Excluir Versão",
 *       "message": "Tem certeza que deseja excluir a versão \"{{versionName}}\"?",
 *       "cancel": "Cancelar",
 *       "confirm": "Excluir Versão"
 *     },
 *     "{entityType}": {
 *       "title": "Excluir {EntityType}",
 *       "message": "Tem certeza que deseja excluir \"{{entityName}}\"?",
 *       "message_with_versions": "Isso excluirá \"{{entityName}}\" e todas as {{totalVersions}} versões permanentemente.",
 *       "cancel": "Cancelar",
 *       "confirm": "Excluir"
 *     }
 *   }
 * }
 * ```
 */
export function DeleteEntityModal<T extends IEntityVersion>({
  isOpen,
  onClose,
  entityName,
  entityType,
  currentVersion,
  versionName,
  totalVersions = 1,
  onConfirmDelete,
  i18nNamespace,
}: DeleteEntityModalProps<T>) {
  const { t } = useTranslation(i18nNamespace);

  // Check if this is a version deletion (non-main) or entity deletion (main)
  const isVersionDeletion = currentVersion && !currentVersion.isMain;

  const handleConfirm = () => {
    onConfirmDelete();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Version Deletion Flow
  if (isVersionDeletion) {
    return (
      <AlertDialog open={isOpen} onOpenChange={handleCancel}>
        <AlertDialogContent
          onOverlayClick={handleCancel}
          onEscapeKeyDown={handleCancel}
        >
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-destructive/10 p-2 flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>{t("delete.version.title")}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left pt-4 text-foreground font-medium">
              {t("delete.version.message", { versionName: versionName || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {t("delete.version.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="animate-glow-red"
              onClick={handleConfirm}
            >
              {t("delete.version.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Entity Deletion Flow
  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent
        onOverlayClick={handleCancel}
        onEscapeKeyDown={handleCancel}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-destructive/10 p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>
              {t(`delete.${entityType}.title`)}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left pt-4 text-foreground font-medium">
            {totalVersions > 1
              ? t(`delete.${entityType}.message_with_versions`, {
                  entityName,
                  totalVersions,
                })
              : t(`delete.${entityType}.message`, { entityName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {t(`delete.${entityType}.cancel`)}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="animate-glow-red"
            onClick={handleConfirm}
          >
            {t(`delete.${entityType}.confirm`)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
