/**
 * Modal de Detalhes das Estatísticas
 *
 * Exibe informações detalhadas e explicadas sobre todas as métricas do capítulo.
 */

import {
  Type,
  FileText,
  AlignLeft,
  List,
  MessageCircle,
  Clock,
  BookOpen,
  FileType,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { ChapterMetrics } from "../types/metrics";

interface StatsDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics: ChapterMetrics;
}

export function StatsDetailModal({
  open,
  onOpenChange,
  metrics,
}: StatsDetailModalProps) {
  const { t } = useTranslation("chapter-editor");

  const formatSessionTime = (minutes: number): string => {
    if (minutes < 1) return t("stats_detail.time_less_than_minute");
    if (minutes < 60)
      return `${minutes} ${minutes > 1 ? t("stats_detail.time_minutes") : t("stats_detail.time_minute")}`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0)
      return `${hours} ${hours > 1 ? t("stats_detail.time_hours") : t("stats_detail.time_hour")}`;
    return `${hours} ${hours > 1 ? t("stats_detail.time_hours") : t("stats_detail.time_hour")} ${t("stats_detail.time_and")} ${mins} ${mins > 1 ? t("stats_detail.time_minutes") : t("stats_detail.time_minute")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {t("stats_detail.title")}
            </DialogTitle>
            <DialogDescription>
              {t("stats_detail.description")}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 pb-6 overflow-y-auto flex-1">
          {/* Métricas Básicas */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t("stats_detail.basic_metrics")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={Type}
                label={t("stats_detail.words")}
                value={metrics.wordCount.toLocaleString()}
                description={t("stats_detail.words_description")}
              />
              <MetricCard
                icon={FileText}
                label={t("stats_detail.characters")}
                value={metrics.characterCount.toLocaleString()}
                description={t("stats_detail.characters_description")}
              />
              <MetricCard
                icon={FileText}
                label={t("stats_detail.characters_with_spaces")}
                value={metrics.characterCountWithSpaces.toLocaleString()}
                description={t(
                  "stats_detail.characters_with_spaces_description"
                )}
              />
              <MetricCard
                icon={BookOpen}
                label={t("stats_detail.estimated_pages")}
                value={metrics.estimatedPages.toString()}
                description={t("stats_detail.estimated_pages_description")}
              />
            </div>
          </div>

          <Separator />

          {/* Estrutura do Texto */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t("stats_detail.text_structure")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={AlignLeft}
                label={t("stats_detail.paragraphs")}
                value={metrics.paragraphCount.toLocaleString()}
                description={t("stats_detail.paragraphs_description")}
              />
              <MetricCard
                icon={List}
                label={t("stats_detail.sentences")}
                value={metrics.sentenceCount.toLocaleString()}
                description={t("stats_detail.sentences_description")}
              />
              <MetricCard
                icon={MessageCircle}
                label={t("stats_detail.dialogues")}
                value={metrics.dialogueCount.toLocaleString()}
                description={t("stats_detail.dialogues_description")}
              />
              <MetricCard
                icon={Type}
                label={t("stats_detail.words_per_sentence")}
                value={metrics.averageWordsPerSentence.toString()}
                description={t("stats_detail.words_per_sentence_description")}
              />
            </div>
          </div>

          <Separator />

          {/* Tempo e Leitura */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t("stats_detail.time_and_reading")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={Clock}
                label={t("stats_detail.session_time")}
                value={formatSessionTime(metrics.sessionDuration)}
                description={t("stats_detail.session_time_description")}
              />
              <MetricCard
                icon={FileType}
                label={t("stats_detail.reading_time")}
                value={`~${metrics.estimatedReadingTime} min`}
                description={t("stats_detail.reading_time_description")}
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-background rounded-b-lg">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("stats_detail.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  description: string;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold mb-1">{value}</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
