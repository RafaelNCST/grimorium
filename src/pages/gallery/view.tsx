import { useRef, useCallback, useEffect } from "react";

import { Upload, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { IGalleryItem, IGalleryLink, EntityType } from "@/types/gallery-types";

import { GalleryEmptyState } from "./components/gallery-empty-state";
import { GalleryFilters } from "./components/gallery-filters";
import { GalleryGrid } from "./components/gallery-grid";
import { ImageLightbox } from "./components/image-lightbox";
import { UploadImageModal } from "./components/upload-image-modal";

interface GalleryViewProps {
  items: IGalleryItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  totalCount: number;

  // Filters
  searchTerm: string;
  onSearchChange: (value: string) => void;
  entityTypeFilters: EntityType[];
  onEntityTypeToggle: (type: EntityType) => void;
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
  onReorder: (reorderedItems: IGalleryItem[]) => void;

  // Infinite scroll
  onLoadMore: () => void;

  // Lightbox
  selectedItem: IGalleryItem | null;
  onCloseLightbox: () => void;

  // Navigation
  onBackToDashboard: () => void;
}

export function GalleryView({
  items,
  isLoading,
  isLoadingMore,
  hasMore,
  totalCount,
  searchTerm,
  onSearchChange,
  entityTypeFilters,
  onEntityTypeToggle,
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
  onReorder,
  onLoadMore,
  selectedItem,
  onCloseLightbox,
  onBackToDashboard,
}: GalleryViewProps) {
  const { t } = useTranslation("gallery");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingMore || !hasMore) return;

    const { scrollTop } = container;
    const { scrollHeight } = container;
    const { clientHeight } = container;

    // Load more when 80% scrolled
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      onLoadMore();
    }
  }, [isLoadingMore, hasMore, onLoadMore]);

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
          onClick={onBackToDashboard}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{t("page.title")}</h1>

        <div className="flex-1" />

        <Button
          variant="magical"
          onClick={() => onUploadModalChange(true)}
          className="gap-2 animate-glow"
        >
          <Upload className="h-4 w-4" />
          {t("page.upload_image")}
        </Button>
      </div>

      {/* Filters - only show when there are items */}
      {totalCount > 0 && (
        <div className="px-6 py-4">
          <GalleryFilters
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            entityTypeFilters={entityTypeFilters}
            onEntityTypeToggle={onEntityTypeToggle}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      )}

      {/* Content area - scrollable */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <GalleryEmptyState hasFilters={hasActiveFilters} />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Grid */}
            <GalleryGrid
              items={items}
              onItemClick={onItemClick}
              onItemEdit={onItemEdit}
              onItemDelete={onItemDelete}
              onReorder={onReorder}
              enableDragDrop={false}
            />

            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner className="border-t-purple-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      <UploadImageModal
        open={isUploadModalOpen}
        onOpenChange={onUploadModalChange}
        onUpload={onUpload}
        editingItem={editingItem}
        bookId={bookId}
      />

      {/* Lightbox */}
      {selectedItem && (
        <ImageLightbox
          item={selectedItem}
          allItems={items}
          onClose={onCloseLightbox}
          onNavigate={onItemClick}
          onEdit={onItemEdit}
          onDelete={onItemDelete}
        />
      )}
    </div>
  );
}
