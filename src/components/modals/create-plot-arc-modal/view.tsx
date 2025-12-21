import { Sparkles } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { EntityModal } from "@/components/modals/entity-modal";
import { Form } from "@/components/ui/form";
import { SectionTitle } from "@/components/ui/section-title";
import { Separator } from "@/components/ui/separator";
import type { PlotArcStatus } from "@/types/plot-types";

import { EventChainEditor } from "./components/event-chain-editor";
import { StatusSelector } from "./components/status-selector";
import { ARC_SIZE_OPTIONS } from "./constants/arc-size-options";
import { type PlotArcFormSchema } from "./hooks/use-plot-arc-validation";

interface PropsCreatePlotArcModalView {
  open: boolean;
  form: UseFormReturn<PlotArcFormSchema>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isValid: boolean;
  isSubmitting: boolean;
  bookId: string;
  hasCurrentArc: boolean;
}

export function CreatePlotArcModalView({
  open,
  form,
  onClose,
  onSubmit,
  isValid,
  isSubmitting,
  bookId,
  hasCurrentArc,
}: PropsCreatePlotArcModalView) {
  const { t } = useTranslation("create-plot-arc");
  const { register, setValue, watch } = form;

  const watchedValues = watch();

  // Translate options for FormSelectGrid
  const translatedSizeOptions = ARC_SIZE_OPTIONS.map((opt) => ({
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
            title: t("modal.create_arc"),
            icon: Sparkles,
            description: t("modal.description"),
            warning: t("modal.info_message"),
          }}
          basicFieldsTitle={t("modal.basic_fields")}
          advancedFieldsTitle={t("modal.advanced_fields")}
          basicFields={
            <div className="space-y-6">
              {/* Arc Name */}
              <FormInput
                {...register("name")}
                label={t("modal.arc_name")}
                placeholder={t("modal.arc_name_placeholder")}
                maxLength={200}
                required
                showCharCount
                value={watchedValues.name}
                labelClassName="text-primary"
              />

              {/* Arc Summary */}
              <FormTextarea
                {...register("description")}
                label={t("modal.arc_summary")}
                placeholder={t("modal.arc_summary_placeholder")}
                maxLength={1000}
                rows={4}
                required
                showCharCount
                value={watchedValues.description}
                labelClassName="text-primary"
                className="resize-none"
                title=""
              />

              {/* Arc Focus */}
              <FormTextarea
                {...register("focus")}
                label={t("modal.arc_focus")}
                placeholder={t("modal.arc_focus_placeholder")}
                maxLength={500}
                rows={3}
                required
                showCharCount
                value={watchedValues.focus}
                labelClassName="text-primary"
                className="resize-none"
                title=""
              />

              {/* Status Selector */}
              <StatusSelector
                value={watchedValues.status as PlotArcStatus | ""}
                onChange={(value) => setValue("status", value)}
                hasCurrentArc={hasCurrentArc}
              />

              {/* Size Selector */}
              <FormSelectGrid
                value={watchedValues.size}
                onChange={(value) => setValue("size", value as string)}
                label={t("modal.arc_size")}
                required
                columns={2}
                options={translatedSizeOptions}
                alertText={t("modal.arc_size_intro")}
              />

              {/* Event Chain */}
              <EventChainEditor
                events={watchedValues.events || []}
                onChange={(events) => setValue("events", events)}
              />
            </div>
          }
          advancedFields={
            <>
              {/* Relationships Section */}
              <div className="space-y-6">
                <SectionTitle>{t("modal.relationships_section")}</SectionTitle>

                {/* Important Characters */}
                <FormEntityMultiSelectAuto
                  entityType="character"
                  bookId={bookId}
                  label={t("modal.important_characters")}
                  placeholder={t("modal.select_character")}
                  emptyText={t("modal.no_characters_available")}
                  noSelectionText={t("modal.no_characters_selected")}
                  searchPlaceholder={t("modal.search_character")}
                  value={watchedValues.importantCharacters || []}
                  onChange={(value) => setValue("importantCharacters", value)}
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Important Factions */}
                <FormEntityMultiSelectAuto
                  entityType="faction"
                  bookId={bookId}
                  label={t("modal.important_factions")}
                  placeholder={t("modal.select_faction")}
                  emptyText={t("modal.no_factions_available")}
                  noSelectionText={t("modal.no_factions_selected")}
                  searchPlaceholder={t("modal.search_faction")}
                  value={watchedValues.importantFactions || []}
                  onChange={(value) => setValue("importantFactions", value)}
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Important Items */}
                <FormEntityMultiSelectAuto
                  entityType="item"
                  bookId={bookId}
                  label={t("modal.important_items")}
                  placeholder={t("modal.select_item")}
                  emptyText={t("modal.no_items_available")}
                  noSelectionText={t("modal.no_items_selected")}
                  searchPlaceholder={t("modal.search_item")}
                  value={watchedValues.importantItems || []}
                  onChange={(value) => setValue("importantItems", value)}
                  labelClassName="text-sm font-medium text-primary"
                />

                {/* Important Regions */}
                <FormEntityMultiSelectAuto
                  entityType="region"
                  bookId={bookId}
                  label={t("modal.important_regions")}
                  placeholder={t("modal.select_region")}
                  emptyText={t("modal.no_regions_available")}
                  noSelectionText={t("modal.no_regions_selected")}
                  searchPlaceholder={t("modal.search_region")}
                  value={watchedValues.importantRegions || []}
                  onChange={(value) => setValue("importantRegions", value)}
                  labelClassName="text-sm font-medium text-primary"
                />
              </div>

              <Separator />

              {/* Narrative Section */}
              <div className="space-y-6">
                <SectionTitle>{t("modal.narrative_section")}</SectionTitle>

                {/* Arc Message */}
                <FormTextarea
                  {...register("arcMessage")}
                  label={t("modal.arc_message")}
                  placeholder={t("modal.arc_message_placeholder")}
                  maxLength={500}
                  rows={3}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.arcMessage}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />

                {/* World Impact */}
                <FormTextarea
                  {...register("worldImpact")}
                  label={t("modal.world_impact")}
                  placeholder={t("modal.world_impact_placeholder")}
                  maxLength={500}
                  rows={3}
                  showCharCount
                  showOptionalLabel={false}
                  value={watchedValues.worldImpact}
                  labelClassName="text-sm font-medium text-primary"
                  className="resize-none"
                />
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
          width="w-full max-w-5xl"
        />
      </form>
    </Form>
  );
}
