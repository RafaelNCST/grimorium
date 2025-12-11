import * as React from "react";

import { } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface CreateVersionData {
  name: string;
  description?: string;
}

export interface CreateVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateVersionData) => Promise<void>;
  title?: string;
  description?: string;
  entityType?: string;
}

/**
 * CreateVersionDialog - Dialog for creating a new version
 */
export function CreateVersionDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  entityType = "entidade",
}: CreateVersionDialogProps) {
  const { t } = useTranslation(["dialogs", "forms"]);
  const [name, setName] = React.useState("");
  const [versionDescription, setVersionDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: versionDescription.trim() || undefined,
      });

      // Reset form
      setName("");
      setVersionDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating version:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {title || t("dialogs:create_version.title")}
            </DialogTitle>
            <DialogDescription>
              {description || t("dialogs:create_version.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormInput
              label={t("forms:labels.version_name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("forms:placeholders.version_name_example")}
              required
              autoFocus
            />

            <FormTextarea
              label={t("forms:labels.description")}
              value={versionDescription}
              onChange={(e) => setVersionDescription(e.target.value)}
              placeholder={t("forms:placeholders.version_description", {
                entityType,
              })}
              rows={4}
              maxLength={500}
              showCharCount
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("forms:buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting && <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-primary" />}
              {t("forms:buttons.create_version")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
