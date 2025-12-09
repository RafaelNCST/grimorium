import {
  FileText,
  Type,
  Check,
  Loader2,
  AlignLeft,
  List,
  MessageCircle,
  Clock,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { ChapterMetrics } from "../types/metrics";

interface StatsBarProps {
  metrics: ChapterMetrics;
  isSaving?: boolean;
  onOpenDetails?: () => void;
}

export function StatsBar({
  metrics,
  isSaving = false,
  onOpenDetails,
}: StatsBarProps) {
  const { t } = useTranslation(["chapter-editor", "tooltips"]);

  const formatSessionTime = (minutes: number): string => {
    if (minutes < 1) return "< 1min";
    if (minutes < 60) return `${minutes}min`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-6 py-2 transition-opacity duration-200",
          onOpenDetails && "cursor-pointer hover:opacity-90"
        )}
        onClick={onOpenDetails}
      >
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
                <span className="text-green-600 dark:text-green-500">
                  {t("save.saved")}
                </span>
              </>
            )}
          </div>

          {/* Center: Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {/* Palavras */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span>
                    <strong className="text-foreground">{metrics.wordCount}</strong>{" "}
                    {t("stats_bar.words")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("stats_bar.words_tooltip")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Caracteres */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>
                    <strong className="text-foreground">
                      {metrics.characterCount}
                    </strong>{" "}
                    {t("stats_bar.characters")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("stats_bar.characters_tooltip")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Parágrafos */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" />
                  <span>
                    <strong className="text-foreground">
                      {metrics.paragraphCount}
                    </strong>{" "}
                    {t("stats_bar.paragraphs")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("stats_bar.paragraphs_tooltip")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Sentenças */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  <span>
                    <strong className="text-foreground">
                      {metrics.sentenceCount}
                    </strong>{" "}
                    {t("stats_bar.sentences")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("stats_bar.sentences_tooltip")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Diálogos */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    <strong className="text-foreground">
                      {metrics.dialogueCount}
                    </strong>{" "}
                    {t("stats_bar.dialogues")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("stats_bar.dialogues_tooltip")}</p>
              </TooltipContent>
            </Tooltip>

            {/* Tempo de Sessão */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    <strong className="text-foreground">
                      {formatSessionTime(metrics.sessionDuration)}
                    </strong>{" "}
                    {t("stats_bar.session_time")}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("stats_bar.session_time_tooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Info Icon */}
          <div className="min-w-[120px] flex justify-end">
            {onOpenDetails && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Info className="w-3 h-3" />
                    <span>{t("stats_bar.details")}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("tooltips:instructions.click_for_detailed_stats")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
