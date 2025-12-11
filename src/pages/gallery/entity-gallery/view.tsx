import { Upload, ArrowLeft, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IGalleryItem,
  IGalleryLink,
  GallerySortOrder,
  EntityType,
} from "@/types/gallery-types";

import { GalleryGrid } from "../components/gallery-grid";
import { ImageLightbox } from "../components/image-lightbox";
import { UploadImageModal } from "../components/upload-image-modal";

interface EntityGalleryViewProps {
  items: IGalleryItem[];
  isLoading: boolean;

  // Filters
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: GallerySortOrder;
  onSortChange: (value: GallerySortOrder) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;

  // Upload
  isUploadModalOpen: boolean;
  onUploadModalChange: (open: boolean) => void;
  onUpload: (data: {
    title: string;
    description?: string;
    thumbnailBase64: string;
    originalPath: string;
    originalFilename: string;
    fileSize: number;
    width: number;
    height: number;
    mimeType: string;
    links: IGalleryLink[];
  }) => void;
  editingItem: IGalleryItem | null;
  bookId: string;

  // Grid actions
  onItemClick: (item: IGalleryItem) => void;
  onItemEdit: (item: IGalleryItem) => void;
  onItemDelete: (item: IGalleryItem) => void;
  onItemUnlink: (item: IGalleryItem) => void;
  onReorder: (reorderedItems: IGalleryItem[]) => void;

  // Lightbox
  selectedItem: IGalleryItem | null;
  onCloseLightbox: () => void;

  // Entity info
  entityName: string;
  entityType: EntityType;
  preSelectedLinks: IGalleryLink[];

  // Navigation
  onBack: () => void;
}

export function EntityGalleryView({
  items,
  isLoading,
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  isUploadModalOpen,
  onUploadModalChange,
  onUpload,
  editingItem,
  bookId,
  onItemClick,
  onItemEdit,
  onItemDelete,
  onItemUnlink,
  onReorder,
  selectedItem,
  onCloseLightbox,
  entityName,
  entityType,
  preSelectedLinks,
  onBack,
}: EntityGalleryViewProps) {
  const { t } = useTranslation("gallery");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">
            {t("entity_gallery.title", { entityName })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("entity_gallery.subtitle", { count: items.length })}
          </p>
        </div>

        <Button
          variant="magical"
          onClick={() => onUploadModalChange(true)}
          className="gap-2 animate-glow"
        >
          <Upload className="h-4 w-4" />
          {t("entity_gallery.upload_image")}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Filters */}
          {items.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t("page.search_placeholder")}
                  className="pl-9"
                />
              </div>

              {/* Sort */}
              <Select value={sortOrder} onValueChange={onSortChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t("filters.sort_label")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    {t("filters.sort_recent")}
                  </SelectItem>
                  <SelectItem value="alphabetical">
                    {t("filters.sort_alphabetical")}
                  </SelectItem>
                  <SelectItem value="manual">
                    {t("filters.sort_manual")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClearFilters}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Grid */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {hasActiveFilters
                  ? t("empty_state.no_results")
                  : t("entity_gallery.empty_state_title")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {hasActiveFilters
                  ? t("empty_state.no_results_description")
                  : t("entity_gallery.empty_state_description", { entityName })}
              </p>
            </div>
          ) : (
            <GalleryGrid
              items={items}
              onItemClick={onItemClick}
              onItemEdit={onItemEdit}
              onItemDelete={onItemDelete}
              onReorder={onReorder}
              enableDragDrop={sortOrder === "manual"}
            />
          )}
        </div>
      </div>

      {/* Upload/Edit Modal */}
      <UploadImageModal
        open={isUploadModalOpen}
        onOpenChange={onUploadModalChange}
        onUpload={onUpload}
        editingItem={editingItem}
        bookId={bookId}
        preSelectedLinks={preSelectedLinks}
        disableLinksManagement
      />

      {/* Lightbox */}
      {selectedItem && (
        <ImageLightbox
          item={selectedItem}
          allItems={items}
          onClose={onCloseLightbox}
          onNavigate={onItemClick}
          onEdit={onItemEdit}
          onUnlink={onItemUnlink}
          onDelete={onItemDelete}
        />
      )}
    </div>
  );
}
