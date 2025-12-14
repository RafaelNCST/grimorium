import { useState } from "react";

import { ArrowRight, Link } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  type IPowerBlock,
  type NavigatorContent,
  type IPowerPage,
} from "../../types/power-system-types";
import { SelectPageModal } from "../select-page-modal";

import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface NavigatorBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: NavigatorContent) => void;
  onDelete: () => void;
  pages?: IPowerPage[]; // Available pages for selection
  onPageSelect?: (pageId: string) => void; // Callback to navigate to page
  currentPageId?: string; // Current page ID to prevent navigation to same page
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function NavigatorBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
  pages = [],
  onPageSelect,
  currentPageId,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: NavigatorBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as NavigatorContent;
  const [isSelectPageModalOpen, setIsSelectPageModalOpen] = useState(false);

  // Find the linked page
  const linkedPage = content.linkedPageId
    ? pages.find((p) => p.id === content.linkedPageId)
    : null;

  const handleNavigate = () => {
    if (!isEditMode && content.linkedPageId && linkedPage && onPageSelect) {
      // Navigate to the linked page
      onPageSelect(content.linkedPageId);

      // Scroll to top after a small delay to ensure the page has rendered
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const handleSelectPage = (pageId: string) => {
    onUpdate({ ...content, linkedPageId: pageId });
    setIsSelectPageModalOpen(false);
  };

  if (isEditMode) {
    return (
      <>
        <div className="space-y-3 p-4 rounded-lg border bg-card cursor-default">
          {/* First Line: Delete and Link buttons */}
          <div className="flex items-center gap-2">
            <Button
              data-no-drag="true"
              variant="secondary"
              size="sm"
              onClick={() => setIsSelectPageModalOpen(true)}
              className="cursor-pointer"
            >
              <Link className="w-4 h-4 mr-2" />
              {linkedPage
                ? t("blocks.navigator.change_page")
                : t("blocks.navigator.select_page")}
            </Button>

            {linkedPage ? (
              <span className="text-sm text-muted-foreground">
                {linkedPage.name}
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                {t("blocks.navigator.no_link")}
              </span>
            )}

            <div className="ml-auto">
              <BlockReorderButtons
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onDelete={onDelete}
                isFirst={isFirst}
                isLast={isLast}
              />
            </div>
          </div>

          {/* Second Line: Optional Title */}
          <Input
            data-no-drag="true"
            placeholder={t("blocks.navigator.title_placeholder")}
            value={content.title || ""}
            onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          />

          {/* Third Line: Fixed Text */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-default">
            <span>{t("blocks.navigator.click_to_navigate")}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Select Page Modal */}
        <SelectPageModal
          isOpen={isSelectPageModalOpen}
          onClose={() => setIsSelectPageModalOpen(false)}
          onSelect={handleSelectPage}
          pages={pages}
          currentPageId={currentPageId}
        />
      </>
    );
  }

  // View mode
  if (!content.linkedPageId || !linkedPage) {
    return null; // Don't show if no page is linked
  }

  return (
    <div
      onClick={handleNavigate}
      className="p-4 rounded-lg border bg-card hover:bg-white/5 transition-colors cursor-pointer"
    >
      <div className="space-y-2">
        {/* Optional Title */}
        {content.title && (
          <h3 className="text-base font-semibold">{content.title}</h3>
        )}

        {/* Click to Navigate */}
        <div className="flex items-center gap-2 text-sm text-primary">
          <span>{t("blocks.navigator.click_to_navigate")}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
