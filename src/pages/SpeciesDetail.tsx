import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Save, X, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateRaceModal } from "@/components/modals/CreateRaceModal";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";

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
  races: Race[];
}

const typeColors = {
  'Aquática': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Terrestre': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Voadora': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  'Espacial': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Espiritual': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
};

export function SpeciesDetail() {
  const { bookId, worldId, speciesId } = useParams<{ bookId: string; worldId: string; speciesId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateRaceOpen, setIsCreateRaceOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock data - replace with actual data management
  const [species, setSpecies] = useState<Species>({
    id: '1',
    knownName: 'Elfos',
    scientificName: 'Homo elvensis',
    description: 'Seres mágicos de longa vida com orelhas pontiagudas e grande afinidade com a natureza. Possuem habilidades mágicas naturais e uma conexão profunda com o mundo natural.',
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
  });

  const [editForm, setEditForm] = useState({
    knownName: species.knownName,
    scientificName: species.scientificName || '',
    description: species.description,
  });

  const handleEdit = () => {
    setEditForm({
      knownName: species.knownName,
      scientificName: species.scientificName || '',
      description: species.description,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setSpecies({
      ...species,
      knownName: editForm.knownName,
      scientificName: editForm.scientificName || undefined,
      description: editForm.description,
    });
    setIsEditing(false);
    toast({
      title: "Espécie atualizada",
      description: "As informações foram salvas com sucesso.",
    });
  };

  const handleCancel = () => {
    setEditForm({
      knownName: species.knownName,
      scientificName: species.scientificName || '',
      description: species.description,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    toast({
      title: "Espécie excluída",
      description: `${species.knownName} e suas raças foram excluídas com sucesso.`,
    });
    navigate(`/book/${bookId}/world/${worldId}`);
  };

  const handleCreateRace = (data: { name: string; description: string; history: string; type: Race['type']; physicalCharacteristics?: string; culture?: string }) => {
    const newRace: Race = {
      id: Date.now().toString(),
      ...data,
      speciesId: species.id
    };
    
    setSpecies({
      ...species,
      races: [...species.races, newRace]
    });
    
    toast({
      title: "Raça criada",
      description: `${data.name} foi criada com sucesso.`,
    });
  };

  const handleRaceClick = (raceId: string) => {
    navigate(`/book/${bookId}/world/${worldId}/race/${raceId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/book/${bookId}/world/${worldId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Mundo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="knownName">Nome Conhecido *</Label>
                      <Input
                        id="knownName"
                        value={editForm.knownName}
                        onChange={(e) => setEditForm({ ...editForm, knownName: e.target.value })}
                        placeholder="Nome conhecido da espécie"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scientificName">Nome Científico</Label>
                      <Input
                        id="scientificName"
                        value={editForm.scientificName}
                        onChange={(e) => setEditForm({ ...editForm, scientificName: e.target.value })}
                        placeholder="Nome científico (opcional)"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <CardTitle className="text-3xl mb-2">{species.knownName}</CardTitle>
                    {species.scientificName && (
                      <CardDescription className="text-lg italic mb-2">
                        {species.scientificName}
                      </CardDescription>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {species.races.length} {species.races.length === 1 ? 'raça' : 'raças'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleEdit} variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button onClick={() => setIsDeleteModalOpen(true)} variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                {isEditing ? (
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Descrição da espécie"
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{species.description}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Raças</h3>
                  <Button onClick={() => setIsCreateRaceOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Raça
                  </Button>
                </div>
                
                {species.races.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Nenhuma raça cadastrada para esta espécie
                      </p>
                      <Button onClick={() => setIsCreateRaceOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Primeira Raça
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {species.races.map((race) => (
                      <Card 
                        key={race.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleRaceClick(race.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{race.name}</CardTitle>
                            <Badge className={typeColors[race.type]}>
                              {race.type}
                            </Badge>
                          </div>
                          <CardDescription>
                            {race.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <CreateRaceModal
          isOpen={isCreateRaceOpen}
          onClose={() => setIsCreateRaceOpen(false)}
          onSubmit={handleCreateRace}
        />

        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Excluir Espécie"
          description={`Tem certeza que deseja excluir "${species.knownName}"? Esta ação também excluirá todas as raças associadas e não pode ser desfeita.`}
        />
      </div>
    </div>
  );
}