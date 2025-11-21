import { Eye, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RaceViewsManager } from "@/components/modals/create-race-modal/components/race-views-manager";
import type { RaceView } from "@/components/modals/create-race-modal/components/race-views-manager";

interface IRace {
  id: string;
  name: string;
  image?: string;
}

interface RaceViewsDisplayProps {
  views: RaceView[];
  isEditing: boolean;
  allRaces: IRace[];
  onViewsChange: (views: RaceView[]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  bookId?: string;
  currentRaceId?: string;
}

export function RaceViewsDisplay({
  views,
  isEditing,
  allRaces,
  onViewsChange,
  open,
  onOpenChange,
  bookId,
  currentRaceId,
}: RaceViewsDisplayProps) {
  const { t } = useTranslation("race-detail");

  const availableRaces = allRaces.map((race) => ({
    id: race.id,
    name: race.name,
    image: race.image,
  }));

  if (isEditing) {
    return (
      <RaceViewsManager
        views={views}
        onChange={onViewsChange}
        availableRaces={availableRaces}
        hideLabel
        bookId={bookId || ""}
        currentRaceId={currentRaceId}
      />
    );
  }

  const hasViews = views && views.length > 0;
  const viewCount = views?.length || 0;

  // Helper to get race image from allRaces
  const getRaceImage = (raceId: string): string | undefined => {
    return allRaces.find((r) => r.id === raceId)?.image;
  };

  // Helper to get initials for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={false}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
        <p className="text-sm font-semibold text-primary">
          {t("fields.race_views")}
          {hasViews && (
            <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
              ({viewCount})
            </span>
          )}
        </p>
        {open !== undefined ? (
          open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {hasViews ? (
          <div className="space-y-3">
            {views.map((view) => {
              const raceImage = view.raceImage || getRaceImage(view.raceId);

              return (
                <div
                  key={view.id}
                  className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar da raça */}
                    <Avatar className="w-10 h-10 rounded-md flex-shrink-0">
                      {raceImage && (
                        <AvatarImage src={raceImage} alt={view.raceName} />
                      )}
                      <AvatarFallback className="text-xs rounded-md bg-primary/10">
                        {getInitials(view.raceName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Conteúdo da visão */}
                    <div className="flex-1 space-y-2 min-w-0">
                      {/* Nome da raça */}
                      <span className="text-sm font-semibold text-foreground block">
                        {view.raceName}
                      </span>

                      {/* Descrição da visão */}
                      {view.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {view.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <span className="italic text-muted-foreground/60">
            Sem dados
          </span>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
