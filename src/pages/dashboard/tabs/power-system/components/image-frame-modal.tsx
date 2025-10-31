import { useState, useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageFrameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  currentOffsetX: number;
  currentOffsetY: number;
  containerWidth: number; // Largura do container visível (mesma proporção do bloco)
  containerHeight: number; // Altura do container visível
  onApply: (offsetX: number, offsetY: number) => void;
}

interface CropBoxPosition {
  x: number;
  y: number;
}

interface DragStart {
  mouseX: number;
  mouseY: number;
  boxX: number;
  boxY: number;
}

interface ImageDimensions {
  naturalWidth: number;
  naturalHeight: number;
  displayedWidth: number;
  displayedHeight: number;
  scale: number;
}

export function ImageFrameModal({
  open,
  onOpenChange,
  imageUrl,
  currentOffsetX,
  currentOffsetY,
  containerWidth,
  containerHeight,
  onApply,
}: ImageFrameModalProps) {
  const { t } = useTranslation("power-system");
  const [cropBoxPosition, setCropBoxPosition] = useState<CropBoxPosition>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragStart | null>(null);
  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Maximum display dimensions for the image in the modal
  const MAX_DISPLAY_WIDTH = 800;
  const MAX_DISPLAY_HEIGHT = 600;

  // Load image and calculate dimensions
  useEffect(() => {
    if (!open) return;

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      // Calculate scale to fit image within max dimensions while maintaining aspect ratio
      const scaleX = MAX_DISPLAY_WIDTH / img.naturalWidth;
      const scaleY = MAX_DISPLAY_HEIGHT / img.naturalHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Don't upscale if image is smaller

      const displayedWidth = img.naturalWidth * scale;
      const displayedHeight = img.naturalHeight * scale;

      setImageDimensions({
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayedWidth,
        displayedHeight,
        scale,
      });

      // Crop box dimensions in modal coordinates
      const cropBoxWidth = containerWidth * scale;
      const cropBoxHeight = containerHeight * scale;

      // Center of displayed image
      const imageCenterX = displayedWidth / 2;
      const imageCenterY = displayedHeight / 2;

      // In the block, offsets move the image from center
      // offsetX = 0, offsetY = 0 means image is centered
      // offsetX = 50 means image moved 50px right (shows content 50px left of center)
      // offsetY = -50 means image moved 50px up (shows content 50px below center)

      // Crop box center = image center - offsets (scaled to modal)
      const cropBoxCenterX = imageCenterX - currentOffsetX * scale;
      const cropBoxCenterY = imageCenterY - currentOffsetY * scale;

      // Crop box top-left position
      const cropBoxX = cropBoxCenterX - cropBoxWidth / 2;
      const cropBoxY = cropBoxCenterY - cropBoxHeight / 2;

      setCropBoxPosition({ x: cropBoxX, y: cropBoxY });
    };
  }, [open, imageUrl, currentOffsetX, currentOffsetY, containerWidth, containerHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      boxX: cropBoxPosition.x,
      boxY: cropBoxPosition.y,
    });
  };

  useEffect(() => {
    if (!isDragging || !dragStart || !imageDimensions) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.mouseX;
      const deltaY = e.clientY - dragStart.mouseY;

      const newX = dragStart.boxX + deltaX;
      const newY = dragStart.boxY + deltaY;

      // Calculate crop box dimensions
      const cropBoxWidth = containerWidth * imageDimensions.scale;
      const cropBoxHeight = containerHeight * imageDimensions.scale;

      // Apply bounds: crop box must stay within image boundaries
      const boundedX = Math.max(
        0,
        Math.min(newX, imageDimensions.displayedWidth - cropBoxWidth)
      );
      const boundedY = Math.max(
        0,
        Math.min(newY, imageDimensions.displayedHeight - cropBoxHeight)
      );

      setCropBoxPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, imageDimensions, containerWidth, containerHeight]);

  const handleApply = () => {
    if (!imageDimensions) return;

    // Calculate crop box dimensions
    const cropBoxWidth = containerWidth * imageDimensions.scale;
    const cropBoxHeight = containerHeight * imageDimensions.scale;

    // Center of displayed image
    const imageCenterX = imageDimensions.displayedWidth / 2;
    const imageCenterY = imageDimensions.displayedHeight / 2;

    // Center of crop box
    const cropBoxCenterX = cropBoxPosition.x + cropBoxWidth / 2;
    const cropBoxCenterY = cropBoxPosition.y + cropBoxHeight / 2;

    // Offset = image center - crop box center (in block coordinates)
    // Scale back from modal coordinates to block coordinates
    const offsetX = (imageCenterX - cropBoxCenterX) / imageDimensions.scale;
    const offsetY = (imageCenterY - cropBoxCenterY) / imageDimensions.scale;

    onApply(offsetX, offsetY);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!imageDimensions) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("image_frame_modal.title")}</DialogTitle>
            <DialogDescription>
              {t("image_frame_modal.instruction")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center p-8">
            <p className="text-muted-foreground">Loading image...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {t("image_frame_modal.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const cropBoxWidth = containerWidth * imageDimensions.scale;
  const cropBoxHeight = containerHeight * imageDimensions.scale;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("image_frame_modal.title")}</DialogTitle>
          <DialogDescription>
            {t("image_frame_modal.instruction")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center p-8">
          <div
            ref={containerRef}
            className="relative"
            style={{
              width: `${imageDimensions.displayedWidth}px`,
              height: `${imageDimensions.displayedHeight}px`,
            }}
          >
            {/* Fixed image (no movement) */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Full preview"
              className="select-none pointer-events-none"
              style={{
                width: `${imageDimensions.displayedWidth}px`,
                height: `${imageDimensions.displayedHeight}px`,
                display: "block",
              }}
              draggable={false}
            />

            {/* Draggable crop box with overlay */}
            <div
              className="absolute"
              style={{
                left: `${cropBoxPosition.x}px`,
                top: `${cropBoxPosition.y}px`,
                width: `${cropBoxWidth}px`,
                height: `${cropBoxHeight}px`,
                border: "2px solid white",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                cursor: isDragging ? "grabbing" : "grab",
                transition: isDragging ? "none" : "all 0.1s ease-out",
                zIndex: 10,
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Inner border for better visibility */}
              <div className="absolute inset-0 border-2 border-white/30 pointer-events-none" />

              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white pointer-events-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white pointer-events-none" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("image_frame_modal.cancel")}
          </Button>
          <Button onClick={handleApply}>{t("image_frame_modal.apply")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
