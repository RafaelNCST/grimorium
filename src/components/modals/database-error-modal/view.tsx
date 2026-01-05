import { TFunction } from "i18next";
import { AlertCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SQLiteErrorType } from "@/lib/db/error-handler";

interface DatabaseErrorModalViewProps {
  isOpen: boolean;
  errorType: SQLiteErrorType;
  onClose: () => void;
  t: TFunction;
}

interface ErrorConfig {
  title: string;
  description: string;
  additionalInfo?: string;
  actionLabel: string;
}

/**
 * Obtém a configuração de exibição baseada no tipo de erro
 */
function getErrorConfig(errorType: SQLiteErrorType, t: TFunction): ErrorConfig {
  switch (errorType) {
    case SQLiteErrorType.DISK_FULL:
      return {
        title: t("database.disk_full.title"),
        description: t("database.disk_full.message"),
        additionalInfo: t("database.disk_full.additionalInfo"),
        actionLabel: t("database.disk_full.action"),
      };

    case SQLiteErrorType.DATABASE_CORRUPT:
      return {
        title: t("database.corrupt.title"),
        description: t("database.corrupt.message"),
        additionalInfo: t("database.corrupt.additionalInfo"),
        actionLabel: t("database.corrupt.action"),
      };

    case SQLiteErrorType.DATABASE_LOCKED:
      return {
        title: t("database.locked.title"),
        description: t("database.locked.message"),
        additionalInfo: t("database.locked.additionalInfo"),
        actionLabel: t("database.locked.action"),
      };

    case SQLiteErrorType.GENERIC:
    default:
      return {
        title: t("database.generic.title"),
        description: t("database.generic.message"),
        additionalInfo: t("database.generic.additionalInfo"),
        actionLabel: t("database.generic.action"),
      };
  }
}

export function DatabaseErrorModalView({
  isOpen,
  errorType,
  onClose,
  t,
}: DatabaseErrorModalViewProps) {
  const config = getErrorConfig(errorType, t);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md font-poppins">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-400 shrink-0" />
            <AlertDialogTitle className="text-xl font-cinzel font-semibold">
              {config.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-3 font-poppins">
            {config.description}
          </AlertDialogDescription>
          {config.additionalInfo && (
            <div className="mt-3 rounded-md bg-muted p-3 text-sm text-muted-foreground font-poppins">
              {config.additionalInfo}
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <Button
            variant="destructive"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {config.actionLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
