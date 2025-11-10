import { useCallback, useEffect, useState } from "react";

import { Image as ImageIcon, Trash2, Upload } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  type IPowerBlock,
  type ImageContent,
} from "../../types/power-system-types";

interface ImageBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: ImageContent) => void;
  onDelete: () => void;
}

// Helper function to create cropped image
const createCroppedImage = async (
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Set canvas size to the cropped area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Draw the cropped image
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert canvas to data URL
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      }, "image/jpeg");
    };
    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });

export function ImageBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
}: ImageBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as ImageContent;

  // Local state for caption with debounced updates
  const [localCaption, setLocalCaption] = useState(content.caption || "");

  // Crop modal state
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string>("");

  // Fixed zoom value - no zoom control
  const zoom = 1;

  // Sync local caption with content when block changes
  useEffect(() => {
    setLocalCaption(content.caption || "");
  }, [content.caption, block.id]);

  // Debounce caption updates to the store
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localCaption !== content.caption) {
        onUpdate({ ...content, caption: localCaption });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [localCaption]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // When uploading a new image, set it as both the current and original
        // Clear any previous crop data
        onUpdate({
          ...content,
          imageUrl: result,
          originalImageUrl: result,
          croppedImageUrl: undefined,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleObjectFitChange = (value: string) => {
    if (!value) return; // Prevent deselecting all options

    if (value === "crop") {
      // Check if there's an image before opening crop modal
      const imageToUse = content.originalImageUrl || content.imageUrl;
      if (!imageToUse) {
        alert(t("blocks.image.upload_image"));
        return;
      }

      // If there's already a cropped version, use the original for editing
      setCropImageSrc(content.originalImageUrl || content.imageUrl);

      // If we have a previous crop, show it; otherwise show the original
      if (content.croppedImageUrl) {
        onUpdate({
          ...content,
          imageUrl: content.croppedImageUrl,
          objectFit: "crop",
        });
      }
      setShowCropModal(true);
    } else {
      // When switching to fit/fill, always use the original image
      const originalImage = content.originalImageUrl || content.imageUrl;
      if (showCropModal) {
        handleCancelCrop();
      }
      onUpdate({
        ...content,
        imageUrl: originalImage,
        objectFit: value as "fill" | "fit",
      });
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSaveCrop = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;

    try {
      const croppedImageUrl = await createCroppedImage(
        cropImageSrc,
        croppedAreaPixels
      );

      // Save both the original and cropped versions
      // Ensure originalImageUrl is preserved if it exists, otherwise use current imageUrl
      const originalImage = content.originalImageUrl || cropImageSrc;

      onUpdate({
        ...content,
        imageUrl: croppedImageUrl, // Display the cropped image
        originalImageUrl: originalImage, // Keep original for reverting
        croppedImageUrl, // Store crop for mode switching
        objectFit: "crop",
      });

      setShowCropModal(false);
      // Reset crop state
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
      setCropImageSrc("");
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleCancelCrop = () => {
    setShowCropModal(false);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    setCropImageSrc("");
  };

  if (!isEditMode && !content.imageUrl) {
    return null;
  }

  // Determine the object-fit class
  const getObjectFitClass = () => {
    if (content.objectFit === "fit") return "object-contain";
    // Default is 'fill' or 'crop' - both use object-cover
    return "object-cover";
  };

  if (isEditMode) {
    return (
      <>
        <div
          className="space-y-3 p-4 rounded-lg border bg-card"
          data-no-drag={showCropModal ? "true" : undefined}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            {/* Image fit controls */}
            {content.imageUrl && (
              <div className="flex-1">
                <Label className="text-sm mb-2 block">
                  {t("blocks.image.object_fit_label")}
                </Label>
                <div className="flex gap-2" data-no-drag="true">
                  <button
                    type="button"
                    onClick={() => handleObjectFitChange("fill")}
                    className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                      (content.objectFit || "fill") === "fill"
                        ? "border-primary/40 bg-primary/10 shadow-sm"
                        : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
                    }`}
                  >
                    {t("blocks.image.fill")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleObjectFitChange("fit")}
                    className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                      content.objectFit === "fit"
                        ? "border-primary/40 bg-primary/10 shadow-sm"
                        : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
                    }`}
                  >
                    {t("blocks.image.fit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleObjectFitChange("crop")}
                    className={`px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
                      content.objectFit === "crop"
                        ? "border-primary/40 bg-primary/10 shadow-sm"
                        : "border-muted bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30"
                    }`}
                  >
                    {t("blocks.image.crop")}
                  </button>
                </div>
              </div>
            )}

            <Button
              data-no-drag="true"
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:bg-red-500/20 hover:text-red-600 ml-auto cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="w-full aspect-video rounded-lg overflow-hidden border bg-muted/50">
            {content.imageUrl ? (
              <div className="relative w-full h-full group">
                <img
                  src={content.imageUrl}
                  alt="Block image"
                  className={`w-full h-full ${getObjectFitClass()}`}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label
                    htmlFor={`image-upload-${block.id}`}
                    data-no-drag="true"
                    className="cursor-pointer"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className="cursor-pointer"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {t("blocks.image.change_image")}
                      </span>
                    </Button>
                  </label>
                  <input
                    data-no-drag="true"
                    id={`image-upload-${block.id}`}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <ImageIcon className="w-16 h-16 text-muted-foreground" />
                <label
                  htmlFor={`image-upload-${block.id}`}
                  data-no-drag="true"
                  className="cursor-pointer"
                >
                  <Button variant="secondary" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {t("blocks.image.upload_image")}
                    </span>
                  </Button>
                </label>
                <input
                  data-no-drag="true"
                  id={`image-upload-${block.id}`}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <Input
            data-no-drag="true"
            placeholder={t("blocks.image.caption_placeholder")}
            value={localCaption}
            onChange={(e) => setLocalCaption(e.target.value)}
          />
        </div>

        {/* Crop Modal - Separado do container do bloco */}
        <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
          <DialogContent className="sm:max-w-3xl z-50">
            <DialogHeader>
              <DialogTitle>{t("blocks.image.crop_image_title")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative w-full h-[400px] bg-black">
                {cropImageSrc && (
                  <Cropper
                    image={cropImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    cropShape="rect"
                    showGrid
                  />
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCancelCrop}>
                {t("blocks.image.crop_cancel")}
              </Button>
              <Button
                variant="magical"
                className="animate-glow"
                onClick={handleSaveCrop}
              >
                {t("blocks.image.crop_save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return content.imageUrl ? (
    <div className="space-y-2">
      <div className="w-full aspect-video rounded-lg overflow-hidden border">
        <img
          src={content.imageUrl}
          alt="Block image"
          className={`w-full h-full ${getObjectFitClass()}`}
        />
      </div>
      {content.caption && (
        <p className="text-sm text-muted-foreground text-center italic">
          {content.caption}
        </p>
      )}
    </div>
  ) : null;
}
