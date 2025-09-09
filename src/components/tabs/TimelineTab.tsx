import { useState } from "react";
import { Plus, Edit2, Clock, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  type: "Batalha" | "Descoberta" | "Nascimento" | "Morte" | "Fundação" | "Outros";
  importance: "Crítico" | "Alto" | "Médio" | "Baixo";
  characters: string[];
  locations: string[];
}

const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    name: "A Grande Ruptura",
    date: "Era das Trevas, Ano 0",
    description: "Evento cataclísmico que dividiu o mundo entre luz e trevas, marcando o início da Era das Trevas.",
    type: "Outros",
    importance: "Crítico",
    characters: [],
    locations: ["Mundo Inteiro"]
  },
  {
    id: "2", 
    name: "Fundação da Ordem dos Guardiões",
    date: "Era das Trevas, Ano 127",
    description: "Criação da ordem militar dedicada a combater as forças das trevas e proteger os reinos da luz.",
    type: "Fundação",
    importance: "Alto",
    characters: ["Primeiro Guardião Supremo"],
    locations: ["Reino de Aethermoor"]
  },
  {
    id: "3",
    name: "Nascimento de Aelric Valorheart",
    date: "Era Atual, Ano 1095",
    description: "Nascimento do futuro herói em uma pequena aldeia de pastores.",
    type: "Nascimento",
    importance: "Alto", 
    characters: ["Aelric Valorheart"],
    locations: ["Aldeia dos Pastores"]
  },
  {
    id: "4",
    name: "Descoberta dos Poderes de Aelric",
    date: "Era Atual, Ano 1113",
    description: "Aelric descobre seus poderes mágicos ancestrais durante um ataque de criaturas sombrias à sua aldeia.",
    type: "Descoberta",
    importance: "Crítico",
    characters: ["Aelric Valorheart", "Lyara Moonwhisper"],
    locations: ["Aldeia dos Pastores"]
  },
  {
    id: "5",
    name: "Primeira Batalha contra o Culto",
    date: "Era Atual, Ano 1113",
    description: "Primeiro confronto direto entre Aelric e os seguidores do Culto das Sombras.",
    type: "Batalha",
    importance: "Alto",
    characters: ["Aelric Valorheart", "Malachar o Sombrio", "Finn Pedraverde"],
    locations: ["Floresta das Lamentações"]
  }
];

export function TimelineTab() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Batalha":
        return "bg-destructive text-destructive-foreground";
      case "Descoberta":
        return "bg-accent text-accent-foreground";
      case "Nascimento":
        return "bg-success text-success-foreground";
      case "Morte":
        return "bg-muted text-muted-foreground";
      case "Fundação":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Crítico":
        return "border-l-4 border-l-destructive";
      case "Alto":
        return "border-l-4 border-l-accent";
      case "Médio":
        return "border-l-4 border-l-primary";
      default:
        return "border-l-4 border-l-muted";
    }
  };

  const sortedEvents = [...mockEvents].sort((a, b) => {
    const dateA = new Date(a.date.replace(/Era \w+, Ano /, ""));
    const dateB = new Date(b.date.replace(/Era \w+, Ano /, ""));
    return sortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Linha do Tempo</h2>
          <p className="text-muted-foreground">Organize os eventos da sua história cronologicamente</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          >
            {sortOrder === "desc" ? (
              <>
                <ArrowDown className="w-4 h-4 mr-2" />
                Mais Recente
              </>
            ) : (
              <>
                <ArrowUp className="w-4 h-4 mr-2" />
                Mais Antigo
              </>
            )}
          </Button>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative animate-stagger">
              {/* Timeline Dot */}
              <div className="absolute left-3 w-2 h-2 bg-primary rounded-full ring-4 ring-background"></div>
              
              {/* Event Card */}
              <div className="ml-12">
                <Card className={`card-magical ${getImportanceColor(event.importance)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                          <Badge variant="outline">
                            {event.importance}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.characters.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Personagens Envolvidos</h4>
                          <div className="flex flex-wrap gap-1">
                            {event.characters.map((character, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {character}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {event.locations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Locais</h4>
                          <div className="flex flex-wrap gap-1">
                            {event.locations.map((location, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mockEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum evento na timeline</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando os principais eventos da sua história
          </p>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Evento
          </Button>
        </div>
      )}
    </div>
  );
}