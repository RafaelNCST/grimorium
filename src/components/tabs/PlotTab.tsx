import { useState } from "react";
import { Plus, Target, Clock, CheckCircle2, Circle, Edit2, Trash2, Star, GitBranch, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { CreatePlotArcModal } from "@/components/modals/CreatePlotArcModal";

interface PlotArc {
  id: string;
  name: string;
  size: 'pequeno' | 'médio' | 'grande';
  focus: string;
  description: string;
  events: PlotEvent[];
  progress: number;
  status: 'planejamento' | 'andamento' | 'finalizado';
  order: number;
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
    status: "andamento",
    order: 1,
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
    order: 2,
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
    progress: 100,
    status: "finalizado",
    order: 0,
    events: []
  }
];

export function PlotTab() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [arcs, setArcs] = useState<PlotArc[]>(mockArcs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Status priority for sorting: andamento > planejamento > finalizado
  const getStatusPriority = (status: string) => {
    switch (status) {
      case 'andamento': return 1;
      case 'planejamento': return 2;
      case 'finalizado': return 3;
      default: return 4;
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'pequeno': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'médio': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'grande': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalizado': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'andamento': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'planejamento': return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      default: return 'bg-muted';
    }
  };

  const createArc = (arcData: Omit<PlotArc, 'id' | 'events' | 'progress'>) => {
    const newArc: PlotArc = {
      ...arcData,
      id: Date.now().toString(),
      events: [],
      progress: 0
    };

    setArcs(prev => {
      // Adjust orders of existing arcs if needed
      const updatedArcs = prev.map(arc => {
        if (arc.order >= newArc.order) {
          return { ...arc, order: arc.order + 1 };
        }
        return arc;
      });
      
      return [...updatedArcs, newArc].sort((a, b) => a.order - b.order);
    });
  };

  const moveArc = (arcId: string, direction: 'up' | 'down') => {
    setArcs(prev => {
      const sortedArcs = [...prev].sort((a, b) => a.order - b.order);
      const arcIndex = sortedArcs.findIndex(arc => arc.id === arcId);
      
      if (arcIndex === -1) return prev;
      
      const targetIndex = direction === 'up' ? arcIndex - 1 : arcIndex + 1;
      
      if (targetIndex < 0 || targetIndex >= sortedArcs.length) return prev;
      
      // Swap orders
      const currentArc = sortedArcs[arcIndex];
      const targetArc = sortedArcs[targetIndex];
      
      return prev.map(arc => {
        if (arc.id === currentArc.id) {
          return { ...arc, order: targetArc.order };
        }
        if (arc.id === targetArc.id) {
          return { ...arc, order: currentArc.order };
        }
        return arc;
      });
    });
  };

  // Sort arcs by status priority first, then by order
  const filteredAndSortedArcs = arcs
    .filter(arc => statusFilter === "todos" || arc.status === statusFilter)
    .sort((a, b) => {
      // First sort by status priority
      const statusPriorityA = getStatusPriority(a.status);
      const statusPriorityB = getStatusPriority(b.status);
      
      if (statusPriorityA !== statusPriorityB) {
        return statusPriorityA - statusPriorityB;
      }
      
      // If same status, sort by order
      return a.order - b.order;
    });

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

  // Arc listing view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Arcos Narrativos</h2>
          <p className="text-muted-foreground">Gerencie a estrutura da sua história</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="andamento">Em andamento</SelectItem>
              <SelectItem value="planejamento">Em planejamento</SelectItem>
              <SelectItem value="finalizado">Finalizados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => navigate('/plot-timeline')}>
            <GitBranch className="w-4 h-4 mr-2" />
            Árvore Visual
          </Button>
          <Button className="btn-magical" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Arco
          </Button>
        </div>
      </div>

      {/* Arc Cards */}
      <div className="grid gap-6">
        {filteredAndSortedArcs.map((arc, index) => (
          <Card 
            key={arc.id} 
            className="card-magical cursor-pointer"
            onClick={() => navigate(`/plot-arc/${arc.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {arc.name}
                    <Badge className={getStatusColor(arc.status)}>
                      {arc.status === 'andamento' && <Star className="w-3 h-3 mr-1" />}
                      {arc.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {arc.description}
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getSizeColor(arc.size)}>
                    {arc.size}
                  </Badge>
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveArc(arc.id, 'up');
                      }}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveArc(arc.id, 'down');
                      }}
                      disabled={index === filteredAndSortedArcs.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
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

      <CreatePlotArcModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateArc={createArc}
        existingArcs={arcs}
      />
    </div>
  );
}