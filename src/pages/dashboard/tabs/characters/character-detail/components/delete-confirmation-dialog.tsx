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
import { type ICharacterVersion } from "@/types/character-types";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  characterName: string;
  currentVersion: ICharacterVersion | null;
  versionName?: string;
  totalVersions?: number;
  onConfirmDelete: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  characterName,
  currentVersion,
  versionName,
  totalVersions = 1,
  onConfirmDelete,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation("character-detail");
  const [step, setStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState("");

  // Check if this is a version deletion (non-main) or character deletion (main)
  const isVersionDeletion = currentVersion && !currentVersion.isMain;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setNameInput("");
    }
  }, [isOpen]);

  // Validate name input (case-sensitive exact match)
  const isNameValid = nameInput.trim() === characterName;

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
      // Character deletion - check step
      if (step === 1) {
        if (!isNameValid) {
          console.log("Name validation failed", { nameInput, characterName });
          return;
        }
        // Move to step 2
        console.log("Moving to step 2");
        setStep(2);
      } else {
        // Final confirmation - delete character
        console.log("Deleting character");
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

  // Character Deletion Flow (2 Steps)
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
                  {t("delete.character.title")}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4 space-y-4">
                <p>{t("delete.character.step1.message", { characterName })}</p>
                <div className="space-y-2">
                  <Label
                    htmlFor="character-name-input"
                    className="text-foreground font-medium"
                  >
                    {t("delete.character.step1.input_label")}
                  </Label>
                  <Input
                    id="character-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t("delete.character.step1.input_placeholder")}
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
                        {t("delete.character.step1.name_mismatch")}
                      </p>
                    )}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("delete.character.step1.cancel")}
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
                {t("delete.character.step1.continue")}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>
                  {t("delete.character.step2.title")}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4">
                {totalVersions > 1 ? (
                  <p className="font-medium text-foreground">
                    {t("delete.character.step2.message", {
                      characterName,
                      totalVersions,
                    })}
                  </p>
                ) : (
                  <p className="font-medium text-foreground">
                    {t("delete.character.step2.message_single", {
                      characterName,
                    })}
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("delete.character.step2.cancel")}
              </AlertDialogCancel>
              <Button
                variant="destructive"
                size="lg"
                className="animate-glow-red"
                onClick={handleConfirm}
              >
                {t("delete.character.step2.confirm")}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
