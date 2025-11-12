import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IRegion } from "../types/region-types";
import { SCALE_COLORS } from "../constants/scale-colors";
import { Map, MapPin } from "lucide-react";

interface RegionCardProps {
  region: IRegion;
  onClick?: (regionId: string) => void;
  parentRegion?: IRegion;
}

export function RegionCard({ region, onClick, parentRegion }: RegionCardProps) {
  const { t } = useTranslation("world");

  return (
    <Card
      data-region-id={region.id}
      className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_8px_32px_hsl(240_10%_3.9%_/_0.3),0_0_20px_hsl(263_70%_50%_/_0.3)] hover:bg-card/80"
      onClick={() => onClick?.(region.id)}
    >
      <CardContent className="p-0">
        {/* Image covering the top with full width */}
        {region.image ? (
          <div className="relative w-full h-[28rem]">
            <img
              src={region.image}
              alt={region.name || "Region"}
              className="w-full h-full object-fill rounded-t-lg"
            />
          </div>
        ) : (
          <div className="relative w-full h-[28rem] bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
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
                <span className="text-xs font-medium">
                  {parentRegion.name}
                </span>
              </Badge>
            )}
          </div>

          {/* Summary with maximum of 3 lines */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {region.summary || t("region_card.no_summary")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
