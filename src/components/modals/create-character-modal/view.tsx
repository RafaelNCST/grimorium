import { UserPlus, User } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormSimpleGrid } from "@/components/forms/FormSimpleGrid";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormListInput } from "@/components/forms/FormListInput";
import { FormSimplePicker } from "@/components/forms/FormSimplePicker";
import { EntityModal } from "@/components/modals/entity-modal";
import { AlignmentMatrix } from "@/pages/dashboard/tabs/characters/character-detail/components/alignment-matrix";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionTitle } from "@/components/ui/section-title";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { CHARACTER_ARCHETYPES_CONSTANT } from "./constants/character-archetypes";
import { CHARACTER_ROLES_CONSTANT } from "./constants/character-roles";
import { CHARACTER_STATUS_CONSTANT } from "./constants/character-status";
import { GENDERS_CONSTANT } from "./constants/genders";
import { PHYSICAL_TYPES_CONSTANT } from "./constants/physical-types";
import { type CharacterFormSchema } from "./hooks/use-character-validation";

interface PropsCreateCharacterModalView {
  open: boolean;
  form: UseFormReturn<CharacterFormSchema>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  bookId: string;
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
  bookId,
  hasLocations,
  locations,
}: PropsCreateCharacterModalView) {
  const { t } = useTranslation("create-character");
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const watchedValues = watch();

  // Convert role constants to FormSimpleGrid format
  const roleOptions = CHARACTER_ROLES_CONSTANT.map((role) => ({
    value: role.value,
    label: t(role.translationKey),
    icon: role.icon,
    backgroundColor: role.value === 'protagonist' ? 'yellow-500/10' :
                     role.value === 'antagonist' ? 'orange-500/10' :
                     role.value === 'villain' ? 'red-500/10' :
                     role.value === 'secondary' ? 'blue-500/10' : 'gray-500/10',
    borderColor: role.value === 'protagonist' ? 'yellow-500/20' :
                 role.value === 'antagonist' ? 'orange-500/20' :
                 role.value === 'villain' ? 'red-500/20' :
                 role.value === 'secondary' ? 'blue-500/20' : 'gray-500/20',
  }));

  // Convert physical type constants to FormSimpleGrid format
  const physicalTypeOptions = PHYSICAL_TYPES_CONSTANT.map((type) => ({
    value: type.value,
    label: t(type.translationKey),
    icon: type.icon,
    backgroundColor: type.value === 'malnourished' ? 'orange-500/10' :
                     type.value === 'thin' ? 'sky-500/10' :
                     type.value === 'athletic' ? 'emerald-500/10' :
                     type.value === 'robust' ? 'blue-500/10' :
                     type.value === 'corpulent' ? 'purple-500/10' : 'red-500/10',
    borderColor: type.value === 'malnourished' ? 'orange-500/20' :
                 type.value === 'thin' ? 'sky-500/20' :
                 type.value === 'athletic' ? 'emerald-500/20' :
                 type.value === 'robust' ? 'blue-500/20' :
                 type.value === 'corpulent' ? 'purple-500/20' : 'red-500/20',
  }));

  // Convert archetype constants to FormSelectGrid format
  const archetypeOptions = CHARACTER_ARCHETYPES_CONSTANT.map((archetype) => ({
    value: archetype.value,
    label: t(archetype.translationKey),
    description: t(archetype.descriptionKey),
    icon: archetype.icon,
    backgroundColor: "purple-500/10",
    borderColor: "purple-500/20",
  }));

  // Convert status constants to FormSimplePicker format
  const statusOptions = CHARACTER_STATUS_CONSTANT.map((status) => ({
    value: status.value,
    translationKey: status.translationKey,
    icon: status.icon,
    color: "text-muted-foreground",
    activeColor: status.colorClass,
  }));

  const basicFields = (
    <>
      <div className="flex gap-6">
        {/* Character Image */}
        <FormImageUpload
          value={watchedValues.image || ""}
          onChange={(image) => setValue("image", image)}
          label={t("modal.image")}
          shape="circle"
          height="h-24"
          width="w-24"
          imageFit="cover"
          showLabel={false}
          placeholderIcon={User}
        />

        {/* Name, Age, Gender */}
        <div className="flex-1 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-primary">
              {t("modal.character_name")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={t("modal.name_placeholder")}
              maxLength={100}
              className={errors.name ? "border-destructive" : ""}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{watchedValues.name?.length || 0}/100</span>
            </div>
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-primary">
                {t("modal.age")}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="age"
                {...register("age")}
                placeholder={t("modal.age_placeholder")}
                maxLength={50}
                className={errors.age ? "border-destructive" : ""}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{watchedValues.age?.length || 0}/50</span>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-primary">
                {t("modal.gender")}
                <span className="text-destructive ml-1">*</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* Simple Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-primary">
          {t("modal.simple_description")}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder={t("modal.description_placeholder")}
          rows={4}
          maxLength={500}
          className={`resize-none ${errors.description ? "border-destructive" : ""}`}
        />
        <div className="flex justify-end text-xs text-muted-foreground">
          <span>{watchedValues.description?.length || 0}/500</span>
        </div>
      </div>

      {/* Status - Using FormSimplePicker */}
      <FormSimplePicker
        value={watchedValues.status || null}
        onChange={(value) => setValue("status", value)}
        options={statusOptions}
        label={t("modal.status")}
        required
        translationNamespace="create-character"
      />

      {/* Role Picker - Using FormSimpleGrid */}
      <FormSimpleGrid
        value={watchedValues.role || ""}
        onChange={(value) => setValue("role", value)}
        label={t("modal.role")}
        required
        columns={5}
        options={roleOptions}
      />
    </>
  );

  const advancedFields = (
    <>
      {/* Appearance Section */}
      <div className="space-y-4">
        <SectionTitle>{t("modal.appearance_section")}</SectionTitle>

        {/* Height and Weight - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium text-primary">
              {t("modal.height")}
            </Label>
            <Input
              id="height"
              {...register("height")}
              placeholder={t("modal.height_placeholder")}
              maxLength={50}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{watchedValues.height?.length || 0}/50</span>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-primary">
              {t("modal.weight")}
            </Label>
            <Input
              id="weight"
              {...register("weight")}
              placeholder={t("modal.weight_placeholder")}
              maxLength={50}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{watchedValues.weight?.length || 0}/50</span>
            </div>
          </div>
        </div>

        {/* Skin Tone - Full width */}
        <div className="space-y-2">
          <Label htmlFor="skinTone" className="text-sm font-medium text-primary">
            {t("modal.skin_tone")}
          </Label>
          <Input
            id="skinTone"
            {...register("skinTone")}
            placeholder={t("modal.skin_tone_placeholder")}
            maxLength={100}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.skinTone?.length || 0}/100</span>
          </div>
        </div>

        {/* Hair - Full width */}
        <div className="space-y-2">
          <Label htmlFor="hair" className="text-sm font-medium text-primary">
            {t("modal.hair")}
          </Label>
          <Input
            id="hair"
            {...register("hair")}
            placeholder={t("modal.hair_placeholder")}
            maxLength={100}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.hair?.length || 0}/100</span>
          </div>
        </div>

        {/* Eyes - Full width */}
        <div className="space-y-2">
          <Label htmlFor="eyes" className="text-sm font-medium text-primary">
            {t("modal.eyes")}
          </Label>
          <Input
            id="eyes"
            {...register("eyes")}
            placeholder={t("modal.eyes_placeholder")}
            maxLength={200}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.eyes?.length || 0}/200</span>
          </div>
        </div>

        {/* Face - Full width */}
        <div className="space-y-2">
          <Label htmlFor="face" className="text-sm font-medium text-primary">
            {t("modal.face")}
          </Label>
          <Input
            id="face"
            {...register("face")}
            placeholder={t("modal.face_placeholder")}
            maxLength={200}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.face?.length || 0}/200</span>
          </div>
        </div>

        {/* Species and Race - FormEntityMultiSelectAuto */}
        <FormEntityMultiSelectAuto
          entityType="race"
          bookId={bookId}
          label={t("modal.species_and_race")}
          placeholder={t("modal.species_placeholder")}
          emptyText={t("modal.no_species_warning")}
          noSelectionText={t("modal.no_species_selected")}
          searchPlaceholder={t("modal.search_species")}
          value={watchedValues.speciesAndRace || []}
          onChange={(value) => setValue("speciesAndRace", value)}
          labelClassName="text-sm font-medium text-primary"
        />

        {/* Physical Type - Using FormSimpleGrid */}
        <FormSimpleGrid
          value={watchedValues.physicalType || ""}
          onChange={(value) => setValue("physicalType", value)}
          label={t("modal.physical_type")}
          columns={6}
          options={physicalTypeOptions}
        />

        {/* Distinguishing Features - Full width */}
        <div className="space-y-2">
          <Label
            htmlFor="distinguishingFeatures"
            className="text-sm font-medium text-primary"
          >
            {t("modal.distinguishing_features")}
          </Label>
          <Textarea
            id="distinguishingFeatures"
            {...register("distinguishingFeatures")}
            placeholder={t("modal.distinguishing_features_placeholder")}
            rows={3}
            maxLength={400}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>
              {watchedValues.distinguishingFeatures?.length || 0}/400
            </span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Behavior and Tastes Section */}
      <div className="space-y-4">
        <SectionTitle>{t("modal.behavior_section")}</SectionTitle>

        {/* Archetype - Using FormSelectGrid */}
        <FormSelectGrid
          value={watchedValues.archetype || ""}
          onChange={(value) => setValue("archetype", value)}
          label={t("modal.character_archetype")}
          columns={4}
          options={archetypeOptions}
        />

        {/* Alignment */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-primary">
            {t("modal.alignment")}
          </Label>
          <AlignmentMatrix
            value={watchedValues.alignment || ""}
            onChange={(value) => setValue("alignment", value)}
            isEditable={true}
          />
        </div>

        {/* Personality */}
        <div className="space-y-2">
          <Label htmlFor="personality" className="text-sm font-medium text-primary">
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
          <Label htmlFor="hobbies" className="text-sm font-medium text-primary">
            {t("modal.hobbies")}
          </Label>
          <Textarea
            id="hobbies"
            {...register("hobbies")}
            placeholder={t("modal.hobbies_placeholder")}
            rows={3}
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.hobbies?.length || 0}/500</span>
          </div>
        </div>

        {/* Dreams and Goals */}
        <div className="space-y-2">
          <Label htmlFor="dreamsAndGoals" className="text-sm font-medium text-primary">
            {t("modal.dreams_and_goals")}
          </Label>
          <Textarea
            id="dreamsAndGoals"
            {...register("dreamsAndGoals")}
            placeholder={t("modal.dreams_placeholder")}
            rows={3}
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.dreamsAndGoals?.length || 0}/500</span>
          </div>
        </div>

        {/* Fears and Traumas */}
        <div className="space-y-2">
          <Label
            htmlFor="fearsAndTraumas"
            className="text-sm font-medium text-primary"
          >
            {t("modal.fears_and_traumas")}
          </Label>
          <Textarea
            id="fearsAndTraumas"
            {...register("fearsAndTraumas")}
            placeholder={t("modal.fears_placeholder")}
            rows={3}
            maxLength={500}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.fearsAndTraumas?.length || 0}/500</span>
          </div>
        </div>

        {/* Favorite Food */}
        <div className="space-y-2">
          <Label htmlFor="favoriteFood" className="text-sm font-medium text-primary">
            {t("modal.favorite_food")}
          </Label>
          <Input
            id="favoriteFood"
            {...register("favoriteFood")}
            placeholder={t("modal.favorite_food_placeholder")}
            maxLength={100}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.favoriteFood?.length || 0}/100</span>
          </div>
        </div>

        {/* Favorite Music */}
        <div className="space-y-2">
          <Label htmlFor="favoriteMusic" className="text-sm font-medium text-primary">
            {t("modal.favorite_music")}
          </Label>
          <Input
            id="favoriteMusic"
            {...register("favoriteMusic")}
            placeholder={t("modal.favorite_music_placeholder")}
            maxLength={100}
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.favoriteMusic?.length || 0}/100</span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* History Section */}
      <div className="space-y-4">
        <SectionTitle>{t("modal.locations_section")}</SectionTitle>

        <FormEntityMultiSelectAuto
          entityType="region"
          bookId={bookId}
          label={t("modal.birth_place")}
          placeholder={t("modal.birth_place_placeholder")}
          emptyText={t("modal.no_locations_warning")}
          noSelectionText={t("modal.no_birth_place_selected")}
          searchPlaceholder={t("modal.search_location")}
          value={watchedValues.birthPlace || []}
          onChange={(value) => setValue("birthPlace", value)}
          labelClassName="text-sm font-medium text-primary"
          maxSelections={1}
        />

        {/* Nicknames - FormListInput */}
        <FormListInput
          label={t("modal.nicknames")}
          placeholder={t("modal.nicknames_placeholder")}
          buttonText={t("modal.add_nickname")}
          value={watchedValues.nicknames || []}
          onChange={(value) => setValue("nicknames", value)}
          labelClassName="text-sm font-medium text-primary"
          inputSize="small"
        />

        {/* Past - Textarea */}
        <div className="space-y-2">
          <Label htmlFor="past" className="text-sm font-medium text-primary">
            {t("modal.past")}
          </Label>
          <Textarea
            id="past"
            {...register("past")}
            placeholder={t("modal.past_placeholder")}
            rows={5}
            maxLength={1000}
            className="resize-none"
          />
          <div className="flex justify-end text-xs text-muted-foreground">
            <span>{watchedValues.past?.length || 0}/1000</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <EntityModal
      open={open}
      onOpenChange={onClose}
      header={{
        title: t("modal.create_character"),
        icon: UserPlus,
        description: t("modal.header_description"),
        warning: t("modal.info_message"),
      }}
      basicFields={basicFields}
      advancedFields={advancedFields}
      footer={{
        isSubmitting: false,
        isValid: isValid,
        onSubmit: onSubmit,
        onCancel: onClose,
        submitLabel: t("button.create"),
        cancelLabel: t("button.cancel"),
      }}
      maxWidth="max-w-3xl"
      basicFieldsTitle={t("modal.basic_fields")}
      advancedFieldsTitle={t("modal.advanced_fields")}
    />
  );
}
