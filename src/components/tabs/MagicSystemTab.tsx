import { useState } from "react";
import { Plus, Edit2, Sparkles, Zap, Shield, Wand2, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MagicSchool {
  id: string;
  name: string;
  description: string;
  element: string;
  difficulty: "Básico" | "Intermediário" | "Avançado" | "Lendário";
  spells: Spell[];
  practitioners: string[];
}

interface Spell {
  id: string;
  name: string;
  description: string;
  cost: number;
  castTime: string;
  range: string;
  components: string[];
}

const mockMagicSchools: MagicSchool[] = [
  {
    id: "1",
    name: "Magia da Luz",
    description: "Escola de magia baseada na energia luminosa. Usado principalmente para cura, proteção e purificação.",
    element: "Luz",
    difficulty: "Intermediário",
    practitioners: ["Aelric Valorheart", "Lyara Moonwhisper"],
    spells: [
      {
        id: "1",
        name: "Cura Menor",
        description: "Restaura ferimentos leves através da energia luminosa",
        cost: 15,
        castTime: "3 segundos",
        range: "Toque",
        components: ["Gesto", "Palavras Sagradas"]
      },
      {
        id: "2", 
        name: "Escudo Luminoso",
        description: "Cria uma barreira de luz que absorve ataques sombrios",
        cost: 25,
        castTime: "5 segundos",
        range: "Pessoal",
        components: ["Gesto", "Concentração"]
      }
    ]
  },
  {
    id: "2",
    name: "Magia das Sombras",
    description: "Escola proibida que manipula as trevas. Perigosa mas poderosa, corrompe gradualmente o usuário.",
    element: "Trevas",
    difficulty: "Avançado",
    practitioners: ["Malachar o Sombrio"],
    spells: [
      {
        id: "3",
        name: "Drenagem Sombria",
        description: "Absorve a energia vital do alvo através das sombras",
        cost: 30,
        castTime: "4 segundos", 
        range: "30 metros",
        components: ["Gesto Sombrio", "Sacrifício"]
      }
    ]
  },
  {
    id: "3",
    name: "Magia Elemental",
    description: "Manipulação dos elementos básicos: fogo, água, terra e ar. Versátil e amplamente praticada.",
    element: "Multi-elemental",
    difficulty: "Básico",
    practitioners: ["Finn Pedraverde", "Elena Forjaruna"],
    spells: [
      {
        id: "4",
        name: "Chama Dançante",
        description: "Cria pequenas chamas controláveis para iluminação ou combate",
        cost: 10,
        castTime: "2 segundos",
        range: "10 metros", 
        components: ["Gesto", "Foco"]
      }
    ]
  }
];

export function MagicSystemTab() {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico":
        return "bg-success text-success-foreground";
      case "Intermediário":
        return "bg-primary text-primary-foreground"; 
      case "Avançado":
        return "bg-accent text-accent-foreground";
      case "Lendário":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getElementIcon = (element: string) => {
    switch (element.toLowerCase()) {
      case "luz":
        return <Sparkles className="w-4 h-4" />;
      case "trevas":
        return <Shield className="w-4 h-4" />;
      case "multi-elemental":
        return <Zap className="w-4 h-4" />;
      default:
        return <Wand2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Magia</h2>
          <p className="text-muted-foreground">Defina as regras e escolas mágicas do seu mundo</p>
        </div>
        <Button variant="magical">
          <Plus className="w-4 h-4 mr-2" />
          Nova Escola de Magia
        </Button>
      </div>

      {/* Magic System Overview */}
      <Card className="card-magical">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Sistema Mágico Geral
          </CardTitle>
          <CardDescription>
            Regras e fundamentos da magia no seu mundo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Fonte de Poder</h4>
              <p className="text-sm text-muted-foreground">Energia ancestral dos cristais mágicos</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Limitação</h4>
              <p className="text-sm text-muted-foreground">Esgotamento mental e físico</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Consequência</h4>
              <p className="text-sm text-muted-foreground">Uso excessivo causa envelhecimento</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Magic Schools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockMagicSchools.map((school) => (
          <Card key={school.id} className="card-magical animate-stagger">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getElementIcon(school.element)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{school.element}</Badge>
                      <Badge className={getDifficultyColor(school.difficulty)}>
                        {school.difficulty}
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
              <p className="text-sm text-muted-foreground mb-4">
                {school.description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Praticantes ({school.practitioners.length})</h4>
                  <div className="flex flex-wrap gap-1">
                    {school.practitioners.map((practitioner, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {practitioner}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Magias ({school.spells.length})</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedSchool(selectedSchool === school.id ? null : school.id)}
                    >
                      {selectedSchool === school.id ? "Ocultar" : "Ver Detalhes"}
                    </Button>
                  </div>
                  
                  {selectedSchool === school.id && (
                    <div className="space-y-2 mt-3">
                      {school.spells.map((spell) => (
                        <div key={spell.id} className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium">{spell.name}</h5>
                            <span className="text-xs text-muted-foreground">{spell.cost} MP</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{spell.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-medium">Tempo:</span> {spell.castTime}
                            </div>
                            <div>
                              <span className="font-medium">Alcance:</span> {spell.range}
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium text-xs">Componentes:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {spell.components.map((component, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {component}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockMagicSchools.length === 0 && (
        <div className="text-center py-12">
          <Wand2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma escola de magia definida</h3>
          <p className="text-muted-foreground mb-4">
            Crie as primeiras escolas de magia do seu mundo
          </p>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Escola de Magia
          </Button>
        </div>
      )}
    </div>
  );
}