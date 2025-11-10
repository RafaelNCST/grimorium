import { useState, useCallback, useMemo } from "react";

import { ArrowRight, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { CreateRegionModal } from "@/components/modals/create-region-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type IRegion,
  type IRegionFormData,
} from "@/pages/dashboard/tabs/world/types/region-types";

interface CreateVersionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    description: string;
    regionData: IRegionFormData;
  }) => void;
  baseRegion: IRegion;
}

export function CreateVersionDialog({
  open,
  onClose,
  onConfirm,
  baseRegion,
}: CreateVersionDialogProps) {
  const { t } = useTranslation("region-detail");
  const [step, setStep] = useState<1 | 2>(1);
  const [versionName, setVersionName] = useState("");
  const [versionDescription, setVersionDescription] = useState("");
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  const MAX_NAME_LENGTH = 150;
  const MAX_DESCRIPTION_LENGTH = 150;

  const nameCharsRemaining = MAX_NAME_LENGTH - versionName.length;
  const descriptionCharsRemaining =
    MAX_DESCRIPTION_LENGTH - versionDescription.length;

  const canProceedToStep2 = useMemo(
    () => versionName.trim().length > 0 && versionDescription.trim().length > 0,
    [versionName, versionDescription]
  );

  const handleClose = useCallback(() => {
    setStep(1);
    setVersionName("");
    setVersionDescription("");
    setIsRegionModalOpen(false);
    onClose();
  }, [onClose]);

  const handleStep1Continue = useCallback(() => {
    if (!canProceedToStep2) {
      toast.error(t("versions.create_dialog.step1_validation_error"));
      return;
    }
    setStep(2);
    setIsRegionModalOpen(true);
  }, [canProceedToStep2, t]);

  const handleRegionModalClose = useCallback(() => {
    setIsRegionModalOpen(false);
    setStep(1);
  }, []);

  const handleRegionCreate = useCallback(
    (regionData: IRegionFormData) => {
      onConfirm({
        name: versionName.trim(),
        description: versionDescription.trim(),
        regionData: regionData as unknown as IRegionFormData,
      });
      handleClose();
      toast.success(t("versions.create_dialog.success"));
    },
    [versionName, versionDescription, onConfirm, handleClose, t]
  );

  return (
    <>
      <Dialog open={open && step === 1} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {t("versions.create_dialog.title")}
            </DialogTitle>
          </DialogHeader>

          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              {t("versions.create_dialog.info_message")}
            </AlertDescription>
          </Alert>

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
                  if (e.target.value.length <= MAX_NAME_LENGTH) {
                    setVersionName(e.target.value);
                  }
                }}
                placeholder={t("versions.create_dialog.name_placeholder")}
                maxLength={MAX_NAME_LENGTH}
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
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                    setVersionDescription(e.target.value);
                  }
                }}
                placeholder={t(
                  "versions.create_dialog.description_placeholder"
                )}
                maxLength={MAX_DESCRIPTION_LENGTH}
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
              variant="outline"
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

      {/* Step 2: Region Creation Modal */}
      {step === 2 && (
        <CreateRegionModal
          open={isRegionModalOpen}
          onOpenChange={(open) => {
            if (!open) handleRegionModalClose();
          }}
          onConfirm={handleRegionCreate}
          availableRegions={[]}
        />
      )}
    </>
  );
}
