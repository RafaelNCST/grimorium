import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { STORY_RARITIES_CONSTANT } from "../constants/story-rarities";

interface PropsRarityPicker {
  value: string;
  onChange: (value: string) => void;
}

export function RarityPicker({ value, onChange }: PropsRarityPicker) {
  const { t } = useTranslation("create-item");

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{t("modal.story_rarity")}</label>

      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-xs">
          {t("modal.rarity_explanation")}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {STORY_RARITIES_CONSTANT.map((rarity) => {
          const Icon = rarity.icon;
          const isSelected = value === rarity.value;
          return (
            <button
              key={rarity.value}
              type="button"
              onClick={() => onChange(rarity.value)}
              className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${rarity.bgColorClass} border-2 scale-105 shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={`w-5 h-5 ${isSelected ? rarity.color : "text-muted-foreground"}`}
                />
                <span
                  className={`text-sm font-medium ${isSelected ? rarity.color : "text-muted-foreground"}`}
                >
                  {t(rarity.translationKey)}
                </span>
              </div>
              <p
                className={`text-xs ${isSelected ? "text-foreground/80" : "text-muted-foreground/70"}`}
              >
                {t(rarity.descriptionKey)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
