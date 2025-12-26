import { AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useChapterOrderWarningStore } from "@/stores/chapter-order-warning-store";

/**
 * ChapterOrderWarningModal
 *
 * Global modal that appears when chapters are detected to be out of order.
 * Warns the user about the issue.
 */
export function ChapterOrderWarningModal() {
  const { showWarning, setShowWarning } = useChapterOrderWarningStore();

  const handleClose = () => {
    setShowWarning(false);
  };

  return (
    <AlertDialog open={showWarning} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-left">
          {/* Ícone e Título lado a lado */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/10 p-2 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <AlertDialogTitle className="text-left">
              Ordem de Capítulos Incorreta
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
            Os capítulos não estão na ordem correta. Recomendamos que você use a
            ferramenta de reordenação automática para organizá-los.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Informações sobre as regras */}
        <div className="rounded-md bg-muted p-4 space-y-2">
          <p className="text-sm font-medium">A ordem correta segue estas regras:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Numeração sequencial e sem lacunas (1, 2, 3, 4...)</li>
            <li>Capítulos com mesmo número ficam ordenados por status</li>
          </ul>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogAction
            variant="secondary"
            onClick={handleClose}
            className="m-0 flex-1"
          >
            Entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
