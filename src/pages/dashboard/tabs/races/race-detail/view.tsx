import React, { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Dna, Users, NotebookPen, Image } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EntityChapterMetricsSection } from "@/components/chapter-metrics/EntityChapterMetricsSection";
import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayText,
  DisplayTextarea,
  DisplayStringList,
  DisplaySelectGrid,
} from "@/components/displays";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormListInput } from "@/components/forms/FormListInput";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CreateRaceModal } from "@/components/modals/create-race-modal";
import { DietPicker } from "@/components/modals/create-race-modal/components/diet-picker";
import { DomainPicker } from "@/components/modals/create-race-modal/components/domain-picker";
import { HabitsPicker } from "@/components/modals/create-race-modal/components/habits-picker";
import { MoralTendencyPicker } from "@/components/modals/create-race-modal/components/moral-tendency-picker";
import { PhysicalCapacityPicker } from "@/components/modals/create-race-modal/components/physical-capacity-picker";
import { ReproductiveCyclePicker } from "@/components/modals/create-race-modal/components/reproductive-cycle-picker";
import { getRaceCommunications } from "@/components/modals/create-race-modal/constants/communications";
import { getRaceDiets } from "@/components/modals/create-race-modal/constants/diets";
import { getRaceHabits } from "@/components/modals/create-race-modal/constants/habits";
import { getRaceMoralTendencies } from "@/components/modals/create-race-modal/constants/moral-tendencies";
import { getRacePhysicalCapacities } from "@/components/modals/create-race-modal/constants/physical-capacities";
import { getRaceReproductiveCycles } from "@/components/modals/create-race-modal/constants/reproductive-cycles";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  VersionsPanel,
  EntityVersionManager,
  CreateVersionWithEntityDialog,
} from "@/components/version-system";

import { getDomainDisplayData } from "../helpers/domain-filter-config";

import { CommunicationDisplay } from "./components/communication-display";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import { RaceNavigationSidebar } from "./components/race-navigation-sidebar";
import { RaceRelationshipsSection } from "./components/race-relationships-section";
import { RaceVersionCard } from "./components/race-version-card";

import type {
  IRaceRelationship,
  IFieldVisibility,
  IRaceVersion,
} from "./types/race-detail-types";
import type { IRace } from "../../types/race-types";

interface RaceDetailViewProps {
  race: IRace;
  editData: IRace;
  isEditing: boolean;
  hasChanges: boolean;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  allRaces: IRace[];
  fieldVisibility: IFieldVisibility;
  sectionVisibility: Record<string, boolean>;
  advancedSectionOpen: boolean;
  relationships: IRaceRelationship[];
  errors: Record<string, string>;
  hasRequiredFieldsEmpty: boolean;
  missingFields: string[];
  bookId: string;
  versions: IRaceVersion[];
  currentVersion: IRaceVersion | null;
  onBack: () => void;
  onNavigationSidebarToggle: () => void;
  onNavigationSidebarClose: () => void;
  onRaceSelect: (raceId: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onConfirmDelete: () => void;
  onEditDataChange: (field: string, value: unknown) => void;
  onFieldVisibilityToggle: (fieldName: string) => void;
  onSectionVisibilityToggle: (sectionName: string) => void;
  onAdvancedSectionToggle: () => void;
  onRelationshipsChange: (relationships: IRaceRelationship[]) => void;
  validateField?: (field: string, value: any) => void;
  openSections: Record<string, boolean>;
  toggleSection: (sectionName: string) => void;
  onVersionChange: (versionId: string | null) => void;
  onVersionCreate: (data: {
    name: string;
    description: string;
    raceData: IRace;
  }) => void;
  onVersionDelete: (versionId: string) => void;
}

// Helper component for empty state
const EmptyFieldState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("race-detail:empty_states.no_data")}</p>
  </div>
);

export function RaceDetailView({
  race,
  editData,
  isEditing,
  hasChanges,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  allRaces,
  fieldVisibility,
  sectionVisibility,
  advancedSectionOpen,
  relationships,
  errors,
  hasRequiredFieldsEmpty,
  missingFields,
  bookId,
  versions,
  currentVersion,
  onBack,
  onNavigationSidebarToggle,
  onNavigationSidebarClose,
  onRaceSelect,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onConfirmDelete,
  onEditDataChange,
  onFieldVisibilityToggle,
  onSectionVisibilityToggle,
  onAdvancedSectionToggle,
  onRelationshipsChange,
  validateField,
  openSections,
  toggleSection,
  onVersionChange,
  onVersionCreate,
  onVersionDelete,
}: RaceDetailViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t } = useTranslation(["race-detail", "create-race"] as any);

  // State for controlled dialog in RaceRelationshipsSection
  const [isAddRelationshipDialogOpen, setIsAddRelationshipDialogOpen] =
    useState(false);

  // Navigation for entity notes
  const navigate = useNavigate();

  // ==================
  // BASIC FIELDS
  // ==================
  const basicFields = (
    <div className="space-y-6">
      {isEditing ? (
        <>
          {/* Image Upload */}
          <div className="flex justify-center -mx-6">
            <div className="w-full max-w-[587px] px-6">
              <FormImageUpload
                value={imagePreview}
                onChange={(value) => onEditDataChange("image", value)}
                label={t("race-detail:fields.image")}
                helperText="opcional"
                height="h-96"
                shape="rounded"
                imageFit="cover"
                placeholderIcon={Dna}
                id="race-image-upload"
              />
            </div>
          </div>

          {/* Name and Scientific Name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-primary">
                {t("race-detail:fields.name")}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                value={editData.name}
                onChange={(e) => onEditDataChange("name", e.target.value)}
                onBlur={() => validateField?.("name", editData.name)}
                placeholder={t("create-race:modal.name_placeholder")}
                maxLength={150}
                className={errors.name ? "border-destructive" : ""}
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.name?.length || 0}/150</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-primary">
                {t("race-detail:fields.scientific_name")}
                <span className="text-xs text-muted-foreground ml-1">
                  (opcional)
                </span>
              </Label>
              <Input
                value={editData.scientificName || ""}
                onChange={(e) =>
                  onEditDataChange("scientificName", e.target.value)
                }
                placeholder={t("create-race:modal.scientific_name_placeholder")}
                maxLength={150}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.scientificName?.length || 0}/150</span>
              </div>
            </div>
          </div>

          {/* Domain */}
          <div className="space-y-2">
            <Label className="text-primary">
              {t("race-detail:fields.domain")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <DomainPicker
              value={editData.domain || []}
              onChange={(value) => {
                onEditDataChange("domain", value);
                validateField?.("domain", value);
              }}
              hideLabel
            />
            {errors.domain && (
              <p className="text-sm text-destructive">{errors.domain}</p>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label className="text-primary">
              {t("race-detail:fields.summary")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              value={editData.summary || ""}
              onChange={(e) => onEditDataChange("summary", e.target.value)}
              onBlur={() => validateField?.("summary", editData.summary)}
              placeholder={t("create-race:modal.summary_placeholder")}
              rows={4}
              maxLength={500}
              className={
                errors.summary
                  ? "resize-none border-destructive"
                  : "resize-none"
              }
              required
            />
            {errors.summary && (
              <p className="text-xs text-destructive">{errors.summary}</p>
            )}
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{editData.summary?.length || 0}/500</span>
            </div>
          </div>
        </>
      ) : (
        // View Mode - Similar to Race Card structure
        <>
          {/* Image Display */}
          <div className="flex justify-center -mx-6">
            <div className="w-full max-w-[587px] px-6">
              {race.image ? (
                <div className="relative w-full h-80 rounded-lg overflow-hidden border">
                  <img
                    src={race.image}
                    alt={race.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full h-80 rounded-lg overflow-hidden">
                  <FormImageDisplay
                    icon={Dna}
                    height="h-full"
                    width="w-full"
                    shape="square"
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Race Info - Card style with fields stacked */}
          <div className="space-y-3">
            {/* Name */}
            <div>
              <h2 className="text-3xl font-bold">{race.name}</h2>
            </div>

            {/* Scientific Name */}
            {race.scientificName && (
              <div>
                <p className="text-sm italic text-muted-foreground mt-1">
                  {race.scientificName}
                </p>
              </div>
            )}

            {/* Domains */}
            {race.domain && race.domain.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {race.domain.map((domainValue) => {
                  const { icon: DomainIcon, colorConfig } =
                    getDomainDisplayData(domainValue, t);

                  if (!DomainIcon || !colorConfig) return null;

                  return (
                    <Badge
                      key={domainValue}
                      className={`flex items-center gap-1 ${colorConfig.inactiveClasses} px-2 py-0.5 pointer-events-none`}
                    >
                      <DomainIcon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{domainValue}</span>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Summary */}
            <div>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {race.summary || (
                  <span className="italic text-muted-foreground/60">
                    {t("race-detail:empty_states.no_data")}
                  </span>
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // ==================
  // ADVANCED FIELDS
  // ==================
  // Helper function to check if all fields in a group are hidden
  const areAllFieldsHidden = (fieldNames: string[]): boolean => {
    if (isEditing) return false; // Never hide sections in edit mode
    return fieldNames.every(
      (fieldName) => fieldVisibility[fieldName] === false
    );
  };

  // Define field groups for each mini-section
  const cultureFields = ["alternativeNames", "culturalNotes"];
  const appearanceFields = [
    "generalAppearance",
    "lifeExpectancy",
    "averageHeight",
    "averageWeight",
    "specialPhysicalCharacteristics",
  ];
  const behaviorsFields = [
    "habits",
    "reproductiveCycle",
    "diet",
    "communication",
    "moralTendency",
    "socialOrganization",
    "habitat",
  ];
  const powerFields = [
    "physicalCapacity",
    "specialCharacteristics",
    "weaknesses",
  ];
  const narrativeFields = ["storyMotivation", "inspirations"];

  // Check if mini-sections should be hidden
  const hideCultureSection = areAllFieldsHidden(cultureFields);
  const hideAppearanceSection = areAllFieldsHidden(appearanceFields);
  const hideBehaviorsSection = areAllFieldsHidden(behaviorsFields);
  const hidePowerSection = areAllFieldsHidden(powerFields);
  const hideNarrativeSection = areAllFieldsHidden(narrativeFields);

  // Check if entire advanced section should be hidden
  const hideEntireAdvancedSection =
    hideCultureSection &&
    hideAppearanceSection &&
    hideBehaviorsSection &&
    hidePowerSection &&
    hideNarrativeSection;

  const advancedFields = hideEntireAdvancedSection ? null : (
    <div className="space-y-6">
      {/* CULTURA Section */}
      {!hideCultureSection && (
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("race-detail:sections.culture")}
          </h4>

          {/* Alternative Names */}
          <FieldWithVisibilityToggle
            fieldName="alternativeNames"
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <FormListInput
                value={editData.alternativeNames || []}
                onChange={(value) =>
                  onEditDataChange("alternativeNames", value)
                }
                label={t("race-detail:fields.alternative_names")}
                placeholder={t(
                  "create-race:modal.alternative_names_placeholder"
                )}
                buttonText={t("create-race:modal.add_name")}
                maxLength={100}
                inputSize="small"
                labelClassName="text-sm font-medium text-primary"
              />
            ) : (
              <DisplayStringList
                label={t("race-detail:fields.alternative_names")}
                items={race.alternativeNames}
              />
            )}
          </FieldWithVisibilityToggle>

          {/* Cultural Notes */}
          <FieldWithVisibilityToggle
            fieldName="culturalNotes"
            label={t("race-detail:fields.cultural_notes")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <>
                <Textarea
                  value={editData.culturalNotes || ""}
                  onChange={(e) =>
                    onEditDataChange("culturalNotes", e.target.value)
                  }
                  placeholder={t(
                    "create-race:modal.cultural_notes_placeholder"
                  )}
                  rows={6}
                  maxLength={1500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.culturalNotes?.length || 0}/1500</span>
                </div>
              </>
            ) : (
              <DisplayTextarea value={race.culturalNotes} />
            )}
          </FieldWithVisibilityToggle>
        </div>
      )}

      {/* Separator between Culture and Appearance - only show if both sections are visible */}
      {!hideCultureSection && !hideAppearanceSection && <Separator />}

      {/* APARÊNCIA Section */}
      {!hideAppearanceSection && (
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("race-detail:sections.appearance")}
          </h4>

          {/* General Appearance */}
          <FieldWithVisibilityToggle
            fieldName="generalAppearance"
            label={t("race-detail:fields.general_appearance")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <>
                <Textarea
                  value={editData.generalAppearance || ""}
                  onChange={(e) =>
                    onEditDataChange("generalAppearance", e.target.value)
                  }
                  placeholder={t(
                    "create-race:modal.general_appearance_placeholder"
                  )}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.generalAppearance?.length || 0}/500</span>
                </div>
              </>
            ) : (
              <DisplayTextarea value={race.generalAppearance} />
            )}
          </FieldWithVisibilityToggle>

          {/* Life Expectancy, Height, Weight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FieldWithVisibilityToggle
              fieldName="lifeExpectancy"
              label={t("race-detail:fields.life_expectancy")}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Input
                    value={editData.lifeExpectancy || ""}
                    onChange={(e) =>
                      onEditDataChange("lifeExpectancy", e.target.value)
                    }
                    placeholder={t(
                      "create-race:modal.life_expectancy_placeholder"
                    )}
                    maxLength={100}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.lifeExpectancy?.length || 0}/100</span>
                  </div>
                </>
              ) : (
                <DisplayText value={race.lifeExpectancy} />
              )}
            </FieldWithVisibilityToggle>

            <FieldWithVisibilityToggle
              fieldName="averageHeight"
              label={t("race-detail:fields.average_height")}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Input
                    value={editData.averageHeight || ""}
                    onChange={(e) =>
                      onEditDataChange("averageHeight", e.target.value)
                    }
                    placeholder={t(
                      "create-race:modal.average_height_placeholder"
                    )}
                    maxLength={100}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.averageHeight?.length || 0}/100</span>
                  </div>
                </>
              ) : (
                <DisplayText value={race.averageHeight} />
              )}
            </FieldWithVisibilityToggle>

            <FieldWithVisibilityToggle
              fieldName="averageWeight"
              label={t("race-detail:fields.average_weight")}
              isOptional
              fieldVisibility={fieldVisibility}
              isEditing={isEditing}
              onFieldVisibilityToggle={onFieldVisibilityToggle}
            >
              {isEditing ? (
                <>
                  <Input
                    value={editData.averageWeight || ""}
                    onChange={(e) =>
                      onEditDataChange("averageWeight", e.target.value)
                    }
                    placeholder={t(
                      "create-race:modal.average_weight_placeholder"
                    )}
                    maxLength={100}
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{editData.averageWeight?.length || 0}/100</span>
                  </div>
                </>
              ) : (
                <DisplayText value={race.averageWeight} />
              )}
            </FieldWithVisibilityToggle>
          </div>

          {/* Special Physical Characteristics */}
          <FieldWithVisibilityToggle
            fieldName="specialPhysicalCharacteristics"
            label={t("race-detail:fields.special_physical_characteristics")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <>
                <Textarea
                  value={editData.specialPhysicalCharacteristics || ""}
                  onChange={(e) =>
                    onEditDataChange(
                      "specialPhysicalCharacteristics",
                      e.target.value
                    )
                  }
                  placeholder={t(
                    "create-race:modal.special_physical_characteristics_placeholder"
                  )}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>
                    {editData.specialPhysicalCharacteristics?.length || 0}/500
                  </span>
                </div>
              </>
            ) : (
              <DisplayTextarea value={race.specialPhysicalCharacteristics} />
            )}
          </FieldWithVisibilityToggle>
        </div>
      )}

      {/* Separator between Appearance and Behaviors - only show if both sections are visible */}
      {!hideAppearanceSection && !hideBehaviorsSection && <Separator />}

      {/* COMPORTAMENTOS Section */}
      {!hideBehaviorsSection && (
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("race-detail:sections.behaviors")}
          </h4>

          {/* Habits */}
          <FieldWithVisibilityToggle
            fieldName="habits"
            label={t("race-detail:fields.habits")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <HabitsPicker
                value={editData.habits || ""}
                onChange={(value) => onEditDataChange("habits", value)}
                hideLabel
              />
            ) : (
              <DisplaySelectGrid
                value={race.habits}
                options={getRaceHabits(t)}
              />
            )}
          </FieldWithVisibilityToggle>

          {/* Reproductive Cycle */}
          <FieldWithVisibilityToggle
            fieldName="reproductiveCycle"
            label={t("race-detail:fields.reproductive_cycle")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <ReproductiveCyclePicker
                value={editData.reproductiveCycle || ""}
                onChange={(value) =>
                  onEditDataChange("reproductiveCycle", value)
                }
                otherCycleDescription={editData.otherCycleDescription || ""}
                onOtherCycleDescriptionChange={(value) =>
                  onEditDataChange("otherCycleDescription", value)
                }
                hideLabel
              />
            ) : (
              <DisplaySelectGrid
                value={race.reproductiveCycle}
                options={getRaceReproductiveCycles(t)}
              />
            )}
          </FieldWithVisibilityToggle>

          {/* Diet */}
          <FieldWithVisibilityToggle
            fieldName="diet"
            label={t("race-detail:fields.diet")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <DietPicker
                value={editData.diet || ""}
                onChange={(value) => onEditDataChange("diet", value)}
                elementalDiet={editData.elementalDiet || ""}
                onElementalDietChange={(value) =>
                  onEditDataChange("elementalDiet", value)
                }
                hideLabel
              />
            ) : (
              <DisplaySelectGrid value={race.diet} options={getRaceDiets(t)} />
            )}
          </FieldWithVisibilityToggle>

          {/* Communication */}
          <FieldWithVisibilityToggle
            fieldName="communication"
            label={t("race-detail:fields.communication")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <CommunicationDisplay
                communications={editData.communication || []}
                isEditing={isEditing}
                otherCommunication={editData.otherCommunication || ""}
                onCommunicationsChange={(communications) =>
                  onEditDataChange("communication", communications)
                }
                onOtherCommunicationChange={(value) =>
                  onEditDataChange("otherCommunication", value)
                }
              />
            ) : race.communication && race.communication.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {race.communication.map((commValue) => {
                  const commOption = getRaceCommunications(t).find(
                    (c) => c.value === commValue
                  );
                  if (!commOption) return null;

                  // Convert to DisplaySelectGrid format
                  const displayOption = {
                    value: commOption.value,
                    label: commOption.label,
                    description: commOption.description,
                    icon: commOption.icon,
                    backgroundColor: commOption.color.includes("blue")
                      ? "blue-500/10"
                      : commOption.color.includes("purple")
                        ? "purple-500/10"
                        : commOption.color.includes("green")
                          ? "green-500/10"
                          : commOption.color.includes("amber")
                            ? "amber-500/10"
                            : commOption.color.includes("violet")
                              ? "violet-500/10"
                              : "gray-500/10",
                    borderColor: commOption.color.includes("blue")
                      ? "blue-500/30"
                      : commOption.color.includes("purple")
                        ? "purple-500/30"
                        : commOption.color.includes("green")
                          ? "green-500/30"
                          : commOption.color.includes("amber")
                            ? "amber-500/30"
                            : commOption.color.includes("violet")
                              ? "violet-500/30"
                              : "gray-500/30",
                  };

                  return (
                    <DisplaySelectGrid
                      key={commValue}
                      value={commValue}
                      options={[displayOption]}
                    />
                  );
                })}
              </div>
            ) : (
              <DisplaySelectGrid
                value={null}
                options={getRaceCommunications(t).map((c) => ({
                  value: c.value,
                  label: c.label,
                  description: c.description,
                  icon: c.icon,
                  backgroundColor: c.color.includes("blue")
                    ? "blue-500/10"
                    : c.color.includes("purple")
                      ? "purple-500/10"
                      : c.color.includes("green")
                        ? "green-500/10"
                        : c.color.includes("amber")
                          ? "amber-500/10"
                          : c.color.includes("violet")
                            ? "violet-500/10"
                            : "gray-500/10",
                  borderColor: c.color.includes("blue")
                    ? "blue-500/30"
                    : c.color.includes("purple")
                      ? "purple-500/30"
                      : c.color.includes("green")
                        ? "green-500/30"
                        : c.color.includes("amber")
                          ? "amber-500/30"
                          : c.color.includes("violet")
                            ? "violet-500/30"
                            : "gray-500/30",
                }))}
              />
            )}
          </FieldWithVisibilityToggle>

          {/* Moral Tendency */}
          <FieldWithVisibilityToggle
            fieldName="moralTendency"
            label={t("race-detail:fields.moral_tendency")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <MoralTendencyPicker
                value={editData.moralTendency || ""}
                onChange={(value) => onEditDataChange("moralTendency", value)}
                hideLabel
              />
            ) : (
              <DisplaySelectGrid
                value={race.moralTendency}
                options={getRaceMoralTendencies(t)}
              />
            )}
          </FieldWithVisibilityToggle>

          {/* Social Organization */}
          <FieldWithVisibilityToggle
            fieldName="socialOrganization"
            label={t("race-detail:fields.social_organization")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <>
                <Textarea
                  value={editData.socialOrganization || ""}
                  onChange={(e) =>
                    onEditDataChange("socialOrganization", e.target.value)
                  }
                  placeholder={t(
                    "create-race:modal.social_organization_placeholder"
                  )}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.socialOrganization?.length || 0}/500</span>
                </div>
              </>
            ) : (
              <DisplayTextarea value={race.socialOrganization} />
            )}
          </FieldWithVisibilityToggle>

          {/* Habitat */}
          <FieldWithVisibilityToggle
            fieldName="habitat"
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <FormListInput
                value={editData.habitat || []}
                onChange={(value) => onEditDataChange("habitat", value)}
                label={t("race-detail:fields.habitat")}
                placeholder={t("create-race:modal.habitat_placeholder")}
                buttonText={t("create-race:modal.add_habitat")}
                maxLength={50}
                inputSize="small"
                labelClassName="text-sm font-medium text-primary"
              />
            ) : (
              <DisplayStringList
                label={t("race-detail:fields.habitat")}
                items={race.habitat}
              />
            )}
          </FieldWithVisibilityToggle>
        </div>
      )}

      {/* Separator between Behaviors and Power - only show if both sections are visible */}
      {!hideBehaviorsSection && !hidePowerSection && <Separator />}

      {/* PODER Section */}
      {!hidePowerSection && (
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("race-detail:sections.power")}
          </h4>

          {/* Physical Capacity */}
          <FieldWithVisibilityToggle
            fieldName="physicalCapacity"
            label={t("race-detail:fields.physical_capacity")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <PhysicalCapacityPicker
                value={editData.physicalCapacity || ""}
                onChange={(value) =>
                  onEditDataChange("physicalCapacity", value)
                }
                hideLabel
              />
            ) : (
              <DisplaySelectGrid
                value={race.physicalCapacity}
                options={getRacePhysicalCapacities(t)}
              />
            )}
          </FieldWithVisibilityToggle>

          {/* Special Characteristics */}
          <FieldWithVisibilityToggle
            fieldName="specialCharacteristics"
            label={t("race-detail:fields.special_characteristics")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <>
                <Textarea
                  value={editData.specialCharacteristics || ""}
                  onChange={(e) =>
                    onEditDataChange("specialCharacteristics", e.target.value)
                  }
                  placeholder={t(
                    "create-race:modal.special_characteristics_placeholder"
                  )}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>
                    {editData.specialCharacteristics?.length || 0}/500
                  </span>
                </div>
              </>
            ) : (
              <DisplayTextarea value={race.specialCharacteristics} />
            )}
          </FieldWithVisibilityToggle>

          {/* Weaknesses */}
          <FieldWithVisibilityToggle
            fieldName="weaknesses"
            label={t("race-detail:fields.weaknesses")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <>
                <Textarea
                  value={editData.weaknesses || ""}
                  onChange={(e) =>
                    onEditDataChange("weaknesses", e.target.value)
                  }
                  placeholder={t("create-race:modal.weaknesses_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.weaknesses?.length || 0}/500</span>
                </div>
              </>
            ) : (
              <DisplayTextarea value={race.weaknesses} />
            )}
          </FieldWithVisibilityToggle>
        </div>
      )}

      {/* Separator between Power and Narrative - only show if both sections are visible */}
      {!hidePowerSection && !hideNarrativeSection && <Separator />}

      {/* NARRATIVA Section */}
      {!hideNarrativeSection && (
        <div className="space-y-4">
          <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
            {t("race-detail:sections.narrative")}
          </h4>

          {/* Story Motivation */}
          <FieldWithVisibilityToggle
            fieldName="storyMotivation"
            label={t("race-detail:fields.story_motivation")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <>
                <Textarea
                  value={editData.storyMotivation || ""}
                  onChange={(e) =>
                    onEditDataChange("storyMotivation", e.target.value)
                  }
                  placeholder={t(
                    "create-race:modal.story_motivation_placeholder"
                  )}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.storyMotivation?.length || 0}/500</span>
                </div>
              </>
            ) : (
              <DisplayTextarea value={race.storyMotivation} />
            )}
          </FieldWithVisibilityToggle>

          {/* Inspirations */}
          <FieldWithVisibilityToggle
            fieldName="inspirations"
            label={t("race-detail:fields.inspirations")}
            isOptional
            fieldVisibility={fieldVisibility}
            isEditing={isEditing}
            onFieldVisibilityToggle={onFieldVisibilityToggle}
          >
            {isEditing ? (
              <>
                <Textarea
                  value={editData.inspirations || ""}
                  onChange={(e) =>
                    onEditDataChange("inspirations", e.target.value)
                  }
                  placeholder={t("create-race:modal.inspirations_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.inspirations?.length || 0}/500</span>
                </div>
              </>
            ) : (
              <DisplayTextarea value={race.inspirations} />
            )}
          </FieldWithVisibilityToggle>
        </div>
      )}
    </div>
  );

  // ==================
  // EXTRA SECTIONS
  // ==================
  // Calculate available races for relationships
  const availableRacesForRelationships = allRaces.filter(
    (r) => r.id !== race.id && !relationships.some((rel) => rel.raceId === r.id)
  );

  const extraSections = [
    {
      id: "relationships",
      title: t("race-detail:sections.relationships"),
      content: (
        <RaceRelationshipsSection
          relationships={relationships}
          allRaces={allRaces}
          currentRaceId={race.id}
          isEditMode={isEditing}
          onRelationshipsChange={onRelationshipsChange}
          isAddDialogOpen={isAddRelationshipDialogOpen}
          onAddDialogOpenChange={setIsAddRelationshipDialogOpen}
        />
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.relationships !== false,
      onVisibilityToggle: () => onSectionVisibilityToggle("relationships"),
      // Empty states
      emptyState: (() => {
        // Estado 3: Bloqueado - não há raças suficientes
        if (allRaces.length <= 1 && isEditing) {
          return "blocked-no-data";
        }

        // Estado 4: Bloqueado - todas as raças disponíveis foram usadas
        if (
          isEditing &&
          relationships.length > 0 &&
          availableRacesForRelationships.length === 0
        ) {
          return "blocked-all-used";
        }

        // Estado 1: Vazio em visualização
        if (relationships.length === 0 && !isEditing) {
          return "empty-view";
        }

        // Estado 2: Vazio em edição
        if (relationships.length === 0 && isEditing) {
          return "empty-edit";
        }

        return null;
      })(),
      emptyIcon: Users,
      emptyTitle: t("race-detail:empty_states.no_relationships"),
      emptyDescription: t("race-detail:empty_states.no_relationships_hint"),
      addButtonLabel: t("race-detail:relationships.add_relationship"),
      onAddClick: () => setIsAddRelationshipDialogOpen(true),
      blockedEntityName: "raças",
    },
    // Chapter Metrics section (only visible in view mode)
    ...(!isEditing
      ? [
          {
            id: "chapter-metrics",
            title: t("chapter-metrics:entity_section.title"),
            content: (
              <EntityChapterMetricsSection
                bookId={bookId}
                entityId={race.id}
                entityType="race"
                onChapterClick={(chapterId) =>
                  navigate({
                    to: "/dashboard/$dashboardId/chapters/$chapterId",
                    params: { dashboardId: bookId, chapterId },
                  })
                }
              />
            ),
            isCollapsible: true,
            defaultOpen: false,
          },
        ]
      : []),
  ];

  // Validation message
  const validationMessage = hasRequiredFieldsEmpty ? (
    <p className="text-xs text-destructive">
      {missingFields.length > 0 ? (
        <>
          {t("race-detail:validation.missing_fields")}:{" "}
          {missingFields
            .map((field) => {
              const fieldNames: Record<string, string> = {
                name: t("race-detail:fields.name"),
                domain: t("race-detail:fields.domain"),
                summary: t("race-detail:fields.summary"),
              };
              return fieldNames[field] || field;
            })
            .join(", ")}
        </>
      ) : (
        t("race-detail:validation.fill_required_fields")
      )}
    </p>
  ) : undefined;

  // Versions Panel
  const versionsPanel = (
    <VersionsPanel title={t("race-detail:sections.versions")}>
      <EntityVersionManager<IRaceVersion, IRace, IRace>
        versions={versions}
        currentVersion={currentVersion}
        onVersionChange={onVersionChange}
        onVersionCreate={(data) => {
          onVersionCreate({
            name: data.name,
            description: data.description,
            raceData: data.entityData,
          });
        }}
        baseEntity={race}
        i18nNamespace="race-detail"
        renderVersionCard={({ version, isSelected, onClick }) => (
          <RaceVersionCard
            version={version}
            isSelected={isSelected}
            onClick={onClick}
          />
        )}
        renderCreateDialog={({ open, onClose, onConfirm, baseEntity }) => (
          <CreateVersionWithEntityDialog<IRace, IRace>
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            baseEntity={baseEntity}
            i18nNamespace="race-detail"
            renderEntityModal={({ open, onOpenChange, onConfirm }) => (
              <CreateRaceModal
                open={open}
                onClose={() => onOpenChange(false)}
                onConfirm={onConfirm}
                availableRaces={allRaces}
                bookId={bookId}
              />
            )}
          />
        )}
      />
    </VersionsPanel>
  );

  return (
    <div className="relative">
      {/* Navigation Sidebar */}
      <RaceNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        currentRaceId={race.id}
        allRaces={allRaces}
        onRaceSelect={onRaceSelect}
      />

      {/* Main Layout */}
      <div className="w-full">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <EntityDetailLayout
            // Header
            onBack={onBack}
            backLabel={t("race-detail:buttons.back")}
            showMenuButton
            onMenuToggle={onNavigationSidebarToggle}
            menuTooltip={t("common:tooltips.quick_navigation")}
            editTooltip={t("common:tooltips.edit")}
            deleteTooltip={t("common:tooltips.delete")}
            extraActions={[
              {
                label: t("race-detail:buttons.notes"),
                icon: NotebookPen,
                onClick: () =>
                  navigate({
                    to: "/dashboard/$dashboardId/notes/entity/$entityType/$entityId",
                    params: {
                      dashboardId: bookId,
                      entityType: "race",
                      entityId: race.id,
                    },
                    search: { entityName: race.name },
                  }),
                tooltip: t("race-detail:buttons.notes"),
              },
              {
                label: t("race-detail:buttons.gallery"),
                icon: Image,
                onClick: () =>
                  navigate({
                    to: "/dashboard/$dashboardId/gallery/entity/$entityType/$entityId",
                    params: {
                      dashboardId: bookId,
                      entityType: "race",
                      entityId: race.id,
                    },
                    search: { entityName: race.name },
                  }),
                tooltip: t("race-detail:buttons.gallery"),
              },
            ]}
            // Mode
            isEditMode={isEditing}
            // Actions
            onEdit={onEdit}
            onDelete={onDeleteModalOpen}
            editLabel={t("race-detail:buttons.edit")}
            deleteLabel={t("race-detail:buttons.delete")}
            // Edit mode actions
            onSave={onSave}
            onCancel={onCancel}
            saveLabel={t("race-detail:buttons.save")}
            cancelLabel={t("race-detail:buttons.cancel")}
            hasChanges={hasChanges}
            hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
            validationMessage={validationMessage}
            // Content
            basicFields={basicFields}
            advancedFields={advancedFields}
            advancedSectionTitle={t("race-detail:sections.advanced_info")}
            advancedSectionOpen={advancedSectionOpen}
            onAdvancedSectionToggle={onAdvancedSectionToggle}
            // Extra sections
            extraSections={extraSections}
            // Versions panel
            versionsPanel={versionsPanel}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        raceName={race.name}
        currentVersion={currentVersion}
        versionName={currentVersion?.name}
        totalVersions={versions.length}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  );
}
