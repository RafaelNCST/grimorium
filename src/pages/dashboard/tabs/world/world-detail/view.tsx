import React from "react";

import {
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  MapPin,
  Globe,
  Mountain,
  TreePine,
  Castle,
  Home,
  Upload,
  X,
  FileText,
} from "lucide-react";

import { LinkedNotesModal } from "@/components/annotations/linked-notes-modal";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { SpeciesTab } from "@/components/tabs/species-tab";
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
import { Textarea } from "@/components/ui/textarea";
import { WorldTimeline } from "@/components/world-timeline";

interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  worldId?: string;
  continentId?: string;
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

interface StickyNote {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
}

interface Organization {
  id: string;
  name: string;
}

interface World {
  id: string;
  name: string;
}

interface Continent {
  id: string;
  name: string;
  worldId: string;
}

interface PropsWorldDetailView {
  character: WorldEntity;
  isEditing: boolean;
  showDeleteModal: boolean;
  editData: WorldEntity;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  stickyNotes: StickyNote[];
  isLinkedNotesModalOpen: boolean;
  linkedNotes: any[];
  mockOrganizations: Organization[];
  mockWorlds: World[];
  mockContinents: Continent[];
  onBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onDelete: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: any) => void;
  onAddStickyNote: () => void;
  onLinkedNotesModalOpen: () => void;
  onLinkedNotesModalClose: () => void;
  getEntityIcon: () => React.ReactNode;
  getWorldName: (worldId?: string) => string | null;
  getContinentName: (continentId?: string) => string | null;
  getEntityTypeForModal: () => string;
}

export function WorldDetailView({
  character,
  isEditing,
  showDeleteModal,
  editData,
  imagePreview,
  fileInputRef,
  stickyNotes,
  isLinkedNotesModalOpen,
  linkedNotes,
  mockOrganizations,
  mockWorlds,
  mockContinents,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onDelete,
  onImageChange,
  onEditDataChange,
  onAddStickyNote,
  onLinkedNotesModalOpen,
  onLinkedNotesModalClose,
  getEntityIcon,
  getWorldName,
  getContinentName,
  getEntityTypeForModal,
}: PropsWorldDetailView) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {getEntityIcon()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{character.name}</h1>
                  <Badge variant="outline">
                    {character.type === "World"
                      ? "Mundo"
                      : character.type === "Continent"
                        ? "Continente"
                        : "Local"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="default" onClick={onSave}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={onCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={onLinkedNotesModalOpen}>
                    <FileText className="w-4 h-4 mr-2" />
                    Anotações ({linkedNotes.length})
                  </Button>
                  <Button variant="outline" onClick={onEdit}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={onDeleteModalOpen}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="card-magical">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="image">Imagem</Label>
                      <div
                        className="flex items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ) : character.image ? (
                          <div className="relative w-full h-full">
                            <img
                              src={character.image}
                              alt="Current"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                            <span className="text-sm text-muted-foreground text-center">
                              Clique para enviar imagem ou mapa
                            </span>
                            <span className="text-xs text-muted-foreground/70 text-center mt-1">
                              Recomendado: 16:9 para melhor visualização
                            </span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) =>
                          onEditDataChange("name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={editData.description}
                        onChange={(e) =>
                          onEditDataChange("description", e.target.value)
                        }
                        className="min-h-[100px]"
                      />
                    </div>

                    {character.type === "Location" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="classification">Classificação</Label>
                          <Input
                            id="classification"
                            value={editData.classification || ""}
                            onChange={(e) =>
                              onEditDataChange("classification", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="climate">Clima</Label>
                          <Input
                            id="climate"
                            value={editData.climate || ""}
                            onChange={(e) =>
                              onEditDataChange("climate", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Localização</Label>
                          <Input
                            id="location"
                            value={editData.location || ""}
                            onChange={(e) =>
                              onEditDataChange("location", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="terrain">Solo</Label>
                          <Input
                            id="terrain"
                            value={editData.terrain || ""}
                            onChange={(e) =>
                              onEditDataChange("terrain", e.target.value)
                            }
                          />
                        </div>
                      </>
                    )}

                    {(character.type === "World" ||
                      character.type === "Continent") && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="age">Idade</Label>
                          <Input
                            id="age"
                            value={editData.age || ""}
                            onChange={(e) =>
                              onEditDataChange("age", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dominantOrganization">
                            Organização Dominante
                          </Label>
                          <Select
                            value={editData.dominantOrganization || ""}
                            onValueChange={(value) =>
                              onEditDataChange(
                                "dominantOrganization",
                                value === "none" ? "" : value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma organização" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhuma</SelectItem>
                              {mockOrganizations.map((org) => (
                                <SelectItem key={org.id} value={org.name}>
                                  {org.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Full-width image */}
                    {character.image && (
                      <div className="w-full">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {character.name}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {character.description}
                      </p>
                    </div>

                    {character.age && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Idade:</span>
                        <span>{character.age}</span>
                      </div>
                    )}

                    {character.classification && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Classificação:</span>
                        <Badge variant="secondary">
                          {character.classification}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information Cards */}
            {character.type === "Location" && (
              <>
                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {character.climate && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Clima</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {character.climate}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {character.terrain && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Terreno</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {character.terrain}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Organizations */}
                {character.organizations &&
                  character.organizations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Organizações Presentes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {character.organizations.map((org, idx) => (
                            <Badge key={idx} variant="secondary">
                              {org}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </>
            )}

            {/* Dominant Organization */}
            {character.dominantOrganization && (
              <Card>
                <CardHeader>
                  <CardTitle>Organização Dominante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{character.dominantOrganization}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onAddStickyNote}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nota Rápida
                </Button>
              </CardContent>
            </Card>

            {/* Sticky Notes */}
            {stickyNotes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stickyNotes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-lg ${note.color} text-sm`}
                      >
                        {note.content}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Hierarchy (only show for locations) */}
            {character.type === "Location" && (
              <Card>
                <CardHeader>
                  <CardTitle>Hierarquia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {getWorldName(character.worldId) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4" />
                      <span>{getWorldName(character.worldId)}</span>
                    </div>
                  )}
                  {getContinentName(character.continentId) && (
                    <div className="flex items-center gap-2 text-sm ml-4">
                      <Mountain className="w-4 h-4" />
                      <span>{getContinentName(character.continentId)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm ml-8">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{character.name}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Species Section (if applicable) */}
        {(character.type === "World" || character.type === "Continent") && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Espécies e Raças</CardTitle>
              </CardHeader>
              <CardContent>
                <SpeciesTab />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timeline Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <WorldTimeline
                worldId={character.id}
                worldType={character.type as "World" | "Continent"}
                isEditing={isEditing}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={onDeleteModalClose}
        title={`Excluir ${character.type === "World" ? "Mundo" : character.type === "Continent" ? "Continente" : "Local"}`}
        description={`Tem certeza que deseja excluir "${character.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={onDelete}
      />

      <LinkedNotesModal
        isOpen={isLinkedNotesModalOpen}
        onClose={onLinkedNotesModalClose}
        entityId={character.id}
        entityName={character.name}
        entityType={getEntityTypeForModal()}
        linkedNotes={linkedNotes}
      />
    </div>
  );
}
