import { useState, useCallback, useMemo, ReactNode } from "react";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoAlert } from "@/components/ui/info-alert";

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
      return;
    }
    setStep(2);
    setIsEntityModalOpen(true);
  }, [canProceedToStep2]);

  const handleEntityModalClose = useCallback(() => {
    setIsEntityModalOpen(false);
    setStep(1);
  }, []);

  const handleEntityCreate = useCallback(
    (entityData: TEntityData) => {
      onConfirm({
        name: versionName.trim(),
        description: versionDescription.trim(),
        entityData,
      });
      handleClose();
    },
    [versionName, versionDescription, onConfirm, handleClose]
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
            <FormInput
              label={t("versions.create_dialog.name_label")}
              value={versionName}
              onChange={(e) => {
                if (e.target.value.length <= maxNameLength) {
                  setVersionName(e.target.value);
                }
              }}
              placeholder={t("versions.create_dialog.name_placeholder")}
              maxLength={maxNameLength}
              showCharCount
              required
              showOptionalLabel={false}
              error={
                versionName.trim().length === 0 && versionName.length > 0
                  ? t("versions.create_dialog.name_required")
                  : undefined
              }
            />

            <FormTextarea
              label={t("versions.create_dialog.description_label")}
              value={versionDescription}
              onChange={(e) => {
                if (e.target.value.length <= maxDescriptionLength) {
                  setVersionDescription(e.target.value);
                }
              }}
              placeholder={t("versions.create_dialog.description_placeholder")}
              maxLength={maxDescriptionLength}
              rows={4}
              showCharCount
              required
              showOptionalLabel={false}
              className="resize-none"
              error={
                versionDescription.trim().length === 0 &&
                versionDescription.length > 0
                  ? t("versions.create_dialog.description_required")
                  : undefined
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              {t("versions.create_dialog.cancel")}
            </Button>
            <Button
              type="button"
              disabled={!canProceedToStep2}
              variant="magical"
              size="lg"
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
