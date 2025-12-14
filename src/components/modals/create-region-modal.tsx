import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Map as MapIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormInput } from "@/components/forms/FormInput";
import { FormListInput } from "@/components/forms/FormListInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { EntityModal } from "@/components/modals/entity-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { SectionTitle } from "@/components/ui/section-title";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { IItem } from "@/lib/db/items.service";
import { IRace } from "@/pages/dashboard/tabs/races/types/race-types";
import { ScalePicker } from "@/pages/dashboard/tabs/world/components/scale-picker";
import {
  IRegion,
  RegionSeason,
  IRegionFormData,
} from "@/pages/dashboard/tabs/world/types/region-types";
import { ICharacter } from "@/types/character-types";
import { IFaction } from "@/types/faction-types";

import { SeasonPicker } from "./create-region-modal/components/season-picker";

interface CreateRegionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: IRegionFormData) => void;
  availableRegions?: IRegion[];
  editRegion?: IRegion | null;
  bookId: string;
  // Legacy props - mantidos para compatibilidade mas não usados
  factions?: IFaction[];
  characters?: ICharacter[];
  races?: IRace[];
  items?: IItem[];
  _unused?: never; // Marker to indicate legacy props are intentionally unused
}

const createRegionFormSchema = (t: (key: string) => string) =>
  z.object({
    // Basic fields
    name: z
      .string()
      .min(1, t("forms:validation.name_required"))
      .max(100, t("forms:validation.name_too_long")),
    parentId: z.string().nullable(),
    scale: z.enum([
      "local",
      "continental",
      "planetary",
      "galactic",
      "universal",
      "multiversal",
    ]),
    summary: z
      .string()
      .min(1, t("forms:validation.summary_required"))
      .max(500, t("forms:validation.summary_too_long")),
    image: z.string().optional(),

    // Environment fields
    climate: z.string().max(500).optional(),
    currentSeason: z
      .enum(["spring", "summer", "autumn", "winter", "custom"])
      .optional(),
    customSeasonName: z.string().max(50).optional(),
    generalDescription: z.string().max(1000).optional(),
    regionAnomalies: z.array(z.string()).optional(),

    // Information fields
    residentFactions: z.array(z.string()).optional(),
    dominantFactions: z.array(z.string()).optional(),
    importantCharacters: z.array(z.string()).optional(),
    racesFound: z.array(z.string()).optional(),
    itemsFound: z.array(z.string()).optional(),

    // Narrative fields
    narrativePurpose: z.string().max(500).optional(),
    uniqueCharacteristics: z.string().max(500).optional(),
    politicalImportance: z.string().max(500).optional(),
    religiousImportance: z.string().max(500).optional(),
    worldPerception: z.string().max(500).optional(),
    regionMysteries: z.array(z.string()).optional(),
    inspirations: z.array(z.string()).optional(),
  });

type RegionFormValues = z.infer<ReturnType<typeof createRegionFormSchema>>;

// Helper to parse JSON array fields from IRegion
function parseJsonArray(jsonString: string | undefined): string[] {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
}

export function CreateRegionModal({
  open,
  onOpenChange,
  onConfirm,
  availableRegions = [],
  editRegion = null,
  bookId,
}: CreateRegionModalProps) {
  const { t } = useTranslation(["world", "forms"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh of entity selects when modal opens
  useEffect(() => {
    if (open) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [open]);

  const form = useForm<RegionFormValues>({
    resolver: zodResolver(createRegionFormSchema(t)),
    mode: "onChange",
    defaultValues: {
      name: editRegion?.name || "",
      parentId: editRegion?.parentId || null,
      scale: editRegion?.scale || "local",
      summary: editRegion?.summary || "",
      image: editRegion?.image || "",
      // Environment
      climate: editRegion?.climate || "",
      currentSeason: editRegion?.currentSeason || undefined,
      customSeasonName: editRegion?.customSeasonName || "",
      generalDescription: editRegion?.generalDescription || "",
      regionAnomalies: parseJsonArray(editRegion?.regionAnomalies),
      // Information
      residentFactions: parseJsonArray(editRegion?.residentFactions),
      dominantFactions: parseJsonArray(editRegion?.dominantFactions),
      importantCharacters: parseJsonArray(editRegion?.importantCharacters),
      racesFound: parseJsonArray(editRegion?.racesFound),
      itemsFound: parseJsonArray(editRegion?.itemsFound),
      // Narrative
      narrativePurpose: editRegion?.narrativePurpose || "",
      uniqueCharacteristics: editRegion?.uniqueCharacteristics || "",
      politicalImportance: editRegion?.politicalImportance || "",
      religiousImportance: editRegion?.religiousImportance || "",
      worldPerception: editRegion?.worldPerception || "",
      regionMysteries: parseJsonArray(editRegion?.regionMysteries),
      inspirations: parseJsonArray(editRegion?.inspirations),
    },
  });

  // Update form when editRegion changes
  useEffect(() => {
    if (editRegion) {
      form.reset({
        name: editRegion.name,
        parentId: editRegion.parentId,
        scale: editRegion.scale,
        summary: editRegion.summary || "",
        image: editRegion.image || "",
        // Environment
        climate: editRegion.climate || "",
        currentSeason: editRegion.currentSeason || undefined,
        customSeasonName: editRegion.customSeasonName || "",
        generalDescription: editRegion.generalDescription || "",
        regionAnomalies: parseJsonArray(editRegion.regionAnomalies),
        // Information
        residentFactions: parseJsonArray(editRegion.residentFactions),
        dominantFactions: parseJsonArray(editRegion.dominantFactions),
        importantCharacters: parseJsonArray(editRegion.importantCharacters),
        racesFound: parseJsonArray(editRegion.racesFound),
        itemsFound: parseJsonArray(editRegion.itemsFound),
        // Narrative
        narrativePurpose: editRegion.narrativePurpose || "",
        uniqueCharacteristics: editRegion.uniqueCharacteristics || "",
        politicalImportance: editRegion.politicalImportance || "",
        religiousImportance: editRegion.religiousImportance || "",
        worldPerception: editRegion.worldPerception || "",
        regionMysteries: parseJsonArray(editRegion.regionMysteries),
        inspirations: parseJsonArray(editRegion.inspirations),
      });
    } else {
      form.reset({
        name: "",
        parentId: null,
        scale: "local",
        summary: "",
        image: "",
        climate: "",
        currentSeason: undefined,
        customSeasonName: "",
        generalDescription: "",
        regionAnomalies: [],
        residentFactions: [],
        dominantFactions: [],
        importantCharacters: [],
        racesFound: [],
        itemsFound: [],
        narrativePurpose: "",
        uniqueCharacteristics: "",
        politicalImportance: "",
        religiousImportance: "",
        worldPerception: "",
        regionMysteries: [],
        inspirations: [],
      });
    }
  }, [editRegion, form]);

  const handleSubmit = async (data: RegionFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert form data to IRegionFormData (arrays stay as arrays)
      const formData: IRegionFormData = {
        ...data,
      };
      onConfirm(formData);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <EntityModal
          open={open}
          onOpenChange={handleClose}
          header={{
            title: editRegion
              ? t("create_region.edit_title")
              : t("create_region.title"),
            icon: MapIcon,
            description: t("description"),
            warning: t("create_region.warning"),
          }}
          basicFieldsTitle={t("create_region.basic_fields")}
          basicFields={
            <div className="space-y-6">
              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center -mx-6">
                        <div className="w-full max-w-[587px] px-6">
                          <FormImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            label={t("create_region.image_label")}
                            helperText="opcional"
                            height="h-[28rem]"
                            shape="rounded"
                            placeholderIcon={MapIcon}
                            id="region-image-upload"
                          />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("create_region.name_label")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder={t("create_region.name_placeholder")}
                        maxLength={100}
                        showCharCount
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Parent Region */}
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("create_region.parent_label")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <Select
                      value={field.value || "neutral"}
                      onValueChange={(value) =>
                        field.onChange(value === "neutral" ? null : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("create_region.parent_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="neutral">
                          {t("create_region.parent_neutral")}
                        </SelectItem>
                        {availableRegions
                          .filter((r) => r.id !== editRegion?.id)
                          .map((region) => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Scale Picker */}
              <FormField
                control={form.control}
                name="scale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("create_region.scale_label")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <ScalePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Summary */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("create_region.summary_label")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormTextarea
                        {...field}
                        placeholder={t("create_region.summary_placeholder")}
                        rows={4}
                        maxLength={500}
                        showCharCount
                        className="resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          }
          advancedFields={
            <>
              {/* Environment Section */}
              <div className="space-y-4">
                <SectionTitle>
                  {t("create_region.environment_section")}
                </SectionTitle>

                {/* Climate */}
                <FormField
                  control={form.control}
                  name="climate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.climate_label")}
                          placeholder={t("create_region.climate_placeholder")}
                          rows={4}
                          maxLength={500}
                          showCharCount
                          className="resize-none"
                          labelClassName="text-primary"
                          showOptionalLabel={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Season Picker */}
                <FormField
                  control={form.control}
                  name="currentSeason"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SeasonPicker
                          value={field.value}
                          customSeasonName={form.watch("customSeasonName")}
                          onSeasonChange={(season: RegionSeason) =>
                            field.onChange(season)
                          }
                          onCustomNameChange={(name) =>
                            form.setValue("customSeasonName", name)
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* General Description */}
                <FormField
                  control={form.control}
                  name="generalDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.general_description_label")}
                          placeholder={t(
                            "create_region.general_description_placeholder"
                          )}
                          rows={5}
                          maxLength={1000}
                          showCharCount
                          className="resize-none"
                          labelClassName="text-primary"
                          showOptionalLabel={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Region Anomalies */}
                <FormField
                  control={form.control}
                  name="regionAnomalies"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormListInput
                          label={t("create_region.region_anomalies_label")}
                          placeholder={t("create_region.anomaly_placeholder")}
                          buttonText={t("create_region.add_anomaly")}
                          value={field.value || []}
                          onChange={field.onChange}
                          maxLength={200}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Information Section */}
              <div className="space-y-4">
                <SectionTitle>
                  {t("create_region.information_section")}
                </SectionTitle>

                {/* Resident Factions */}
                <FormField
                  control={form.control}
                  name="residentFactions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`resident-factions-${refreshKey}`}
                          entityType="faction"
                          bookId={bookId}
                          label={t("create_region.resident_factions_label")}
                          placeholder={t(
                            "create_region.resident_factions_placeholder"
                          )}
                          emptyText={t("create_region.no_factions_warning")}
                          noSelectionText={t(
                            "create_region.no_factions_selected"
                          )}
                          searchPlaceholder={t("create_region.search_faction")}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Dominant Factions */}
                <FormField
                  control={form.control}
                  name="dominantFactions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`dominant-factions-${refreshKey}`}
                          entityType="faction"
                          bookId={bookId}
                          label={t("create_region.dominant_factions_label")}
                          placeholder={t(
                            "create_region.dominant_factions_placeholder"
                          )}
                          emptyText={t("create_region.no_factions_warning")}
                          noSelectionText={t(
                            "create_region.no_factions_selected"
                          )}
                          searchPlaceholder={t("create_region.search_faction")}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Important Characters */}
                <FormField
                  control={form.control}
                  name="importantCharacters"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`important-characters-${refreshKey}`}
                          entityType="character"
                          bookId={bookId}
                          label={t("create_region.important_characters_label")}
                          placeholder={t(
                            "create_region.important_characters_placeholder"
                          )}
                          emptyText={t("create_region.no_characters_warning")}
                          noSelectionText={t(
                            "create_region.no_characters_selected"
                          )}
                          searchPlaceholder={t(
                            "create_region.search_character"
                          )}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Races Found */}
                <FormField
                  control={form.control}
                  name="racesFound"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`races-found-${refreshKey}`}
                          entityType="race"
                          bookId={bookId}
                          label={t("create_region.races_found_label")}
                          placeholder={t(
                            "create_region.races_found_placeholder"
                          )}
                          emptyText={t("create_region.no_races_warning")}
                          noSelectionText={t("create_region.no_races_selected")}
                          searchPlaceholder={t("create_region.search_race")}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Items Found */}
                <FormField
                  control={form.control}
                  name="itemsFound"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`items-found-${refreshKey}`}
                          entityType="item"
                          bookId={bookId}
                          label={t("create_region.items_found_label")}
                          placeholder={t(
                            "create_region.items_found_placeholder"
                          )}
                          emptyText={t("create_region.no_items_warning")}
                          noSelectionText={t("create_region.no_items_selected")}
                          searchPlaceholder={t("create_region.search_item")}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Narrative Section */}
              <div className="space-y-4">
                <SectionTitle>
                  {t("create_region.narrative_section")}
                </SectionTitle>

                {/* Narrative Purpose */}
                <FormField
                  control={form.control}
                  name="narrativePurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.narrative_purpose_label")}
                          placeholder={t(
                            "create_region.narrative_purpose_placeholder"
                          )}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          className="resize-none"
                          labelClassName="text-primary"
                          showOptionalLabel={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Unique Characteristics */}
                <FormField
                  control={form.control}
                  name="uniqueCharacteristics"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t(
                            "create_region.unique_characteristics_label"
                          )}
                          placeholder={t(
                            "create_region.unique_characteristics_placeholder"
                          )}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          className="resize-none"
                          labelClassName="text-primary"
                          showOptionalLabel={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Political Importance */}
                <FormField
                  control={form.control}
                  name="politicalImportance"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.political_importance_label")}
                          placeholder={t(
                            "create_region.political_importance_placeholder"
                          )}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          className="resize-none"
                          labelClassName="text-primary"
                          showOptionalLabel={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Religious Importance */}
                <FormField
                  control={form.control}
                  name="religiousImportance"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.religious_importance_label")}
                          placeholder={t(
                            "create_region.religious_importance_placeholder"
                          )}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          className="resize-none"
                          labelClassName="text-primary"
                          showOptionalLabel={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* World Perception */}
                <FormField
                  control={form.control}
                  name="worldPerception"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.world_perception_label")}
                          placeholder={t(
                            "create_region.world_perception_placeholder"
                          )}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          className="resize-none"
                          labelClassName="text-primary"
                          showOptionalLabel={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Region Mysteries */}
                <FormField
                  control={form.control}
                  name="regionMysteries"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormListInput
                          label={t("create_region.region_mysteries_label")}
                          placeholder={t("create_region.mystery_placeholder")}
                          buttonText={t("create_region.add_mystery")}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Inspirations */}
                <FormField
                  control={form.control}
                  name="inspirations"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormListInput
                          label={t("create_region.inspirations_label")}
                          placeholder={t(
                            "create_region.inspiration_placeholder"
                          )}
                          buttonText={t("create_region.add_inspiration")}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </>
          }
          footer={{
            isSubmitting,
            isValid: form.formState.isValid,
            onSubmit: form.handleSubmit(handleSubmit),
            onCancel: handleClose,
            editMode: !!editRegion,
            submitLabel: isSubmitting
              ? editRegion
                ? t("create_region.updating")
                : t("create_region.creating")
              : editRegion
                ? t("create_region.save_button")
                : t("create_region.create_button"),
            cancelLabel: t("create_region.cancel_button"),
          }}
          width="w-full max-w-5xl"
        />
      </form>
    </Form>
  );
}
