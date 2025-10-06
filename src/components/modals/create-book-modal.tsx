import { useState, useRef } from "react";

import { Upload, Book, BookPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

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

const VISUAL_STYLE_KEYS = [
  "style.realistic",
  "style.cartoon",
  "style.anime",
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

    if (!formData.visualStyle) {
      newErrors.visualStyle = t("modal.style_required");
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

  const handleGenreToggle = (genreKey: string) => {
    const genreValue = t(genreKey);
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

  const isValid =
    formData.title.trim() && formData.genre.length > 0 && formData.visualStyle;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-primary" />
            {t("modal.create_book")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover and Title Section */}
          <div className="flex gap-4">
            {/* Book Cover */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("modal.book_cover")}
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
                  onClick={() => fileInputRef.current?.click()}
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
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-3">
                      <Book className="w-12 h-12 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        {t("modal.upload_image")}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1 text-center">
                        {t("modal.upload_formats")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Title and Synopsis */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  {t("modal.book_title")} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder={t("modal.title_placeholder")}
                  className={`h-12 ${errors.title ? "border-destructive" : ""}`}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <Label htmlFor="synopsis" className="text-sm font-medium">
                  {t("modal.book_synopsis")}
                </Label>
                <Textarea
                  id="synopsis"
                  value={formData.synopsis}
                  onChange={(e) =>
                    setFormData({ ...formData, synopsis: e.target.value })
                  }
                  placeholder={t("modal.synopsis_placeholder")}
                  rows={6}
                  maxLength={1000}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("modal.optional")}</span>
                  <span>{formData.synopsis?.length || 0}/1000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Genre Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("modal.book_genre")} *
            </Label>
            <div className="flex flex-wrap gap-2">
              {GENRE_KEYS.map((genreKey) => {
                const genreValue = t(genreKey);
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

          {/* Visual Style */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm font-medium">
              {t("modal.book_style")} *
            </Label>
            <Select
              value={formData.visualStyle}
              onValueChange={(value) =>
                setFormData({ ...formData, visualStyle: value })
              }
            >
              <SelectTrigger
                className={errors.visualStyle ? "border-destructive" : ""}
              >
                <SelectValue placeholder={t("modal.style_placeholder")} />
              </SelectTrigger>
              <SelectContent side="bottom">
                {VISUAL_STYLE_KEYS.map((styleKey) => {
                  const styleValue = t(styleKey);
                  return (
                    <SelectItem key={styleKey} value={styleValue}>
                      {styleValue}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.visualStyle && (
              <p className="text-sm text-destructive">{errors.visualStyle}</p>
            )}
          </div>

          {/* Author Summary */}
          <div className="space-y-2">
            <Label htmlFor="authorSummary" className="text-sm font-medium">
              {t("modal.author_summary")}
            </Label>
            <Textarea
              id="authorSummary"
              value={formData.authorSummary}
              onChange={(e) =>
                setFormData({ ...formData, authorSummary: e.target.value })
              }
              placeholder={t("modal.summary_placeholder")}
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t("modal.optional")}</span>
              <span>{formData.authorSummary?.length || 0}/1000</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              {t("button.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="flex-1 btn-magical"
            >
              {t("button.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
