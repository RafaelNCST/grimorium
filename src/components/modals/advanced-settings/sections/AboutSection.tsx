/**
 * About Section
 *
 * Informações do app, reportar bugs e fazer sugestões
 */

import { Bug, Lightbulb, ExternalLink, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Separator } from "@/components/ui/separator";
import { EXTERNAL_URLS } from "@/config/external-urls";
import packageJson from "../../../../../package.json";

export function AboutSection() {
  const { t } = useTranslation("advanced-settings");

  const openExternal = (url: string) => {
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

        <div className="rounded-lg border p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">
            {t("about.app.version_label")}
          </p>
          <p className="font-mono font-semibold text-lg">v{packageJson.version}</p>
        </div>
      </div>

      {/* Quick Links */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("about.links.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("about.links.description")}
          </p>
        </div>

        <div
          className="rounded-lg border bg-card p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer flex items-start gap-3"
          onClick={() => openExternal(EXTERNAL_URLS.support)}
        >
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm flex items-center gap-2 mb-0.5">
              {t("about.links.support")}
              <ExternalLink className="w-3 h-3" />
            </div>
            <div className="text-xs text-muted-foreground">
              {t("about.links.support_description")}
            </div>
          </div>
        </div>
      </div>

      {/* Community & Feedback */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("about.community.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("about.community.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Report Bug */}
          <div
            className="rounded-lg border bg-card p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer flex flex-col gap-3"
            onClick={() => openExternal(EXTERNAL_URLS.bugReport)}
          >
            <div className="rounded-lg bg-destructive/10 p-2 w-fit">
              <Bug className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm flex items-center gap-2 mb-1">
                {t("about.community.bug_report")}
                <ExternalLink className="w-3 h-3" />
              </div>
              <div className="text-xs text-muted-foreground">
                {t("about.community.bug_report_description")}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div
            className="rounded-lg border bg-card p-4 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer flex flex-col gap-3"
            onClick={() => openExternal(EXTERNAL_URLS.suggestions)}
          >
            <div className="rounded-lg bg-amber-500/10 p-2 w-fit">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm flex items-center gap-2 mb-1">
                {t("about.community.suggestions")}
                <ExternalLink className="w-3 h-3" />
              </div>
              <div className="text-xs text-muted-foreground">
                {t("about.community.suggestions_description")}
              </div>
            </div>
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
