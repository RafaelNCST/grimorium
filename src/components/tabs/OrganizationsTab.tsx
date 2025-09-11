import { useState } from "react";  
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Search, Building, Users, Shield, Swords, Crown, Globe, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreateOrganizationModal } from "@/components/modals/CreateOrganizationModal";
import { EmptyState } from "@/components/EmptyState";

interface OrganizationTitle {
  id: string;
  name: string;
  description: string;
  level: number; // 1 = highest rank, higher numbers = lower ranks
}

interface OrganizationMember {
  characterId: string;
  characterName: string;
  titleId: string;
  joinDate: string;
}

interface Organization {
  id: string;
  name: string;
  photo?: string;
  alignment: "Bem" | "Neutro" | "Caótico";
  description: string;
  type: "Militar" | "Comercial" | "Mágica" | "Religiosa" | "Culto" | "Governamental" | "Outros";
  influence: "Inexistente" | "Baixa" | "Média" | "Alta" | "Dominante";
  leaders: string[];
  objectives: string[];
  members: OrganizationMember[];
  titles: OrganizationTitle[];
  dominatedLocations: string[];
  baseLocation?: string;
  world?: string;
  continent?: string;
}

const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Ordem dos Guardiões",
    alignment: "Bem",
    description: "Antiga ordem militar dedicada à proteção do reino e preservação da luz. Formada pelos melhores guerreiros e magos.",
    type: "Militar",
    influence: "Alta",
    leaders: ["Lyara Moonwhisper"],
    objectives: [
      "Proteger o reino das forças das trevas",
      "Preservar a magia da luz",
      "Treinar novos guardiões",
      "Manter a paz entre os reinos"
    ],
    world: "Aethermoor",
    continent: "Continente Central",
    baseLocation: "Cidadela da Luz",
    dominatedLocations: ["Cidadela da Luz", "Postos Avançados"],
    titles: [
      { id: "t1", name: "Guardião Supremo", description: "Líder máximo da ordem", level: 1 },
      { id: "t2", name: "Comandante", description: "Líder militar regional", level: 2 },
      { id: "t3", name: "Cavaleiro", description: "Guerreiro experiente", level: 3 },
      { id: "t4", name: "Escudeiro", description: "Guerreiro em treinamento", level: 4 }
    ],
    members: [
      { characterId: "c1", characterName: "Lyara Moonwhisper", titleId: "t1", joinDate: "Era Atual, 1090" },
      { characterId: "c2", characterName: "Aelric Valorheart", titleId: "t4", joinDate: "Era Atual, 1113" },
      { characterId: "c3", characterName: "Sir Marcus Lightbringer", titleId: "t2", joinDate: "Era Atual, 1095" }
    ]
  },
  {
    id: "2",
    name: "Culto das Sombras", 
    alignment: "Caótico",
    description: "Organização secreta que busca trazer as trevas de volta ao mundo através de rituais sombrios e corrupção da magia.",
    type: "Culto",
    influence: "Média",
    leaders: ["Malachar o Sombrio"],
    objectives: [
      "Ressuscitar antigos demônios",
      "Corromper a magia da luz", 
      "Dominar todos os reinos",
      "Espalhar o caos e as trevas"
    ],
    world: "Aethermoor",
    continent: "Terras Sombrias",
    baseLocation: "Torre Sombria",
    dominatedLocations: ["Torre Sombria", "Floresta das Lamentações"],
    titles: [
      { id: "t5", name: "Senhor das Sombras", description: "Líder supremo do culto", level: 1 },
      { id: "t6", name: "Arcano Negro", description: "Mago especialista em trevas", level: 2 },
      { id: "t7", name: "Cultista", description: "Seguidor devoto", level: 3 }
    ],
    members: [
      { characterId: "c4", characterName: "Malachar o Sombrio", titleId: "t5", joinDate: "Era das Trevas, 200" },
      { characterId: "c5", characterName: "Vex Nightbane", titleId: "t6", joinDate: "Era Atual, 1100" },
      { characterId: "c6", characterName: "Kael Darkthorn", titleId: "t7", joinDate: "Era Atual, 1110" }
    ]
  },
  {
    id: "3",
    name: "Guilda dos Artífices",
    alignment: "Neutro", 
    description: "Associação de ferreiros, encantadores e inventores. Neutros no conflito entre luz e trevas, focam no comércio e inovação tecnológica.",
    type: "Comercial",
    influence: "Média",
    leaders: ["Mestre Gorin Martelodouro"],
    objectives: [
      "Desenvolver novas tecnologias mágicas",
      "Manter o comércio entre reinos",
      "Preservar conhecimento técnico",
      "Criar itens mágicos únicos"
    ],
    world: "Aethermoor",
    continent: "Continente Central", 
    baseLocation: "Aldeia de Pedraverde",
    dominatedLocations: ["Forjas de Pedraverde", "Mercado Central"],
    titles: [
      { id: "t8", name: "Grão-Mestre", description: "Líder da guilda", level: 1 },
      { id: "t9", name: "Mestre Artífice", description: "Especialista experiente", level: 2 },
      { id: "t10", name: "Artífice", description: "Membro qualificado", level: 3 },
      { id: "t11", name: "Aprendiz", description: "Estudante em formação", level: 4 }
    ],
    members: [
      { characterId: "c7", characterName: "Mestre Gorin Martelodouro", titleId: "t8", joinDate: "Era Atual, 1080" },
      { characterId: "c8", characterName: "Finn Pedraverde", titleId: "t9", joinDate: "Era Atual, 1105" },
      { characterId: "c9", characterName: "Elena Forjaruna", titleId: "t10", joinDate: "Era Atual, 1108" }
    ]
  }
];

interface OrganizationsTabProps {
  bookId: string;
}

export function OrganizationsTab({ bookId }: OrganizationsTabProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState<string>("all");
  const [selectedWorld, setSelectedWorld] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [organizations, setOrganizations] = useState(mockOrganizations);

  const alignments = ["all", "Bem", "Neutro", "Caótico"];
  const worlds = ["all", "Aethermoor"];
  const continents = ["all", "Continente Central", "Terras Sombrias"];

  const getOrganizationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "militar":
        return <Shield className="w-4 h-4" />;
      case "culto":
        return <Swords className="w-4 h-4" />;
      case "comercial":
        return <Crown className="w-4 h-4" />;
      case "mágica":
        return <Swords className="w-4 h-4" />;
      case "religiosa":
        return <Crown className="w-4 h-4" />;
      case "governamental":
        return <Building className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case "Bem":
        return "bg-success text-success-foreground";
      case "Caótico":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case "Dominante":
        return "bg-destructive text-destructive-foreground";
      case "Alta":
        return "bg-accent text-accent-foreground";
      case "Média":
        return "bg-primary text-primary-foreground";
      case "Baixa":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTitleName = (titleId: string, organization: Organization) => {
    const title = organization.titles.find(t => t.id === titleId);
    return title?.name || "Membro";
  };

  const handleCreateOrganization = () => {
    setShowCreateModal(true);
  };

  const handleOrganizationCreated = (newOrganization: any) => {
    setOrganizations(prev => [...prev, newOrganization]);
  };

  const handleOrganizationClick = (orgId: string) => {
    navigate(`/book/${bookId}/organization/${orgId}`);
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlignment = selectedAlignment === "all" || org.alignment === selectedAlignment;
    const matchesWorld = selectedWorld === "all" || org.world === selectedWorld;
    return matchesSearch && matchesAlignment && matchesWorld;
  });

  // Statistics
  const totalByAlignment = {
    bem: organizations.filter(o => o.alignment === "Bem").length,
    neutro: organizations.filter(o => o.alignment === "Neutro").length,
    caotico: organizations.filter(o => o.alignment === "Caótico").length
  };

  // Mock data for create modal
  const availableCharacters = [
    { id: "c1", name: "Lyara Moonwhisper" },
    { id: "c2", name: "Aelric Valorheart" },
    { id: "c3", name: "Sir Marcus Lightbringer" }
  ];

  const availableLocations = [
    { id: "l1", name: "Cidadela da Luz", type: "Fortaleza" },
    { id: "l2", name: "Torre Sombria", type: "Torre" },
    { id: "l3", name: "Aldeia de Pedraverde", type: "Aldeia" }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Organizações</h2>
          <p className="text-muted-foreground">Gerencie as organizações e facções do seu mundo</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">{organizations.length} Total</Badge>
            <Badge className="bg-success/10 text-success">{totalByAlignment.bem} Bem</Badge>
            <Badge className="bg-secondary/10 text-secondary-foreground">{totalByAlignment.neutro} Neutro</Badge>
            <Badge className="bg-destructive/10 text-destructive">{totalByAlignment.caotico} Caótico</Badge>
          </div>
        </div>
        <Button variant="magical" onClick={handleCreateOrganization}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Organização
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar organizações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedAlignment} onValueChange={setSelectedAlignment}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Alinhamento" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todos</SelectItem>
            {alignments.slice(1).map(alignment => (
              <SelectItem key={alignment} value={alignment}>{alignment}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedWorld} onValueChange={setSelectedWorld}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Mundo" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value="all">Todos</SelectItem>
            {worlds.slice(1).map(world => (
              <SelectItem key={world} value={world}>{world}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Organizations List */}
      <div className="space-y-6">
        {filteredOrganizations.map((organization) => (
          <Card 
            key={organization.id} 
            className="card-magical animate-stagger cursor-pointer hover:shadow-lg transition-all"
            onClick={() => handleOrganizationClick(organization.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getOrganizationIcon(organization.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{organization.name}</CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{organization.type}</Badge>
                      <Badge className={getAlignmentColor(organization.alignment)}>
                        {organization.alignment}
                      </Badge>
                      <Badge className={getInfluenceColor(organization.influence)}>
                        {organization.influence}
                      </Badge>
                      {organization.world && (
                        <Badge variant="secondary" className="bg-muted/50">
                          <Globe className="w-3 h-3 mr-1" />
                          {organization.world}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {organization.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {organization.leaders.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Líderes</h4>
                      <div className="space-y-2">
                        {organization.leaders.map((leader, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {leader.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{leader}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {organization.baseLocation && (
                    <div>
                      <h4 className="font-medium mb-2">Base Principal</h4>
                      <p className="text-sm text-muted-foreground">{organization.baseLocation}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma organização encontrada</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedAlignment !== "all" 
              ? "Tente ajustar seus filtros" 
              : "Comece criando a primeira organização do seu mundo"}
          </p>
          <Button variant="magical" onClick={handleCreateOrganization}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Organização
          </Button>
        </div>
      )}

      {organizations.length === 0 && (
        <EmptyState
          icon={Building}
          title="Nenhuma organização criada"
          description="Comece criando a primeira organização do seu mundo para gerenciar facções e grupos."
          actionLabel="Criar Organização"
          onAction={handleCreateOrganization}
        />
      )}

      <CreateOrganizationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onOrganizationCreated={handleOrganizationCreated}
        bookId={bookId}
        availableCharacters={availableCharacters}
        availableLocations={availableLocations}
      />
    </div>
  );
}