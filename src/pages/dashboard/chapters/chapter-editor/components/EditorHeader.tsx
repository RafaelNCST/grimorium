import { useState, useRef, useEffect } from "react";

import {
  ArrowLeft,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Settings,
  AlertCircle,
  BookOpen,
  Download,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormChapterNameWithNumber } from "@/components/forms/FormChapterNameWithNumber";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  chapterNumber: string;
  title: string;
  showAllAnnotationsSidebar?: boolean;
  showPlotArcEventsSidebar?: boolean;
  hasPlotArc?: boolean;
  previousChapter?: { id: string; number: string; title: string };
  nextChapter?: { id: string; number: string; title: string };
  onBack: () => void;
  onChapterNumberChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onShowAllAnnotations: () => void;
  onShowPlotArcEvents?: () => void;
  onShowSettings: () => void;
  onNavigateToPrevious?: () => void;
  onNavigateToNext?: () => void;
  onExport?: (format: "pdf" | "word") => void;
}

export function EditorHeader({
  chapterNumber,
  title,
  showAllAnnotationsSidebar = false,
  showPlotArcEventsSidebar = false,
  hasPlotArc = false,
  previousChapter,
  nextChapter,
  onBack,
  onChapterNumberChange,
  onTitleChange,
  onShowAllAnnotations,
  onShowPlotArcEvents,
  onShowSettings,
  onNavigateToPrevious,
  onNavigateToNext,
  onExport,
}: EditorHeaderProps) {
  const { t } = useTranslation(["chapter-editor", "empty-states", "tooltips"]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        titleContainerRef.current &&
        !titleContainerRef.current.contains(event.target as Node)
      ) {
        setIsEditingTitle(false);
      }
    }

    if (isEditingTitle) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="border-b border-border bg-background">
        <div className="px-6 py-2">
          {/* Top Row - Title and Actions - Fixed height */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 min-h-[44px]">
            {/* Left: Back button */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("header_bar.back")}
              </Button>
            </div>

            {/* Center: Chapter Navigation + Title - Fixed height container */}
            <div className="flex items-center gap-3 min-h-[44px]">
              {/* Previous Chapter Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateToPrevious}
                    disabled={!previousChapter}
                    className="h-8 w-8 p-0 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200"
                  >
                    <ChevronLeft className="h-4 w-4 text-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {previousChapter ? (
                    <p>
                      {t("header_bar.chapter_title", { number: previousChapter.number, title: previousChapter.title })}
                    </p>
                  ) : (
                    <p>{t("empty-states:chapters.no_previous_chapter")}</p>
                  )}
                </TooltipContent>
              </Tooltip>

              {/* Title */}
              <div
                ref={titleContainerRef}
                className="flex justify-center items-center"
                onClick={handleTitleClick}
              >
                {isEditingTitle ? (
                  <div className="max-w-3xl w-full">
                    <FormChapterNameWithNumber
                      numberLabel=""
                      nameLabel=""
                      chapterNumber={chapterNumber}
                      chapterName={title}
                      onChapterNumberChange={onChapterNumberChange}
                      onChapterNameChange={onTitleChange}
                      maxLength={200}
                      namePlaceholder={t("chapter.title_placeholder")}
                      showCharCount={false}
                    />
                  </div>
                ) : (
                  <div className="cursor-pointer px-3 py-2">
                    <h1 className="text-lg font-semibold whitespace-nowrap">
                      {t("header_bar.chapter_title", { number: chapterNumber, title: title || t("chapter.title_placeholder") })}
                    </h1>
                  </div>
                )}
              </div>

              {/* Next Chapter Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateToNext}
                    disabled={!nextChapter}
                    className="h-8 w-8 p-0 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200"
                  >
                    <ChevronRight className="h-4 w-4 text-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {nextChapter ? (
                    <p>
                      {t("header_bar.chapter_title", { number: nextChapter.number, title: nextChapter.title })}
                    </p>
                  ) : (
                    <p>{t("empty-states:chapters.no_next_chapter")}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 justify-end">
              {onExport && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      {t("header_bar.export")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onExport("word")}>
                      {t("header_bar.export_as_word")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onExport("pdf")}>
                      {t("header_bar.export_as_pdf")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                variant="ghost-bright"
                size="sm"
                onClick={onShowAllAnnotations}
                className={cn(
                  "border border-transparent transition-all duration-200",
                  showAllAnnotationsSidebar
                    ? "bg-primary/10 border-primary text-primary"
                    : "hover:bg-primary/5 hover:border-primary/30 hover:text-primary"
                )}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {t("header_bar.annotations")}
              </Button>

              {hasPlotArc && onShowPlotArcEvents && (
                <Button
                  variant="ghost-bright"
                  size="sm"
                  onClick={onShowPlotArcEvents}
                  className={cn(
                    "border border-transparent transition-all duration-200",
                    showPlotArcEventsSidebar
                      ? "bg-primary/10 border-primary text-primary"
                      : "hover:bg-primary/5 hover:border-primary/30 hover:text-primary"
                  )}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t("header_bar.arc")}
                </Button>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShowSettings}
                    className="h-9 w-9 p-0"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("tooltips:editor.settings")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
