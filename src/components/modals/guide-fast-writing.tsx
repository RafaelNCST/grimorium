import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Zap,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

// Fast Writing Guide Component
export function FastWritingGuide({ t, onClose }: { t: any; onClose: () => void }) {
  const guide = t("guides.content.fast_writing", { returnObjects: true });

  const parseInlineMarkup = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(<\d>|<\/\d>)/);
    return parts.map((part, index) => {
      if (part === '<1>' || part === '</1>') return null;
      if (part === '<3>' || part === '</3>') return null;
      if (index > 0 && parts[index - 1] === '<1>') {
        return <strong key={index} className="text-primary">{part}</strong>;
      }
      if (index > 0 && parts[index - 1] === '<3>') {
        return <strong key={index} className="text-foreground">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Header fixo com botão de fechar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">
              {t("guides.list.fast_writing.title")}
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
          className="w-full h-96 rounded-xl overflow-hidden mb-8 relative flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/write.png')" }}
        >
          {/* Overlay para dar contraste ao texto */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

          <div className="text-center relative z-10">
            <Zap className="h-32 w-32 text-primary mx-auto mb-4 drop-shadow-lg" />
            <p className="text-lg text-foreground font-semibold italic drop-shadow-md">
              {guide.hero_subtitle}
            </p>
          </div>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-foreground mb-6">
            {guide.main_title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {guide.main_subtitle}
          </p>
        </div>

        {/* Introdução */}
        <div className="prose prose-lg max-w-4xl mx-auto mb-16">
          <p className="text-foreground/90 text-lg leading-relaxed text-center">
            {parseInlineMarkup(guide.intro)}
          </p>
        </div>

        {/* Passo 1: Crie Seu Primeiro Arco */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                {guide.step1.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed">
              {guide.step1.description}
            </p>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
                {guide.step1.why_title}
              </h3>
              <p className="text-foreground/80 text-sm">
                {parseInlineMarkup(guide.step1.why_description)}
              </p>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">
                {guide.step1.what_include_title}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step1.what_include.goal}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step1.what_include.conflict}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step1.what_include.outcome}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step1.what_include.key_events}</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm text-foreground/80">
                <strong>💡 Dica:</strong> {guide.step1.tip}
              </p>
            </div>
          </div>
        </div>

        {/* Passo 2: Escreva 10 Capítulos */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                {guide.step2.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed">
              {parseInlineMarkup(guide.step2.description)}
            </p>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-4">
                {guide.step2.features_title}
              </h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step2.features.arc_reference}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step2.features.entity_links}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step2.features.quick_notes}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step2.features.references}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 text-sm">
                {guide.step2.writing_tip_title}
              </h4>
              <p className="text-sm text-foreground/80">
                {parseInlineMarkup(guide.step2.writing_tip)}
              </p>
            </div>
          </div>
        </div>

        {/* Passo 3: Revise */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                {guide.step3.title}
              </h2>
            </div>

            <p className="text-foreground/80 mb-6 leading-relaxed">
              {parseInlineMarkup(guide.step3.description)}
            </p>

            <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">
                {guide.step3.review_checklist_title}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step3.review_checklist.arc_alignment}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step3.review_checklist.consistency}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step3.review_checklist.pacing}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.step3.review_checklist.opportunities}</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-4">
                {guide.step3.after_review_title}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span className="text-foreground/80">{guide.step3.after_review.update_entities}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span className="text-foreground/80">{guide.step3.after_review.create_next_arc}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span className="text-foreground/80">{guide.step3.after_review.fix_inconsistencies}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span className="text-foreground/80">{guide.step3.after_review.note_future_plots}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* O Ciclo */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
              {guide.cycle.title}
            </h2>
            <p className="text-foreground/80 mb-8 text-center leading-relaxed">
              {guide.cycle.description}
            </p>

            {/* Ciclo Visual */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 mb-8">
              <h3 className="font-semibold text-foreground mb-6 text-center">
                {guide.cycle.cycle_visual_title}
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-green-600">1</span>
                    </div>
                    <p className="text-xs font-medium">Arco</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <p className="text-xs font-medium">10 Cap.</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-purple-600">3</span>
                    </div>
                    <p className="text-xs font-medium">Revisar</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">↻ Repita o ciclo</p>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">
                {guide.cycle.benefits_title}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.cycle.benefits.momentum}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.cycle.benefits.organic}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.cycle.benefits.less_planning}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{guide.cycle.benefits.flexibility}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dicas Avançadas */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {guide.tips.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  {guide.tips.tip1_title}
                </h3>
                <p className="text-sm text-foreground/80">{guide.tips.tip1}</p>
              </div>

              <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-6">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                  {guide.tips.tip2_title}
                </h3>
                <p className="text-sm text-foreground/80">
                  {parseInlineMarkup(guide.tips.tip2)}
                </p>
              </div>

              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-6">
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                  {guide.tips.tip3_title}
                </h3>
                <p className="text-sm text-foreground/80">
                  {parseInlineMarkup(guide.tips.tip3)}
                </p>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
                <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">
                  {guide.tips.tip4_title}
                </h3>
                <p className="text-sm text-foreground/80">{guide.tips.tip4}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusão */}
        <div className="mb-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Agora É Hora de Escrever!
            </h2>
            <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Você aprendeu a técnica de escrita rápida e eficiente. Lembre-se: arquitete pouco, escreva muito, e revise a cada 10 capítulos. Boa escrita! 🚀
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
