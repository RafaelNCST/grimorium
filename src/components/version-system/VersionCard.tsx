import * as React from "react";

import { Calendar, MoreVertical, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatRelativeTime } from "@/lib/utils";

export interface VersionCardVersion {
  id: string;
  name: string;
  description?: string;
  isMain: boolean;
  createdAt: string | number;
}

export interface VersionCardProps {
  version: VersionCardVersion;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
  className?: string;
}

/**
 * VersionCard - Card component for displaying a version
 */
export const VersionCard = React.memo(
  ({
    version,
    isActive,
    onSelect,
    onEdit,
    onDelete,
    onActivate,
    className,
  }: VersionCardProps) => {
    const { t } = useTranslation("common");
    const createdAtTimestamp =
      typeof version.createdAt === "string"
        ? new Date(version.createdAt).getTime()
        : version.createdAt;

    return (
      <Card
        className={cn(
          "cursor-pointer transition-colors duration-200 hover:bg-white/5 dark:hover:bg-white/10",
          isActive && "ring-2 ring-primary",
          className
        )}
        onClick={onSelect}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2 text-base">
                {version.name}
                {version.isMain && (
                  <Badge variant="default" className="ml-auto">
                    <Star className="h-3 w-3" />
                    {t("version.main_badge")}
                  </Badge>
                )}
              </CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    {t("actions.edit")}
                  </DropdownMenuItem>
                )}
                {onActivate && !version.isMain && (
                  <DropdownMenuItem onClick={onActivate}>
                    {t("actions.make_main")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onDelete && !version.isMain && (
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive"
                  >
                    {t("actions.delete")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {version.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {version.description}
            </p>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatRelativeTime(createdAtTimestamp)}
          </div>
        </CardContent>
      </Card>
    );
  }
);
VersionCard.displayName = "VersionCard";
