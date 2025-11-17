import React from "react";

import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Shield,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { CharacterNavigationSidebar } from "@/components/character-navigation-sidebar";
import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormSimpleGrid } from "@/components/forms/FormSimpleGrid";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CreateCharacterModal } from "@/components/modals/create-character-modal";
import { CHARACTER_ARCHETYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-archetypes";
import { type ICharacterRole } from "@/components/modals/create-character-modal/constants/character-roles";
import { type IGender as IGenderModal } from "@/components/modals/create-character-modal/constants/genders";
import {
  PHYSICAL_TYPE_ACTIVE_COLOR,
  PHYSICAL_TYPE_BASE_COLOR,
  PHYSICAL_TYPE_HOVER_COLOR,
} from "@/components/modals/create-character-modal/constants/physical-type-colors";
import { PHYSICAL_TYPES_CONSTANT } from "@/components/modals/create-character-modal/constants/physical-types";
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
  EntityVersionManager,
  CreateVersionWithEntityDialog,
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
  roles,
  genders,
  currentRole,
  currentAlignment,
  currentGender,
  RoleIcon,
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
    baseColorClass: "bg-card text-muted-foreground border-border",
    hoverColorClass: "hover:bg-purple-500/10 hover:border-purple-500/20",
    activeColorClass: "bg-purple-500/20 border-purple-500/30 ring-2 ring-purple-500/50 text-white",
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
              showLabel={false}
              placeholderIcon={User}
              placeholderText={t("create-character:modal.upload_image")}
              placeholderTextSize="text-[0.5rem]"
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
            ) : character.height ? (
              <p className="text-sm">{character.height}</p>
            ) : (
              <EmptyFieldState t={t} />
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
            ) : character.weight ? (
              <p className="text-sm">{character.weight}</p>
            ) : (
              <EmptyFieldState t={t} />
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
          ) : character.skinTone ? (
            <p className="text-sm">{character.skinTone}</p>
          ) : (
            <EmptyFieldState t={t} />
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
            ) : (character as any)[field] ? (
              <p className="text-sm">{(character as any)[field]}</p>
            ) : (
              <EmptyFieldState t={t} />
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
              emptyText={t("create-character:modal.no_species_warning")}
              noSelectionText={t("create-character:modal.no_species_selected")}
              searchPlaceholder={t("create-character:modal.search_species")}
              value={editData.speciesAndRace || []}
              onChange={(value) => onEditDataChange("speciesAndRace", value)}
              labelClassName="text-sm font-medium text-primary"
            />
          ) : (
            <Collapsible
              open={openSections.speciesAndRace}
              onOpenChange={() => toggleSection("speciesAndRace")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                <p className="text-sm font-semibold text-primary">
                  {t("create-character:modal.species_and_race")}
                  {character.speciesAndRace &&
                    character.speciesAndRace.length > 0 && (
                      <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                        ({character.speciesAndRace.length})
                      </span>
                    )}
                </p>
                {openSections.speciesAndRace ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                {character.speciesAndRace &&
                character.speciesAndRace.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {character.speciesAndRace.map((raceId) => (
                      <div
                        key={raceId}
                        className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                      >
                        <span className="text-sm font-medium">{raceId}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyFieldState t={t} />
                )}
              </CollapsibleContent>
            </Collapsible>
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
          ) : character.distinguishingFeatures ? (
            <p className="text-sm whitespace-pre-wrap">
              {character.distinguishingFeatures}
            </p>
          ) : (
            <EmptyFieldState t={t} />
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
              ) : (character as any)[field] ? (
                <p className="text-sm">{(character as any)[field]}</p>
              ) : (
                <EmptyFieldState t={t} />
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
              ) : (character as any)[field] ? (
                <p className="text-sm whitespace-pre-wrap">
                  {(character as any)[field]}
                </p>
              ) : (
                <EmptyFieldState t={t} />
              )}
            </FieldWithVisibilityToggle>
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
              emptyText={t("create-character:modal.no_locations_warning")}
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
            <Collapsible
              open={openSections.birthPlace}
              onOpenChange={() => toggleSection("birthPlace")}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
                <p className="text-sm font-semibold text-primary">
                  {t("character-detail:fields.birth_place")}
                  {character.birthPlace && character.birthPlace.length > 0 && (
                    <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                      ({character.birthPlace.length})
                    </span>
                  )}
                </p>
                {openSections.birthPlace ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                {character.birthPlace && character.birthPlace.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {character.birthPlace.map((regionId) => (
                      <div
                        key={regionId}
                        className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                      >
                        <span className="text-sm font-medium">{regionId}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyFieldState t={t} />
                )}
              </CollapsibleContent>
            </Collapsible>
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
    <Card className="card-magical sticky top-24 flex flex-col max-h-[calc(100vh-8rem)]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-base">
          {t("character-detail:sections.versions")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-6 pt-0 overflow-hidden">
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
