import { Info, Package } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { AdvancedSection } from "../create-character-modal/components/advanced-section";

import { AlternativeNamesInput } from "./components/alternative-names-input";
import { CategorySelector } from "./components/category-selector";
import { ItemImageUpload } from "./components/item-image-upload";
import { RarityPicker } from "./components/rarity-picker";
import { StatusPicker } from "./components/status-picker";
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            {t("modal.create_item")}
          </DialogTitle>
        </DialogHeader>

        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            {t("modal.info_message")}
          </AlertDescription>
        </Alert>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Fields Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("modal.basic_fields")}
            </h3>

            {/* Item Image */}
            <ItemImageUpload
              image={watchedValues.image || ""}
              onImageChange={(image) => setValue("image", image)}
            />

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t("modal.item_name")} *
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
            <StatusPicker
              value={watchedValues.status}
              onChange={(value) => setValue("status", value)}
              error={errors.status?.message}
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
              <Label htmlFor="basicDescription" className="text-sm font-medium">
                {t("modal.basic_description")} *
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

          <Separator />

          {/* Advanced Section */}
          <AdvancedSection>
            {/* Appearance */}
            <div className="space-y-2">
              <Label htmlFor="appearance" className="text-sm font-medium">
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
              <Label htmlFor="origin" className="text-sm font-medium">
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
            <AlternativeNamesInput
              names={watchedValues.alternativeNames || []}
              onChange={(names) => setValue("alternativeNames", names)}
            />

            <Separator />

            {/* Story Rarity */}
            <RarityPicker
              value={watchedValues.storyRarity || ""}
              onChange={(value) => setValue("storyRarity", value)}
            />

            <Separator />

            {/* Narrative Purpose */}
            <div className="space-y-2">
              <Label htmlFor="narrativePurpose" className="text-sm font-medium">
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

            {/* Usage Requirements */}
            <div className="space-y-2">
              <Label
                htmlFor="usageRequirements"
                className="text-sm font-medium"
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
                className="text-sm font-medium"
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
          </AdvancedSection>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t("button.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              variant="magical"
              size="lg"
              className="flex-1 animate-glow"
            >
              {t("button.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
