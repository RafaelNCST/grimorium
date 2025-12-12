import { useEffect, useCallback, useState } from "react";

import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Pencil,
  Trash2,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getCharacterById } from "@/lib/db/characters.service";
import { getFactionById } from "@/lib/db/factions.service";
import { getItemById } from "@/lib/db/items.service";
import { getPlotArcById } from "@/lib/db/plot.service";
import { getRaceById } from "@/lib/db/races.service";
import { getRegionById } from "@/lib/db/regions.service";
import { IGalleryItem, IGalleryLink } from "@/types/gallery-types";

import { formatFileSize, bytesToDataURL } from "../utils/image-utils";

import { DeleteImageDialog } from "./delete-image-dialog";

interface ImageLightboxProps {
  item: IGalleryItem;
  allItems: IGalleryItem[];
  onClose: () => void;
  onNavigate?: (item: IGalleryItem) => void;
  onEdit?: (item: IGalleryItem) => void;
  onDelete?: (item: IGalleryItem) => void;
  onUnlink?: (item: IGalleryItem) => void;
}

export function ImageLightbox({
  item,
  allItems,
  onClose,
  onNavigate,
  onEdit,
  onDelete,
  onUnlink,
}: ImageLightboxProps) {
  const { t } = useTranslation("gallery");
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entityNames, setEntityNames] = useState<Record<string, string>>({});

  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allItems.length - 1;

  // Load image from file system and convert to data URL
  useEffect(() => {
    const loadImageSrc = async () => {
      try {
        // Read file from AppData directory
        const fileBytes = await readFile(item.originalPath, {
          baseDir: BaseDirectory.AppData,
        });

        // Convert bytes to data URL
        const dataUrl = bytesToDataURL(fileBytes, item.mimeType);
        setImageSrc(dataUrl);
      } catch (error) {
        console.error("Error loading image source:", error);
      }
    };

    loadImageSrc();
  }, [item.originalPath, item.mimeType]);

  // Fetch entity names for links
  useEffect(() => {
    const fetchEntityNames = async () => {
      const names: Record<string, string> = {};

      for (const link of item.links) {
        if (link.entityName) {
          names[link.entityId] = link.entityName;
          continue;
        }

        try {
          let entity;
          switch (link.entityType) {
            case "character":
              entity = await getCharacterById(link.entityId);
              break;
            case "region":
              entity = await getRegionById(link.entityId);
              break;
            case "faction":
              entity = await getFactionById(link.entityId);
              break;
            case "race":
              entity = await getRaceById(link.entityId);
              break;
            case "item":
              entity = await getItemById(link.entityId);
              break;
            case "arc":
              entity = await getPlotArcById(link.entityId);
              break;
          }

          if (entity && "name" in entity) {
            names[link.entityId] = entity.name;
          }
        } catch (error) {
          console.error(`Error fetching ${link.entityType}:`, error);
        }
      }

      setEntityNames(names);
    };

    fetchEntityNames();
  }, [item.links]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && hasPrevious && onNavigate) {
        onNavigate(allItems[currentIndex - 1]);
      } else if (e.key === "ArrowRight" && hasNext && onNavigate) {
        onNavigate(allItems[currentIndex + 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, hasPrevious, hasNext, currentIndex, allItems, onNavigate]);

  const handlePrevious = useCallback(() => {
    if (hasPrevious && onNavigate) {
      onNavigate(allItems[currentIndex - 1]);
    }
  }, [hasPrevious, onNavigate, allItems, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext && onNavigate) {
      onNavigate(allItems[currentIndex + 1]);
    }
  }, [hasNext, onNavigate, allItems, currentIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Back button */}
      <div className="absolute top-12 left-4 z-10">
        <Button
          size="icon"
          variant="ghost"
          className="h-12 w-12 text-white"
          onClick={onClose}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex h-full pt-8">
        {/* Image viewer */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Navigation buttons */}
          {hasPrevious && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-4 z-10 h-12 w-12 text-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {hasNext && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 z-10 h-12 w-12 text-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Zoom controls */}
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
          >
            {({ zoomIn, zoomOut, resetTransform: _resetTransform }) => (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/60 rounded-lg p-2 backdrop-blur-sm">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white"
                    onClick={() => zoomOut()}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white"
                    onClick={() => zoomIn()}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                <TransformComponent
                  wrapperClass="!w-full !h-full"
                  contentClass="!w-full !h-full flex items-center justify-center"
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                      }}
                    />
                  ) : (
                    <LoadingSpinner className="border-t-purple-500" />
                  )}
                </TransformComponent>
              </>
            )}
          </TransformWrapper>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white text-sm px-3 py-1 rounded-lg backdrop-blur-sm">
            {currentIndex + 1} / {allItems.length}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-background border-l">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(item)}
                    title={t("lightbox.edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onUnlink && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onUnlink(item)}
                    title={t("lightbox.unlink")}
                  >
                    <Unlink className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="icon"
                    variant="ghost-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    title={t("lightbox.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Separator />

              {/* Description */}
              {item.description && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      {t("lightbox.description_label")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Metadata */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  {t("lightbox.metadata")}
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {t("lightbox.filename")}:
                    </span>
                    <p className="font-mono text-xs mt-1 break-all">
                      {item.originalFilename}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {t("lightbox.size")}:
                    </span>
                    <p className="mt-1">{formatFileSize(item.fileSize)}</p>
                  </div>
                  {item.width && item.height && (
                    <div>
                      <span className="text-muted-foreground">
                        {t("lightbox.dimensions")}:
                      </span>
                      <p className="mt-1">
                        {item.width} × {item.height}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">
                      {t("lightbox.format")}:
                    </span>
                    <p className="mt-1 uppercase">
                      {item.mimeType.replace("image/", "")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Linked entities */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  {t("lightbox.linked_entities")}
                </h3>
                {item.links.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("lightbox.no_links")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      // Group links by entity type
                      const groupedLinks = item.links.reduce(
                        (acc, link) => {
                          if (!acc[link.entityType]) {
                            acc[link.entityType] = [];
                          }
                          acc[link.entityType].push(link);
                          return acc;
                        },
                        {} as Record<string, IGalleryLink[]>
                      );

                      return Object.entries(groupedLinks).map(
                        ([entityType, links]) => {
                          const entityTypeLabel = (() => {
                            switch (entityType) {
                              case "character":
                                return t("filters.characters");
                              case "region":
                                return t("filters.regions");
                              case "faction":
                                return t("filters.factions");
                              case "race":
                                return t("filters.races");
                              case "item":
                                return t("filters.items");
                              case "arc":
                                return t("filters.arcs");
                              default:
                                return entityType;
                            }
                          })();

                          return (
                            <div
                              key={entityType}
                              className="flex flex-wrap items-center gap-1.5"
                            >
                              <span className="text-xs text-muted-foreground">
                                {entityTypeLabel}:
                              </span>
                              {links.map((link) => {
                                const displayName =
                                  entityNames[link.entityId] ||
                                  link.entityName ||
                                  link.entityId;

                                return (
                                  <Badge key={link.id} variant="secondary">
                                    {displayName}
                                  </Badge>
                                );
                              })}
                            </div>
                          );
                        }
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {onDelete && (
        <DeleteImageDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          imageName={item.title}
          onConfirmDelete={() => onDelete(item)}
        />
      )}
    </div>
  );
}
