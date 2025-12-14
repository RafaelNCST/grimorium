import { AlertTriangle } from "lucide-react";
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

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteGroupOnly: () => void;
  onDeleteGroupAndPages: () => void;
  groupName?: string;
  pageCount: number;
}

export function DeleteGroupModal({
  isOpen,
  onClose,
  onDeleteGroupOnly,
  onDeleteGroupAndPages,
  groupName,
  pageCount,
}: DeleteGroupModalProps) {
  const { t } = useTranslation("power-system");

  const handleDeleteGroupOnly = () => {
    onDeleteGroupOnly();
    onClose();
  };

  const handleDeleteGroupAndPages = () => {
    onDeleteGroupAndPages();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader className="text-left">
          {/* Ícone e Título lado a lado */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/10 p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <AlertDialogTitle className="text-left">
              {t("modals.delete_group.title")}
              {groupName && ` "${groupName}"`}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
            {t("modals.delete_group.description", { count: pageCount })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="m-0 flex-1">
            {t("modals.delete_group.cancel")}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="lg"
            className="animate-glow-red flex-1"
            onClick={handleDeleteGroupOnly}
          >
            {t("modals.delete_group.delete_group_only")}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="animate-glow-red flex-1"
            onClick={handleDeleteGroupAndPages}
          >
            {t("modals.delete_group.delete_all")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
