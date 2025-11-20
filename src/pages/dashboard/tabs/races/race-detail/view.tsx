import React from "react";

import { Dna } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { DietPicker } from "@/components/modals/create-race-modal/components/diet-picker";
import { DomainPicker } from "@/components/modals/create-race-modal/components/domain-picker";
import { HabitsPicker } from "@/components/modals/create-race-modal/components/habits-picker";
import { MoralTendencyPicker } from "@/components/modals/create-race-modal/components/moral-tendency-picker";
import { PhysicalCapacityPicker } from "@/components/modals/create-race-modal/components/physical-capacity-picker";
import { ReproductiveCyclePicker } from "@/components/modals/create-race-modal/components/reproductive-cycle-picker";
import { RACE_COMMUNICATIONS } from "@/components/modals/create-race-modal/constants/communications";
import { DIET_OPTIONS } from "@/components/modals/create-race-modal/constants/diets";
import { DOMAIN_CONSTANT } from "@/components/modals/create-race-modal/constants/domains";
import { HABITS_OPTIONS } from "@/components/modals/create-race-modal/constants/habits";
import { MORAL_TENDENCY_OPTIONS } from "@/components/modals/create-race-modal/constants/moral-tendencies";
import { PHYSICAL_CAPACITY_OPTIONS } from "@/components/modals/create-race-modal/constants/physical-capacities";
import { REPRODUCTIVE_CYCLE_OPTIONS } from "@/components/modals/create-race-modal/constants/reproductive-cycles";
import { DeleteEntityModal } from "@/components/modals/delete-entity-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { CommunicationDisplay } from "./components/communication-display";
import { RaceNavigationSidebar } from "./components/race-navigation-sidebar";
import { RaceRelationshipsSection } from "./components/race-relationships-section";
import { RaceViewsDisplay } from "./components/race-views-display";

import type {
  IRaceRelationship,
  IFieldVisibility,
} from "./types/race-detail-types";
import type { IRace, IRaceGroup } from "../../types/race-types";

interface RaceDetailViewProps {
  race: IRace;
  editData: IRace;
  isEditing: boolean;
  hasChanges: boolean;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  allRaces: IRace[];
  raceGroups: IRaceGroup[];
  fieldVisibility: IFieldVisibility;
  sectionVisibility: Record<string, boolean>;
  advancedSectionOpen: boolean;
  relationships: IRaceRelationship[];
  errors: Record<string, string>;
  hasRequiredFieldsEmpty: boolean;
  missingFields: string[];
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
  raceGroups,
  fieldVisibility,
  sectionVisibility,
  advancedSectionOpen,
  relationships,
  errors,
  hasRequiredFieldsEmpty,
  missingFields,
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
}: RaceDetailViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t } = useTranslation(["race-detail", "create-race"] as any);

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
                helperText={t("create-race:modal.image_recommended")}
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
              </Label>
              <Input
                value={editData.scientificName || ""}
                onChange={(e) => onEditDataChange("scientificName", e.target.value)}
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
              onChange={(value) => onEditDataChange("domain", value)}
            />
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
              className={errors.summary ? "resize-none border-destructive" : "resize-none"}
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
                  const domainData = DOMAIN_CONSTANT.find(
                    (d) => d.value === domainValue
                  );
                  const DomainIcon = domainData?.icon;

                  if (!domainData || !DomainIcon) return null;

                  return (
                    <Badge
                      key={domainValue}
                      className={`flex items-center gap-1 ${domainData.activeColor} bg-transparent border px-2 py-0.5 pointer-events-none`}
                    >
                      <DomainIcon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">
                        {domainData.label}
                      </span>
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
  const advancedFields = (
    <div className="space-y-6">
      {/* CULTURA Section */}
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
              onChange={(value) => onEditDataChange("alternativeNames", value)}
              label={t("race-detail:fields.alternative_names")}
              placeholder={t("create-race:modal.alternative_names_placeholder")}
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

        {/* Race Views */}
        <FieldWithVisibilityToggle
          fieldName="raceViews"
          label={t("race-detail:fields.race_views")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <RaceViewsDisplay
              views={editData.raceViews || []}
              isEditing={isEditing}
              allRaces={allRaces}
              onViewsChange={(views) => onEditDataChange("raceViews", views)}
            />
          ) : race.raceViews && race.raceViews.length > 0 ? (
            <RaceViewsDisplay
              views={race.raceViews}
              isEditing={false}
              allRaces={allRaces}
              onViewsChange={() => {}}
            />
          ) : (
            <EmptyFieldState t={t} />
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
                onChange={(e) => onEditDataChange("culturalNotes", e.target.value)}
                placeholder={t("create-race:modal.cultural_notes_placeholder")}
                rows={6}
                maxLength={1500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.culturalNotes?.length || 0}/1500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea
              value={race.culturalNotes}
            />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* APARÊNCIA Section */}
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
                onChange={(e) => onEditDataChange("generalAppearance", e.target.value)}
                placeholder={t("create-race:modal.general_appearance_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.generalAppearance?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea
              value={race.generalAppearance}
            />
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
                  onChange={(e) => onEditDataChange("lifeExpectancy", e.target.value)}
                  placeholder={t("create-race:modal.life_expectancy_placeholder")}
                  maxLength={100}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.lifeExpectancy?.length || 0}/100</span>
                </div>
              </>
            ) : (
              <DisplayText
                value={race.lifeExpectancy}
                />
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
                  onChange={(e) => onEditDataChange("averageHeight", e.target.value)}
                  placeholder={t("create-race:modal.average_height_placeholder")}
                  maxLength={100}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.averageHeight?.length || 0}/100</span>
                </div>
              </>
            ) : (
              <DisplayText
                value={race.averageHeight}
                />
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
                  onChange={(e) => onEditDataChange("averageWeight", e.target.value)}
                  placeholder={t("create-race:modal.average_weight_placeholder")}
                  maxLength={100}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{editData.averageWeight?.length || 0}/100</span>
                </div>
              </>
            ) : (
              <DisplayText
                value={race.averageWeight}
                />
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
                  onEditDataChange("specialPhysicalCharacteristics", e.target.value)
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
            <DisplayTextarea
              value={race.specialPhysicalCharacteristics}
            />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* COMPORTAMENTOS Section */}
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
            />
          ) : (
            <DisplaySelectGrid
              value={race.habits}
              options={HABITS_OPTIONS}
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
              onChange={(value) => onEditDataChange("reproductiveCycle", value)}
              otherCycleDescription={editData.otherCycleDescription || ""}
              onOtherCycleDescriptionChange={(value) =>
                onEditDataChange("otherCycleDescription", value)
              }
            />
          ) : (
            <DisplaySelectGrid
              value={race.reproductiveCycle}
              options={REPRODUCTIVE_CYCLE_OPTIONS}
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
            />
          ) : (
            <DisplaySelectGrid
              value={race.diet}
              options={DIET_OPTIONS}
            />
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
              communication={editData.communication}
              isEditing={isEditing}
              onCommunicationChange={(communication) =>
                onEditDataChange("communication", communication)
              }
            />
          ) : race.communication && race.communication.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {race.communication.map((commValue) => {
                const commOption = RACE_COMMUNICATIONS.find((c) => c.value === commValue);
                if (!commOption) return null;

                // Convert to DisplaySelectGrid format
                const displayOption = {
                  value: commOption.value,
                  label: commOption.label,
                  description: commOption.description,
                  icon: commOption.icon,
                  backgroundColor: commOption.color.includes("blue") ? "blue-500/10" :
                                 commOption.color.includes("purple") ? "purple-500/10" :
                                 commOption.color.includes("green") ? "green-500/10" :
                                 commOption.color.includes("amber") ? "amber-500/10" :
                                 commOption.color.includes("violet") ? "violet-500/10" :
                                 "gray-500/10",
                  borderColor: commOption.color.includes("blue") ? "blue-500/30" :
                              commOption.color.includes("purple") ? "purple-500/30" :
                              commOption.color.includes("green") ? "green-500/30" :
                              commOption.color.includes("amber") ? "amber-500/30" :
                              commOption.color.includes("violet") ? "violet-500/30" :
                              "gray-500/30",
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
              options={RACE_COMMUNICATIONS.map(c => ({
                value: c.value,
                label: c.label,
                description: c.description,
                icon: c.icon,
                backgroundColor: c.color.includes("blue") ? "blue-500/10" :
                               c.color.includes("purple") ? "purple-500/10" :
                               c.color.includes("green") ? "green-500/10" :
                               c.color.includes("amber") ? "amber-500/10" :
                               c.color.includes("violet") ? "violet-500/10" :
                               "gray-500/10",
                borderColor: c.color.includes("blue") ? "blue-500/30" :
                            c.color.includes("purple") ? "purple-500/30" :
                            c.color.includes("green") ? "green-500/30" :
                            c.color.includes("amber") ? "amber-500/30" :
                            c.color.includes("violet") ? "violet-500/30" :
                            "gray-500/30",
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
            />
          ) : (
            <DisplaySelectGrid
              value={race.moralTendency}
              options={MORAL_TENDENCY_OPTIONS}
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
                placeholder={t("create-race:modal.social_organization_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.socialOrganization?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea
              value={race.socialOrganization}
            />
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

      <Separator />

      {/* PODER Section */}
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
              onChange={(value) => onEditDataChange("physicalCapacity", value)}
            />
          ) : (
            <DisplaySelectGrid
              value={race.physicalCapacity}
              options={PHYSICAL_CAPACITY_OPTIONS}
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
                placeholder={t("create-race:modal.special_characteristics_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.specialCharacteristics?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea
              value={race.specialCharacteristics}
            />
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
                onChange={(e) => onEditDataChange("weaknesses", e.target.value)}
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
            <DisplayTextarea
              value={race.weaknesses}
            />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* NARRATIVA Section */}
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
                onChange={(e) => onEditDataChange("storyMotivation", e.target.value)}
                placeholder={t("create-race:modal.story_motivation_placeholder")}
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.storyMotivation?.length || 0}/500</span>
              </div>
            </>
          ) : (
            <DisplayTextarea
              value={race.storyMotivation}
            />
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
                onChange={(e) => onEditDataChange("inspirations", e.target.value)}
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
            <DisplayTextarea
              value={race.inspirations}
            />
          )}
        </FieldWithVisibilityToggle>
      </div>
    </div>
  );

  // ==================
  // EXTRA SECTIONS
  // ==================
  const extraSections = [
    {
      id: "relationships",
      title: t("race-detail:sections.relationships"),
      content: (
        <Card className="card-magical">
          <CardContent className="pt-6">
            <RaceRelationshipsSection
              relationships={isEditing ? relationships : relationships}
              allRaces={allRaces}
              currentRaceId={race.id}
              currentRaceName={race.name}
              isEditMode={isEditing}
              onRelationshipsChange={onRelationshipsChange}
            />
          </CardContent>
        </Card>
      ),
      isCollapsible: true,
      defaultOpen: false,
      isVisible: sectionVisibility.relationships !== false,
      onVisibilityToggle: () => onSectionVisibilityToggle("relationships"),
    },
  ];

  // Validation message
  const validationMessage = hasRequiredFieldsEmpty ? (
    <p className="text-xs text-destructive">
      {missingFields.length > 0 ? (
        <>
          {t("race-detail:missing_fields")}:{" "}
          {missingFields
            .map((field) => {
              const fieldNames: Record<string, string> = {
                name: t("race-detail:fields.name"),
                scientificName: t("race-detail:fields.scientific_name"),
                domain: t("race-detail:fields.domain"),
                summary: t("race-detail:fields.summary"),
              };
              return fieldNames[field] || field;
            })
            .join(", ")}
        </>
      ) : (
        t("race-detail:fill_required_fields")
      )}
    </p>
  ) : undefined;

  return (
    <div className="relative min-h-screen">
      {/* Navigation Sidebar */}
      <RaceNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        currentRaceId={race.id}
        allRaces={allRaces}
        raceGroups={raceGroups}
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
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteEntityModal
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        entityName={race.name}
        entityType="race"
        onConfirmDelete={onConfirmDelete}
        i18nNamespace="race-detail"
      />
    </div>
  );
}
