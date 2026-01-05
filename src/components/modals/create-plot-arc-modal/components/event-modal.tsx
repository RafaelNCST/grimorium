import { useEffect, useState, useRef } from "react";

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
import { cn } from "@/lib/utils";
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
  const [hasScroll, setHasScroll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Detectar se há scroll
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setHasScroll(scrollHeight > clientHeight);
      }
    };

    const timeoutId = setTimeout(checkScroll, 0);
    const observer = new ResizeObserver(checkScroll);
    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [name, description, open]);

  const handleConfirm = () => {
    if (!name.trim() || !description.trim()) return;
    onConfirm(name.trim(), description.trim());
    onClose();
  };

  const isValid = name.trim() && description.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col gap-0">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditing ? t("modal.edit_event") : t("modal.add_event")}
          </DialogTitle>
        </DialogHeader>

        <div
          ref={scrollContainerRef}
          className={cn(
            "flex-1 overflow-y-auto custom-scrollbar pb-6",
            hasScroll && "pr-2"
          )}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="event-name"
                className="text-sm font-medium text-primary"
              >
                {t("modal.event_name")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="px-1">
                <Input
                  id="event-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("modal.event_name_placeholder")}
                  maxLength={100}
                />
              </div>
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
              <div className="px-1">
                <Textarea
                  id="event-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("modal.event_description_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
              </div>
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{description.length}/500</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t gap-2">
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
