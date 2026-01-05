import { useState, useCallback, useEffect } from "react";

import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { stat, readFile } from "@tauri-apps/plugin-fs";
import { Upload, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { ManageEntityLinksModal } from "@/components/modals/manage-entity-links-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  copyImageToGallery,
  ensureGalleryDirectory,
  loadThumbnailWithFallback,
} from "@/lib/db/gallery.service";
import { IGalleryItem, IGalleryLink } from "@/types/gallery-types";

import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  SUPPORTED_IMAGE_EXTENSIONS,
} from "../constants/gallery-constants";
import {
  generateThumbnail,
  getImageDimensions,
  formatFileSize,
  getExtensionFromMimeType,
  getMimeTypeFromExtension,
  bytesToDataURL,
} from "../utils/image-utils";

interface UploadImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  editingItem?: IGalleryItem | null;
  bookId: string;
  preSelectedLinks?: IGalleryLink[];
  disableLinksManagement?: boolean;
}

export function UploadImageModal({
  open,
  onOpenChange,
  onUpload,
  editingItem = null,
  bookId,
  preSelectedLinks = [],
  disableLinksManagement = false,
}: UploadImageModalProps) {
  const { t } = useTranslation("gallery");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<IGalleryLink[]>(preSelectedLinks);
  const [showManageLinksModal, setShowManageLinksModal] = useState(false);

  // Image state
  const [selectedImagePath, setSelectedImagePath] = useState<string>("");
  const [selectedImageDataURL, setSelectedImageDataURL] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageMetadata, setImageMetadata] = useState<{
    filename: string;
    size: number;
    mimeType: string;
    width: number;
    height: number;
  } | null>(null);

  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Load editing item data when modal opens
  useEffect(() => {
    if (open && editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description || "");
      setLinks(editingItem.links);

      // Carregar thumbnail do filesystem
      loadThumbnailWithFallback(editingItem)
        .then((thumbnailDataUrl) => {
          setImagePreview(thumbnailDataUrl);
        })
        .catch((error) => {
          console.error("[UploadImageModal] Failed to load thumbnail:", error);
          setImagePreview(""); // Fallback para string vazia
        });

      setImageMetadata({
        filename: editingItem.originalFilename,
        size: editingItem.fileSize,
        mimeType: editingItem.mimeType,
        width: editingItem.width,
        height: editingItem.height,
      });
      setSelectedImagePath(editingItem.originalPath);
    }
  }, [open, editingItem]);

  const handleSelectImage = useCallback(async () => {
    try {
      const selected = await openDialog({
        multiple: false,
        filters: [
          {
            name: "Images",
            extensions: SUPPORTED_IMAGE_EXTENSIONS,
          },
        ],
      });

      if (!selected || typeof selected !== "string") {
        return;
      }

      // Get file stats using Tauri FS API
      const fileStats = await stat(selected);

      // Check file size
      if (fileStats.size > MAX_FILE_SIZE_BYTES) {
        setError(t("upload_modal.max_size_error", { size: MAX_FILE_SIZE_MB }));
        return;
      }

      // Get filename and extension
      const filename = selected.split(/[\\/]/).pop() || "image";
      const extension = filename.split(".").pop()?.toLowerCase() || "";

      // Determine MIME type from extension
      const mimeType = getMimeTypeFromExtension(extension);

      // Read file content as bytes
      const fileBytes = await readFile(selected);

      // Convert bytes to data URL
      const imageDataURL = bytesToDataURL(fileBytes, mimeType);

      // Get image dimensions
      const dimensions = await getImageDimensions(imageDataURL);

      // Generate thumbnail preview
      const thumbnail = await generateThumbnail(imageDataURL);

      setSelectedImagePath(selected);
      setSelectedImageDataURL(imageDataURL);
      setImagePreview(thumbnail);
      setImageMetadata({
        filename,
        size: fileStats.size,
        mimeType,
        width: dimensions.width,
        height: dimensions.height,
      });
      setError("");
    } catch (err) {
      console.error("Error selecting image:", err);
      setError("Failed to load image. Please try again.");
    }
  }, [t]);

  const handleUpload = useCallback(async () => {
    if (!title.trim()) {
      setError(t("upload_modal.title_required"));
      return;
    }

    if (!imageMetadata) {
      setError("Please select an image first.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      let finalPath = selectedImagePath;
      let finalThumbnail = imagePreview;

      // Only copy file if a new image was selected (different from editing)
      if (
        selectedImageDataURL &&
        (!editingItem || selectedImagePath !== editingItem.originalPath)
      ) {
        // Ensure gallery directory exists
        await ensureGalleryDirectory();

        // Generate unique filename
        const itemId = crypto.randomUUID();
        const extension = getExtensionFromMimeType(imageMetadata.mimeType);
        const uniqueFilename = `image_${itemId}_${crypto.randomUUID()}.${extension}`;
        const relativePath = `gallery/${uniqueFilename}`;

        // Copy file to AppData/gallery/
        await copyImageToGallery(selectedImagePath, relativePath);

        // Generate thumbnail
        finalThumbnail = await generateThumbnail(selectedImageDataURL);
        finalPath = relativePath;
      }

      // Call onUpload with all data
      onUpload({
        title: title.trim(),
        description: description.trim() || undefined,
        thumbnailBase64: finalThumbnail,
        originalPath: finalPath,
        originalFilename: imageMetadata.filename,
        fileSize: imageMetadata.size,
        width: imageMetadata.width,
        height: imageMetadata.height,
        mimeType: imageMetadata.mimeType,
        links,
      });

      // Reset form
      handleClose();
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [
    title,
    description,
    selectedImagePath,
    selectedImageDataURL,
    imagePreview,
    imageMetadata,
    links,
    onUpload,
    editingItem,
    t,
  ]);

  const handleClose = useCallback(() => {
    setTitle("");
    setDescription("");
    setLinks(preSelectedLinks);
    setSelectedImagePath("");
    setSelectedImageDataURL("");
    setImagePreview("");
    setImageMetadata(null);
    setError("");
    setIsUploading(false);
    setShowManageLinksModal(false);
    onOpenChange(false);
  }, [preSelectedLinks, onOpenChange]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? t("upload_modal.edit_title")
                : t("upload_modal.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Selection */}
            <div className="space-y-2">
              <Label className="text-primary">
                {t("upload_modal.select_image")}
              </Label>
              {imagePreview ? (
                <div
                  className="relative w-full h-64 rounded-lg border overflow-hidden cursor-pointer group"
                  onClick={handleSelectImage}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain transition-all duration-300 group-hover:brightness-50"
                  />
                  {/* Hover overlay with upload icon */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <Upload className="h-12 w-12 text-white" />
                  </div>

                  {/* File info - on top */}
                  {imageMetadata && (
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-2 z-20">
                      <span className="font-medium truncate max-w-[200px]">
                        {imageMetadata.filename}
                      </span>
                      <span className="text-white/80">•</span>
                      <span className="text-white/80">
                        {formatFileSize(imageMetadata.size)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="relative w-full h-64 border-dashed border-2 border-muted-foreground/25 hover:border-primary transition-colors rounded-lg flex flex-col items-center justify-center gap-2 bg-purple-950/40 overflow-hidden cursor-pointer group"
                  onClick={handleSelectImage}
                >
                  <Upload className="h-12 w-12 text-muted-foreground/60" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg p-2 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-sm font-semibold text-center">
                      {t("upload_modal.select_image")}
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Title */}
            <FormInput
              id="title"
              label={t("upload_modal.title_label")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("upload_modal.title_placeholder")}
              maxLength={100}
              showCharCount
              required
              showOptionalLabel={false}
              labelClassName="text-primary"
            />

            {/* Description */}
            <FormTextarea
              id="description"
              label={t("upload_modal.description_label")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("upload_modal.description_placeholder")}
              maxLength={500}
              showCharCount
              className="min-h-[120px]"
              labelClassName="text-primary"
            />

            {/* Links */}
            {!disableLinksManagement && (
              <div className="space-y-2">
                <Label className="text-primary">
                  {t("upload_modal.links_label")}
                </Label>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setShowManageLinksModal(true)}
                >
                  {t("upload_modal.manage_links")} ({links.length})
                </Button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isUploading}
            >
              {t("upload_modal.cancel")}
            </Button>
            <Button
              type="button"
              variant="magical"
              onClick={handleUpload}
              disabled={isUploading || !imagePreview || !title.trim()}
              className="animate-glow"
            >
              {isUploading ? (
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-transparent border-t-primary" />
              ) : editingItem ? (
                <Save className="w-4 h-4 mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isUploading
                ? editingItem
                  ? t("upload_modal.saving")
                  : t("upload_modal.uploading")
                : editingItem
                  ? t("upload_modal.save")
                  : t("upload_modal.upload")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Links Modal */}
      <ManageEntityLinksModal
        open={showManageLinksModal}
        onOpenChange={setShowManageLinksModal}
        links={links}
        onLinksChange={setLinks}
        bookId={bookId}
      />
    </>
  );
}
