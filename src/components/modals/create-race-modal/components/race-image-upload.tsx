import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PropsRaceImageUpload {
  image: string;
  onImageChange: (image: string) => void;
}

export function RaceImageUpload({
  image,
  onImageChange,
}: PropsRaceImageUpload) {
  const { t } = useTranslation("create-race");

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
    <div className="w-full">
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        id="race-image-upload"
      />
      <label htmlFor="race-image-upload" className="cursor-pointer group block">
        <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          {image ? (
            <div className="relative w-full h-full group">
              <img
                src={image}
                alt="Race preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm text-center px-4">
                  {t("modal.change_image")}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Users className="w-20 h-20 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground text-center px-4">
                {t("modal.upload_image")}
              </p>
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
