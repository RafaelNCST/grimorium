import { useCallback, useEffect, useMemo, useState } from "react";

import { useParams, useSearch, useNavigate } from "@tanstack/react-router";

import { useGalleryStore } from "@/stores/gallery-store";
import {
  IGalleryItem,
  IGalleryLink,
  GallerySortOrder,
  EntityType,
} from "@/types/gallery-types";

import { EntityGalleryView } from "./view";

export function EntityGalleryPage() {
  const { dashboardId, entityType, entityId } = useParams({
    from: "/dashboard/$dashboardId/gallery/entity/$entityType/$entityId",
  });
  const { entityName } = useSearch({
    from: "/dashboard/$dashboardId/gallery/entity/$entityType/$entityId",
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
    removeGalleryLinkFromCache,
    reorderGalleryItemsInCache,
  } = useGalleryStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<GallerySortOrder>("recent");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IGalleryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<IGalleryItem | null>(null);

  // Fetch items on mount
  useEffect(() => {
    fetchGalleryItems(false, dashboardId);
  }, [dashboardId, fetchGalleryItems]);

  // Filter items by entity
  const filteredByEntity = useMemo(
    () =>
      items.filter((item) =>
        item.links.some(
          (link) => link.entityId === entityId && link.entityType === entityType
        )
      ),
    [items, entityId, entityType]
  );

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...filteredByEntity];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term)
      );
    }

    // Sort
    switch (sortOrder) {
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
        result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
      case "manual":
        result.sort((a, b) => a.orderIndex - b.orderIndex);
        break;
    }

    return result;
  }, [filteredByEntity, searchTerm, sortOrder]);

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleSortChange = useCallback((value: GallerySortOrder) => {
    setSortOrder(value);
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
        // Create new item - data.links already contains the pre-selected entity link
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
          links: data.links, // Already contains preSelectedLinks with the entity link
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await addGalleryItem(newItem);
      }

      setIsUploadModalOpen(false);
    },
    [
      dashboardId,
      entityId,
      entityType,
      entityName,
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

  const handleBack = useCallback(() => {
    // Map entity types to their detail routes
    const routeMap: Record<string, string> = {
      character: "/dashboard/$dashboardId/tabs/character/$characterId",
      item: "/dashboard/$dashboardId/tabs/item/$itemId",
      race: "/dashboard/$dashboardId/tabs/race/$raceId",
      faction: "/dashboard/$dashboardId/tabs/faction/$factionId",
      region: "/dashboard/$dashboardId/tabs/world/$regionId",
      arc: "/dashboard/$dashboardId/tabs/plot/$plotId",
    };

    const route = routeMap[entityType];
    if (route) {
      // Create params object with the correct parameter name
      const paramName =
        entityType === "character"
          ? "characterId"
          : entityType === "item"
            ? "itemId"
            : entityType === "race"
              ? "raceId"
              : entityType === "faction"
                ? "factionId"
                : entityType === "region"
                  ? "regionId"
                  : "plotId";

      navigate({
        to: route as any,
        params: {
          dashboardId,
          [paramName]: entityId,
        } as any,
      });
    }
  }, [navigate, entityType, entityId, dashboardId]);

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

  const handleItemUnlink = useCallback(
    async (item: IGalleryItem) => {
      // Find the link for the current entity
      const linkToRemove = item.links.find(
        (link) => link.entityId === entityId && link.entityType === entityType
      );

      if (linkToRemove) {
        await removeGalleryLinkFromCache(item.id, linkToRemove.id);
        // Close lightbox after unlinking
        setSelectedItem(null);
      }
    },
    [entityId, entityType, removeGalleryLinkFromCache]
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

  // Pre-selected link for upload modal
  const preSelectedLinks = useMemo<IGalleryLink[]>(
    () => [
      {
        id: crypto.randomUUID(),
        entityId,
        entityType: entityType as EntityType,
        bookId: dashboardId,
        entityName: entityName || undefined,
        createdAt: new Date().toISOString(),
      },
    ],
    [entityId, entityType, dashboardId, entityName]
  );

  return (
    <EntityGalleryView
      items={filteredAndSortedItems}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      sortOrder={sortOrder}
      onSortChange={handleSortChange}
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
      onItemUnlink={handleItemUnlink}
      onReorder={handleReorder}
      selectedItem={selectedItem}
      onCloseLightbox={handleCloseLightbox}
      entityName={entityName || "Entity"}
      entityType={entityType as EntityType}
      preSelectedLinks={preSelectedLinks}
      onBack={handleBack}
    />
  );
}
