import { useEffect, useState } from "react";

import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IPlotEvent } from "@/types/plot-types";

interface PropsEventModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string, description: string) => void;
  event?: IPlotEvent | null;
}

export function EventModal({
  open,
  onClose,
  onConfirm,
  event,
}: PropsEventModal) {
  const { t } = useTranslation("create-plot-arc");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isEditing = !!event;

  useEffect(() => {
    if (open) {
      if (event) {
        setName(event.name);
        setDescription(event.description);
      } else {
        setName("");
        setDescription("");
      }
    }
  }, [open, event]);

  const handleConfirm = () => {
    if (!name.trim() || !description.trim()) return;
    onConfirm(name.trim(), description.trim());
    onClose();
  };

  const isValid = name.trim() && description.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("modal.edit_event") : t("modal.add_event")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="event-name"
              className="text-sm font-medium text-primary"
            >
              {t("modal.event_name")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="event-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("modal.event_name_placeholder")}
              maxLength={100}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{name.length}/100</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="event-description"
              className="text-sm font-medium text-primary"
            >
              {t("modal.event_description")}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("modal.event_description_placeholder")}
              rows={4}
              maxLength={500}
              className="resize-none"
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{description.length}/500</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            {t("button.cancel")}
          </Button>
          <Button
            type="button"
            variant="magical"
            onClick={handleConfirm}
            disabled={!isValid}
          >
            <Check className="w-4 h-4 mr-2" />
            {isEditing ? t("button.save") : t("button.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
