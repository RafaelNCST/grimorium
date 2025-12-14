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
        className="sm:max-w-md"
        onOverlayClick={handleClose}
        onEscapeKeyDown={handleClose}
      >
        <AlertDialogHeader className="text-left">
          {/* Ícone e Título lado a lado */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/10 p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <AlertDialogTitle className="text-left">
              {t("finish_arc.cannot_finish_title")}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
            {getMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-2">
          <AlertDialogAction variant="secondary" onClick={handleClose}>
            {t("finish_arc.understand")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
