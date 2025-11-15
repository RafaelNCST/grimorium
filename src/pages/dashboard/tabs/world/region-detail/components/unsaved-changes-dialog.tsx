import { WarningDialog, WarningDialogProps } from "@/components/dialogs/WarningDialog";

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
  title = "Descartar alterações?",
  description = "Você tem alterações não salvas. Se sair agora, todas as mudanças serão perdidas.",
}: UnsavedChangesDialogProps) {
  return (
    <WarningDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={title}
      description={description}
      cancelText="Continuar Editando"
      confirmText="Descartar Alterações"
    />
  );
}
