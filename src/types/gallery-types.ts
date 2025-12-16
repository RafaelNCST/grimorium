export type EntityType =
  | "character"
  | "region"
  | "faction"
  | "race"
  | "item"
  | "arc";

export type GallerySortOrder = "recent" | "alphabetical" | "manual";

export interface IGalleryLink {
  id: string;
  entityId: string;
  entityType: EntityType;
  bookId: string;
  entityName?: string; // Populated when fetching for display
  createdAt?: string;
}

export interface IGalleryItem {
  id: string;
  bookId: string;
  title: string;
  description?: string;

  // Hybrid storage
  thumbnailBase64?: string; // DEPRECATED: para compatibilidade temporária
  thumbnailPath: string;    // Path para thumbnail no filesystem
  originalPath: string;     // For fullscreen/download

  // Metadata
  originalFilename: string;
  fileSize: number;
  width?: number;
  height?: number;
  mimeType: string;

  // Organization
  orderIndex: number;

  // Links
  links: IGalleryLink[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface IGalleryFormData {
  title: string;
  description?: string;
  links: IGalleryLink[];
}

export interface IGalleryFilters {
  searchTerm: string;
  sortOrder: GallerySortOrder;
  entityTypeFilters: EntityType[];
}
