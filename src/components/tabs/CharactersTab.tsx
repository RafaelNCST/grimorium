import { useState } from "react";
import { Plus, Edit2, Search, Filter, Users, Crown, Sword, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
  organization: string;
  image?: string;
  traits: string[];
}

const mockCharacters: Character[] = [
  {
    id: "1",
    name: "Aelric Valorheart",
    description: "Um jovem pastor que descobre possuir poderes mágicos ancestrais.",
    role: "Protagonista",
    organization: "Ordem dos Guardiões",
    traits: ["Corajoso", "Determinado", "Ingênuo"]
  },
  {
    id: "2", 
    name: "Lyara Moonwhisper",
    description: "Mentora élfica com conhecimento profundo sobre magia antiga.",
    role: "Mentor",
    organization: "Ordem dos Guardiões",
    traits: ["Sábia", "Misteriosa", "Protetora"]
  },
  {
    id: "3",
    name: "Malachar o Sombrio",
    description: "Antigo mago que busca o poder absoluto através da magia negra.",
    role: "Antagonista",
    organization: "Culto das Sombras",
    traits: ["Ambicioso", "Cruel", "Inteligente"]
  },
  {
    id: "4",
    name: "Finn Pedraverde",
    description: "Anão ferreiro e companheiro leal do protagonista.",
    role: "Aliado",
    organization: "N/A",
    traits: ["Leal", "Trabalhador", "Teimoso"]
  },
];

export function CharactersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");

  const organizations = ["all", "Ordem dos Guardiões", "Culto das Sombras", "N/A"];
  
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "protagonista":
        return <Crown className="w-4 h-4" />;
      case "antagonista":
        return <Sword className="w-4 h-4" />;
      case "mentor":
        return <Users className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "protagonista":
        return "bg-accent text-accent-foreground";
      case "antagonista":
        return "bg-destructive text-destructive-foreground";
      case "mentor":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredCharacters = mockCharacters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === "all" || character.organization === selectedOrg;
    return matchesSearch && matchesOrg;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personagens</h2>
          <p className="text-muted-foreground">Gerencie os personagens da sua história</p>
        </div>
        <Button variant="magical">
          <Plus className="w-4 h-4 mr-2" />
          Novo Personagem
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">Todas as organizações</option>
          {organizations.slice(1).map(org => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((character) => (
          <Card key={character.id} className="card-magical animate-stagger">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={character.image} />
                    <AvatarFallback>
                      {character.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{character.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRoleColor(character.role)} variant="secondary">
                        {getRoleIcon(character.role)}
                        <span className="ml-1">{character.role}</span>
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
              <p className="text-sm text-muted-foreground mb-3">
                {character.description}
              </p>
              
              <div className="mb-3">
                <span className="text-xs font-medium text-muted-foreground">Organização:</span>
                <p className="text-sm">{character.organization}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {character.traits.map((trait, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum personagem encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedOrg !== "all" 
              ? "Tente ajustar seus filtros" 
              : "Comece criando seu primeiro personagem"}
          </p>
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Personagem
          </Button>
        </div>
      )}
    </div>
  );
}