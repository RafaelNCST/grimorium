import { useCallback, useEffect, useState } from "react";

import { Image as ImageIcon, Trash2 } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";
import { useTranslation } from "react-i18next";

import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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

  const handleImageChange = (value: string) => {
    if (value) {
      // When uploading a new image, set it as both the current and original
      // Clear any previous crop data
      onUpdate({
        ...content,
        imageUrl: value,
        originalImageUrl: value,
        croppedImageUrl: undefined,
      });
    } else {
      // When removing image
      onUpdate({
        ...content,
        imageUrl: "",
        originalImageUrl: undefined,
        croppedImageUrl: undefined,
      });
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
              <div className="flex gap-2" data-no-drag="true">
                <Button
                  type="button"
                  variant="ghost-active"
                  size="sm"
                  active={(content.objectFit || "fill") === "fill"}
                  onClick={() => handleObjectFitChange("fill")}
                >
                  {t("blocks.image.fill")}
                </Button>
                <Button
                  type="button"
                  variant="ghost-active"
                  size="sm"
                  active={content.objectFit === "fit"}
                  onClick={() => handleObjectFitChange("fit")}
                >
                  {t("blocks.image.fit")}
                </Button>
                <Button
                  type="button"
                  variant="ghost-active"
                  size="sm"
                  active={content.objectFit === "crop"}
                  onClick={() => handleObjectFitChange("crop")}
                >
                  {t("blocks.image.crop")}
                </Button>
              </div>
            )}

            <Button
              data-no-drag="true"
              variant="ghost-destructive"
              size="icon"
              onClick={onDelete}
              className="ml-auto cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>

          <div data-no-drag="true">
            <FormImageUpload
              value={content.imageUrl}
              onChange={handleImageChange}
              label=""
              height="aspect-video"
              width="w-full"
              shape="rounded"
              imageFit={content.objectFit === "fit" ? "contain" : "cover"}
              showLabel={false}
              compact
              placeholderIcon={ImageIcon}
              id={`image-upload-${block.id}`}
            />
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
              <Button variant="secondary" size="lg" onClick={handleCancelCrop}>
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
