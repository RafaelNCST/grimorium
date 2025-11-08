import { useTranslation } from "react-i18next";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("modals.delete_system.title")}
            {systemName && ` "${systemName}"`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("modals.delete_system.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
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
