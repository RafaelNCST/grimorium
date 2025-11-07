import { ChevronRight, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { IPowerCharacterLink } from "../types/power-system-types";

interface PowerLinkCardProps {
  link: IPowerCharacterLink;
  pageTitle?: string;
  sectionTitle?: string;
  isEditing?: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PowerLinkCard({
  link,
  pageTitle,
  sectionTitle,
  isEditing = false,
  onClick,
  onEdit,
  onDelete,
}: PowerLinkCardProps) {
  const { t } = useTranslation("power-system");

  const displayLabel = link.customLabel || pageTitle || sectionTitle || t("links.untitled_link");

  return (
    <div
      className={cn(
        "relative group bg-neutral-800 rounded-lg p-6 transition-all duration-200",
        !isEditing && "hover:bg-neutral-700 cursor-pointer"
      )}
      onClick={!isEditing ? onClick : undefined}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-lg truncate">
            {displayLabel}
          </h3>
          {link.customLabel && (pageTitle || sectionTitle) && (
            <p className="text-neutral-400 text-sm mt-1 truncate">
              {pageTitle || sectionTitle}
            </p>
          )}
        </div>

        {isEditing && onEdit && onDelete ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="h-8 w-8 text-white hover:bg-neutral-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{t("links.edit_link")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="h-8 w-8 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{t("links.delete_link")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <ChevronRight className="h-6 w-6 text-white flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
