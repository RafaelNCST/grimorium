import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, Crown, Sword, Heart, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateCharacterModal } from "@/components/modals/CreateCharacterModal";
import { StatsCard } from "@/components/StatsCard";

interface Character {
  id: string;
  name: string;
  age?: number;
  appearance?: string;
  role: string;
  personality?: string;
  description: string;
  organization: string;
  birthPlace?: string;
  affiliatedPlace?: string;
  alignment?: string;
  image?: string;
  qualities: string[];
}

const mockCharacters: Character[] = [
  {
    id: "1",
    name: "Aelric Valorheart",
    age: 23,
    appearance: "Jovem de estatura média com cabelos castanhos ondulados e olhos verdes penetrantes. Possui uma cicatriz no braço direito de uma batalha antiga.",
    description: "Um jovem pastor que descobre possuir poderes mágicos ancestrais.",
    role: "protagonista",
    personality: "Determinado e corajoso, mas às vezes impulsivo. Possui um forte senso de justiça e não hesita em ajudar os necessitados.",
    organization: "Ordem dos Guardiões",
    birthPlace: "Vila Pedraverde",
    affiliatedPlace: "Capital Elaria",
    alignment: "bem",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    qualities: ["Corajoso", "Determinado", "Leal", "Otimista", "Protetor"]
  },
  {
    id: "2", 
    name: "Lyara Moonwhisper",
    age: 247,
    description: "Mentora élfica com conhecimento profundo sobre magia antiga.",
    role: "secundario",
    organization: "Ordem dos Guardiões",
    birthPlace: "Floresta Sombria",
    affiliatedPlace: "Capital Elaria",
    alignment: "bem",
    qualities: ["Sábia", "Misteriosa", "Protetora"]
  },
  {
    id: "3",
    name: "Malachar o Sombrio",
    age: 45,
    description: "Antigo mago que busca o poder absoluto através da magia negra.",
    role: "antagonista",
    organization: "Culto das Sombras",
    birthPlace: "Montanhas do Norte",
    affiliatedPlace: "Torre Sombria",
    alignment: "caotico",
    qualities: ["Ambicioso", "Cruel", "Inteligente"]
  },
  {
    id: "4",
    name: "Finn Pedraverde",
    age: 67,
    description: "Anão ferreiro e companheiro leal do protagonista.",
    role: "secundario",
    organization: "Guilda dos Ferreiros",
    birthPlace: "Montanhas do Norte",
    affiliatedPlace: "Vila Pedraverde",
    alignment: "bem",
    qualities: ["Leal", "Trabalhador", "Teimoso"]
  },
  {
    id: "5",
    name: "Seraphina Nightblade",
    age: 28,
    description: "Assassina habilidosa que serve aos interesses sombrios.",
    role: "vilao",
    organization: "Culto das Sombras",
    birthPlace: "Capital Elaria",
    affiliatedPlace: "Submundo",
    alignment: "caotico",
    qualities: ["Ágil", "Letal", "Calculista"]
  }
];

export function CharactersTab() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState(mockCharacters);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const organizations = ["all", "Ordem dos Guardiões", "Culto das Sombras", "Guilda dos Ferreiros"];
  const locations = ["all", "Vila Pedraverde", "Capital Elaria", "Floresta Sombria", "Montanhas do Norte"];
  
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "protagonista":
        return <Crown className="w-4 h-4" />;
      case "antagonista":
      case "vilao":
        return <Sword className="w-4 h-4" />;
      case "secundario":
        return <Users className="w-4 h-4" />;
      case "figurante":
        return <Heart className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "protagonista":
        return "bg-accent text-accent-foreground";
      case "antagonista":
      case "vilao":
        return "bg-destructive text-destructive-foreground";
      case "secundario":
        return "bg-primary text-primary-foreground";
      case "figurante":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      protagonista: "Protagonista",
      antagonista: "Antagonista", 
      vilao: "Vilão",
      secundario: "Secundário",
      figurante: "Figurante"
    };
    return labels[role.toLowerCase()] || role;
  };

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === "all" || character.organization === selectedOrg;
    const matchesLocation = selectedLocation === "all" || 
                           character.birthPlace === selectedLocation || 
                           character.affiliatedPlace === selectedLocation;
    return matchesSearch && matchesOrg && matchesLocation;
  });

  // Statistics
  const totalCharacters = characters.length;
  const roleStats = characters.reduce((acc, char) => {
    acc[char.role] = (acc[char.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCharacterCreated = (newCharacter: any) => {
    setCharacters(prev => [...prev, newCharacter]);
  };

  const handleCharacterClick = (characterId: string) => {
    navigate(`/book/1/character/${characterId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Personagens</h2>
          <p className="text-muted-foreground">Gerencie os personagens da sua história</p>
        </div>
        <CreateCharacterModal
          trigger={
            <Button variant="magical">
              <Plus className="w-4 h-4 mr-2" />
              Novo Personagem
            </Button>
          }
          onCharacterCreated={handleCharacterCreated}
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total"
          value={totalCharacters}
          description="personagens"
          icon={Users}
        />
        <StatsCard
          title="Protagonistas"
          value={roleStats.protagonista || 0}
          description="principais"
          icon={Crown}
        />
        <StatsCard
          title="Antagonistas"
          value={roleStats.antagonista || 0}
          description="oponentes"
          icon={Sword}
        />
        <StatsCard
          title="Vilões"
          value={roleStats.vilao || 0}
          description="malvados"
          icon={Shield}
        />
        <StatsCard
          title="Secundários"
          value={roleStats.secundario || 0}
          description="apoio"
          icon={Users}
        />
        <StatsCard
          title="Figurantes"
          value={roleStats.figurante || 0}
          description="extras"
          icon={Heart}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar personagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedOrg} onValueChange={setSelectedOrg}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Organização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas organizações</SelectItem>
            {organizations.slice(1).map(org => (
              <SelectItem key={org} value={org}>{org}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Local" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos locais</SelectItem>
            {locations.slice(1).map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((character) => (
          <Card 
            key={character.id} 
            className="card-magical animate-stagger cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCharacterClick(character.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={character.image} />
                  <AvatarFallback>
                    {character.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRoleColor(character.role)} variant="secondary">
                      {getRoleIcon(character.role)}
                      <span className="ml-1">{getRoleLabel(character.role)}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {character.description}
              </p>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{character.organization}</span>
                </div>
                {character.birthPlace && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{character.birthPlace}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {character.qualities.slice(0, 3).map((quality, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {quality}
                  </Badge>
                ))}
                {character.qualities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{character.qualities.length - 3}
                  </Badge>
                )}
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
            {searchTerm || selectedOrg !== "all" || selectedLocation !== "all"
              ? "Tente ajustar seus filtros" 
              : "Comece criando seu primeiro personagem"}
          </p>
          <CreateCharacterModal
            trigger={
              <Button variant="magical">
                <Plus className="w-4 h-4 mr-2" />
                Criar Personagem
              </Button>
            }
            onCharacterCreated={handleCharacterCreated}
          />
        </div>
      )}
    </div>
  );
}