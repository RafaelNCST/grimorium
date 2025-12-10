import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface FinishArcWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hasNoEvents: boolean;
  hasNoCompletedEvents: boolean;
}

export function FinishArcWarningDialog({
  isOpen,
  onClose,
  hasNoEvents,
  hasNoCompletedEvents,
}: FinishArcWarningDialogProps) {
  const { t } = useTranslation("plot");

  const handleClose = () => {
    onClose();
  };

  const getMessage = () => {
    if (hasNoEvents) {
      return t("finish_arc.no_events_message");
    }
    if (hasNoCompletedEvents) {
      return t("finish_arc.no_completed_events_message");
    }
    return "";
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent
        onOverlayClick={handleClose}
        onEscapeKeyDown={handleClose}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-500/10 p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <AlertDialogTitle>
              {t("finish_arc.cannot_finish_title")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left pt-4 text-foreground">
            {getMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction variant="secondary" onClick={handleClose}>
            {t("finish_arc.understand")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
