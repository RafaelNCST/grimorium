import { Dna, Users } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormInput } from "@/components/forms/FormInput";
import { FormListInput } from "@/components/forms/FormListInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { EntityModal } from "@/components/modals/entity-modal";
import { Form } from "@/components/ui/form";
import { SectionTitle } from "@/components/ui/section-title";
import { Separator } from "@/components/ui/separator";

import { CommunicationPicker } from "./components/communication-picker";
import { DietPicker } from "./components/diet-picker";
import { DomainPicker } from "./components/domain-picker";
import { HabitsPicker } from "./components/habits-picker";
import { MoralTendencyPicker } from "./components/moral-tendency-picker";
import { PhysicalCapacityPicker } from "./components/physical-capacity-picker";
import { ReproductiveCyclePicker } from "./components/reproductive-cycle-picker";
import { type RaceFormSchema } from "./hooks/use-race-validation";

interface PropsCreateRaceModalView {
  open: boolean;
  form: UseFormReturn<RaceFormSchema>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  isSubmitting: boolean;
  availableRaces: Array<{ id: string; name: string; image?: string }>;
  bookId: string;
}

export function CreateRaceModalView({
  open,
  form,
  onClose,
  onSubmit,
  isValid,
  isSubmitting,
  availableRaces: _availableRaces,
  bookId: _bookId,
}: PropsCreateRaceModalView) {
  const { t } = useTranslation("create-race");
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const watchedValues = watch();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <EntityModal
          open={open}
          onOpenChange={onClose}
          header={{
            title: t("modal.create_race"),
            icon: Users,
            description: t("modal.description"),
            warning: t("modal.info_message"),
          }}
          basicFieldsTitle={t("sections.basic_fields")}
          advancedFieldsTitle={t("sections.advanced_fields")}
          basicFields={
            <div className="space-y-6">
              {/* Race Image */}
              <div className="max-w-[534px] mx-auto">
                <FormImageUpload
                  value={watchedValues.image || ""}
                  onChange={(value) => setValue("image", value)}
                  label={t("modal.image")}
                  helperText="opcional"
                  height="h-96"
                  shape="rounded"
                  imageFit="cover"
                  placeholderIcon={Dna}
                  id="race-image-upload"
                />
              </div>

              {/* Race Name and Scientific Name */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormInput
                  {...register("name")}
                  label={t("modal.race_name")}
                  placeholder={t("modal.name_placeholder")}
                  maxLength={150}
                  required
                  showCharCount
                  error={
                    errors.name ? t(errors.name.message as string) : undefined
                  }
                  value={watchedValues.name}
                  labelClassName="text-primary"
                />

                <FormInput
                  {...register("scientificName")}
                  label={t("modal.scientific_name")}
                  placeholder={t("modal.scientific_name_placeholder")}
                  maxLength={150}
                  showCharCount
                  error={
                    errors.scientificName
                      ? t(errors.scientificName.message as string)
                      : undefined
                  }
                  value={watchedValues.scientificName}
                  labelClassName="text-primary"
                />
              </div>

              {/* Domain */}
              <DomainPicker
                value={watchedValues.domain || []}
                onChange={(value) => setValue("domain", value)}
                error={errors.domain?.message}
              />

              {/* Summary */}
              <FormTextarea
                {...register("summary")}
                label={t("modal.summary")}
                placeholder={t("modal.summary_placeholder")}
                maxLength={500}
                rows={4}
                required
                showCharCount
                error={
                  errors.summary
                    ? t(errors.summary.message as string)
                    : undefined
                }
                value={watchedValues.summary}
                labelClassName="text-primary"
                className="resize-none"
              />
            </div>
          }
          advancedFields={
            <>
              <div className="space-y-6">
                <SectionTitle>{t("sections.culture_myths")}</SectionTitle>

                {/* Alternative Names */}
                <FormListInput
                  value={watchedValues.alternativeNames || []}
                  onChange={(value) => setValue("alternativeNames", value)}
                  label={t("modal.alternative_names")}
                  placeholder={t("modal.alternative_names_placeholder")}
                  buttonText={t("modal.add_name")}
                  maxLength={100}
                  inputSize="small"
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Cultural Notes (Rites, Taboos, Curiosities) */}
                <FormTextarea
                  {...register("culturalNotes")}
                  label={t("modal.cultural_notes")}
                  placeholder={t("modal.cultural_notes_placeholder")}
                  maxLength={1500}
                  rows={6}
                  showCharCount
                  showOptionalLabel={false}
                  error={errors.culturalNotes?.message}
                  value={watchedValues.culturalNotes}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />
              </div>

              <Separator />

              {/* Appearance Section */}
              <div className="space-y-6">
                <SectionTitle>{t("sections.appearance")}</SectionTitle>

                {/* General Appearance */}
                <FormTextarea
                  {...register("generalAppearance")}
                  label={t("modal.general_appearance")}
                  placeholder={t("modal.general_appearance_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.generalAppearance}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Life Expectancy, Height, Weight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    {...register("lifeExpectancy")}
                    label={t("modal.life_expectancy")}
                    placeholder={t("modal.life_expectancy_placeholder")}
                    maxLength={100}
                    showCharCount
                    showOptionalLabel={false}
                    value={watchedValues.lifeExpectancy}
                    labelClassName="text-sm font-medium text-primary"
                  />

                  <FormInput
                    {...register("averageHeight")}
                    label={t("modal.average_height")}
                    placeholder={t("modal.average_height_placeholder")}
                    maxLength={100}
                    showCharCount
                    showOptionalLabel={false}
                    value={watchedValues.averageHeight}
                    labelClassName="text-sm font-medium text-primary"
                  />

                  <FormInput
                    {...register("averageWeight")}
                    label={t("modal.average_weight")}
                    placeholder={t("modal.average_weight_placeholder")}
                    maxLength={100}
                    showCharCount
                    showOptionalLabel={false}
                    value={watchedValues.averageWeight}
                    labelClassName="text-sm font-medium text-primary"
                  />
                </div>

                {/* Special Physical Characteristics */}
                <FormTextarea
                  {...register("specialPhysicalCharacteristics")}
                  label={t("modal.special_physical_characteristics")}
                  placeholder={t(
                    "modal.special_physical_characteristics_placeholder"
                  )}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.specialPhysicalCharacteristics}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />
              </div>

              <Separator />

              {/* Behaviors Section */}
              <div className="space-y-6">
                <SectionTitle>{t("sections.behaviors")}</SectionTitle>

                {/* Habits */}
                <HabitsPicker
                  value={watchedValues.habits || ""}
                  onChange={(value) => setValue("habits", value)}
                />

                {/* Reproductive Cycle */}
                <ReproductiveCyclePicker
                  value={watchedValues.reproductiveCycle || ""}
                  onChange={(value) => setValue("reproductiveCycle", value)}
                  otherCycleDescription={
                    watchedValues.otherReproductiveCycleDescription || ""
                  }
                  onOtherCycleDescriptionChange={(value) =>
                    setValue("otherReproductiveCycleDescription", value)
                  }
                  otherCycleError={
                    errors.otherReproductiveCycleDescription?.message
                  }
                />

                {/* Diet */}
                <DietPicker
                  value={watchedValues.diet || ""}
                  onChange={(value) => setValue("diet", value)}
                  elementalDiet={watchedValues.elementalDiet || ""}
                  onElementalDietChange={(value) =>
                    setValue("elementalDiet", value)
                  }
                  elementalDietError={errors.elementalDiet?.message}
                />

                {/* Communication */}
                <CommunicationPicker
                  values={watchedValues.communication || []}
                  onChange={(values) => setValue("communication", values)}
                  otherCommunication={watchedValues.otherCommunication || ""}
                  onOtherCommunicationChange={(value) =>
                    setValue("otherCommunication", value)
                  }
                  otherCommunicationError={errors.otherCommunication?.message}
                />

                {/* Moral Tendency */}
                <MoralTendencyPicker
                  value={watchedValues.moralTendency || ""}
                  onChange={(value) => setValue("moralTendency", value)}
                />

                {/* Social Organization and Behavioral Tendency */}
                <FormTextarea
                  {...register("socialOrganization")}
                  label={t("modal.social_organization")}
                  placeholder={t("modal.social_organization_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.socialOrganization}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Habitat */}
                <FormListInput
                  value={watchedValues.habitat || []}
                  onChange={(value) => setValue("habitat", value)}
                  label={t("modal.habitat")}
                  placeholder={t("modal.habitat_placeholder")}
                  buttonText={t("modal.add_habitat")}
                  maxLength={50}
                  inputSize="small"
                  labelClassName="text-sm font-medium text-primary"
                />
              </div>

              <Separator />

              {/* Power Section */}
              <div className="space-y-6">
                <SectionTitle>{t("sections.power")}</SectionTitle>

                {/* Physical Capacity */}
                <PhysicalCapacityPicker
                  value={watchedValues.physicalCapacity || ""}
                  onChange={(value) => setValue("physicalCapacity", value)}
                />

                {/* Special Characteristics */}
                <FormTextarea
                  {...register("specialCharacteristics")}
                  label={t("modal.special_characteristics")}
                  placeholder={t("modal.special_characteristics_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.specialCharacteristics}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Weaknesses */}
                <FormTextarea
                  {...register("weaknesses")}
                  label={t("modal.weaknesses")}
                  placeholder={t("modal.weaknesses_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.weaknesses}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />
              </div>

              <Separator />

              {/* Narrative Section */}
              <div className="space-y-6">
                <SectionTitle>{t("sections.narrative")}</SectionTitle>

                {/* Story Motivation */}
                <FormTextarea
                  {...register("storyMotivation")}
                  label={t("modal.story_motivation")}
                  placeholder={t("modal.story_motivation_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.storyMotivation}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Inspirations */}
                <FormTextarea
                  {...register("inspirations")}
                  label={t("modal.inspirations")}
                  placeholder={t("modal.inspirations_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.inspirations}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />
              </div>
            </>
          }
          footer={{
            isSubmitting,
            isValid,
            onSubmit,
            onCancel: onClose,
            editMode: false,
            submitLabel: t("button.create"),
            cancelLabel: t("button.cancel"),
          }}
          width="w-full max-w-5xl"
        />
      </form>
    </Form>
  );
}
