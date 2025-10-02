import { Edit2, BookOpen, Clock } from "lucide-react";

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
import { Book as BookType } from "@/stores/book-store";

import {
  GENRES_CONSTANT,
  VISUAL_STYLES_CONSTANT,
} from "../constants/dashboard-constants";

interface PlotArc {
  id: string;
  name: string;
  size: "pequeno" | "médio" | "grande";
  focus: string;
  description: string;
  events: any[];
  progress: number;
  isCurrentArc: boolean;
}

interface PropsHeader {
  book: BookType;
  draftBook: BookType | null;
  isEditingHeader: boolean;
  currentArc?: PlotArc;
  onEditingHeaderChange: (editing: boolean) => void;
  onDraftBookChange: (updates: Partial<BookType>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function Header({
  book,
  draftBook,
  isEditingHeader,
  currentArc,
  onEditingHeaderChange,
  onDraftBookChange,
  onSave,
  onCancel,
}: PropsHeader) {
  return (
    <div className="flex items-start gap-6">
      <div className="w-32 h-48 rounded-lg overflow-hidden shadow-lg">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="w-full max-w-3xl">
            {isEditingHeader ? (
              <div className="space-y-3">
                <Input
                  value={draftBook?.title || ""}
                  onChange={(e) => onDraftBookChange({ title: e.target.value })}
                  aria-label="Título do livro"
                />
                <div className="flex items-center gap-3">
                  <Select
                    value={draftBook?.genre || ""}
                    onValueChange={(v) => onDraftBookChange({ genre: v })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES_CONSTANT.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={draftBook?.visualStyle || ""}
                    onValueChange={(v) => onDraftBookChange({ visualStyle: v })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Estilo visual" />
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
                <Textarea
                  value={draftBook?.storySummary || ""}
                  onChange={(e) =>
                    onDraftBookChange({
                      storySummary: e.target.value,
                    })
                  }
                  placeholder="Resumo da História"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={onSave} className="btn-magical">
                    Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary">{book.genre}</Badge>
                  <Badge variant="outline">{book.visualStyle}</Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl">
                  {book.storySummary ||
                    "Ainda não há resumo da história. Clique em 'Editar' para adicionar."}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditingHeader && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditingHeaderChange(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Capítulos: {book.chapters}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              Arco atual: {currentArc?.name || "Nenhum arco definido"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
