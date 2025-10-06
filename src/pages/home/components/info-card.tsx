import { useState } from "react";

import {
  Book,
  BookOpen,
  Edit,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface InfoCardProps {
  totalBooks: number;
  lastEditedBook: string;
  lastChapter?: {
    title: string;
    bookTitle: string;
  };
}

export function InfoCard({
  totalBooks,
  lastEditedBook,
  lastChapter,
}: InfoCardProps) {
  const { t } = useTranslation("home");
  const [isExpanded, setIsExpanded] = useState(true);

  // These values should come from actual data stores
  const totalCharacters = 0;
  const totalWords = 0;

  return (
    <div className="px-6 mb-8">
      <div className="bg-card rounded-xl border border-border p-6">
        {/* Header with Title */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Book className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              {t("cards.info.title")}
            </h2>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 rounded-lg hover:bg-accent/50 flex items-center justify-center transition-colors duration-200 group"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
          </button>
        </div>

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Metrics Section - Horizontal Layout */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
              <FileText className="h-4 w-4" />
              <span>{t("cards.info.metrics_section")}</span>
            </div>

            <div className="flex w-full justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("cards.info.total_books")}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {totalBooks}
                </span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("cards.info.total_characters")}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {totalCharacters}
                </span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">
                  {t("cards.info.total_words")}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {totalWords}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information Section - Horizontal Layout */}
          <div className="flex flex-wrap justify-between items-start gap-6 pt-6 border-t border-border">
            {/* Last Edited Book Section */}
            <div className="min-w-[200px] space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <Edit className="h-4 w-4" />
                <span>{t("cards.info.last_edited_section")}</span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-1">
                  {t("cards.info.last_edited_label")}
                </span>
                <span className="text-lg font-semibold text-foreground">
                  {lastEditedBook || t("cards.info.no_book")}
                </span>
              </div>
            </div>

            {/* Last Released Chapter Section */}
            <div className="min-w-[200px] space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <BookOpen className="h-4 w-4" />
                <span>{t("cards.info.last_chapter_section")}</span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-1">
                  {t("cards.info.last_chapter_label")}
                </span>
                <span className="text-lg font-semibold text-foreground block">
                  {lastChapter?.title || t("cards.info.no_chapter")}
                </span>
                {lastChapter?.bookTitle && (
                  <span className="text-sm text-muted-foreground block mt-1">
                    {t("cards.info.from_book")}: {lastChapter.bookTitle}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
