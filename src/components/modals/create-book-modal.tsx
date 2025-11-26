import { useState, useRef } from "react";

import { BookPlus, ImageIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface PropsCreateBookModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (bookData: IBookFormData) => void;
}

export interface IBookFormData {
  title: string;
  genre: string[];
  visualStyle: string;
  cover?: string;
  synopsis?: string;
  authorSummary?: string;
}

const GENRE_KEYS = [
  "genre.urban",
  "genre.fantasy",
  "genre.futuristic",
  "genre.cyberpunk",
  "genre.high_fantasy",
  "genre.romance",
  "genre.mystery",
  "genre.horror",
  "genre.suspense",
  "genre.drama",
  "genre.sci_fi",
  "genre.historical",
  "genre.action",
  "genre.adventure",
  "genre.litrpg",
] as const;

export function CreateBookModal({
  open,
  onClose,
  onConfirm,
}: PropsCreateBookModal) {
  const { t } = useTranslation("create-book");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<IBookFormData>({
    title: "",
    genre: [],
    visualStyle: "",
    cover: "",
    synopsis: "",
    authorSummary: "",
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t("modal.title_required");
    }

    if (formData.genre.length === 0) {
      newErrors.genre = t("modal.genre_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData({ ...formData, cover: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreToggle = (genreKey: (typeof GENRE_KEYS)[number]) => {
    const genreValue = t(genreKey) as string;
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genreValue)
        ? prev.genre.filter((g) => g !== genreValue)
        : [...prev.genre, genreValue],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onConfirm(formData);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      genre: [],
      visualStyle: "",
      cover: "",
      synopsis: "",
      authorSummary: "",
    });
    setPreviewImage("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isValid = formData.title.trim() && formData.genre.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col gap-0">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-primary" />
            {t("modal.create_book")}
          </DialogTitle>
          <DialogDescription>{t("modal.description")}</DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pl-1 pr-4 pb-6 mt-4">
          <form
            id="create-book-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Book Cover */}
            <div className="space-y-2">
              <Label className="text-primary">
                {t("modal.book_cover")}
                <span className="text-xs text-muted-foreground ml-2">
                  (opcional)
                </span>
              </Label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={t("modal.upload_image")}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className="w-32 h-48 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
                >
                  {previewImage ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs text-center px-2">
                          {t("modal.change_image")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-3">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <FormInput
              label={t("modal.book_title")}
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t("modal.title_placeholder")}
              required
              showOptionalLabel={false}
              error={errors.title}
              labelClassName="text-primary"
            />

            {/* Synopsis */}
            <FormTextarea
              label={t("modal.book_synopsis")}
              name="synopsis"
              value={formData.synopsis}
              onChange={(e) =>
                setFormData({ ...formData, synopsis: e.target.value })
              }
              placeholder={t("modal.synopsis_placeholder")}
              rows={4}
              maxLength={1000}
              showCharCount
              className="resize-none"
              labelClassName="text-primary"
            />

            {/* Genre Selection */}
            <div className="space-y-2">
              <Label className="text-primary">
                {t("modal.book_genre")}
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {GENRE_KEYS.map((genreKey) => {
                  const genreValue = t(genreKey) as string;
                  const isSelected = formData.genre.includes(genreValue);
                  return (
                    <button
                      key={genreKey}
                      type="button"
                      onClick={() => handleGenreToggle(genreKey)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {genreValue}
                    </button>
                  );
                })}
              </div>
              {errors.genre && (
                <p className="text-sm text-destructive">{errors.genre}</p>
              )}
            </div>

            {/* Author Summary */}
            <FormTextarea
              label={t("modal.author_summary")}
              name="authorSummary"
              value={formData.authorSummary}
              onChange={(e) =>
                setFormData({ ...formData, authorSummary: e.target.value })
              }
              placeholder={t("modal.summary_placeholder")}
              rows={4}
              maxLength={1000}
              showCharCount
              className="resize-none"
              labelClassName="text-primary"
            />
          </form>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            {t("button.cancel")}
          </Button>
          <Button
            type="submit"
            form="create-book-form"
            disabled={!isValid}
            variant="magical"
            className="animate-glow"
          >
            <BookPlus className="w-4 h-4 mr-2" />
            {t("button.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
