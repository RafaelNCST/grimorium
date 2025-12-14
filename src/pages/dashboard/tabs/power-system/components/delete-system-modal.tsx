import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  systemName?: string;
}

export function DeleteSystemModal({
  isOpen,
  onClose,
  onConfirm,
  systemName,
}: DeleteSystemModalProps) {
  const { t } = useTranslation("power-system");

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-left">
          {/* Ícone e Título lado a lado */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-left">
              {t("modals.delete_system.title")}
              {systemName && ` "${systemName}"`}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
            {t("modals.delete_system.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-2">
          <AlertDialogCancel>
            {t("modals.delete_system.cancel")}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="lg"
            className="animate-glow-red"
            onClick={handleConfirm}
          >
            {t("modals.delete_system.confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
