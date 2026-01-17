import { BookOpen, Wand2, Zap, ScrollText, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FirstTimeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenGuides: () => void;
}

export function FirstTimeGuideModal({
  open,
  onOpenChange,
  onOpenGuides,
}: FirstTimeGuideModalProps) {
  const { t } = useTranslation("common");

  const handleViewGuides = () => {
    onOpenChange(false);
    onOpenGuides();
  };

  const guides = [
    {
      id: "how-to-start",
      title: t("guides.list.how_to_start.title"),
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "power_system",
      title: t("guides.list.power_system.title"),
      icon: Wand2,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "fast_writing",
      title: t("guides.list.fast_writing.title"),
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      id: "using_logs",
      title: t("guides.list.using_logs.title"),
      icon: ScrollText,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">
              {t("guides.welcome.title")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed pt-2">
            {t("guides.welcome.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${guide.bgColor} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`h-5 w-5 ${guide.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {guide.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="gap-2"
          >
            {t("guides.welcome.dismiss")}
          </Button>
          <Button variant="magical" onClick={handleViewGuides} className="gap-2">
            <BookOpen className="h-4 w-4" />
            {t("guides.welcome.view_guides")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
