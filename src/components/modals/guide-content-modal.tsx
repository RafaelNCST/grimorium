import {
  X,
  TreeDeciduous,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Compass,
  Wand2,
  Zap,
  Crown,
  FolderTree,
  Grid3x3,
  BookOpenCheck,
  Layers,
  Users,
  ChevronRight,
  Trash2,
  Edit,
  Edit2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  HeadingBlock,
  ParagraphBlock,
  AttributesBlock,
  InformativeBlock,
  IconGroupBlock,
  DropdownBlock,
  TagListBlock,
  NumberedListBlock,
  StarsBlock,
  NavigatorBlock,
} from "@/pages/dashboard/tabs/power-system/components/blocks";
import { PowerLinkCard } from "@/pages/dashboard/tabs/power-system/components/power-link-card";
import type { IPowerBlock, IPowerCharacterLink } from "@/pages/dashboard/tabs/power-system/types/power-system-types";
import { FastWritingGuide } from "@/components/modals/guide-fast-writing";

interface GuideContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideId: string;
}

export function GuideContentModal({
  isOpen,
  onClose,
  guideId,
}: GuideContentModalProps) {
  const { t } = useTranslation("common");

  if (!isOpen) return null;

  // Seleciona o conteúdo do guia baseado no ID
  const renderGuideContent = () => {
    switch (guideId) {
      case "how-to-start":
        return <HowToStartGuide t={t} onClose={onClose} />;
      case "power_system":
        return <PowerSystemGuide t={t} onClose={onClose} />;
      case "fast_writing":
        return <FastWritingGuide t={t} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-8 left-0 right-0 bottom-0 z-[150] bg-background overflow-y-auto">
      {renderGuideContent()}
    </div>
  );
}

// Componente para o guia "How to Start"
function HowToStartGuide({ t, onClose }: { t: any; onClose: () => void }) {
  const guide = t("guides.content.how_to_start", { returnObjects: true }) as any;

  return (
    <>
      {/* Header fixo com botão de fechar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">
              {t("guides.list.how_to_start.title")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container max-w-[1800px] mx-auto px-6 py-12">
        {/* Hero Image */}
        <div
          className="w-full h-72 lg:h-96 rounded-xl overflow-hidden mb-8 relative flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/jararq.png')" }}
        >
          {/* Overlay para dar contraste ao texto */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

          <div className="text-center relative z-10">
            <Compass className="h-24 w-24 lg:h-32 lg:w-32 text-primary mx-auto mb-4 drop-shadow-lg" />
            <p className="text-base lg:text-lg text-foreground font-semibold italic drop-shadow-md">
              {guide.hero_subtitle}
            </p>
          </div>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 lg:mb-6">
            {guide.main_title}
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {guide.main_subtitle}
          </p>
        </div>

        {/* Introdução */}
        <div className="prose prose-lg max-w-4xl mx-auto mb-16">
          <p className="text-foreground/90 text-base lg:text-lg leading-relaxed text-center">
            {guide.intro.split("<1>")[0]}
            <strong>{guide.intro.split("<1>")[1].split("</1>")[0]}</strong>
            {guide.intro.split("</1>")[1].split("<3>")[0]}
            <strong>{guide.intro.split("<3>")[1].split("</3>")[0]}</strong>
            {guide.intro.split("</3>")[1]}
          </p>
        </div>

        {/* Seções Jardineiro e Arquiteto lado a lado */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Seção: Jardineiro */}
          <div>
            <div className="flex items-center gap-3 lg:gap-4 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <TreeDeciduous className="h-6 w-6 lg:h-7 lg:w-7 text-green-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.gardener.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-8 leading-relaxed text-sm lg:text-base">
              {guide.gardener.description}
            </p>

            {/* Características */}
            <div className="space-y-6 mb-8">
              {/* Pontos Positivos */}
              <div className="border border-green-500/20 bg-green-500/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-foreground">
                    {guide.gardener.strengths_title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.gardener.strengths.spontaneous}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.gardener.strengths.organic}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.gardener.strengths.discovery}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.gardener.strengths.flexibility}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Desafios */}
              <div className="border border-orange-500/20 bg-orange-500/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-foreground">
                    {guide.gardener.challenges_title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.gardener.challenges.consistency}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.gardener.challenges.lost}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.gardener.challenges.revisions}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.gardener.challenges.plot_holes}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Como começar - Jardineiro */}
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TreeDeciduous className="h-5 w-5 text-green-600" />
                {guide.gardener.how_to_start_title}
              </h4>
              <div className="space-y-2 text-sm text-foreground/80">
                <p>
                  ✍️ <strong>{guide.gardener.how_to_start.write}</strong>
                </p>
                <p>
                  👤 <strong>{guide.gardener.how_to_start.characters}</strong>
                </p>
                <p>
                  📝 <strong>{guide.gardener.how_to_start.annotations}</strong>
                </p>
                <p>
                  🗺️ <strong>{guide.gardener.how_to_start.dashboard}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Seção: Arquiteto */}
          <div>
            <div className="flex items-center gap-3 lg:gap-4 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 lg:h-7 lg:w-7 text-blue-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.architect.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-8 leading-relaxed text-sm lg:text-base">
              {guide.architect.description}
            </p>

            {/* Características */}
            <div className="space-y-6 mb-8">
              {/* Pontos Positivos */}
              <div className="border border-blue-500/20 bg-blue-500/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-foreground">
                    {guide.architect.strengths_title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.architect.strengths.control}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.architect.strengths.foreshadowing}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.architect.strengths.plot_holes}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.architect.strengths.structure}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Desafios */}
              <div className="border border-orange-500/20 bg-orange-500/5 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-foreground">
                    {guide.architect.challenges_title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.architect.challenges.paralysis}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.architect.challenges.rigidity}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.architect.challenges.time}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">
                      {guide.architect.challenges.artificial}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Como começar - Arquiteto */}
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                {guide.architect.how_to_start_title}
              </h4>
              <div className="space-y-2 text-sm text-foreground/80">
                <p>
                  📋 <strong>{guide.architect.how_to_start.premise}</strong>
                </p>
                <p>
                  👥 <strong>{guide.architect.how_to_start.characters}</strong>
                </p>
                <p>
                  🗺️ <strong>{guide.architect.how_to_start.world}</strong>
                </p>
                <p>
                  📊 <strong>{guide.architect.how_to_start.plot}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Equilíbrio */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 lg:h-12 lg:w-12 text-purple-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 text-center">
              {guide.balance.title}
            </h2>
            <p className="text-foreground/80 text-base lg:text-lg max-w-3xl mx-auto leading-relaxed mb-8 text-center">
              {guide.balance.description.split("<1>")[0]}
              <strong>
                {guide.balance.description.split("<1>")[1].split("</1>")[0]}
              </strong>
              {guide.balance.description.split("</1>")[1]}
            </p>

            {/* Abordagem Recomendada */}
            <div className="bg-background/50 rounded-lg p-6 lg:p-8 border border-purple-500/30 mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2 justify-center">
                <Compass className="h-5 w-5 text-purple-600" />
                {guide.balance.recommended_title}
              </h3>
              <div className="space-y-4 text-left max-w-2xl mx-auto">
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-foreground/90 leading-relaxed">
                      <strong className="text-green-600">
                        {guide.balance.step1_title}
                      </strong>{" "}
                      {guide.balance.step1_description.split("<1>")[0]}
                      <strong>
                        {
                          guide.balance.step1_description
                            .split("<1>")[1]
                            .split("</1>")[0]
                        }
                      </strong>
                      {guide.balance.step1_description.split("</1>")[1].split("<3>")[0]}
                      <strong>
                        {
                          guide.balance.step1_description
                            .split("<3>")[1]
                            .split("</3>")[0]
                        }
                      </strong>
                      {guide.balance.step1_description.split("</3>")[1]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-foreground/90 leading-relaxed">
                      <strong className="text-blue-600">
                        {guide.balance.step2_title}
                      </strong>{" "}
                      {guide.balance.step2_description.split("<1>")[0]}
                      <strong>
                        {
                          guide.balance.step2_description
                            .split("<1>")[1]
                            .split("</1>")[0]
                        }
                      </strong>
                      {guide.balance.step2_description.split("</1>")[1]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-foreground/90 leading-relaxed">
                      <strong className="text-purple-600">
                        {guide.balance.step3_title}
                      </strong>{" "}
                      {guide.balance.step3_description.split("<1>")[0]}
                      <strong>
                        {
                          guide.balance.step3_description
                            .split("<1>")[1]
                            .split("</1>")[0]
                        }
                      </strong>
                      {guide.balance.step3_description.split("</1>")[1]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <p className="text-foreground/90 leading-relaxed">
                      <strong className="text-green-600">
                        {guide.balance.step4_title}
                      </strong>{" "}
                      {guide.balance.step4_description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Componente para o guia "Power System"
function PowerSystemGuide({ t, onClose }: { t: any; onClose: () => void }) {
  const guide = t("guides.content.power_system", { returnObjects: true }) as any;

  // Helper para parsear inline markup <1></1> para bold
  const parseInlineMarkup = (text: string) => {
    const parts = text.split(/(<\d>|<\/\d>)/);
    let isBold = false;
    return parts.map((part, index) => {
      if (part.match(/<\d>/)) {
        isBold = true;
        return null;
      } else if (part.match(/<\/\d>/)) {
        isBold = false;
        return null;
      } else if (isBold) {
        return <strong key={index}>{part}</strong>;
      } else {
        return part;
      }
    });
  };

  // Mock blocks data for visual examples
  const mockBlocks: Record<string, IPowerBlock> = {
    heading: {
      id: "demo-heading",
      sectionId: "demo",
      type: "heading",
      orderIndex: 0,
      content: { text: "Descrição", level: 2, alignment: "left" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    paragraph: {
      id: "demo-paragraph",
      sectionId: "demo",
      type: "paragraph",
      orderIndex: 1,
      content: {
        text: "A Bola de Fogo é uma das magias elementais mais básicas e essenciais do arsenal de qualquer mago de fogo. Consiste em conjurar uma esfera flamejante que pode ser arremessada contra inimigos.",
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    attributes: {
      id: "demo-attributes",
      sectionId: "demo",
      type: "attributes",
      orderIndex: 2,
      content: { max: 10, current: 7, color: "red" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    informative: {
      id: "demo-informative",
      sectionId: "demo",
      type: "informative",
      orderIndex: 3,
      content: {
        icon: "info" as const,
        text: "Para iniciantes, é recomendado praticar com alvos estáticos antes de tentar acertar inimigos em movimento.",
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    iconGroup: {
      id: "demo-icon-group",
      sectionId: "demo",
      type: "icon-group",
      orderIndex: 4,
      content: {
        icons: [
          {
            id: "icon-1",
            title: "Dano Direto",
            description: "Causa dano imediato ao alvo",
          },
          {
            id: "icon-2",
            title: "Queimadura",
            description: "Pode causar efeito contínuo",
          },
        ],
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    dropdown: {
      id: "demo-dropdown",
      sectionId: "demo",
      type: "dropdown",
      orderIndex: 5,
      content: {
        dataSource: "manual" as const,
        options: ["Arkan, o Piromante", "Lyra, a Curandeira"],
        selectedValue: "Arkan, o Piromante",
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    tags: {
      id: "demo-tags",
      sectionId: "demo",
      type: "tag-list",
      orderIndex: 6,
      content: { tags: ["Fogo", "Ataque", "À Distância"] },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    numberedList: {
      id: "demo-numbered-list",
      sectionId: "demo",
      type: "numbered-list",
      orderIndex: 7,
      content: {
        items: [
          { id: "1", text: "Concentre-se na fonte de mana interna" },
          { id: "2", text: "Visualize o elemento fogo em sua mente" },
          { id: "3", text: "Canalize a energia através das mãos" },
          { id: "4", text: "Projete a esfera flamejante para o alvo" },
        ],
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    stars: {
      id: "demo-stars",
      sectionId: "demo",
      type: "stars",
      orderIndex: 8,
      content: { rating: 3, size: "medium" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    navigator: {
      id: "demo-navigator",
      sectionId: "demo",
      type: "navigator",
      orderIndex: 9,
      content: {
        linkedPageId: "fake-page-id",
        title: "Ver também: Escudo de Chamas",
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };

  return (
    <>
      {/* Header fixo com botão de fechar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">
              {t("guides.list.power_system.title")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container max-w-[1800px] mx-auto px-6 py-12">
        {/* Hero Image */}
        <div
          className="w-full h-72 lg:h-96 rounded-xl overflow-hidden mb-8 relative flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/magic.png')" }}
        >
          {/* Overlay para dar contraste ao texto */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

          <div className="text-center relative z-10">
            <Wand2 className="h-24 w-24 lg:h-32 lg:w-32 text-primary mx-auto mb-4 drop-shadow-lg" />
            <p className="text-base lg:text-lg text-foreground font-semibold italic drop-shadow-md">
              {guide.hero_subtitle}
            </p>
          </div>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 lg:mb-6">
            {guide.main_title}
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {guide.main_subtitle}
          </p>
        </div>

        {/* Introdução - O que vamos criar */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <Wand2 className="h-16 w-16 lg:h-20 lg:w-20 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Exemplo Prático: Sistema de Magia Elemental
              </h2>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-foreground/90 text-sm lg:text-base leading-relaxed text-center">
                  <strong>⚠️ Importante:</strong> Este guia demonstra como organizar e trabalhar com um sistema de poder <strong>após tê-lo criado</strong> na aba "Sistema de Poder". Certifique-se de criar seu sistema primeiro!
                </p>
              </div>
              <p className="text-foreground/90 text-base lg:text-lg leading-relaxed text-center">
                Neste guia, vamos explorar <strong>passo a passo</strong> como estruturar um sistema de magia completo. Você aprenderá a organizar páginas, criar habilidades detalhadas, linkar aos personagens e navegar entre páginas. Vamos usar como exemplo um <strong>Sistema de Magia Elemental</strong> com fogo, cura e muito mais!
              </p>
            </div>
          </div>
        </div>

        {/* Passo 1: Estrutura de Organização */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Passo 1: Estrutura de Organização
              </h2>
            </div>

            <p className="text-foreground/80 mb-8 leading-relaxed">
              Primeiro, vamos organizar nosso sistema. Começamos com uma <strong>página base</strong> para conceitos gerais, depois criamos <strong>pastas</strong> para agrupar habilidades similares.
            </p>

            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <div className="font-mono text-sm space-y-2">
                {/* Página base */}
                <div className="flex items-start gap-2 text-foreground">
                  <BookOpenCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold">📄 Fundamentos da Magia</span>
                    <span className="text-xs text-muted-foreground ml-2">(Página base com conceitos gerais)</span>
                  </div>
                </div>

                {/* Pasta: Magias de Fogo */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <FolderTree className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="font-semibold">📁 Magias de Fogo</span>
                  </div>
                  {/* Páginas dentro da pasta */}
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-amber-500/30 pl-4">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <span>📄 Bola de Fogo</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <span>📄 Escudo de Chamas</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/60">
                      <span>📄 Fênix</span>
                    </div>
                  </div>
                </div>

                {/* Pasta: Magias de Cura */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <FolderTree className="h-4 w-4 text-purple-500 shrink-0" />
                    <span className="font-semibold">📁 Magias de Cura</span>
                  </div>
                  {/* Páginas dentro da pasta */}
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <span>📄 Toque Restaurador</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/60">
                      <span>📄 Ressurreição</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dicas de Organização */}
            <div className="mt-8 bg-green-500/5 border border-green-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Dicas de Organização
              </h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  <span><strong>Crie uma página base</strong> com conceitos gerais antes de criar habilidades específicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  <span><strong>Organize por categorias</strong> usando pastas (ex: Fogo, Água, Cura, Ataque)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  <span><strong>Uma página por habilidade</strong> permite detalhamento completo e links aos personagens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  <span><strong>Use navegadores</strong> para conectar páginas relacionadas formando uma wiki interativa</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Passo 2: Como seria cada página */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Passo 2: Como Seria Cada Página
              </h2>
            </div>

            <p className="text-foreground/80 mb-8 leading-relaxed">
              Agora vamos ver como cada tipo de página fica na prática. Vamos explorar desde páginas base com conceitos gerais até habilidades específicas com todos os detalhes.
            </p>

            {/* Blocos Disponíveis */}
            <div className="mb-12 bg-pink-500/5 border border-pink-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-pink-700 dark:text-pink-300 mb-4 flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                Blocos Disponíveis para Construir suas Páginas
              </h3>
              <p className="text-sm text-foreground/80 mb-4">
                Você tem <strong>16 tipos de blocos</strong> para criar páginas visuais e organizadas:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">📝 Texto & Organização:</p>
                  <ul className="space-y-1 text-foreground/70 ml-4">
                    <li>• Cabeçalhos (5 níveis)</li>
                    <li>• Parágrafos</li>
                    <li>• Listas (ordenadas e não-ordenadas)</li>
                    <li>• Tags para categorização</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">🎨 Visual & Mídia:</p>
                  <ul className="space-y-1 text-foreground/70 ml-4">
                    <li>• Imagens com editor</li>
                    <li>• Ícones circulares</li>
                    <li>• Grupos de ícones</li>
                    <li>• Barras de atributos</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">🔗 Dados & Links:</p>
                  <ul className="space-y-1 text-foreground/70 ml-4">
                    <li>• Dropdowns (personagens/itens)</li>
                    <li>• Seleção múltipla</li>
                    <li>• Navegadores entre páginas</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">ℹ️ Informação:</p>
                  <ul className="space-y-1 text-foreground/70 ml-4">
                    <li>• Blocos informativos destacados</li>
                    <li>• Avaliação com estrelas</li>
                    <li>• Divisores e espaçadores</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exemplo de Estrutura de Páginas */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                Visão Geral da Organização
              </h3>
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <div className="font-mono text-sm space-y-2">
                  {/* Página base */}
                  <div className="flex items-start gap-2 text-foreground">
                    <BookOpenCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-semibold">📄 Fundamentos da Magia</span>
                      <span className="text-xs text-muted-foreground ml-2">(Página base com conceitos gerais)</span>
                    </div>
                  </div>

                  {/* Pasta: Magias de Fogo */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <FolderTree className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="font-semibold">📁 Magias de Fogo</span>
                    </div>
                    {/* Páginas dentro da pasta */}
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-amber-500/30 pl-4">
                      <div className="flex items-center gap-2 text-foreground/80">
                        <span>📄 Bola de Fogo</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/80">
                        <span>📄 Escudo de Chamas</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/60">
                        <span>📄 Fênix</span>
                      </div>
                    </div>
                  </div>

                  {/* Pasta: Magias de Cura */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-foreground">
                      <FolderTree className="h-4 w-4 text-purple-500 shrink-0" />
                      <span className="font-semibold">📁 Magias de Cura</span>
                    </div>
                    {/* Páginas dentro da pasta */}
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4">
                      <div className="flex items-center gap-2 text-foreground/80">
                        <span>📄 Toque Restaurador</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/60">
                        <span>📄 Ressurreição</span>
                      </div>
                    </div>
                  </div>

                  {/* Página avançada */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-foreground">
                      <Crown className="h-4 w-4 text-purple-500 shrink-0" />
                      <span className="font-semibold">📄 Magia Ancestral (Avançado)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Página Base */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-blue-500" />
                2.1 Página Base - "Fundamentos da Magia"
              </h3>

              <p className="text-foreground/80 mb-6 leading-relaxed">
                A página base contém <strong>conceitos gerais</strong> do sistema. Use blocos simples para explicar regras universais, custos de energia, etc.
              </p>

              <div className="bg-background border-2 border-border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-sm">Fundamentos da Magia</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <HeadingBlock
                    block={{
                      id: "base-1",
                      sectionId: "demo",
                      type: "heading",
                      orderIndex: 0,
                      content: { text: "O que é Magia?", level: 2, alignment: "left" },
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                    }}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />
                  <ParagraphBlock
                    block={{
                      id: "base-2",
                      sectionId: "demo",
                      type: "paragraph",
                      orderIndex: 1,
                      content: {
                        text: "Magia é a capacidade de manipular energia elemental do mundo ao seu redor. Cada mago precisa de mana para conjurar feitiços."
                      },
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                    }}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              </div>
            </div>

            {/* Habilidade Individual Completa */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                2.2 Habilidade Individual - "Bola de Fogo"
              </h3>

              <p className="text-foreground/80 mb-6 leading-relaxed">
                Agora criamos uma habilidade específica dentro da pasta "Magias de Fogo". Aqui você pode usar <strong>todos os tipos de blocos</strong> para detalhar a habilidade: descrição, atributos de poder, usuários, tags, e mais!
              </p>

              {/* Benefícios de Habilidades Específicas */}
              <div className="mb-6 bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Por que criar páginas para cada habilidade?
                </h4>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                    <span><strong>Link direto aos personagens:</strong> Conecte automaticamente a habilidade ao perfil do personagem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                    <span><strong>Detalhamento visual:</strong> Use barras de atributos, ícones e imagens para explicar visualmente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                    <span><strong>Organização por pastas:</strong> Agrupe por elemento, tipo ou raridade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                    <span><strong>Navegação inteligente:</strong> Crie links entre habilidades relacionadas</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background border-2 border-border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-sm">Bola de Fogo</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <HeadingBlock
                    block={mockBlocks.heading}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />

                  <ParagraphBlock
                    block={mockBlocks.paragraph}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />

                  <AttributesBlock
                    block={mockBlocks.attributes}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />

                  <TagListBlock
                    block={mockBlocks.tags}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />

                  <NavigatorBlock
                    block={mockBlocks.navigator}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                    pages={[{ id: "fake-page-id", name: "Escudo de Chamas", systemId: "demo", orderIndex: 0, createdAt: Date.now(), updatedAt: Date.now() }]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passo 3: Navegação Entre Páginas */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Passo 3: Navegação Entre Páginas
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed">
              Use o bloco <strong>Navigator</strong> para criar links entre páginas relacionadas. Por exemplo, ao final da página "Bola de Fogo", você pode linkar para "Escudo de Chamas" (outra magia de fogo).
            </p>

            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Exemplo de Navigator em ação:</h3>
              <NavigatorBlock
                block={{
                  id: "demo-nav",
                  sectionId: "demo",
                  type: "navigator",
                  orderIndex: 0,
                  content: {
                    linkedPageId: "escudo-chamas-id",
                    title: "Ver também: Escudo de Chamas",
                  },
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                }}
                isEditMode={false}
                onUpdate={() => {}}
                onDelete={() => {}}
                pages={[
                  {
                    id: "escudo-chamas-id",
                    name: "Escudo de Chamas",
                    systemId: "demo",
                    orderIndex: 0,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  },
                ]}
              />
              <p className="text-xs text-muted-foreground mt-3">
                💡 Ao clicar, o usuário é levado direto para a página "Escudo de Chamas"
              </p>
            </div>
          </div>
        </div>

        {/* Passo 4: Linkando ao Personagem */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Passo 4: Linkando ao Personagem
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed">
              Você pode linkar <strong>páginas inteiras</strong> ou <strong>seções específicas</strong> do seu sistema de poder aos personagens! Quando você faz isso, o link aparece automaticamente no <strong>perfil do personagem</strong>, facilitando a navegação.
            </p>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground/80 mb-3">
                <strong>💡 Diferença entre Página e Seção:</strong>
              </p>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 shrink-0 mt-0.5">📄</span>
                  <span><strong>Página inteira:</strong> Ao clicar na etiqueta, abre toda a página "Bola de Fogo". O nome padrão será "Bola de Fogo".</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 shrink-0 mt-0.5">📑</span>
                  <span><strong>Seção específica:</strong> Ao clicar, abre apenas aquela seção (ex: só a "Descrição"). O nome padrão será o nome da seção, independente de quantas seções a página tem.</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Como fica no perfil do personagem:</h3>
              <PowerLinkCard
                link={{
                  id: "demo-link-1",
                  characterId: "arkan-id",
                  pageId: "bola-fogo-id",
                  customLabel: "",
                  createdAt: new Date().toISOString(),
                }}
                pageTitle="Bola de Fogo"
                sectionTitle=""
                isEditing={false}
                onClick={() => {}}
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Personalizando a Etiqueta
              </h4>
              <p className="text-foreground/80 text-sm mb-4">
                Você pode dar uma <strong>etiqueta customizada</strong> para deixar mais claro. Por exemplo, em vez de aparecer "Bola de Fogo", pode aparecer "Magia Principal" ou "Especialidade em Fogo".
              </p>

              <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-blue-200">
                    <strong className="text-blue-100">Como editar a etiqueta:</strong> Clique no botão de <strong>editar</strong> no canto superior direito da página do personagem:
                  </div>
                </div>

                {/* Header com botões */}
                <div className="bg-background border border-border rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Menu superior da página</span>
                    <div className="flex items-center gap-2">
                      {/* Botão Editar - DESTACADO */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-md border-2 border-red-500 animate-pulse pointer-events-none" style={{ margin: '-4px' }} />
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Botão Excluir */}
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-blue-300 mb-4">↑ Clique no botão de lápis (circulado em vermelho) para entrar em modo de edição</p>

                {/* Card do poder em modo de edição */}
                <div className="space-y-3">
                  <p className="text-xs text-blue-200 font-semibold">Após entrar em modo de edição, os poderes linkados terão botões de editar e excluir:</p>
                  <div className="border border-purple-500/30 bg-purple-950/40 rounded-lg p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-purple-100 font-medium text-lg truncate">Bola de Fogo</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Botão Edit - DESTACADO */}
                        <div className="relative">
                          <div className="absolute inset-0 rounded-md border-2 border-red-500 animate-pulse pointer-events-none" style={{ margin: '-3px' }} />
                          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-300">↑ Clique no ícone de lápis (circulado em vermelho) ao lado do poder para editar sua etiqueta customizada</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Sem etiqueta customizada:</p>
                  <PowerLinkCard
                    link={{
                      id: "demo-link-1b",
                      characterId: "arkan-id",
                      pageId: "bola-fogo-id",
                      customLabel: "",
                      createdAt: new Date().toISOString(),
                    }}
                    pageTitle="Bola de Fogo"
                    sectionTitle=""
                    isEditing={false}
                    onClick={() => {}}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Com etiqueta customizada "Magia Principal":</p>
                  <PowerLinkCard
                    link={{
                      id: "demo-link-2",
                      characterId: "arkan-id",
                      pageId: "bola-fogo-id",
                      customLabel: "Magia Principal",
                      createdAt: new Date().toISOString(),
                    }}
                    pageTitle="Bola de Fogo"
                    sectionTitle=""
                    isEditing={false}
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusão */}
        <div className="mb-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
                <CheckCircle2 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Pronto! Seu Sistema Está Completo
            </h2>
            <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Agora você sabe como criar sistemas de poder completos: organizar páginas em pastas, detalhar habilidades com blocos diversos, linkar aos personagens e navegar entre páginas. Use sua criatividade para criar sistemas incríveis! ✨
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
