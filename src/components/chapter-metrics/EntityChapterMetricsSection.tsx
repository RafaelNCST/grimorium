import { useEffect, useState } from "react";

import { BookOpen, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoAlert } from "@/components/ui/info-alert";
import {
  getEntityChapterMetrics,
  type EntityChapterMetrics,
} from "@/lib/services/chapter-metrics.service";

type EntityType = "character" | "region" | "item" | "faction" | "race";

interface PropsEntityChapterMetricsSection {
  bookId: string;
  entityId: string;
  entityType: EntityType;
  onChapterClick: (chapterId: string) => void;
  /** Callback when metrics are loaded */
  onMetricsLoad?: (hasMetrics: boolean) => void;
  /** If in edit mode, show InfoAlert instead of null */
  isEditMode?: boolean;
}

export function EntityChapterMetricsSection({
  bookId,
  entityId,
  entityType,
  onChapterClick,
  onMetricsLoad,
  isEditMode = false,
}: PropsEntityChapterMetricsSection) {
  const { t } = useTranslation("chapter-metrics");

  const [metrics, setMetrics] = useState<EntityChapterMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      if (!bookId) {
        setIsLoading(false);
        onMetricsLoad?.(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getEntityChapterMetrics(
          bookId,
          entityId,
          entityType
        );
        setMetrics(data);
        const hasMetrics = data && data.totalMentions > 0;
        onMetricsLoad?.(hasMetrics);
      } catch (error) {
        console.error("Failed to load chapter metrics:", error);
        setMetrics(null);
        onMetricsLoad?.(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, entityId, entityType]);

  if (!bookId) {
    return null;
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !metrics || metrics.totalMentions === 0 ? (
        isEditMode ? (
          <InfoAlert>{t(`entity_section.no_mentions.${entityType}`)}</InfoAlert>
        ) : null
      ) : (
        <div className="space-y-6">
          {/* Total Mentions - Destacado */}
          <div className="flex items-center justify-center">
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("entity_section.total_mentions")}
              </p>
              <div className="text-4xl font-bold text-primary">
                {metrics.totalMentions}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalMentions === 1
                  ? t("entity_section.chapter_singular")
                  : t("entity_section.chapter_plural")}
              </p>
            </div>
          </div>

          {/* First and Last Chapter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Chapter */}
            {metrics.firstChapter && (
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("entity_section.first_mention")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium line-clamp-2">
                      <span className="text-muted-foreground">
                        {t("entity_section.chapter_label")}{" "}
                        {metrics.firstChapter.chapterNumber}
                      </span>
                      : {metrics.firstChapter.title}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onChapterClick(metrics.firstChapter!.id)}
                    className="w-full justify-center gap-1"
                  >
                    {t("entity_section.view_chapter")}
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Last Chapter */}
            {metrics.lastChapter && (
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("entity_section.last_mention")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium line-clamp-2">
                      <span className="text-muted-foreground">
                        {t("entity_section.chapter_label")}{" "}
                        {metrics.lastChapter.chapterNumber}
                      </span>
                      : {metrics.lastChapter.title}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onChapterClick(metrics.lastChapter!.id)}
                    className="w-full justify-center gap-1"
                  >
                    {t("entity_section.view_chapter")}
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
