import React, { useState } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
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
import { useToast } from "@/hooks/use-toast";

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

export function RaceDetail() {
  const { bookId, raceId } = useParams({
    from: "/dashboard/$dashboardId/race/$raceId",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock data - replace with actual data management
  const [race, setRace] = useState<IRace>({
    id: "1",
    name: "Elfos da Floresta",
    description:
      "Elfos que vivem em harmonia com as florestas antigas, protegendo os bosques sagrados com sua magia natural.",
    history:
      "Os Elfos da Floresta são os guardiões ancestrais das florestas sagradas. Há milênios, quando o mundo ainda era jovem, eles fizeram um pacto com as árvores antigas para proteger a natureza. Desde então, vivem em perfeita simbiose com a floresta, obtendo sua longevidade e poderes mágicos através desta conexão mística.",
    type: "Terrestre",
    physicalCharacteristics:
      "Possuem pele clara com tons esverdeados sutis, cabelos longos que variam do dourado ao castanho, e orelhas pontiagudas características. Seus olhos geralmente são verdes ou castanhos, refletindo as cores da floresta. São mais altos que os humanos comuns, com corpos esbeltos e movimentos graciosos.",
    culture:
      "Vivem em comunidades arbóreas construídas nas copas das árvores mais antigas. Respeitam profundamente os ciclos naturais, celebrando os solstícios e equinócios. Sua sociedade é baseada na harmonia e no consenso, com decisões tomadas pelos anciões em conselhos sob a luz da lua. Valorizam a arte, música e poesia, considerando-as formas de comunhão com a natureza.",
    speciesId: "1",
    speciesName: "Elfos",
  });

  const [editForm, setEditForm] = useState({
    name: race.name,
    description: race.description,
    history: race.history,
    type: race.type,
    physicalCharacteristics: race.physicalCharacteristics || "",
    culture: race.culture || "",
  });

  const handleEdit = () => {
    setEditForm({
      name: race.name,
      description: race.description,
      history: race.history,
      type: race.type,
      physicalCharacteristics: race.physicalCharacteristics || "",
      culture: race.culture || "",
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setRace({
      ...race,
      name: editForm.name,
      description: editForm.description,
      history: editForm.history,
      type: editForm.type,
      physicalCharacteristics: editForm.physicalCharacteristics || undefined,
      culture: editForm.culture || undefined,
    });
    setIsEditing(false);
    toast({
      title: "Raça atualizada",
      description: "As informações foram salvas com sucesso.",
    });
  };

  const handleCancel = () => {
    setEditForm({
      name: race.name,
      description: race.description,
      history: race.history,
      type: race.type,
      physicalCharacteristics: race.physicalCharacteristics || "",
      culture: race.culture || "",
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    toast({
      title: "Raça excluída",
      description: `${race.name} foi excluída com sucesso.`,
    });
    navigate({
      to: "/dashboard/$dashboardId/dashboard",
      params: { bookId: bookId! },
      search: { tab: "species" },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate({
                to: "/dashboard/$dashboardId/dashboard",
                params: { bookId: bookId! },
                search: { tab: "species" },
              })
            }
          >
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
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Nome da raça"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo *</Label>
                      <Select
                        value={editForm.type}
                        onValueChange={(value: IRace["type"]) =>
                          setEditForm({ ...editForm, type: value })
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
                    <Button
                      onClick={() => setIsDeleteModalOpen(true)}
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
                      setEditForm({ ...editForm, description: e.target.value })
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
                      setEditForm({ ...editForm, history: e.target.value })
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
                        setEditForm({
                          ...editForm,
                          physicalCharacteristics: e.target.value,
                        })
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
                        setEditForm({ ...editForm, culture: e.target.value })
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
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Excluir Raça"
          description={`Tem certeza que deseja excluir "${race.name}"? Esta ação não pode ser desfeita.`}
        />
      </div>
    </div>
  );
}
