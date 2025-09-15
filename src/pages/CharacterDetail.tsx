import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Save, X, Plus, Upload, Trash2, 
  Crown, Sword, Shield, Users, Heart, Star, 
  MapPin, Building, Calendar, Camera, Menu, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { CharacterNavigationSidebar } from "@/components/CharacterNavigationSidebar";
import { toast } from "sonner";

interface Character {
  id: string;
  name: string;
  age: number;
  gender: string;
  appearance: string;
  role: string;
  personality: string;
  description: string;
  organization: string;
  birthPlace: string;
  affiliatedPlace: string;
  alignment: string;
  qualities: string[];
  image: string;
  family: {
    father: string | null;
    mother: string | null;
    children: string[];
    siblings: string[];
    spouse: string | null;
    halfSiblings: string[];
    unclesAunts: string[];
    grandparents: string[];
    cousins: string[];
  };
  relationships: {
    id: string;
    characterId: string;
    type: string;
    intensity: number;
  }[];
}

// Mock data - in real app this would come from state management
const mockCharacter: Character = {
  id: "1",
  name: "Aelric Valorheart",
  age: 23,
  gender: "Masculino",
  appearance: "Jovem de estatura média com cabelos castanhos ondulados e olhos verdes penetrantes. Possui uma cicatriz no braço direito de uma batalha antiga. Veste sempre uma armadura de couro reforçado com detalhes em bronze, e carrega uma espada élfica herdada de seus antepassados. Seus olhos brilham com uma luz sobrenatural quando usa magia.",
  role: "protagonista",
  personality: "Determinado e corajoso, mas às vezes impulsivo. Possui um forte senso de justiça e não hesita em ajudar os necessitados. É naturalmente carismático e inspira confiança nos outros. Tem tendência a se sacrificar pelos outros, o que às vezes o coloca em situações perigosas. Apesar de sua juventude, demonstra uma sabedoria além de seus anos.",
  description: "Um jovem pastor que descobre possuir poderes mágicos ancestrais e se torna o último guardião de uma antiga profecia.",
  organization: "Ordem dos Guardiões",
  birthPlace: "Vila Pedraverde",
  affiliatedPlace: "Capital Elaria",
  alignment: "bem",
  qualities: ["Corajoso", "Determinado", "Leal", "Otimista", "Protetor", "Carismático", "Altruísta", "Intuitivo"],
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  family: {
    father: null,
    mother: null,
    children: [],
    siblings: [],
    spouse: null,
    halfSiblings: [],
    unclesAunts: [],
    grandparents: [],
    cousins: [],
  },
  relationships: []
};

// Mock characters for navigation
const mockCharacters = [
  {
    id: "1",
    name: "Aelric Valorheart",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    role: "protagonista"
  },
  {
    id: "2",
    name: "Lyra Moonshadow",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    role: "aliado"
  },
  {
    id: "3",
    name: "Thane Darkbane",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    role: "antagonista"
  }
];

const roles = [
  { value: "protagonista", label: "Protagonista", icon: Crown, color: "bg-yellow-500/10 text-yellow-600" },
  { value: "deuteragonista", label: "Deuteragonista", icon: Star, color: "bg-blue-500/10 text-blue-600" },
  { value: "aliado", label: "Aliado", icon: Shield, color: "bg-green-500/10 text-green-600" },
  { value: "antagonista", label: "Antagonista", icon: Sword, color: "bg-red-500/10 text-red-600" },
  { value: "suporte", label: "Suporte", icon: Users, color: "bg-purple-500/10 text-purple-600" },
  { value: "neutro", label: "Neutro", icon: Users, color: "bg-gray-500/10 text-gray-600" }
];

const alignments = [
  { value: "bem", label: "Bem", color: "text-green-600" },
  { value: "mal", label: "Mal", color: "text-red-600" },
  { value: "neutro", label: "Neutro", color: "text-gray-600" },
  { value: "caotico_bem", label: "Caótico Bem", color: "text-blue-600" },
  { value: "caotico_mal", label: "Caótico Mal", color: "text-purple-600" },
  { value: "leal_bem", label: "Leal Bem", color: "text-cyan-600" },
  { value: "leal_mal", label: "Leal Mal", color: "text-orange-600" }
];

const genders = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "nao_binario", label: "Não-binário" },
  { value: "outro", label: "Outro" }
];

const mockOrganizations = [
  "Ordem dos Guardiões",
  "Culto das Sombras", 
  "Guilda dos Mercadores",
  "Academia de Magia"
];

const mockLocations = [
  "Capital Elaria",
  "Vila Pedraverde", 
  "Floresta Sombria",
  "Montanhas do Norte"
];

const familyRelations = {
  single: [
    { value: "father", label: "Pai" },
    { value: "mother", label: "Mãe" },
    { value: "spouse", label: "Cônjuge" }
  ],
  multiple: [
    { value: "child", label: "Filho/Filha" },
    { value: "sibling", label: "Irmão/Irmã" },
    { value: "halfSibling", label: "Meio-irmão/Meio-irmã" },
    { value: "uncleAunt", label: "Tio/Tia" },
    { value: "grandparent", label: "Avô/Avó" },
    { value: "cousin", label: "Primo/Prima" }
  ]
};

const relationshipTypes = [
  { value: "odio", label: "Ódio", emoji: "😡", color: "bg-red-500/10 text-red-600" },
  { value: "amor", label: "Amor", emoji: "❤️", color: "bg-pink-500/10 text-pink-600" },
  { value: "interesse_amoroso", label: "Interesse Amoroso", emoji: "💕", color: "bg-rose-500/10 text-rose-600" },
  { value: "mentorado", label: "Mentorado", emoji: "🎓", color: "bg-blue-500/10 text-blue-600" },
  { value: "subordinacao", label: "Subordinação", emoji: "🫡", color: "bg-gray-500/10 text-gray-600" },
  { value: "rivalidade", label: "Rivalidade", emoji: "⚔️", color: "bg-orange-500/10 text-orange-600" },
  { value: "lideranca", label: "Liderança", emoji: "👑", color: "bg-purple-500/10 text-purple-600" },
  { value: "amizade", label: "Amizade", emoji: "😊", color: "bg-green-500/10 text-green-600" },
  { value: "melhores_amigos", label: "Melhores Amigos", emoji: "👥", color: "bg-emerald-500/10 text-emerald-600" },
  { value: "inimizade", label: "Inimizade", emoji: "😤", color: "bg-red-600/10 text-red-700" },
  { value: "neutro", label: "Neutro", emoji: "😐", color: "bg-slate-500/10 text-slate-600" }
];

export function CharacterDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [character, setCharacter] = useState<Character>(mockCharacter);
  const [editData, setEditData] = useState<Character>({...mockCharacter, relationships: mockCharacter.relationships || []});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newQuality, setNewQuality] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(mockCharacter.image);
  const [selectedRelationshipCharacter, setSelectedRelationshipCharacter] = useState("");
  const [selectedRelationshipType, setSelectedRelationshipType] = useState("");
  const [relationshipIntensity, setRelationshipIntensity] = useState([50]);
  const [showCharacterNav, setShowCharacterNav] = useState(false);
  const [editingFamilyType, setEditingFamilyType] = useState<string | null>(null);
  const [familyCharacterSearch, setFamilyCharacterSearch] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentRole = roles.find(r => r.value === character.role);
  const currentAlignment = alignments.find(a => a.value === character.alignment);
  const RoleIcon = currentRole?.icon || Users;

  const handleSave = () => {
    setCharacter(editData);
    setIsEditing(false);
    toast.success("Personagem atualizado com sucesso!");
  };

  const handleDelete = () => {
    toast.success("Personagem excluído com sucesso!");
    navigate("/book/1");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setEditData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addQuality = () => {
    if (newQuality.trim() && !editData.qualities.includes(newQuality.trim())) {
      setEditData(prev => ({
        ...prev,
        qualities: [...prev.qualities, newQuality.trim()]
      }));
      setNewQuality("");
    }
  };

  const removeQuality = (quality: string) => {
    setEditData(prev => ({
      ...prev,
      qualities: prev.qualities.filter(q => q !== quality)
    }));
  };

  const addRelationship = () => {
    if (selectedRelationshipCharacter && selectedRelationshipType) {
      const newRelationship = {
        id: `rel-${Date.now()}`,
        characterId: selectedRelationshipCharacter,
        type: selectedRelationshipType,
        intensity: relationshipIntensity[0]
      };
      
      setEditData(prev => ({
        ...prev,
        relationships: [...prev.relationships, newRelationship]
      }));
      
      setSelectedRelationshipCharacter("");
      setSelectedRelationshipType("");
      setRelationshipIntensity([50]);
      toast.success("Relacionamento adicionado!");
    }
  };

  const removeRelationship = (relationshipId: string) => {
    setEditData(prev => ({
      ...prev,
      relationships: prev.relationships.filter(r => r.id !== relationshipId)
    }));
    toast.success("Relacionamento removido!");
  };

  const addFamilyMember = (familyType: string, characterId: string) => {
    const characterName = mockCharacters.find(c => c.id === characterId)?.name || "";
    
    setEditData(prev => {
      const newFamily = { ...prev.family };
      
      if (familyType === 'father' || familyType === 'mother' || familyType === 'spouse') {
        (newFamily as any)[familyType] = characterName;
      } else {
        const arrayKey = familyType === 'child' ? 'children' : 
                        familyType === 'sibling' ? 'siblings' :
                        familyType === 'halfSibling' ? 'halfSiblings' :
                        familyType === 'uncleAunt' ? 'unclesAunts' :
                        familyType === 'grandparent' ? 'grandparents' : 'cousins';
        
        const currentArray = newFamily[arrayKey as keyof typeof newFamily] as string[];
        if (!currentArray.includes(characterName)) {
          newFamily[arrayKey as keyof typeof newFamily] = [...currentArray, characterName] as any;
        }
      }
      
      return { ...prev, family: newFamily };
    });
    
    setEditingFamilyType(null);
    setFamilyCharacterSearch("");
    toast.success("Membro da família adicionado!");
  };

  const removeFamilyMember = (familyType: string, characterName?: string) => {
    setEditData(prev => {
      const newFamily = { ...prev.family };
      
      if (familyType === 'father' || familyType === 'mother' || familyType === 'spouse') {
        newFamily[familyType as keyof typeof newFamily] = null as any;
      } else if (characterName) {
        const arrayKey = familyType === 'children' ? 'children' : 
                        familyType === 'siblings' ? 'siblings' :
                        familyType === 'halfSiblings' ? 'halfSiblings' :
                        familyType === 'unclesAunts' ? 'unclesAunts' :
                        familyType === 'grandparents' ? 'grandparents' : 'cousins';
        
        const currentArray = newFamily[arrayKey as keyof typeof newFamily] as string[];
        newFamily[arrayKey as keyof typeof newFamily] = currentArray.filter(name => name !== characterName) as any;
      }
      
      return { ...prev, family: newFamily };
    });
    
    toast.success("Membro da família removido!");
  };

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Personagem não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/book/1")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowCharacterNav(true)}>
              <Menu className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{character.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <RoleIcon className="w-4 h-4" />
                <span className="text-sm text-muted-foreground capitalize">{character.role}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={isEditing ? imagePreview : character.image} alt={character.name} />
                      <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <>
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nome do personagem"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            value={editData.age}
                            onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                            placeholder="Idade"
                          />
                          <Select value={editData.gender} onValueChange={(value) => setEditData(prev => ({ ...prev, gender: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Gênero" />
                            </SelectTrigger>
                            <SelectContent>
                              {genders.map(gender => (
                                <SelectItem key={gender.value} value={gender.value}>
                                  {gender.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold">{character.name}</h2>
                        <p className="text-muted-foreground">{character.age} anos • {character.gender}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Role, Alignment, Location, Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Papel</label>
                    {isEditing ? (
                      <Select value={editData.role} onValueChange={(value) => setEditData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex items-center gap-2">
                                <role.icon className="w-4 h-4" />
                                {role.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={currentRole?.color}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {currentRole?.label}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Alinhamento</label>
                    {isEditing ? (
                      <Select value={editData.alignment} onValueChange={(value) => setEditData(prev => ({ ...prev, alignment: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {alignments.map(alignment => (
                            <SelectItem key={alignment.value} value={alignment.value}>
                              {alignment.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className={currentAlignment?.color}>
                        {currentAlignment?.label}
                      </Badge>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Local de Nascimento</label>
                    {isEditing ? (
                      <Select value={editData.birthPlace} onValueChange={(value) => setEditData(prev => ({ ...prev, birthPlace: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o local" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">{character.birthPlace || "Não definido"}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Organização</label>
                    {isEditing ? (
                      <Select value={editData.organization} onValueChange={(value) => setEditData(prev => ({ ...prev, organization: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a organização" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOrganizations.map((org) => (
                            <SelectItem key={org} value={org}>
                              {org}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">{character.organization || "Não definido"}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Descrição</label>
                  {isEditing ? (
                    <Textarea
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o personagem..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{character.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Appearance & Personality */}
            <Card>
              <CardHeader>
                <CardTitle>Aparência e Personalidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Aparência</label>
                  {isEditing ? (
                    <Textarea
                      value={editData.appearance}
                      onChange={(e) => setEditData(prev => ({ ...prev, appearance: e.target.value }))}
                      placeholder="Descreva a aparência do personagem..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{character.appearance}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Personalidade</label>
                  {isEditing ? (
                    <Textarea
                      value={editData.personality}
                      onChange={(e) => setEditData(prev => ({ ...prev, personality: e.target.value }))}
                      placeholder="Descreva a personalidade do personagem..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{character.personality}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Qualities */}
            <Card>
              <CardHeader>
                <CardTitle>Qualidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(isEditing ? editData.qualities : character.qualities).map((quality, index) => (
                    <Badge key={index} variant="secondary" className="relative">
                      {quality}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-4 w-4 p-0"
                          onClick={() => removeQuality(quality)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newQuality}
                      onChange={(e) => setNewQuality(e.target.value)}
                      placeholder="Nova qualidade..."
                      onKeyPress={(e) => e.key === 'Enter' && addQuality()}
                    />
                    <Button onClick={addQuality} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Family Tree */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Árvore Genealógica
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/book/${bookId || '1'}/character/${character.id}/family-tree`)}
                  >
                    <GitBranch className="w-4 h-4 mr-2" /> Ver árvore
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Grandparents */}
                <div className="text-center">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Avós</h4>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {(isEditing ? editData.family.grandparents : character.family.grandparents).map((grandparent, index) => (
                      <Badge key={index} variant="outline" className="relative">
                        {grandparent}
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeFamilyMember('grandparents', grandparent)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFamilyType('grandparent')}
                        className="h-6"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Parents */}
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <h4 className="text-xs font-medium mb-1 text-muted-foreground">Pai</h4>
                    {(isEditing ? editData.family.father : character.family.father) ? (
                      <Badge variant="secondary" className="relative">
                        {isEditing ? editData.family.father : character.family.father}
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeFamilyMember('father')}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </Badge>
                    ) : isEditing ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFamilyType('father')}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs font-medium mb-1 text-muted-foreground">Mãe</h4>
                    {(isEditing ? editData.family.mother : character.family.mother) ? (
                      <Badge variant="secondary" className="relative">
                        {isEditing ? editData.family.mother : character.family.mother}
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeFamilyMember('mother')}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </Badge>
                    ) : isEditing ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFamilyType('mother')}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                </div>

                {/* Current Character */}
                <div className="text-center">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-4 py-1">
                    {character.name}
                  </Badge>
                </div>

                {/* Spouse */}
                <div className="text-center">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Cônjuge</h4>
                  {(isEditing ? editData.family.spouse : character.family.spouse) ? (
                    <Badge variant="outline" className="relative">
                      {isEditing ? editData.family.spouse : character.family.spouse}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-4 w-4 p-0"
                          onClick={() => removeFamilyMember('spouse')}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ) : isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingFamilyType('spouse')}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>

                {/* Siblings */}
                <div className="text-center">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Irmãos</h4>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {(isEditing ? editData.family.siblings : character.family.siblings).map((sibling, index) => (
                      <Badge key={index} variant="secondary" className="relative">
                        {sibling}
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeFamilyMember('siblings', sibling)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFamilyType('sibling')}
                        className="h-6"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Children */}
                <div className="text-center">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Filhos</h4>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {(isEditing ? editData.family.children : character.family.children).map((child, index) => (
                      <Badge key={index} variant="outline" className="relative">
                        {child}
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeFamilyMember('children', child)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFamilyType('child')}
                        className="h-6"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Family Selection Modal */}
                {isEditing && editingFamilyType && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background border rounded-lg p-4 max-w-sm w-full mx-4">
                      <h3 className="font-semibold mb-3">
                        Adicionar {familyRelations.single.find(r => r.value === editingFamilyType)?.label || 
                                  familyRelations.multiple.find(r => r.value === editingFamilyType)?.label}
                      </h3>
                      <Select onValueChange={(value) => addFamilyMember(editingFamilyType, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar personagem" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCharacters.filter(c => c.id !== character.id).map(char => (
                            <SelectItem key={char.id} value={char.id}>
                              {char.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" onClick={() => setEditingFamilyType(null)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Relationships */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Relacionamentos
                  {isEditing && (
                    <Badge variant="secondary" className="ml-auto">
                      {(isEditing ? editData.relationships : character.relationships).length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                    <div className="text-sm font-medium">Novo Relacionamento</div>
                    <Select value={selectedRelationshipCharacter} onValueChange={setSelectedRelationshipCharacter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar personagem" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCharacters.filter(c => c.id !== character.id).map(char => (
                          <SelectItem key={char.id} value={char.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={char.image} alt={char.name} />
                                <AvatarFallback>{char.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {char.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedRelationshipType} onValueChange={setSelectedRelationshipType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de relacionamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{type.emoji}</span>
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Intensidade</label>
                        <Badge variant="outline">{relationshipIntensity[0]}%</Badge>
                      </div>
                      <Slider
                        value={relationshipIntensity}
                        onValueChange={setRelationshipIntensity}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <Button onClick={addRelationship} className="w-full" size="sm" disabled={!selectedRelationshipCharacter || !selectedRelationshipType}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Relacionamento
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  {(isEditing ? editData.relationships : character.relationships).map((rel) => {
                    const relType = relationshipTypes.find(t => t.value === rel.type);
                    const relChar = mockCharacters.find(c => c.id === rel.characterId);
                    
                    return (
                      <div key={rel.id} className={`p-3 rounded-lg border-2 ${relType?.color || 'bg-muted border-muted'} transition-all hover:shadow-sm`}>
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={relChar?.image} alt={relChar?.name} />
                            <AvatarFallback>{relChar?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{relType?.emoji}</span>
                              <span className="font-medium text-sm">{relChar?.name}</span>
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 ml-auto"
                                  onClick={() => removeRelationship(rel.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {relType?.label}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${rel.intensity}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">{rel.intensity}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(!character.relationships.length && !isEditing) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum relacionamento definido</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Qualidades</span>
                  <Badge variant="secondary">{character.qualities.length}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Relacionamentos</span>
                  <Badge variant="secondary">{character.relationships.length}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Membros da Família</span>
                  <Badge variant="secondary">
                    {Object.values(character.family).flat().filter(Boolean).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Character Navigation Sidebar */}
      <CharacterNavigationSidebar
        characters={mockCharacters}
        currentCharacterId={character.id}
        isOpen={showCharacterNav}
        onClose={() => setShowCharacterNav(false)}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Excluir Personagem"
        description="Esta ação não pode ser desfeita. Todos os dados do personagem serão perdidos permanentemente."
        itemName={character.name}
      />
    </div>
  );
}