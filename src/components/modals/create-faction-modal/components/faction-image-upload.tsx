import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PropsFactionImageUpload {
  image: string;
  onImageChange: (image: string) => void;
}

export function FactionImageUpload({
  image,
  onImageChange,
}: PropsFactionImageUpload) {
  const { t } = useTranslation("create-faction");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        id="faction-image-upload"
      />
      <label htmlFor="faction-image-upload" className="cursor-pointer group">
        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          {image ? (
            <div className="relative w-full h-full group">
              <img
                src={image}
                alt="Faction symbol preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs text-center px-2">
                  {t("modal.change_image")}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Shield className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground text-center px-3">
                {t("modal.upload_image")}
              </p>
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
