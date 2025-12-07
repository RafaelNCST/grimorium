import { useState, useEffect, useRef } from "react";

import { Edit2, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DisplayTextarea } from "@/components/displays";
import { FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MAX_SUMMARY_LENGTH = 2000;

interface SummariesCardProps {
  authorSummary: string;
  storySummary: string;
  isEditingSummaries: boolean;
  isCustomizing?: boolean;
  onAuthorSummaryChange: (summary: string) => void;
  onStorySummaryChange: (summary: string) => void;
  onEditingSummariesChange: (editing: boolean) => void;
  onSaveSummaries: () => void;
}

interface SummaryItemProps {
  title: string;
  description: string;
  summary: string;
  isEditing: boolean;
  placeholder: string;
  emptyMessage: string;
  onSummaryChange: (summary: string) => void;
}

function SummaryItem({
  title,
  description,
  summary,
  isEditing,
  placeholder,
  emptyMessage,
  onSummaryChange,
}: SummaryItemProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content and window width
  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current && isEditing) {
        const textarea = textareaRef.current;
        // Reset height to recalculate
        textarea.style.height = "120px";
        // Set new height based on content, with a minimum
        const newHeight = Math.max(120, textarea.scrollHeight);
        textarea.style.height = `${newHeight}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [summary, isEditing]);

  return (
    <div className="space-y-2">
      {isEditing ? (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            {title}
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={summary}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_SUMMARY_LENGTH) {
                  onSummaryChange(newValue);
                }
              }}
              placeholder={placeholder}
              maxLength={MAX_SUMMARY_LENGTH}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden"
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-muted-foreground">
                {summary.length}/{MAX_SUMMARY_LENGTH}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <DisplayTextarea value={summary || null} className="text-xs" />
        </>
      )}
    </div>
  );
}

export function SummariesCard({
  authorSummary,
  storySummary,
  isEditingSummaries,
  isCustomizing = false,
  onAuthorSummaryChange,
  onStorySummaryChange,
  onEditingSummariesChange,
  onSaveSummaries,
}: SummariesCardProps) {
  const { t } = useTranslation("overview");
  const { t: tCommon } = useTranslation("common");
  const { t: tTooltips } = useTranslation("tooltips");

  // Load visibility state from localStorage or use defaults
  const [authorSummaryVisible, setAuthorSummaryVisible] = useState(() => {
    const saved = localStorage.getItem("summaries-author-visible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [storySummaryVisible, setStorySummaryVisible] = useState(() => {
    const saved = localStorage.getItem("summaries-story-visible");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist visibility state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "summaries-author-visible",
      JSON.stringify(authorSummaryVisible)
    );
  }, [authorSummaryVisible]);

  useEffect(() => {
    localStorage.setItem(
      "summaries-story-visible",
      JSON.stringify(storySummaryVisible)
    );
  }, [storySummaryVisible]);

  // Calculate if both are hidden for view mode
  const bothHidden = !authorSummaryVisible && !storySummaryVisible;

  // In view mode, if both are hidden, don't render anything
  if (!isCustomizing && bothHidden) {
    return null;
  }

  // Determine grid layout based on visibility
  const showingBoth = authorSummaryVisible && storySummaryVisible;
  const gridClass = isCustomizing
    ? "grid grid-cols-2 gap-6" // Always side by side in customize mode
    : showingBoth
      ? "grid grid-cols-2 gap-6" // Side by side when both visible
      : "grid grid-cols-1"; // Full width when only one visible

  return (
    <Card className="card-magical w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t("summaries.title")}</CardTitle>
        {!isCustomizing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditingSummariesChange(!isEditingSummaries)}
            className="h-7 w-7"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={gridClass}>
          {/* Author Summary Section */}
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
                    const newValue = !authorSummaryVisible;
                    setAuthorSummaryVisible(newValue);
                  }}
                  title={
                    authorSummaryVisible
                      ? tTooltips("visibility.hide_in_view_mode")
                      : tTooltips("visibility.show_in_view_mode")
                  }
                >
                  {authorSummaryVisible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            {(authorSummaryVisible || isCustomizing) && (
              <div
                className={`${
                  isCustomizing && !authorSummaryVisible
                    ? "opacity-50 border-2 border-dashed border-muted-foreground/30 rounded-lg p-4"
                    : ""
                }`}
              >
                <SummaryItem
                  title={t("author_summary.title")}
                  description={t("author_summary.description")}
                  summary={authorSummary}
                  isEditing={isEditingSummaries && !isCustomizing}
                  placeholder={t("author_summary.placeholder")}
                  emptyMessage={t("author_summary.empty_message")}
                  onSummaryChange={onAuthorSummaryChange}
                />
              </div>
            )}
          </div>

          {/* Story Summary Section */}
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
                    const newValue = !storySummaryVisible;
                    setStorySummaryVisible(newValue);
                  }}
                  title={
                    storySummaryVisible
                      ? tTooltips("visibility.hide_in_view_mode")
                      : tTooltips("visibility.show_in_view_mode")
                  }
                >
                  {storySummaryVisible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
            {(storySummaryVisible || isCustomizing) && (
              <div
                className={`${
                  isCustomizing && !storySummaryVisible
                    ? "opacity-50 border-2 border-dashed border-muted-foreground/30 rounded-lg p-4"
                    : ""
                }`}
              >
                <SummaryItem
                  title={t("story_summary.title")}
                  description={t("story_summary.description")}
                  summary={storySummary}
                  isEditing={isEditingSummaries && !isCustomizing}
                  placeholder={t("story_summary.placeholder")}
                  emptyMessage={t("story_summary.empty_message")}
                  onSummaryChange={onStorySummaryChange}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
