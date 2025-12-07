import { useState, useEffect } from "react";

import { Edit2, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {isEditing ? (
        <Textarea
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          className="min-h-[80px] text-xs"
          placeholder={placeholder}
        />
      ) : (
        <p className="text-xs text-foreground leading-relaxed select-text">
          {summary || (
            <span className="text-muted-foreground italic">{emptyMessage}</span>
          )}
        </p>
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

        {/* Save/Cancel buttons when editing */}
        {isEditingSummaries && !isCustomizing && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="accent"
              size="sm"
              className="h-7 text-xs"
              onClick={onSaveSummaries}
            >
              {t("author_summary.save")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onEditingSummariesChange(false)}
            >
              {t("author_summary.cancel")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
