import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlotArc {
  id: string;
  name: string;
  size: 'pequeno' | 'médio' | 'grande';
  focus: string;
  description: string;
  events: PlotEvent[];
  progress: number;
  status: 'planejamento' | 'andamento' | 'finalizado';
}

interface PlotEvent {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

// Mock data
const mockArcs: PlotArc[] = [
  {
    id: "3",
    name: "O Preço da Vitória", 
    size: "médio",
    focus: "Resolução e consequências",
    description: "As consequências da guerra e o estabelecimento de uma nova ordem.",
    progress: 100,
    status: "finalizado",
    events: [
      { id: "7", name: "Reconstrução do reino", description: "Início da reconstrução", completed: true, order: 1 },
      { id: "8", name: "Nova liderança", description: "Estabelecimento de nova ordem", completed: true, order: 2 },
    ]
  },
  {
    id: "1",
    name: "A Ascensão do Herói",
    size: "grande",
    focus: "Desenvolvimento do protagonista",
    description: "O jovem pastor descobre seus poderes e aprende a controlá-los enquanto enfrenta os primeiros desafios.",
    progress: 65,
    status: "andamento",
    events: [
      { id: "1", name: "Descoberta dos poderes", description: "O protagonista manifesta sua magia pela primeira vez", completed: true, order: 1 },
      { id: "2", name: "Encontro com o mentor", description: "Conhece o sábio que o guiará", completed: true, order: 2 },
      { id: "3", name: "Primeiro desafio", description: "Enfrenta seu primeiro inimigo real", completed: false, order: 3 },
      { id: "4", name: "Revelação sobre o passado", description: "Descobre a verdade sobre sua origem", completed: false, order: 4 },
    ]
  },
  {
    id: "2", 
    name: "A Guerra das Sombras",
    size: "grande",
    focus: "Conflito principal",
    description: "O protagonista lidera uma guerra contra as forças das trevas que ameaçam consumir o reino.",
    progress: 0,
    status: "planejamento",
    events: [
      { id: "5", name: "Chamado à guerra", description: "O reino pede ajuda ao protagonista", completed: false, order: 1 },
      { id: "6", name: "Formação da aliança", description: "Reúne heróis para a batalha final", completed: false, order: 2 },
    ]
  }
];

export function PlotTimeline() {
  const navigate = useNavigate();
  const [arcs] = useState<PlotArc[]>(mockArcs);

  const finishedArcs = arcs.filter(arc => arc.status === 'finalizado');
  const currentArc = arcs.find(arc => arc.status === 'andamento');
  const plannedArcs = arcs.filter(arc => arc.status === 'planejamento');

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'pequeno': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'médio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'grande': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-muted';
    }
  };

  const ArcCard = ({ arc, position }: { arc: PlotArc; position: 'left' | 'center' | 'right' }) => {
    const baseClasses = "cursor-pointer transition-all duration-300 hover:scale-105";
    const positionClasses = {
      left: "opacity-75 scale-90",
      center: "scale-110 z-10",
      right: "opacity-75 scale-90"
    };

    return (
      <Card 
        className={`card-magical ${baseClasses} ${positionClasses[position]}`}
        onClick={() => navigate(`/plot-arc/${arc.id}`)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {arc.status === 'finalizado' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
            {arc.status === 'andamento' && <Target className="w-5 h-5 text-blue-400" />}
            {arc.status === 'planejamento' && <Clock className="w-5 h-5 text-orange-400" />}
            {arc.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {arc.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Badge className={getSizeColor(arc.size)}>
              {arc.size}
            </Badge>
            <span className="text-sm font-medium">
              {arc.progress.toFixed(0)}%
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Árvore Visual dos Arcos</h1>
          </div>
          <p className="text-muted-foreground">
            Visualização cronológica dos arcos narrativos da sua história
          </p>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Timeline visualization */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-orange-400 transform -translate-y-1/2 z-0"></div>

          {/* Timeline content */}
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {/* Finished Arcs */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Finalizados</h3>
                <p className="text-sm text-muted-foreground">Arcos já concluídos</p>
              </div>
              {finishedArcs.map((arc, index) => (
                <div key={arc.id} className={index > 0 ? 'mt-4' : ''}>
                  <ArcCard arc={arc} position="left" />
                </div>
              ))}
            </div>

            {/* Current Arc */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Em Andamento</h3>
                <p className="text-sm text-muted-foreground">Arco atual da história</p>
              </div>
              {currentArc && (
                <ArcCard arc={currentArc} position="center" />
              )}
            </div>

            {/* Planned Arcs */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Em Planejamento</h3>
                <p className="text-sm text-muted-foreground">Próximos arcos</p>
              </div>
              {plannedArcs.map((arc, index) => (
                <div key={arc.id} className={index > 0 ? 'mt-4' : ''}>
                  <ArcCard arc={arc} position="right" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-12 bg-card rounded-lg p-6 border border-border">
          <h4 className="font-semibold mb-4">Legenda</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Arcos finalizados aparecem à esquerda</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>O arco em andamento fica destacado no centro</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Arcos em planejamento aparecem à direita</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}