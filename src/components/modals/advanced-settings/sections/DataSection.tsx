/**
 * Data Section
 *
 * Backup, restauração e limpeza de dados
 */

import { useState } from "react";

import { Download, Upload, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DataSection() {
  const { t } = useTranslation("advanced-settings");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      // TODO: Implementar exportação real de backup
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(t("data.backup.export_success"));
    } catch (error) {
      toast.error(t("data.backup.export_error"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = async () => {
    setIsImporting(true);
    try {
      // TODO: Implementar importação real de backup
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(t("data.backup.import_success"));
    } catch (error) {
      toast.error(t("data.backup.import_error"));
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearData = async () => {
    try {
      // TODO: Implementar limpeza real de dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(t("data.clear.success"));
      setShowClearDialog(false);

      // TODO: Reiniciar app ou redirecionar
    } catch (error) {
      toast.error(t("data.clear.error"));
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Backup */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("data.backup.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("data.backup.description")}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4"
            onClick={handleExportBackup}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-3 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">
                {t("data.backup.export_button")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("data.backup.export_description")}
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-auto p-4"
            onClick={handleImportBackup}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Upload className="w-5 h-5 mr-3 text-muted-foreground" />
            )}
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">
                {t("data.backup.import_button")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("data.backup.import_description")}
              </div>
            </div>
          </Button>
        </div>

        <div className="rounded-lg bg-muted/50 border p-4">
          <p className="text-xs text-muted-foreground">
            💡 {t("data.backup.note")}
          </p>
        </div>
      </div>

      {/* Clear Data */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1 text-destructive">
            {t("data.clear.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("data.clear.description")}
          </p>
        </div>

        <div className="rounded-lg border-2 border-destructive/50 bg-destructive/5 p-4">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-destructive mb-1">
                {t("data.clear.warning_title")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("data.clear.warning_description")}
              </p>
            </div>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowClearDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("data.clear.button")}
          </Button>
        </div>
      </div>

      {/* Clear Data Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              {t("data.clear.dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>{t("data.clear.dialog.description")}</p>
              <p className="font-semibold text-foreground">
                {t("data.clear.dialog.confirmation")}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("data.clear.dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t("data.clear.dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
