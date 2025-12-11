import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as LinkIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { IGalleryItem } from "@/types/gallery-types";

interface GalleryCardProps {
  item: IGalleryItem;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function GalleryCard({
  item,
  onClick,
}: GalleryCardProps) {
  const { t } = useTranslation("gallery");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-lg border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={item.thumbnailBase64}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content below image */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <h3 className="text-sm font-medium line-clamp-2">
          {item.title}
        </h3>

        {/* Links badge */}
        {item.links.length > 0 && (
          <Badge variant="secondary" className="gap-1 w-fit">
            <LinkIcon className="h-3 w-3" />
            {t("card.links_count", { count: item.links.length })}
          </Badge>
        )}

        {/* Description (truncated) */}
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Overlay covering entire card */}
      <div
        className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-lg font-semibold">Ver detalhes</span>
      </div>
    </div>
  );
}
