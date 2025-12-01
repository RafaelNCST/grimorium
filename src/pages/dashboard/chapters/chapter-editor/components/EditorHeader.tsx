import { useState, useRef, useEffect } from "react";

import { ArrowLeft, Save, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormChapterNameWithNumber } from "@/components/forms/FormChapterNameWithNumber";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  chapterNumber: string;
  title: string;
  isSaving: boolean;
  showAllAnnotationsSidebar?: boolean;
  onBack: () => void;
  onSave: () => void;
  onChapterNumberChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onShowAllAnnotations: () => void;
}

export function EditorHeader({
  chapterNumber,
  title,
  isSaving,
  showAllAnnotationsSidebar = false,
  onBack,
  onSave,
  onChapterNumberChange,
  onTitleChange,
  onShowAllAnnotations,
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

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="px-6 py-2">
        {/* Top Row - Title and Actions - Fixed height */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 min-h-[44px]">
          {/* Left: Back button */}
          <div className="shrink-0">
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

          {/* Center: Title - Fixed height container */}
          <div
            ref={titleContainerRef}
            className="flex justify-center items-center min-h-[44px]"
            onDoubleClick={handleTitleDoubleClick}
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
                  Capítulo {chapterNumber}: {title || t("chapter.title_placeholder")}
                </h1>
              </div>
            )}
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
              onClick={onSave}
              disabled={isSaving}
              size="sm"
              variant="magical"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
