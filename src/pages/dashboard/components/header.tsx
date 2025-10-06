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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import {
  GENRES_CONSTANT,
  VISUAL_STYLES_CONSTANT,
} from "../constants/dashboard-constants";

const BOOK_STATUS_OPTIONS: BookStatus[] = [
  "Em planejamento",
  "Em lançamento",
  "Hiato",
  "Completo",
];

const STATUS_CONFIG = {
  "Em planejamento": {
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  "Em lançamento": {
    icon: Rocket,
    color:
      "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  Hiato: {
    icon: Pause,
    color:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  Completo: {
    icon: CheckCircle2,
    color:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  },
} as const;

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

          {/* Visual Style */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Tipo de História
            </label>
            <Select
              value={draftBook?.visualStyle || ""}
              onValueChange={(v) => onDraftBookChange({ visualStyle: v })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {VISUAL_STYLES_CONSTANT.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
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
            <Button variant="outline" onClick={handleCancelClick}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={onSave} className="btn-magical">
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
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Book Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1 max-w-4xl">
            {/* Title and Status */}
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold">{book.title}</h2>
              {(() => {
                const StatusIcon = STATUS_CONFIG[book.status].icon;
                return (
                  <Badge
                    variant="outline"
                    className={`${STATUS_CONFIG[book.status].color} px-3 py-1.5 text-sm font-medium flex items-center gap-2`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {book.status}
                  </Badge>
                );
              })()}
            </div>

            {/* Visual Style Badge (destacado) */}
            <div className="mb-2">
              <Badge variant="default" className="text-sm px-3 py-1">
                {book.visualStyle}
              </Badge>
            </div>

            {/* Genre Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {book.genre.map((g, index) => (
                <Badge key={index} variant="secondary">
                  {g}
                </Badge>
              ))}
            </div>

            {/* Synopsis */}
            {book.storySummary ? (
              <div className="mb-3">
                <p
                  ref={synopsisRef}
                  className={`text-muted-foreground leading-relaxed ${
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
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
