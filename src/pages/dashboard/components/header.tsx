import { useState, useMemo } from "react";

import {
  Edit2,
  X,
  Check,
  BookOpen,
  Rocket,
  Pause,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import {
  EntityTagBadge,
  IEntityTagConfig,
} from "@/components/ui/entity-tag-badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book as BookType, BookStatus } from "@/stores/book-store";

import {
  GENRES_CONSTANT,
  getGenreTranslationKey,
} from "../constants/dashboard-constants";

const BOOK_STATUS_OPTIONS: BookStatus[] = [
  "Em planejamento",
  "Em lançamento",
  "Hiato",
  "Completo",
];

const STATUS_CONFIG: Record<BookStatus, IEntityTagConfig> = {
  "Em planejamento": {
    value: "Em planejamento",
    icon: BookOpen,
    translationKey: "status.planning",
    colorClass: "text-blue-700 dark:text-blue-400",
    bgColorClass: "bg-blue-500/10 border-blue-500/20",
  },
  "Em lançamento": {
    value: "Em lançamento",
    icon: Rocket,
    translationKey: "status.releasing",
    colorClass: "text-green-700 dark:text-green-400",
    bgColorClass: "bg-green-500/10 border-green-500/20",
  },
  Hiato: {
    value: "Hiato",
    icon: Pause,
    translationKey: "status.hiatus",
    colorClass: "text-amber-700 dark:text-amber-400",
    bgColorClass: "bg-amber-500/10 border-amber-500/20",
  },
  Completo: {
    value: "Completo",
    icon: CheckCircle2,
    translationKey: "status.complete",
    colorClass: "text-purple-700 dark:text-purple-400",
    bgColorClass: "bg-purple-500/10 border-purple-500/20",
  },
};

const GENRE_TAG_CONFIG: IEntityTagConfig = {
  value: "genre",
  icon: Tag,
  translationKey: "genre",
  colorClass: "text-slate-700 dark:text-slate-300",
  bgColorClass: "bg-slate-500/10 border-slate-500/20",
};

interface PropsHeader {
  book: BookType;
  draftBook: BookType | null;
  isEditingHeader: boolean;
  onEditingHeaderChange: (editing: boolean) => void;
  onDraftBookChange: (updates: Partial<BookType>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function Header({
  book,
  draftBook,
  isEditingHeader,
  onEditingHeaderChange,
  onDraftBookChange,
  onSave,
  onCancel,
}: PropsHeader) {
  const { t } = useTranslation("create-book");
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if synopsis is longer than 3 lines
  const isSynopsisLong = (text: string) => {
    if (!text) return false;
    const lines = text.split("\n").length;
    return lines > 3 || text.length > 200;
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const title = draftBook?.title?.trim() || "";
    const genres = draftBook?.genre || [];
    return title.length > 0 && genres.length > 0;
  }, [draftBook?.title, draftBook?.genre]);

  // Check if there are changes compared to original book
  const hasChanges = useMemo(() => {
    if (!draftBook) return false;

    // Sort genres to compare regardless of order
    const sortedDraftGenres = [...(draftBook.genre || [])].sort();
    const sortedBookGenres = [...(book.genre || [])].sort();

    return (
      draftBook.title !== book.title ||
      draftBook.status !== book.status ||
      draftBook.storySummary !== book.storySummary ||
      draftBook.coverImage !== book.coverImage ||
      JSON.stringify(sortedDraftGenres) !== JSON.stringify(sortedBookGenres)
    );
  }, [draftBook, book]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!draftBook?.title?.trim()) {
      newErrors.title = t("modal.title_required");
    }

    if (!draftBook?.genre || draftBook.genre.length === 0) {
      newErrors.genre = t("modal.genre_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenreToggle = (genreId: string) => {
    const currentGenres = draftBook?.genre || [];
    const newGenres = currentGenres.includes(genreId)
      ? currentGenres.filter((g) => g !== genreId)
      : [...currentGenres, genreId];
    onDraftBookChange({ genre: newGenres });
    // Clear genre error when user selects a genre
    if (newGenres.length > 0 && errors.genre) {
      setErrors((prev) => ({ ...prev, genre: "" }));
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDraftBookChange({ title: e.target.value });
    // Clear title error when user types
    if (e.target.value.trim() && errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
      setErrors({});
    }
  };

  const handleEditClick = () => {
    onEditingHeaderChange(true);
    setErrors({});
  };

  const handleCancelClick = () => {
    setErrors({});
    onCancel();
  };

  if (isEditingHeader) {
    return (
      <div className="flex items-start gap-6">
        {/* Cover Image - Edit Mode */}
        <FormImageUpload
          value={draftBook?.coverImage || book.coverImage}
          onChange={(value) => onDraftBookChange({ coverImage: value })}
          label=""
          showLabel={false}
          height="h-48"
          width="w-32"
          shape="rounded"
          imageFit="cover"
          placeholderIcon={BookOpen}
          id="header-cover-upload"
          compact
        />

        {/* Edit Form */}
        <div className="flex-1 space-y-4">
          {/* Title and Status */}
          <div className="flex items-start gap-3">
            <div className="flex-1 max-w-2xl">
              <FormInput
                label={t("modal.book_title")}
                name="title"
                value={draftBook?.title || ""}
                onChange={handleTitleChange}
                placeholder={t("modal.title_placeholder")}
                required
                showOptionalLabel={false}
                error={errors.title}
                labelClassName="text-primary"
                className="text-xl font-bold h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-primary">
                {t("modal.book_status")}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={draftBook?.status || "Em planejamento"}
                onValueChange={(v) =>
                  onDraftBookChange({ status: v as BookStatus })
                }
              >
                <SelectTrigger className="w-56 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOK_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <Label className="text-primary">
              {t("modal.book_genre")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {GENRES_CONSTANT.map((genre) => {
                const isSelected =
                  draftBook?.genre?.includes(genre.id) || false;
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(genre.translationKey)}
                  </button>
                );
              })}
            </div>
            {errors.genre && (
              <p className="text-sm text-destructive">{errors.genre}</p>
            )}
          </div>

          {/* Synopsis */}
          <FormTextarea
            label={t("modal.book_synopsis")}
            name="synopsis"
            value={draftBook?.storySummary || ""}
            onChange={(e) =>
              onDraftBookChange({
                storySummary: e.target.value,
              })
            }
            placeholder={t("modal.synopsis_placeholder")}
            rows={4}
            maxLength={1000}
            showCharCount
            className="resize-none max-w-4xl"
            labelClassName="text-primary"
          />

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={handleCancelClick}>
              <X className="w-4 h-4 mr-2" />
              {t("button.cancel")}
            </Button>
            <Button
              variant="magical"
              onClick={handleSave}
              disabled={!hasChanges || !isFormValid}
              className="animate-glow"
            >
              <Check className="w-4 h-4 mr-2" />
              {t("button.save")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="flex items-start gap-6">
      {/* Cover Image - View Mode */}
      <div className="w-32 h-48 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FormImageDisplay
            icon={BookOpen}
            height="h-full"
            width="w-full"
            shape="square"
          />
        )}
      </div>

      {/* Book Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1 max-w-4xl">
            {/* Title and Status */}
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold">{book.title}</h2>
              <EntityTagBadge
                config={STATUS_CONFIG[book.status]}
                label={book.status}
              />
            </div>

            {/* Genre Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {book.genre.map((g, index) => (
                <EntityTagBadge
                  key={index}
                  config={GENRE_TAG_CONFIG}
                  label={t(getGenreTranslationKey(g))}
                />
              ))}
            </div>

            {/* Synopsis */}
            {book.storySummary ? (
              <div className="mb-3">
                <p
                  className={`text-muted-foreground leading-relaxed select-text ${
                    !showFullSynopsis && isSynopsisLong(book.storySummary)
                      ? "line-clamp-3"
                      : ""
                  }`}
                >
                  {book.storySummary}
                </p>
                {isSynopsisLong(book.storySummary) && (
                  <button
                    onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                    className="text-primary hover:underline text-sm mt-1"
                  >
                    {showFullSynopsis ? "Esconder" : "Ler mais"}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground italic mb-3">
                Ainda não há sinopse. Edite o cabeçalho para adicionar.
              </p>
            )}
          </div>

          {/* Edit Button */}
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleEditClick}>
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
