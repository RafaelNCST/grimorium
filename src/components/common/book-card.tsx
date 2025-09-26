import { useState } from "react";

import { Book, Eye, Edit2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropsBookCard {
  id: string;
  title: string;
  genre: string;
  visualStyle: string;
  coverImage?: string;
  chapters?: number;
  lastModified?: string;
  onClick?: () => void;
  onEdit?: () => void;
}

export function BookCard({
  id,
  title,
  genre,
  visualStyle,
  coverImage,
  chapters = 0,
  lastModified,
  onClick,
  onEdit,
}: PropsBookCard) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-card rounded-xl border border-border overflow-hidden card-magical cursor-pointer animate-stagger"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Book Cover */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-secondary">
            <Book className="w-16 h-16 text-muted-foreground" />
          </div>
        )}

        {/* Overlay with actions */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="backdrop-blur-sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            Abrir
          </Button>
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="backdrop-blur-sm"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Genre Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs">
            {genre}
          </Badge>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{visualStyle}</span>
          <span>{chapters} capítulos</span>
        </div>

        {lastModified && (
          <p className="text-xs text-muted-foreground mt-2">
            Modificado {lastModified}
          </p>
        )}
      </div>
    </div>
  );
}
