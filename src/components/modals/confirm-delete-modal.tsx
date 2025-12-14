import { useState } from "react";

import { AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguageStore } from "@/stores/language-store";

interface PropsConfirmDeleteModal {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string; // If provided, user must type this name to confirm
  itemType?: string; // e.g., "livro", "personagem", etc.
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
}: PropsConfirmDeleteModal) {
  const { t } = useLanguageStore();
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const isConfirmEnabled = itemName ? confirmText === itemName : true;

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-left">
          {/* Ícone e Título lado a lado */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
          </div>

          <AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
            {description}
            {itemName && (
              <>
                <br />
                <br />
                <strong>Esta ação não pode ser desfeita.</strong>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {itemName && (
          <div className="space-y-3">
            <Label htmlFor="confirm-name" className="text-sm font-medium">
              {`Digite "${itemName}" para confirmar:`}
            </Label>
            <Input
              id="confirm-name"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Digite ${itemName}`}
              className="font-mono"
            />
          </div>
        )}

        <AlertDialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t("button.no")}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="animate-glow-red"
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
          >
            {t("button.yes")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
