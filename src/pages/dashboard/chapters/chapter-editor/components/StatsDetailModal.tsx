/**
 * Modal de Detalhes das Estatísticas
 *
 * Exibe informações detalhadas e explicadas sobre todas as métricas do capítulo.
 */

import {
  Type,
  FileText,
  AlignLeft,
  List,
  MessageCircle,
  Clock,
  BookOpen,
  FileType,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { ChapterMetrics } from "../types/metrics";

interface StatsDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics: ChapterMetrics;
}

export function StatsDetailModal({
  open,
  onOpenChange,
  metrics,
}: StatsDetailModalProps) {
  const formatSessionTime = (minutes: number): string => {
    if (minutes < 1) return "menos de 1 minuto";
    if (minutes < 60) return `${minutes} minuto${minutes > 1 ? "s" : ""}`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) return `${hours} hora${hours > 1 ? "s" : ""}`;
    return `${hours} hora${hours > 1 ? "s" : ""} e ${mins} minuto${mins > 1 ? "s" : ""}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Estatísticas do Capítulo
            </DialogTitle>
            <DialogDescription>
              Visão detalhada de todas as métricas de escrita
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 pb-6 overflow-y-auto flex-1">
          {/* Métricas Básicas */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Métricas Básicas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={Type}
                label="Palavras"
                value={metrics.wordCount.toLocaleString()}
                description="Total de palavras escritas no capítulo"
              />
              <MetricCard
                icon={FileText}
                label="Caracteres"
                value={metrics.characterCount.toLocaleString()}
                description="Caracteres sem espaços"
              />
              <MetricCard
                icon={FileText}
                label="Caracteres (com espaços)"
                value={metrics.characterCountWithSpaces.toLocaleString()}
                description="Contagem incluindo espaços"
              />
              <MetricCard
                icon={BookOpen}
                label="Páginas Estimadas"
                value={metrics.estimatedPages.toString()}
                description="Baseado em 250 palavras por página"
              />
            </div>
          </div>

          <Separator />

          {/* Estrutura do Texto */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Estrutura do Texto
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={AlignLeft}
                label="Parágrafos"
                value={metrics.paragraphCount.toLocaleString()}
                description="Total de parágrafos no capítulo"
              />
              <MetricCard
                icon={List}
                label="Sentenças"
                value={metrics.sentenceCount.toLocaleString()}
                description="Frases terminadas em . ! ?"
              />
              <MetricCard
                icon={MessageCircle}
                label="Diálogos/Falas"
                value={metrics.dialogueCount.toLocaleString()}
                description="Estimativa de falas (aspas e travessões)"
              />
              <MetricCard
                icon={Type}
                label="Palavras por Sentença"
                value={metrics.averageWordsPerSentence.toString()}
                description="Média que indica complexidade do texto"
              />
            </div>
          </div>

          <Separator />

          {/* Tempo e Leitura */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Tempo e Leitura
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                icon={Clock}
                label="Tempo de Sessão"
                value={formatSessionTime(metrics.sessionDuration)}
                description="Tempo total na sessão atual de escrita"
              />
              <MetricCard
                icon={FileType}
                label="Tempo de Leitura"
                value={`~${metrics.estimatedReadingTime} min`}
                description="Tempo estimado para ler o capítulo (225 ppm)"
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-background rounded-b-lg">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  description: string;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold mb-1">{value}</p>
          <p className="text-xs text-muted-foreground leading-tight">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
