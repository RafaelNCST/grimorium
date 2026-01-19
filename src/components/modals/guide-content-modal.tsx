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
import { UsingLogsGuide } from "@/components/modals/guide-using-logs";

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
      case "using_logs":
        return <UsingLogsGuide t={t} onClose={onClose} />;
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

        {/* Introdução */}
        <div className="prose prose-lg max-w-4xl mx-auto mb-16">
          <p className="text-foreground/90 text-base lg:text-lg leading-relaxed text-center">
            {parseInlineMarkup(guide.intro)}
          </p>
        </div>

        {/* Basics Section */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpenCheck className="h-6 w-6 lg:h-7 lg:w-7 text-blue-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.basics.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-8 leading-relaxed">
              {guide.basics.description}
            </p>

            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <div className="font-mono text-sm space-y-2">
                {/* Base page */}
                <div className="flex items-start gap-2 text-foreground">
                  <BookOpenCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold">📄 {guide.examples.folder_names.magic_fundamentals}</span>
                  </div>
                </div>

                {/* Fire Spells Folder */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <FolderTree className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="font-semibold">📁 {guide.examples.folder_names.fire_spells}</span>
                  </div>
                  {/* Pages inside folder */}
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-amber-500/30 pl-4">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <span>📄 {guide.examples.folder_names.fireball}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <span>📄 {guide.examples.folder_names.flame_shield}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/60">
                      <span>📄 {guide.examples.folder_names.phoenix}</span>
                    </div>
                  </div>
                </div>

                {/* Healing Spells Folder */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <FolderTree className="h-4 w-4 text-purple-500 shrink-0" />
                    <span className="font-semibold">📁 {guide.examples.folder_names.healing_spells}</span>
                  </div>
                  {/* Pages inside folder */}
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <span>📄 {guide.examples.folder_names.healing_touch}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/60">
                      <span>📄 {guide.examples.folder_names.resurrection}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Include */}
            <div className="mt-8 bg-green-500/5 border border-green-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {guide.basics.strengths_title}
              </h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  <span>{guide.basics.strengths.fundamentals}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  <span>{guide.basics.strengths.energy}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  <span>{guide.basics.strengths.costs}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0 mt-0.5">✓</span>
                  <span>{guide.basics.strengths.rules}</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-green-500/20">
                <p className="text-sm font-semibold text-foreground mb-2">{guide.basics.example_title}</p>
                <p className="text-sm text-foreground/70">{guide.basics.example}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Abilities Section */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 lg:h-7 lg:w-7 text-amber-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.abilities.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-8 leading-relaxed">
              {parseInlineMarkup(guide.abilities.description)}
            </p>

            {/* Smart Organization */}
            <div className="mb-12 bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-4 flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                {guide.abilities.strengths_title}
              </h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                  <span>{guide.abilities.strengths.folders}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                  <span>{guide.abilities.strengths.links}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                  <span>{guide.abilities.strengths.visual}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                  <span>{guide.abilities.strengths.custom}</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-amber-500/20">
                <p className="text-sm font-semibold text-foreground mb-2">{guide.abilities.example_title}</p>
                <p className="text-sm text-foreground/70">{guide.abilities.example}</p>
              </div>
            </div>

            {/* Advanced Concepts */}
            <div className="mb-12 bg-purple-500/5 border border-purple-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5" />
                {guide.advanced.title}
              </h3>
              <p className="text-sm text-foreground/80 mb-4">{guide.advanced.description}</p>
              <div className="mb-4">
                <p className="text-sm font-semibold text-foreground mb-2">{guide.advanced.strengths_title}</p>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 shrink-0 mt-0.5">✓</span>
                    <span>{guide.advanced.strengths.complex}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 shrink-0 mt-0.5">✓</span>
                    <span>{guide.advanced.strengths.rare}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 shrink-0 mt-0.5">✓</span>
                    <span>{guide.advanced.strengths.plot}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 shrink-0 mt-0.5">✓</span>
                    <span>{guide.advanced.strengths.evolution}</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-purple-500/20">
                <p className="text-sm font-semibold text-foreground mb-2">{guide.advanced.example_title}</p>
                <p className="text-sm text-foreground/70">{guide.advanced.example}</p>
              </div>
            </div>

            {/* Organization */}
            <div className="mb-12 bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                {guide.organization.title}
              </h3>
              <div className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">{guide.organization.recommended_title}</p>
                  <div className="space-y-3 mt-3">
                    <div>
                      <p className="text-sm font-semibold text-blue-600">{guide.organization.step1_title}</p>
                      <p className="text-sm text-foreground/70">{parseInlineMarkup(guide.organization.step1_description)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-600">{guide.organization.step2_title}</p>
                      <p className="text-sm text-foreground/70">{parseInlineMarkup(guide.organization.step2_description)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-600">{guide.organization.step3_title}</p>
                      <p className="text-sm text-foreground/70">{parseInlineMarkup(guide.organization.step3_description)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-600">{guide.organization.step4_title}</p>
                      <p className="text-sm text-foreground/70">{parseInlineMarkup(guide.organization.step4_description)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blocks */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Grid3x3 className="h-5 w-5 text-pink-500" />
                {guide.blocks.title}
              </h3>
              <p className="text-sm text-foreground/80 mb-4">{guide.blocks.description}</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">{guide.blocks.text_title}</p>
                  <ul className="space-y-1 text-foreground/70 ml-4">
                    <li>• {guide.blocks.text_blocks.heading}</li>
                    <li>• {guide.blocks.text_blocks.paragraph}</li>
                    <li>• {guide.blocks.text_blocks.lists}</li>
                    <li>• {guide.blocks.text_blocks.tags}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">{guide.blocks.visual_title}</p>
                  <ul className="space-y-1 text-foreground/70 ml-4">
                    <li>• {guide.blocks.visual_blocks.image}</li>
                    <li>• {guide.blocks.visual_blocks.icon}</li>
                    <li>• {guide.blocks.visual_blocks.icon_group}</li>
                    <li>• {guide.blocks.visual_blocks.attributes}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">{guide.blocks.interactive_title}</p>
                  <ul className="space-y-1 text-foreground/70 ml-4">
                    <li>• {guide.blocks.interactive_blocks.dropdown}</li>
                    <li>• {guide.blocks.interactive_blocks.multi}</li>
                    <li>• {guide.blocks.interactive_blocks.navigator}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">{guide.blocks.info_title}</p>
                  <ul className="space-y-1 text-foreground/70 ml-4">
                    <li>• {guide.blocks.info_blocks.informative}</li>
                    <li>• {guide.blocks.info_blocks.stars}</li>
                    <li>• {guide.blocks.info_blocks.divider}</li>
                    <li>• {guide.blocks.info_blocks.spacer}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Structure Overview */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                Example Structure
              </h3>
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <div className="font-mono text-sm space-y-2">
                  {/* Base page */}
                  <div className="flex items-start gap-2 text-foreground">
                    <BookOpenCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-semibold">📄 {guide.examples.folder_names.magic_fundamentals}</span>
                    </div>
                  </div>

                  {/* Fire Spells Folder */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <FolderTree className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="font-semibold">📁 {guide.examples.folder_names.fire_spells}</span>
                    </div>
                    {/* Pages inside folder */}
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-amber-500/30 pl-4">
                      <div className="flex items-center gap-2 text-foreground/80">
                        <span>📄 {guide.examples.folder_names.fireball}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/80">
                        <span>📄 {guide.examples.folder_names.flame_shield}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/60">
                        <span>📄 {guide.examples.folder_names.phoenix}</span>
                      </div>
                    </div>
                  </div>

                  {/* Healing Spells Folder */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-foreground">
                      <FolderTree className="h-4 w-4 text-purple-500 shrink-0" />
                      <span className="font-semibold">📁 {guide.examples.folder_names.healing_spells}</span>
                    </div>
                    {/* Pages inside folder */}
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4">
                      <div className="flex items-center gap-2 text-foreground/80">
                        <span>📄 {guide.examples.folder_names.healing_touch}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/60">
                        <span>📄 {guide.examples.folder_names.resurrection}</span>
                      </div>
                    </div>
                  </div>

                  {/* Advanced page */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 text-foreground">
                      <Crown className="h-4 w-4 text-purple-500 shrink-0" />
                      <span className="font-semibold">📄 {guide.examples.folder_names.ancestral_magic}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Examples */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-blue-500" />
                {guide.examples.page_base_title}
              </h3>

              <p className="text-foreground/80 mb-6 leading-relaxed">
                {guide.examples.page_base_description}
              </p>

              <div className="bg-background border-2 border-border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-sm">{guide.examples.page_base_example_title}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <HeadingBlock
                    block={{
                      id: "base-1",
                      sectionId: "demo",
                      type: "heading",
                      orderIndex: 0,
                      content: { text: guide.examples.page_base_example_heading, level: 2, alignment: "left" },
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
                        text: guide.examples.page_base_example_text
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

            {/* Ability Example */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                {guide.examples.ability_page_title}
              </h3>

              <p className="text-foreground/80 mb-6 leading-relaxed">
                {guide.examples.ability_page_description}
              </p>

              {/* Benefits */}
              <div className="mb-6 bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {guide.examples.ability_benefits_title}
                </h4>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                    <span>{guide.examples.ability_benefits.character_link}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                    <span>{guide.examples.ability_benefits.visual_detail}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                    <span>{guide.examples.ability_benefits.folder_organization}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 shrink-0 mt-0.5">✓</span>
                    <span>{guide.examples.ability_benefits.smart_navigation}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background border-2 border-border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-sm">{guide.examples.ability_example_title}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <HeadingBlock
                    block={{
                      ...mockBlocks.heading,
                      content: { text: guide.examples.ability_example_heading, level: 2, alignment: "left" },
                    }}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />

                  <ParagraphBlock
                    block={{
                      ...mockBlocks.paragraph,
                      content: {
                        text: guide.examples.ability_example_text,
                      },
                    }}
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
                    block={{
                      ...mockBlocks.tags,
                      content: { tags: guide.examples.ability_example_tags },
                    }}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />

                  <NavigatorBlock
                    block={{
                      ...mockBlocks.navigator,
                      content: {
                        linkedPageId: "fake-page-id",
                        title: guide.examples.ability_example_navigator,
                      },
                    }}
                    isEditMode={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                    pages={[{ id: "fake-page-id", name: guide.examples.ability_example_navigator.replace("Ver também: ", "").replace("See also: ", ""), systemId: "demo", orderIndex: 0, createdAt: Date.now(), updatedAt: Date.now() }]}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Section */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ChevronRight className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.examples.navigation_title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed">
              {guide.examples.navigation_description}
            </p>

            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">{guide.examples.navigation_example_title}</h3>
              <NavigatorBlock
                block={{
                  id: "demo-nav",
                  sectionId: "demo",
                  type: "navigator",
                  orderIndex: 0,
                  content: {
                    linkedPageId: "escudo-chamas-id",
                    title: guide.examples.navigation_example_text,
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
                    name: guide.examples.navigation_example_text.replace("Ver também: ", "").replace("See also: ", ""),
                    systemId: "demo",
                    orderIndex: 0,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  },
                ]}
              />
              <p className="text-xs text-muted-foreground mt-3">
                {guide.examples.navigation_tip}
              </p>
            </div>
          </div>
        </div>

        {/* Character Linking Section */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.examples.character_linking_title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed">
              {guide.examples.character_linking_description}
            </p>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground/80 mb-3">
                <strong>{guide.examples.character_linking_difference_title}</strong>
              </p>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 shrink-0 mt-0.5">📄</span>
                  <span>{guide.examples.character_linking_difference.page}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 shrink-0 mt-0.5">📑</span>
                  <span>{guide.examples.character_linking_difference.section}</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">{guide.examples.character_profile_title}</h3>
              <PowerLinkCard
                link={{
                  id: "demo-link-1",
                  characterId: "arkan-id",
                  pageId: "bola-fogo-id",
                  customLabel: "",
                  createdAt: new Date().toISOString(),
                }}
                pageTitle={guide.examples.ability_example_title}
                sectionTitle=""
                isEditing={false}
                onClick={() => {}}
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {guide.examples.customizing_label_title}
              </h4>
              <p className="text-foreground/80 text-sm mb-4">
                {guide.examples.customizing_label_description}
              </p>

              <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2 mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-blue-200">
                    <strong className="text-blue-100">{guide.examples.customizing_label_how_title}</strong> {guide.examples.customizing_label_how_description}
                  </div>
                </div>

                <div className="bg-background border border-border rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{guide.examples.customizing_label_menu}</span>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-md border-2 border-red-500 animate-pulse pointer-events-none" style={{ margin: '-4px' }} />
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-blue-300 mb-4">{guide.examples.customizing_label_edit_tip}</p>

                <div className="space-y-3">
                  <p className="text-xs text-blue-200 font-semibold">{guide.examples.customizing_label_edit_mode}</p>
                  <div className="border border-purple-500/30 bg-purple-950/40 rounded-lg p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-purple-100 font-medium text-lg truncate">{guide.examples.ability_example_title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
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
                  <p className="text-xs text-blue-300">{guide.examples.customizing_label_edit_power_tip}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">{guide.examples.customizing_label_without}</p>
                  <PowerLinkCard
                    link={{
                      id: "demo-link-1b",
                      characterId: "arkan-id",
                      pageId: "bola-fogo-id",
                      customLabel: "",
                      createdAt: new Date().toISOString(),
                    }}
                    pageTitle={guide.examples.ability_example_title}
                    sectionTitle=""
                    isEditing={false}
                    onClick={() => {}}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">{guide.examples.customizing_label_with}</p>
                  <PowerLinkCard
                    link={{
                      id: "demo-link-2",
                      characterId: "arkan-id",
                      pageId: "bola-fogo-id",
                      customLabel: t("common:guides.content.power_system.examples.customizing_label_with").includes("Magia Principal") ? "Magia Principal" : "Main Magic",
                      createdAt: new Date().toISOString(),
                    }}
                    pageTitle={guide.examples.ability_example_title}
                    sectionTitle=""
                    isEditing={false}
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="mb-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
                <CheckCircle2 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {guide.examples.conclusion_title}
            </h2>
            <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              {guide.examples.conclusion_description}
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
