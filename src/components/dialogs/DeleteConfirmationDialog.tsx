import * as React from "react";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityName: string;
  onConfirm: () => Promise<void>;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * DeleteConfirmationDialog - Standardized delete confirmation dialog
 *
 * @example
 * ```tsx
 * <DeleteConfirmationDialog
 *   open={showDeleteDialog}
 *   onOpenChange={setShowDeleteDialog}
 *   entityType="região"
 *   entityName={region.name}
 *   onConfirm={handleDelete}
 * >
 *   <p className="text-sm text-muted-foreground">
 *     Todas as versões também serão excluídas.
 *   </p>
 * </DeleteConfirmationDialog>
 * ```
 */
export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  entityType,
  entityName,
  onConfirm,
  children,
  title,
  description,
  confirmText,
  cancelText,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation("common");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const displayConfirmText = confirmText ?? t("delete_confirmation.confirm");
  const displayCancelText = cancelText ?? t("delete_confirmation.cancel");

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting entity:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle>
                {title || t("delete_confirmation.title", { type: entityType })}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="pt-2">
            {description ||
              t("delete_confirmation.message", { name: entityName })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {children && (
          <div className="rounded-md bg-muted p-4 space-y-2">{children}</div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {displayCancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting && <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-primary" />}
            {isDeleting ? t("actions.deleting") : displayConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
