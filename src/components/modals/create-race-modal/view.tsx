import { Info, Users } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { AdvancedSection } from "./components/advanced-section";
import { CommunicationPicker } from "./components/communication-picker";
import { DietPicker } from "./components/diet-picker";
import { DomainPicker } from "./components/domain-picker";
import { HabitsPicker } from "./components/habits-picker";
import { MoralTendencyPicker } from "./components/moral-tendency-picker";
import { PhysicalCapacityPicker } from "./components/physical-capacity-picker";
import { RaceImageUpload } from "./components/race-image-upload";
import {
  RaceViewsManager,
  type RaceView,
} from "./components/race-views-manager";
import { ReproductiveCyclePicker } from "./components/reproductive-cycle-picker";
import { TagsInput } from "./components/tags-input";
import { type RaceFormSchema } from "./hooks/use-race-validation";

interface PropsCreateRaceModalView {
  open: boolean;
  form: UseFormReturn<RaceFormSchema>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  availableRaces: Array<{ id: string; name: string }>;
}

export function CreateRaceModalView({
  open,
  form,
  onClose,
  onSubmit,
  isValid,
  availableRaces,
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t("modal.create_race")}
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
              {t("sections.basic_fields")}
            </h3>

            {/* Race Image */}
            <RaceImageUpload
              image={watchedValues.image || ""}
              onImageChange={(image) => setValue("image", image)}
            />

            {/* Race Name and Scientific Name */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.race_name")} *
                </label>
                <Input
                  {...register("name")}
                  placeholder={t("modal.name_placeholder")}
                  maxLength={150}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  {errors.name && (
                    <p className="text-destructive">
                      {t(errors.name.message as string)}
                    </p>
                  )}
                  <span className="ml-auto">
                    {watchedValues.name?.length || 0}/150
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.scientific_name")}
                </label>
                <Input
                  {...register("scientificName")}
                  placeholder={t("modal.scientific_name_placeholder")}
                  maxLength={150}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  {errors.scientificName && (
                    <p className="text-destructive">
                      {t(errors.scientificName.message as string)}
                    </p>
                  )}
                  <span className="ml-auto">
                    {watchedValues.scientificName?.length || 0}/150
                  </span>
                </div>
              </div>
            </div>

            {/* Domain */}
            <DomainPicker
              value={watchedValues.domain || []}
              onChange={(value) => setValue("domain", value)}
              error={errors.domain?.message}
            />

            {/* Summary */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("modal.summary")} *
              </label>
              <Textarea
                {...register("summary")}
                placeholder={t("modal.summary_placeholder")}
                maxLength={500}
                rows={4}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.summary && (
                  <p className="text-destructive">
                    {t(errors.summary.message as string)}
                  </p>
                )}
                <span className="ml-auto">
                  {watchedValues.summary?.length || 0}/500
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Fields Section */}
          <AdvancedSection>
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("sections.culture_myths")}
              </h3>

              {/* Alternative Names */}
              <TagsInput
                tags={watchedValues.alternativeNames || []}
                onChange={(tags) => setValue("alternativeNames", tags)}
                label={t("modal.alternative_names")}
                placeholder={t("modal.alternative_names_placeholder")}
                maxLength={100}
              />

              {/* Race Views */}
              <RaceViewsManager
                views={(watchedValues.raceViews as RaceView[]) || []}
                onChange={(views) => setValue("raceViews", views)}
                availableRaces={availableRaces}
              />

              {/* Cultural Notes (Rites, Taboos, Curiosities) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.cultural_notes")}
                </label>
                <Textarea
                  {...register("culturalNotes")}
                  placeholder={t("modal.cultural_notes_placeholder")}
                  maxLength={1500}
                  rows={6}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  {errors.culturalNotes && (
                    <p className="text-destructive">
                      {t(errors.culturalNotes.message)}
                    </p>
                  )}
                  <span className="ml-auto">
                    {watchedValues.culturalNotes?.length || 0}/1500
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Appearance Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("sections.appearance")}
              </h3>

              {/* General Appearance */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.general_appearance")}
                </label>
                <Textarea
                  {...register("generalAppearance")}
                  placeholder={t("modal.general_appearance_placeholder")}
                  maxLength={500}
                  rows={4}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-auto">
                    {watchedValues.generalAppearance?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Life Expectancy, Height, Weight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("modal.life_expectancy")}
                  </label>
                  <Input
                    {...register("lifeExpectancy")}
                    placeholder={t("modal.life_expectancy_placeholder")}
                    maxLength={100}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="ml-auto">
                      {watchedValues.lifeExpectancy?.length || 0}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("modal.average_height")}
                  </label>
                  <Input
                    {...register("averageHeight")}
                    placeholder={t("modal.average_height_placeholder")}
                    maxLength={100}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="ml-auto">
                      {watchedValues.averageHeight?.length || 0}/100
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("modal.average_weight")}
                  </label>
                  <Input
                    {...register("averageWeight")}
                    placeholder={t("modal.average_weight_placeholder")}
                    maxLength={100}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="ml-auto">
                      {watchedValues.averageWeight?.length || 0}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Physical Characteristics */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.special_physical_characteristics")}
                </label>
                <Textarea
                  {...register("specialPhysicalCharacteristics")}
                  placeholder={t(
                    "modal.special_physical_characteristics_placeholder"
                  )}
                  maxLength={500}
                  rows={4}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-auto">
                    {watchedValues.specialPhysicalCharacteristics?.length || 0}
                    /500
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Behaviors Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("sections.behaviors")}
              </h3>

              {/* Habits */}
              <HabitsPicker
                value={watchedValues.habits || ""}
                onChange={(value) => setValue("habits", value)}
              />

              {/* Reproductive Cycle */}
              <ReproductiveCyclePicker
                value={watchedValues.reproductiveCycle || ""}
                onChange={(value) => setValue("reproductiveCycle", value)}
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
              />

              {/* Moral Tendency */}
              <MoralTendencyPicker
                value={watchedValues.moralTendency || ""}
                onChange={(value) => setValue("moralTendency", value)}
              />

              {/* Social Organization and Behavioral Tendency */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.social_organization")}
                </label>
                <Textarea
                  {...register("socialOrganization")}
                  placeholder={t("modal.social_organization_placeholder")}
                  maxLength={500}
                  rows={4}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-auto">
                    {watchedValues.socialOrganization?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Habitat */}
              <TagsInput
                tags={watchedValues.habitat || []}
                onChange={(tags) => setValue("habitat", tags)}
                label={t("modal.habitat")}
                placeholder={t("modal.habitat_placeholder")}
                maxLength={50}
              />
            </div>

            <Separator />

            {/* Power Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("sections.power")}
              </h3>

              {/* Physical Capacity */}
              <PhysicalCapacityPicker
                value={watchedValues.physicalCapacity || ""}
                onChange={(value) => setValue("physicalCapacity", value)}
              />

              {/* Special Characteristics */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.special_characteristics")}
                </label>
                <Textarea
                  {...register("specialCharacteristics")}
                  placeholder={t("modal.special_characteristics_placeholder")}
                  maxLength={500}
                  rows={4}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-auto">
                    {watchedValues.specialCharacteristics?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Weaknesses */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.weaknesses")}
                </label>
                <Textarea
                  {...register("weaknesses")}
                  placeholder={t("modal.weaknesses_placeholder")}
                  maxLength={500}
                  rows={4}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-auto">
                    {watchedValues.weaknesses?.length || 0}/500
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Narrative Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("sections.narrative")}
              </h3>

              {/* Story Motivation */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.story_motivation")}
                </label>
                <Textarea
                  {...register("storyMotivation")}
                  placeholder={t("modal.story_motivation_placeholder")}
                  maxLength={500}
                  rows={4}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-auto">
                    {watchedValues.storyMotivation?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Inspirations */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("modal.inspirations")}
                </label>
                <Textarea
                  {...register("inspirations")}
                  placeholder={t("modal.inspirations_placeholder")}
                  maxLength={500}
                  rows={4}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-auto">
                    {watchedValues.inspirations?.length || 0}/500
                  </span>
                </div>
              </div>
            </div>
          </AdvancedSection>

          {/* Form Actions */}
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
