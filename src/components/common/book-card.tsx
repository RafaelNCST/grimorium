import { BookOpen, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { EntityCardWrapper } from "@/components/ui/entity-card-wrapper";
import {
  EntityTagBadge,
  IEntityTagConfig,
} from "@/components/ui/entity-tag-badge";
import { formatRelativeTime } from "@/lib/utils";
import { getGenreTranslationKey } from "@/pages/dashboard/constants/dashboard-constants";

const GENRE_TAG_CONFIG: IEntityTagConfig = {
  value: "genre",
  icon: Tag,
  translationKey: "genre",
  colorClass: "text-white",
  bgColorClass: "bg-black/60 border-white/20 backdrop-blur-sm",
};

interface PropsBookCard {
  id: string;
  title: string;
  genre: string[];
  visualStyle: string;
  coverImage?: string;
  chapters?: number;
  lastModified?: number;
  onClick?: () => void;
  onEdit?: () => void;
}

export function BookCard({
  title,
  genre,
  visualStyle,
  coverImage,
  chapters = 0,
  lastModified,
  onClick,
}: PropsBookCard) {
  const { i18n, t } = useTranslation(["home", "create-book"]);

  const formattedLastModified = lastModified
    ? formatRelativeTime(lastModified, i18n.language)
    : undefined;

  return (
    <EntityCardWrapper
      onClick={onClick}
      overlayText={t("book_card.view_details")}
      contentClassName="p-0"
    >
      {/* Book Cover */}
      <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
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

        {/* Genre Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-1rem)] pointer-events-none">
          {genre.slice(0, 6).map((g, index) => (
            <EntityTagBadge
              key={index}
              config={GENRE_TAG_CONFIG}
              label={t(getGenreTranslationKey(g), { ns: "create-book" })}
              className="text-xs"
            />
          ))}
          {genre.length > 6 && (
            <EntityTagBadge
              config={GENRE_TAG_CONFIG}
              label={`+${genre.length - 6}`}
              className="text-xs"
            />
          )}
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

        {formattedLastModified && (
          <p className="text-xs text-muted-foreground mt-2">
            Modificado {formattedLastModified}
          </p>
        )}
      </div>
    </EntityCardWrapper>
  );
}
