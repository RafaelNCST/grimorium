import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { FormChapterNameWithNumber } from "@/components/forms/FormChapterNameWithNumber";
import {
  FormEntityMultiSelectAuto,
  type EntityOption,
} from "@/components/forms/FormEntityMultiSelectAuto";
import { FormPlotArcButton } from "@/components/forms/FormPlotArcButton";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
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
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { getPlotArcsByBookId } from "@/lib/db/plot.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import { getRegionsByBookId } from "@/lib/db/regions.service";
import type { IPlotArc } from "@/types/plot-types";

export type ChapterStatus =
  | "in-progress"
  | "draft"
  | "review"
  | "finished"
  | "published";

export interface EntityMention {
  id: string;
  name: string;
  image?: string;
  // Character fields
  age?: string;
  gender?: string;
  role?: string;
  status?: string;
  description?: string;
  // Item fields
  category?: string;
  basicDescription?: string;
  // Faction fields
  summary?: string;
  factionType?: string;
  // Race fields
  scientificName?: string;
  domain?: string[];
  // Region fields
  scale?: string;
  parentId?: string;
  parentName?: string;
}

export interface IChapterFormData {
  name: string;
  chapterNumber: string;
  summary: string;
  status: ChapterStatus;
  plotArcId?: string;
  mentionedCharacters?: EntityMention[];
  mentionedRegions?: EntityMention[];
  mentionedItems?: EntityMention[];
  mentionedFactions?: EntityMention[];
  mentionedRaces?: EntityMention[];
}

interface CreateChapterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: IChapterFormData) => void;
  bookId: string;
  existingChapters?: Array<{ chapterNumber: string }>;
}

const entityMentionSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  // Character fields
  age: z.string().optional(),
  gender: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  description: z.string().optional(),
  // Item fields
  category: z.string().optional(),
  basicDescription: z.string().optional(),
  // Faction fields
  summary: z.string().optional(),
  factionType: z.string().optional(),
  // Race fields
  scientificName: z.string().optional(),
  domain: z.array(z.string()).optional(),
  // Region fields
  scale: z.string().optional(),
  parentId: z.string().optional(),
  parentName: z.string().optional(),
});

const createChapterFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("forms:validation.name_required"))
      .max(200, t("forms:validation.name_too_long")),
    chapterNumber: z
      .string()
      .min(1, t("forms:validation.name_required"))
      .regex(
        /^\d+$/,
        "Número do capítulo inválido. Use apenas números inteiros (1, 2, 3)"
      ),
    summary: z
      .string()
      .max(500, t("forms:validation.summary_too_long"))
      .optional()
      .or(z.literal("")),
    status: z.enum(["in-progress", "draft", "review", "finished", "published"]),
    plotArcId: z.string().optional().or(z.literal("")),
    mentionedCharacters: z.array(entityMentionSchema).optional(),
    mentionedRegions: z.array(entityMentionSchema).optional(),
    mentionedItems: z.array(entityMentionSchema).optional(),
    mentionedFactions: z.array(entityMentionSchema).optional(),
    mentionedRaces: z.array(entityMentionSchema).optional(),
  });

type ChapterFormValues = z.infer<ReturnType<typeof createChapterFormSchema>>;

// Status options for FormSelectGrid
const STATUS_OPTIONS = [
  {
    value: "in-progress",
    label: "status.in_progress",
    description: "status.in_progress_description",
    icon: FileText,
    backgroundColor: "blue-500/10",
    borderColor: "blue-500/30",
  },
  {
    value: "draft",
    label: "status.draft",
    description: "status.draft_description",
    icon: FileText,
    backgroundColor: "gray-500/10",
    borderColor: "gray-500/30",
  },
  {
    value: "review",
    label: "status.review",
    description: "status.review_description",
    icon: FileText,
    backgroundColor: "yellow-500/10",
    borderColor: "yellow-500/30",
  },
  {
    value: "finished",
    label: "status.finished",
    description: "status.finished_description",
    icon: FileText,
    backgroundColor: "green-500/10",
    borderColor: "green-500/30",
  },
  {
    value: "published",
    label: "status.published",
    description: "status.published_description",
    icon: FileText,
    backgroundColor: "purple-500/10",
    borderColor: "purple-500/30",
  },
];

// Helper function to calculate next chapter number
function calculateNextChapterNumber(
  existingChapters: Array<{ chapterNumber: string }> = []
): string {
  if (existingChapters.length === 0) {
    return "1";
  }

  const numbers = existingChapters
    .map((ch) => parseFloat(ch.chapterNumber))
    .filter((num) => !isNaN(num));

  if (numbers.length === 0) {
    return "1";
  }

  const maxNumber = Math.max(...numbers);
  return String(Math.floor(maxNumber) + 1);
}

export function CreateChapterModal({
  open,
  onOpenChange,
  onConfirm,
  bookId,
  existingChapters = [],
}: CreateChapterModalProps) {
  const { t } = useTranslation(["create-chapter", "forms"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [availableArcs, setAvailableArcs] = useState<IPlotArc[]>([]);
  const [_availableCharacters, setAvailableCharacters] = useState<
    EntityOption[]
  >([]);
  const [_availableRegions, setAvailableRegions] = useState<EntityOption[]>([]);
  const [_availableItems, setAvailableItems] = useState<EntityOption[]>([]);
  const [_availableFactions, setAvailableFactions] = useState<EntityOption[]>(
    []
  );
  const [_availableRaces, setAvailableRaces] = useState<EntityOption[]>([]);

  // Load arcs and entities when modal opens
  useEffect(() => {
    if (open) {
      setRefreshKey((prev) => prev + 1);

      // Load all entities
      const loadEntities = async () => {
        try {
          const [arcs, characters, regions, items, factions, races] =
            await Promise.all([
              getPlotArcsByBookId(bookId),
              getCharactersByBookId(bookId).then((data) =>
                data.map((c) => ({
                  id: c.id,
                  name: c.name,
                  image: c.image,
                  age: c.age,
                  gender: c.gender,
                  role: c.role,
                  status: c.status,
                  description: c.description,
                }))
              ),
              getRegionsByBookId(bookId).then((data) =>
                data.map((r) => {
                  // Find parent region name if parentId exists
                  const parentRegion = r.parentId
                    ? data.find((region: any) => region.id === r.parentId)
                    : null;
                  return {
                    id: r.id,
                    name: r.name,
                    image: r.image,
                    scale: r.scale,
                    parentId: r.parentId,
                    parentName:
                      parentRegion?.name ||
                      (r.parentId ? "Região Neutra" : undefined),
                    summary: r.summary,
                  };
                })
              ),
              getItemsByBookId(bookId).then((data) =>
                data.map((i) => ({
                  id: i.id,
                  name: i.name,
                  image: i.image,
                  category: i.category,
                  basicDescription: i.basicDescription,
                  status: i.status,
                }))
              ),
              getFactionsByBookId(bookId).then((data) =>
                data.map((f) => ({
                  id: f.id,
                  name: f.name,
                  image: f.image,
                  summary: f.summary,
                  factionType: f.factionType,
                  status: f.status,
                }))
              ),
              getRacesByBookId(bookId).then((data) =>
                data.map((r) => ({
                  id: r.id,
                  name: r.name,
                  image: r.image,
                  scientificName: r.scientificName,
                  domain: r.domain,
                  summary: r.summary,
                }))
              ),
            ]);

          setAvailableArcs(arcs);
          setAvailableCharacters(characters);
          setAvailableRegions(regions);
          setAvailableItems(items);
          setAvailableFactions(factions);
          setAvailableRaces(races);
        } catch (error) {
          console.error("Error loading entities:", error);
        }
      };

      loadEntities();
    }
  }, [open, bookId]);

  // Helper function to convert EntityMention[] to IDs
  const entitiesToIds = (entities: EntityMention[]): string[] =>
    entities.map((e) => e.id);

  const form = useForm<ChapterFormValues>({
    resolver: zodResolver(createChapterFormSchema(t)),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      chapterNumber: calculateNextChapterNumber(existingChapters),
      summary: "",
      status: "" as ChapterStatus,
      plotArcId: undefined,
      mentionedCharacters: [],
      mentionedRegions: [],
      mentionedItems: [],
      mentionedFactions: [],
      mentionedRaces: [],
    },
  });

  // Update chapter number when modal opens
  useEffect(() => {
    if (open) {
      const nextNumber = calculateNextChapterNumber(existingChapters);
      form.reset({
        name: "",
        chapterNumber: nextNumber,
        summary: "",
        status: "" as ChapterStatus,
        plotArcId: undefined,
        mentionedCharacters: [],
        mentionedRegions: [],
        mentionedItems: [],
        mentionedFactions: [],
        mentionedRaces: [],
      });
      // Force validation after reset
      setTimeout(() => {
        form.trigger();
      }, 0);
    }
  }, [open, existingChapters, form]);

  const handleSubmit = async (data: ChapterFormValues) => {
    setIsSubmitting(true);
    try {
      const formData: IChapterFormData = {
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

  // Translate status options
  const translatedStatusOptions = STATUS_OPTIONS.map((opt) => ({
    ...opt,
    label: t(opt.label),
    description: t(opt.description),
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <EntityModal
          open={open}
          onOpenChange={handleClose}
          header={{
            title: t("modal.title"),
            icon: FileText,
            description: t("modal.description"),
            warning: t("modal.warning"),
          }}
          basicFieldsTitle={t("modal.basic_fields")}
          basicFields={
            <div className="space-y-6">
              {/* Chapter Number and Name Combined */}
              <div>
                <FormChapterNameWithNumber
                  numberLabel={t("modal.number_label")}
                  nameLabel={t("modal.name_label")}
                  chapterNumber={form.watch("chapterNumber")}
                  chapterName={form.watch("name")}
                  onChapterNumberChange={(value) =>
                    form.setValue("chapterNumber", value, {
                      shouldValidate: true,
                    })
                  }
                  onChapterNameChange={(value) =>
                    form.setValue("name", value, { shouldValidate: true })
                  }
                  required
                  labelClassName="text-primary"
                  maxLength={200}
                  namePlaceholder={t("modal.name_placeholder")}
                />
              </div>

              {/* Plot Arc - Button that opens mini modal */}
              <FormField
                control={form.control}
                name="plotArcId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormPlotArcButton
                        label={t("modal.plot_arc_label")}
                        value={field.value}
                        onChange={field.onChange}
                        availableArcs={availableArcs}
                        labelClassName="text-primary"
                        noArcLabel={t("modal.no_arc")}
                        selectArcLabel={t("modal.select_arc")}
                        dialogTitle={t("modal.arc_dialog_title")}
                        dialogDescription={t("modal.arc_dialog_description")}
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
                      {t("modal.summary_label")}
                    </FormLabel>
                    <FormControl>
                      <FormTextarea
                        {...field}
                        placeholder={t("modal.summary_placeholder")}
                        rows={4}
                        maxLength={500}
                        showCharCount
                        showOptionalLabel
                        className="resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormSelectGrid
                        value={field.value}
                        onChange={field.onChange}
                        label={t("modal.status_label")}
                        required
                        columns={2}
                        options={translatedStatusOptions}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          }
          advancedFields={
            <>
              {/* Mentioned Entities Section */}
              <div className="space-y-4">
                <SectionTitle>{t("modal.mentioned_section")}</SectionTitle>

                {/* Mentioned Characters */}
                <FormField
                  control={form.control}
                  name="mentionedCharacters"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`mentioned-characters-${refreshKey}`}
                          entityType="character"
                          bookId={bookId}
                          label={t("modal.mentioned_characters_label")}
                          placeholder={t(
                            "modal.mentioned_characters_placeholder"
                          )}
                          emptyText={t("modal.no_characters_available")}
                          noSelectionText={t("modal.no_characters_selected")}
                          searchPlaceholder={t("modal.search_character")}
                          value={entitiesToIds(field.value || [])}
                          onChange={(ids, entities) => field.onChange(entities)}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Mentioned Regions */}
                <FormField
                  control={form.control}
                  name="mentionedRegions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`mentioned-regions-${refreshKey}`}
                          entityType="region"
                          bookId={bookId}
                          label={t("modal.mentioned_regions_label")}
                          placeholder={t("modal.mentioned_regions_placeholder")}
                          emptyText={t("modal.no_regions_available")}
                          noSelectionText={t("modal.no_regions_selected")}
                          searchPlaceholder={t("modal.search_region")}
                          value={entitiesToIds(field.value || [])}
                          onChange={(ids, entities) => field.onChange(entities)}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Mentioned Items */}
                <FormField
                  control={form.control}
                  name="mentionedItems"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`mentioned-items-${refreshKey}`}
                          entityType="item"
                          bookId={bookId}
                          label={t("modal.mentioned_items_label")}
                          placeholder={t("modal.mentioned_items_placeholder")}
                          emptyText={t("modal.no_items_available")}
                          noSelectionText={t("modal.no_items_selected")}
                          searchPlaceholder={t("modal.search_item")}
                          value={entitiesToIds(field.value || [])}
                          onChange={(ids, entities) => field.onChange(entities)}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Mentioned Factions */}
                <FormField
                  control={form.control}
                  name="mentionedFactions"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`mentioned-factions-${refreshKey}`}
                          entityType="faction"
                          bookId={bookId}
                          label={t("modal.mentioned_factions_label")}
                          placeholder={t(
                            "modal.mentioned_factions_placeholder"
                          )}
                          emptyText={t("modal.no_factions_available")}
                          noSelectionText={t("modal.no_factions_selected")}
                          searchPlaceholder={t("modal.search_faction")}
                          value={entitiesToIds(field.value || [])}
                          onChange={(ids, entities) => field.onChange(entities)}
                          labelClassName="text-sm font-medium text-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Mentioned Races */}
                <FormField
                  control={form.control}
                  name="mentionedRaces"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormEntityMultiSelectAuto
                          key={`mentioned-races-${refreshKey}`}
                          entityType="race"
                          bookId={bookId}
                          label={t("modal.mentioned_races_label")}
                          placeholder={t("modal.mentioned_races_placeholder")}
                          emptyText={t("modal.no_races_available")}
                          noSelectionText={t("modal.no_races_selected")}
                          searchPlaceholder={t("modal.search_race")}
                          value={entitiesToIds(field.value || [])}
                          onChange={(ids, entities) => field.onChange(entities)}
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
            editMode: false,
            submitLabel: isSubmitting
              ? t("modal.creating")
              : t("modal.create_button"),
            cancelLabel: t("modal.cancel_button"),
          }}
          width="w-full max-w-5xl"
        />
      </form>
    </Form>
  );
}
