/**
 * Updates Section
 *
 * Verifica atualizações, mostra status e permite download/instalação automática
 */

import { useState, useEffect } from "react";

import {
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { EXTERNAL_URLS } from "@/config/external-urls";
import packageJson from "../../../../../package.json";

// Tipos para o Tauri Updater (serão preenchidos quando instalar o plugin)
interface Update {
  available: boolean;
  version?: string;
  date?: string;
  body?: string;
  downloadAndInstall?: () => Promise<void>;
}

type UpdateStatus = "checking" | "available" | "upToDate" | "error" | "downloading" | "installing";

export function UpdatesSection() {
  const { t } = useTranslation("advanced-settings");
  const [status, setStatus] = useState<UpdateStatus>("upToDate");
  const [update, setUpdate] = useState<Update | null>(null);
  const [error, setError] = useState<string>("");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const currentVersion = packageJson.version;

  // Função para verificar updates
  const checkForUpdates = async () => {
    setStatus("checking");
    setError("");

    try {
      // TODO: Descomentar quando instalar @tauri-apps/plugin-updater
      // import { check } from '@tauri-apps/plugin-updater';
      // const update = await check();

      // MOCK para desenvolvimento (remover depois)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockUpdate: Update = {
        available: false, // Mude para true para testar UI de update disponível
        version: "0.1.0",
        date: new Date().toISOString(),
        body: "## What's New\n- Fixed bug in export\n- Improved performance\n- Added dark mode support",
      };

      setUpdate(mockUpdate);
      setLastChecked(new Date());

      if (mockUpdate.available) {
        setStatus("available");
      } else {
        setStatus("upToDate");
      }
    } catch (err) {
      console.error("Error checking for updates:", err);
      setError(err instanceof Error ? err.message : "Failed to check for updates");
      setStatus("error");
    }
  };

  // Verifica updates ao montar o componente
  useEffect(() => {
    checkForUpdates();
  }, []);

  // Função para baixar e instalar update
  const handleUpdate = async () => {
    if (!update?.available || !update.downloadAndInstall) return;

    setStatus("downloading");
    setDownloadProgress(0);

    try {
      // Simula progresso de download
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // TODO: Descomentar quando instalar plugin
      // await update.downloadAndInstall();

      // MOCK para desenvolvimento
      await new Promise((resolve) => setTimeout(resolve, 3000));

      clearInterval(progressInterval);
      setDownloadProgress(100);
      setStatus("installing");

      // TODO: Descomentar quando instalar plugin
      // import { relaunch } from '@tauri-apps/plugin-process';
      // await relaunch();
    } catch (err) {
      console.error("Error updating:", err);
      setError(err instanceof Error ? err.message : "Failed to update");
      setStatus("error");
    }
  };

  const openExternal = (url: string) => {
    window.open(url, "_blank");
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("updates.just_now");
    if (minutes < 60) return t("updates.minutes_ago", { count: minutes });
    if (hours < 24) return t("updates.hours_ago", { count: hours });
    return t("updates.days_ago", { count: days });
  };

  return (
    <div className="space-y-8 w-full max-w-full">
      {/* Current Version */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("updates.current_version.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("updates.current_version.description")}
          </p>
        </div>

        <div className="rounded-lg border p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">
            {t("updates.current_version.label")}
          </p>
          <p className="font-mono font-semibold text-2xl">v{currentVersion}</p>
        </div>
      </div>

      <Separator />

      {/* Update Status */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("updates.status.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("updates.status.description")}
          </p>
        </div>

        {/* Status Card */}
        <div className="rounded-lg border bg-card p-6">
          {/* Checking */}
          {status === "checking" && (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {t("updates.status.checking")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("updates.status.checking_description")}
                </p>
              </div>
            </div>
          )}

          {/* Up to Date */}
          {status === "upToDate" && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">
                  {t("updates.status.up_to_date")}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {t("updates.status.up_to_date_description")}
                </p>
                {lastChecked && (
                  <p className="text-xs text-muted-foreground">
                    {t("updates.status.last_checked")}: {formatDate(lastChecked)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Update Available */}
          {status === "available" && update && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-1">
                    {t("updates.status.available", { version: update.version })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("updates.status.available_description")}
                  </p>
                </div>

                {/* Changelog */}
                {update.body && (
                  <div className="rounded-md bg-muted/50 border p-3">
                    <p className="text-xs font-semibold mb-2">
                      {t("updates.changelog.title")}
                    </p>
                    <div className="text-xs text-muted-foreground whitespace-pre-line">
                      {update.body}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpdate}
                  variant="magical"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("updates.actions.download_and_install")}
                </Button>
              </div>
            </div>
          )}

          {/* Downloading */}
          {status === "downloading" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {t("updates.status.downloading")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("updates.status.downloading_description")}
                  </p>
                </div>
              </div>
              <Progress value={downloadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {downloadProgress}%
              </p>
            </div>
          )}

          {/* Installing */}
          {status === "installing" && (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {t("updates.status.installing")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("updates.status.installing_description")}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">
                  {t("updates.status.error")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {error || t("updates.status.error_description")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Manual Check Button */}
        {(status === "upToDate" || status === "error") && (
          <Button
            onClick={checkForUpdates}
            variant="secondary"
            className="w-full"
            disabled={status === "checking"}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("updates.actions.check_for_updates")}
          </Button>
        )}
      </div>

      <Separator />

      {/* Support Link */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("updates.support.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("updates.support.description")}
          </p>
        </div>

        <div
          className="rounded-lg border bg-card p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-start gap-3"
          onClick={() => openExternal(EXTERNAL_URLS.support)}
        >
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <ExternalLink className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-2 mb-0.5">
              {t("updates.support.button")}
              <ExternalLink className="w-3 h-3" />
            </div>
            <div className="text-xs text-muted-foreground">
              {t("updates.support.button_description")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
