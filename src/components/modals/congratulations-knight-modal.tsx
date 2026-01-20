/**
 * Congratulations Knight Modal
 *
 * Modal de parabenização quando o usuário ativa a licença e vira Cavaleiro
 */

import { Sword, Bug, MessageSquare, Sparkles } from "lucide-react";
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

interface CongratulationsKnightModalProps {
  open: boolean;
  onClose: () => void;
}

export function CongratulationsKnightModal({
  open,
  onClose,
}: CongratulationsKnightModalProps) {
  const { t } = useTranslation("license");

  const handleBugReport = async () => {
    await openUrl(EXTERNAL_URLS.bugReport);
  };

  const handleFeedback = async () => {
    await openUrl(EXTERNAL_URLS.suggestions);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[200]" overlayClassName="z-[195]">
        <DialogHeader>
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center mb-4 relative animate-glow">
            <Sword className="w-10 h-10 text-white" />
            <Sparkles className="w-5 h-5 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-200 absolute -bottom-1 -left-1 animate-pulse delay-100" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {t("congratulations_title")}
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-3 text-center">
            <p className="text-base text-foreground font-medium">
              {t("congratulations_promotion")}
            </p>
            <p className="text-sm">{t("congratulations_description")}</p>
            <p className="text-sm font-semibold text-primary">
              {t("congratulations_full_access")}
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-2">
          <p className="text-xs text-muted-foreground text-center">
            {t("congratulations_help_us")}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={handleBugReport}
              className="w-full gap-2"
            >
              <Bug className="w-4 h-4" />
              {t("report_bug")}
            </Button>
            <Button
              variant="secondary"
              onClick={handleFeedback}
              className="w-full gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {t("give_feedback")}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="magical" onClick={onClose} className="w-full">
            {t("start_writing")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
