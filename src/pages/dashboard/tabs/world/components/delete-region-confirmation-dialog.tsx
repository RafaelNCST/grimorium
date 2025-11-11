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
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type IRegionVersion } from "@/lib/db/regions.service";

interface DeleteRegionConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  regionName: string;
  currentVersion: IRegionVersion | null;
  versionName?: string;
  totalVersions?: number;
  onConfirmDelete: () => void;
}

export function DeleteRegionConfirmationDialog({
  isOpen,
  onClose,
  regionName,
  currentVersion,
  versionName,
  totalVersions = 1,
  onConfirmDelete,
}: DeleteRegionConfirmationDialogProps) {
  const { t } = useTranslation("world");
  const [step, setStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState("");

  // Check if this is a version deletion (non-main) or region deletion (main)
  const isVersionDeletion = currentVersion && !currentVersion.isMain;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setNameInput("");
    }
  }, [isOpen]);

  // Validate name input (case-sensitive exact match)
  const isNameValid = nameInput.trim() === regionName;

  const handleConfirm = () => {
    console.log("handleConfirm called", {
      isVersionDeletion,
      step,
      isNameValid,
    });
    if (isVersionDeletion) {
      // Simple version deletion
      onConfirmDelete();
      onClose();
    } else {
      // Region deletion - check step
      if (step === 1) {
        if (!isNameValid) {
          console.log("Name validation failed", { nameInput, regionName });
          return;
        }
        // Move to step 2
        console.log("Moving to step 2");
        setStep(2);
      } else {
        // Final confirmation - delete region
        console.log("Deleting region");
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

  // Region Deletion Flow (2 Steps)
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
                  {t("delete.region.title")}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4 space-y-4">
                <p>{t("delete.region.step1.message", { regionName })}</p>
                <div className="space-y-2">
                  <Label
                    htmlFor="region-name-input"
                    className="text-foreground font-medium"
                  >
                    {t("delete.region.step1.input_label")}
                  </Label>
                  <Input
                    id="region-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t("delete.region.step1.input_placeholder")}
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
                        {t("delete.region.step1.name_mismatch")}
                      </p>
                    )}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("delete.region.step1.cancel")}
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
                {t("delete.region.step1.continue")}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>
                  {t("delete.region.step2.title")}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4">
                {totalVersions > 1 ? (
                  <p className="font-medium text-foreground">
                    {t("delete.region.step2.message", {
                      regionName,
                      totalVersions,
                    })}
                  </p>
                ) : (
                  <p className="font-medium text-foreground">
                    {t("delete.region.step2.message_single", {
                      regionName,
                    })}
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("delete.region.step2.cancel")}
              </AlertDialogCancel>
              <Button
                variant="destructive"
                size="lg"
                className="animate-glow-red"
                onClick={handleConfirm}
              >
                {t("delete.region.step2.confirm")}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
