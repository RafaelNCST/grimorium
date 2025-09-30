import React from "react";

import {
  ArrowLeft,
  Edit2,
  Trash2,
  MapPin,
  Users,
  Calendar,
  Heart,
  Crown,
  Sword,
  Shield,
  Upload,
  Plus,
  Minus,
  TreePine,
  Target,
  Menu,
  User,
  UserCheck,
  Users2,
  Ban,
  HelpCircle,
  FileText,
  BookOpen,
  UserPlus,
} from "lucide-react";

import { LinkedNotesModal } from "@/components/annotations/linked-notes-modal";
import { CharacterNavigationSidebar } from "@/components/character-navigation-sidebar";
import {
  CharacterVersionManager,
  type CharacterVersion,
} from "@/components/character-version-manager";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface CharacterDetailViewProps {
  character: any;
  editData: any;
  isEditing: boolean;
  versions: CharacterVersion[];
  currentVersion: CharacterVersion;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  isLinkedNotesModalOpen: boolean;
  newQuality: string;
  imagePreview: string;
  selectedRelationshipCharacter: string;
  selectedRelationshipType: string;
  relationshipIntensity: number[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  linkedNotes: any[];
  mockCharacters: any[];
  mockLocations: any[];
  mockOrganizations: any[];
  roles: any[];
  alignments: any[];
  genders: any[];
  familyRelations: any;
  relationshipTypes: any[];
  currentRole: any;
  currentAlignment: any;
  currentGender: any;
  RoleIcon: any;
  onBack: () => void;
  onNavigationSidebarToggle: () => void;
  onNavigationSidebarClose: () => void;
  onCharacterSelect: (characterId: string) => void;
  onLinkedNotesModalOpen: () => void;
  onLinkedNotesModalClose: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onVersionChange: (version: CharacterVersion) => void;
  onVersionSave: (name: string, description?: string) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
  onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAgeChange: (increment: boolean) => void;
  onEditDataChange: (field: string, value: any) => void;
  onQualityAdd: () => void;
  onQualityRemove: (quality: string) => void;
  onNewQualityChange: (value: string) => void;
  onFamilyRelationChange: (
    relationType: string,
    characterId: string | null
  ) => void;
  onRelationshipAdd: () => void;
  onRelationshipRemove: (relationshipId: string) => void;
  onRelationshipIntensityUpdate: (
    relationshipId: string,
    intensity: number
  ) => void;
  onRelationshipCharacterChange: (characterId: string) => void;
  onRelationshipTypeChange: (type: string) => void;
  onRelationshipIntensityChange: (intensity: number[]) => void;
  onNavigateToFamilyTree: () => void;
  getRelationshipTypeData: (type: string) => any;
  getFamilyRelationLabel: (
    relationType: string,
    characterName: string
  ) => string;
}

export function CharacterDetailView({
  character,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  isLinkedNotesModalOpen,
  newQuality,
  imagePreview,
  selectedRelationshipCharacter,
  selectedRelationshipType,
  relationshipIntensity,
  fileInputRef,
  linkedNotes,
  mockCharacters,
  mockLocations,
  mockOrganizations,
  roles,
  alignments,
  genders,
  familyRelations,
  relationshipTypes,
  currentRole,
  currentAlignment,
  currentGender,
  RoleIcon,
  onBack,
  onNavigationSidebarToggle,
  onNavigationSidebarClose,
  onCharacterSelect,
  onLinkedNotesModalOpen,
  onLinkedNotesModalClose,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDeleteModalOpen,
  onDeleteModalClose,
  onVersionChange,
  onVersionSave,
  onVersionDelete,
  onVersionUpdate,
  onImageFileChange,
  onAgeChange,
  onEditDataChange,
  onQualityAdd,
  onQualityRemove,
  onNewQualityChange,
  onFamilyRelationChange,
  onRelationshipAdd,
  onRelationshipRemove,
  onRelationshipIntensityUpdate,
  onRelationshipCharacterChange,
  onRelationshipTypeChange,
  onRelationshipIntensityChange,
  onNavigateToFamilyTree,
  getRelationshipTypeData,
  getFamilyRelationLabel,
}: CharacterDetailViewProps) {
  return (
    <div className="flex min-h-screen">
      <CharacterNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        characters={mockCharacters.map((char) => ({
          id: char.id,
          name: char.name,
          image:
            char.id === "1"
              ? character.image
              : `https://images.unsplash.com/photo-150700321${char.id}?w=300&h=300&fit=crop&crop=face`,
        }))}
        currentCharacterId={character.id}
        onCharacterSelect={onCharacterSelect}
      />

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNavigationSidebarToggle}
                className="hover:bg-muted"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{character.name}</h1>
                <p className="text-muted-foreground">Detalhes do personagem</p>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                  <Button variant="magical" onClick={onSave}>
                    Salvar
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
                  <Button variant="destructive" onClick={onDeleteModalOpen}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Character Version Manager */}
          <div className="mb-6">
            <CharacterVersionManager
              versions={versions}
              currentVersion={currentVersion}
              onVersionChange={onVersionChange}
              onVersionSave={onVersionSave}
              onVersionDelete={onVersionDelete}
              onVersionUpdate={onVersionUpdate}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      {/* Image and Name Section */}
                      <div className="flex items-start gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="image">Imagem</Label>
                          <div
                            className="flex items-center justify-center w-24 h-24 aspect-square border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {imagePreview ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full aspect-square object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                  <Upload className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                                <p className="text-xs text-muted-foreground">
                                  Clique para selecionar
                                </p>
                              </div>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onImageFileChange}
                            className="hidden"
                          />
                        </div>

                        <div className="flex-1 space-y-4">
                          {/* Name */}
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                              id="name"
                              value={editData.name}
                              onChange={(e) =>
                                onEditDataChange("name", e.target.value)
                              }
                              placeholder="Nome do personagem"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Age */}
                            <div className="space-y-2">
                              <Label htmlFor="age">Idade *</Label>
                              <div className="flex items-center max-w-32">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-9 w-9 p-0"
                                  onClick={() => onAgeChange(false)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <Input
                                  id="age"
                                  type="number"
                                  value={editData.age}
                                  onChange={(e) =>
                                    onEditDataChange(
                                      "age",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="mx-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min="0"
                                  max="999"
                                  required
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-9 w-9 p-0"
                                  onClick={() => onAgeChange(true)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                              <Label htmlFor="gender">Gênero *</Label>
                              <Select
                                value={editData.gender || ""}
                                onValueChange={(value) =>
                                  onEditDataChange("gender", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o gênero" />
                                </SelectTrigger>
                                <SelectContent>
                                  {genders.map((gender) => {
                                    const GenderIcon = gender.icon;
                                    return (
                                      <SelectItem
                                        key={gender.value}
                                        value={gender.value}
                                      >
                                        <div className="flex items-center gap-2">
                                          <GenderIcon className="w-4 h-4" />
                                          <span>{gender.label}</span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Role */}
                            <div className="space-y-2">
                              <Label htmlFor="role">Papel *</Label>
                              <div className="grid grid-cols-2 gap-2">
                                {roles.map((role) => {
                                  const RoleIcon = role.icon;
                                  return (
                                    <div
                                      key={role.value}
                                      className={`cursor-pointer p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                        editData.role === role.value
                                          ? "border-primary bg-primary/10"
                                          : "border-muted hover:border-primary/50"
                                      }`}
                                      onClick={() =>
                                        onEditDataChange("role", role.value)
                                      }
                                    >
                                      <div className="text-center space-y-1">
                                        <RoleIcon className="w-5 h-5 mx-auto" />
                                        <div className="text-xs font-medium">
                                          {role.label}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Alignment */}
                            <div className="space-y-2">
                              <Label htmlFor="alignment">Alinhamento *</Label>
                              <div className="space-y-2">
                                {alignments.map((alignment) => {
                                  const AlignmentIcon = alignment.icon;
                                  return (
                                    <div
                                      key={alignment.value}
                                      className={`cursor-pointer p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                                        editData.alignment === alignment.value
                                          ? "border-primary bg-primary/10"
                                          : "border-muted hover:border-primary/50"
                                      }`}
                                      onClick={() =>
                                        onEditDataChange(
                                          "alignment",
                                          alignment.value
                                        )
                                      }
                                    >
                                      <div className="flex items-center gap-2">
                                        <AlignmentIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                          {alignment.label}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <Label htmlFor="description">
                              Descrição Básica *
                            </Label>
                            <Textarea
                              id="description"
                              value={editData.description}
                              onChange={(e) =>
                                onEditDataChange("description", e.target.value)
                              }
                              placeholder="Descrição do personagem"
                              className="min-h-[80px]"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-6">
                        <Avatar className="w-24 h-24 aspect-square">
                          <AvatarImage
                            src={character.image}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-xl">
                            {character.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-3xl font-bold">
                              {character.name}
                            </h2>
                            <Badge className={currentRole?.color}>
                              <RoleIcon className="w-4 h-4 mr-1" />
                              {currentRole?.label}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{character.age} anos</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const GenderIcon = currentGender?.icon;
                                return GenderIcon ? (
                                  <GenderIcon className="w-4 h-4" />
                                ) : null;
                              })()}
                              <span>{currentGender?.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`${currentAlignment?.bgColor} ${
                                  currentAlignment?.color
                                }`}
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {currentAlignment?.label}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-foreground text-base">
                            {character.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Physical Appearance Card */}
              {character.appearance && (
                <Card className="card-magical">
                  <CardHeader>
                    <CardTitle>Aparência Física</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label htmlFor="appearance">Aparência Física</Label>
                        <Textarea
                          id="appearance"
                          value={editData.appearance}
                          onChange={(e) =>
                            onEditDataChange("appearance", e.target.value)
                          }
                          placeholder="Descrição da aparência física"
                          className="min-h-[100px]"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {character.appearance}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Personality Card */}
              {character.personality && (
                <Card className="card-magical">
                  <CardHeader>
                    <CardTitle>Personalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label htmlFor="personality">Personalidade</Label>
                        <Textarea
                          id="personality"
                          value={editData.personality}
                          onChange={(e) =>
                            onEditDataChange("personality", e.target.value)
                          }
                          placeholder="Descrição da personalidade"
                          className="min-h-[100px]"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {character.personality}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Birth Place Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>Local de Nascimento</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="birthPlace">Local de Nascimento</Label>
                      <Select
                        value={editData.birthPlace || "none"}
                        onValueChange={(value) =>
                          onEditDataChange(
                            "birthPlace",
                            value === "none" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o local de nascimento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {mockLocations.map((location) => (
                            <SelectItem key={location.id} value={location.name}>
                              {location.name} ({location.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{character.birthPlace || "Não definido"}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chapter Mentions Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>Aparições na História</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {character.chapterMentions || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Capítulos mencionado
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <BookOpen className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-sm font-medium">
                          Primeira aparição
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {character.firstAppearance || "N/A"}
                        </div>
                      </div>

                      <div className="text-center p-3 border rounded-lg">
                        <BookOpen className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-sm font-medium">
                          Última aparição
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {character.lastAppearance || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Family Relations Card - Only show family tree button in view mode */}
              {!isEditing && (
                <Card className="card-magical">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Relações Familiares</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onNavigateToFamilyTree}
                      >
                        <TreePine className="w-4 h-4 mr-2" />
                        Ver Árvore
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Direct Family */}
                    {(character.family.father ||
                      character.family.mother ||
                      character.family.spouse) && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Família Direta
                        </h4>
                        <div className="space-y-2">
                          {character.family.father && (
                            <div className="flex items-center gap-2 text-sm">
                              <Heart className="w-3 h-3 text-blue-500" />
                              <span className="text-muted-foreground">
                                Pai:
                              </span>
                              <span>
                                {
                                  mockCharacters.find(
                                    (c) => c.id === character.family.father
                                  )?.name
                                }
                              </span>
                            </div>
                          )}
                          {character.family.mother && (
                            <div className="flex items-center gap-2 text-sm">
                              <Heart className="w-3 h-3 text-pink-500" />
                              <span className="text-muted-foreground">
                                Mãe:
                              </span>
                              <span>
                                {
                                  mockCharacters.find(
                                    (c) => c.id === character.family.mother
                                  )?.name
                                }
                              </span>
                            </div>
                          )}
                          {character.family.spouse && (
                            <div className="flex items-center gap-2 text-sm">
                              <Heart className="w-3 h-3 text-red-500" />
                              <span className="text-muted-foreground">
                                Cônjuge:
                              </span>
                              <span>
                                {
                                  mockCharacters.find(
                                    (c) => c.id === character.family.spouse
                                  )?.name
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Children */}
                    {character.family.children.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Filhos</h4>
                        <div className="flex flex-wrap gap-1">
                          {character.family.children.map((childId: string) => {
                            const child = mockCharacters.find(
                              (c) => c.id === childId
                            );
                            return child ? (
                              <Badge
                                key={childId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {child.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Siblings */}
                    {(character.family.siblings.length > 0 ||
                      character.family.halfSiblings.length > 0) && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Irmãos</h4>
                        <div className="space-y-2">
                          {character.family.siblings.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Irmãos:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {character.family.siblings.map(
                                  (siblingId: string) => {
                                    const sibling = mockCharacters.find(
                                      (c) => c.id === siblingId
                                    );
                                    return sibling ? (
                                      <Badge
                                        key={siblingId}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {sibling.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          )}
                          {character.family.halfSiblings.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Meio-irmãos:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {character.family.halfSiblings.map(
                                  (halfSiblingId: string) => {
                                    const halfSibling = mockCharacters.find(
                                      (c) => c.id === halfSiblingId
                                    );
                                    return halfSibling ? (
                                      <Badge
                                        key={halfSiblingId}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {halfSibling.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Extended Family */}
                    {(character.family.grandparents.length > 0 ||
                      character.family.unclesAunts.length > 0 ||
                      character.family.cousins.length > 0) && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Família Extendida
                        </h4>
                        <div className="space-y-2">
                          {character.family.grandparents.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Avós:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {character.family.grandparents.map(
                                  (grandparentId: string) => {
                                    const grandparent = mockCharacters.find(
                                      (c) => c.id === grandparentId
                                    );
                                    return grandparent ? (
                                      <Badge
                                        key={grandparentId}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {grandparent.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          )}
                          {character.family.unclesAunts.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Tios:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {character.family.unclesAunts.map(
                                  (uncleAuntId: string) => {
                                    const uncleAunt = mockCharacters.find(
                                      (c) => c.id === uncleAuntId
                                    );
                                    return uncleAunt ? (
                                      <Badge
                                        key={uncleAuntId}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {uncleAunt.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          )}
                          {character.family.cousins.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground">
                                Primos:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {character.family.cousins.map(
                                  (cousinId: string) => {
                                    const cousin = mockCharacters.find(
                                      (c) => c.id === cousinId
                                    );
                                    return cousin ? (
                                      <Badge
                                        key={cousinId}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {cousin.name}
                                      </Badge>
                                    ) : null;
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!character.family.father &&
                      !character.family.mother &&
                      !character.family.spouse &&
                      character.family.children.length === 0 &&
                      character.family.siblings.length === 0 &&
                      character.family.halfSiblings.length === 0 &&
                      character.family.grandparents.length === 0 &&
                      character.family.unclesAunts.length === 0 &&
                      character.family.cousins.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-4">
                          <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Nenhuma relação familiar definida</p>
                          <p className="text-xs">
                            Use o modo de edição para adicionar familiares
                          </p>
                        </div>
                      )}
                  </CardContent>
                </Card>
              )}

              {/* Family Relations Edit Card - Only show in edit mode */}
              {isEditing && (
                <Card className="card-magical">
                  <CardHeader>
                    <CardTitle>Editar Relações Familiares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Single-value relations */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {familyRelations.single.map((relation) => (
                          <div key={relation.value} className="space-y-2">
                            <Label className="text-sm">{relation.label}</Label>
                            <Select
                              value={
                                relation.value === "father"
                                  ? editData.family.father || "none"
                                  : relation.value === "mother"
                                    ? editData.family.mother || "none"
                                    : relation.value === "spouse"
                                      ? editData.family.spouse || "none"
                                      : "none"
                              }
                              onValueChange={(value) =>
                                onFamilyRelationChange(
                                  relation.value,
                                  value === "none" ? null : value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Selecione ${relation.label.toLowerCase()}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Nenhum</SelectItem>
                                {mockCharacters
                                  .filter((char) => char.id !== editData.id)
                                  .map((char) => (
                                    <SelectItem key={char.id} value={char.id}>
                                      {char.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>

                      {/* Multi-select relations */}
                      <div className="space-y-4">
                        {familyRelations.multiple.map((relation) => {
                          const currentRelations =
                            editData.family[
                              relation.value === "child"
                                ? "children"
                                : relation.value === "sibling"
                                  ? "siblings"
                                  : relation.value === "halfSibling"
                                    ? "halfSiblings"
                                    : relation.value === "uncleAunt"
                                      ? "unclesAunts"
                                      : "cousins"
                            ];

                          return (
                            <div key={relation.value} className="space-y-2">
                              <Label className="text-sm">
                                {relation.label}s
                              </Label>
                              <Select
                                onValueChange={(value) =>
                                  onFamilyRelationChange(
                                    relation.value,
                                    value === "none" ? null : value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={`Adicionar ${relation.label.toLowerCase()}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">
                                    Selecione
                                  </SelectItem>
                                  {mockCharacters
                                    .filter(
                                      (char) =>
                                        char.id !== editData.id &&
                                        !currentRelations.includes(char.id)
                                    )
                                    .map((char) => (
                                      <SelectItem key={char.id} value={char.id}>
                                        {char.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>

                              {/* Display current relations */}
                              {currentRelations.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {currentRelations.map(
                                    (relationId: string) => {
                                      const relatedChar = mockCharacters.find(
                                        (c) => c.id === relationId
                                      );
                                      return relatedChar ? (
                                        <Badge
                                          key={relationId}
                                          variant="secondary"
                                          className="flex items-center gap-1"
                                        >
                                          {relatedChar.name}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              onFamilyRelationChange(
                                                relation.value,
                                                relationId
                                              )
                                            }
                                            className="ml-1 hover:text-destructive"
                                          >
                                            ×
                                          </button>
                                        </Badge>
                                      ) : null;
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Relationships Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>Relacionamentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Add Relationship Form */}
                      <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                        <h4 className="font-semibold text-sm">
                          Adicionar Relacionamento
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-2">
                            <Label>Personagem</Label>
                            <Select
                              value={selectedRelationshipCharacter}
                              onValueChange={onRelationshipCharacterChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um personagem" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockCharacters
                                  .filter((char) => char.id !== character.id)
                                  .filter(
                                    (char) =>
                                      !editData.relationships?.some(
                                        (rel) => rel.characterId === char.id
                                      )
                                  )
                                  .map((char) => (
                                    <SelectItem key={char.id} value={char.id}>
                                      {char.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Tipo de Relacionamento</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-background">
                              {relationshipTypes.map((type) => (
                                <div
                                  key={type.value}
                                  className={`cursor-pointer p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                    selectedRelationshipType === type.value
                                      ? "border-primary bg-primary/10"
                                      : "border-muted hover:border-primary/50"
                                  }`}
                                  onClick={() =>
                                    onRelationshipTypeChange(type.value)
                                  }
                                >
                                  <div className="text-center space-y-1">
                                    <div className="text-2xl">{type.emoji}</div>
                                    <div className="text-xs font-medium">
                                      {type.label}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>
                              Intensidade: {relationshipIntensity[0]}%
                            </Label>
                            <Slider
                              value={relationshipIntensity}
                              onValueChange={onRelationshipIntensityChange}
                              max={100}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <Button
                            onClick={onRelationshipAdd}
                            disabled={
                              !selectedRelationshipCharacter ||
                              !selectedRelationshipType
                            }
                            size="sm"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Adicionar
                          </Button>
                        </div>
                      </div>

                      {/* Current Relationships List */}
                      {editData.relationships &&
                        editData.relationships.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">
                              Relacionamentos Atuais
                            </h4>
                            {editData.relationships.map((relationship) => {
                              const relatedChar = mockCharacters.find(
                                (c) => c.id === relationship.characterId
                              );
                              const typeData = getRelationshipTypeData(
                                relationship.type
                              );

                              return relatedChar ? (
                                <div
                                  key={relationship.id}
                                  className="p-3 border rounded-lg space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">
                                        {typeData.emoji}
                                      </span>
                                      <span className="font-medium text-sm">
                                        {relatedChar.name}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={typeData.color}
                                      >
                                        {typeData.label}
                                      </Badge>
                                    </div>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        onRelationshipRemove(relationship.id)
                                      }
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">
                                      Intensidade: {relationship.intensity}%
                                    </Label>
                                    <Slider
                                      value={[relationship.intensity]}
                                      onValueChange={(value) =>
                                        onRelationshipIntensityUpdate(
                                          relationship.id,
                                          value[0]
                                        )
                                      }
                                      max={100}
                                      min={1}
                                      step={1}
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {character.relationships &&
                      character.relationships.length > 0 ? (
                        character.relationships.map((relationship) => {
                          const relatedChar = mockCharacters.find(
                            (c) => c.id === relationship.characterId
                          );
                          const typeData = getRelationshipTypeData(
                            relationship.type
                          );

                          return relatedChar ? (
                            <div
                              key={relationship.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">
                                  {typeData.emoji}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                      {relatedChar.name}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={typeData.color}
                                    >
                                      {typeData.label}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Intensidade: {relationship.intensity}%
                                  </div>
                                </div>
                              </div>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{
                                    width: `${relationship.intensity}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ) : null;
                        })
                      ) : (
                        <div className="text-center text-muted-foreground text-sm py-4">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Nenhum relacionamento definido</p>
                          <p className="text-xs">
                            Use o modo de edição para adicionar relacionamentos
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Qualities */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>Qualidades</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Add Quality Input */}
                      <div className="flex gap-2">
                        <Input
                          value={newQuality}
                          onChange={(e) => onNewQualityChange(e.target.value)}
                          placeholder="Adicionar nova qualidade"
                          onKeyPress={(e) =>
                            e.key === "Enter" && onQualityAdd()
                          }
                        />
                        <Button size="sm" onClick={onQualityAdd}>
                          Adicionar
                        </Button>
                      </div>

                      {/* Quality List */}
                      <div className="flex flex-wrap gap-2">
                        {editData.qualities.map((quality) => (
                          <Badge
                            key={quality}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => onQualityRemove(quality)}
                          >
                            {quality} ×
                          </Badge>
                        ))}
                      </div>

                      {editData.qualities.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Nenhuma qualidade adicionada. Clique em "Adicionar"
                          para incluir qualidades.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {character.qualities.map((quality) => (
                        <Badge key={quality} variant="secondary">
                          {quality}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Organization */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>Organização</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Select
                      value={editData.organization}
                      onValueChange={(value) =>
                        onEditDataChange(
                          "organization",
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
                  ) : (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {character.organization || "Nenhuma organização"}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <ConfirmDeleteModal
            open={showDeleteModal}
            onClose={onDeleteModalClose}
            onConfirm={onDelete}
            title="Excluir Personagem"
            description={`O personagem "${character.name}" será permanentemente removido.`}
            itemName={character.name}
            itemType="personagem"
          />

          <LinkedNotesModal
            isOpen={isLinkedNotesModalOpen}
            onClose={onLinkedNotesModalClose}
            entityId={character.id}
            entityName={character.name}
            entityType="character"
            linkedNotes={linkedNotes}
          />
        </div>
      </div>
    </div>
  );
}
