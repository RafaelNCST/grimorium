import {
  ArrowLeft,
  Trash2,
  FileText,
  Image,
  NotebookPen,
  Palette,
  EyeOff,
  Eye,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguageStore } from "@/stores/language-store";

interface PropsTopBar {
  isCustomizing: boolean;
  isHeaderHidden: boolean;
  onBack: () => void;
  onShowDeleteDialog: (show: boolean) => void;
  onNavigateToChapters: () => void;
  onNavigateToGallery: () => void;
  onNavigateToNotes: () => void;
  onCustomizingToggle: () => void;
  onHeaderHiddenChange: (hidden: boolean) => void;
}

export function TopBar({
  isCustomizing,
  isHeaderHidden,
  onBack,
  onShowDeleteDialog,
  onNavigateToChapters,
  onNavigateToGallery,
  onNavigateToNotes,
  onCustomizingToggle,
  onHeaderHiddenChange,
}: PropsTopBar) {
  const { t: tStore } = useLanguageStore();
  const { t } = useTranslation(["common"]);

  return (
    <div
      className={`flex items-center justify-between ${isHeaderHidden ? "mb-0" : "mb-4"}`}
    >
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {t("common:tooltips.back_to_library")}
            </p>
          </TooltipContent>
        </Tooltip>
        <h1 className="text-2xl font-bold">{tStore("book.dashboard")}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShowDeleteDialog(true)}
              className="text-destructive hover:bg-red-500/20 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {t("common:tooltips.delete_book")}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateToChapters}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <FileText className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {t("common:tooltips.chapters")}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateToGallery}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Image className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {t("common:tooltips.gallery")}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateToNotes}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <NotebookPen className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">{t("common:tooltips.notes")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCustomizingToggle}
              className={`hover:bg-accent hover:text-accent-foreground ${isCustomizing ? "bg-primary/10 text-primary" : ""}`}
            >
              <Palette className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {isCustomizing
                ? t("common:tooltips.exit_customize_mode")
                : t("common:tooltips.customize")}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onHeaderHiddenChange(!isHeaderHidden)}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              {isHeaderHidden ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-medium">
              {isHeaderHidden
                ? t("common:tooltips.show_header")
                : t("common:tooltips.hide_header")}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
