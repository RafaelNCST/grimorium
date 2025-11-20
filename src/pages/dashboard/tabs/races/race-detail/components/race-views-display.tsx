import { Eye, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

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
          <div className="space-y-2">
            {views.map((view) => (
              <div
                key={view.id}
                className="p-3 rounded-lg border bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Eye className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <span className="text-sm font-medium block">{view.raceName}</span>
                    {view.description && (
                      <p className="text-sm text-muted-foreground">
                        {view.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
