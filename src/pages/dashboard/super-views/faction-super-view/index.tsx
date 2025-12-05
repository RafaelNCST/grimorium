import { useState, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { getFactionById } from "@/lib/db/factions.service";
import { Route } from "@/routes/dashboard/$dashboardId/super-views/faction/$factionId";
import type { IFaction } from "@/types/faction-types";

import { FactionSuperView } from "./view";

export function FactionSuperViewPage() {
  const params = useParams({
    from: "/dashboard/$dashboardId/super-views/faction/$factionId",
  });
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { dashboardId, factionId } = params;
  const fromChapterId = search.from;

  const [faction, setFaction] = useState<IFaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load faction data
  useEffect(() => {
    const loadFaction = async () => {
      setIsLoading(true);
      try {
        const data = await getFactionById(factionId);
        if (data) {
          setFaction(data);
        }
      } catch (error) {
        console.error("Error loading faction:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFaction();
  }, [dashboardId, factionId]);

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

  if (!faction) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Facção não encontrada</p>
      </div>
    );
  }

  return (
    <FactionSuperView
      faction={faction}
      displayData={faction}
      bookId={dashboardId}
      onBack={handleBack}
    />
  );
}
