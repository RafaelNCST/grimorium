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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScalePicker } from "@/pages/dashboard/tabs/world/components/scale-picker";
import { IRegion, RegionScale } from "@/pages/dashboard/tabs/world/types/region-types";
import { ImagePlus, X } from "lucide-react";

interface CreateRegionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: RegionFormData) => void;
  availableRegions?: IRegion[];
  editRegion?: IRegion | null;
}

export interface RegionFormData {
  name: string;
  parentId: string | null;
  scale: RegionScale;
  summary?: string;
  image?: string;
}

const regionFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  parentId: z.string().nullable(),
  scale: z.enum(["local", "continental", "planetary", "galactic", "universal", "multiversal"]),
  summary: z.string().max(500, "Summary is too long").optional(),
  image: z.string().optional(),
});

type RegionFormValues = z.infer<typeof regionFormSchema>;

export function CreateRegionModal({
  open,
  onOpenChange,
  onConfirm,
  availableRegions = [],
  editRegion = null,
}: CreateRegionModalProps) {
  const { t } = useTranslation("world");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(editRegion?.image);

  const form = useForm<RegionFormValues>({
    resolver: zodResolver(regionFormSchema),
    defaultValues: {
      name: editRegion?.name || "",
      parentId: editRegion?.parentId || null,
      scale: editRegion?.scale || "local",
      summary: editRegion?.summary || "",
      image: editRegion?.image || "",
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
      });
      setImageSrc(editRegion.image);
    } else {
      form.reset({
        name: "",
        parentId: null,
        scale: "local",
        summary: "",
        image: "",
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
      onConfirm(data as RegionFormData);
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
          <DialogTitle>
            {editRegion ? t("create_region.edit_title") : t("create_region.title")}
          </DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>{t("create_region.image_label")}</FormLabel>
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
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                          <img
                            src={imageSrc}
                            alt="Region preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label htmlFor="region-image-upload" className="cursor-pointer">
                          <div className="w-full h-40 border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors rounded-lg flex flex-col items-center justify-center gap-2">
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("create_region.name_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("create_region.name_placeholder")}
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{field.value?.length || 0}/200</span>
                  </div>
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
                  <FormLabel>{t("create_region.parent_label")}</FormLabel>
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
                        .filter((r) => r.id !== editRegion?.id) // Don't allow selecting self
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("create_region.summary_label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("create_region.summary_placeholder")}
                      {...field}
                      rows={4}
                      maxLength={500}
                      className="resize-none"
                    />
                  </FormControl>
                  <div className="flex justify-end text-xs text-muted-foreground">
                    <span>{field.value?.length || 0}/500</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t("create_region.cancel_button")}
              </Button>
              <Button
                type="submit"
                variant="magical"
                className="animate-glow"
                disabled={isSubmitting || !form.formState.isValid}
              >
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
