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
import { useTranslation } from "react-i18next";

interface ClearAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  areaName: string;
}

export function ClearAreaDialog({
  open,
  onOpenChange,
  onConfirm,
  areaName,
}: ClearAreaDialogProps) {
  const { t } = useTranslation("power-system");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("clear_area_dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("clear_area_dialog.description", { areaName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("clear_area_dialog.cancel")}</AlertDialogCancel>
          <Button
            variant="destructive"
            size="lg"
            className="animate-glow-red"
            onClick={onConfirm}
          >
            {t("clear_area_dialog.clear")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
