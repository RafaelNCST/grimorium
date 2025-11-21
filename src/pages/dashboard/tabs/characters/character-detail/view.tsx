import React from "react";

import {
  AlertCircle,
  Calendar,
  Shield,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { CharacterNavigationSidebar } from "@/components/character-navigation-sidebar";
import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayEntityList,
  DisplaySelectGrid,
  DisplaySimpleGrid,
  DisplayStringList,
  DisplayText,
  DisplayTextarea,
} from "@/components/displays";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormListInput } from "@/components/forms/FormListInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormSimpleGrid } from "@/components/forms/FormSimpleGrid";
import { FormSimplePicker } from "@/components/forms/FormSimplePicker";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CreateCharacterModal } from "@/components/modals/create-character-modal";
import { CHARACTER_ARCHETYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-archetypes";
import { type ICharacterRole } from "@/components/modals/create-character-modal/constants/character-roles";
import { CHARACTER_STATUS_CONSTANT } from "@/components/modals/create-character-modal/constants/character-status";
import { type IGender as IGenderModal } from "@/components/modals/create-character-modal/constants/genders";
import { PHYSICAL_TYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/physical-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
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
  EntityVersionManager,
  CreateVersionWithEntityDialog,
  VersionsPanel,
} from "@/components/version-system";
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
import { VersionCard } from "./components/version-card";
import { type IAlignment } from "./constants/alignments-constant";
import { type IRelationshipType } from "./constants/relationship-types-constant";

interface ICharacter {
  id: string;
  name: string;
  age: string;
  image: string;
  role: string;
  alignment: string;
  gender: string;
  description: string;
  status?: string;

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

  // History
  birthPlace?: string[];
  nicknames?: string[];
  past?: string;

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

interface ISectionVisibility {
  [key: string]: boolean;
}

interface CharacterDetailViewProps {
  character: ICharacter;
  editData: ICharacter;
  isEditing: boolean;
  hasChanges: boolean;
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
  mockCharacters: ICharacter[];
  regions: Array<{ id: string; name: string; image?: string }>;
  races: Array<{ id: string; name: string; image?: string }>;
  mockFactions: Array<{ id: string; name: string }>;
  roles: ICharacterRole[];
  alignments: IAlignment[];
  genders: IGenderModal[];
  relationshipTypes: IRelationshipType[];
  currentRole: ICharacterRole | undefined;
  currentAlignment: IAlignment | undefined;
  currentGender: IGenderModal | undefined;
  fieldVisibility: IFieldVisibility;
  advancedSectionOpen: boolean;
  openSections: Record<string, boolean>;
  toggleSection: (sectionName: string) => void;
  powerLinks: IPowerCharacterLink[];
  errors: Record<string, string>;
  validateField: (field: string, value: any) => void;
  hasRequiredFieldsEmpty: boolean;
  missingFields: string[];
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
  sectionVisibility: ISectionVisibility;
  onSectionVisibilityToggle: (section: string) => void;
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
  hasChanges,
  bookId,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  mockCharacters,
  regions,
  races,
  roles,
  genders,
  currentRole,
  currentAlignment,
  currentGender,
  fieldVisibility,
  advancedSectionOpen,
  openSections,
  toggleSection,
  powerLinks,
  errors,
  validateField,
  hasRequiredFieldsEmpty,
  missingFields,
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
  sectionVisibility,
  onSectionVisibilityToggle,
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

  // Convert role constants to FormSimpleGrid format with universal pattern
  const roleOptions = roles.map((role) => ({
    value: role.value,
    label: t(`create-character:${role.translationKey}`),
    icon: role.icon,
    backgroundColor: role.value === 'protagonist' ? 'yellow-500/10' :
                     role.value === 'antagonist' ? 'orange-500/10' :
                     role.value === 'villain' ? 'red-500/10' :
                     role.value === 'secondary' ? 'blue-500/10' : 'gray-500/10',
    borderColor: role.value === 'protagonist' ? 'yellow-500/20' :
                 role.value === 'antagonist' ? 'orange-500/20' :
                 role.value === 'villain' ? 'red-500/20' :
                 role.value === 'secondary' ? 'blue-500/20' : 'gray-500/20',
  }));

  // Convert archetype constants to FormSelectGrid format
  const archetypeOptions = CHARACTER_ARCHETYPES_CONSTANT.map((archetype) => ({
    value: archetype.value,
    label: t(`create-character:${archetype.translationKey}`),
    description: t(`create-character:${archetype.descriptionKey}`),
    icon: archetype.icon,
    backgroundColor: "purple-500/10",
    borderColor: "purple-500/20",
  }));

  // Convert physical type constants to FormSimpleGrid format
  const physicalTypeOptions = PHYSICAL_TYPES_CONSTANT.map((type) => ({
    value: type.value,
    label: t(`create-character:${type.translationKey}`),
    icon: type.icon,
    backgroundColor: type.value === 'malnourished' ? 'orange-500/10' :
                     type.value === 'thin' ? 'sky-500/10' :
                     type.value === 'athletic' ? 'emerald-500/10' :
                     type.value === 'robust' ? 'blue-500/10' :
                     type.value === 'corpulent' ? 'purple-500/10' : 'red-500/10',
    borderColor: type.value === 'malnourished' ? 'orange-500/20' :
                 type.value === 'thin' ? 'sky-500/20' :
                 type.value === 'athletic' ? 'emerald-500/20' :
                 type.value === 'robust' ? 'blue-500/20' :
                 type.value === 'corpulent' ? 'purple-500/20' : 'red-500/20',
  }));

  // Convert status constants to FormSimplePicker format
  const statusOptions = CHARACTER_STATUS_CONSTANT.map((status) => ({
    value: status.value,
    translationKey: status.translationKey,
    icon: status.icon,
    color: "text-muted-foreground",
    activeColor: status.colorClass,
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
              showLabel={false}
              placeholderIcon={User}
            />

            {/* Name, Age, Gender */}
            <div className="flex-1 space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary">
                  {t("character-detail:fields.name")}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  value={editData.name}
                  onChange={(e) => onEditDataChange("name", e.target.value)}
                  onBlur={() => validateField("name", editData.name)}
                  placeholder={t("create-character:modal.name_placeholder")}
                  maxLength={100}
                  className={errors.name ? "border-destructive" : ""}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.name?.length || 0}/100</span>
                </div>
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary">
                    {t("character-detail:fields.age")}
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={editData.age}
                    onChange={(e) => onEditDataChange("age", e.target.value)}
                    onBlur={() => validateField("age", editData.age)}
                    placeholder={t("create-character:modal.age_placeholder")}
                    maxLength={50}
                    className={errors.age ? "border-destructive" : ""}
                    required
                  />
                  {errors.age && (
                    <p className="text-xs text-destructive">{errors.age}</p>
                  )}
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.age?.length || 0}/50</span>
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary">
                    {t("character-detail:fields.gender")}
                    <span className="text-destructive ml-1">*</span>
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

          {/* Status - Using FormSimplePicker */}
          <FormSimplePicker
            value={editData.status || ""}
            onChange={(value) => onEditDataChange("status", value)}
            label={t("character-detail:fields.status")}
            options={statusOptions}
            translationNamespace="create-character"
          />

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
              {t("character-detail:fields.description")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              value={editData.description}
              onChange={(e) => onEditDataChange("description", e.target.value)}
              onBlur={() => validateField("description", editData.description)}
              placeholder={t("create-character:modal.description_placeholder")}
              rows={4}
              maxLength={500}
              className={
                errors.description
                  ? "resize-none border-destructive"
                  : "resize-none"
              }
              required
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{editData.description?.length || 0}/500</span>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-6">
            {character.image ? (
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
            ) : (
              <FormImageDisplay
                icon={User}
                height="h-24"
                width="w-24"
                shape="circle"
              />
            )}

            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3">{character.name}</h2>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{character.age}</span>
                </div>
                {currentGender && (
                  <div className="flex items-center gap-2">
                    {(() => {
                      const GenderIcon = currentGender.icon;
                      return <GenderIcon className="w-4 h-4 text-primary" />;
                    })()}
                    <span>
                      {t(`create-character:gender.${character.gender}`)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {currentRole && (
                  <EntityTagBadge
                    config={currentRole}
                    label={t(`create-character:role.${character.role}`)}
                  />
                )}
                {character.status && (() => {
                  const currentStatus = CHARACTER_STATUS_CONSTANT.find(
                    (s) => s.value === character.status
                  );
                  return currentStatus ? (
                    <EntityTagBadge
                      config={currentStatus}
                      label={t(`create-character:${currentStatus.translationKey}`)}
                    />
                  ) : null;
                })()}
              </div>

              <p className="text-foreground text-base">
                {character.description}
              </p>
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
          <FieldWithVisibilityToggle
            fieldName="height"
            label={t("character-detail:fields.height")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
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
            ) : (
              <DisplayText
                value={character.height}
              />
            )}
          </FieldWithVisibilityToggle>

          <FieldWithVisibilityToggle
            fieldName="weight"
            label={t("character-detail:fields.weight")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
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
            ) : (
              <DisplayText
                value={character.weight}
              />
            )}
          </FieldWithVisibilityToggle>
        </div>

        {/* Skin Tone */}
        <FieldWithVisibilityToggle
          fieldName="skinTone"
          label={t("character-detail:fields.skin_tone")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
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
          ) : (
            <DisplayText
              value={character.skinTone}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Hair, Eyes, Face */}
        {["hair", "eyes", "face"].map((field) => (
          <FieldWithVisibilityToggle
            key={field}
            fieldName={field}
            label={t(`character-detail:fields.${field}`)}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
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
            ) : (
              <DisplayText
                value={(character as any)[field]}
              />
            )}
          </FieldWithVisibilityToggle>
        ))}

        {/* Species and Race */}
        <FieldWithVisibilityToggle
          fieldName="speciesAndRace"
          label={isEditing ? t("create-character:modal.species_and_race") : ""}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="race"
              bookId={bookId}
              label=""
              placeholder={t("create-character:modal.species_placeholder")}
              noSelectionText={t("create-character:modal.no_species_selected")}
              searchPlaceholder={t("create-character:modal.search_species")}
              value={editData.speciesAndRace || []}
              onChange={(value) => onEditDataChange("speciesAndRace", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <DisplayEntityList
              label={t("create-character:modal.species_and_race")}
              entities={
                character.speciesAndRace?.map((raceId) => {
                  const race = races.find((r) => r.id === raceId);
                  return race
                    ? { id: race.id, name: race.name, image: race.image }
                    : null;
                }).filter(Boolean) as Array<{ id: string; name: string; image?: string }>
              }
              open={openSections.speciesAndRace}
              onOpenChange={() => toggleSection("speciesAndRace")}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Physical Type */}
        <FieldWithVisibilityToggle
          fieldName="physicalType"
          label={t("character-detail:fields.physical_type")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormSimpleGrid
              value={editData.physicalType || ""}
              onChange={(value) => onEditDataChange("physicalType", value)}
              label=""
              columns={6}
              options={physicalTypeOptions}
            />
          ) : (
            <DisplaySimpleGrid
              value={character.physicalType}
              options={physicalTypeOptions}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Distinguishing Features */}
        <FieldWithVisibilityToggle
          fieldName="distinguishingFeatures"
          label={t("character-detail:fields.distinguishing_features")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.distinguishingFeatures || ""}
                onChange={(e) =>
                  onEditDataChange("distinguishingFeatures", e.target.value)
                }
                placeholder={t(
                  "character-detail:fields.distinguishing_features"
                )}
                rows={3}
                maxLength={400}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.distinguishingFeatures?.length || 0}/400</span>
              </div>
            </>
          ) : (
            <DisplayTextarea
              value={character.distinguishingFeatures}
            />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator className="my-6" />

      {/* Behavior Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.behavior")}
        </h4>

        {/* Archetype */}
        <FieldWithVisibilityToggle
          fieldName="archetype"
          label={t("character-detail:fields.archetype")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormSelectGrid
              value={editData.archetype || ""}
              onChange={(value) => onEditDataChange("archetype", value)}
              label=""
              columns={4}
              options={archetypeOptions}
            />
          ) : (
            <DisplaySelectGrid
              value={character.archetype}
              options={archetypeOptions}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Alignment */}
        <FieldWithVisibilityToggle
          fieldName="alignment"
          label={t("character-detail:fields.alignment")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <AlignmentMatrix
            value={isEditing ? editData.alignment : character.alignment}
            onChange={(value) => onEditDataChange("alignment", value)}
            isEditable={isEditing}
          />
        </FieldWithVisibilityToggle>

        {/* Favorite Food and Music */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["favoriteFood", "favoriteMusic"].map((field) => (
            <FieldWithVisibilityToggle
              key={field}
              fieldName={field}
              label={t(
                `character-detail:fields.${field.replace(/([A-Z])/g, "_$1").toLowerCase()}`
              )}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Input
                    value={(editData as any)[field] || ""}
                    onChange={(e) => onEditDataChange(field, e.target.value)}
                    placeholder={t(
                      `character-detail:fields.${field.replace(/([A-Z])/g, "_$1").toLowerCase()}`
                    )}
                    maxLength={100}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{(editData as any)[field]?.length || 0}/100</span>
                  </div>
                </>
              ) : (
                <DisplayText
                  value={(character as any)[field]}
                  />
              )}
            </FieldWithVisibilityToggle>
          ))}
        </div>

        {/* Personality, Hobbies, Dreams, Fears */}
        {["personality", "hobbies", "dreamsAndGoals", "fearsAndTraumas"].map(
          (field) => (
            <FieldWithVisibilityToggle
              key={field}
              fieldName={field}
              label={t(
                `character-detail:fields.${field.replace(/([A-Z])/g, "_$1").toLowerCase()}`
              )}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Textarea
                    value={(editData as any)[field] || ""}
                    onChange={(e) => onEditDataChange(field, e.target.value)}
                    placeholder={t(
                      `character-detail:fields.${field.replace(/([A-Z])/g, "_$1").toLowerCase()}`
                    )}
                    rows={3}
                    maxLength={500}
                    className="resize-none"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{(editData as any)[field]?.length || 0}/500</span>
                  </div>
                </>
              ) : (
                <DisplayTextarea
                  value={(character as any)[field]}
                  />
              )}
            </FieldWithVisibilityToggle>
          )
        )}
      </div>

      <Separator className="my-6" />

      {/* History Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("character-detail:sections.locations_orgs")}
        </h4>

        {/* Birth Place */}
        <FieldWithVisibilityToggle
          fieldName="birthPlace"
          label={isEditing ? t("character-detail:fields.birth_place") : ""}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormEntityMultiSelectAuto
              entityType="region"
              bookId={bookId}
              label=""
              placeholder={t("create-character:modal.birth_place_placeholder")}
              noSelectionText={t(
                "create-character:modal.no_birth_place_selected"
              )}
              searchPlaceholder={t("create-character:modal.search_location")}
              value={editData.birthPlace || []}
              onChange={(value) => onEditDataChange("birthPlace", value)}
              labelClassName="text-sm font-medium text-primary"
              maxSelections={1}
            />
          ) : (
            <DisplayEntityList
              label={t("character-detail:fields.birth_place")}
              entities={
                character.birthPlace?.map((regionId) => {
                  const region = regions.find((r) => r.id === regionId);
                  return region
                    ? { id: region.id, name: region.name, image: region.image }
                    : null;
                }).filter(Boolean) as Array<{ id: string; name: string; image?: string }>
              }
              open={openSections.birthPlace}
              onOpenChange={() => toggleSection("birthPlace")}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Nicknames */}
        <FieldWithVisibilityToggle
          fieldName="nicknames"
          label={isEditing ? t("character-detail:fields.nicknames") : ""}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormListInput
              value={editData.nicknames || []}
              onChange={(value) => onEditDataChange("nicknames", value)}
              label=""
              placeholder={t("create-character:modal.nickname_placeholder")}
              buttonText={t("create-character:modal.add_nickname")}
              inputSize="small"
              maxLength={100}
            />
          ) : (
            <DisplayStringList
              label={t("character-detail:fields.nicknames")}
              items={character.nicknames}
              open={openSections.nicknames}
              onOpenChange={() => toggleSection("nicknames")}
            />
          )}
        </FieldWithVisibilityToggle>

        {/* Past */}
        <FieldWithVisibilityToggle
          fieldName="past"
          label={t("character-detail:fields.past")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.past || ""}
                onChange={(e) => onEditDataChange("past", e.target.value)}
                placeholder={t("create-character:modal.past_placeholder")}
                rows={5}
                maxLength={1000}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.past?.length || 0}/1000</span>
              </div>
            </>
          ) : (
            <DisplayTextarea
              value={character.past}
            />
          )}
        </FieldWithVisibilityToggle>
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
      isVisible: sectionVisibility.relationships !== false,
      onVisibilityToggle: () => onSectionVisibilityToggle("relationships"),
    },
    {
      id: "family",
      title: t("character-detail:sections.family"),
      content: (
        <FamilySection
          family={
            (isEditing ? editData.family : character.family) || {
              grandparents: [],
              parents: [],
              spouses: [],
              unclesAunts: [],
              cousins: [],
              children: [],
              siblings: [],
              halfSiblings: [],
            }
          }
          allCharacters={mockCharacters}
          currentCharacterId={character.id}
          bookId={bookId}
          isEditMode={isEditing}
          fieldVisibility={fieldVisibility}
          onFamilyChange={(family) => onEditDataChange("family", family)}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.family !== false,
      onVisibilityToggle: () => onSectionVisibilityToggle("family"),
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
    <VersionsPanel title={t("character-detail:sections.versions")}>
      <EntityVersionManager<
        ICharacterVersion,
        ICharacter,
        ICharacterFormData
      >
        versions={versions}
        currentVersion={currentVersion}
        onVersionChange={onVersionChange}
        onVersionCreate={onVersionCreate}
        baseEntity={character}
        i18nNamespace="character-detail"
        renderVersionCard={({ version, isSelected, onClick }) => {
          // Check if version has valid data
          const hasValidData = !!version.characterData;

          return (
            <div className="relative">
              <div
                className={
                  !hasValidData
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                <VersionCard
                  version={version}
                  isSelected={isSelected}
                  onClick={hasValidData ? onClick : () => {}}
                />
              </div>
              {!hasValidData && !version.isMain && (
                <div className="flex items-center justify-between mt-1 px-2">
                  <div className="text-xs text-destructive">
                    ⚠️ Dados corrompidos
                  </div>
                  <Button
                    variant="ghost-destructive"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onVersionDelete(version.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              )}
            </div>
          );
        }}
        renderCreateDialog={({
          open,
          onClose,
          onConfirm,
          baseEntity,
        }) => (
          <CreateVersionWithEntityDialog<ICharacter, ICharacterFormData>
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            baseEntity={baseEntity}
            i18nNamespace="character-detail"
            renderEntityModal={({
              open,
              onOpenChange,
              onConfirm,
            }) => (
              <CreateCharacterModal
                open={open}
                onClose={() => onOpenChange(false)}
                onConfirm={onConfirm}
                bookId={bookId}
              />
            )}
          />
        )}
      />
    </VersionsPanel>
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

      <div className="w-full">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <EntityDetailLayout
            onBack={onBack}
            backLabel={t("character-detail:header.back")}
            showMenuButton
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
            hasChanges={hasChanges}
            hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
            validationMessage={
              hasRequiredFieldsEmpty ? (
                <p className="text-xs text-destructive">
                  {missingFields.length > 0 ? (
                    <>
                      {t("character-detail:validation.missing_fields")}:{" "}
                      {missingFields
                        .map((field) => {
                          const fieldNames: Record<string, string> = {
                            name: t("character-detail:fields.name"),
                            age: t("character-detail:fields.age"),
                            role: t("character-detail:fields.role"),
                            gender: t("character-detail:fields.gender"),
                            description: t("character-detail:fields.description"),
                          };
                          return fieldNames[field] || field;
                        })
                        .join(", ")}
                    </>
                  ) : (
                    t("character-detail:validation.fill_required_fields")
                  )}
                </p>
              ) : undefined
            }
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
