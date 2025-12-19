import React from "react";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  onConfirmDelete: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  itemName,
  onConfirmDelete,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation("item-detail");

  const handleConfirm = () => {
    onConfirmDelete();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent
        onOverlayClick={handleCancel}
        onEscapeKeyDown={handleCancel}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-destructive/10 p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>{t("delete.item.title")}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left pt-4 text-foreground font-medium">
            {t("delete.item.message", {
              entityName: itemName,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {t("delete.item.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="animate-glow-red"
            onClick={handleConfirm}
          >
            {t("delete.item.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
