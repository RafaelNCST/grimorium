import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EntityType } from "@/types/gallery-types";

interface GalleryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  entityTypeFilters: EntityType[];
  onEntityTypeToggle: (type: EntityType) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function GalleryFilters({
  searchTerm,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
}: GalleryFiltersProps) {
  const { t } = useTranslation("gallery");

  return (
    <div className="relative w-1/2">
      {/* Search */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("page.search_placeholder")}
        className={`pl-9 ${searchTerm.length > 0 ? "pr-10" : ""}`}
      />

      {/* Clear search button - positioned absolutely inside input */}
      {searchTerm.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSearchChange("")}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
