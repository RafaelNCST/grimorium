import { useState, useRef } from "react";

import {
  Edit2,
  X,
  Check,
  Upload,
  BookOpen,
  Rocket,
  Pause,
  CheckCircle2,
  Tag,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  EntityTagBadge,
  IEntityTagConfig,
} from "@/components/ui/entity-tag-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Book as BookType, BookStatus } from "@/stores/book-store";

import { GENRES_CONSTANT } from "../constants/dashboard-constants";

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
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const synopsisRef = useRef<HTMLParagraphElement>(null);

  // Check if synopsis is longer than 3 lines
  const isSynopsisLong = (text: string) => {
    if (!text) return false;
    const lines = text.split("\n").length;
    return lines > 3 || text.length > 200;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        onDraftBookChange({ coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreToggle = (genre: string) => {
    const currentGenres = draftBook?.genre || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];
    onDraftBookChange({ genre: newGenres });
  };

  const handleEditClick = () => {
    setPreviewImage("");
    onEditingHeaderChange(true);
  };

  const handleCancelClick = () => {
    setPreviewImage("");
    onCancel();
  };

  if (isEditingHeader) {
    return (
      <div className="flex items-start gap-6">
        {/* Cover Image - Edit Mode */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer relative group"
          >
            <img
              src={previewImage || draftBook?.coverImage || book.coverImage}
              alt={draftBook?.title || book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center text-white">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs">Alterar capa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="flex-1 space-y-4">
          {/* Title and Status */}
          <div className="flex items-center gap-3">
            <Input
              value={draftBook?.title || ""}
              onChange={(e) => onDraftBookChange({ title: e.target.value })}
              placeholder="Título do livro"
              className="text-2xl font-bold h-12 max-w-2xl"
            />
            <Select
              value={draftBook?.status || "Em planejamento"}
              onValueChange={(v) =>
                onDraftBookChange({ status: v as BookStatus })
              }
            >
              <SelectTrigger className="w-56">
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

          {/* Genres */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Gêneros
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES_CONSTANT.map((genre) => {
                const isSelected = draftBook?.genre?.includes(genre) || false;
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Sinopse
            </label>
            <Textarea
              value={draftBook?.storySummary || ""}
              onChange={(e) =>
                onDraftBookChange({
                  storySummary: e.target.value,
                })
              }
              placeholder="Sinopse da história"
              rows={4}
              className="resize-none max-w-4xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" onClick={handleCancelClick}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button variant="magical" onClick={onSave}>
              <Check className="w-4 h-4 mr-2" />
              Salvar
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
          <div className="w-full h-full flex items-center justify-center bg-white">
            <ImageIcon className="w-16 h-16 text-muted-foreground/40" />
          </div>
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
                <EntityTagBadge key={index} config={GENRE_TAG_CONFIG} label={g} />
              ))}
            </div>

            {/* Synopsis */}
            {book.storySummary ? (
              <div className="mb-3">
                <p
                  ref={synopsisRef}
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
