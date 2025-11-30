import { useTranslation } from "react-i18next";

import { FileText, Type, BookOpen } from "lucide-react";

interface StatsBarProps {
  wordCount: number;
  characterCount: number;
  pageCount: number;
}

export function StatsBar({ wordCount, characterCount, pageCount }: StatsBarProps) {
  const { t } = useTranslation("chapter-editor");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-6 py-2">
      <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
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
          <BookOpen className="w-4 h-4" />
          <span>
            <strong className="text-foreground">{pageCount}</strong> {t("stats.pages")}
          </span>
        </div>
      </div>
    </div>
  );
}
