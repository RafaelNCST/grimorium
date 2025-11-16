import React, { useState, useEffect } from "react";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
 * DeleteEntityModal - Generic two-step delete confirmation modal with version support
 *
 * Features:
 * - Simple one-step flow for version deletion
 * - Two-step flow for main entity deletion (type name + final confirmation)
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
 *       "step1": {
 *         "message": "Você está prestes a excluir \"{{entityName}}\"...",
 *         "input_label": "Digite o nome para confirmar:",
 *         "input_placeholder": "Digite o nome...",
 *         "name_mismatch": "O nome não corresponde",
 *         "cancel": "Cancelar",
 *         "continue": "Continuar"
 *       },
 *       "step2": {
 *         "title": "Confirmação Final",
 *         "message": "Isso excluirá \"{{entityName}}\" e todas as {{totalVersions}} versões...",
 *         "message_single": "Isso excluirá \"{{entityName}}\" permanentemente.",
 *         "cancel": "Cancelar",
 *         "confirm": "Excluir Permanentemente"
 *       }
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
  const [step, setStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState("");

  // Check if this is a version deletion (non-main) or entity deletion (main)
  const isVersionDeletion = currentVersion && !currentVersion.isMain;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setNameInput("");
    }
  }, [isOpen]);

  // Validate name input (case-sensitive exact match)
  const isNameValid = nameInput.trim() === entityName;

  const handleConfirm = () => {
    if (isVersionDeletion) {
      // Simple version deletion
      onConfirmDelete();
      onClose();
    } else {
      // Entity deletion - check step
      if (step === 1) {
        if (!isNameValid) {
          return;
        }
        // Move to step 2
        setStep(2);
      } else {
        // Final confirmation - delete entity
        onConfirmDelete();
        onClose();
      }
    }
  };

  const handleCancel = () => {
    onClose();
    setStep(1);
    setNameInput("");
  };

  // Version Deletion Flow (Simple)
  if (isVersionDeletion) {
    return (
      <AlertDialog open={isOpen} onOpenChange={handleCancel}>
        <AlertDialogContent
          onOverlayClick={handleCancel}
          onEscapeKeyDown={handleCancel}
        >
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>{t("delete.version.title")}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left pt-4">
              {t("delete.version.message", { versionName: versionName || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {t("delete.version.cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              size="lg"
              className="animate-glow-red"
              onClick={handleConfirm}
            >
              {t("delete.version.confirm")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Entity Deletion Flow (2 Steps)
  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent
        onOverlayClick={handleCancel}
        onEscapeKeyDown={handleCancel}
      >
        {step === 1 ? (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>
                  {t(`delete.${entityType}.title`)}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4 space-y-4">
                <p>{t(`delete.${entityType}.step1.message`, { entityName })}</p>
                <div className="space-y-2">
                  <Label
                    htmlFor="entity-name-input"
                    className="text-foreground font-medium"
                  >
                    {t(`delete.${entityType}.step1.input_label`)}
                  </Label>
                  <Input
                    id="entity-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t(
                      `delete.${entityType}.step1.input_placeholder`
                    )}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className={`font-mono ${
                      nameInput.length > 0 && !isNameValid
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                  />
                  <div className="h-4">
                    {nameInput.length > 0 && !isNameValid && (
                      <p className="text-xs text-destructive">
                        {t(`delete.${entityType}.step1.name_mismatch`)}
                      </p>
                    )}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t(`delete.${entityType}.step1.cancel`)}
              </AlertDialogCancel>
              <Button
                onClick={handleConfirm}
                disabled={!isNameValid}
                variant="magical"
                size="lg"
                className={`animate-glow ${
                  !isNameValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {t(`delete.${entityType}.step1.continue`)}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>
                  {t(`delete.${entityType}.step2.title`)}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4">
                {totalVersions > 1 ? (
                  <p className="font-medium text-foreground">
                    {t(`delete.${entityType}.step2.message`, {
                      entityName,
                      totalVersions,
                    })}
                  </p>
                ) : (
                  <p className="font-medium text-foreground">
                    {t(`delete.${entityType}.step2.message_single`, {
                      entityName,
                    })}
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t(`delete.${entityType}.step2.cancel`)}
              </AlertDialogCancel>
              <Button
                variant="destructive"
                size="lg"
                className="animate-glow-red"
                onClick={handleConfirm}
              >
                {t(`delete.${entityType}.step2.confirm`)}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
