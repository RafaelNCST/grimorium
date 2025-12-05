import { useState, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { getRegionById } from "@/lib/db/regions.service";
import type { IRegion } from "@/pages/dashboard/tabs/world/types/region-types";
import { Route } from "@/routes/dashboard/$dashboardId/super-views/region/$regionId";

import { RegionSuperView } from "./view";

export function RegionSuperViewPage() {
  const params = useParams({
    from: "/dashboard/$dashboardId/super-views/region/$regionId",
  });
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { dashboardId, regionId } = params;
  const fromChapterId = search.from;

  const [region, setRegion] = useState<IRegion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load region data
  useEffect(() => {
    const loadRegion = async () => {
      setIsLoading(true);
      try {
        const data = await getRegionById(regionId);
        if (data) {
          setRegion(data);
        }
      } catch (error) {
        console.error("Error loading region:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegion();
  }, [dashboardId, regionId]);

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

  if (!region) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Região não encontrada</p>
      </div>
    );
  }

  return (
    <RegionSuperView
      region={region}
      displayData={region}
      bookId={dashboardId}
      onBack={handleBack}
    />
  );
}
