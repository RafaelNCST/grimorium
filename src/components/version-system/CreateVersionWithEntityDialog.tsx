import { useState, useCallback, useMemo, ReactNode } from "react";

import { ArrowRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoAlert } from "@/components/ui/info-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface CreateVersionWithEntityData<TEntityData> {
  name: string;
  description: string;
  entityData: TEntityData;
}

export interface CreateVersionWithEntityDialogProps<TEntity, TEntityData> {
  /** Controls modal visibility */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when version is created with entity data */
  onConfirm: (data: CreateVersionWithEntityData<TEntityData>) => void;
  /** Base entity to create version from */
  baseEntity: TEntity;
  /** i18n namespace to use for translations */
  i18nNamespace: string;
  /** Render prop for the entity creation modal (step 2) */
  renderEntityModal: (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (entityData: TEntityData) => void;
  }) => ReactNode;
  /** Optional max length for version name (default: 50) */
  maxNameLength?: number;
  /** Optional max length for version description (default: 200) */
  maxDescriptionLength?: number;
}

/**
 * CreateVersionWithEntityDialog - Generic two-step dialog for creating versions
 *
 * Step 1: Collect version metadata (name + description)
 * Step 2: Open entity-specific modal to collect entity data
 *
 * @example
 * ```tsx
 * <CreateVersionWithEntityDialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleVersionCreate}
 *   baseEntity={region}
 *   i18nNamespace="world"
 *   renderEntityModal={({ open, onOpenChange, onConfirm }) => (
 *     <CreateRegionModal
 *       open={open}
 *       onOpenChange={onOpenChange}
 *       onConfirm={onConfirm}
 *       availableRegions={[]}
 *     />
 *   )}
 * />
 * ```
 */
export function CreateVersionWithEntityDialog<TEntity, TEntityData>({
  open,
  onClose,
  onConfirm,
  i18nNamespace,
  renderEntityModal,
  maxNameLength = 50,
  maxDescriptionLength = 200,
}: CreateVersionWithEntityDialogProps<TEntity, TEntityData>) {
  const { t } = useTranslation(i18nNamespace);
  const [step, setStep] = useState<1 | 2>(1);
  const [versionName, setVersionName] = useState("");
  const [versionDescription, setVersionDescription] = useState("");
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);

  const nameCharsRemaining = maxNameLength - versionName.length;
  const descriptionCharsRemaining =
    maxDescriptionLength - versionDescription.length;

  const canProceedToStep2 = useMemo(
    () => versionName.trim().length > 0 && versionDescription.trim().length > 0,
    [versionName, versionDescription]
  );

  const handleClose = useCallback(() => {
    setStep(1);
    setVersionName("");
    setVersionDescription("");
    setIsEntityModalOpen(false);
    onClose();
  }, [onClose]);

  const handleStep1Continue = useCallback(() => {
    if (!canProceedToStep2) {
      toast.error(t("versions.create_dialog.step1_validation_error"));
      return;
    }
    setStep(2);
    setIsEntityModalOpen(true);
  }, [canProceedToStep2, t]);

  const handleEntityModalClose = useCallback(() => {
    setIsEntityModalOpen(false);
    setStep(1);
  }, []);

  const handleEntityCreate = useCallback(
    (entityData: TEntityData) => {
      console.log("[CreateVersionWithEntityDialog] handleEntityCreate called");
      console.log("[CreateVersionWithEntityDialog] versionName:", versionName);
      console.log(
        "[CreateVersionWithEntityDialog] versionDescription:",
        versionDescription
      );
      console.log(
        "[CreateVersionWithEntityDialog] entityData received:",
        entityData
      );

      const dataToConfirm = {
        name: versionName.trim(),
        description: versionDescription.trim(),
        entityData,
      };

      console.log(
        "[CreateVersionWithEntityDialog] Calling onConfirm with:",
        dataToConfirm
      );

      onConfirm(dataToConfirm);
      handleClose();
      toast.success(t("versions.create_dialog.success"));
    },
    [versionName, versionDescription, onConfirm, handleClose, t]
  );

  return (
    <>
      {/* Step 1: Version Metadata */}
      <Dialog open={open && step === 1} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {t("versions.create_dialog.title")}
            </DialogTitle>
          </DialogHeader>

          <InfoAlert>{t("versions.create_dialog.info_message")}</InfoAlert>

          <div className="space-y-4 pt-2">
            {/* Version Name */}
            <div className="space-y-2">
              <Label htmlFor="version-name" className="text-sm font-medium">
                {t("versions.create_dialog.name_label")} *
              </Label>
              <Input
                id="version-name"
                value={versionName}
                onChange={(e) => {
                  if (e.target.value.length <= maxNameLength) {
                    setVersionName(e.target.value);
                  }
                }}
                placeholder={t("versions.create_dialog.name_placeholder")}
                maxLength={maxNameLength}
                className={
                  versionName.trim().length === 0 && versionName.length > 0
                    ? "border-destructive"
                    : ""
                }
              />
              <div className="flex justify-between text-xs">
                {versionName.trim().length === 0 && versionName.length > 0 && (
                  <span className="text-destructive">
                    {t("versions.create_dialog.name_required")}
                  </span>
                )}
                <span
                  className={`ml-auto ${
                    nameCharsRemaining < 20
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {nameCharsRemaining}{" "}
                  {t("versions.create_dialog.chars_remaining")}
                </span>
              </div>
            </div>

            {/* Version Description */}
            <div className="space-y-2">
              <Label
                htmlFor="version-description"
                className="text-sm font-medium"
              >
                {t("versions.create_dialog.description_label")} *
              </Label>
              <Textarea
                id="version-description"
                value={versionDescription}
                onChange={(e) => {
                  if (e.target.value.length <= maxDescriptionLength) {
                    setVersionDescription(e.target.value);
                  }
                }}
                placeholder={t(
                  "versions.create_dialog.description_placeholder"
                )}
                maxLength={maxDescriptionLength}
                rows={4}
                className={`resize-none ${
                  versionDescription.trim().length === 0 &&
                  versionDescription.length > 0
                    ? "border-destructive"
                    : ""
                }`}
              />
              <div className="flex justify-between text-xs">
                {versionDescription.trim().length === 0 &&
                  versionDescription.length > 0 && (
                    <span className="text-destructive">
                      {t("versions.create_dialog.description_required")}
                    </span>
                  )}
                <span
                  className={`ml-auto ${
                    descriptionCharsRemaining < 20
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {descriptionCharsRemaining}{" "}
                  {t("versions.create_dialog.chars_remaining")}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {t("versions.create_dialog.cancel")}
            </Button>
            <Button
              type="button"
              disabled={!canProceedToStep2}
              variant="magical"
              onClick={handleStep1Continue}
              className="flex-1 animate-glow"
            >
              {t("versions.create_dialog.continue")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Step 2: Entity Creation Modal */}
      {step === 2 &&
        renderEntityModal({
          open: isEntityModalOpen,
          onOpenChange: (open) => {
            if (!open) handleEntityModalClose();
          },
          onConfirm: handleEntityCreate,
        })}
    </>
  );
}
