import { Image } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GalleryEmptyStateProps {
  hasFilters?: boolean;
}

export function GalleryEmptyState({
  hasFilters = false,
}: GalleryEmptyStateProps) {
  const { t } = useTranslation("gallery");

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Image className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {t("empty_state.no_results")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("empty_state.no_results_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Image className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{t("empty_state.title")}</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {t("empty_state.description")}
      </p>
    </div>
  );
}
