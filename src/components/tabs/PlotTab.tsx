import { useState } from "react";
import { Plus, Target, Clock, CheckCircle2, Circle, Edit2, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

interface PlotArc {
  id: string;
  name: string;
  size: 'pequeno' | 'médio' | 'grande';
  focus: string;
  description: string;
  events: PlotEvent[];
  progress: number;
  isCurrentArc: boolean;
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
    id: "1",
    name: "A Ascensão do Herói",
    size: "grande",
    focus: "Desenvolvimento do protagonista",
    description: "O jovem pastor descobre seus poderes e aprende a controlá-los enquanto enfrenta os primeiros desafios.",
    progress: 65,
    isCurrentArc: true,
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
    isCurrentArc: false,
    events: [
      { id: "5", name: "Chamado à guerra", description: "O reino pede ajuda ao protagonista", completed: false, order: 1 },
      { id: "6", name: "Formação da aliança", description: "Reúne heróis para a batalha final", completed: false, order: 2 },
    ]
  },
  {
    id: "3",
    name: "O Preço da Vitória", 
    size: "médio",
    focus: "Resolução e consequências",
    description: "As consequências da guerra e o estabelecimento de uma nova ordem.",
    progress: 0,
    isCurrentArc: false,
    events: []
  }
];

export function PlotTab() {
  const { t } = useLanguage();
  const [arcs, setArcs] = useState<PlotArc[]>(mockArcs);
  const [selectedArc, setSelectedArc] = useState<PlotArc | null>(null);

  const toggleEventCompletion = (arcId: string, eventId: string) => {
    setArcs(prev => prev.map(arc => {
      if (arc.id === arcId) {
        const updatedEvents = arc.events.map(event => 
          event.id === eventId ? { ...event, completed: !event.completed } : event
        );
        const completedCount = updatedEvents.filter(e => e.completed).length;
        const progress = updatedEvents.length > 0 ? (completedCount / updatedEvents.length) * 100 : 0;
        
        return { ...arc, events: updatedEvents, progress };
      }
      return arc;
    }));
  };

  const setCurrentArc = (arcId: string) => {
    setArcs(prev => prev.map(arc => ({
      ...arc,
      isCurrentArc: arc.id === arcId
    })));
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'pequeno': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'médio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'grande': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-muted';
    }
  };

  const getVisibleEvents = (events: PlotEvent[]) => {
    const sortedEvents = events.sort((a, b) => a.order - b.order);
    const currentIndex = sortedEvents.findIndex(e => !e.completed);
    
    if (currentIndex === -1) {
      // All completed, show last 3
      return sortedEvents.slice(-3);
    }
    
    // Show current + next 2
    return sortedEvents.slice(currentIndex, currentIndex + 3);
  };

  if (selectedArc) {
    // Detailed arc view
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedArc(null)}>
            ← Voltar aos arcos
          </Button>
          <h2 className="text-2xl font-bold">{selectedArc.name}</h2>
          {selectedArc.isCurrentArc && (
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              <Star className="w-3 h-3 mr-1" />
              Arco Atual
            </Badge>
          )}
        </div>

        {/* Arc Details */}
        <Card className="card-magical">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Detalhes do Arco</CardTitle>
                <CardDescription>{selectedArc.description}</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tamanho</label>
                <Badge className={`mt-1 ${getSizeColor(selectedArc.size)}`}>
                  {selectedArc.size}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Foco</label>
                <p className="mt-1">{selectedArc.focus}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Progresso</span>
                <span className="text-sm text-muted-foreground">{selectedArc.progress.toFixed(0)}%</span>
              </div>
              <Progress value={selectedArc.progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Events Chain */}
        <Card className="card-magical">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cadeia de Eventos</CardTitle>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Evento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedArc.events.map((event, index) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <button
                    onClick={() => toggleEventCompletion(selectedArc.id, event.id)}
                    className="mt-1 text-primary hover:text-primary-glow transition-colors"
                  >
                    {event.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-muted-foreground">
                        #{event.order}
                      </span>
                      <h4 className={`font-medium ${event.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {event.name}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  </div>

                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Arc listing view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Arcos Narrativos</h2>
          <p className="text-muted-foreground">Gerencie a estrutura da sua história</p>
        </div>
        <Button className="btn-magical">
          <Plus className="w-4 h-4 mr-2" />
          Criar Arco
        </Button>
      </div>

      {/* Arc Cards */}
      <div className="grid gap-6">
        {arcs.map((arc) => (
          <Card 
            key={arc.id} 
            className="card-magical cursor-pointer"
            onClick={() => setSelectedArc(arc)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {arc.name}
                    {arc.isCurrentArc && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                        <Star className="w-3 h-3 mr-1" />
                        Atual
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {arc.description}
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getSizeColor(arc.size)}>
                    {arc.size}
                  </Badge>
                  {!arc.isCurrentArc && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentArc(arc.id);
                      }}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Definir como Atual
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progresso</span>
                    <span className="text-sm text-muted-foreground">{arc.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={arc.progress} className="h-2" />
                </div>

                {arc.events.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Próximos Eventos
                    </h4>
                    <div className="space-y-2">
                      {getVisibleEvents(arc.events).map((event) => (
                        <div key={event.id} className="flex items-center gap-2 text-sm">
                          {event.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className={event.completed ? 'line-through text-muted-foreground' : ''}>
                            {event.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}