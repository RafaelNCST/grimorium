import React from "react";

import { Users, Calendar, Shield, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CharacterNavigationSidebar } from "@/components/character-navigation-sidebar";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormSimpleGrid } from "@/components/forms/FormSimpleGrid";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CHARACTER_ARCHETYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-archetypes";
import { type ICharacterRole } from "@/components/modals/create-character-modal/constants/character-roles";
import { type IGender as IGenderModal } from "@/components/modals/create-character-modal/constants/genders";
import { PHYSICAL_TYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/physical-types";
import {
  PHYSICAL_TYPE_BASE_COLOR,
  PHYSICAL_TYPE_HOVER_COLOR,
  PHYSICAL_TYPE_ACTIVE_COLOR,
} from "@/components/modals/create-character-modal/constants/physical-type-colors";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { EditPowerLinkModal } from "@/pages/dashboard/tabs/power-system/components/edit-power-link-modal";
import { PowerLinkCard } from "@/pages/dashboard/tabs/power-system/components/power-link-card";
import type { IPowerCharacterLink } from "@/pages/dashboard/tabs/power-system/types/power-system-types";
import {
  type ICharacterVersion,
  type ICharacterFormData,
} from "@/types/character-types";

import { AlignmentMatrix } from "./components/alignment-matrix";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import { FamilySection } from "./components/family-section";
import { RelationshipsSection } from "./components/relationships-section";
import { VersionManager } from "./components/version-manager";
import { ALIGNMENTS_CONSTANT, type IAlignment } from "./constants/alignments-constant";
import { type IRelationshipType } from "./constants/relationship-types-constant";

// Helper component for empty state
const EmptyFieldState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("character-detail:empty_states.no_data")}</p>
  </div>
);

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
  speciesAndRace?: string[];

  // Behavior
  archetype?: string;
  personality?: string;
  hobbies?: string;
  dreamsAndGoals?: string;
  fearsAndTraumas?: string;
  favoriteFood?: string;
  favoriteMusic?: string;

  // Locations
  birthPlace?: string[];

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
  bookId: string;
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

export function CharacterDetailView({
  character,
  editData,
  isEditing,
  bookId,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  fileInputRef,
  mockCharacters,
  mockLocations,
  roles,
  genders,
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
  onImageFileChange,
  onEditDataChange,
  onFieldVisibilityToggle,
  onAdvancedSectionToggle,
  onNavigateToPowerInstance,
  onEditPowerLink,
  onDeletePowerLink,
  isEditLinkModalOpen,
  selectedLinkForEdit,
  onCloseEditLinkModal,
  onSavePowerLink,
}: CharacterDetailViewProps) {
  const { t } = useTranslation(["character-detail", "create-character"]);

  // Helper: Check field visibility
  const isFieldVisible = (fieldName: string) =>
    fieldVisibility[fieldName] !== false;

  // Convert role constants to FormSimpleGrid format
  const roleOptions = roles.map((role) => ({
    value: role.value,
    label: t(`create-character:${role.translationKey}`),
    icon: role.icon,
    baseColorClass: "border-muted",
    hoverColorClass: "hover:border-muted-foreground/50 hover:bg-muted/50",
    activeColorClass: role.bgColorClass,
    iconColorClass: role.colorClass,
    activeIconColorClass: role.colorClass,
    textColorClass: "text-muted-foreground",
    activeTextColorClass: role.colorClass,
  }));

  // Convert archetype constants to FormSelectGrid format
  const archetypeOptions = CHARACTER_ARCHETYPES_CONSTANT.map((archetype) => ({
    value: archetype.value,
    label: t(`create-character:${archetype.translationKey}`),
    description: t(`create-character:${archetype.descriptionKey}`),
    icon: archetype.icon,
  }));

  // Convert alignment constants to FormSelectGrid format
  const alignmentOptions = ALIGNMENTS_CONSTANT.map((alignment) => ({
    value: alignment.value,
    label: t(`create-character:${alignment.translationKey}`),
    description: alignment.description,
    icon: alignment.icon,
    baseColorClass: alignment.bgColor,
    hoverColorClass: `hover:${alignment.bgColor}`,
    activeColorClass: `${alignment.bgColor} ${alignment.color}`,
  }));

  // Convert physical type constants to FormSimpleGrid format
  const physicalTypeOptions = PHYSICAL_TYPES_CONSTANT.map((type) => ({
    value: type.value,
    label: t(`create-character:${type.translationKey}`),
    icon: type.icon,
    baseColorClass: PHYSICAL_TYPE_BASE_COLOR,
    hoverColorClass: PHYSICAL_TYPE_HOVER_COLOR[type.value],
    activeColorClass: PHYSICAL_TYPE_ACTIVE_COLOR[type.value],
  }));

  // Basic Fields
  const basicFields = (
    <div className="space-y-6">
      {isEditing ? (
        <>
          <div className="flex gap-6">
            {/* Character Image */}
            <FormImageUpload
              value={imagePreview}
              onChange={(value) => {
                const event = {
                  target: { files: [new File([value], "image")] },
                } as any;
                onImageFileChange(event);
              }}
              label={t("character-detail:fields.image")}
              shape="circle"
              height="h-24"
              width="w-24"
              imageFit="cover"
            />

            {/* Name, Age, Gender */}
            <div className="flex-1 space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary">
                  {t("character-detail:fields.name")} *
                </Label>
                <Input
                  value={editData.name}
                  onChange={(e) => onEditDataChange("name", e.target.value)}
                  placeholder={t("create-character:modal.name_placeholder")}
                  maxLength={100}
                  required
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.name?.length || 0}/100</span>
                </div>
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary">
                    {t("character-detail:fields.age")} *
                  </Label>
                  <Input
                    type="text"
                    value={editData.age}
                    onChange={(e) => onEditDataChange("age", e.target.value)}
                    placeholder={t("create-character:modal.age_placeholder")}
                    maxLength={50}
                    required
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.age?.length || 0}/50</span>
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary">
                    {t("character-detail:fields.gender")} *
                  </Label>
                  <Select
                    value={editData.gender || ""}
                    onValueChange={(value) => onEditDataChange("gender", value)}
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
                              return <GenderIcon className="w-4 h-4" />;
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
                          <SelectItem key={gender.value} value={gender.value}>
                            <div className="flex items-center gap-2">
                              <GenderIcon className="w-4 h-4" />
                              <span>
                                {t(`create-character:${gender.translationKey}`)}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Role - Using FormSimpleGrid */}
          <FormSimpleGrid
            value={editData.role}
            onChange={(value) => onEditDataChange("role", value)}
            label={t("character-detail:fields.role")}
            required
            columns={5}
            options={roleOptions}
          />

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              {t("character-detail:fields.description")} *
            </Label>
            <Textarea
              value={editData.description}
              onChange={(e) => onEditDataChange("description", e.target.value)}
              placeholder={t("create-character:modal.description_placeholder")}
              rows={4}
              maxLength={500}
              className="resize-none"
              required
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{editData.description?.length || 0}/500</span>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={character.image} className="object-cover" />
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
                <h2 className="text-3xl font-bold">{character.name}</h2>
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
                      {t(`create-character:gender.${character.gender}`)}
                    </span>
                  </div>
                )}
                {currentAlignment && (
                  <Badge
                    variant="secondary"
                    className={`${currentAlignment.bgColor} ${currentAlignment.color}`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {t(`create-character:alignment.${character.alignment}`)}
                  </Badge>
                )}
              </div>

              <p className="text-foreground text-base">{character.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Advanced Fields
  const advancedFields = (
    <>
      {/* Appearance Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.appearance")}
        </h4>

        {/* Height and Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              {t("character-detail:fields.height")}
            </Label>
            {isEditing ? (
              <>
                <Input
                  value={editData.height || ""}
                  onChange={(e) => onEditDataChange("height", e.target.value)}
                  placeholder={t("create-character:modal.height_placeholder")}
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
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              {t("character-detail:fields.weight")}
            </Label>
            {isEditing ? (
              <>
                <Input
                  value={editData.weight || ""}
                  onChange={(e) => onEditDataChange("weight", e.target.value)}
                  placeholder={t("create-character:modal.weight_placeholder")}
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
          </div>
        </div>

        {/* Skin Tone */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">
            {t("character-detail:fields.skin_tone")}
          </Label>
          {isEditing ? (
            <>
              <Input
                value={editData.skinTone || ""}
                onChange={(e) => onEditDataChange("skinTone", e.target.value)}
                placeholder={t("character-detail:fields.skin_tone")}
                maxLength={100}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.skinTone?.length || 0}/100</span>
              </div>
            </>
          ) : character.skinTone ? (
            <p className="text-sm">{character.skinTone}</p>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </div>

        {/* Hair, Eyes, Face - Similar pattern */}
        {["hair", "eyes", "face"].map((field) => (
          <div key={field} className="space-y-2">
            <Label className="text-sm font-medium text-primary">
              {t(`character-detail:fields.${field}`)}
            </Label>
            {isEditing ? (
              <>
                <Input
                  value={(editData as any)[field] || ""}
                  onChange={(e) => onEditDataChange(field, e.target.value)}
                  placeholder={t(`character-detail:fields.${field}`)}
                  maxLength={field === "hair" ? 100 : 200}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>
                    {(editData as any)[field]?.length || 0}/
                    {field === "hair" ? 100 : 200}
                  </span>
                </div>
              </>
            ) : (character as any)[field] ? (
              <p className="text-sm">{(character as any)[field]}</p>
            ) : (
              <EmptyFieldState t={t} />
            )}
          </div>
        ))}

        {/* Species and Race */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">
            {t("create-character:modal.species_and_race")}
          </Label>
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="race"
              bookId={bookId}
              label=""
              placeholder={t("create-character:modal.species_placeholder")}
              emptyText={t("create-character:modal.no_species_warning")}
              noSelectionText={t("create-character:modal.no_species_selected")}
              searchPlaceholder={t("create-character:modal.search_species")}
              value={editData.speciesAndRace || []}
              onChange={(value) => onEditDataChange("speciesAndRace", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : character.speciesAndRace && character.speciesAndRace.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {character.speciesAndRace.map((speciesId) => (
                <Badge key={speciesId} variant="secondary" className="text-sm">
                  {speciesId}
                </Badge>
              ))}
            </div>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </div>

        {/* Physical Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">
            {t("character-detail:fields.physical_type")}
          </Label>
          {isEditing ? (
            <FormSimpleGrid
              value={editData.physicalType || ""}
              onChange={(value) => onEditDataChange("physicalType", value)}
              label=""
              columns={6}
              options={physicalTypeOptions}
            />
          ) : character.physicalType ? (
            (() => {
              const type = PHYSICAL_TYPES_CONSTANT.find(
                (t) => t.value === character.physicalType
              );
              if (!type) {
                return <EmptyFieldState t={t} />;
              }
              const TypeIcon = type.icon;
              const colorClass = PHYSICAL_TYPE_ACTIVE_COLOR[type.value];
              return (
                <div className={`border-2 p-4 rounded-lg ${colorClass}`}>
                  <div className="flex items-center gap-3">
                    <TypeIcon className="w-8 h-8" />
                    <span className="text-base font-semibold">
                      {t(`create-character:${type.translationKey}`)}
                    </span>
                  </div>
                </div>
              );
            })()
          ) : (
            <EmptyFieldState t={t} />
          )}
        </div>

        {/* Distinguishing Features */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">
            {t("character-detail:fields.distinguishing_features")}
          </Label>
          {isEditing ? (
            <>
              <Textarea
                value={editData.distinguishingFeatures || ""}
                onChange={(e) =>
                  onEditDataChange("distinguishingFeatures", e.target.value)
                }
                placeholder={t("character-detail:fields.distinguishing_features")}
                rows={3}
                maxLength={400}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>
                  {editData.distinguishingFeatures?.length || 0}/400
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
        </div>
      </div>

      <Separator className="my-6" />

      {/* Behavior Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.behavior")}
        </h4>

        {/* Archetype - Using FormSelectGrid */}
        {isEditing ? (
          <FormSelectGrid
            value={editData.archetype || ""}
            onChange={(value) => onEditDataChange("archetype", value)}
            label={t("character-detail:fields.archetype")}
            columns={4}
            options={archetypeOptions}
          />
        ) : character.archetype ? (
          (() => {
            const archetype = CHARACTER_ARCHETYPES_CONSTANT.find(
              (a) => a.value === character.archetype
            );
            if (!archetype) {
              return <EmptyFieldState t={t} />;
            }
            const ArchetypeIcon = archetype.icon;
            return (
              <div className="border-2 border-primary bg-primary/10 p-6 rounded-lg shadow-md">
                <div className="flex flex-col items-center gap-4 text-center">
                  <ArchetypeIcon className="w-12 h-12 text-primary" />
                  <span className="text-lg font-semibold">
                    {t(`create-character:${archetype.translationKey}`)}
                  </span>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t(`create-character:${archetype.descriptionKey}`)}
                  </p>
                </div>
              </div>
            );
          })()
        ) : (
          <EmptyFieldState t={t} />
        )}

        {/* Favorite Food and Music */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["favoriteFood", "favoriteMusic"].map((field) => (
            <div key={field} className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t(`character-detail:fields.${field.replace(/([A-Z])/g, "_$1").toLowerCase()}`)}
              </Label>
              {isEditing ? (
                <>
                  <Input
                    value={(editData as any)[field] || ""}
                    onChange={(e) => onEditDataChange(field, e.target.value)}
                    placeholder={t(`character-detail:fields.${field.replace(/([A-Z])/g, "_$1").toLowerCase()}`)}
                    maxLength={100}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{(editData as any)[field]?.length || 0}/100</span>
                  </div>
                </>
              ) : (character as any)[field] ? (
                <p className="text-sm">{(character as any)[field]}</p>
              ) : (
                <EmptyFieldState t={t} />
              )}
            </div>
          ))}
        </div>

        {/* Personality, Hobbies, Dreams, Fears */}
        {["personality", "hobbies", "dreamsAndGoals", "fearsAndTraumas"].map(
          (field) => (
            <div key={field} className="space-y-2">
              <Label className="text-sm font-medium text-primary">
                {t(`character-detail:fields.${field.replace(/([A-Z])/g, "_$1").toLowerCase()}`)}
              </Label>
              {isEditing ? (
                <>
                  <Textarea
                    value={(editData as any)[field] || ""}
                    onChange={(e) => onEditDataChange(field, e.target.value)}
                    placeholder={t(`character-detail:fields.${field.replace(/([A-Z])/g, "_$1").toLowerCase()}`)}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{(editData as any)[field]?.length || 0}/500</span>
                  </div>
                </>
              ) : (character as any)[field] ? (
                <p className="text-sm whitespace-pre-wrap">
                  {(character as any)[field]}
                </p>
              ) : (
                <EmptyFieldState t={t} />
              )}
            </div>
          )
        )}
      </div>

      <Separator className="my-6" />

      {/* Alignment Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.alignment")}
        </h4>

        <AlignmentMatrix
          value={isEditing ? editData.alignment : character.alignment}
          onChange={(value) => onEditDataChange("alignment", value)}
          isEditable={isEditing}
        />
      </div>

      <Separator className="my-6" />

      {/* Locations Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.locations_orgs")}
        </h4>

        <div className="space-y-2">
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="region"
              bookId={bookId}
              label={t("character-detail:fields.birth_place")}
              placeholder={t("create-character:modal.birth_place_placeholder")}
              emptyText={t("create-character:modal.no_locations_warning")}
              noSelectionText={t("create-character:modal.no_birth_place_selected")}
              searchPlaceholder={t("create-character:modal.search_location")}
              value={editData.birthPlace || []}
              onChange={(value) => onEditDataChange("birthPlace", value)}
              labelClassName="text-sm font-medium text-primary"
              maxSelections={1}
            />
          ) : (
            <>
              <Label className="text-sm font-medium text-primary">
                {t("character-detail:fields.birth_place")}
              </Label>
              {character.birthPlace && character.birthPlace.length > 0 ? (
                <p className="text-sm">{character.birthPlace.join(", ")}</p>
              ) : (
                <EmptyFieldState t={t} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );

  // Extra Sections
  const extraSections = [
    {
      id: "relationships",
      title: t("character-detail:sections.relationships"),
      content: (
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
      ),
      isCollapsible: true,
      defaultOpen: false,
    },
    {
      id: "family",
      title: t("character-detail:sections.family"),
      content: (
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
          onFamilyChange={(family) => onEditDataChange("family", family)}
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
    },
  ];

  // Add Powers section if there are power links
  if (powerLinks && powerLinks.length > 0) {
    extraSections.push({
      id: "powers",
      title: t("character-detail:sections.powers"),
      content: (
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
      ),
      isCollapsible: true,
      defaultOpen: false,
    });
  }

  // Versions Panel
  const versionsPanel = (
    <Card className="card-magical sticky top-24 h-fit">
      <CardHeader>
        <CardTitle className="text-base">
          {t("character-detail:sections.versions")}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
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
          <EntityDetailLayout
            onBack={onBack}
            backLabel={t("character-detail:header.back")}
            showMenuButton={true}
            onMenuToggle={onNavigationSidebarToggle}
            isEditMode={isEditing}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            onDelete={onDeleteModalOpen}
            editLabel={t("character-detail:header.edit")}
            deleteLabel={t("character-detail:header.delete")}
            saveLabel={t("character-detail:header.save")}
            cancelLabel={t("character-detail:header.cancel")}
            hasChanges={true}
            basicFields={basicFields}
            advancedFields={advancedFields}
            advancedSectionTitle={t("character-detail:sections.advanced_info")}
            advancedSectionOpen={advancedSectionOpen}
            onAdvancedSectionToggle={onAdvancedSectionToggle}
            extraSections={extraSections}
            versionsPanel={versionsPanel}
          />
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
