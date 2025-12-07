import { useState } from "react";

import { open } from "@tauri-apps/plugin-dialog";
import { Upload, ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { uploadMapImage } from "@/lib/db/region-maps.service";

interface MapImageUploaderProps {
  regionId: string;
  versionId?: string | null;
  onUploadComplete: (imagePath: string, mapId: string) => void;
}

export function MapImageUploader({
  regionId,
  versionId = null,
  onUploadComplete,
}: MapImageUploaderProps) {
  const { t } = useTranslation(["empty-states", "dialogs"]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    try {
      setIsUploading(true);

      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Images",
            extensions: ["png", "jpg", "jpeg", "svg"],
          },
        ],
      });

      if (!selected || typeof selected !== "string") {
        setIsUploading(false);
        return;
      }

      const regionMap = await uploadMapImage(regionId, selected, versionId);

      onUploadComplete(regionMap.imagePath, regionMap.id);
    } catch (error) {
      console.error("Failed to upload map image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="p-4 bg-muted rounded-full">
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">
            {t("empty-states:map.no_map_registered")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {t("empty-states:map.upload_image_instruction")}
          </p>
        </div>

        <Button
          onClick={handleUpload}
          disabled={isUploading}
          size="lg"
          variant="magical"
          className="animate-glow"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? t("dialogs:upload.loading") : t("dialogs:upload.upload_button")}
        </Button>
      </div>
    </div>
  );
}
