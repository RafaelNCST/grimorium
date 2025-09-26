import React from "react";

import { Plus, ChevronRight } from "lucide-react";

import { CreateRaceModal } from "@/components/modals/create-race-modal";
import { CreateSpeciesModal } from "@/components/modals/create-species-modal";
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

interface IRace {
  id: string;
  name: string;
  description: string;
  history: string;
  type: "Aquática" | "Terrestre" | "Voadora" | "Espacial" | "Espiritual";
  physicalCharacteristics?: string;
  culture?: string;
  speciesId: string;
}

interface ISpecies {
  id: string;
  knownName: string;
  scientificName?: string;
  description: string;
  races: IRace[];
}

interface SpeciesViewProps {
  species: ISpecies[];
  isCreateSpeciesOpen: boolean;
  isCreateRaceOpen: boolean;
  typeColors: Record<string, string>;
  raceTypeStats: Record<string, number>;
  onSetIsCreateSpeciesOpen: (open: boolean) => void;
  onSetIsCreateRaceOpen: (open: boolean) => void;
  onCreateSpecies: (data: {
    knownName: string;
    scientificName?: string;
    description: string;
  }) => void;
  onCreateRace: (data: {
    name: string;
    description: string;
    history: string;
    type: IRace["type"];
    physicalCharacteristics?: string;
    culture?: string;
  }) => void;
  onSpeciesClick: (speciesId: string) => void;
  onRaceClick: (raceId: string) => void;
  onOpenCreateRaceModal: (speciesId: string) => void;
}

export function SpeciesView({
  species,
  isCreateSpeciesOpen,
  isCreateRaceOpen,
  typeColors,
  raceTypeStats,
  onSetIsCreateSpeciesOpen,
  onSetIsCreateRaceOpen,
  onCreateSpecies,
  onCreateRace,
  onSpeciesClick,
  onRaceClick,
  onOpenCreateRaceModal,
}: SpeciesViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Espécies</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {species.length} Total
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
            >
              {raceTypeStats.Aquática} Aquática
            </Badge>
            <Badge
              variant="secondary"
              className="bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
            >
              {raceTypeStats.Terrestre} Terrestre
            </Badge>
            <Badge
              variant="secondary"
              className="bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400"
            >
              {raceTypeStats.Voadora} Voadora
            </Badge>
          </div>
        </div>
        <Button onClick={() => onSetIsCreateSpeciesOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Espécie
        </Button>
      </div>

      {species.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma espécie cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira espécie para este mundo
              </p>
              <Button onClick={() => onSetIsCreateSpeciesOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Espécie
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {species.map((speciesItem) => (
            <AccordionItem
              key={speciesItem.id}
              value={speciesItem.id}
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
                            onSpeciesClick(speciesItem.id);
                          }}
                        >
                          {speciesItem.knownName}
                        </CardTitle>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <CardDescription className="line-clamp-1">
                        {speciesItem.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">
                          {speciesItem.races.length}{" "}
                          {speciesItem.races.length === 1 ? "raça" : "raças"}
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
                        onClick={() => onOpenCreateRaceModal(speciesItem.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Raça
                      </Button>
                    </div>

                    {speciesItem.races.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhuma raça cadastrada para esta espécie
                      </p>
                    ) : (
                      <div className="grid gap-3">
                        {speciesItem.races.map((race) => (
                          <Card
                            key={race.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => onRaceClick(race.id)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">
                                  {race.name}
                                </CardTitle>
                                <Badge className={typeColors[race.type]}>
                                  {race.type}
                                </Badge>
                              </div>
                              <CardDescription className="line-clamp-1">
                                {race.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <CreateSpeciesModal
        isOpen={isCreateSpeciesOpen}
        onClose={() => onSetIsCreateSpeciesOpen(false)}
        onSubmit={onCreateSpecies}
      />

      <CreateRaceModal
        isOpen={isCreateRaceOpen}
        onClose={() => onSetIsCreateRaceOpen(false)}
        onSubmit={onCreateRace}
      />
    </div>
  );
}