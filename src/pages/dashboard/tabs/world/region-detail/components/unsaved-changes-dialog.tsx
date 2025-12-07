import {
  WarningDialog,
  WarningDialogProps,
} from "@/components/dialogs/WarningDialog";
import { useTranslation } from "react-i18next";

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: UnsavedChangesDialogProps) {
  const { t } = useTranslation("common");

  return (
    <WarningDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={title ?? t("unsaved_changes.title")}
      description={description ?? t("unsaved_changes.description")}
      cancelText={t("unsaved_changes.cancel")}
      confirmText={t("unsaved_changes.confirm")}
    />
  );
}
