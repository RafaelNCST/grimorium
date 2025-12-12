import { Map as MapIcon, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { EntityCardWrapper } from "@/components/ui/entity-card-wrapper";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";

import { REGION_SCALES_CONSTANT } from "../constants/scale-colors";
import { IRegion } from "../types/region-types";

interface RegionCardProps {
  region: IRegion;
  onClick?: (regionId: string) => void;
  parentRegion?: IRegion;
}

export function RegionCard({ region, onClick, parentRegion }: RegionCardProps) {
  const { t } = useTranslation("world");

  // Find scale data
  const scaleData = REGION_SCALES_CONSTANT.find(
    (s) => s.value === region.scale
  );

  return (
    <EntityCardWrapper
      onClick={() => onClick?.(region.id)}
      overlayText={t("region_card.view_details")}
      contentClassName="p-0"
    >
      {/* Image covering the top with full width */}
      {region.image ? (
        <div className="w-full h-[28rem] overflow-hidden rounded-t-lg">
          <img
            src={region.image}
            alt={region.name || "Region"}
            className="w-full h-full object-fill"
          />
        </div>
      ) : (
        <FormImageDisplay
          icon={MapIcon}
          height="h-[28rem]"
          width="w-full"
          shape="rounded"
          className="rounded-t-lg rounded-b-none"
        />
      )}

      <div className="p-4 space-y-3">
        {/* Region Name with Scale Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-lg leading-tight">{region.name}</h3>
          {scaleData && (
            <EntityTagBadge
              config={scaleData}
              label={t(`scales.${region.scale}`)}
              className="pointer-events-none"
            />
          )}
        </div>

        {/* Parent Region or Neutral Badge */}
        {parentRegion ? (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-medium">{parentRegion.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-medium">
              {t("region_card.neutral_region")}
            </span>
          </div>
        )}

        {/* Summary with maximum of 3 lines */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {region.summary || t("region_card.no_summary")}
        </p>
      </div>
    </EntityCardWrapper>
  );
}
