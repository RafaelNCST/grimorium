import { BookOpen, Sparkles, BookMarked, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { open as openUrl } from "@tauri-apps/plugin-shell";

import { Button } from "@/components/ui/button";
import { EXTERNAL_URLS } from "@/config/external-urls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLicense } from "@/hooks/useLicense";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  const { t } = useTranslation("welcome");
  const { daysRemaining } = useLicense();

  const handleBuyLicense = async () => {
    await openUrl(EXTERNAL_URLS.purchase);
  };

  const features = [
    {
      icon: BookOpen,
      titleKey: "features.writing.title",
      descriptionKey: "features.writing.description",
    },
    {
      icon: BookMarked,
      titleKey: "features.management.title",
      descriptionKey: "features.management.description",
    },
    {
      icon: Sparkles,
      titleKey: "features.creative.title",
      descriptionKey: "features.creative.description",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-3 text-3xl font-bold">
            <BookOpen className="h-8 w-8 text-primary" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        {/* Trial Info Banner */}
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 text-center">
          <h3 className="text-lg font-semibold text-primary mb-2">
            {t("trial.title")}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {t("trial.description", { days: daysRemaining })}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBuyLicense}
            className="gap-2"
          >
            {t("trial.cta")}
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 py-6 sm:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-3 rounded-lg border bg-muted/50 p-4 text-center transition-colors hover:bg-muted"
              >
                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            variant="magical"
            size="lg"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            {t("get_started")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
