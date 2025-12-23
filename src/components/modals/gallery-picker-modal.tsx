import { useState, useEffect, useCallback, useMemo } from "react";

import { X, Search, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  getGalleryItemsByBookId,
  loadThumbnailWithFallback,
  loadOriginalImageAsDataURL,
} from "@/lib/db/gallery.service";
import { IGalleryItem } from "@/types/gallery-types";

interface GalleryPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId?: string; // Optional - if not provided, loads all gallery items
  onSelect: (imageDataUrl: string) => void;
}

interface ThumbnailCardProps {
  item: IGalleryItem;
  onClick: () => void;
}

function ThumbnailCard({ item, onClick }: ThumbnailCardProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadThumbnail() {
      try {
        setIsLoading(true);
        const dataUrl = await loadThumbnailWithFallback(item);
        if (mounted) {
          setThumbnailSrc(dataUrl);
        }
      } catch (error) {
        console.error("[ThumbnailCard] Failed to load thumbnail:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadThumbnail();

    return () => {
      mounted = false;
    };
  }, [item.id, item.thumbnailPath, item.updatedAt]);

  return (
    <div
      className="relative rounded-lg border bg-card overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-lg cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="aspect-square w-full overflow-hidden bg-muted">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse bg-muted-foreground/20 h-full w-full" />
          </div>
        ) : (
          <img
            src={thumbnailSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Title overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="text-xs text-white font-medium line-clamp-1">
          {item.title}
        </p>
      </div>

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 z-10 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-background/90 rounded-full p-3">
          <ImageIcon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

export function GalleryPickerModal({
  open,
  onOpenChange,
  bookId,
  onSelect,
}: GalleryPickerModalProps) {
  const { t } = useTranslation("common");

  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load gallery items
  useEffect(() => {
    if (!open) return;

    let mounted = true;

    async function loadItems() {
      try {
        setIsLoading(true);
        let galleryItems: IGalleryItem[];

        if (bookId) {
          galleryItems = await getGalleryItemsByBookId(bookId);
        } else {
          // Load all gallery items if no bookId provided
          const { getAllGalleryItems } = await import("@/lib/db/gallery.service");
          galleryItems = await getAllGalleryItems();
        }

        if (mounted) {
          setItems(galleryItems);
        }
      } catch (error) {
        console.error("[GalleryPickerModal] Failed to load items:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      mounted = false;
    };
  }, [open, bookId]);

  // Filter items by search term
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  // Handle item selection
  const handleItemClick = useCallback(
    async (item: IGalleryItem) => {
      try {
        // Load the ORIGINAL image (full quality, not thumbnail)
        const imageDataUrl = await loadOriginalImageAsDataURL(item);
        onSelect(imageDataUrl);
        onOpenChange(false);
        setSearchTerm(""); // Reset search
      } catch (error) {
        console.error("[GalleryPickerModal] Failed to load original image:", error);
      }
    },
    [onSelect, onOpenChange]
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setSearchTerm(""); // Reset search
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col gap-0">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            {t("gallery_picker.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="flex-shrink-0 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("gallery_picker.search_placeholder")}
              className={`pl-9 ${searchTerm.length > 0 ? "pr-10" : ""}`}
            />

            {/* Clear search button */}
            {searchTerm.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content area - scrollable */}
        <div className="flex-1 overflow-y-auto mt-4 pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">
                {searchTerm
                  ? t("gallery_picker.no_results")
                  : t("gallery_picker.empty")}
              </p>
              <p className="text-sm mt-1">
                {searchTerm
                  ? t("gallery_picker.try_different_search")
                  : t("gallery_picker.upload_images_first")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 pb-4">
              {filteredItems.map((item) => (
                <ThumbnailCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with count */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="flex-shrink-0 pt-4 border-t text-sm text-muted-foreground">
            {searchTerm
              ? t("gallery_picker.showing_results", {
                  count: filteredItems.length,
                  total: items.length,
                })
              : t("gallery_picker.total_images", { count: items.length })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
