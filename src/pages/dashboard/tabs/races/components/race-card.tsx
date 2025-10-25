import { useDraggable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";

import { DOMAIN_CONSTANT } from "@/components/modals/create-race-modal/constants/domains";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { IRace } from "../types/race-types";

interface PropsRaceCard {
  race: IRace;
  onClick?: (raceId: string) => void;
  isDragDisabled?: boolean;
}

export function RaceCard({
  race,
  onClick,
  isDragDisabled = false,
}: PropsRaceCard) {
  const { t } = useTranslation("create-race");

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `race-${race.id}`,
    disabled: isDragDisabled,
    data: {
      type: "race",
      race,
    },
  });

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-race-id={race.id}
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_8px_32px_hsl(240_10%_3.9%_/_0.3),0_0_20px_hsl(263_70%_50%_/_0.3)] hover:bg-card/80 ${
        isDragging ? "opacity-0" : ""
      }`}
      onClick={() => !isDragging && onClick?.(race.id)}
    >
      <CardContent className="p-0">
        {/* Image covering the top with full width */}
        {race?.image ? (
          <div className="relative w-full h-52">
            <img
              src={race.image}
              alt={race?.name || "Race"}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="relative w-full h-52 bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
            <span className="text-5xl text-muted-foreground">
              {race.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Names Section */}
          <div>
            <h3 className="font-semibold text-lg leading-tight">{race.name}</h3>
            {race.scientificName && (
              <p className="text-sm italic text-muted-foreground mt-1">
                {race.scientificName}
              </p>
            )}
          </div>

          {/* Domains */}
          <div className="flex flex-wrap gap-1.5">
            {race.domain.map((domainValue) => {
              const domainData = DOMAIN_CONSTANT.find(
                (d) => d.value === domainValue
              );
              const DomainIcon = domainData?.icon;

              if (!domainData || !DomainIcon) return null;

              return (
                <Badge
                  key={domainValue}
                  className={`flex items-center gap-1 ${domainData.activeColor} bg-transparent border px-2 py-0.5 pointer-events-none`}
                >
                  <DomainIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    {domainData.label}
                  </span>
                </Badge>
              );
            })}
          </div>

          {/* Summary with maximum of 3 lines */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {race.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
