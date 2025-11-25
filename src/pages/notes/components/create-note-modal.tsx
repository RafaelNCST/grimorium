import { useState, useCallback } from "react";

import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoAlert } from "@/components/ui/info-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INoteFormData, INoteLink } from "@/types/note-types";

import { EntityLinkSelector } from "./entity-link-selector";

interface CreateNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNote: (formData: INoteFormData) => void;
}

export function CreateNoteModal({
  open,
  onOpenChange,
  onCreateNote,
}: CreateNoteModalProps) {
  const { t } = useTranslation("notes");

  const [name, setName] = useState("");
  const [links, setLinks] = useState<INoteLink[]>([]);

  const isValid = name.trim().length > 0 && name.length <= 200;

  const handleClose = useCallback(() => {
    setName("");
    setLinks([]);
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) return;

      onCreateNote({
        name: name.trim(),
        links,
      });

      setName("");
      setLinks([]);
    },
    [name, links, isValid, onCreateNote]
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] min-h-[450px] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <DialogTitle>{t("create_modal.title")}</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              {t("create_modal.title")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 flex-1">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="note-name" className="text-sm font-medium text-primary">
                {t("create_modal.name_label")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="note-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("create_modal.name_placeholder")}
                maxLength={200}
                autoFocus
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{name.length}/200</span>
              </div>
            </div>

            {/* Entity Links */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-primary">
                  {t("create_modal.links_label")}
                </Label>
                <Badge variant="secondary" className="text-xs">
                  {links.length}
                </Badge>
                <span className="text-xs font-normal text-muted-foreground">
                  ({t("create_modal.optional")})
                </span>
              </div>
              <InfoAlert>{t("create_modal.links_description")}</InfoAlert>
              <EntityLinkSelector
                selectedLinks={links}
                onLinksChange={setLinks}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="secondary" onClick={handleClose}>
              {t("create_modal.cancel")}
            </Button>
            <Button type="submit" variant="magical" disabled={!isValid}>
              {t("create_modal.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
