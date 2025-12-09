import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { IPowerCharacterLink } from "../types/power-system-types";

interface EditPowerLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: IPowerCharacterLink | null;
  onSave: (linkId: string, customLabel: string) => Promise<void>;
}

export function EditPowerLinkModal({
  isOpen,
  onClose,
  link,
  onSave,
}: EditPowerLinkModalProps) {
  const { t } = useTranslation("power-system");
  const [customLabel, setCustomLabel] = useState(link?.customLabel || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Early return if link is null
  if (!link) return null;

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave(link.id, customLabel);
      onClose();
    } catch (error) {
      console.error("Error updating link:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("links.edit_link")}</DialogTitle>
          <DialogDescription>
            {t("links.edit_link_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="custom-label">{t("links.custom_label")}</Label>
            <Input
              id="custom-label"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder={t("links.link_label_placeholder")}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t("actions.cancel")}
          </Button>
          <Button
            variant="magical"
            className="animate-glow"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("actions.saving") : t("actions.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
