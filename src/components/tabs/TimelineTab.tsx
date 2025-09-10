import { useState } from "react";
import { Plus, Edit2, Clock, Calendar, ChevronDown, ChevronRight, GripVertical, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface TimelineEvent {
  id: string;
  name: string;
  description: string;
  storyTopics: string[];
  characters: string[];
  organizations: string[];
  periodId: string;
}

interface TimelinePeriod {
  id: string;
  name: string;
  description: string;
  startReason: string;
  endReason: string;
  eraId: string;
  events: TimelineEvent[];
}

interface TimelineEra {
  id: string;
  name: string;
  color: string;
  time: string;
  description: string;
  periods: TimelinePeriod[];
}

const mockTimeline: TimelineEra[] = [
  {
    id: "era1",
    name: "Era das Trevas",
    color: "hsl(240, 20%, 20%)",
    time: "Ano 0 - 1000",
    description: "Período sombrio marcado pela Grande Ruptura e o domínio das forças das trevas.",
    periods: [
      {
        id: "period1",
        name: "A Grande Ruptura",
        description: "Evento cataclísmico que dividiu o mundo entre luz e trevas.",
        startReason: "Ritual sombrio realizado por antigos magos",
        endReason: "Formação das primeiras resistências organizadas",
        eraId: "era1",
        events: [
          {
            id: "event1",
            name: "A Ruptura Dimensional",
            description: "O evento que mudou tudo para sempre.",
            storyTopics: [
              "Ritual sombrio executado por magos corrompidos",
              "Abertura de portais dimensionais",
              "Invasão de criaturas das trevas",
              "Colapso dos antigos reinos"
            ],
            characters: ["Arquimago Vorthak", "Rainha Seraphina", "General Marcus"],
            organizations: ["Conselho dos Magos", "Reino de Lumina", "Guarda Real"],
            periodId: "period1"
          }
        ]
      },
      {
        id: "period2", 
        name: "Formação das Ordens",
        description: "Surgimento das primeiras organizações para combater as trevas.",
        startReason: "Necessidade de resistência organizada",
        endReason: "Estabelecimento de territórios seguros",
        eraId: "era1",
        events: [
          {
            id: "event2",
            name: "Fundação da Ordem dos Guardiões",
            description: "Criação da ordem militar dedicada a combater as trevas.",
            storyTopics: [
              "Reunião dos últimos cavaleiros sobreviventes",
              "Juramento sagrado de proteção",
              "Estabelecimento da Cidadela da Luz",
              "Primeiros recrutas treinados"
            ],
            characters: ["Primeiro Guardião Supremo", "Sir Aldric", "Mestra Elena"],
            organizations: ["Ordem dos Guardiões", "Sobreviventes de Lumina"],
            periodId: "period2"
          }
        ]
      }
    ]
  },
  {
    id: "era2",
    name: "Era Atual",
    color: "hsl(263, 70%, 50%)",
    time: "Ano 1001 - Presente",
    description: "Era de renovação e esperança, marcada pelo surgimento de novos heróis.",
    periods: [
      {
        id: "period3",
        name: "O Despertar dos Heróis",
        description: "Período em que novos heróis surgem para enfrentar antigas ameaças.",
        startReason: "Ressurgimento das forças sombrias",
        endReason: "Ainda em desenvolvimento",
        eraId: "era2",
        events: [
          {
            id: "event3",
            name: "Nascimento de Aelric Valorheart",
            description: "Nascimento do futuro herói destinado a restaurar o equilíbrio.",
            storyTopics: [
              "Nascimento durante eclipse lunar",
              "Profecia revelada pelos antigos",
              "Sinais mágicos no céu",
              "Bênção dos espíritos da luz"
            ],
            characters: ["Aelric Valorheart", "Mãe Valorheart", "Sábio Aldwin"],
            organizations: ["Aldeia dos Pastores", "Ordem dos Guardiões"],
            periodId: "period3"
          },
          {
            id: "event4",
            name: "Descoberta dos Poderes",
            description: "Aelric descobre seus poderes mágicos ancestrais durante ataque à aldeia.",
            storyTopics: [
              "Ataque de criaturas sombrias",
              "Despertar espontâneo dos poderes",
              "Intervenção de Lyara Moonwhisper",
              "Primeira manifestação da luz interior"
            ],
            characters: ["Aelric Valorheart", "Lyara Moonwhisper", "Aldeões"],
            organizations: ["Culto das Sombras", "Ordem dos Guardiões"],
            periodId: "period3"
          }
        ]
      }
    ]
  }
];

export function TimelineTab() {
  const { t } = useLanguage();
  const [expandedEras, setExpandedEras] = useState<Set<string>>(new Set(["era2"]));
  const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(new Set(["period3"]));
  const [draggedItem, setDraggedItem] = useState<{ type: string; id: string } | null>(null);

  const toggleEra = (eraId: string) => {
    const newExpanded = new Set(expandedEras);
    if (newExpanded.has(eraId)) {
      newExpanded.delete(eraId);
    } else {
      newExpanded.add(eraId);
    }
    setExpandedEras(newExpanded);
  };

  const togglePeriod = (periodId: string) => {
    const newExpanded = new Set(expandedPeriods);
    if (newExpanded.has(periodId)) {
      newExpanded.delete(periodId);
    } else {
      newExpanded.add(periodId);
    }
    setExpandedPeriods(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, type: string, id: string) => {
    setDraggedItem({ type, id });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetType: string, targetId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Here you would implement the actual reordering logic
    console.log(`Moving ${draggedItem.type} ${draggedItem.id} to ${targetType} ${targetId}`);
    setDraggedItem(null);
  };

  const EventModal = ({ event }: { event: TimelineEvent }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 text-left">
          <div className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="h-2 w-2 bg-accent rounded-full flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h5 className="font-medium text-sm">{event.name}</h5>
              <p className="text-xs text-muted-foreground line-clamp-1">{event.description}</p>
              <div className="flex gap-2 mt-1">
                {event.characters.slice(0, 3).map((char, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {char}
                  </Badge>
                ))}
                {event.characters.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{event.characters.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Story Topics */}
          <div>
            <h4 className="font-medium mb-3">História do Evento</h4>
            <ul className="space-y-2">
              {event.storyTopics.map((topic, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1 flex-shrink-0">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Characters */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Personagens Envolvidos
              </h4>
              <div className="space-y-2">
                {event.characters.map((character, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {character.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm">{character}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizations */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Organizações
              </h4>
              <div className="space-y-2">
                {event.organizations.map((org, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <div className="h-6 w-6 bg-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {org.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm">{org}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Linha do Tempo</h2>
          <p className="text-muted-foreground">Organize os eventos da sua história em eras e períodos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nova Era
          </Button>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Timeline Tree */}
      <div className="space-y-4">
        {mockTimeline.map((era) => (
          <Card key={era.id} className="card-magical animate-stagger">
            <Collapsible
              open={expandedEras.has(era.id)}
              onOpenChange={() => toggleEra(era.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, "era", era.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "era", era.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: era.color }}
                      />
                      <div>
                        <CardTitle className="text-lg">{era.name}</CardTitle>
                        <CardDescription>{era.time}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {expandedEras.has(era.id) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4">{era.description}</p>
                  
                  {/* Periods */}
                  <div className="space-y-3 ml-8">
                    {era.periods.map((period) => (
                      <Card key={period.id} className="border-l-4" style={{ borderLeftColor: era.color }}>
                        <Collapsible
                          open={expandedPeriods.has(period.id)}
                          onOpenChange={() => togglePeriod(period.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <CardHeader 
                              className="cursor-pointer hover:bg-muted/30 transition-colors py-3"
                              draggable
                              onDragStart={(e) => handleDragStart(e, "period", period.id)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, "period", period.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <CardTitle className="text-base">{period.name}</CardTitle>
                                    <CardDescription className="text-sm">{period.description}</CardDescription>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {period.events.length} eventos
                                  </Badge>
                                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  {expandedPeriods.has(period.id) ? 
                                    <ChevronDown className="w-4 h-4" /> : 
                                    <ChevronRight className="w-4 h-4" />
                                  }
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <CardContent className="pt-0">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                  <span className="font-medium">Início:</span>
                                  <p className="text-muted-foreground">{period.startReason}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Fim:</span>
                                  <p className="text-muted-foreground">{period.endReason}</p>
                                </div>
                              </div>

                              {/* Events */}
                              <div className="ml-6 space-y-2">
                                <h5 className="font-medium text-sm mb-3">Eventos</h5>
                                {period.events.map((event) => (
                                  <div 
                                    key={event.id}
                                    className="animate-stagger"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, "event", event.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, "event", event.id)}
                                  >
                                    <EventModal event={event} />
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {mockTimeline.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma era criada</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando a primeira era da sua história
          </p>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Era
          </Button>
        </div>
      )}
    </div>
  );
}