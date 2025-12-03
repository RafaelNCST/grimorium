import { useState, useRef, useEffect } from "react";

import {
  ArrowLeft,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Settings,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormChapterNameWithNumber } from "@/components/forms/FormChapterNameWithNumber";
import { Button } from "@/components/ui/button";
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
  showWarningsSidebar?: boolean;
  warningsCount?: number;
  previousChapter?: { id: string; number: string; title: string };
  nextChapter?: { id: string; number: string; title: string };
  onBack: () => void;
  onChapterNumberChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onShowAllAnnotations: () => void;
  onShowWarnings: () => void;
  onShowSettings: () => void;
  onNavigateToPrevious?: () => void;
  onNavigateToNext?: () => void;
}

export function EditorHeader({
  chapterNumber,
  title,
  showAllAnnotationsSidebar = false,
  showWarningsSidebar = false,
  warningsCount = 0,
  previousChapter,
  nextChapter,
  onBack,
  onChapterNumberChange,
  onTitleChange,
  onShowAllAnnotations,
  onShowWarnings,
  onShowSettings,
  onNavigateToPrevious,
  onNavigateToNext,
}: EditorHeaderProps) {
  const { t } = useTranslation("chapter-editor");
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
                Voltar
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
                      Capítulo {previousChapter.number}: {previousChapter.title}
                    </p>
                  ) : (
                    <p>Nenhum capítulo anterior</p>
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
                      Capítulo {chapterNumber}:{" "}
                      {title || t("chapter.title_placeholder")}
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
                      Capítulo {nextChapter.number}: {nextChapter.title}
                    </p>
                  ) : (
                    <p>Nenhum capítulo seguinte</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 justify-end">
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
                Anotações
              </Button>

              <Button
                variant="ghost-bright"
                size="sm"
                onClick={onShowWarnings}
                className={cn(
                  "border border-transparent transition-all duration-200 relative",
                  showWarningsSidebar
                    ? "bg-primary/10 border-primary text-primary"
                    : "hover:bg-primary/5 hover:border-primary/30 hover:text-primary"
                )}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Avisos
                {warningsCount > 0 && (
                  <span className="ml-1.5 flex items-center justify-center min-w-[18px] min-h-[18px] px-1.5 text-[10px] font-semibold bg-primary text-white rounded-full">
                    {warningsCount > 99 ? "99+" : warningsCount}
                  </span>
                )}
              </Button>

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
                  <p>Configurações do Editor</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
