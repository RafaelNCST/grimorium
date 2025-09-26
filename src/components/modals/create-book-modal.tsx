import { useState } from "react";

import { Upload } from "lucide-react";

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
import { useLanguageStore } from "@/stores/language-store";

interface PropsCreateBookModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (bookData: IBookFormData) => void;
}

export interface IBookFormData {
  title: string;
  genre: string;
  visualStyle: string;
  cover?: string;
  authorSummary?: string;
}

const genres = [
  "Alta Fantasia",
  "Fantasia Urbana",
  "Épico",
  "Romance",
  "Mistério",
  "Suspense",
  "Terror",
  "Ficção Científica",
  "Distopia",
  "Aventura",
  "Drama",
  "Comédia",
  "Biografia",
  "Histórico",
  "Contemporâneo",
];

const visualStyles = ["Cartoon", "Anime", "Realista"];

export function CreateBookModal({
  open,
  onClose,
  onConfirm,
}: PropsCreateBookModal) {
  const { t } = useLanguageStore();
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    genre: "",
    visualStyle: "",
    cover: "",
    authorSummary: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t("modal.title_required");
    }

    if (!formData.genre) {
      newErrors.genre = t("modal.genre_required");
    }

    if (!formData.visualStyle) {
      newErrors.visualStyle = t("modal.style_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onConfirm(formData);
      // Reset form
      setFormData({
        title: "",
        genre: "",
        visualStyle: "",
        cover: "",
        authorSummary: "",
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      genre: "",
      visualStyle: "",
      cover: "",
      authorSummary: "",
    });
    setErrors({});
    onClose();
  };

  const isValid =
    formData.title.trim() && formData.genre && formData.visualStyle;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] card-magical">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">✨</span>
            {t("modal.create_book")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Ex: As Crônicas do Reino Perdido"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="text-sm font-medium">
              {t("modal.book_genre")} *
            </Label>
            <Select
              value={formData.genre}
              onValueChange={(value) =>
                setFormData({ ...formData, genre: value })
              }
            >
              <SelectTrigger
                className={errors.genre ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent side="bottom">
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <SelectValue placeholder="Selecione o estilo visual" />
              </SelectTrigger>
              <SelectContent side="bottom">
                {visualStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.visualStyle && (
              <p className="text-sm text-destructive">{errors.visualStyle}</p>
            )}
          </div>

          {/* Cover Upload */}
          <div className="space-y-2">
            <Label htmlFor="cover" className="text-sm font-medium">
              {t("modal.book_cover")}
            </Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Clique para fazer upload ou arraste uma imagem
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG até 5MB</p>
            </div>
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
              placeholder="Suas anotações pessoais sobre a obra..."
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Opcional</span>
              <span>{formData.authorSummary?.length || 0}/500</span>
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
