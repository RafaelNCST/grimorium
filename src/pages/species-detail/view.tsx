import React from "react";
import { ArrowLeft, Edit, Save, X, Trash2, Plus } from "lucide-react";

import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { CreateRaceModal } from "@/components/modals/create-race-modal";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SpeciesDetailViewProps {
  species: any;
  editForm: any;
  isEditing: boolean;
  isCreateRaceOpen: boolean;
  isDeleteModalOpen: boolean;
  typeColors: Record<string, string>;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onCreateRaceModalOpen: () => void;
  onCreateRaceModalClose: () => void;
  onCreateRace: (data: any) => void;
  onRaceClick: (raceId: string) => void;
  onEditFormChange: (field: string, value: string) => void;
}

export function SpeciesDetailView({
  species,
  editForm,
  isEditing,
  isCreateRaceOpen,
  isDeleteModalOpen,
  typeColors,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDeleteModalOpen,
  onDeleteModalClose,
  onCreateRaceModalOpen,
  onCreateRaceModalClose,
  onCreateRace,
  onRaceClick,
  onEditFormChange,
}: SpeciesDetailViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
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
                        onChange={(e) =>
                          onEditFormChange("knownName", e.target.value)
                        }
                        placeholder="Nome conhecido da espécie"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scientificName">Nome Científico</Label>
                      <Input
                        id="scientificName"
                        value={editForm.scientificName}
                        onChange={(e) =>
                          onEditFormChange("scientificName", e.target.value)
                        }
                        placeholder="Nome científico (opcional)"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {species.knownName}
                    </CardTitle>
                    {species.scientificName && (
                      <CardDescription className="text-lg italic mb-2">
                        {species.scientificName}
                      </CardDescription>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {species.races.length}{" "}
                        {species.races.length === 1 ? "raça" : "raças"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={onSave} size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar
                    </Button>
                    <Button onClick={onCancel} variant="outline" size="sm">
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={onEdit} variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      onClick={onDeleteModalOpen}
                      variant="destructive"
                      size="sm"
                    >
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
                    onChange={(e) =>
                      onEditFormChange("description", e.target.value)
                    }
                    placeholder="Descrição da espécie"
                    className="min-h-[100px]"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {species.description}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Raças</h3>
                  <Button onClick={onCreateRaceModalOpen}>
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
                      <Button onClick={onCreateRaceModalOpen}>
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
                        onClick={() => onRaceClick(race.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {race.name}
                            </CardTitle>
                            <Badge className={typeColors[race.type]}>
                              {race.type}
                            </Badge>
                          </div>
                          <CardDescription>{race.description}</CardDescription>
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
          onClose={onCreateRaceModalClose}
          onSubmit={onCreateRace}
        />

        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          onConfirm={onDelete}
          title="Excluir Espécie"
          description={`Tem certeza que deseja excluir "${species.knownName}"? Esta ação também excluirá todas as raças associadas e não pode ser desfeita.`}
        />
      </div>
    </div>
  );
}