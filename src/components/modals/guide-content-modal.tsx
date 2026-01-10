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
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

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

        {/* Seção: Conceitos Básicos */}
        <div className="mb-16">
          <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 lg:gap-4 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpenCheck className="h-6 w-6 lg:h-7 lg:w-7 text-blue-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.basics.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed text-sm lg:text-base">
              {guide.basics.description}
            </p>

            <div className="bg-background/50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                {guide.basics.strengths_title}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.basics.strengths.fundamentals}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.basics.strengths.energy}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.basics.strengths.costs}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.basics.strengths.rules}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">
                💡 {guide.basics.example_title}
              </h4>
              <p className="text-sm text-foreground/80">{guide.basics.example}</p>
            </div>
          </div>
        </div>

        {/* Seção: Habilidades Específicas */}
        <div className="mb-16">
          <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 lg:gap-4 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 lg:h-7 lg:w-7 text-amber-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.abilities.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed text-sm lg:text-base">
              {parseInlineMarkup(guide.abilities.description)}
            </p>

            <div className="bg-background/50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-600" />
                {guide.abilities.strengths_title}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.abilities.strengths.folders}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.abilities.strengths.links}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.abilities.strengths.visual}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.abilities.strengths.custom}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-300 mb-2">
                💡 {guide.abilities.example_title}
              </h4>
              <p className="text-sm text-foreground/80">{guide.abilities.example}</p>
            </div>
          </div>
        </div>

        {/* Seção: Conceitos Avançados */}
        <div className="mb-16">
          <div className="border border-purple-500/20 bg-purple-500/5 rounded-xl p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 lg:gap-4 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Crown className="h-6 w-6 lg:h-7 lg:w-7 text-purple-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.advanced.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed text-sm lg:text-base">
              {guide.advanced.description}
            </p>

            <div className="bg-background/50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-600" />
                {guide.advanced.strengths_title}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.advanced.strengths.complex}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.advanced.strengths.rare}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.advanced.strengths.plot}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">
                    {guide.advanced.strengths.evolution}
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-purple-700 dark:text-purple-300 mb-2">
                💡 {guide.advanced.example_title}
              </h4>
              <p className="text-sm text-foreground/80">{guide.advanced.example}</p>
            </div>
          </div>
        </div>

        {/* Seção: Como Organizar (4 passos) */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 lg:gap-4 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <FolderTree className="h-6 w-6 lg:h-7 lg:w-7 text-green-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.organization.title}
              </h2>
            </div>

            <div className="bg-background/50 rounded-lg p-6 lg:p-8 border border-green-500/30">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Compass className="h-5 w-5 text-green-600" />
                {guide.organization.recommended_title}
              </h3>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-lg">
                    1
                  </div>
                  <div>
                    <p className="text-foreground/90 leading-relaxed text-sm lg:text-base">
                      <strong className="text-green-600">
                        {guide.organization.step1_title}
                      </strong>{" "}
                      {parseInlineMarkup(guide.organization.step1_description)}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-lg">
                    2
                  </div>
                  <div>
                    <p className="text-foreground/90 leading-relaxed text-sm lg:text-base">
                      <strong className="text-green-600">
                        {guide.organization.step2_title}
                      </strong>{" "}
                      {parseInlineMarkup(guide.organization.step2_description)}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-lg">
                    3
                  </div>
                  <div>
                    <p className="text-foreground/90 leading-relaxed text-sm lg:text-base">
                      <strong className="text-green-600">
                        {guide.organization.step3_title}
                      </strong>{" "}
                      {parseInlineMarkup(guide.organization.step3_description)}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-lg">
                    4
                  </div>
                  <div>
                    <p className="text-foreground/90 leading-relaxed text-sm lg:text-base">
                      <strong className="text-green-600">
                        {guide.organization.step4_title}
                      </strong>{" "}
                      {parseInlineMarkup(guide.organization.step4_description)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Blocos (16 tipos) */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 lg:gap-4 mb-6">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-pink-500/10 flex items-center justify-center">
                <Grid3x3 className="h-6 w-6 lg:h-7 lg:w-7 text-pink-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {guide.blocks.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-8 leading-relaxed text-sm lg:text-base">
              {guide.blocks.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Texto & Organização */}
              <div className="bg-background/50 rounded-lg p-6 border border-pink-500/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-pink-600" />
                  {guide.blocks.text_title}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.text_blocks.heading}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.text_blocks.paragraph}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.text_blocks.lists}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.text_blocks.tags}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Dados & Links */}
              <div className="bg-background/50 rounded-lg p-6 border border-pink-500/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-pink-600" />
                  {guide.blocks.interactive_title}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.interactive_blocks.dropdown}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.interactive_blocks.multi}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.interactive_blocks.navigator}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Visual & Mídia */}
              <div className="bg-background/50 rounded-lg p-6 border border-pink-500/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-pink-600" />
                  {guide.blocks.visual_title}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.visual_blocks.image}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.visual_blocks.icon}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.visual_blocks.icon_group}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.visual_blocks.attributes}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Informação */}
              <div className="bg-background/50 rounded-lg p-6 border border-pink-500/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-pink-600" />
                  {guide.blocks.info_title}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.info_blocks.informative}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.info_blocks.stars}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.info_blocks.divider}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 shrink-0">•</span>
                    <span className="text-foreground/80">
                      {guide.blocks.info_blocks.spacer}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Exemplos Visuais de Organização */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8 text-center">
              Exemplos Visuais
            </h2>

            {/* Exemplo de Estrutura de Páginas */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                Como Organizar as Páginas
              </h3>
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <div className="font-mono text-sm space-y-1">
                  <div className="flex items-center gap-2 text-foreground">
                    <BookOpenCheck className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold">📄 Fundamentos da Magia</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground ml-6">
                    <BookOpenCheck className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold">📄 Leis Universais</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground mt-3">
                    <FolderTree className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold">📁 Magias de Fogo</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground ml-6">
                    <span>📄 Bola de Fogo</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">→ Arkan</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground ml-6">
                    <span>📄 Escudo de Chamas</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">→ Arkan</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground ml-6">
                    <span>📄 Fênix</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground mt-3">
                    <FolderTree className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold">📁 Magias de Cura</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground ml-6">
                    <span>📄 Toque Restaurador</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">→ Lyra</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground ml-6">
                    <span>📄 Ressurreição</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground mt-3">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold">📄 Magia Ancestral (Avançado)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemplos Visuais de Blocos */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Grid3x3 className="h-5 w-5 text-primary" />
                Como os Blocos Ficam
              </h3>

              <div className="space-y-6">
                {/* Exemplo de Página Completa */}
                <div className="bg-background border-2 border-border rounded-lg overflow-hidden">
                  {/* Header da página simulada */}
                  <div className="bg-muted/50 px-6 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span className="font-semibold text-sm">Bola de Fogo</span>
                    </div>
                  </div>

                  {/* Conteúdo da página simulada */}
                  <div className="p-6 space-y-6">
                    {/* Heading */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1 font-mono">Bloco: Heading H2</div>
                      <h2 className="text-2xl font-bold text-foreground">Descrição</h2>
                    </div>

                    {/* Paragraph */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1 font-mono">Bloco: Paragraph</div>
                      <p className="text-foreground/80 leading-relaxed">
                        A Bola de Fogo é uma das magias elementais mais básicas e essenciais do arsenal de qualquer mago de fogo. Consiste em conjurar uma esfera flamejante que pode ser arremessada contra inimigos.
                      </p>
                    </div>

                    {/* Attributes (stats bars) */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-mono">Bloco: Attributes</div>
                      <div className="space-y-3 bg-muted/30 rounded-lg p-4 border border-border">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground/80">Poder</span>
                            <span className="text-foreground font-semibold">75%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: "75%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground/80">Custo de Mana</span>
                            <span className="text-foreground font-semibold">40%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground/80">Dificuldade</span>
                            <span className="text-foreground font-semibold">30%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informative Block */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-mono">Bloco: Informative (Info)</div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Dica</h4>
                            <p className="text-sm text-foreground/80">
                              Para iniciantes, é recomendado praticar com alvos estáticos antes de tentar acertar inimigos em movimento.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Icon Group */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-mono">Bloco: Icon Group</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg border border-border">
                          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                            <Zap className="h-6 w-6 text-red-500" />
                          </div>
                          <span className="font-semibold text-sm">Dano Direto</span>
                          <span className="text-xs text-muted-foreground mt-1">Causa dano imediato ao alvo</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg border border-border">
                          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                            <Sparkles className="h-6 w-6 text-orange-500" />
                          </div>
                          <span className="font-semibold text-sm">Queimadura</span>
                          <span className="text-xs text-muted-foreground mt-1">Pode causar efeito contínuo</span>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown (character link) */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-mono">Bloco: Dropdown (Link para Personagem)</div>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border">
                        <label className="text-sm text-foreground/80 block mb-2">Usuário desta habilidade</label>
                        <div className="bg-background border border-border rounded-md px-3 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <Users className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm font-medium">Arkan, o Piromante</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-mono">Bloco: Tags</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-medium border border-red-500/20">
                          Fogo
                        </span>
                        <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium border border-orange-500/20">
                          Ataque
                        </span>
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/20">
                          À Distância
                        </span>
                      </div>
                    </div>

                    {/* List */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-mono">Bloco: List (Ordered)</div>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border">
                        <h4 className="font-semibold text-sm mb-3">Passos para Conjurar:</h4>
                        <ol className="space-y-2 list-decimal list-inside text-sm text-foreground/80">
                          <li>Concentre-se na fonte de mana interna</li>
                          <li>Visualize o elemento fogo em sua mente</li>
                          <li>Canalize a energia através das mãos</li>
                          <li>Projete a esfera flamejante para o alvo</li>
                        </ol>
                      </div>
                    </div>

                    {/* Stars Rating */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-mono">Bloco: Stars (Rating)</div>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground/80">Nível de Perigo</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Sparkles
                                key={star}
                                className={`h-5 w-5 ${star <= 3 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigator */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-mono">Bloco: Navigator (Link para outra página)</div>
                      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-foreground">Ver também: Escudo de Chamas</div>
                              <div className="text-xs text-muted-foreground">Técnica defensiva de fogo</div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
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
