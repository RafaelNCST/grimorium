import { Info, Shield as ShieldIcon } from "lucide-react";
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

import { AdvancedSection } from "./components/advanced-section";
import { AlignmentMatrix } from "./components/alignment-matrix";
import { DropdownTagger } from "./components/dropdown-tagger";
import { FactionImageUpload } from "./components/faction-image-upload";
import { FactionTypePicker } from "./components/faction-type-picker";
import { InfluencePicker } from "./components/influence-picker";
import { InputTagger } from "./components/input-tagger";
import { PowerSlider } from "./components/power-slider";
import { ReputationPicker } from "./components/reputation-picker";
import { StatusPicker } from "./components/status-picker";
import { TextListInput } from "./components/text-list-input";
import { TimelineInput } from "./components/timeline-input";
import { type FactionFormSchema } from "./hooks/use-faction-validation";

interface PropsCreateFactionModalView {
  open: boolean;
  form: UseFormReturn<FactionFormSchema>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  hasRaces: boolean;
  hasCharacters: boolean;
  races: Array<{ id: string; name: string }>;
  characters: Array<{ id: string; name: string }>;
}

export function CreateFactionModalView({
  open,
  form,
  onClose,
  onSubmit,
  isValid,
  hasRaces,
  hasCharacters,
  races,
  characters,
}: PropsCreateFactionModalView) {
  const { t } = useTranslation("create-faction");
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
            <ShieldIcon className="w-5 h-5 text-primary" />
            {t("modal.create_faction")}
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

            <div className="flex gap-6">
              {/* Faction Symbol Image */}
              <FactionImageUpload
                image={watchedValues.image || ""}
                onImageChange={(image) => setValue("image", image)}
              />

              {/* Name */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t("modal.faction_name")} *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder={t("modal.name_placeholder")}
                    maxLength={200}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {errors.name && (
                      <p className="text-destructive">
                        {t(errors.name.message || "")}
                      </p>
                    )}
                    <span className="ml-auto">
                      {watchedValues.name?.length || 0}/200
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Picker */}
            <StatusPicker
              value={watchedValues.status}
              onChange={(value) => setValue("status", value)}
              error={errors.status?.message}
            />

            {/* Faction Type Picker */}
            <FactionTypePicker
              value={watchedValues.factionType}
              onChange={(value) => setValue("factionType", value)}
              error={errors.factionType?.message}
            />

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary" className="text-sm font-medium">
                {t("modal.summary")} *
              </Label>
              <Textarea
                id="summary"
                {...register("summary")}
                placeholder={t("modal.summary_placeholder")}
                rows={8}
                maxLength={500}
                className={`resize-none ${errors.summary ? "border-destructive" : ""}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.summary && (
                  <p className="text-destructive">
                    {t(errors.summary.message || "")}
                  </p>
                )}
                <span className="ml-auto">
                  {watchedValues.summary?.length || 0}/500
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Section */}
          <AdvancedSection>
            {/* Internal Structure Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.internal_structure_section")}
              </h4>

              {/* Government Form */}
              <div className="space-y-2">
                <Label htmlFor="governmentForm" className="text-sm font-medium">
                  {t("modal.government_form")}
                </Label>
                <Textarea
                  id="governmentForm"
                  {...register("governmentForm")}
                  placeholder={t("modal.government_form_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.governmentForm?.length || 0}/500</span>
                </div>
              </div>

              {/* Rules and Laws */}
              <TextListInput
                label={t("modal.rules_and_laws")}
                placeholder={t("modal.rules_and_laws_placeholder")}
                value={watchedValues.rulesAndLaws || []}
                onChange={(value) => setValue("rulesAndLaws", value)}
              />

              {/* Main Resources */}
              <InputTagger
                label={t("modal.main_resources")}
                placeholder={t("modal.main_resources_placeholder")}
                value={watchedValues.mainResources || []}
                onChange={(value) => setValue("mainResources", value)}
              />

              {/* Economy */}
              <div className="space-y-2">
                <Label htmlFor="economy" className="text-sm font-medium">
                  {t("modal.economy")}
                </Label>
                <Textarea
                  id="economy"
                  {...register("economy")}
                  placeholder={t("modal.economy_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.economy?.length || 0}/500</span>
                </div>
              </div>

              {/* Symbols and Secrets */}
              <div className="space-y-2">
                <Label htmlFor="symbolsAndSecrets" className="text-sm font-medium">
                  {t("modal.symbols_and_secrets")}
                </Label>
                <Textarea
                  id="symbolsAndSecrets"
                  {...register("symbolsAndSecrets")}
                  placeholder={t("modal.symbols_and_secrets_placeholder")}
                  rows={6}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.symbolsAndSecrets?.length || 0}/500</span>
                </div>
              </div>

              {/* Currencies Used */}
              <InputTagger
                label={t("modal.currencies")}
                placeholder={t("modal.currencies_placeholder")}
                value={watchedValues.currencies || []}
                onChange={(value) => setValue("currencies", value)}
              />
            </div>

            <Separator />

            {/* Relationships Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.relationships_section")}
              </h4>

              {/* Influence */}
              <InfluencePicker
                value={watchedValues.influence || ""}
                onChange={(value) => setValue("influence", value)}
              />

              {/* Public Reputation */}
              <ReputationPicker
                value={watchedValues.publicReputation || ""}
                onChange={(value) => setValue("publicReputation", value)}
              />

              {/* External Influence */}
              <div className="space-y-2">
                <Label
                  htmlFor="externalInfluence"
                  className="text-sm font-medium"
                >
                  {t("modal.external_influence")}
                </Label>
                <Textarea
                  id="externalInfluence"
                  {...register("externalInfluence")}
                  placeholder={t("modal.external_influence_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>
                    {watchedValues.externalInfluence?.length || 0}/500
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Alignment Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.alignment_section")}
              </h4>

              <AlignmentMatrix
                value={watchedValues.alignment || ""}
                onChange={(value) => setValue("alignment", value)}
              />
            </div>

            <Separator />

            {/* Culture Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.culture_section")}
              </h4>

              {/* Faction Motto */}
              <div className="space-y-2">
                <Label htmlFor="factionMotto" className="text-sm font-medium">
                  {t("modal.faction_motto")}
                </Label>
                <Textarea
                  id="factionMotto"
                  {...register("factionMotto")}
                  placeholder={t("modal.faction_motto_placeholder")}
                  rows={3}
                  maxLength={300}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.factionMotto?.length || 0}/300</span>
                </div>
              </div>

              {/* Traditions and Rituals */}
              <TextListInput
                label={t("modal.traditions_and_rituals")}
                placeholder={t("modal.traditions_and_rituals_placeholder")}
                value={watchedValues.traditionsAndRituals || []}
                onChange={(value) => setValue("traditionsAndRituals", value)}
              />

              {/* Beliefs and Values */}
              <TextListInput
                label={t("modal.beliefs_and_values")}
                placeholder={t("modal.beliefs_and_values_placeholder")}
                value={watchedValues.beliefsAndValues || []}
                onChange={(value) => setValue("beliefsAndValues", value)}
              />

              {/* Languages Used */}
              <InputTagger
                label={t("modal.languages_used")}
                placeholder={t("modal.languages_used_placeholder")}
                value={watchedValues.languagesUsed || []}
                onChange={(value) => setValue("languagesUsed", value)}
              />

              {/* Uniform and Aesthetics */}
              <div className="space-y-2">
                <Label
                  htmlFor="uniformAndAesthetics"
                  className="text-sm font-medium"
                >
                  {t("modal.uniform_and_aesthetics")}
                </Label>
                <Textarea
                  id="uniformAndAesthetics"
                  {...register("uniformAndAesthetics")}
                  placeholder={t("modal.uniform_and_aesthetics_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>
                    {watchedValues.uniformAndAesthetics?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Races */}
              <DropdownTagger
                label={t("modal.races")}
                placeholder={t("modal.races_placeholder")}
                value={watchedValues.races || []}
                onChange={(value) => setValue("races", value)}
                options={races}
                emptyMessage={t("modal.no_races_warning")}
              />
            </div>

            <Separator />

            {/* History Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.history_section")}
              </h4>

              {/* Foundation Date */}
              <div className="space-y-2">
                <Label htmlFor="foundationDate" className="text-sm font-medium">
                  {t("modal.foundation_date")}
                </Label>
                <Input
                  id="foundationDate"
                  {...register("foundationDate")}
                  placeholder={t("modal.foundation_date_placeholder")}
                  maxLength={200}
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.foundationDate?.length || 0}/200</span>
                </div>
              </div>

              {/* Foundation History Summary */}
              <div className="space-y-2">
                <Label
                  htmlFor="foundationHistorySummary"
                  className="text-sm font-medium"
                >
                  {t("modal.foundation_history_summary")}
                </Label>
                <Textarea
                  id="foundationHistorySummary"
                  {...register("foundationHistorySummary")}
                  placeholder={t(
                    "modal.foundation_history_summary_placeholder"
                  )}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>
                    {watchedValues.foundationHistorySummary?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Founders */}
              <DropdownTagger
                label={t("modal.founders")}
                placeholder={t("modal.founders_placeholder")}
                value={watchedValues.founders || []}
                onChange={(value) => setValue("founders", value)}
                options={characters}
                emptyMessage={t("modal.no_characters_warning")}
              />

              {/* Chronology */}
              <TimelineInput
                value={watchedValues.chronology || []}
                onChange={(value) => setValue("chronology", value)}
              />
            </div>

            <Separator />

            {/* Power Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.power_section")}
              </h4>

              <p className="text-sm text-muted-foreground">
                {t("modal.power_description")}
              </p>

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

            <Separator />

            {/* Narrative Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.narrative_section")}
              </h4>

              {/* Organization Objectives */}
              <div className="space-y-2">
                <Label
                  htmlFor="organizationObjectives"
                  className="text-sm font-medium"
                >
                  {t("modal.organization_objectives")}
                </Label>
                <Textarea
                  id="organizationObjectives"
                  {...register("organizationObjectives")}
                  placeholder={t("modal.organization_objectives_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>
                    {watchedValues.organizationObjectives?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Narrative Importance */}
              <div className="space-y-2">
                <Label
                  htmlFor="narrativeImportance"
                  className="text-sm font-medium"
                >
                  {t("modal.narrative_importance")}
                </Label>
                <Textarea
                  id="narrativeImportance"
                  {...register("narrativeImportance")}
                  placeholder={t("modal.narrative_importance_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>
                    {watchedValues.narrativeImportance?.length || 0}/500
                  </span>
                </div>
              </div>

              {/* Inspirations */}
              <div className="space-y-2">
                <Label htmlFor="inspirations" className="text-sm font-medium">
                  {t("modal.inspirations")}
                </Label>
                <Textarea
                  id="inspirations"
                  {...register("inspirations")}
                  placeholder={t("modal.inspirations_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.inspirations?.length || 0}/500</span>
                </div>
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
