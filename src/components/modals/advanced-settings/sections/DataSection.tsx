/**
 * Data Section
 *
 * Backup, restauração, limpeza de dados, privacidade e coleta de dados
 */

import { useState } from "react";

import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Loader2,
  Shield,
  FileText,
  BarChart3,
  Info
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function DataSection() {
  const { t } = useTranslation("advanced-settings");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [allowUsageData, setAllowUsageData] = useState(false);

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      // TODO: Implementar exportação real de backup
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportBackup = async () => {
    setIsImporting(true);
    try {
      // TODO: Implementar importação real de backup
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearData = async () => {
    try {
      // TODO: Implementar limpeza real de dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowClearDialog(false);

      // TODO: Reiniciar app ou redirecionar
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsageDataToggle = (checked: boolean) => {
    setAllowUsageData(checked);
    // TODO: Implementar persistência da preferência
  };

  const openExternal = (url: string) => {
    // TODO: Usar Tauri shell.open para abrir URLs externas
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8 w-full max-w-full">
      {/* Privacy Policy and Terms */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("data.legal.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("data.legal.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className="rounded-lg border bg-card p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-start gap-3"
            onClick={() => openExternal("#privacy-policy")}
          >
            <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm mb-0.5">
                {t("data.legal.privacy_policy")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("data.legal.privacy_policy_description")}
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border bg-card p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-start gap-3"
            onClick={() => openExternal("#terms-of-use")}
          >
            <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm mb-0.5">
                {t("data.legal.terms_of_use")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("data.legal.terms_of_use_description")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Data Collection */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("data.privacy.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("data.privacy.description")}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="usage-data" className="text-sm font-semibold cursor-pointer">
                    {t("data.privacy.usage_data_label")}
                  </Label>
                  <Switch
                    id="usage-data"
                    checked={allowUsageData}
                    onCheckedChange={handleUsageDataToggle}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("data.privacy.usage_data_description")}
                </p>
              </div>

              <div className="rounded-md bg-muted/50 border p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">{t("data.privacy.what_we_collect")}</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-1">
                      <li>{t("data.privacy.collect_item_1")}</li>
                      <li>{t("data.privacy.collect_item_2")}</li>
                      <li>{t("data.privacy.collect_item_3")}</li>
                      <li>{t("data.privacy.collect_item_4")}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {t("data.privacy.privacy_guarantee_title")}
                  </span>{" "}
                  {t("data.privacy.privacy_guarantee_description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("data.backup.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("data.backup.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className={`rounded-lg border bg-card p-4 flex items-start gap-3 transition-colors duration-200 ${
              isExporting
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-white/5 dark:hover:bg-white/10 cursor-pointer'
            }`}
            onClick={isExporting ? undefined : handleExportBackup}
          >
            <div className={`rounded-lg p-2 flex-shrink-0 ${isExporting ? 'bg-muted' : 'bg-blue-500/10'}`}>
              {isExporting ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm mb-0.5">
                {t("data.backup.export_button")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("data.backup.export_description")}
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg border bg-card p-4 flex items-start gap-3 transition-colors duration-200 ${
              isImporting
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-white/5 dark:hover:bg-white/10 cursor-pointer'
            }`}
            onClick={isImporting ? undefined : handleImportBackup}
          >
            <div className={`rounded-lg p-2 flex-shrink-0 ${isImporting ? 'bg-muted' : 'bg-green-500/10'}`}>
              {isImporting ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm mb-0.5">
                {t("data.backup.import_button")}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("data.backup.import_description")}
              </div>
            </div>
          </div>
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
              variant="destructive"
            >
              {t("data.clear.dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
