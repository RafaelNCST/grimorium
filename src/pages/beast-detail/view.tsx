import React from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Upload,
  Plus,
  Minus,
  Shield,
  Skull,
  Sun,
  Moon,
  TreePine,
  Sword,
  Camera,
  FileText,
} from "lucide-react";

import { LinkedNotesModal } from "@/components/annotations/linked-notes-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { Beast } from "@/mocks/local/beast-data";

interface BeastDetailViewProps {
  // Data
  currentData: Beast;
  isEditing: boolean;
  editedBeast: Beast;
  showDeleteModal: boolean;
  newMythology: { people: string; version: string };
  isAddingMythology: boolean;
  isLinkedNotesModalOpen: boolean;
  linkedNotes: any[];
  fileInputRef: React.RefObject<HTMLInputElement>;

  // Helper functions
  getThreatLevelIcon: (threatLevel: string) => any;
  getHabitIcon: (habit: string) => any;
  getComparisonColor: (comparison: string) => string;

  // Handlers
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditedBeastChange: (updates: Partial<Beast>) => void;
  onAddMythology: () => void;
  onRemoveMythology: (mythId: string) => void;
  onNewMythologyChange: (mythology: { people: string; version: string }) => void;

  // Modal handlers
  setShowDeleteModal: (show: boolean) => void;
  setIsAddingMythology: (adding: boolean) => void;
  setIsLinkedNotesModalOpen: (open: boolean) => void;

  // Options
  habits: string[];
  humanComparisons: string[];
}

export function BeastDetailView({
  currentData,
  isEditing,
  editedBeast,
  showDeleteModal,
  newMythology,
  isAddingMythology,
  isLinkedNotesModalOpen,
  linkedNotes,
  fileInputRef,
  getThreatLevelIcon,
  getHabitIcon,
  getComparisonColor,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onImageUpload,
  onEditedBeastChange,
  onAddMythology,
  onRemoveMythology,
  onNewMythologyChange,
  setShowDeleteModal,
  setIsAddingMythology,
  setIsLinkedNotesModalOpen,
  habits,
  humanComparisons,
}: BeastDetailViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{currentData.name}</h1>
              <p className="text-muted-foreground">Detalhes da besta</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsLinkedNotesModalOpen(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Anotações ({linkedNotes.length})
                </Button>
                <Button variant="outline" onClick={onEdit}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button onClick={onSave} className="btn-magical">
                  Salvar
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image and Basic Info */}
          <div className="space-y-6">
            {/* Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square w-full overflow-hidden rounded-lg relative group">
                  <img
                    src={currentData.image}
                    alt={currentData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Alterar
                    </Button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Nível de Ameaça:
                  </span>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full bg-${currentData.threatLevel.color}-50`}
                  >
                    {React.createElement(
                      getThreatLevelIcon(currentData.threatLevel.name),
                      { className: "w-5 h-5" }
                    )}
                    <span
                      className={`font-medium text-${currentData.threatLevel.color}-600`}
                    >
                      {currentData.threatLevel.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hábito:</span>
                  <div className="flex items-center gap-2">
                    {React.createElement(getHabitIcon(currentData.habit), {
                      className: "w-5 h-5",
                    })}
                    <span className="font-medium">{currentData.habit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">vs Humano:</span>
                  <div
                    className={`px-3 py-1 rounded-full ${getComparisonColor(currentData.humanComparison)}`}
                  >
                    <span className="font-medium">
                      {currentData.humanComparison}
                    </span>
                  </div>
                </div>

                {currentData.race && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Raça:</span>
                    <Badge variant="secondary">{currentData.race}</Badge>
                  </div>
                )}

                {currentData.species && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Espécie:</span>
                    <Badge variant="outline">{currentData.species}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={editedBeast.name}
                        onChange={(e) =>
                          onEditedBeastChange({ name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="alternativeNames">
                        Nomes Alternativos
                      </Label>
                      <Input
                        id="alternativeNames"
                        value={editedBeast.alternativeNames.join(", ")}
                        onChange={(e) =>
                          onEditedBeastChange({
                            alternativeNames: e.target.value
                              .split(", ")
                              .filter((n) => n.trim()),
                          })
                        }
                        placeholder="Separados por vírgula"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="race">Raça</Label>
                        <Input
                          id="race"
                          value={editedBeast.race}
                          onChange={(e) =>
                            onEditedBeastChange({ race: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="species">Espécie</Label>
                        <Input
                          id="species"
                          value={editedBeast.species}
                          onChange={(e) =>
                            onEditedBeastChange({ species: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="basicDescription">Descrição Básica</Label>
                      <Textarea
                        id="basicDescription"
                        value={editedBeast.basicDescription}
                        onChange={(e) =>
                          onEditedBeastChange({
                            basicDescription: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {currentData.name}
                      </h3>
                      {currentData.alternativeNames.length > 0 && (
                        <p className="text-muted-foreground">
                          Também conhecido como:{" "}
                          {currentData.alternativeNames.join(", ")}
                        </p>
                      )}
                    </div>
                    <p>{currentData.basicDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Descriptions */}
            <Card>
              <CardHeader>
                <CardTitle>Descrições Detalhadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="appearanceDescription">
                        Descrição da Aparência
                      </Label>
                      <Textarea
                        id="appearanceDescription"
                        value={editedBeast.appearanceDescription}
                        onChange={(e) =>
                          onEditedBeastChange({
                            appearanceDescription: e.target.value,
                          })
                        }
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="behaviors">Comportamentos</Label>
                      <Textarea
                        id="behaviors"
                        value={editedBeast.behaviors}
                        onChange={(e) =>
                          onEditedBeastChange({ behaviors: e.target.value })
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Aparência</h4>
                      <p className="text-muted-foreground">
                        {currentData.appearanceDescription}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Comportamentos</h4>
                      <p className="text-muted-foreground">
                        {currentData.behaviors}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Habitat and Relationships */}
            <Card>
              <CardHeader>
                <CardTitle>Habitat e Relacionamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="habit">Hábito</Label>
                        <Select
                          value={editedBeast.habit}
                          onValueChange={(value) =>
                            onEditedBeastChange({ habit: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {habits.map((habit) => (
                              <SelectItem key={habit} value={habit}>
                                {habit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="humanComparison">
                          Comparação com Humano
                        </Label>
                        <Select
                          value={editedBeast.humanComparison}
                          onValueChange={(value) =>
                            onEditedBeastChange({ humanComparison: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {humanComparisons.map((comparison) => (
                              <SelectItem key={comparison} value={comparison}>
                                {comparison}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="habitat">Habitat</Label>
                      <Input
                        id="habitat"
                        value={editedBeast.habitat.join(", ")}
                        onChange={(e) =>
                          onEditedBeastChange({
                            habitat: e.target.value
                              .split(", ")
                              .filter((h) => h.trim()),
                          })
                        }
                        placeholder="Separados por vírgula"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weaknesses">Fraquezas</Label>
                      <Textarea
                        id="weaknesses"
                        value={editedBeast.weaknesses.join("\n")}
                        onChange={(e) =>
                          onEditedBeastChange({
                            weaknesses: e.target.value
                              .split("\n")
                              .filter((w) => w.trim()),
                          })
                        }
                        rows={3}
                        placeholder="Uma fraqueza por linha"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preys">Presas</Label>
                      <Input
                        id="preys"
                        value={editedBeast.preys.join(", ")}
                        onChange={(e) =>
                          onEditedBeastChange({
                            preys: e.target.value
                              .split(", ")
                              .filter((p) => p.trim()),
                          })
                        }
                        placeholder="Separados por vírgula"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Habitat</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentData.habitat.map((h, index) => (
                            <Badge key={index} variant="outline">
                              {h}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Presas</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentData.preys.map((prey, index) => (
                            <Badge key={index} variant="secondary">
                              {prey}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Fraquezas</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {currentData.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mythologies */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mitologias</CardTitle>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingMythology(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isAddingMythology && (
                  <Card className="p-4 border-dashed">
                    <div className="space-y-3">
                      <Input
                        placeholder="Nome do povo/espécie"
                        value={newMythology.people}
                        onChange={(e) =>
                          onNewMythologyChange({
                            ...newMythology,
                            people: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        placeholder="Versão da mitologia..."
                        value={newMythology.version}
                        onChange={(e) =>
                          onNewMythologyChange({
                            ...newMythology,
                            version: e.target.value,
                          })
                        }
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={onAddMythology}>
                          Adicionar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsAddingMythology(false);
                            onNewMythologyChange({ people: "", version: "" });
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {currentData.mythologies.map((mythology, index) => (
                  <Card key={mythology.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{mythology.people}</h4>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveMythology(mythology.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground">{mythology.version}</p>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Inspirations */}
            <Card>
              <CardHeader>
                <CardTitle>Inspirações</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedBeast.inspirations}
                    onChange={(e) =>
                      onEditedBeastChange({ inspirations: e.target.value })
                    }
                    rows={4}
                    placeholder="Links, pesquisas, temas que inspiraram esta besta..."
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {currentData.inspirations}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <ConfirmDeleteModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Excluir Besta"
          description="Esta ação não pode ser desfeita. A besta será permanentemente removida do bestiário."
          onConfirm={onDelete}
        />

        <LinkedNotesModal
          isOpen={isLinkedNotesModalOpen}
          onClose={() => setIsLinkedNotesModalOpen(false)}
          linkedNotes={linkedNotes}
        />
      </div>
    </div>
  );
}