import { useState } from "react";

import { useDraggable } from "@dnd-kit/core";
import { Dna } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { getDomainDisplayData } from "../helpers/domain-filter-config";
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
  const [isHovered, setIsHovered] = useState(false);

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
      className={`relative max-w-[470px] cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80 ${
        isDragging ? "opacity-0" : ""
      }`}
      onClick={() => !isDragging && onClick?.(race.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image covering the top with full width */}
        {race?.image ? (
          <div className="relative w-full h-80">
            <img
              src={race.image}
              alt={race?.name || "Race"}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        ) : (
          <div className="relative w-full h-80 rounded-t-lg overflow-hidden">
            <FormImageDisplay
              icon={Dna}
              height="h-full"
              width="w-full"
              shape="square"
              className="rounded-t-lg"
            />
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
              const { icon: DomainIcon, colorConfig } =
                getDomainDisplayData(domainValue);

              if (!DomainIcon || !colorConfig) return null;

              return (
                <Badge
                  key={domainValue}
                  className={`flex items-center gap-1 ${colorConfig.inactiveClasses} px-2 py-0.5 pointer-events-none`}
                >
                  <DomainIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{domainValue}</span>
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

      {/* Overlay covering entire card */}
      <div
        className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
          isHovered && !isDragging ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-lg font-semibold">Ver detalhes</span>
      </div>
    </Card>
  );
}
