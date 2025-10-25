import { useState, useEffect } from "react";

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

interface DeleteArcConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  arcName: string;
  eventCount: number;
  onConfirmDelete: () => void;
}

export function DeleteArcConfirmationDialog({
  isOpen,
  onClose,
  arcName,
  eventCount,
  onConfirmDelete,
}: DeleteArcConfirmationDialogProps) {
  const { t } = useTranslation("plot");
  const [step, setStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState("");

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setNameInput("");
    }
  }, [isOpen]);

  // Validate name input (case-sensitive exact match)
  const isNameValid = nameInput.trim() === arcName;

  const handleConfirm = () => {
    if (step === 1) {
      if (!isNameValid) {
        return;
      }
      // Move to step 2
      setStep(2);
    } else {
      // Final confirmation - delete arc
      onConfirmDelete();
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    setStep(1);
    setNameInput("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent>
        {step === 1 ? (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>{t("delete.arc.title")}</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4 space-y-4">
                <p>{t("delete.arc.step1.message", { arcName })}</p>
                <div className="space-y-2">
                  <Label
                    htmlFor="arc-name-input"
                    className="text-foreground font-medium"
                  >
                    {t("delete.arc.step1.input_label")}
                  </Label>
                  <Input
                    id="arc-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={t("delete.arc.step1.input_placeholder")}
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
                        {t("delete.arc.step1.name_mismatch")}
                      </p>
                    )}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("delete.arc.step1.cancel")}
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
                {t("delete.arc.step1.continue")}
              </Button>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <AlertDialogTitle>
                  {t("delete.arc.step2.title")}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left pt-4">
                {eventCount > 0 ? (
                  <p className="font-medium text-foreground">
                    {t("delete.arc.step2.message", {
                      arcName,
                      eventCount,
                    })}
                  </p>
                ) : (
                  <p className="font-medium text-foreground">
                    {t("delete.arc.step2.message_no_events", {
                      arcName,
                    })}
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {t("delete.arc.step2.cancel")}
              </AlertDialogCancel>
              <Button
                onClick={handleConfirm}
                variant="destructive"
                size="lg"
                className="animate-glow-red"
              >
                {t("delete.arc.step2.confirm")}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
