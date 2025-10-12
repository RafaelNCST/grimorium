import React from "react";

import {
  ArrowLeft,
  Edit2,
  Trash2,
  Menu,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Upload,
  Calendar,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { CharacterNavigationSidebar } from "@/components/character-navigation-sidebar";
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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { type IAlignment } from "./constants/alignments-constant";
import { type IGender } from "./constants/genders-constant";
import { type IRelationshipType } from "./constants/relationship-types-constant";
import { type IRole } from "./constants/roles-constant";
import { PHYSICAL_TYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/physical-types";
import { CHARACTER_ARCHETYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-archetypes";
import { AlignmentMatrix } from "./components/alignment-matrix";
import { RelationshipsSection } from "./components/relationships-section";
import { FamilySection } from "./components/family-section";
import { VersionManager } from "./components/version-manager";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import { type ICharacterVersion, type ICharacterFormData } from "@/types/character-types";

interface ICharacter {
  id: string;
  name: string;
  age: string;
  image: string;
  role: string;
  alignment: string;
  gender: string;
  description: string;

  // Appearance
  height?: string;
  weight?: string;
  skinTone?: string;
  physicalType?: string;
  hair?: string;
  eyes?: string;
  face?: string;
  distinguishingFeatures?: string;
  speciesAndRace?: string;

  // Behavior
  archetype?: string;
  personality?: string;
  hobbies?: string;
  dreamsAndGoals?: string;
  fearsAndTraumas?: string;
  favoriteFood?: string;
  favoriteMusic?: string;

  // Locations
  birthPlace?: string;
  affiliatedPlace?: string;
  organization?: string;

  // Relations
  family: {
    father: string | null;
    mother: string | null;
    children: string[];
    siblings: string[];
    spouse: string | null;
    halfSiblings: string[];
    unclesAunts: string[];
    grandparents: string[];
    cousins: string[];
  };
  relationships?: Array<{
    id: string;
    characterId: string;
    type: string;
    intensity: number;
  }>;
}

interface IFieldVisibility {
  [key: string]: boolean;
}

interface CharacterDetailViewRefactoredProps {
  character: ICharacter;
  editData: ICharacter;
  isEditing: boolean;
  versions: ICharacterVersion[];
  currentVersion: ICharacterVersion | null;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  newQuality: string;
  imagePreview: string;
  selectedRelationshipCharacter: string;
  selectedRelationshipType: string;
  relationshipIntensity: number[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  mockCharacters: ICharacter[];
  mockLocations: Array<{ id: string; name: string }>;
  mockOrganizations: Array<{ id: string; name: string }>;
  roles: IRole[];
  alignments: IAlignment[];
  genders: IGender[];
  relationshipTypes: IRelationshipType[];
  currentRole: IRole | undefined;
  currentAlignment: IAlignment | undefined;
  currentGender: IGender | undefined;
  RoleIcon: LucideIcon;
  fieldVisibility: IFieldVisibility;
  advancedSectionOpen: boolean;
  onBack: () => void;
  onNavigationSidebarToggle: () => void;
  onNavigationSidebarClose: () => void;
  onCharacterSelect: (characterId: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onConfirmDelete: () => void;
  onVersionChange: (versionId: string | null) => void;
  onVersionCreate: (versionData: {
    name: string;
    description: string;
    characterData: ICharacterFormData;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
  onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAgeChange: (increment: boolean) => void;
  onEditDataChange: (field: string, value: unknown) => void;
  onRelationshipAdd: () => void;
  onRelationshipRemove: (relationshipId: string) => void;
  onRelationshipIntensityUpdate: (
    relationshipId: string,
    intensity: number
  ) => void;
  onRelationshipCharacterChange: (characterId: string) => void;
  onRelationshipTypeChange: (type: string) => void;
  onRelationshipIntensityChange: (intensity: number[]) => void;
  onFieldVisibilityToggle: (field: string) => void;
  onAdvancedSectionToggle: () => void;
  getRelationshipTypeData: (type: string) => IRelationshipType;
}

export function CharacterDetailViewRefactored({
  character,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  selectedRelationshipCharacter,
  selectedRelationshipType,
  relationshipIntensity,
  fileInputRef,
  mockCharacters,
  mockLocations,
  mockOrganizations,
  roles,
  alignments,
  genders,
  relationshipTypes,
  currentRole,
  currentAlignment,
  currentGender,
  RoleIcon,
  fieldVisibility,
  advancedSectionOpen,
  onBack,
  onNavigationSidebarToggle,
  onNavigationSidebarClose,
  onCharacterSelect,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onConfirmDelete,
  onVersionChange,
  onVersionCreate,
  onVersionDelete,
  onVersionUpdate,
  onImageFileChange,
  onAgeChange,
  onEditDataChange,
  onRelationshipAdd,
  onRelationshipRemove,
  onRelationshipIntensityUpdate,
  onRelationshipCharacterChange,
  onRelationshipTypeChange,
  onRelationshipIntensityChange,
  onFieldVisibilityToggle,
  onAdvancedSectionToggle,
  getRelationshipTypeData,
}: CharacterDetailViewRefactoredProps) {
  const { t } = useTranslation(["character-detail", "create-character"]);

  // Helper component for field wrapper with visibility toggle
  const FieldWrapper = ({
    fieldName,
    label,
    children,
    isOptional = true,
  }: {
    fieldName: string;
    label: string;
    children: React.ReactNode;
    isOptional?: boolean;
  }) => {
    const isVisible = fieldVisibility[fieldName] !== false;

    return (
      <div
        className={`space-y-2 ${!isVisible && !isEditing ? "hidden" : ""}`}
      >
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {label} {!isOptional && "*"}
          </Label>
          {isEditing && isOptional && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onFieldVisibilityToggle(fieldName)}
              className="h-6 w-6 p-0"
            >
              {isVisible ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
        {children}
      </div>
    );
  };

  // Helper component for empty state
  const EmptyFieldState = ({ hint }: { hint?: string }) => (
    <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
      <p>{t("character-detail:empty_states.no_data")}</p>
      {hint && (
        <p className="text-xs mt-1">
          {hint || t("character-detail:empty_states.no_data_hint")}
        </p>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <CharacterNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        characters={mockCharacters.map((char) => ({
          id: char.id,
          name: char.name,
          image: char.image,
        }))}
        currentCharacterId={character.id}
        onCharacterSelect={onCharacterSelect}
      />

      <div className="w-full overflow-hidden">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("character-detail:header.back")}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNavigationSidebarToggle}
                  className="hover:bg-muted"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={onCancel}>
                      {t("character-detail:header.cancel")}
                    </Button>
                    <Button variant="magical" onClick={onSave}>
                      {t("character-detail:header.save")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="icon" onClick={onEdit}>
                      <Edit2 className="w-4 h-4" />
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Basic Information Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>
                    {t("character-detail:sections.basic_info")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="flex gap-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label>{t("character-detail:fields.image")}</Label>
                          <div
                            className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                          >
                            {imagePreview ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                  <Upload className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                                <p className="text-xs text-muted-foreground">
                                  Clique
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

                        {/* Name, Age, Gender, Role */}
                        <div className="flex-1 space-y-4">
                          <FieldWrapper
                            fieldName="name"
                            label={t("character-detail:fields.name")}
                            isOptional={false}
                          >
                            <Input
                              value={editData.name}
                              onChange={(e) =>
                                onEditDataChange("name", e.target.value)
                              }
                              placeholder={t("character-detail:fields.name")}
                              required
                            />
                          </FieldWrapper>

                          <div className="grid grid-cols-2 gap-4">
                            <FieldWrapper
                              fieldName="age"
                              label={t("character-detail:fields.age")}
                              isOptional={false}
                            >
                              <div className="flex items-center">
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
                                  type="text"
                                  value={editData.age}
                                  onChange={(e) =>
                                    onEditDataChange("age", e.target.value)
                                  }
                                  className="mx-1 text-center"
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
                            </FieldWrapper>

                            <FieldWrapper
                              fieldName="gender"
                              label={t("character-detail:fields.gender")}
                              isOptional={false}
                            >
                              <Select
                                value={editData.gender || ""}
                                onValueChange={(value) =>
                                  onEditDataChange("gender", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "character-detail:fields.gender"
                                    )}
                                  />
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
                                          <span>
                                            {t(
                                              `create-character:gender.${gender.value}`
                                            )}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </FieldWrapper>
                          </div>

                          <FieldWrapper
                            fieldName="role"
                            label={t("character-detail:fields.role")}
                            isOptional={false}
                          >
                            <div className="grid grid-cols-3 gap-2">
                              {roles.map((role) => {
                                const RoleIcon = role.icon;
                                return (
                                  <div
                                    key={role.value}
                                    className={`cursor-pointer p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                                      editData.role === role.value
                                        ? "border-primary bg-primary/10"
                                        : "border-muted hover:border-primary/50"
                                    }`}
                                    onClick={() =>
                                      onEditDataChange("role", role.value)
                                    }
                                    role="button"
                                    tabIndex={0}
                                  >
                                    <div className="text-center space-y-1">
                                      <RoleIcon className="w-4 h-4 mx-auto" />
                                      <div className="text-xs font-medium">
                                        {t(
                                          `create-character:role.${role.value}`
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </FieldWrapper>
                        </div>
                      </div>

                      <FieldWrapper
                        fieldName="description"
                        label={t("character-detail:fields.description")}
                        isOptional={false}
                      >
                        <Textarea
                          value={editData.description}
                          onChange={(e) =>
                            onEditDataChange("description", e.target.value)
                          }
                          placeholder={t("character-detail:fields.description")}
                          rows={4}
                          className="resize-none"
                          required
                        />
                      </FieldWrapper>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-6">
                        <Avatar className="w-24 h-24">
                          <AvatarImage
                            src={character.image}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-xl">
                            {character.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-3xl font-bold">
                              {character.name}
                            </h2>
                            <Badge className={currentRole?.color}>
                              <RoleIcon className="w-4 h-4 mr-1" />
                              {t(`create-character:role.${character.role}`)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {character.age}{" "}
                                {t("create-character:modal.age_placeholder")}
                              </span>
                            </div>
                            {currentGender && (
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const GenderIcon = currentGender.icon;
                                  return <GenderIcon className="w-4 h-4" />;
                                })()}
                                <span>
                                  {t(
                                    `create-character:gender.${character.gender}`
                                  )}
                                </span>
                              </div>
                            )}
                            {currentAlignment && (
                              <Badge
                                variant="secondary"
                                className={`${currentAlignment.bgColor} ${currentAlignment.color}`}
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {t(
                                  `create-character:alignment.${character.alignment}`
                                )}
                              </Badge>
                            )}
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

              {/* Advanced Section - Collapsible */}
              <Collapsible
                open={advancedSectionOpen}
                onOpenChange={onAdvancedSectionToggle}
              >
                <Card className="card-magical">
                  <CardHeader>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer">
                        <CardTitle>
                          {t("character-detail:sections.advanced_info")}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          {advancedSectionOpen ? t("character-detail:actions.close") : t("character-detail:actions.open")}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      {/* Appearance Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("character-detail:sections.appearance")}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FieldWrapper
                            fieldName="height"
                            label={t("character-detail:fields.height")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.height || ""}
                                onChange={(e) =>
                                  onEditDataChange("height", e.target.value)
                                }
                                placeholder={t("create-character:modal.height_placeholder")}
                              />
                            ) : character.height ? (
                              <p className="text-sm">{character.height}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="weight"
                            label={t("character-detail:fields.weight")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.weight || ""}
                                onChange={(e) =>
                                  onEditDataChange("weight", e.target.value)
                                }
                                placeholder={t("create-character:modal.weight_placeholder")}
                              />
                            ) : character.weight ? (
                              <p className="text-sm">{character.weight}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="skinTone"
                            label={t("character-detail:fields.skin_tone")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.skinTone || ""}
                                onChange={(e) =>
                                  onEditDataChange("skinTone", e.target.value)
                                }
                                placeholder={t("character-detail:fields.skin_tone")}
                              />
                            ) : character.skinTone ? (
                              <p className="text-sm">{character.skinTone}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="physicalType"
                            label={t("character-detail:fields.physical_type")}
                          >
                            {isEditing ? (
                              <Select
                                value={editData.physicalType || ""}
                                onValueChange={(value) =>
                                  onEditDataChange("physicalType", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "character-detail:fields.physical_type"
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {PHYSICAL_TYPES_CONSTANT.map((type) => {
                                    const TypeIcon = type.icon;
                                    return (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        <div className="flex items-center gap-2">
                                          <TypeIcon className="w-4 h-4" />
                                          <span>
                                            {t(
                                              `create-character:${type.translationKey}`
                                            )}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            ) : character.physicalType ? (
                              <p className="text-sm">
                                {(() => {
                                  const type = PHYSICAL_TYPES_CONSTANT.find(
                                    (t) => t.value === character.physicalType
                                  );
                                  return type
                                    ? t(
                                        `create-character:${type.translationKey}`
                                      )
                                    : character.physicalType;
                                })()}
                              </p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="hair"
                            label={t("character-detail:fields.hair")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.hair || ""}
                                onChange={(e) =>
                                  onEditDataChange("hair", e.target.value)
                                }
                                placeholder={t("character-detail:fields.hair")}
                              />
                            ) : character.hair ? (
                              <p className="text-sm">{character.hair}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="eyes"
                            label={t("character-detail:fields.eyes")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.eyes || ""}
                                onChange={(e) =>
                                  onEditDataChange("eyes", e.target.value)
                                }
                                placeholder={t("character-detail:fields.eyes")}
                              />
                            ) : character.eyes ? (
                              <p className="text-sm">{character.eyes}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="face"
                            label={t("character-detail:fields.face")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.face || ""}
                                onChange={(e) =>
                                  onEditDataChange("face", e.target.value)
                                }
                                placeholder={t("character-detail:fields.face")}
                              />
                            ) : character.face ? (
                              <p className="text-sm">{character.face}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="speciesAndRace"
                            label={t("character-detail:fields.species_and_race")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.speciesAndRace || ""}
                                onChange={(e) =>
                                  onEditDataChange("speciesAndRace", e.target.value)
                                }
                                placeholder={t("character-detail:fields.species_and_race")}
                              />
                            ) : character.speciesAndRace ? (
                              <p className="text-sm">{character.speciesAndRace}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>
                        </div>

                        <FieldWrapper
                          fieldName="distinguishingFeatures"
                          label={t("character-detail:fields.distinguishing_features")}
                        >
                          {isEditing ? (
                            <Textarea
                              value={editData.distinguishingFeatures || ""}
                              onChange={(e) =>
                                onEditDataChange("distinguishingFeatures", e.target.value)
                              }
                              placeholder={t("character-detail:fields.distinguishing_features")}
                              rows={3}
                              className="resize-none"
                            />
                          ) : character.distinguishingFeatures ? (
                            <p className="text-sm whitespace-pre-wrap">{character.distinguishingFeatures}</p>
                          ) : (
                            <EmptyFieldState />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* Behavior Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("character-detail:sections.behavior")}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FieldWrapper
                            fieldName="archetype"
                            label={t("character-detail:fields.archetype")}
                          >
                            {isEditing ? (
                              <Select
                                value={editData.archetype || ""}
                                onValueChange={(value) =>
                                  onEditDataChange("archetype", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t(
                                      "character-detail:fields.archetype"
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {CHARACTER_ARCHETYPES_CONSTANT.map((archetype) => {
                                    const ArchetypeIcon = archetype.icon;
                                    return (
                                      <SelectItem
                                        key={archetype.value}
                                        value={archetype.value}
                                      >
                                        <div className="flex items-center gap-2">
                                          <ArchetypeIcon className="w-4 h-4" />
                                          <span>
                                            {t(
                                              `create-character:${archetype.translationKey}`
                                            )}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            ) : character.archetype ? (
                              <p className="text-sm">
                                {(() => {
                                  const archetype = CHARACTER_ARCHETYPES_CONSTANT.find(
                                    (a) => a.value === character.archetype
                                  );
                                  return archetype
                                    ? t(
                                        `create-character:${archetype.translationKey}`
                                      )
                                    : character.archetype;
                                })()}
                              </p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="favoriteFood"
                            label={t("character-detail:fields.favorite_food")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.favoriteFood || ""}
                                onChange={(e) =>
                                  onEditDataChange("favoriteFood", e.target.value)
                                }
                                placeholder={t("character-detail:fields.favorite_food")}
                              />
                            ) : character.favoriteFood ? (
                              <p className="text-sm">{character.favoriteFood}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="favoriteMusic"
                            label={t("character-detail:fields.favorite_music")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.favoriteMusic || ""}
                                onChange={(e) =>
                                  onEditDataChange("favoriteMusic", e.target.value)
                                }
                                placeholder={t("character-detail:fields.favorite_music")}
                              />
                            ) : character.favoriteMusic ? (
                              <p className="text-sm">{character.favoriteMusic}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>
                        </div>

                        <FieldWrapper
                          fieldName="personality"
                          label={t("character-detail:fields.personality")}
                        >
                          {isEditing ? (
                            <Textarea
                              value={editData.personality || ""}
                              onChange={(e) =>
                                onEditDataChange("personality", e.target.value)
                              }
                              placeholder={t("character-detail:fields.personality")}
                              rows={3}
                              className="resize-none"
                            />
                          ) : character.personality ? (
                            <p className="text-sm whitespace-pre-wrap">{character.personality}</p>
                          ) : (
                            <EmptyFieldState />
                          )}
                        </FieldWrapper>

                        <FieldWrapper
                          fieldName="hobbies"
                          label={t("character-detail:fields.hobbies")}
                        >
                          {isEditing ? (
                            <Textarea
                              value={editData.hobbies || ""}
                              onChange={(e) =>
                                onEditDataChange("hobbies", e.target.value)
                              }
                              placeholder={t("character-detail:fields.hobbies")}
                              rows={3}
                              className="resize-none"
                            />
                          ) : character.hobbies ? (
                            <p className="text-sm whitespace-pre-wrap">{character.hobbies}</p>
                          ) : (
                            <EmptyFieldState />
                          )}
                        </FieldWrapper>

                        <FieldWrapper
                          fieldName="dreamsAndGoals"
                          label={t("character-detail:fields.dreams_and_goals")}
                        >
                          {isEditing ? (
                            <Textarea
                              value={editData.dreamsAndGoals || ""}
                              onChange={(e) =>
                                onEditDataChange("dreamsAndGoals", e.target.value)
                              }
                              placeholder={t("character-detail:fields.dreams_and_goals")}
                              rows={3}
                              className="resize-none"
                            />
                          ) : character.dreamsAndGoals ? (
                            <p className="text-sm whitespace-pre-wrap">{character.dreamsAndGoals}</p>
                          ) : (
                            <EmptyFieldState />
                          )}
                        </FieldWrapper>

                        <FieldWrapper
                          fieldName="fearsAndTraumas"
                          label={t("character-detail:fields.fears_and_traumas")}
                        >
                          {isEditing ? (
                            <Textarea
                              value={editData.fearsAndTraumas || ""}
                              onChange={(e) =>
                                onEditDataChange("fearsAndTraumas", e.target.value)
                              }
                              placeholder={t("character-detail:fields.fears_and_traumas")}
                              rows={3}
                              className="resize-none"
                            />
                          ) : character.fearsAndTraumas ? (
                            <p className="text-sm whitespace-pre-wrap">{character.fearsAndTraumas}</p>
                          ) : (
                            <EmptyFieldState />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* Alignment Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("character-detail:sections.alignment")}
                        </h4>

                        <FieldWrapper
                          fieldName="alignment"
                          label={t("character-detail:fields.alignment")}
                        >
                          <AlignmentMatrix
                            value={isEditing ? editData.alignment : character.alignment}
                            onChange={(value) => onEditDataChange("alignment", value)}
                            isEditable={isEditing}
                          />
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* Locations and Organizations */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("character-detail:sections.locations_orgs")}
                        </h4>

                        <div className="grid grid-cols-1 gap-4">
                          <FieldWrapper
                            fieldName="birthPlace"
                            label={t("character-detail:fields.birth_place")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.birthPlace || ""}
                                onChange={(e) =>
                                  onEditDataChange("birthPlace", e.target.value)
                                }
                                placeholder={t("character-detail:fields.birth_place")}
                              />
                            ) : character.birthPlace ? (
                              <p className="text-sm">{character.birthPlace}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="affiliatedPlace"
                            label={t("character-detail:fields.affiliated_place")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.affiliatedPlace || ""}
                                onChange={(e) =>
                                  onEditDataChange("affiliatedPlace", e.target.value)
                                }
                                placeholder={t("character-detail:fields.affiliated_place")}
                              />
                            ) : character.affiliatedPlace ? (
                              <p className="text-sm">{character.affiliatedPlace}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="organization"
                            label={t("character-detail:fields.organization")}
                          >
                            {isEditing ? (
                              <Input
                                value={editData.organization || ""}
                                onChange={(e) =>
                                  onEditDataChange("organization", e.target.value)
                                }
                                placeholder={t("character-detail:fields.organization")}
                              />
                            ) : character.organization ? (
                              <p className="text-sm">{character.organization}</p>
                            ) : (
                              <EmptyFieldState />
                            )}
                          </FieldWrapper>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Relationships Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>
                    {t("character-detail:sections.relationships")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RelationshipsSection
                    relationships={isEditing ? editData.relationships || [] : character.relationships || []}
                    allCharacters={mockCharacters}
                    currentCharacterId={character.id}
                    isEditMode={isEditing}
                    onRelationshipsChange={(relationships) =>
                      onEditDataChange("relationships", relationships)
                    }
                  />
                </CardContent>
              </Card>

              {/* Family Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>
                    {t("character-detail:sections.family")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FamilySection
                    family={(isEditing ? editData.family : character.family) || {
                      father: null,
                      mother: null,
                      spouse: null,
                      children: [],
                      siblings: [],
                      halfSiblings: [],
                      grandparents: [],
                      unclesAunts: [],
                      cousins: [],
                    }}
                    allCharacters={mockCharacters}
                    currentCharacterId={character.id}
                    isEditMode={isEditing}
                    onFamilyChange={(family) => onEditDataChange("family", family)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Versions - 1 column */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="card-magical sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base">
                    {t("character-detail:sections.versions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[600px]">
                  <VersionManager
                    versions={versions}
                    currentVersion={currentVersion}
                    onVersionChange={onVersionChange}
                    onVersionCreate={onVersionCreate}
                    onVersionDelete={onVersionDelete}
                    isEditMode={isEditing}
                    mainCharacterData={character}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        characterName={character.name}
        currentVersion={currentVersion}
        versionName={currentVersion?.name}
        totalVersions={versions.length}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  );
}
