import { Plus, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenCreateModal: () => void;
  onOpenSettingsModal: () => void;
}

export function Header({
  onOpenCreateModal,
  onOpenSettingsModal,
}: HeaderProps) {
  const { t } = useTranslation("home");

  return (
    <div className="relative h-80 overflow-hidden rounded-xl mx-6 mt-6 mb-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/assets/hero-workspace.jpg)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

      <div className="relative h-full flex items-center justify-between px-8">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">
            {t("welcome")}
            <br />
            <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
              {t("creative_universe")}
            </span>
          </h1>
          <p className="text-lg text-gray-200 animate-fade-in-up">
            {t("organize_worlds")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="magical"
            size="lg"
            onClick={onOpenCreateModal}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("create_new_book")}
          </Button>
          <Button variant="outline" size="icon" onClick={onOpenSettingsModal}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
