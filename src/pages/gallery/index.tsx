import { useCallback, useEffect, useMemo, useState } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { useGalleryStore } from "@/stores/gallery-store";
import { IGalleryItem, IGalleryLink, EntityType } from "@/types/gallery-types";

import { GalleryView } from "./view";

export function GalleryPage() {
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/gallery/",
  });
  const navigate = useNavigate();

  const {
    items,
    isLoading,
    fetchGalleryItems,
    addGalleryItem,
    updateGalleryItemInCache,
    updateGalleryLinksInCache,
    deleteGalleryItemFromCache,
    reorderGalleryItemsInCache,
  } = useGalleryStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [entityTypeFilters, setEntityTypeFilters] = useState<EntityType[]>([]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IGalleryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<IGalleryItem | null>(null);

  // Fetch items on mount
  useEffect(() => {
    fetchGalleryItems(false, dashboardId);
  }, [dashboardId, fetchGalleryItems]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term)
      );
    }

    // Filter by entity types
    if (entityTypeFilters.length > 0) {
      result = result.filter((item) =>
        item.links.some((link) => entityTypeFilters.includes(link.entityType))
      );
    }

    // Sort by recent (fixed)
    result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return result;
  }, [items, searchTerm, entityTypeFilters]);

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleEntityTypeToggle = useCallback((type: EntityType) => {
    setEntityTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleUpload = useCallback(
    async (data: {
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
    }) => {
      if (editingItem) {
        // Update existing item
        const updatedData = {
          title: data.title,
          description: data.description,
          thumbnailBase64: data.thumbnailBase64,
          originalPath: data.originalPath,
          originalFilename: data.originalFilename,
          fileSize: data.fileSize,
          width: data.width,
          height: data.height,
          mimeType: data.mimeType,
          updatedAt: new Date().toISOString(),
        };

        await updateGalleryItemInCache(editingItem.id, updatedData);

        // Update links separately
        await updateGalleryLinksInCache(editingItem.id, data.links);

        // Update selectedItem if it's the same item being edited
        // Build the updated item manually to ensure immediate update
        if (selectedItem && selectedItem.id === editingItem.id) {
          setSelectedItem({
            ...selectedItem,
            ...updatedData,
            links: data.links,
          });
        }

        setEditingItem(null);
      } else {
        // Create new item
        const newItem: IGalleryItem = {
          id: crypto.randomUUID(),
          bookId: dashboardId,
          title: data.title,
          description: data.description,
          thumbnailBase64: data.thumbnailBase64,
          originalPath: data.originalPath,
          originalFilename: data.originalFilename,
          fileSize: data.fileSize,
          width: data.width,
          height: data.height,
          mimeType: data.mimeType,
          orderIndex: items.length,
          links: data.links,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await addGalleryItem(newItem);
      }

      setIsUploadModalOpen(false);
    },
    [
      dashboardId,
      items.length,
      addGalleryItem,
      updateGalleryItemInCache,
      updateGalleryLinksInCache,
      editingItem,
      selectedItem,
    ]
  );

  const handleModalClose = useCallback((open: boolean) => {
    setIsUploadModalOpen(open);
    if (!open) {
      // Delay reset to allow modal close animation to complete
      setTimeout(() => {
        setEditingItem(null);
      }, 300);
    }
  }, []);

  const handleBackToDashboard = useCallback(() => {
    navigate({ to: "/dashboard/$dashboardId", params: { dashboardId } });
  }, [navigate, dashboardId]);

  const handleItemClick = useCallback((item: IGalleryItem) => {
    setSelectedItem(item);
  }, []);

  const handleItemEdit = useCallback((item: IGalleryItem) => {
    setEditingItem(item);
    setIsUploadModalOpen(true);
  }, []);

  const handleItemDelete = useCallback(
    async (item: IGalleryItem) => {
      await deleteGalleryItemFromCache(item.id);
      // Close lightbox after deleting
      setSelectedItem(null);
    },
    [deleteGalleryItemFromCache]
  );

  const handleReorder = useCallback(
    async (reorderedItems: IGalleryItem[]) => {
      await reorderGalleryItemsInCache(reorderedItems);
    },
    [reorderGalleryItemsInCache]
  );

  const handleCloseLightbox = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const hasActiveFilters = searchTerm.length > 0;

  return (
    <GalleryView
      items={filteredAndSortedItems}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      entityTypeFilters={entityTypeFilters}
      onEntityTypeToggle={handleEntityTypeToggle}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
      isUploadModalOpen={isUploadModalOpen}
      onUploadModalChange={handleModalClose}
      onUpload={handleUpload}
      editingItem={editingItem}
      bookId={dashboardId}
      onItemClick={handleItemClick}
      onItemEdit={handleItemEdit}
      onItemDelete={handleItemDelete}
      onReorder={handleReorder}
      selectedItem={selectedItem}
      onCloseLightbox={handleCloseLightbox}
      onBackToDashboard={handleBackToDashboard}
    />
  );
}
