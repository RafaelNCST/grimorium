import { Plus, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ISpecies } from "../types/race-types";

import { RaceCard } from "./race-card";

interface PropsSpeciesCard {
  species: ISpecies;
  onSpeciesClick: (speciesId: string) => void;
  onRaceClick: (raceId: string) => void;
  onOpenCreateRaceModal: (speciesId: string) => void;
}

export function SpeciesCard({
  species,
  onSpeciesClick,
  onRaceClick,
  onOpenCreateRaceModal,
}: PropsSpeciesCard) {
  const { t } = useTranslation(["empty-states"]);

  return (
    <AccordionItem
      key={species.id}
      value={species.id}
      className="border rounded-lg"
    >
      <Card className="border-0">
        <AccordionTrigger className="hover:no-underline">
          <CardHeader className="flex-row items-center space-y-0 pb-4 w-full">
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeciesClick(species.id);
                  }}
                >
                  {species.knownName}
                </CardTitle>
                <ChevronRight className="h-4 w-4" />
              </div>
              <CardDescription className="line-clamp-1">
                {species.description}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {species.races.length}{" "}
                  {species.races.length === 1 ? "raça" : "raças"}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </AccordionTrigger>
        <AccordionContent>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Raças</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenCreateRaceModal(species.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Raça
              </Button>
            </div>

            {species.races.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                {t("empty-states:entities.no_race_registered")}
              </p>
            ) : (
              <div className="grid gap-3">
                {species.races.map((race) => (
                  <RaceCard key={race.id} race={race} onClick={onRaceClick} />
                ))}
              </div>
            )}
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
