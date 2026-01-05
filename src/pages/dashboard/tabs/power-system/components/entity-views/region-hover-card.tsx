import { useEffect, useState } from "react";

import { Map as MapIcon, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRegionById } from "@/lib/db/regions.service";
import { REGION_SCALES_CONSTANT } from "@/pages/dashboard/tabs/world/constants/scale-colors";
import type { IRegion } from "@/pages/dashboard/tabs/world/types/region-types";

interface RegionHoverCardProps {
  regionId: string;
  children: React.ReactNode;
}

export function RegionHoverCard({ regionId, children }: RegionHoverCardProps) {
  const { t } = useTranslation(["power-system", "world"]);
  const [region, setRegion] = useState<IRegion | null>(null);
  const [parentRegion, setParentRegion] = useState<IRegion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadRegion() {
      try {
        setIsLoading(true);
        setError(false);
        const data = await getRegionById(regionId);
        if (mounted) {
          setRegion(data);
          if (!data) {
            setError(true);
          } else if (data.parentId) {
            // Load parent region if it exists
            const parent = await getRegionById(data.parentId);
            if (mounted) {
              setParentRegion(parent);
            }
          }
        }
      } catch (err) {
        console.error("Error loading region:", err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadRegion();

    return () => {
      mounted = false;
    };
  }, [regionId]);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-[400px]" align="start">
        {isLoading ? (
          <div className="p-1 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error || !region ? (
          <div className="text-sm text-muted-foreground">
            {t("power-system:hover_card.region_not_found")}
          </div>
        ) : (
          <div className="p-1 space-y-4">
            {/* Top Section: Image + Name/Scale/Parent */}
            <div className="flex gap-4">
              {/* Region Image - Square with rounded corners */}
              {region.image ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={region.image}
                    alt={region.name || "Region"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <FormImageDisplay
                  icon={MapIcon}
                  height="h-20"
                  width="w-20"
                  shape="square"
                  className="rounded-lg"
                />
              )}

              {/* Name, Scale, and Parent */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Name with Scale Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg leading-tight">
                    {region.name}
                  </h3>
                  {region.scale &&
                    (() => {
                      const scaleData = REGION_SCALES_CONSTANT.find(
                        (s) => s.value === region.scale
                      );
                      return scaleData ? (
                        <EntityTagBadge
                          config={scaleData}
                          label={t(`world:scales.${region.scale}`)}
                        />
                      ) : null;
                    })()}
                </div>

                {/* Parent Region */}
                {parentRegion ? (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {parentRegion.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("world:region_card.neutral_region")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {region.summary || t("world:region_card.no_summary")}
            </p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
