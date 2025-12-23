import { Monitor, Image as ImageIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectComputer: () => void;
  onSelectGallery: () => void;
}

export function ImageSourceDialog({
  open,
  onOpenChange,
  onSelectComputer,
  onSelectGallery,
}: ImageSourceDialogProps) {
  const { t } = useTranslation("common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {t("form_image.choose_source")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("form_image.choose_source_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Computer option */}
          <Button
            variant="outline"
            onClick={() => {
              onSelectComputer();
              onOpenChange(false);
            }}
            className="h-32 flex flex-col gap-3 hover:bg-primary/10 hover:border-primary transition-all"
          >
            <Monitor className="h-12 w-12 text-primary" />
            <div className="text-center">
              <div className="font-semibold">{t("form_image.from_computer")}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {t("form_image.from_computer_description")}
              </div>
            </div>
          </Button>

          {/* Gallery option */}
          <Button
            variant="outline"
            onClick={() => {
              onSelectGallery();
              onOpenChange(false);
            }}
            className="h-32 flex flex-col gap-3 hover:bg-primary/10 hover:border-primary transition-all"
          >
            <ImageIcon className="h-12 w-12 text-primary" />
            <div className="text-center">
              <div className="font-semibold">{t("form_image.from_gallery")}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {t("form_image.from_gallery_description")}
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
