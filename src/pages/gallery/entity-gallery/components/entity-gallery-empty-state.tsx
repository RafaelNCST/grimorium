import { Image } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EntityGalleryEmptyStateProps {
  entityName: string;
  hasFilters?: boolean;
}

export function EntityGalleryEmptyState({
  entityName,
  hasFilters = false,
}: EntityGalleryEmptyStateProps) {
  const { t } = useTranslation("gallery");

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <Image className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t("empty_state.no_results")}</h3>
        <p className="text-muted-foreground mt-1 max-w-sm">
          {t("empty_state.no_results_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <Image className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">
        {t("entity_gallery.empty_state_title")}
      </h3>
      <p className="text-muted-foreground mt-1 max-w-sm">
        {t("entity_gallery.empty_state_description", { entityName })}
      </p>
    </div>
  );
}
