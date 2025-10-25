import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

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
}

export function RaceViewsDisplay({
  views,
  isEditing,
  allRaces,
  onViewsChange,
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
      />
    );
  }

  if (views.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
        <p>{t("empty_states.no_race_views")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {views.map((view) => (
        <div
          key={view.id}
          className="p-4 rounded-lg border bg-muted/30 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{view.raceName}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {view.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
