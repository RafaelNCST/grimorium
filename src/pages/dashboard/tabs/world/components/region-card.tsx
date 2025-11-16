import { useState } from "react";

import { Map, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { SCALE_COLORS } from "../constants/scale-colors";
import { IRegion } from "../types/region-types";

interface RegionCardProps {
  region: IRegion;
  onClick?: (regionId: string) => void;
  parentRegion?: IRegion;
}

export function RegionCard({ region, onClick, parentRegion }: RegionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation("world");

  return (
    <Card
      data-region-id={region.id}
      className="relative cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
      onClick={() => onClick?.(region.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image covering the top with full width */}
        {region.image ? (
          <div className="w-full h-[28rem]">
            <img
              src={region.image}
              alt={region.name || "Region"}
              className="w-full h-full object-fill rounded-t-lg"
            />
          </div>
        ) : (
          <div className="w-full h-[28rem] bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
            <Map className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Region Name */}
          <div>
            <h3 className="font-semibold text-lg leading-tight">
              {region.name}
            </h3>
          </div>

          {/* Scale and Parent Region Badges */}
          <div className="flex flex-wrap gap-1.5">
            {/* Scale Badge */}
            <Badge
              className={`flex items-center gap-1 ${SCALE_COLORS[region.scale]} bg-transparent border px-2 py-0.5 pointer-events-none`}
            >
              <span className="text-xs font-medium">
                {t(`scales.${region.scale}`)}
              </span>
            </Badge>

            {/* Parent Region Badge */}
            {parentRegion && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-2 py-0.5 pointer-events-none"
              >
                <MapPin className="w-3 h-3" />
                <span className="text-xs font-medium">{parentRegion.name}</span>
              </Badge>
            )}
          </div>

          {/* Summary with maximum of 3 lines */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {region.summary || t("region_card.no_summary")}
          </p>
        </div>
      </CardContent>

      {/* Overlay covering entire card */}
      <div
        className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-lg font-semibold">
          {t("region_card.view_details")}
        </span>
      </div>
    </Card>
  );
}
