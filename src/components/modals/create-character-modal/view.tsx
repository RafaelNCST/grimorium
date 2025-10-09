import { Info, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { type UseFormReturn } from "react-hook-form";
import { type CharacterFormSchema } from "./hooks/use-character-validation";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { CharacterImageUpload } from "./components/character-image-upload";
import { RolePicker } from "./components/role-picker";
import { ArchetypeSelector } from "./components/archetype-selector";
import { AlignmentMatrix } from "./components/alignment-matrix";
import { ColorPickerInput } from "./components/color-picker-input";
import { AdvancedSection } from "./components/advanced-section";

import { GENDERS_CONSTANT } from "./constants/genders";
import { PHYSICAL_TYPES_CONSTANT } from "./constants/physical-types";

interface PropsCreateCharacterModalView {
  open: boolean;
  form: UseFormReturn<CharacterFormSchema>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  hasSpecies: boolean;
  hasLocations: boolean;
  hasOrganizations: boolean;
  species: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string }>;
  organizations: Array<{ id: string; name: string }>;
}

export function CreateCharacterModalView({
  open,
  form,
  onClose,
  onSubmit,
  isValid,
  hasSpecies,
  hasLocations,
  hasOrganizations,
  species,
  locations,
  organizations,
}: PropsCreateCharacterModalView) {
  const { t } = useTranslation("create-character");
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
            <UserPlus className="w-5 h-5 text-primary" />
            {t("modal.create_character")}
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
              {/* Character Image */}
              <CharacterImageUpload
                image={watchedValues.image || ""}
                onImageChange={(image) => setValue("image", image)}
              />

              {/* Name, Age, Gender */}
              <div className="flex-1 space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t("modal.character_name")} *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder={t("modal.name_placeholder")}
                    maxLength={100}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {t(errors.name.message || "")}
                    </p>
                  )}
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      {t("modal.age")} *
                    </Label>
                    <Input
                      id="age"
                      {...register("age")}
                      placeholder={t("modal.age_placeholder")}
                      className={errors.age ? "border-destructive" : ""}
                    />
                    {errors.age && (
                      <p className="text-sm text-destructive">
                        {t(errors.age.message || "")}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">
                      {t("modal.gender")} *
                    </Label>
                    <Select
                      value={watchedValues.gender}
                      onValueChange={(value) => setValue("gender", value)}
                    >
                      <SelectTrigger
                        className={errors.gender ? "border-destructive" : ""}
                      >
                        <SelectValue
                          placeholder={t("modal.gender_placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        {GENDERS_CONSTANT.map((gender) => {
                          const Icon = gender.icon;
                          return (
                            <SelectItem key={gender.value} value={gender.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{t(gender.translationKey)}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-destructive">
                        {t(errors.gender.message || "")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Picker */}
            <RolePicker
              value={watchedValues.role}
              onChange={(value) => setValue("role", value)}
              error={errors.role?.message}
            />

            {/* Simple Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t("modal.simple_description")} *
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder={t("modal.description_placeholder")}
                rows={4}
                maxLength={500}
                className={`resize-none ${errors.description ? "border-destructive" : ""}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                {errors.description && (
                  <p className="text-destructive">
                    {t(errors.description.message || "")}
                  </p>
                )}
                <span className="ml-auto">
                  {watchedValues.description?.length || 0}/500
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Section */}
          <AdvancedSection>
            {/* Appearance Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.appearance_section")}
              </h4>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium">
                  {t("modal.height")}
                </Label>
                <Input
                  id="height"
                  {...register("height")}
                  placeholder={t("modal.height_placeholder")}
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">
                  {t("modal.weight")}
                </Label>
                <Input
                  id="weight"
                  {...register("weight")}
                  placeholder={t("modal.weight_placeholder")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skin Tone */}
                <div className="space-y-2">
                  <Label htmlFor="skinTone" className="text-sm font-medium">
                    {t("modal.skin_tone")}
                  </Label>
                  <Input
                    id="skinTone"
                    {...register("skinTone")}
                    placeholder={t("modal.skin_tone_placeholder")}
                  />
                </div>

                {/* Physical Type */}
                <div className="space-y-2">
                  <Label htmlFor="physicalType" className="text-sm font-medium">
                    {t("modal.physical_type")}
                  </Label>
                  <Select
                    value={watchedValues.physicalType}
                    onValueChange={(value) => setValue("physicalType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("modal.physical_type_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {PHYSICAL_TYPES_CONSTANT.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <span>{t(type.translationKey)}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Hair */}
              <div className="space-y-2">
                <Label htmlFor="hair" className="text-sm font-medium">
                  {t("modal.hair")}
                </Label>
                <Input
                  id="hair"
                  {...register("hair")}
                  placeholder={t("modal.hair_placeholder")}
                />
              </div>

              {/* Eyes */}
              <div className="space-y-2">
                <Label htmlFor="eyes" className="text-sm font-medium">
                  {t("modal.eyes")}
                </Label>
                <Input
                  id="eyes"
                  {...register("eyes")}
                  placeholder={t("modal.eyes_placeholder")}
                />
              </div>

              {/* Face */}
              <div className="space-y-2">
                <Label htmlFor="face" className="text-sm font-medium">
                  {t("modal.face")}
                </Label>
                <Input
                  id="face"
                  {...register("face")}
                  placeholder={t("modal.face_placeholder")}
                />
              </div>

              {/* Distinguishing Features */}
              <div className="space-y-2">
                <Label
                  htmlFor="distinguishingFeatures"
                  className="text-sm font-medium"
                >
                  {t("modal.distinguishing_features")}
                </Label>
                <Textarea
                  id="distinguishingFeatures"
                  {...register("distinguishingFeatures")}
                  placeholder={t("modal.distinguishing_features_placeholder")}
                  rows={3}
                  maxLength={200}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.distinguishingFeatures?.length || 0}/200</span>
                </div>
              </div>

              {/* Species and Race */}
              <div className="space-y-2">
                <Label
                  htmlFor="speciesAndRace"
                  className="text-sm font-medium"
                >
                  {t("modal.species_and_race")}
                </Label>
                {hasSpecies ? (
                  <Select
                    value={watchedValues.speciesAndRace}
                    onValueChange={(value) =>
                      setValue("speciesAndRace", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("modal.species_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {species.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {t("modal.no_species_warning")}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <Separator />

            {/* Behavior and Tastes Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.behavior_section")}
              </h4>

              {/* Archetype */}
              <ArchetypeSelector
                value={watchedValues.archetype || ""}
                onChange={(value) => setValue("archetype", value)}
              />

              {/* Personality */}
              <div className="space-y-2">
                <Label htmlFor="personality" className="text-sm font-medium">
                  {t("modal.personality")}
                </Label>
                <Textarea
                  id="personality"
                  {...register("personality")}
                  placeholder={t("modal.personality_placeholder")}
                  rows={4}
                  maxLength={500}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.personality?.length || 0}/500</span>
                </div>
              </div>

              {/* Hobbies */}
              <div className="space-y-2">
                <Label htmlFor="hobbies" className="text-sm font-medium">
                  {t("modal.hobbies")}
                </Label>
                <Textarea
                  id="hobbies"
                  {...register("hobbies")}
                  placeholder={t("modal.hobbies_placeholder")}
                  rows={3}
                  maxLength={250}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.hobbies?.length || 0}/250</span>
                </div>
              </div>

              {/* Dreams and Goals */}
              <div className="space-y-2">
                <Label
                  htmlFor="dreamsAndGoals"
                  className="text-sm font-medium"
                >
                  {t("modal.dreams_and_goals")}
                </Label>
                <Textarea
                  id="dreamsAndGoals"
                  {...register("dreamsAndGoals")}
                  placeholder={t("modal.dreams_placeholder")}
                  rows={3}
                  maxLength={250}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.dreamsAndGoals?.length || 0}/250</span>
                </div>
              </div>

              {/* Fears and Traumas */}
              <div className="space-y-2">
                <Label
                  htmlFor="fearsAndTraumas"
                  className="text-sm font-medium"
                >
                  {t("modal.fears_and_traumas")}
                </Label>
                <Textarea
                  id="fearsAndTraumas"
                  {...register("fearsAndTraumas")}
                  placeholder={t("modal.fears_placeholder")}
                  rows={3}
                  maxLength={250}
                  className="resize-none"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{watchedValues.fearsAndTraumas?.length || 0}/250</span>
                </div>
              </div>

              {/* Favorite Food */}
              <div className="space-y-2">
                <Label
                  htmlFor="favoriteFood"
                  className="text-sm font-medium"
                >
                  {t("modal.favorite_food")}
                </Label>
                <Input
                  id="favoriteFood"
                  {...register("favoriteFood")}
                  placeholder={t("modal.favorite_food_placeholder")}
                />
              </div>

              {/* Favorite Music */}
              <div className="space-y-2">
                <Label
                  htmlFor="favoriteMusic"
                  className="text-sm font-medium"
                >
                  {t("modal.favorite_music")}
                </Label>
                <Input
                  id="favoriteMusic"
                  {...register("favoriteMusic")}
                  placeholder={t("modal.favorite_music_placeholder")}
                  type="url"
                />
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

            {/* Locations and Organizations Section */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                {t("modal.locations_section")}
              </h4>

              {/* Birth Place */}
              <div className="space-y-2">
                <Label htmlFor="birthPlace" className="text-sm font-medium">
                  {t("modal.birth_place")}
                </Label>
                {hasLocations ? (
                  <Select
                    value={watchedValues.birthPlace}
                    onValueChange={(value) => setValue("birthPlace", value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("modal.birth_place_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {t("modal.no_locations_warning")}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Affiliated Place */}
              <div className="space-y-2">
                <Label
                  htmlFor="affiliatedPlace"
                  className="text-sm font-medium"
                >
                  {t("modal.affiliated_place")}
                </Label>
                {hasLocations ? (
                  <Select
                    value={watchedValues.affiliatedPlace}
                    onValueChange={(value) =>
                      setValue("affiliatedPlace", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("modal.affiliated_place_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {t("modal.no_locations_warning")}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm font-medium">
                  {t("modal.organization")}
                </Label>
                {hasOrganizations ? (
                  <Select
                    value={watchedValues.organization}
                    onValueChange={(value) => setValue("organization", value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("modal.organization_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent side="bottom">
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {t("modal.no_organizations_warning")}
                    </AlertDescription>
                  </Alert>
                )}
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
