import { Shield as ShieldIcon } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormInput } from "@/components/forms/FormInput";
import { FormListInput } from "@/components/forms/FormListInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormSimplePicker } from "@/components/forms/FormSimplePicker";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { EntityModal } from "@/components/modals/entity-modal";
import { Form } from "@/components/ui/form";
import { InfoAlert } from "@/components/ui/info-alert";
import { SectionTitle } from "@/components/ui/section-title";
import { Separator } from "@/components/ui/separator";

import { AlignmentMatrix } from "./components/alignment-matrix";
import { PowerSlider } from "./components/power-slider";
import { FACTION_INFLUENCE_OPTIONS } from "./constants/faction-influence";
import { FACTION_REPUTATION_OPTIONS } from "./constants/faction-reputation";
import { FACTION_STATUS_OPTIONS } from "./constants/faction-status";
import { FACTION_TYPE_OPTIONS } from "./constants/faction-types";
import { type FactionFormSchema } from "./hooks/use-faction-validation";

interface PropsCreateFactionModalView {
  open: boolean;
  form: UseFormReturn<FactionFormSchema>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  isSubmitting: boolean;
  bookId: string;
}

export function CreateFactionModalView({
  open,
  form,
  onClose,
  onSubmit,
  isValid,
  isSubmitting,
  bookId,
}: PropsCreateFactionModalView) {
  const { t } = useTranslation("create-faction");
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const watchedValues = watch();

  // Translate options for FormSelectGrid
  const translatedTypeOptions = FACTION_TYPE_OPTIONS.map((opt) => ({
    ...opt,
    label: t(opt.label),
    description: opt.description ? t(opt.description) : undefined,
  }));

  const translatedInfluenceOptions = FACTION_INFLUENCE_OPTIONS.map((opt) => ({
    ...opt,
    label: t(opt.label),
    description: opt.description ? t(opt.description) : undefined,
  }));

  const translatedReputationOptions = FACTION_REPUTATION_OPTIONS.map((opt) => ({
    ...opt,
    label: t(opt.label),
    description: opt.description ? t(opt.description) : undefined,
  }));

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <EntityModal
          open={open}
          onOpenChange={onClose}
          header={{
            title: t("modal.create_faction"),
            icon: ShieldIcon,
            description: t("modal.description"),
            warning: t("modal.info_message"),
          }}
          basicFieldsTitle={t("modal.basic_fields")}
          advancedFieldsTitle={t("modal.advanced_fields")}
          basicFields={
            <div className="space-y-6">
              {/* Header: Image + Name side by side */}
              <div className="flex gap-4 items-start">
                {/* Faction Image - Small like card */}
                <FormImageUpload
                  value={watchedValues.image || ""}
                  onChange={(value) => setValue("image", value)}
                  height="h-24"
                  width="w-24"
                  shape="rounded"
                  imageFit="cover"
                  placeholderIcon={ShieldIcon}
                  id="faction-image-upload"
                  compact
                />

                {/* Faction Name */}
                <div className="flex-1">
                  <FormInput
                    {...register("name")}
                    label={t("modal.faction_name")}
                    placeholder={t("modal.name_placeholder")}
                    maxLength={200}
                    required
                    showCharCount
                    error={
                      errors.name ? t(errors.name.message as string) : undefined
                    }
                    value={watchedValues.name}
                    labelClassName="text-primary"
                  />
                </div>
              </div>

              {/* Status Picker */}
              <FormSimplePicker
                value={watchedValues.status}
                onChange={(value) => setValue("status", value)}
                label={t("modal.status")}
                required
                options={FACTION_STATUS_OPTIONS}
                error={errors.status?.message}
                translationNamespace="create-faction"
              />

              {/* Faction Type Picker */}
              <FormSelectGrid
                value={watchedValues.factionType}
                onChange={(value) => setValue("factionType", value as string)}
                label={t("modal.faction_type")}
                required
                columns={4}
                options={translatedTypeOptions}
                error={errors.factionType?.message}
              />

              {/* Summary */}
              <FormTextarea
                {...register("summary")}
                label={t("modal.summary")}
                placeholder={t("modal.summary_placeholder")}
                maxLength={500}
                rows={8}
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
              {/* Internal Structure Section */}
              <div className="space-y-6">
                <SectionTitle>
                  {t("modal.internal_structure_section")}
                </SectionTitle>

                {/* Government Form */}
                <FormTextarea
                  {...register("governmentForm")}
                  label={t("modal.government_form")}
                  placeholder={t("modal.government_form_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.governmentForm}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Rules and Laws */}
                <FormListInput
                  value={watchedValues.rulesAndLaws || []}
                  onChange={(value) => setValue("rulesAndLaws", value)}
                  label={t("modal.rules_and_laws")}
                  placeholder={t("modal.rules_and_laws_placeholder")}
                  buttonText={t("modal.add_rule")}
                  maxLength={200}
                  inputSize="large"
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Main Resources */}
                <FormListInput
                  value={watchedValues.mainResources || []}
                  onChange={(value) => setValue("mainResources", value)}
                  label={t("modal.main_resources")}
                  placeholder={t("modal.main_resources_placeholder")}
                  buttonText={t("modal.add_resource")}
                  maxLength={50}
                  inputSize="small"
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Economy */}
                <FormTextarea
                  {...register("economy")}
                  label={t("modal.economy")}
                  placeholder={t("modal.economy_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.economy}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Symbols and Secrets */}
                <FormTextarea
                  {...register("symbolsAndSecrets")}
                  label={t("modal.symbols_and_secrets")}
                  placeholder={t("modal.symbols_and_secrets_placeholder")}
                  maxLength={500}
                  rows={6}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.symbolsAndSecrets}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Currencies Used */}
                <FormListInput
                  value={watchedValues.currencies || []}
                  onChange={(value) => setValue("currencies", value)}
                  label={t("modal.currencies")}
                  placeholder={t("modal.currencies_placeholder")}
                  buttonText={t("modal.add_currency")}
                  maxLength={50}
                  inputSize="small"
                  labelClassName="text-sm font-medium text-primary"
                />
              </div>

              <Separator />

              {/* Relationships Section */}
              <div className="space-y-6">
                <SectionTitle>{t("modal.relationships_section")}</SectionTitle>

                {/* Influence */}
                <FormSelectGrid
                  value={watchedValues.influence || ""}
                  onChange={(value) => setValue("influence", value as string)}
                  label={t("modal.influence")}
                  columns={3}
                  options={translatedInfluenceOptions}
                />

                {/* Public Reputation */}
                <FormSelectGrid
                  value={watchedValues.publicReputation || ""}
                  onChange={(value) =>
                    setValue("publicReputation", value as string)
                  }
                  label={t("modal.public_reputation")}
                  columns={3}
                  options={translatedReputationOptions}
                />
              </div>

              <Separator />

              {/* Territory Section */}
              <div className="space-y-6">
                <SectionTitle>{t("modal.territory_section")}</SectionTitle>

                {/* Dominated Areas */}
                <FormEntityMultiSelectAuto
                  entityType="region"
                  bookId={bookId}
                  label={t("modal.dominated_areas")}
                  placeholder={t("modal.dominated_areas_placeholder")}
                  emptyText={t("modal.no_regions_warning")}
                  noSelectionText={t("modal.no_dominated_areas_selected")}
                  searchPlaceholder={t("modal.search_regions")}
                  value={watchedValues.dominatedAreas || []}
                  onChange={(value) => setValue("dominatedAreas", value)}
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Main Base */}
                <FormEntityMultiSelectAuto
                  entityType="region"
                  bookId={bookId}
                  label={t("modal.main_base")}
                  placeholder={t("modal.main_base_placeholder")}
                  emptyText={t("modal.no_regions_warning")}
                  noSelectionText={t("modal.no_main_base_selected")}
                  searchPlaceholder={t("modal.search_regions")}
                  value={watchedValues.mainBase || []}
                  onChange={(value) => setValue("mainBase", value)}
                  labelClassName="text-sm font-medium text-primary"
                  maxSelections={1}
                />

                {/* Areas of Interest */}
                <FormEntityMultiSelectAuto
                  entityType="region"
                  bookId={bookId}
                  label={t("modal.areas_of_interest")}
                  placeholder={t("modal.areas_of_interest_placeholder")}
                  emptyText={t("modal.no_regions_warning")}
                  noSelectionText={t("modal.no_areas_of_interest_selected")}
                  searchPlaceholder={t("modal.search_regions")}
                  value={watchedValues.areasOfInterest || []}
                  onChange={(value) => setValue("areasOfInterest", value)}
                  labelClassName="text-sm font-medium text-primary"
                />
              </div>

              <Separator />

              {/* Culture Section */}
              <div className="space-y-6">
                <SectionTitle>{t("modal.culture_section")}</SectionTitle>

                {/* Faction Motto */}
                <FormTextarea
                  {...register("factionMotto")}
                  label={t("modal.faction_motto")}
                  placeholder={t("modal.faction_motto_placeholder")}
                  maxLength={300}
                  rows={3}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.factionMotto}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Traditions and Rituals */}
                <FormListInput
                  value={watchedValues.traditionsAndRituals || []}
                  onChange={(value) => setValue("traditionsAndRituals", value)}
                  label={t("modal.traditions_and_rituals")}
                  placeholder={t("modal.traditions_and_rituals_placeholder")}
                  buttonText={t("modal.add_tradition")}
                  maxLength={200}
                  inputSize="large"
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Beliefs and Values */}
                <FormListInput
                  value={watchedValues.beliefsAndValues || []}
                  onChange={(value) => setValue("beliefsAndValues", value)}
                  label={t("modal.beliefs_and_values")}
                  placeholder={t("modal.beliefs_and_values_placeholder")}
                  buttonText={t("modal.add_belief")}
                  maxLength={200}
                  inputSize="large"
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Languages Used */}
                <FormListInput
                  value={watchedValues.languagesUsed || []}
                  onChange={(value) => setValue("languagesUsed", value)}
                  label={t("modal.languages_used")}
                  placeholder={t("modal.languages_used_placeholder")}
                  buttonText={t("modal.add_language")}
                  maxLength={50}
                  inputSize="small"
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Uniform and Aesthetics */}
                <FormTextarea
                  {...register("uniformAndAesthetics")}
                  label={t("modal.uniform_and_aesthetics")}
                  placeholder={t("modal.uniform_and_aesthetics_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.uniformAndAesthetics}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Races */}
                <FormEntityMultiSelectAuto
                  entityType="race"
                  bookId={bookId}
                  label={t("modal.races")}
                  placeholder={t("modal.races_placeholder")}
                  emptyText={t("modal.no_races_warning")}
                  noSelectionText={t("modal.no_races_selected")}
                  searchPlaceholder={t("modal.search_races")}
                  value={watchedValues.races || []}
                  onChange={(value) => setValue("races", value)}
                  labelClassName="text-sm font-medium text-primary"
                />
              </div>

              <Separator />

              {/* History Section */}
              <div className="space-y-6">
                <SectionTitle>{t("modal.history_section")}</SectionTitle>

                {/* Foundation Date */}
                <FormInput
                  {...register("foundationDate")}
                  label={t("modal.foundation_date")}
                  placeholder={t("modal.foundation_date_placeholder")}
                  maxLength={200}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.foundationDate}
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Foundation History Summary */}
                <FormTextarea
                  {...register("foundationHistorySummary")}
                  label={t("modal.foundation_history_summary")}
                  placeholder={t(
                    "modal.foundation_history_summary_placeholder"
                  )}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.foundationHistorySummary}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Founders */}
                <FormEntityMultiSelectAuto
                  entityType="character"
                  bookId={bookId}
                  label={t("modal.founders")}
                  placeholder={t("modal.founders_placeholder")}
                  emptyText={t("modal.no_characters_warning")}
                  noSelectionText={t("modal.no_founders_selected")}
                  searchPlaceholder={t("modal.search_characters")}
                  value={watchedValues.founders || []}
                  onChange={(value) => setValue("founders", value)}
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Alignment */}
                <AlignmentMatrix
                  value={watchedValues.alignment || ""}
                  onChange={(value) => setValue("alignment", value)}
                  label={t("modal.alignment")}
                />
              </div>

              <Separator />

              {/* Narrative Section */}
              <div className="space-y-6">
                <SectionTitle>{t("modal.narrative_section")}</SectionTitle>

                {/* Organization Objectives */}
                <FormTextarea
                  {...register("organizationObjectives")}
                  label={t("modal.organization_objectives")}
                  placeholder={t("modal.organization_objectives_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.organizationObjectives}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* Narrative Importance */}
                <FormTextarea
                  {...register("narrativeImportance")}
                  label={t("modal.narrative_importance")}
                  placeholder={t("modal.narrative_importance_placeholder")}
                  maxLength={500}
                  rows={4}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.narrativeImportance}
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

                {/* Power Sliders */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-primary">
                    {t("modal.power_section")}
                  </label>
                  <InfoAlert>{t("modal.power_description")}</InfoAlert>

                  {/* Military Power */}
                  <PowerSlider
                    label={t("modal.military_power")}
                    description={t("modal.military_power_description")}
                    value={watchedValues.militaryPower || 5}
                    onChange={(value) => setValue("militaryPower", value)}
                  />

                  {/* Political Power */}
                  <PowerSlider
                    label={t("modal.political_power")}
                    description={t("modal.political_power_description")}
                    value={watchedValues.politicalPower || 5}
                    onChange={(value) => setValue("politicalPower", value)}
                  />

                  {/* Cultural Power */}
                  <PowerSlider
                    label={t("modal.cultural_power")}
                    description={t("modal.cultural_power_description")}
                    value={watchedValues.culturalPower || 5}
                    onChange={(value) => setValue("culturalPower", value)}
                  />

                  {/* Economic Power */}
                  <PowerSlider
                    label={t("modal.economic_power")}
                    description={t("modal.economic_power_description")}
                    value={watchedValues.economicPower || 5}
                    onChange={(value) => setValue("economicPower", value)}
                  />
                </div>
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
          maxWidth="max-w-[800px]"
        />
      </form>
    </Form>
  );
}
