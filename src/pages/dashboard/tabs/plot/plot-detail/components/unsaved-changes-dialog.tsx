import { useTranslation } from "react-i18next";

import { WarningDialog } from "@/components/dialogs/WarningDialog";

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onConfirm,
}: UnsavedChangesDialogProps) {
  const { t } = useTranslation("plot");

  return (
    <WarningDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={t("unsaved_changes.title")}
      description={t("unsaved_changes.description")}
      cancelText={t("unsaved_changes.cancel")}
      confirmText={t("unsaved_changes.confirm")}
    />
  );
}
