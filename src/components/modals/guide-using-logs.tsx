import {
  ScrollText,
  Anchor,
  BookOpen,
  Eye,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Link2,
  GripVertical,
  Users,
  X,
  FileText,
  Trash2,
  Image,
  Edit2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

// Using Logs Guide Component
export function UsingLogsGuide({ t, onClose }: { t: any; onClose: () => void }) {
  const guide = t("guides.content.using_logs", { returnObjects: true });

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
            <ScrollText className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">
              {t("guides.list.using_logs.title")}
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
          style={{ backgroundImage: "url('/assets/log.png')" }}
        >
          {/* Overlay para dar contraste ao texto */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

          <div className="text-center relative z-10">
            <ScrollText className="h-32 w-32 text-primary mx-auto mb-4 drop-shadow-lg" />
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

        {/* Tipos de Registro */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
              {guide.types.title}
            </h2>
            <p className="text-foreground/80 mb-8 text-center leading-relaxed">
              {guide.types.description}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Hook */}
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Anchor className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300">
                    {guide.types.hook.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground/80">
                  {guide.types.hook.description}
                </p>
              </div>

              {/* Lore */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                    {guide.types.lore.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground/80">
                  {guide.types.lore.description}
                </p>
              </div>

              {/* Foreshadowing */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-amber-700 dark:text-amber-300">
                    {guide.types.foreshadowing.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground/80">
                  {guide.types.foreshadowing.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registros Globais */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <ScrollText className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                {guide.global_logs.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {guide.global_logs.subtitle}
            </p>
            <p className="text-foreground/80 mb-6 leading-relaxed">
              {parseInlineMarkup(guide.global_logs.description)}
            </p>

            {/* Exemplo Visual - Dashboard Header */}
            <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-3">Onde encontrar no Dashboard:</p>
              <div className="bg-background border border-border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Botão Capítulos */}
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                      <FileText className="h-5 w-5" />
                      <span>Capítulos</span>
                    </button>
                    {/* Botão Deletar */}
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-destructive hover:bg-red-500/20 hover:text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                    {/* Botão Registros Globais - DESTACADO */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-md border-2 border-red-500 animate-pulse pointer-events-none" style={{ margin: '-4px' }} />
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                        <ScrollText className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Botão Galeria */}
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <Image className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-4">
                {guide.global_logs.features_title}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.global_logs.features.create}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Link2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.global_logs.features.link}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Search className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.global_logs.features.search}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Filter className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.global_logs.features.filter}</span>
                </li>
                <li className="flex items-start gap-2">
                  <GripVertical className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.global_logs.features.reorder}</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
              <p className="text-sm text-foreground/80">
                <strong>💡 {guide.global_logs.use_case_title}</strong> {guide.global_logs.use_case}
              </p>
            </div>
          </div>
        </div>

        {/* Registros Locais */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                {guide.local_logs.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {guide.local_logs.subtitle}
            </p>
            <p className="text-foreground/80 mb-6 leading-relaxed">
              {parseInlineMarkup(guide.local_logs.description)}
            </p>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
                {guide.local_logs.example_title}
              </h3>
              <p className="text-sm text-foreground/80">
                {guide.local_logs.example_description}
              </p>
            </div>

            {/* Exemplo Visual - Header de Entidade */}
            <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-3">Onde encontrar nos detalhes de uma entidade:</p>
              <div className="bg-background border border-border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Menu superior da página de detalhes de uma entidade</span>
                  <div className="flex items-center gap-2">
                    {/* Botão Editar */}
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {/* Botão Deletar */}
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {/* Botão Logs - DESTACADO */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-md border-2 border-red-500 animate-pulse pointer-events-none" style={{ margin: '-4px' }} />
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                        <ScrollText className="h-4 w-4" />
                      </button>
                    </div>
                    {/* Botão Registros Globais */}
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">
                {guide.local_logs.features_title}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.local_logs.features.view}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.local_logs.features.create}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.local_logs.features.edit}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.local_logs.features.delete}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.local_logs.features.reorder}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-foreground/80 text-sm">{guide.local_logs.features.access_global}</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm text-foreground/80">
                <strong>{guide.local_logs.restriction_title}</strong> {guide.local_logs.restriction}
              </p>
            </div>
          </div>
        </div>

        {/* Fluxo de Trabalho */}
        <div className="mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {guide.workflow.title}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-green-600">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {guide.workflow.step1.title}
                </h3>
                <p className="text-sm text-foreground/80">
                  {guide.workflow.step1.description}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {guide.workflow.step2.title}
                </h3>
                <p className="text-sm text-foreground/80">
                  {guide.workflow.step2.description}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {guide.workflow.step3.title}
                </h3>
                <p className="text-sm text-foreground/80">
                  {guide.workflow.step3.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dicas de Uso */}
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
                  {guide.tips.tip3}
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
                <ScrollText className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Comece a Registrar Agora!
            </h2>
            <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Use o sistema de registros para nunca mais esquecer detalhes importantes da sua história. Organize eventos, mudanças e marcos para consulta rápida! 📝
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
