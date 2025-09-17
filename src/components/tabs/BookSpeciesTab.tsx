import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, ChevronRight, Search, Dna } from "lucide-react";
import { CreateSpeciesModal } from "@/components/modals/CreateSpeciesModal";
import { CreateRaceModal } from "@/components/modals/CreateRaceModal";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";

interface Race {
  id: string;
  name: string;
  description: string;
  history: string;
  type: 'Aquática' | 'Terrestre' | 'Voadora' | 'Espacial' | 'Espiritual';
  physicalCharacteristics?: string;
  culture?: string;
  speciesId: string;
}

interface Species {
  id: string;
  knownName: string;
  scientificName?: string;
  description: string;
  worldId: string;
  worldName: string;
  races: Race[];
}

interface BookSpeciesTabProps {
  bookId: string;
}

const typeColors = {
  'Aquática': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Terrestre': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Voadora': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  'Espacial': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Espiritual': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
};

export function BookSpeciesTab({ bookId }: BookSpeciesTabProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateSpeciesOpen, setIsCreateSpeciesOpen] = useState(false);
  const [isCreateRaceOpen, setIsCreateRaceOpen] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('');

  // Mock data - replace with actual data management
  const [species, setSpecies] = useState<Species[]>([
    {
      id: '1',
      knownName: 'Elfos',
      scientificName: 'Homo elvensis',
      description: 'Seres mágicos de longa vida com orelhas pontiagudas e grande afinidade com a natureza.',
      worldId: 'world1',
      worldName: 'Aethermoor',
      races: [
        {
          id: '1',
          name: 'Elfos da Floresta',
          description: 'Elfos que vivem em harmonia com as florestas antigas.',
          history: 'Os Elfos da Floresta são os guardiões ancestrais das florestas sagradas...',
          type: 'Terrestre',
          physicalCharacteristics: 'Pele clara com tons esverdeados, cabelos longos...',
          culture: 'Vivem em comunidades arbóreas, respeitando os ciclos naturais...',
          speciesId: '1'
        },
        {
          id: '2',
          name: 'Elfos do Mar',
          description: 'Elfos adaptados à vida aquática com habilidades marinhas.',
          history: 'Descendentes dos primeiros elfos que migraram para os oceanos...',
          type: 'Aquática',
          physicalCharacteristics: 'Pele azulada, guelras funcionais...',
          culture: 'Sociedade baseada na harmonia com as correntes oceânicas...',
          speciesId: '1'
        }
      ]
    },
    {
      id: '2',
      knownName: 'Dragões',
      scientificName: 'Draco magnus',
      description: 'Criaturas ancestrais de grande poder mágico e sabedoria.',
      worldId: 'world1',
      worldName: 'Aethermoor',
      races: [
        {
          id: '3',
          name: 'Dragão de Fogo',
          description: 'Dragões que dominam o elemento fogo.',
          history: 'Nascidos das chamas primordiais do mundo...',
          type: 'Voadora',
          physicalCharacteristics: 'Escamas vermelhas, hálito de fogo...',
          culture: 'Territorialistas, vivem em cavernas vulcânicas...',
          speciesId: '2'
        }
      ]
    }
  ]);

  const filteredSpecies = species.filter(s => 
    s.knownName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.worldName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSpecies = (data: { knownName: string; scientificName?: string; description: string }) => {
    const newSpecies: Species = {
      id: Date.now().toString(),
      ...data,
      worldId: 'world1', // Default world for now
      worldName: 'Aethermoor',
      races: []
    };
    setSpecies([...species, newSpecies]);
    toast({
      title: "Espécie criada",
      description: `${data.knownName} foi criada com sucesso.`,
    });
  };

  const handleCreateRace = (data: { name: string; description: string; history: string; type: Race['type']; physicalCharacteristics?: string; culture?: string }) => {
    const newRace: Race = {
      id: Date.now().toString(),
      ...data,
      speciesId: selectedSpeciesId
    };
    
    setSpecies(species.map(s => 
      s.id === selectedSpeciesId 
        ? { ...s, races: [...s.races, newRace] }
        : s
    ));
    
    toast({
      title: "Raça criada",
      description: `${data.name} foi criada com sucesso.`,
    });
  };

  const handleSpeciesClick = (speciesId: string, worldId: string) => {
    navigate(`/book/${bookId}/world/${worldId}/species/${speciesId}`);
  };

  const handleRaceClick = (raceId: string, worldId: string) => {
    navigate(`/book/${bookId}/world/${worldId}/race/${raceId}`);
  };

  const openCreateRaceModal = (speciesId: string) => {
    setSelectedSpeciesId(speciesId);
    setIsCreateRaceOpen(true);
  };

  // Statistics
  const totalSpecies = species.length;
  const totalRaces = species.reduce((sum, s) => sum + s.races.length, 0);

  if (species.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Espécies</h2>
            <p className="text-muted-foreground">Gerencie as espécies e suas raças</p>
          </div>
          <Button variant="magical" onClick={() => setIsCreateSpeciesOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Espécie
          </Button>
        </div>
        
        <EmptyState
          icon={Dna}
          title="Nenhuma espécie criada"
          description="Comece criando a primeira espécie da sua história para organizar as raças e características dos seres vivos."
          actionLabel="Criar Espécie"
          onAction={() => setIsCreateSpeciesOpen(true)}
        />

        <CreateSpeciesModal
          isOpen={isCreateSpeciesOpen}
          onClose={() => setIsCreateSpeciesOpen(false)}
          onSubmit={handleCreateSpecies}
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
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {totalSpecies} Total
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400">
              {species.reduce((sum, s) => sum + s.races.filter(r => r.type === 'Aquática').length, 0)} Aquática
            </Badge>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400">
              {species.reduce((sum, s) => sum + s.races.filter(r => r.type === 'Terrestre').length, 0)} Terrestre
            </Badge>
            <Badge variant="secondary" className="bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400">
              {species.reduce((sum, s) => sum + s.races.filter(r => r.type === 'Voadora').length, 0)} Voadora
            </Badge>
          </div>
        </div>
        <Button variant="magical" onClick={() => setIsCreateSpeciesOpen(true)}>
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
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Accordion type="multiple" className="space-y-4">
        {filteredSpecies.map((speciesItem) => (
          <AccordionItem key={speciesItem.id} value={speciesItem.id} className="border rounded-lg">
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
                          handleSpeciesClick(speciesItem.id, speciesItem.worldId);
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
                        {speciesItem.races.length} {speciesItem.races.length === 1 ? 'raça' : 'raças'}
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
                      onClick={() => openCreateRaceModal(speciesItem.id)}
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
                          onClick={() => handleRaceClick(race.id, speciesItem.worldId)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{race.name}</CardTitle>
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
        onClose={() => setIsCreateSpeciesOpen(false)}
        onSubmit={handleCreateSpecies}
      />

      <CreateRaceModal
        isOpen={isCreateRaceOpen}
        onClose={() => setIsCreateRaceOpen(false)}
        onSubmit={handleCreateRace}
      />
    </div>
  );
}