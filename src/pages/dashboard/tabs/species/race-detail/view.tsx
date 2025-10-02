import React from "react";

import { ArrowLeft, Edit, Save, X, Trash2 } from "lucide-react";

import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface IRace {
  id: string;
  name: string;
  description: string;
  history: string;
  type: "Aquática" | "Terrestre" | "Voadora" | "Espacial" | "Espiritual";
  physicalCharacteristics?: string;
  culture?: string;
  speciesId: string;
  speciesName: string;
}

interface EditForm {
  name: string;
  description: string;
  history: string;
  type: IRace["type"];
  physicalCharacteristics: string;
  culture: string;
}

interface PropsRaceDetailView {
  race: IRace;
  editForm: EditForm;
  isEditing: boolean;
  isDeleteModalOpen: boolean;
  typeColors: Record<string, string>;
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onDelete: () => void;
  onEditFormChange: (field: string, value: any) => void;
}

export function RaceDetailView({
  race,
  editForm,
  isEditing,
  isDeleteModalOpen,
  typeColors,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onDelete,
  onEditFormChange,
}: PropsRaceDetailView) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Espécies
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) =>
                          onEditFormChange("name", e.target.value)
                        }
                        placeholder="Nome da raça"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo *</Label>
                      <Select
                        value={editForm.type}
                        onValueChange={(value: IRace["type"]) =>
                          onEditFormChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aquática">Aquática</SelectItem>
                          <SelectItem value="Terrestre">Terrestre</SelectItem>
                          <SelectItem value="Voadora">Voadora</SelectItem>
                          <SelectItem value="Espacial">Espacial</SelectItem>
                          <SelectItem value="Espiritual">Espiritual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <CardTitle className="text-3xl mb-2">{race.name}</CardTitle>
                    <CardDescription className="text-lg mb-4">
                      Espécie: {race.speciesName}
                    </CardDescription>
                    <Badge className={typeColors[race.type]}>{race.type}</Badge>
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
                    placeholder="Descrição da raça"
                    className="min-h-[80px]"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {race.description}
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">História</h3>
                {isEditing ? (
                  <Textarea
                    value={editForm.history}
                    onChange={(e) =>
                      onEditFormChange("history", e.target.value)
                    }
                    placeholder="História da raça"
                    className="min-h-[120px]"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {race.history}
                  </p>
                )}
              </div>

              {(race.physicalCharacteristics || isEditing) && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Características Físicas
                  </h3>
                  {isEditing ? (
                    <Textarea
                      value={editForm.physicalCharacteristics}
                      onChange={(e) =>
                        onEditFormChange(
                          "physicalCharacteristics",
                          e.target.value
                        )
                      }
                      placeholder="Características físicas da raça (opcional)"
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {race.physicalCharacteristics}
                    </p>
                  )}
                </div>
              )}

              {(race.culture || isEditing) && (
                <div>
                  <h3 className="font-semibold mb-2">Cultura</h3>
                  {isEditing ? (
                    <Textarea
                      value={editForm.culture}
                      onChange={(e) =>
                        onEditFormChange("culture", e.target.value)
                      }
                      placeholder="Cultura da raça (opcional)"
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {race.culture}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <ConfirmDeleteModal
          open={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          onConfirm={onDelete}
          title="Excluir Raça"
          description={`Tem certeza que deseja excluir "${race.name}"? Esta ação não pode ser desfeita.`}
        />
      </div>
    </div>
  );
}
