import { useState } from "react";
import { Plus, Edit2, Search, Building, Users, Shield, Swords, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Faction {
  id: string;
  name: string;
  type: string;
  description: string;
  alignment: "Bem" | "Mal" | "Neutro";
  members: string[];
  leader?: string;
  influence: "Alta" | "Média" | "Baixa";
  goals: string[];
}

const mockFactions: Faction[] = [
  {
    id: "1",
    name: "Ordem dos Guardiões",
    type: "Ordem Militar",
    description: "Antiga ordem dedicada à proteção do reino e preservação da luz. Formada pelos melhores guerreiros e magos.",
    alignment: "Bem",
    leader: "Lyara Moonwhisper",
    members: ["Aelric Valorheart", "Lyara Moonwhisper", "Sir Marcus Lightbringer"],
    influence: "Alta",
    goals: ["Proteger o reino", "Preservar a magia da luz", "Treinar novos guardiões"]
  },
  {
    id: "2",
    name: "Culto das Sombras", 
    type: "Culto",
    description: "Organização secreta que busca trazer as trevas de volta ao mundo através de rituais sombrios.",
    alignment: "Mal",
    leader: "Malachar o Sombrio",
    members: ["Malachar o Sombrio", "Vex Nightbane", "Kael Darkthorn"],
    influence: "Média",
    goals: ["Ressuscitar antigos demônios", "Corromper a magia da luz", "Dominar o reino"]
  },
  {
    id: "3",
    name: "Guilda dos Artífices",
    type: "Guilda Comercial", 
    description: "Associação de ferreiros, encantadores e inventores. Neutros no conflito, focam no comércio e inovação.",
    alignment: "Neutro",
    leader: "Mestre Gorin Martelodouro",
    members: ["Finn Pedraverde", "Mestre Gorin Martelodouro", "Elena Forjaruna"],
    influence: "Média",
    goals: ["Desenvolver novas tecnologias", "Manter o comércio", "Preservar conhecimento técnico"]
  }
];

export function FactionsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState("all");

  const alignments = ["all", "Bem", "Mal", "Neutro"];

  const getFactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "ordem militar":
        return <Shield className="w-4 h-4" />;
      case "culto":
        return <Swords className="w-4 h-4" />;
      case "guilda comercial":
        return <Crown className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case "Bem":
        return "bg-success text-success-foreground";
      case "Mal":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case "Alta":
        return "bg-accent text-accent-foreground";
      case "Média":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredFactions = mockFactions.filter(faction => {
    const matchesSearch = faction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlignment = selectedAlignment === "all" || faction.alignment === selectedAlignment;
    return matchesSearch && matchesAlignment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facções e Organizações</h2>
          <p className="text-muted-foreground">Gerencie os grupos e organizações do seu mundo</p>
        </div>
        <Button variant="magical">
          <Plus className="w-4 h-4 mr-2" />
          Nova Facção
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar facções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedAlignment}
          onChange={(e) => setSelectedAlignment(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">Todos os alinhamentos</option>
          {alignments.slice(1).map(alignment => (
            <option key={alignment} value={alignment}>{alignment}</option>
          ))}
        </select>
      </div>

      {/* Factions Grid */}
      <div className="space-y-6">
        {filteredFactions.map((faction) => (
          <Card key={faction.id} className="card-magical animate-stagger">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getFactionIcon(faction.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{faction.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{faction.type}</Badge>
                      <Badge className={getAlignmentColor(faction.alignment)}>
                        {faction.alignment}
                      </Badge>
                      <Badge className={getInfluenceColor(faction.influence)}>
                        Influência: {faction.influence}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-4">
                    {faction.description}
                  </p>
                  
                  {faction.leader && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Líder</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {faction.leader.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{faction.leader}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Objetivos</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {faction.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Membros ({faction.members.length})
                  </h4>
                  <div className="space-y-2">
                    {faction.members.map((member, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {member.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member}</span>
                        {member === faction.leader && (
                          <Badge variant="secondary" className="ml-auto text-xs">Líder</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFactions.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma facção encontrada</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedAlignment !== "all" 
              ? "Tente ajustar seus filtros" 
              : "Comece criando a primeira facção do seu mundo"}
          </p>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Facção
          </Button>
        </div>
      )}
    </div>
  );
}