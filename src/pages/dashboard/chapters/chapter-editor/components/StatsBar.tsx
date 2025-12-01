import { useTranslation } from "react-i18next";

import { FileText, Type, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  wordCount: number;
  characterCount: number;
  characterCountWithSpaces: number;
  isSaving?: boolean;
}

export function StatsBar({ wordCount, characterCount, characterCountWithSpaces, isSaving = false }: StatsBarProps) {
  const { t } = useTranslation("chapter-editor");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Left: Save Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-[120px]">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{t("save.saving")}</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-500">{t("save.saved")}</span>
            </>
          )}
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <span>
              <strong className="text-foreground">{wordCount}</strong> {t("stats.words")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>
              <strong className="text-foreground">{characterCount}</strong> {t("stats.characters")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>
              <strong className="text-foreground">{characterCountWithSpaces}</strong> {t("stats.characters_with_spaces")}
            </span>
          </div>
        </div>

        {/* Right: Spacer for balance */}
        <div className="min-w-[120px]"></div>
      </div>
    </div>
  );
}
