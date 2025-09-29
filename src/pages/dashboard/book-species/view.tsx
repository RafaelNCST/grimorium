import { Plus, ChevronRight, Search, Dna } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
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
import { Input } from "@/components/ui/input";

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
  worldId: string;
  worldName: string;
  races: IRace[];
}

interface BookSpeciesViewProps {
  bookId: string;
  species: ISpecies[];
  filteredSpecies: ISpecies[];
  searchTerm: string;
  isCreateSpeciesOpen: boolean;
  isCreateRaceOpen: boolean;
  totalSpecies: number;
  onSearchTermChange: (term: string) => void;
  onCreateSpeciesOpenChange: (open: boolean) => void;
  onCreateRaceOpenChange: (open: boolean) => void;
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
  onSpeciesClick: (speciesId: string, worldId: string) => void;
  onRaceClick: (raceId: string, worldId: string) => void;
  onOpenCreateRaceModal: (speciesId: string) => void;
}

const typeColors = {
  Aquática: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Terrestre:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Voadora: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  Espacial:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Espiritual:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export function BookSpeciesView({
  species,
  filteredSpecies,
  searchTerm,
  isCreateSpeciesOpen,
  isCreateRaceOpen,
  totalSpecies,
  onSearchTermChange,
  onCreateSpeciesOpenChange,
  onCreateRaceOpenChange,
  onCreateSpecies,
  onCreateRace,
  onSpeciesClick,
  onRaceClick,
  onOpenCreateRaceModal,
}: BookSpeciesViewProps) {
  if (species.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Espécies</h2>
            <p className="text-muted-foreground">
              Gerencie as espécies e suas raças
            </p>
          </div>
          <Button
            variant="magical"
            onClick={() => onCreateSpeciesOpenChange(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Espécie
          </Button>
        </div>

        <EmptyState
          icon={Dna}
          title="Nenhuma espécie criada"
          description="Comece criando a primeira espécie da sua história para organizar as raças e características dos seres vivos."
          actionLabel="Criar Espécie"
          onAction={() => onCreateSpeciesOpenChange(true)}
        />

        <CreateSpeciesModal
          isOpen={isCreateSpeciesOpen}
          onClose={() => onCreateSpeciesOpenChange(false)}
          onSubmit={onCreateSpecies}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Espécies</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {totalSpecies} Total
            </Badge>
            <Badge
              variant="secondary"
              className="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
            >
              {species.reduce(
                (sum, s) =>
                  sum + s.races.filter((r) => r.type === "Aquática").length,
                0
              )}{" "}
              Aquática
            </Badge>
            <Badge
              variant="secondary"
              className="bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
            >
              {species.reduce(
                (sum, s) =>
                  sum + s.races.filter((r) => r.type === "Terrestre").length,
                0
              )}{" "}
              Terrestre
            </Badge>
            <Badge
              variant="secondary"
              className="bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400"
            >
              {species.reduce(
                (sum, s) =>
                  sum + s.races.filter((r) => r.type === "Voadora").length,
                0
              )}{" "}
              Voadora
            </Badge>
          </div>
        </div>
        <Button
          variant="magical"
          onClick={() => onCreateSpeciesOpenChange(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Espécie
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar espécies..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Accordion type="multiple" className="space-y-4">
        {filteredSpecies.map((speciesItem) => (
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
                      <Dna className="h-5 w-5 text-primary" />
                      <CardTitle
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeciesClick(speciesItem.id, speciesItem.worldId);
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
                      <Badge variant="outline" className="text-xs">
                        {speciesItem.worldName}
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
                          onClick={() =>
                            onRaceClick(race.id, speciesItem.worldId)
                          }
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

      <CreateSpeciesModal
        isOpen={isCreateSpeciesOpen}
        onClose={() => onCreateSpeciesOpenChange(false)}
        onSubmit={onCreateSpecies}
      />

      <CreateRaceModal
        isOpen={isCreateRaceOpen}
        onClose={() => onCreateRaceOpenChange(false)}
        onSubmit={onCreateRace}
      />
    </div>
  );
}
