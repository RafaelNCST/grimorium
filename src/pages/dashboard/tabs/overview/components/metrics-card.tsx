import { useState, useEffect } from "react";

import {
  BookOpen,
  TrendingUp,
  Calendar,
  Target,
  Type,
  Hash,
  FileEdit,
  CheckCircle,
  FileText,
  ClipboardList,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { IOverviewStats } from "../types/overview-types";

interface MetricsCardProps {
  stats: IOverviewStats;
  isCustomizing?: boolean;
}

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  delay?: string;
  colorClass: string;
  bgColorClass: string;
}

function MetricItem({
  icon: Icon,
  label,
  value,
  subtitle,
  delay,
  colorClass,
  bgColorClass,
}: MetricItemProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div
        className={`h-10 w-10 rounded-lg ${bgColorClass} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground truncate">
          {label}
        </p>
        <p className="text-xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export function MetricsCard({
  stats,
  isCustomizing = false,
}: MetricsCardProps) {
  const { t } = useTranslation("overview");

  // Load visibility state from localStorage or use defaults
  const [row1Visible, setRow1Visible] = useState(() => {
    const saved = localStorage.getItem("metrics-row1-visible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [row2Visible, setRow2Visible] = useState(() => {
    const saved = localStorage.getItem("metrics-row2-visible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [row3Visible, setRow3Visible] = useState(() => {
    const saved = localStorage.getItem("metrics-row3-visible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist visibility state to localStorage
  useEffect(() => {
    localStorage.setItem("metrics-row1-visible", JSON.stringify(row1Visible));
  }, [row1Visible]);

  useEffect(() => {
    localStorage.setItem("metrics-row2-visible", JSON.stringify(row2Visible));
  }, [row2Visible]);

  useEffect(() => {
    localStorage.setItem("metrics-row3-visible", JSON.stringify(row3Visible));
  }, [row3Visible]);

  // Row 1 - General (Blue/Primary)
  const row1Metrics = [
    {
      icon: Type,
      label: t("stats.total_words"),
      value:
        stats.totalWords > 0 ? `${(stats.totalWords / 1000).toFixed(1)}k` : "0",
      delay: "0s",
      colorClass: "text-primary",
      bgColorClass: "bg-primary/10",
    },
    {
      icon: Hash,
      label: t("stats.total_characters"),
      value:
        stats.totalCharacters > 0
          ? `${(stats.totalCharacters / 1000).toFixed(0)}k`
          : "0",
      delay: "0.05s",
      colorClass: "text-primary",
      bgColorClass: "bg-primary/10",
    },
    {
      icon: BookOpen,
      label: t("stats.chapters"),
      value: stats.totalChapters,
      delay: "0.1s",
      colorClass: "text-primary",
      bgColorClass: "bg-primary/10",
    },
    {
      icon: Target,
      label: t("stats.last_released_chapter"),
      value:
        stats.lastChapterNumber > 0
          ? `Cap. ${stats.lastChapterNumber}`
          : t("stats.no_chapter"),
      subtitle: stats.lastChapterName,
      delay: "0.15s",
      colorClass: "text-primary",
      bgColorClass: "bg-primary/10",
    },
  ];

  // Row 2 - Averages (Green)
  const row2Metrics = [
    {
      icon: TrendingUp,
      label: t("stats.average_per_week"),
      value: stats.averagePerWeek,
      delay: "0.2s",
      colorClass: "text-green-600 dark:text-green-500",
      bgColorClass: "bg-green-500/10",
    },
    {
      icon: Calendar,
      label: t("stats.average_per_month"),
      value: stats.averagePerMonth,
      delay: "0.25s",
      colorClass: "text-green-600 dark:text-green-500",
      bgColorClass: "bg-green-500/10",
    },
    {
      icon: Type,
      label: t("stats.average_words_per_chapter"),
      value: stats.averageWordsPerChapter,
      delay: "0.3s",
      colorClass: "text-green-600 dark:text-green-500",
      bgColorClass: "bg-green-500/10",
    },
    {
      icon: Hash,
      label: t("stats.average_characters_per_chapter"),
      value: stats.averageCharactersPerChapter,
      delay: "0.35s",
      colorClass: "text-green-600 dark:text-green-500",
      bgColorClass: "bg-green-500/10",
    },
  ];

  // Row 3 - Status (Amber/Orange)
  const row3Metrics = [
    {
      icon: FileEdit,
      label: t("stats.chapters_in_progress"),
      value: stats.chaptersInProgress,
      delay: "0.4s",
      colorClass: "text-amber-600 dark:text-amber-500",
      bgColorClass: "bg-amber-500/10",
    },
    {
      icon: CheckCircle,
      label: t("stats.chapters_finished"),
      value: stats.chaptersFinished,
      delay: "0.45s",
      colorClass: "text-amber-600 dark:text-amber-500",
      bgColorClass: "bg-amber-500/10",
    },
    {
      icon: FileText,
      label: t("stats.chapters_draft"),
      value: stats.chaptersDraft,
      delay: "0.5s",
      colorClass: "text-amber-600 dark:text-amber-500",
      bgColorClass: "bg-amber-500/10",
    },
    {
      icon: ClipboardList,
      label: t("stats.chapters_planning"),
      value: stats.chaptersPlanning,
      delay: "0.55s",
      colorClass: "text-amber-600 dark:text-amber-500",
      bgColorClass: "bg-amber-500/10",
    },
  ];

  return (
    <Card className="card-magical w-full animate-fade-in">
      <CardHeader>
        <CardTitle>{t("metrics.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Row 1 - General (Blue/Primary) */}
        <div>
          {isCustomizing && (
            <div className="flex items-center justify-end mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const newValue = !row1Visible;
                  setRow1Visible(newValue);
                  console.log("Row1 toggled to:", newValue);
                }}
                title={
                  row1Visible
                    ? "Esconder no modo visualização"
                    : "Mostrar no modo visualização"
                }
              >
                {row1Visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
          {(row1Visible || isCustomizing) && (
            <div
              className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${
                isCustomizing && !row1Visible
                  ? "opacity-50 border-2 border-dashed border-muted-foreground/30 rounded-lg p-2"
                  : ""
              }`}
            >
              {row1Metrics.map((metric, index) => (
                <MetricItem
                  key={index}
                  icon={metric.icon}
                  label={metric.label}
                  value={metric.value}
                  subtitle={metric.subtitle}
                  delay={metric.delay}
                  colorClass={metric.colorClass}
                  bgColorClass={metric.bgColorClass}
                />
              ))}
            </div>
          )}
        </div>

        {/* Row 2 - Averages (Green) */}
        <div
          className={
            row1Visible && !isCustomizing
              ? "pt-4 border-t border-border/50"
              : ""
          }
        >
          {isCustomizing && (
            <div className="flex items-center justify-end mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const newValue = !row2Visible;
                  setRow2Visible(newValue);
                  console.log("Row2 toggled to:", newValue);
                }}
                title={
                  row2Visible
                    ? "Esconder no modo visualização"
                    : "Mostrar no modo visualização"
                }
              >
                {row2Visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
          {(row2Visible || isCustomizing) && (
            <div
              className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${
                isCustomizing && !row2Visible
                  ? "opacity-50 border-2 border-dashed border-muted-foreground/30 rounded-lg p-2"
                  : ""
              }`}
            >
              {row2Metrics.map((metric, index) => (
                <MetricItem
                  key={index}
                  icon={metric.icon}
                  label={metric.label}
                  value={metric.value}
                  subtitle={metric.subtitle}
                  delay={metric.delay}
                  colorClass={metric.colorClass}
                  bgColorClass={metric.bgColorClass}
                />
              ))}
            </div>
          )}
        </div>

        {/* Row 3 - Status (Amber/Orange) */}
        <div
          className={
            (row1Visible || row2Visible) && !isCustomizing
              ? "pt-4 border-t border-border/50"
              : ""
          }
        >
          {isCustomizing && (
            <div className="flex items-center justify-end mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const newValue = !row3Visible;
                  setRow3Visible(newValue);
                  console.log("Row3 toggled to:", newValue);
                }}
                title={
                  row3Visible
                    ? "Esconder no modo visualização"
                    : "Mostrar no modo visualização"
                }
              >
                {row3Visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
          {(row3Visible || isCustomizing) && (
            <div
              className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${
                isCustomizing && !row3Visible
                  ? "opacity-50 border-2 border-dashed border-muted-foreground/30 rounded-lg p-2"
                  : ""
              }`}
            >
              {row3Metrics.map((metric, index) => (
                <MetricItem
                  key={index}
                  icon={metric.icon}
                  label={metric.label}
                  value={metric.value}
                  subtitle={metric.subtitle}
                  delay={metric.delay}
                  colorClass={metric.colorClass}
                  bgColorClass={metric.bgColorClass}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
