import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoAlert } from "@/components/ui/info-alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { ScalePicker } from "@/pages/dashboard/tabs/world/components/scale-picker";
import { IRegion, RegionScale, RegionSeason, IRegionFormData } from "@/pages/dashboard/tabs/world/types/region-types";
import { IFaction } from "@/types/faction-types";
import { ICharacter } from "@/types/character-types";
import { IRace } from "@/pages/dashboard/tabs/races/types/race-types";
import { IItem } from "@/lib/db/items.service";
import { ImagePlus, X, Map, Plus, Save, Loader2 } from "lucide-react";
import { AdvancedSection } from "./create-region-modal/components/advanced-section";
import { SeasonPicker } from "./create-region-modal/components/season-picker";
import { ListInput } from "./create-region-modal/components/list-input";

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
}

const regionFormSchema = z.object({
  // Basic fields
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  parentId: z.string().nullable(),
  scale: z.enum(["local", "continental", "planetary", "galactic", "universal", "multiversal"]),
  summary: z.string().min(1, "Resumo é obrigatório").max(500, "Resumo muito longo"),
  image: z.string().optional(),

  // Environment fields
  climate: z.string().max(500).optional(),
  currentSeason: z.enum(["spring", "summer", "autumn", "winter", "custom"]).optional(),
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

type RegionFormValues = z.infer<typeof regionFormSchema>;

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
  factions,
  characters,
  races,
  items,
}: CreateRegionModalProps) {
  const { t } = useTranslation("world");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(editRegion?.image);
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh of entity selects when modal opens
  useEffect(() => {
    if (open) {
      setRefreshKey(prev => prev + 1);
    }
  }, [open]);

  const form = useForm<RegionFormValues>({
    resolver: zodResolver(regionFormSchema),
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
      setImageSrc(editRegion.image);
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
      setImageSrc(undefined);
    }
  }, [editRegion, form]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue("image", result);
        setImageSrc(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("image", "");
    setImageSrc(undefined);
  };

  const handleSubmit = async (data: RegionFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert form data to IRegionFormData (arrays stay as arrays)
      const formData: IRegionFormData = {
        ...data,
      };
      onConfirm(formData);
      form.reset();
      setImageSrc(undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setImageSrc(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            {editRegion ? t("create_region.edit_title") : t("create_region.title")}
          </DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        {/* Important Note Alert */}
        <InfoAlert>
          Tudo pode ser editado mais tarde. Algumas seções especiais só podem ser adicionadas após a criação da região.
        </InfoAlert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Fields Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {t("create_region.basic_fields")}
              </h3>

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("create_region.image_label")}
                      <span className="text-xs text-muted-foreground ml-2">(opcional - {t("create_region.image_recommended")})</span>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="region-image-upload"
                        />
                        {imageSrc ? (
                          <div className="relative w-full h-[28rem] rounded-lg overflow-hidden border">
                            <img
                              src={imageSrc}
                              alt="Region preview"
                              className="w-full h-full object-fill"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 hover:bg-destructive/10 hover:text-destructive"
                              onClick={handleRemoveImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label htmlFor="region-image-upload" className="cursor-pointer block">
                            <div className="w-full h-[28rem] border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors rounded-lg flex flex-col items-center justify-center gap-2">
                              <ImagePlus className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {t("create_region.upload_image")}
                              </span>
                            </div>
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {t("create_region.name_label")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <FormInput
                        {...field}
                        placeholder={t("create_region.name_placeholder")}
                        maxLength={200}
                        error={fieldState.error?.message}
                        showLabel={false}
                      />
                    </FormControl>
                    <FormMessage />
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
                          <SelectValue placeholder={t("create_region.parent_placeholder")} />
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
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Summary */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field, fieldState }) => (
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
                        error={fieldState.error?.message}
                        className="resize-none"
                        showLabel={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Advanced Section */}
            <AdvancedSection>
              {/* Environment Section */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
                  {t("create_region.environment_section")}
                </h4>

                {/* Climate */}
                <FormField
                  control={form.control}
                  name="climate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.climate_label")}
                          placeholder={t("create_region.climate_placeholder")}
                          rows={4}
                          maxLength={500}
                          showCharCount
                          error={fieldState.error?.message}
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
                          onSeasonChange={(season: RegionSeason) => field.onChange(season)}
                          onCustomNameChange={(name) => form.setValue("customSeasonName", name)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* General Description */}
                <FormField
                  control={form.control}
                  name="generalDescription"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.general_description_label")}
                          placeholder={t("create_region.general_description_placeholder")}
                          rows={5}
                          maxLength={1000}
                          showCharCount
                          error={fieldState.error?.message}
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
                        <ListInput
                          label={t("create_region.region_anomalies_label")}
                          placeholder={t("create_region.anomaly_placeholder")}
                          buttonText={t("create_region.add_anomaly")}
                          value={field.value || []}
                          onChange={field.onChange}
                          maxLength={200}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Information Section */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
                  {t("create_region.information_section")}
                </h4>

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
                          placeholder={t("create_region.resident_factions_placeholder")}
                          emptyText={t("create_region.no_factions_warning")}
                          noSelectionText={t("create_region.no_factions_selected")}
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
                          placeholder={t("create_region.dominant_factions_placeholder")}
                          emptyText={t("create_region.no_factions_warning")}
                          noSelectionText={t("create_region.no_factions_selected")}
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
                          placeholder={t("create_region.important_characters_placeholder")}
                          emptyText={t("create_region.no_characters_warning")}
                          noSelectionText={t("create_region.no_characters_selected")}
                          searchPlaceholder={t("create_region.search_character")}
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
                          placeholder={t("create_region.races_found_placeholder")}
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
                          placeholder={t("create_region.items_found_placeholder")}
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
                <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
                  {t("create_region.narrative_section")}
                </h4>

                {/* Narrative Purpose */}
                <FormField
                  control={form.control}
                  name="narrativePurpose"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.narrative_purpose_label")}
                          placeholder={t("create_region.narrative_purpose_placeholder")}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          error={fieldState.error?.message}
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.unique_characteristics_label")}
                          placeholder={t("create_region.unique_characteristics_placeholder")}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          error={fieldState.error?.message}
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.political_importance_label")}
                          placeholder={t("create_region.political_importance_placeholder")}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          error={fieldState.error?.message}
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.religious_importance_label")}
                          placeholder={t("create_region.religious_importance_placeholder")}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          error={fieldState.error?.message}
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <FormTextarea
                          {...field}
                          label={t("create_region.world_perception_label")}
                          placeholder={t("create_region.world_perception_placeholder")}
                          rows={3}
                          maxLength={500}
                          showCharCount
                          error={fieldState.error?.message}
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
                        <ListInput
                          label={t("create_region.region_mysteries_label")}
                          placeholder={t("create_region.mystery_placeholder")}
                          buttonText={t("create_region.add_mystery")}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                      <FormMessage />
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
                        <ListInput
                          label={t("create_region.inspirations_label")}
                          placeholder={t("create_region.inspiration_placeholder")}
                          buttonText={t("create_region.add_inspiration")}
                          value={field.value || []}
                          onChange={field.onChange}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AdvancedSection>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                {t("create_region.cancel_button")}
              </Button>
              <Button
                type="submit"
                variant="magical"
                className="animate-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : editRegion ? (
                  <Save className="w-4 h-4 mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {isSubmitting
                  ? editRegion ? t("create_region.updating") : t("create_region.creating")
                  : editRegion ? t("create_region.save_button") : t("create_region.create_button")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
