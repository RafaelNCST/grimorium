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
import { type IFactionVersion } from "@/types/faction-types";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  factionName: string;
  currentVersion: IFactionVersion | null;
  versionName?: string;
  totalVersions?: number;
  onConfirmDelete: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  factionName,
  currentVersion,
  versionName,
  totalVersions = 1,
  onConfirmDelete,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation("faction-detail");
  const [step, setStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState("");

  const isVersionDeletion = currentVersion && !currentVersion.isMain;

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setNameInput("");
    }
  }, [isOpen]);

  const isNameValid = nameInput.trim() === factionName;

  const handleConfirm = () => {
    if (isVersionDeletion) {
      onConfirmDelete();
      onClose();
    } else {
      if (step === 1) {
        if (!isNameValid) {
          return;
        }
        setStep(2);
      } else {
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

  if (isVersionDeletion) {
    return (
      <AlertDialog open={isOpen} onOpenChange={handleCancel}>
        <AlertDialogContent>
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
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete.version.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent>
        {step === 1 ? (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>{t("delete.faction.title")}</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4 space-y-4">
                <p>{t("delete.faction.step1.message", { factionName })}</p>
                <div className="space-y-2">
                  <Label
                    htmlFor="faction-name-input"
                    className="text-foreground font-medium"
                  >
                    {t("delete.faction.step1.input_label")}
                  </Label>
                  <Input
                    id="faction-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t("delete.faction.step1.input_placeholder")}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className={`${
                      nameInput.length > 0 && !isNameValid
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                  />
                  <div className="h-4">
                    {nameInput.length > 0 && !isNameValid && (
                      <p className="text-xs text-destructive">
                        {t("delete.faction.step1.name_mismatch")}
                      </p>
                    )}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("delete.faction.step1.cancel")}
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
                {t("delete.faction.step1.continue")}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>
                  {t("delete.faction.step2.title")}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4">
                {totalVersions > 1 ? (
                  <p className="font-medium text-foreground">
                    {t("delete.faction.step2.message", {
                      factionName,
                      totalVersions,
                    })}
                  </p>
                ) : (
                  <p className="font-medium text-foreground">
                    {t("delete.faction.step2.message_single", {
                      factionName,
                    })}
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("delete.faction.step2.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("delete.faction.step2.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
