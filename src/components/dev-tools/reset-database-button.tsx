import { useState } from "react";

import { Trash2, Database } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resetDatabase, getDatabasePath } from "@/lib/db/reset";

/**
 * Botão de reset do banco de dados - APENAS PARA DESENVOLVIMENTO
 * Remove completamente o arquivo do banco de dados e recria do zero
 */
export function ResetDatabaseButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [dbPath, setDbPath] = useState<string>("");

  const handleOpenDialog = async () => {
    try {
      const path = await getDatabasePath();
      setDbPath(path);
      setShowDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetDatabase();

      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsResetting(false);
    }
  };

  // Only show in development mode
  const isDev = import.meta.env.DEV;
  if (!isDev) return null;

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleOpenDialog}
        className="fixed bottom-4 right-4 z-50 gap-2"
      >
        <Database className="h-4 w-4" />
        Reset DB (DEV)
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Resetar Banco de Dados
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p className="font-semibold text-foreground">
                ATENÇÃO: Esta ação é irreversível!
              </p>
              <p>
                Todos os dados do banco de dados serão permanentemente
                deletados:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Todos os livros criados</li>
                <li>Todos os personagens</li>
                <li>Relacionamentos e famílias</li>
                <li>Versões de personagens</li>
                <li>Todas as configurações salvas</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-4 font-mono break-all">
                Arquivo: {dbPath}
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isResetting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={handleReset}
              disabled={isResetting}
              className="gap-2 animate-glow-red"
            >
              {isResetting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                  Resetando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Confirmar Reset
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
