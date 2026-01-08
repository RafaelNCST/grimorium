import {
  X,
  TreeDeciduous,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Compass,
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

  // Por enquanto, apenas o guia "how-to-start" tem conteúdo
  if (guideId !== "how-to-start") {
    return null;
  }

  const guide = t("guides.content.how_to_start", { returnObjects: true }) as any;

  return (
    <div className="fixed top-8 left-0 right-0 bottom-0 z-[150] bg-background overflow-y-auto">
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
    </div>
  );
}
