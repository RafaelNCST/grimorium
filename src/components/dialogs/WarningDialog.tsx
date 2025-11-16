import * as React from "react";

import { AlertTriangle } from "lucide-react";

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

export interface WarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  children?: React.ReactNode;
}

/**
 * WarningDialog - Standardized warning/confirmation dialog
 *
 * @example
 * ```tsx
 * <WarningDialog
 *   open={showWarning}
 *   onOpenChange={setShowWarning}
 *   title="Trocar imagem do mapa?"
 *   description="Existem elementos posicionados neste mapa. Ao trocar a imagem, todos os elementos serão removidos."
 *   cancelText="Cancelar"
 *   confirmText="Continuar e escolher imagem"
 *   onConfirm={handleConfirm}
 * />
 * ```
 */
export function WarningDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  children,
}: WarningDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-3">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {children && (
          <div className="rounded-md bg-muted p-4 space-y-2">{children}</div>
        )}

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="h-11 flex-1 m-0">
            {cancelText}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="lg"
            className="animate-glow-red flex-1"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
