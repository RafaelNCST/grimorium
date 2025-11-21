import { Info, Package } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormListInput } from "@/components/forms/FormListInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormSimplePicker } from "@/components/forms/FormSimplePicker";
import { EntityModal } from "@/components/modals/entity-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "@/components/ui/section-title";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { CategorySelector } from "./components/category-selector";
import { ITEM_STATUSES_CONSTANT } from "./constants/item-statuses";
import { STORY_RARITIES_CONSTANT } from "./constants/story-rarities";
import { type ItemFormSchema } from "./hooks/use-item-validation";

interface PropsCreateItemModalView {
  open: boolean;
  form: UseFormReturn<ItemFormSchema>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
}

export function CreateItemModalView({
  open,
  form,
  onClose,
  onSubmit,
  isValid,
}: PropsCreateItemModalView) {
  const { t } = useTranslation("create-item");
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const watchedValues = watch();

  // Basic Fields
  const basicFields = (
    <div className="space-y-6">
      {/* Item Image */}
      <div className="max-w-[534px] mx-auto">
        <FormImageUpload
          value={watchedValues.image || ""}
          onChange={(value) => setValue("image", value)}
          label={t("modal.image")}
          height="h-96"
          shape="rounded"
          imageFit="cover"
          placeholderIcon={Package}
          id="item-image-upload"
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-primary">
          {t("modal.item_name")} <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder={t("modal.name_placeholder")}
          maxLength={150}
          className={errors.name ? "border-destructive" : ""}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {errors.name && (
            <p className="text-destructive">
              {t(errors.name.message || "")}
            </p>
          )}
          <span className="ml-auto">
            {watchedValues.name?.length || 0}/150
          </span>
        </div>
      </div>

      {/* Status Picker */}
      <FormSimplePicker
        value={watchedValues.status}
        onChange={(value) => setValue("status", value)}
        label={t("modal.item_status")}
        required
        options={ITEM_STATUSES_CONSTANT}
        error={errors.status?.message}
        translationNamespace="create-item"
      />

      {/* Category Selector */}
      <CategorySelector
        value={watchedValues.category}
        customCategory={watchedValues.customCategory || ""}
        onChange={(value) => setValue("category", value)}
        onCustomCategoryChange={(value) =>
          setValue("customCategory", value)
        }
        error={errors.category?.message}
      />

      {/* Basic Description */}
      <div className="space-y-2">
        <Label htmlFor="basicDescription" className="text-sm font-medium text-primary">
          {t("modal.basic_description")} <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="basicDescription"
          {...register("basicDescription")}
          placeholder={t("modal.basic_description_placeholder")}
          rows={4}
          maxLength={500}
          className={`resize-none ${errors.basicDescription ? "border-destructive" : ""}`}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {errors.basicDescription && (
            <p className="text-destructive">
              {t(errors.basicDescription.message || "")}
            </p>
          )}
          <span className="ml-auto">
            {watchedValues.basicDescription?.length || 0}/500
          </span>
        </div>
      </div>
    </div>
  );

  // Advanced Fields
  const advancedFields = (
    <div className="space-y-6">
      {/* ==================== */}
      {/* DESCRIÇÃO E HISTÓRIA */}
      {/* ==================== */}
      <div className="space-y-4">
        <SectionTitle>{t("modal.description_history_section")}</SectionTitle>

        {/* Appearance */}
        <div className="space-y-2">
          <Label htmlFor="appearance" className="text-sm font-medium text-primary">
            {t("modal.appearance")}
          </Label>
          <Textarea
            id="appearance"
            {...register("appearance")}
            placeholder={t("modal.appearance_placeholder")}
            rows={4}
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.appearance?.length || 0}/500</span>
          </div>
        </div>

        {/* Origin */}
        <div className="space-y-2">
          <Label htmlFor="origin" className="text-sm font-medium text-primary">
            {t("modal.origin")}
          </Label>
          <Textarea
            id="origin"
            {...register("origin")}
            placeholder={t("modal.origin_placeholder")}
            rows={4}
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.origin?.length || 0}/500</span>
          </div>
        </div>

        {/* Alternative Names */}
        <FormListInput
          value={watchedValues.alternativeNames || []}
          onChange={(names) => setValue("alternativeNames", names)}
          label={t("modal.alternative_names")}
          placeholder={t("modal.alternative_names_placeholder")}
          buttonText={t("modal.add_alternative_name")}
          maxLength={100}
          inputSize="small"
        />
      </div>

      <Separator />

      {/* ==================== */}
      {/* NARRATIVA */}
      {/* ==================== */}
      <div className="space-y-4">
        <SectionTitle>{t("modal.narrative_section")}</SectionTitle>

        {/* Story Rarity */}
        <div className="space-y-3">
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs">
              {t("modal.rarity_explanation")}
            </AlertDescription>
          </Alert>

          <FormSelectGrid
            value={watchedValues.storyRarity || ""}
            onChange={(value) => setValue("storyRarity", value)}
            label={t("modal.story_rarity")}
            columns={4}
            options={STORY_RARITIES_CONSTANT.map((rarity) => ({
              value: rarity.value,
              label: t(rarity.translationKey),
              description: t(rarity.descriptionKey),
              icon: rarity.icon,
              backgroundColor: rarity.value === 'common' ? 'gray-500/10' :
                               rarity.value === 'rare' ? 'blue-500/10' :
                               rarity.value === 'legendary' ? 'purple-500/10' : 'yellow-500/10',
              borderColor: rarity.value === 'common' ? 'gray-500/20' :
                           rarity.value === 'rare' ? 'blue-500/20' :
                           rarity.value === 'legendary' ? 'purple-500/20' : 'yellow-500/20',
            }))}
            className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          />
        </div>

        {/* Narrative Purpose */}
        <div className="space-y-2">
          <Label htmlFor="narrativePurpose" className="text-sm font-medium text-primary">
            {t("modal.narrative_purpose")}
          </Label>
          <Textarea
            id="narrativePurpose"
            {...register("narrativePurpose")}
            placeholder={t("modal.narrative_purpose_placeholder")}
            rows={4}
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.narrativePurpose?.length || 0}/500</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* ==================== */}
      {/* MECÂNICAS DO ITEM */}
      {/* ==================== */}
      <div className="space-y-4">
        <SectionTitle>{t("modal.mechanics_section")}</SectionTitle>

        {/* Usage Requirements */}
        <div className="space-y-2">
          <Label
            htmlFor="usageRequirements"
            className="text-sm font-medium text-primary"
          >
            {t("modal.usage_requirements")}
          </Label>
          <Textarea
            id="usageRequirements"
            {...register("usageRequirements")}
            placeholder={t("modal.usage_requirements_placeholder")}
            rows={3}
            maxLength={250}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.usageRequirements?.length || 0}/250</span>
          </div>
        </div>

        {/* Usage Consequences */}
        <div className="space-y-2">
          <Label
            htmlFor="usageConsequences"
            className="text-sm font-medium text-primary"
          >
            {t("modal.usage_consequences")}
          </Label>
          <Textarea
            id="usageConsequences"
            {...register("usageConsequences")}
            placeholder={t("modal.usage_consequences_placeholder")}
            rows={3}
            maxLength={250}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.usageConsequences?.length || 0}/250</span>
          </div>
        </div>

        {/* Item Usage */}
        <div className="space-y-2">
          <Label
            htmlFor="itemUsage"
            className="text-sm font-medium text-primary"
          >
            {t("modal.item_usage")}
          </Label>
          <Textarea
            id="itemUsage"
            {...register("itemUsage")}
            placeholder={t("modal.item_usage_placeholder")}
            rows={4}
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.itemUsage?.length || 0}/500</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EntityModal
      open={open}
      onOpenChange={onClose}
      header={{
        title: t("modal.create_item"),
        icon: Package,
        description: t("modal.description"),
        warning: t("modal.info_message"),
      }}
      basicFields={basicFields}
      advancedFields={advancedFields}
      footer={{
        isSubmitting: false,
        isValid,
        onSubmit,
        onCancel: onClose,
        submitLabel: t("button.create"),
      }}
      maxWidth="max-w-3xl"
      basicFieldsTitle={t("modal.basic_fields")}
      advancedFieldsTitle={t("modal.advanced_fields")}
    />
  );
}
