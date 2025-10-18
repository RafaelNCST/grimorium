import { Calendar, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IItemVersion } from "@/lib/db/items.service";

interface VersionCardProps {
  version: IItemVersion;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: (versionId: string) => void;
  onUpdate?: (versionId: string, name: string, description?: string) => void;
}

export function VersionCard({
  version,
  isSelected,
  onClick,
  onDelete: _onDelete,
  onUpdate: _onUpdate,
}: VersionCardProps) {
  const { t } = useTranslation("item-detail");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-muted hover:border-primary/50"
      } ${version.isMain ? "ring-2 ring-primary/30" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-2">
        {/* Header with Main Badge */}
        {version.isMain && (
          <div className="flex items-center gap-1 mb-1">
            <Badge
              variant="default"
              className="text-xs bg-primary text-primary-foreground"
            >
              <Crown className="w-3 h-3 mr-1" />
              {t("versions.main_badge")}
            </Badge>
          </div>
        )}

        {/* Item Image and Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 border-2 border-border">
            <AvatarImage
              src={version.image}
              alt={version.name}
              className="object-cover"
            />
            <AvatarFallback className="text-sm font-semibold">
              {version.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{version.name}</h4>
            {version.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {version.description}
              </p>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(version.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
