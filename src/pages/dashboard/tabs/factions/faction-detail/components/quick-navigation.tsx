import {
  Info,
  Building2,
  Users,
  Shield,
  Heart,
  Clock,
  Zap,
  BookOpen,
  Handshake,
  Network,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuickNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickNavigation({ isOpen, onClose }: QuickNavigationProps) {
  const { t } = useTranslation("faction-detail");

  const sections = [
    { id: "basic-info", label: t("sections.basic_info"), icon: Info },
    {
      id: "internal-structure",
      label: t("sections.internal_structure"),
      icon: Building2,
    },
    {
      id: "relationships",
      label: t("sections.relationships"),
      icon: Users,
    },
    { id: "alignment", label: t("sections.alignment"), icon: Shield },
    { id: "culture", label: t("sections.culture"), icon: Heart },
    { id: "history", label: t("sections.history"), icon: Clock },
    { id: "power", label: t("sections.power"), icon: Zap },
    { id: "narrative", label: t("sections.narrative"), icon: BookOpen },
    { id: "diplomacy", label: t("sections.diplomacy"), icon: Handshake },
    { id: "hierarchy", label: t("sections.hierarchy"), icon: Network },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <Card
        className={`
        fixed top-20 right-4 bottom-4 w-72 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0 lg:sticky lg:top-24
      `}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t("quick_nav.title")}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => scrollToSection(section.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
