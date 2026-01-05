import { useEffect, useState } from "react";

import { FileText, Type, AlignLeft, MessageSquare, List } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { InfoAlert } from "@/components/ui/info-alert";
import {
  shouldShowChapterWarning,
  getChapterLimitForSize,
} from "@/lib/constants/plot-arc-chapter-limits";
import {
  getPlotArcChapterMetrics,
  type PlotArcChapterMetrics,
} from "@/lib/services/chapter-metrics.service";
import type { PlotArcSize } from "@/types/plot-types";

interface PropsPlotArcChapterMetricsSection {
  bookId: string;
  plotArcId: string;
  arcSize: PlotArcSize;
  onChapterClick: (chapterId: string) => void;
  /** Callback when metrics are loaded */
  onMetricsLoad?: (hasMetrics: boolean) => void;
  /** If in edit mode, show InfoAlert instead of null */
  isEditMode?: boolean;
}

export function PlotArcChapterMetricsSection({
  bookId,
  plotArcId,
  arcSize,
  onChapterClick: _onChapterClick,
  onMetricsLoad,
  isEditMode = false,
}: PropsPlotArcChapterMetricsSection) {
  const { t } = useTranslation("chapter-metrics");

  const [metrics, setMetrics] = useState<PlotArcChapterMetrics | null>(null);
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
        const data = await getPlotArcChapterMetrics(bookId, plotArcId);
        setMetrics(data);
        const hasMetrics = data && data.totalChapters > 0;
        onMetricsLoad?.(hasMetrics);
      } catch (error) {
        console.error("Failed to load plot arc chapter metrics:", error);
        setMetrics(null);
        onMetricsLoad?.(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, plotArcId]);

  if (!bookId) {
    return null;
  }

  // Format numbers with thousands separator
  const formatNumber = (num: number): string =>
    new Intl.NumberFormat("pt-BR").format(num);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !metrics || metrics.totalChapters === 0 ? (
        isEditMode ? (
          <InfoAlert>{t("plot_section.no_chapters")}</InfoAlert>
        ) : null
      ) : (
        <div className="space-y-6">
          {/* Total Chapters - Highlighted */}
          <div className="flex items-center justify-center">
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                {t("plot_section.total_chapters")}
              </p>
              <div className="text-4xl font-bold text-primary">
                {metrics.totalChapters}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalChapters === 1
                  ? t("plot_section.chapter_singular")
                  : t("plot_section.chapter_plural")}
              </p>
            </div>
          </div>

          {/* Chapter Limit Warning */}
          {shouldShowChapterWarning(metrics.totalChapters, arcSize) && (
            <InfoAlert>
              {t("plot_section.chapter_limit_exceeded", {
                totalChapters: metrics.totalChapters,
                maxChapters: getChapterLimitForSize(arcSize).maxChapters,
                arcSize,
              })}
            </InfoAlert>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Words */}
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("plot_section.total_words")}
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(metrics.totalWords)}
                </div>
              </div>
            </Card>

            {/* Characters */}
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("plot_section.total_characters")}
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(metrics.totalCharacters)}
                </div>
              </div>
            </Card>

            {/* Characters with Spaces */}
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("plot_section.total_characters_with_spaces")}
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(metrics.totalCharactersWithSpaces)}
                </div>
              </div>
            </Card>

            {/* Paragraphs */}
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("plot_section.total_paragraphs")}
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(metrics.totalParagraphs)}
                </div>
              </div>
            </Card>

            {/* Dialogues */}
            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("plot_section.total_dialogues")}
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(metrics.totalDialogues)}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
