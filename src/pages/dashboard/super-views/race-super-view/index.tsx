import { useState, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { getRaceById } from "@/lib/db/races.service";
import type { IRaceVersion } from "@/pages/dashboard/tabs/races/race-detail/types/race-detail-types";
import type { IRace } from "@/pages/dashboard/tabs/races/types/race-types";
import { Route } from "@/routes/dashboard/$dashboardId/super-views/race/$raceId";

import { RaceSuperView } from "./view";

export function RaceSuperViewPage() {
  const params = useParams({
    from: "/dashboard/$dashboardId/super-views/race/$raceId",
  });
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { dashboardId, raceId } = params;
  const fromChapterId = search.from;

  const [race, setRace] = useState<IRace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load race data
  useEffect(() => {
    const loadRace = async () => {
      setIsLoading(true);
      try {
        const data = await getRaceById(raceId);
        if (data) {
          setRace(data);
        }
      } catch (error) {
        console.error("Error loading race:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRace();
  }, [dashboardId, raceId]);

  const handleBack = () => {
    // Navigate back to specific chapter
    if (fromChapterId) {
      navigate({
        to: "/dashboard/$dashboardId/chapters/$editor-chapters-id",
        params: { dashboardId, "editor-chapters-id": fromChapterId },
      });
    } else {
      navigate({
        to: "/dashboard/$dashboardId/chapters",
        params: { dashboardId },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!race) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Raça não encontrada</p>
      </div>
    );
  }

  return (
    <RaceSuperView
      race={race}
      displayData={race}
      bookId={dashboardId}
      onBack={handleBack}
    />
  );
}
