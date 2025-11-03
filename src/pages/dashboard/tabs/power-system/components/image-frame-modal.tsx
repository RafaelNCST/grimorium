import { useState, useCallback } from "react";

import Cropper from "react-easy-crop";
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

import type { Area, Point } from "react-easy-crop";

interface ImageFrameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  currentCrop?: Point;
  currentZoom?: number;
  containerWidth: number;
  containerHeight: number;
  onApply: (crop: Point, zoom: number, croppedArea: Area) => void;
}

export function ImageFrameModal({
  open,
  onOpenChange,
  imageUrl,
  currentCrop = { x: 0, y: 0 },
  currentZoom = 1,
  containerWidth,
  containerHeight,
  onApply,
}: ImageFrameModalProps) {
  const { t } = useTranslation("power-system");
  const [crop, setCrop] = useState<Point>(currentCrop);
  const zoom = 1; // Fixed zoom at 1
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleApply = () => {
    if (!croppedAreaPixels) return;
    onApply(crop, zoom, croppedAreaPixels);
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setCrop(currentCrop);
    onOpenChange(false);
  };

  // Calculate aspect ratio based on container dimensions
  const aspect = containerWidth / containerHeight;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("image_frame_modal.title")}</DialogTitle>
          <DialogDescription>
            {t("image_frame_modal.instruction")}
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[600px] bg-black rounded-lg overflow-hidden">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            objectFit="contain"
            showGrid={false}
            style={{
              containerStyle: {
                backgroundColor: "#000",
              },
              cropAreaStyle: {
                border: "2px solid #fff",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
              },
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("image_frame_modal.cancel")}
          </Button>
          <Button
            variant="magical"
            className="animate-glow"
            onClick={handleApply}
          >
            {t("image_frame_modal.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
