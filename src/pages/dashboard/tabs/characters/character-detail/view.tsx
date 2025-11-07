import React from "react";

import {
  ArrowLeft,
  Edit2,
  Trash2,
  Menu,
  Eye,
  EyeOff,
  Upload,
  Calendar,
  Shield,
  Sparkles,
  Info,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { CharacterNavigationSidebar } from "@/components/character-navigation-sidebar";
import { CHARACTER_ARCHETYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-archetypes";
import { type ICharacterRole } from "@/components/modals/create-character-modal/constants/character-roles";
import { type IGender as IGenderModal } from "@/components/modals/create-character-modal/constants/genders";
import { PHYSICAL_TYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/physical-types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  type ICharacterVersion,
  type ICharacterFormData,
} from "@/types/character-types";

import { AlignmentMatrix } from "./components/alignment-matrix";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import { FamilySection } from "./components/family-section";
import { RelationshipsSection } from "./components/relationships-section";
import { VersionManager } from "./components/version-manager";
import { type IAlignment } from "./constants/alignments-constant";
import { type IRelationshipType } from "./constants/relationship-types-constant";
import { PowerLinkCard } from "@/pages/dashboard/tabs/power-system/components/power-link-card";
import { EditPowerLinkModal } from "@/pages/dashboard/tabs/power-system/components/edit-power-link-modal";
import type { IPowerCharacterLink } from "@/pages/dashboard/tabs/power-system/types/power-system-types";

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

interface CharacterDetailViewProps {
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
  mockFactions: Array<{ id: string; name: string }>;
  roles: ICharacterRole[];
  alignments: IAlignment[];
  genders: IGenderModal[];
  relationshipTypes: IRelationshipType[];
  currentRole: ICharacterRole | undefined;
  currentAlignment: IAlignment | undefined;
  currentGender: IGenderModal | undefined;
  RoleIcon: LucideIcon;
  fieldVisibility: IFieldVisibility;
  advancedSectionOpen: boolean;
  powerLinks: IPowerCharacterLink[];
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
  onNavigateToPowerInstance: (linkId: string) => void;
  onEditPowerLink: (link: IPowerCharacterLink) => void;
  onDeletePowerLink: (linkId: string) => void;
  isEditLinkModalOpen: boolean;
  selectedLinkForEdit: IPowerCharacterLink | null;
  onCloseEditLinkModal: () => void;
  onSavePowerLink: (linkId: string, customLabel: string) => Promise<void>;
}

// Helper component for field wrapper with visibility toggle
const FieldWrapper = ({
  fieldName,
  label,
  children,
  isOptional = true,
  fieldVisibility,
  isEditing,
  onFieldVisibilityToggle,
  t: _t,
}: {
  fieldName: string;
  label: string;
  children: React.ReactNode;
  isOptional?: boolean;
  fieldVisibility: IFieldVisibility;
  isEditing: boolean;
  onFieldVisibilityToggle: (field: string) => void;
  t: (_key: string) => string;
}) => {
  const isVisible = fieldVisibility[fieldName] !== false;

  return (
    <div
      className={`space-y-2 transition-all duration-200 ${
        !isVisible && !isEditing
          ? "hidden"
          : !isVisible && isEditing
            ? "opacity-50 bg-muted/30 p-3 rounded-lg border border-dashed border-muted-foreground/30"
            : ""
      }`}
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
const EmptyFieldState = ({
  hint,
  t,
}: {
  hint?: string;
  t: (key: string) => string;
}) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("character-detail:empty_states.no_data")}</p>
    {hint && (
      <p className="text-xs mt-1">
        {hint || t("character-detail:empty_states.no_data_hint")}
      </p>
    )}
  </div>
);

export function CharacterDetailView({
  character,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  selectedRelationshipCharacter: _selectedRelationshipCharacter,
  selectedRelationshipType: _selectedRelationshipType,
  relationshipIntensity: _relationshipIntensity,
  fileInputRef,
  mockCharacters,
  mockLocations,
  mockFactions,
  roles,
  alignments: _alignments,
  genders,
  relationshipTypes: _relationshipTypes,
  currentRole,
  currentAlignment,
  currentGender,
  RoleIcon,
  fieldVisibility,
  advancedSectionOpen,
  powerLinks,
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
  onVersionUpdate: _onVersionUpdate,
  onImageFileChange,
  onAgeChange: _onAgeChange,
  onEditDataChange,
  onRelationshipAdd: _onRelationshipAdd,
  onRelationshipRemove: _onRelationshipRemove,
  onRelationshipIntensityUpdate: _onRelationshipIntensityUpdate,
  onRelationshipCharacterChange: _onRelationshipCharacterChange,
  onRelationshipTypeChange: _onRelationshipTypeChange,
  onRelationshipIntensityChange: _onRelationshipIntensityChange,
  onFieldVisibilityToggle,
  onAdvancedSectionToggle,
  getRelationshipTypeData: _getRelationshipTypeData,
  onNavigateToPowerInstance,
  onEditPowerLink,
  onDeletePowerLink,
  isEditLinkModalOpen,
  selectedLinkForEdit,
  onCloseEditLinkModal,
  onSavePowerLink,
}: CharacterDetailViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t } = useTranslation(["character-detail", "create-character"] as any);

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
                {!isEditing && (
                  <>
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
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={onCancel}>
                      {t("character-detail:header.cancel")}
                    </Button>
                    <Button
                      variant="magical"
                      className="animate-glow"
                      onClick={onSave}
                    >
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
            <div
              className={`${isEditing ? "lg:col-span-4" : "lg:col-span-3"} space-y-6`}
            >
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
                            className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-full cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                          >
                            {imagePreview ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <Upload className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                                <p className="text-xs text-muted-foreground">
                                  {t("character-detail:upload.click")}
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
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            <Input
                              value={editData.name}
                              onChange={(e) =>
                                onEditDataChange("name", e.target.value)
                              }
                              placeholder={t(
                                "create-character:modal.name_placeholder"
                              )}
                              maxLength={100}
                              required
                            />
                            <div className="flex justify-end text-xs text-muted-foreground">
                              <span>{editData.name?.length || 0}/100</span>
                            </div>
                          </FieldWrapper>

                          <div className="grid grid-cols-2 gap-4">
                            <FieldWrapper
                              fieldName="age"
                              label={t("character-detail:fields.age")}
                              isOptional={false}
                              fieldVisibility={fieldVisibility}
                              isEditing={isEditing}
                              onFieldVisibilityToggle={onFieldVisibilityToggle}
                              t={t}
                            >
                              <Input
                                type="text"
                                value={editData.age}
                                onChange={(e) =>
                                  onEditDataChange("age", e.target.value)
                                }
                                placeholder={t(
                                  "create-character:modal.age_placeholder"
                                )}
                                maxLength={50}
                                required
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.age?.length || 0}/50</span>
                              </div>
                            </FieldWrapper>

                            <FieldWrapper
                              fieldName="gender"
                              label={t("character-detail:fields.gender")}
                              isOptional={false}
                              fieldVisibility={fieldVisibility}
                              isEditing={isEditing}
                              onFieldVisibilityToggle={onFieldVisibilityToggle}
                              t={t}
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
                                      "create-character:modal.gender_placeholder"
                                    )}
                                  >
                                    {editData.gender && currentGender && (
                                      <div className="flex items-center gap-2">
                                        {(() => {
                                          const GenderIcon = currentGender.icon;
                                          return (
                                            <GenderIcon className="w-4 h-4" />
                                          );
                                        })()}
                                        <span>
                                          {t(
                                            `create-character:${currentGender.translationKey}`
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </SelectValue>
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
                                              `create-character:${gender.translationKey}`
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
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                              {roles.map((role) => {
                                const RoleIcon = role.icon;
                                const isSelected = editData.role === role.value;
                                return (
                                  <button
                                    key={role.value}
                                    type="button"
                                    onClick={() =>
                                      onEditDataChange("role", role.value)
                                    }
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                      isSelected
                                        ? `${role.bgColorClass} scale-105 shadow-lg`
                                        : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
                                    }`}
                                  >
                                    <RoleIcon
                                      className={`w-8 h-8 ${isSelected ? role.colorClass : "text-muted-foreground"}`}
                                    />
                                    <span
                                      className={`text-xs font-medium ${isSelected ? role.colorClass : "text-muted-foreground"}`}
                                    >
                                      {t(
                                        `create-character:${role.translationKey}`
                                      )}
                                    </span>
                                  </button>
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
                        fieldVisibility={fieldVisibility}
                        isEditing={isEditing}
                        onFieldVisibilityToggle={onFieldVisibilityToggle}
                        t={t}
                      >
                        <Textarea
                          value={editData.description}
                          onChange={(e) =>
                            onEditDataChange("description", e.target.value)
                          }
                          placeholder={t(
                            "create-character:modal.description_placeholder"
                          )}
                          rows={4}
                          maxLength={500}
                          className="resize-none"
                          required
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                          <span>{editData.description?.length || 0}/500</span>
                        </div>
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
                            <Badge className={currentRole?.bgColorClass}>
                              <RoleIcon className="w-4 h-4 mr-1" />
                              {t(`create-character:role.${character.role}`)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{character.age}</span>
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
                          {advancedSectionOpen
                            ? t("character-detail:actions.close")
                            : t("character-detail:actions.open")}
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

                        {/* Height and Weight - 2 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FieldWrapper
                            fieldName="height"
                            label={t("character-detail:fields.height")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              <>
                                <Input
                                  value={editData.height || ""}
                                  onChange={(e) =>
                                    onEditDataChange("height", e.target.value)
                                  }
                                  placeholder={t(
                                    "create-character:modal.height_placeholder"
                                  )}
                                  maxLength={50}
                                />
                                <div className="flex justify-end text-xs text-muted-foreground">
                                  <span>{editData.height?.length || 0}/50</span>
                                </div>
                              </>
                            ) : character.height ? (
                              <p className="text-sm">{character.height}</p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="weight"
                            label={t("character-detail:fields.weight")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              <>
                                <Input
                                  value={editData.weight || ""}
                                  onChange={(e) =>
                                    onEditDataChange("weight", e.target.value)
                                  }
                                  placeholder={t(
                                    "create-character:modal.weight_placeholder"
                                  )}
                                  maxLength={50}
                                />
                                <div className="flex justify-end text-xs text-muted-foreground">
                                  <span>{editData.weight?.length || 0}/50</span>
                                </div>
                              </>
                            ) : character.weight ? (
                              <p className="text-sm">{character.weight}</p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>
                        </div>

                        {/* Skin Tone - Full width */}
                        <FieldWrapper
                          fieldName="skinTone"
                          label={t("character-detail:fields.skin_tone")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Input
                                value={editData.skinTone || ""}
                                onChange={(e) =>
                                  onEditDataChange("skinTone", e.target.value)
                                }
                                placeholder={t(
                                  "character-detail:fields.skin_tone"
                                )}
                                maxLength={100}
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.skinTone?.length || 0}/100
                                </span>
                              </div>
                            </>
                          ) : character.skinTone ? (
                            <p className="text-sm">{character.skinTone}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Hair - Full width */}
                        <FieldWrapper
                          fieldName="hair"
                          label={t("character-detail:fields.hair")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Input
                                value={editData.hair || ""}
                                onChange={(e) =>
                                  onEditDataChange("hair", e.target.value)
                                }
                                placeholder={t("character-detail:fields.hair")}
                                maxLength={100}
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.hair?.length || 0}/100</span>
                              </div>
                            </>
                          ) : character.hair ? (
                            <p className="text-sm">{character.hair}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Eyes - Full width */}
                        <FieldWrapper
                          fieldName="eyes"
                          label={t("character-detail:fields.eyes")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Input
                                value={editData.eyes || ""}
                                onChange={(e) =>
                                  onEditDataChange("eyes", e.target.value)
                                }
                                placeholder={t("character-detail:fields.eyes")}
                                maxLength={200}
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.eyes?.length || 0}/200</span>
                              </div>
                            </>
                          ) : character.eyes ? (
                            <p className="text-sm">{character.eyes}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Face - Full width */}
                        <FieldWrapper
                          fieldName="face"
                          label={t("character-detail:fields.face")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Input
                                value={editData.face || ""}
                                onChange={(e) =>
                                  onEditDataChange("face", e.target.value)
                                }
                                placeholder={t("character-detail:fields.face")}
                                maxLength={200}
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.face?.length || 0}/200</span>
                              </div>
                            </>
                          ) : character.face ? (
                            <p className="text-sm">{character.face}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Physical Type and Species/Race - 2 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FieldWrapper
                            fieldName="physicalType"
                            label={t("character-detail:fields.physical_type")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
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
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="speciesAndRace"
                            label={t(
                              "character-detail:fields.species_and_race"
                            )}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              <Alert className="bg-muted/50">
                                <Info className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                  Nenhuma espécie/raça cadastrada. Crie espécies
                                  e raças na aba Espécies para selecioná-las
                                  aqui.
                                </AlertDescription>
                              </Alert>
                            ) : character.speciesAndRace ? (
                              <p className="text-sm">
                                {character.speciesAndRace}
                              </p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>
                        </div>

                        <FieldWrapper
                          fieldName="distinguishingFeatures"
                          label={t(
                            "character-detail:fields.distinguishing_features"
                          )}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.distinguishingFeatures || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "distinguishingFeatures",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "character-detail:fields.distinguishing_features"
                                )}
                                rows={3}
                                maxLength={400}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.distinguishingFeatures?.length || 0}
                                  /400
                                </span>
                              </div>
                            </>
                          ) : character.distinguishingFeatures ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {character.distinguishingFeatures}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* Behavior Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("character-detail:sections.behavior")}
                        </h4>

                        <FieldWrapper
                          fieldName="archetype"
                          label={t("character-detail:fields.archetype")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {CHARACTER_ARCHETYPES_CONSTANT.map(
                                (archetype) => {
                                  const ArchetypeIcon = archetype.icon;
                                  const isSelected =
                                    editData.archetype === archetype.value;
                                  return (
                                    <button
                                      key={archetype.value}
                                      type="button"
                                      onClick={() =>
                                        onEditDataChange(
                                          "archetype",
                                          isSelected ? "" : archetype.value
                                        )
                                      }
                                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all h-32 ${
                                        isSelected
                                          ? "border-primary bg-primary/10 shadow-md"
                                          : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
                                      }`}
                                    >
                                      <ArchetypeIcon
                                        className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                                      />
                                      <span
                                        className={`text-xs font-medium text-center ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                                      >
                                        {t(
                                          `create-character:${archetype.translationKey}`
                                        )}
                                      </span>
                                      <p className="text-xs text-muted-foreground text-center line-clamp-2">
                                        {t(
                                          `create-character:${archetype.descriptionKey}`
                                        )}
                                      </p>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          ) : character.archetype ? (
                            (() => {
                              const archetype =
                                CHARACTER_ARCHETYPES_CONSTANT.find(
                                  (a) => a.value === character.archetype
                                );
                              if (!archetype) {
                                return (
                                  <div className="border-2 border-muted-foreground/30 bg-muted/20 p-6 rounded-lg text-center">
                                    <div className="flex flex-col items-center gap-3">
                                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-muted-foreground" />
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">
                                          Nenhum arquétipo escolhido
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Use o modo de edição para selecionar
                                          um arquétipo
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              const ArchetypeIcon = archetype.icon;
                              return (
                                <div className="border-2 border-primary bg-primary/10 p-6 rounded-lg shadow-md">
                                  <div className="flex flex-col items-center gap-4 text-center">
                                    <ArchetypeIcon className="w-12 h-12 text-primary" />
                                    <span className="text-lg font-semibold">
                                      {t(
                                        `create-character:${archetype.translationKey}`
                                      )}
                                    </span>
                                    <p className="text-sm text-muted-foreground max-w-md">
                                      {t(
                                        `create-character:${archetype.descriptionKey}`
                                      )}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="border-2 border-muted-foreground/30 bg-muted/20 p-6 rounded-lg text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                  <Sparkles className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-foreground">
                                    Nenhum arquétipo escolhido
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Use o modo de edição para selecionar um
                                    arquétipo
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </FieldWrapper>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FieldWrapper
                            fieldName="favoriteFood"
                            label={t("character-detail:fields.favorite_food")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              <>
                                <Input
                                  value={editData.favoriteFood || ""}
                                  onChange={(e) =>
                                    onEditDataChange(
                                      "favoriteFood",
                                      e.target.value
                                    )
                                  }
                                  placeholder={t(
                                    "character-detail:fields.favorite_food"
                                  )}
                                  maxLength={100}
                                />
                                <div className="flex justify-end text-xs text-muted-foreground">
                                  <span>
                                    {editData.favoriteFood?.length || 0}/100
                                  </span>
                                </div>
                              </>
                            ) : character.favoriteFood ? (
                              <p className="text-sm">
                                {character.favoriteFood}
                              </p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="favoriteMusic"
                            label={t("character-detail:fields.favorite_music")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              <>
                                <Input
                                  value={editData.favoriteMusic || ""}
                                  onChange={(e) =>
                                    onEditDataChange(
                                      "favoriteMusic",
                                      e.target.value
                                    )
                                  }
                                  placeholder={t(
                                    "character-detail:fields.favorite_music"
                                  )}
                                  maxLength={100}
                                />
                                <div className="flex justify-end text-xs text-muted-foreground">
                                  <span>
                                    {editData.favoriteMusic?.length || 0}/100
                                  </span>
                                </div>
                              </>
                            ) : character.favoriteMusic ? (
                              <p className="text-sm">
                                {character.favoriteMusic}
                              </p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>
                        </div>

                        <FieldWrapper
                          fieldName="personality"
                          label={t("character-detail:fields.personality")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.personality || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "personality",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "character-detail:fields.personality"
                                )}
                                rows={3}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.personality?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : character.personality ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {character.personality}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        <FieldWrapper
                          fieldName="hobbies"
                          label={t("character-detail:fields.hobbies")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.hobbies || ""}
                                onChange={(e) =>
                                  onEditDataChange("hobbies", e.target.value)
                                }
                                placeholder={t(
                                  "character-detail:fields.hobbies"
                                )}
                                rows={3}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.hobbies?.length || 0}/500</span>
                              </div>
                            </>
                          ) : character.hobbies ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {character.hobbies}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        <FieldWrapper
                          fieldName="dreamsAndGoals"
                          label={t("character-detail:fields.dreams_and_goals")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.dreamsAndGoals || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "dreamsAndGoals",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "character-detail:fields.dreams_and_goals"
                                )}
                                rows={3}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.dreamsAndGoals?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : character.dreamsAndGoals ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {character.dreamsAndGoals}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        <FieldWrapper
                          fieldName="fearsAndTraumas"
                          label={t("character-detail:fields.fears_and_traumas")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.fearsAndTraumas || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "fearsAndTraumas",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "character-detail:fields.fears_and_traumas"
                                )}
                                rows={3}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.fearsAndTraumas?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : character.fearsAndTraumas ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {character.fearsAndTraumas}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* Alignment Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("character-detail:sections.alignment")}
                        </h4>

                        <AlignmentMatrix
                          value={
                            isEditing ? editData.alignment : character.alignment
                          }
                          onChange={(value) =>
                            onEditDataChange("alignment", value)
                          }
                          isEditable={isEditing}
                        />
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
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              mockLocations && mockLocations.length > 0 ? (
                                <Select
                                  value={editData.birthPlace || ""}
                                  onValueChange={(value) =>
                                    onEditDataChange("birthPlace", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t(
                                        "character-detail:fields.birth_place"
                                      )}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockLocations.map((location) => (
                                      <SelectItem
                                        key={location.id}
                                        value={location.id}
                                      >
                                        {location.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Alert className="bg-muted/50">
                                  <Info className="h-4 w-4" />
                                  <AlertDescription className="text-xs">
                                    Nenhum local cadastrado. Crie locais na aba
                                    Mundo para selecioná-los aqui.
                                  </AlertDescription>
                                </Alert>
                              )
                            ) : character.birthPlace ? (
                              <p className="text-sm">{character.birthPlace}</p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="affiliatedPlace"
                            label={t(
                              "character-detail:fields.affiliated_place"
                            )}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              mockLocations && mockLocations.length > 0 ? (
                                <Select
                                  value={editData.affiliatedPlace || ""}
                                  onValueChange={(value) =>
                                    onEditDataChange("affiliatedPlace", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t(
                                        "character-detail:fields.affiliated_place"
                                      )}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockLocations.map((location) => (
                                      <SelectItem
                                        key={location.id}
                                        value={location.id}
                                      >
                                        {location.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Alert className="bg-muted/50">
                                  <Info className="h-4 w-4" />
                                  <AlertDescription className="text-xs">
                                    Nenhum local cadastrado. Crie locais na aba
                                    Mundo para selecioná-los aqui.
                                  </AlertDescription>
                                </Alert>
                              )
                            ) : character.affiliatedPlace ? (
                              <p className="text-sm">
                                {character.affiliatedPlace}
                              </p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="organization"
                            label={t("character-detail:fields.organization")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              mockFactions && mockFactions.length > 0 ? (
                                <Select
                                  value={editData.organization || ""}
                                  onValueChange={(value) =>
                                    onEditDataChange("organization", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t(
                                        "character-detail:fields.organization"
                                      )}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mockFactions.map((org) => (
                                      <SelectItem key={org.id} value={org.id}>
                                        {org.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Alert className="bg-muted/50">
                                  <Info className="h-4 w-4" />
                                  <AlertDescription className="text-xs">
                                    Nenhuma organização cadastrada. Crie
                                    organizações para selecioná-las aqui.
                                  </AlertDescription>
                                </Alert>
                              )
                            ) : character.organization ? (
                              <p className="text-sm">
                                {character.organization}
                              </p>
                            ) : (
                              <EmptyFieldState t={t} />
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
                    relationships={
                      isEditing
                        ? editData.relationships || []
                        : character.relationships || []
                    }
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
                  <CardTitle>{t("character-detail:sections.family")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FamilySection
                    family={
                      (isEditing ? editData.family : character.family) || {
                        father: null,
                        mother: null,
                        spouse: null,
                        children: [],
                        siblings: [],
                        halfSiblings: [],
                        grandparents: [],
                        unclesAunts: [],
                        cousins: [],
                      }
                    }
                    allCharacters={mockCharacters}
                    currentCharacterId={character.id}
                    isEditMode={isEditing}
                    onFamilyChange={(family) =>
                      onEditDataChange("family", family)
                    }
                  />
                </CardContent>
              </Card>

              {/* Powers Card */}
              {powerLinks && powerLinks.length > 0 && (
                <Card className="card-magical">
                  <CardHeader>
                    <CardTitle>{t("character-detail:sections.powers")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {powerLinks.map((link) => (
                        <PowerLinkCard
                          key={link.id}
                          link={link}
                          pageTitle={(link as any).pageTitle}
                          sectionTitle={(link as any).sectionTitle}
                          isEditing={isEditing}
                          onClick={() => onNavigateToPowerInstance(link.id)}
                          onEdit={() => onEditPowerLink(link)}
                          onDelete={() => onDeletePowerLink(link.id)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Versions - 1 column */}
            {!isEditing && (
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
                      mainCharacterData={character as any}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
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

      {/* Edit Power Link Modal */}
      <EditPowerLinkModal
        isOpen={isEditLinkModalOpen}
        onClose={onCloseEditLinkModal}
        link={selectedLinkForEdit}
        onSave={onSavePowerLink}
      />
    </div>
  );
}
