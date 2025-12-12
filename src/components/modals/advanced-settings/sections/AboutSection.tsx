/**
 * About Section
 *
 * Informações do app, reportar bugs e fazer sugestões
 */

import { Bug, Lightbulb, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";

const APP_VERSION = "0.0.0"; // TODO: Pegar do package.json ou ambiente
const GITHUB_ISSUES_URL = "https://github.com/seu-usuario/grimorium/issues";
const GITHUB_DISCUSSIONS_URL =
  "https://github.com/seu-usuario/grimorium/discussions";

export function AboutSection() {
  const { t } = useTranslation("advanced-settings");

  const openExternal = (url: string) => {
    // TODO: Usar Tauri shell.open para abrir URLs externas
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-8 w-full max-w-full">
      {/* App Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-3xl">📖</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Grimorium</h3>
            <p className="text-sm text-muted-foreground">
              {t("about.app.tagline")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4 bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">
              {t("about.app.version_label")}
            </p>
            <p className="font-mono font-semibold">v{APP_VERSION}</p>
          </div>

          <div className="rounded-lg border p-4 bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">
              {t("about.app.release_label")}
            </p>
            <p className="font-semibold">{t("about.app.release_status")}</p>
          </div>
        </div>
      </div>

      {/* Report Bug */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
            <Bug className="w-4 h-4" />
            {t("about.bug_report.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("about.bug_report.description")}
          </p>
        </div>

        <div
          className="rounded-lg border bg-card p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-start gap-3"
          onClick={() => openExternal(GITHUB_ISSUES_URL)}
        >
          <div className="rounded-lg bg-destructive/10 p-2 flex-shrink-0">
            <Bug className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-2 mb-0.5">
              {t("about.bug_report.button")}
              <ExternalLink className="w-3 h-3" />
            </div>
            <div className="text-xs text-muted-foreground">
              {t("about.bug_report.help")}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 border p-3">
          <p className="text-xs text-muted-foreground">
            💡 {t("about.bug_report.note")}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            {t("about.suggestions.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("about.suggestions.description")}
          </p>
        </div>

        <div
          className="rounded-lg border bg-card p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-start gap-3"
          onClick={() => openExternal(GITHUB_DISCUSSIONS_URL)}
        >
          <div className="rounded-lg bg-amber-500/10 p-2 flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-2 mb-0.5">
              {t("about.suggestions.button")}
              <ExternalLink className="w-3 h-3" />
            </div>
            <div className="text-xs text-muted-foreground">
              {t("about.suggestions.help")}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <Separator />
      <div className="space-y-4">
        <h3 className="text-base font-semibold">{t("about.info.title")}</h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-muted-foreground">
              {t("about.info.technology")}
            </span>
            <span className="font-medium">React + Tauri</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-muted-foreground">
              {t("about.info.platform")}
            </span>
            <span className="font-medium">Desktop (Windows, macOS, Linux)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-muted-foreground">
              {t("about.info.license")}
            </span>
            <span className="font-medium">Proprietary</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Separator />
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          {t("about.footer.made_with")} ❤️ {t("about.footer.for_writers")}
        </p>
        <p className="text-xs text-muted-foreground">
          © 2025 Grimorium. {t("about.footer.rights")}
        </p>
      </div>
    </div>
  );
}
