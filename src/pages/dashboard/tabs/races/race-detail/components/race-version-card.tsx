import { Calendar, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { type IRaceVersion } from "../types/race-detail-types";

interface RaceVersionCardProps {
  version: IRaceVersion;
  isSelected: boolean;
  onClick: () => void;
}

export function RaceVersionCard({
  version,
  isSelected,
  onClick,
}: RaceVersionCardProps) {
  const { t } = useTranslation("race-detail");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild className="w-full block">
        <Card
          className={`w-full cursor-pointer transition-all ${
            isSelected
              ? "border-primary bg-primary/10 shadow-md"
              : "border-muted hover:bg-muted/50"
          }`}
          onClick={onClick}
        >
          <CardContent className="p-3 space-y-2">
            {/* Header with Main Badge */}
            {version.isMain && (
              <div className="flex items-center gap-1 mb-1 pointer-events-none">
                <Badge
                  variant="default"
                  className="text-xs bg-primary text-primary-foreground"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  {t("versions.main_badge")}
                </Badge>
              </div>
            )}

            {/* Race Image */}
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-border">
                {version.raceData?.image && (
                  <AvatarImage
                    src={version.raceData.image}
                    alt={version.name}
                    className="object-cover"
                  />
                )}
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
                <h4 className="font-semibold text-sm truncate">
                  {version.name}
                </h4>
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
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="right" align="start">
        <div className="space-y-3">
          {/* Header with Badge */}
          <div className="flex items-start gap-3">
            <Avatar className="w-16 h-16 border-2 border-border">
              {version.raceData?.image && (
                <AvatarImage
                  src={version.raceData.image}
                  alt={version.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="text-base font-semibold">
                {version.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base mb-1">{version.name}</h4>
              {version.isMain && (
                <Badge
                  variant="default"
                  className="text-xs bg-primary text-primary-foreground"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  {t("versions.main_badge")}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {version.description && (
            <div>
              <p className="text-sm text-muted-foreground">
                {version.description}
              </p>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(version.createdAt)}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
