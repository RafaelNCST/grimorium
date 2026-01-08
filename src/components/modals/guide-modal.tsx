import { useState } from "react";

import {
  BookOpen,
  Users,
  MapPin,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuideSelect: (guideId: string) => void;
}

type GuideCategory =
  | "starting"
  | "characters"
  | "worldbuilding"
  | "magic"
  | "plot"
  | "conflicts";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: GuideCategory;
  icon: React.ReactNode;
}

export function GuideModal({ isOpen, onClose, onGuideSelect }: GuideModalProps) {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");

  // Guias disponíveis (placeholder - depois virá de um store/api)
  const guides: Guide[] = [
    {
      id: "how-to-start",
      title: t("guides.list.how_to_start.title"),
      description: t("guides.list.how_to_start.description"),
      category: "starting",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "creative-block",
      title: t("guides.list.creative_block.title"),
      description: t("guides.list.creative_block.description"),
      category: "starting",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      id: "creating-characters",
      title: t("guides.list.creating_characters.title"),
      description: t("guides.list.creating_characters.description"),
      category: "characters",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "building-world",
      title: t("guides.list.building_world.title"),
      description: t("guides.list.building_world.description"),
      category: "worldbuilding",
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleGuideClick = (guideId: string) => {
    onGuideSelect(guideId); // Notifica o parent sobre o guia selecionado
    onClose(); // Fecha o modal de lista
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[115]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            className="fixed z-[120] bg-background border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col"
            style={{
              top: "3rem",
              right: "1rem",
              width: "800px",
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "calc(100vh - 4rem)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
              <h2 className="text-lg font-semibold text-foreground">
                {t("guides.title")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-border bg-background shrink-0">
              <Input
                type="text"
                placeholder={t("guides.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Guides List */}
            <div
              className="overflow-y-auto bg-background flex-1"
              style={{ maxHeight: "calc(100vh - 12rem)" }}
            >
              {filteredGuides.length > 0 ? (
                <div className="p-4 space-y-3">
                  {filteredGuides.map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() => handleGuideClick(guide.id)}
                      className="w-full text-left group border border-border rounded-lg p-4 transition-all hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          {guide.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-foreground">
                              {guide.title}
                            </h3>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {guide.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    {t("guides.empty")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
