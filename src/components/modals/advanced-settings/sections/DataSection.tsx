/**
 * Data Section
 *
 * Backup, restauração, limpeza de dados, privacidade e coleta de dados
 */

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Shield,
  FileText,
  BarChart3,
  Info,
  HardDrive,
  FolderOpen,
  Copy,
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function DataSection() {
  const { t } = useTranslation("advanced-settings");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [allowUsageData, setAllowUsageData] = useState(false);
  const [dataPath, setDataPath] = useState<string>("");
  const [dataSize, setDataSize] = useState<number>(0);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const [copiedPath, setCopiedPath] = useState(false);

  // Load storage information on mount
  useEffect(() => {
    const loadStorageInfo = async () => {
      try {
        setIsLoadingStorage(true);
        const [path, size] = await Promise.all([
          invoke<string>("get_app_data_path"),
          invoke<number>("get_app_data_size"),
        ]);
        setDataPath(path);
        setDataSize(size);
      } catch (error) {
        console.error("Failed to load storage info:", error);
      } finally {
        setIsLoadingStorage(false);
      }
    };

    loadStorageInfo();
  }, []);

  const handleOpenDataFolder = async () => {
    try {
      await invoke("open_data_folder");
    } catch (error) {
      console.error("Failed to open data folder:", error);
    }
  };

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(dataPath);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    } catch (error) {
      console.error("Failed to copy path:", error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowClearDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsageDataToggle = (checked: boolean) => {
    setAllowUsageData(checked);
  };

  const openExternal = (url: string) => {
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

      {/* Local Storage */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("data.storage.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("data.storage.description")}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
          {/* Storage Size */}
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
              <HardDrive className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">
                  {t("data.storage.size_label")}
                </span>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {isLoadingStorage ? (
                    <div className="w-16 h-4 animate-pulse bg-muted-foreground/20 rounded" />
                  ) : (
                    formatBytes(dataSize)
                  )}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("data.storage.size_description")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Data Path */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold mb-1">
                  {t("data.storage.location_label")}
                </div>
                <div className="rounded-md bg-muted/70 border p-2 mb-2">
                  {isLoadingStorage ? (
                    <div className="w-full h-4 animate-pulse bg-muted-foreground/20 rounded" />
                  ) : (
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      {dataPath}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={handleCopyPath}
                    disabled={isLoadingStorage || !dataPath}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    {copiedPath
                      ? t("data.storage.copied")
                      : t("data.storage.copy_path")}
                  </Button>
                  <Button
                    variant="magical"
                    size="sm"
                    className="flex-1"
                    onClick={handleOpenDataFolder}
                    disabled={isLoadingStorage}
                  >
                    <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                    {t("data.storage.open_folder")}
                  </Button>
                </div>
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
                  <Label
                    htmlFor="usage-data"
                    className="text-sm font-semibold cursor-pointer"
                  >
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
                    <p className="font-medium">
                      {t("data.privacy.what_we_collect")}
                    </p>
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
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-white/5 dark:hover:bg-white/10 cursor-pointer"
            }`}
            onClick={isExporting ? undefined : handleExportBackup}
          >
            <div
              className={`rounded-lg p-2 flex-shrink-0 ${isExporting ? "bg-muted" : "bg-blue-500/10"}`}
            >
              {isExporting ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-transparent border-t-primary" />
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
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-white/5 dark:hover:bg-white/10 cursor-pointer"
            }`}
            onClick={isImporting ? undefined : handleImportBackup}
          >
            <div
              className={`rounded-lg p-2 flex-shrink-0 ${isImporting ? "bg-muted" : "bg-green-500/10"}`}
            >
              {isImporting ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-transparent border-t-primary" />
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
            <AlertDialogAction onClick={handleClearData} variant="destructive">
              {t("data.clear.dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
