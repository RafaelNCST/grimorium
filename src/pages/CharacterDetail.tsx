import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, MapPin, Users, Calendar, Heart, Crown, Sword, Shield, Upload, Plus, Minus, TreePine, Target, Frown, Smile, HeartHandshake, BookOpen, ChevronUp, ChevronDown, UserPlus, Menu } from "lucide-react";
import { CharacterNavigationSidebar } from "@/components/CharacterNavigationSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { toast } from "sonner";

// Mock data - in real app this would come from state management
const mockCharacter = {
  id: "1",
  name: "Aelric Valorheart",
  age: 23,
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
    cousins: []
  },
  relationships: [
    {
      id: "rel-1",
      characterId: "2",
      type: "amizade",
      intensity: 85
    },
    {
      id: "rel-2", 
      characterId: "4",
      type: "interesse_amoroso",
      intensity: 70
    },
    {
      id: "rel-3",
      characterId: "8",
      type: "rivalidade",
      intensity: 60
    }
  ]
};

const roles = [
  { value: "protagonista", label: "Protagonista", icon: Crown, color: "bg-accent text-accent-foreground" },
  { value: "antagonista", label: "Antagonista", icon: Sword, color: "bg-destructive text-destructive-foreground" },
  { value: "vilao", label: "Vilão", icon: Sword, color: "bg-destructive text-destructive-foreground" },
  { value: "secundario", label: "Secundário", icon: Users, color: "bg-secondary text-secondary-foreground" },
  { value: "figurante", label: "Figurante", icon: Heart, color: "bg-muted text-muted-foreground" }
];

const alignments = [
  { value: "bem", label: "Bem", color: "text-green-600" },
  { value: "neutro", label: "Neutro", color: "text-yellow-600" },
  { value: "caotico", label: "Caótico", color: "text-red-600" }
];

// Mock data for selects
const mockOrganizations = [
  { id: "1", name: "Ordem dos Guardiões" },
  { id: "2", name: "Guilda dos Mercadores" },
  { id: "3", name: "Academia Arcana" },
  { id: "4", name: "Conselho Real" },
  { id: "5", name: "Irmandade das Sombras" }
];

const mockLocations = [
  { id: "1", name: "Vila Pedraverde", type: "vila" },
  { id: "2", name: "Capital Elaria", type: "cidade" },
  { id: "3", name: "Porto Dourado", type: "cidade" },
  { id: "4", name: "Floresta Sombria", type: "floresta" },
  { id: "5", name: "Montanhas Geladas", type: "montanha" }
];

// Mock characters for family relationships
const mockCharacters = [
  { id: "1", name: "Aelric Valorheart" },
  { id: "2", name: "Elena Moonwhisper" },
  { id: "3", name: "Marcus Ironforge" },
  { id: "4", name: "Lyra Starweaver" },
  { id: "5", name: "Thane Stormborn" },
  { id: "6", name: "Aria Nightsong" },
  { id: "7", name: "Gareth Goldshield" },
  { id: "8", name: "Vera Shadowbane" },
  { id: "9", name: "Duncan Firebeard" },
  { id: "10", name: "Seraphina Dawnbringer" }
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [character, setCharacter] = useState(mockCharacter);
  const [editData, setEditData] = useState({...mockCharacter, relationships: mockCharacter.relationships || []});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newQuality, setNewQuality] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(mockCharacter.image);
  const [selectedRelationshipCharacter, setSelectedRelationshipCharacter] = useState("");
  const [selectedRelationshipType, setSelectedRelationshipType] = useState("");
  const [relationshipIntensity, setRelationshipIntensity] = useState([50]);
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  
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
    navigate("/book/1/characters");
  };

  const handleCancel = () => {
    setEditData({...character, relationships: character.relationships || []});
    setIsEditing(false);
  };

  const handleAddQuality = () => {
    if (newQuality.trim() && !editData.qualities.includes(newQuality.trim())) {
      setEditData(prev => ({
        ...prev,
        qualities: [...prev.qualities, newQuality.trim()]
      }));
      setNewQuality("");
    }
  };

  const handleRemoveQuality = (qualityToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      qualities: prev.qualities.filter(q => q !== qualityToRemove)
    }));
  };

  const handleFamilyRelationChange = (relationType: string, characterId: string | null) => {
    setEditData(prev => {
      const newFamily = { ...prev.family };
      
      // Remove previous relation if exists
      Object.keys(newFamily).forEach(key => {
        if (Array.isArray(newFamily[key])) {
          newFamily[key] = newFamily[key].filter((id: string) => id !== characterId);
        } else if (newFamily[key] === characterId) {
          newFamily[key] = null;
        }
      });
      
      // Add new relation
      if (characterId && characterId !== "none") {
        switch (relationType) {
          case "father":
          case "mother":
          case "spouse":
            newFamily[relationType] = characterId;
            break;
          case "child":
            if (!newFamily.children.includes(characterId)) {
              newFamily.children.push(characterId);
            }
            break;
          case "sibling":
            if (!newFamily.siblings.includes(characterId)) {
              newFamily.siblings.push(characterId);
            }
            break;
          case "halfSibling":
            if (!newFamily.halfSiblings.includes(characterId)) {
              newFamily.halfSiblings.push(characterId);
            }
            break;
          case "uncleAunt":
            if (!newFamily.unclesAunts.includes(characterId)) {
              newFamily.unclesAunts.push(characterId);
            }
            break;
          case "grandparent":
            if (!newFamily.grandparents.includes(characterId)) {
              newFamily.grandparents.push(characterId);
            }
            break;
          case "cousin":
            if (!newFamily.cousins.includes(characterId)) {
              newFamily.cousins.push(characterId);
            }
            break;
        }
      }
      
      return {
        ...prev,
        family: newFamily
      };
    });
  };

  const getFamilyRelationLabel = (relationType: string, characterName: string) => {
    const relations = {
      father: `Pai de ${characterName}`,
      mother: `Mãe de ${characterName}`,
      child: `Filho(a) de ${characterName}`,
      sibling: `Irmão(ã) de ${characterName}`,
      spouse: `Cônjuge de ${characterName}`,
      halfSibling: `Meio-irmão(ã) de ${characterName}`,
      uncleAunt: `Tio(a) de ${characterName}`,
      grandparent: `Avô(ó) de ${characterName}`,
      cousin: `Primo(a) de ${characterName}`
    };
    return relations[relationType] || "";
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setEditData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgeChange = (increment: boolean) => {
    setEditData(prev => ({
      ...prev,
      age: Math.max(0, prev.age + (increment ? 1 : -1))
    }));
  };

  const handleAddRelationship = () => {
    if (selectedRelationshipCharacter && selectedRelationshipType) {
      const newRelationship = {
        id: `rel-${Date.now()}`,
        characterId: selectedRelationshipCharacter,
        type: selectedRelationshipType,
        intensity: relationshipIntensity[0]
      };
      
      setEditData(prev => ({
        ...prev,
        relationships: [...(prev.relationships || []), newRelationship]
      }));
      
      setSelectedRelationshipCharacter("");
      setSelectedRelationshipType("");
      setRelationshipIntensity([50]);
      toast.success("Relacionamento adicionado com sucesso!");
    }
  };

  const handleRemoveRelationship = (relationshipId: string) => {
    setEditData(prev => ({
      ...prev,
      relationships: prev.relationships?.filter(rel => rel.id !== relationshipId) || []
    }));
    toast.success("Relacionamento removido com sucesso!");
  };

  const handleUpdateRelationshipIntensity = (relationshipId: string, intensity: number) => {
    setEditData(prev => ({
      ...prev,
      relationships: prev.relationships?.map(rel => 
        rel.id === relationshipId ? { ...rel, intensity } : rel
      ) || []
    }));
  };

  const getRelationshipTypeData = (type: string) => {
    return relationshipTypes.find(rt => rt.value === type) || relationshipTypes[0];
  };

  const handleCharacterSelect = (characterId: string) => {
    // Navigate directly without adding to history stack
    window.location.replace(`/book/1/character/${characterId}`);
  };

  return (
    <div className="flex min-h-screen">
      <CharacterNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={() => setIsNavigationSidebarOpen(false)}
        characters={mockCharacters.map(char => ({ 
          id: char.id, 
          name: char.name, 
          image: char.id === "1" ? mockCharacter.image : `https://images.unsplash.com/photo-150700321${char.id}?w=300&h=300&fit=crop&crop=face`
        }))}
        currentCharacterId={character.id}
        onCharacterSelect={handleCharacterSelect}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsNavigationSidebarOpen(true)}
              className="hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{character.name}</h1>
              <p className="text-muted-foreground">Detalhes do personagem</p>
            </div>
          </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="magical" onClick={handleSave}>
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card className="card-magical">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Imagem do Personagem</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div 
                          className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-border rounded-full cursor-pointer hover:border-primary/50 transition-colors mx-auto"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {imagePreview ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover rounded-full"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                <Upload className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Clique para selecionar uma imagem</p>
                            </div>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do personagem"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => handleAgeChange(false)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="age"
                        type="number"
                        value={editData.age}
                        onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                        className="mx-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                        max="999"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => handleAgeChange(true)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Papel</Label>
                    <Select value={editData.role} onValueChange={(value) => setEditData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o papel" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alignment */}
                  <div className="space-y-2">
                    <Label htmlFor="alignment">Alinhamento</Label>
                    <Select value={editData.alignment} onValueChange={(value) => setEditData(prev => ({ ...prev, alignment: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o alinhamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {alignments.map((alignment) => (
                          <SelectItem key={alignment.value} value={alignment.value}>
                            {alignment.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição do personagem"
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Appearance */}
                  <div className="space-y-2">
                    <Label htmlFor="appearance">Aparência Física</Label>
                    <Textarea
                      id="appearance"
                      value={editData.appearance}
                      onChange={(e) => setEditData(prev => ({ ...prev, appearance: e.target.value }))}
                      placeholder="Descrição da aparência física"
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Personality */}
                  <div className="space-y-2">
                    <Label htmlFor="personality">Personalidade</Label>
                    <Textarea
                      id="personality"
                      value={editData.personality}
                      onChange={(e) => setEditData(prev => ({ ...prev, personality: e.target.value }))}
                      placeholder="Descrição da personalidade"
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Birth Place */}
                  <div className="space-y-2">
                    <Label htmlFor="birthPlace">Local de Nascimento</Label>
                    <Select value={editData.birthPlace} onValueChange={(value) => setEditData(prev => ({ ...prev, birthPlace: value === "none" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o local de nascimento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {mockLocations.map((location) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name} ({location.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Affiliated Place */}
                  <div className="space-y-2">
                    <Label htmlFor="affiliatedPlace">Local Afiliado</Label>
                    <Select value={editData.affiliatedPlace} onValueChange={(value) => setEditData(prev => ({ ...prev, affiliatedPlace: value === "none" ? "" : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o local afiliado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {mockLocations.map((location) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name} ({location.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                     </Select>
                   </div>

                    {/* Family Relations */}
                    <div className="space-y-4">
                      <Label>Relações Familiares</Label>
                      
                      {/* Single-value relations */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {familyRelations.single.map((relation) => (
                          <div key={relation.value} className="space-y-2">
                            <Label className="text-sm">{relation.label}</Label>
                            <Select 
                              value={
                                relation.value === "father" ? editData.family.father || "none" :
                                relation.value === "mother" ? editData.family.mother || "none" :
                                relation.value === "spouse" ? editData.family.spouse || "none" :
                                "none"
                              }
                              onValueChange={(value) => handleFamilyRelationChange(relation.value, value === "none" ? null : value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Selecione ${relation.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Nenhum</SelectItem>
                                {mockCharacters
                                  .filter(char => char.id !== editData.id)
                                  .map((char) => (
                                  <SelectItem key={char.id} value={char.id}>
                                    {char.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                      
                      {/* Multi-select relations */}
                      <div className="space-y-4">
                        {familyRelations.multiple.map((relation) => {
                          const currentRelations = editData.family[
                            relation.value === "child" ? "children" : 
                            relation.value === "sibling" ? "siblings" :
                            relation.value === "halfSibling" ? "halfSiblings" :
                            relation.value === "uncleAunt" ? "unclesAunts" :
                            "cousins"
                          ];
                          
                          return (
                            <div key={relation.value} className="space-y-2">
                              <Label className="text-sm">{relation.label}s</Label>
                              <Select onValueChange={(value) => handleFamilyRelationChange(relation.value, value === "none" ? null : value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Adicionar ${relation.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Selecione</SelectItem>
                                  {mockCharacters
                                    .filter(char => char.id !== editData.id && !currentRelations.includes(char.id))
                                    .map((char) => (
                                    <SelectItem key={char.id} value={char.id}>
                                      {char.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              {/* Display current relations */}
                              {currentRelations.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {currentRelations.map((relationId: string) => {
                                    const relatedChar = mockCharacters.find(c => c.id === relationId);
                                    return relatedChar ? (
                                      <Badge key={relationId} variant="secondary" className="flex items-center gap-1">
                                        {relatedChar.name}
                                        <button
                                          type="button"
                                          onClick={() => handleFamilyRelationChange(relation.value, relationId)}
                                          className="ml-1 hover:text-destructive"
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                 </div>
               ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={character.image} />
                      <AvatarFallback className="text-lg">
                        {character.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-semibold">{character.name}</h2>
                        <Badge className={currentRole?.color}>
                          <RoleIcon className="w-4 h-4 mr-1" />
                          {currentRole?.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {character.age} anos
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          <span className={currentAlignment?.color}>
                            {currentAlignment?.label}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-foreground">{character.description}</p>
                    </div>
                  </div>

                  {character.appearance && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Aparência Física</h4>
                        <p className="text-sm text-muted-foreground">{character.appearance}</p>
                      </div>
                    </>
                  )}

                  {character.personality && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Personalidade</h4>
                        <p className="text-sm text-muted-foreground">{character.personality}</p>
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {character.birthPlace && (
                      <div>
                        <h4 className="font-semibold mb-1 text-sm">Local de Nascimento</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{character.birthPlace}</span>
                        </div>
                      </div>
                    )}
                    {character.affiliatedPlace && (
                      <div>
                        <h4 className="font-semibold mb-1 text-sm">Local Afiliado</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{character.affiliatedPlace}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Family Relations Card */}
          <Card className="card-magical">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Relações Familiares</span>
                <Button variant="outline" size="sm" onClick={() => navigate(`/book/1/character/${character.id}/family-tree`)}>
                  <TreePine className="w-4 h-4 mr-2" />
                  Ver Árvore
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Direct Family */}
              {(character.family.father || character.family.mother || character.family.spouse) && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Família Direta</h4>
                  <div className="space-y-2">
                    {character.family.father && (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-3 h-3 text-blue-500" />
                        <span className="text-muted-foreground">Pai:</span>
                        <span>{mockCharacters.find(c => c.id === character.family.father)?.name}</span>
                      </div>
                    )}
                    {character.family.mother && (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-3 h-3 text-pink-500" />
                        <span className="text-muted-foreground">Mãe:</span>
                        <span>{mockCharacters.find(c => c.id === character.family.mother)?.name}</span>
                      </div>
                    )}
                    {character.family.spouse && (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span className="text-muted-foreground">Cônjuge:</span>
                        <span>{mockCharacters.find(c => c.id === character.family.spouse)?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Children */}
              {character.family.children.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Filhos</h4>
                  <div className="flex flex-wrap gap-1">
                    {character.family.children.map((childId: string) => {
                      const child = mockCharacters.find(c => c.id === childId);
                      return child ? (
                        <Badge key={childId} variant="secondary" className="text-xs">
                          {child.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Siblings */}
              {(character.family.siblings.length > 0 || character.family.halfSiblings.length > 0) && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Irmãos</h4>
                  <div className="space-y-2">
                    {character.family.siblings.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Irmãos:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {character.family.siblings.map((siblingId: string) => {
                            const sibling = mockCharacters.find(c => c.id === siblingId);
                            return sibling ? (
                              <Badge key={siblingId} variant="secondary" className="text-xs">
                                {sibling.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    {character.family.halfSiblings.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Meio-irmãos:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {character.family.halfSiblings.map((halfSiblingId: string) => {
                            const halfSibling = mockCharacters.find(c => c.id === halfSiblingId);
                            return halfSibling ? (
                              <Badge key={halfSiblingId} variant="outline" className="text-xs">
                                {halfSibling.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Extended Family */}
              {(character.family.grandparents.length > 0 || character.family.unclesAunts.length > 0 || character.family.cousins.length > 0) && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Família Extendida</h4>
                  <div className="space-y-2">
                    {character.family.grandparents.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Avós:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {character.family.grandparents.map((grandparentId: string) => {
                            const grandparent = mockCharacters.find(c => c.id === grandparentId);
                            return grandparent ? (
                              <Badge key={grandparentId} variant="secondary" className="text-xs">
                                {grandparent.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    {character.family.unclesAunts.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Tios:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {character.family.unclesAunts.map((uncleAuntId: string) => {
                            const uncleAunt = mockCharacters.find(c => c.id === uncleAuntId);
                            return uncleAunt ? (
                              <Badge key={uncleAuntId} variant="secondary" className="text-xs">
                                {uncleAunt.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    {character.family.cousins.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Primos:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {character.family.cousins.map((cousinId: string) => {
                            const cousin = mockCharacters.find(c => c.id === cousinId);
                            return cousin ? (
                              <Badge key={cousinId} variant="secondary" className="text-xs">
                                {cousin.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!character.family.father && !character.family.mother && !character.family.spouse && 
               character.family.children.length === 0 && character.family.siblings.length === 0 && 
               character.family.halfSiblings.length === 0 && character.family.grandparents.length === 0 && 
               character.family.unclesAunts.length === 0 && character.family.cousins.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma relação familiar definida</p>
                  <p className="text-xs">Use o modo de edição para adicionar familiares</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Relationships Card */}
          <Card className="card-magical">
            <CardHeader>
              <CardTitle>Relacionamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  {/* Add Relationship Form */}
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-semibold text-sm">Adicionar Relacionamento</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <Label>Personagem</Label>
                        <Select value={selectedRelationshipCharacter} onValueChange={setSelectedRelationshipCharacter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um personagem" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCharacters
                              .filter(char => char.id !== character.id)
                              .filter(char => !editData.relationships?.some(rel => rel.characterId === char.id))
                              .map((char) => (
                                <SelectItem key={char.id} value={char.id}>
                                  {char.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tipo de Relacionamento</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-background">
                          {relationshipTypes.map((type) => (
                            <div
                              key={type.value}
                              className={`cursor-pointer p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                selectedRelationshipType === type.value
                                  ? 'border-primary bg-primary/10'
                                  : 'border-muted hover:border-primary/50'
                              }`}
                              onClick={() => setSelectedRelationshipType(type.value)}
                            >
                              <div className="text-center space-y-1">
                                <div className="text-2xl">{type.emoji}</div>
                                <div className="text-xs font-medium">{type.label}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Intensidade: {relationshipIntensity[0]}%</Label>
                        <Slider
                          value={relationshipIntensity}
                          onValueChange={setRelationshipIntensity}
                          max={100}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleAddRelationship} 
                        disabled={!selectedRelationshipCharacter || !selectedRelationshipType}
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {/* Current Relationships List */}
                  {editData.relationships && editData.relationships.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Relacionamentos Atuais</h4>
                      {editData.relationships.map((relationship) => {
                        const relatedChar = mockCharacters.find(c => c.id === relationship.characterId);
                        const typeData = getRelationshipTypeData(relationship.type);
                        
                        return relatedChar ? (
                          <div key={relationship.id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{typeData.emoji}</span>
                                <span className="font-medium text-sm">{relatedChar.name}</span>
                                <Badge variant="outline" className={typeData.color}>
                                  {typeData.label}
                                </Badge>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveRelationship(relationship.id)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Intensidade: {relationship.intensity}%</Label>
                              <Slider
                                value={[relationship.intensity]}
                                onValueChange={(value) => handleUpdateRelationshipIntensity(relationship.id, value[0])}
                                max={100}
                                min={1}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {character.relationships && character.relationships.length > 0 ? (
                    character.relationships.map((relationship) => {
                      const relatedChar = mockCharacters.find(c => c.id === relationship.characterId);
                      const typeData = getRelationshipTypeData(relationship.type);
                      
                      return relatedChar ? (
                        <div key={relationship.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{typeData.emoji}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{relatedChar.name}</span>
                                <Badge variant="outline" className={typeData.color}>
                                  {typeData.label}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Intensidade: {relationship.intensity}%
                              </div>
                            </div>
                          </div>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${relationship.intensity}%` }}
                            />
                          </div>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum relacionamento definido</p>
                      <p className="text-xs">Use o modo de edição para adicionar relacionamentos</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Qualities */}
          <Card className="card-magical">
            <CardHeader>
              <CardTitle>Qualidades</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  {/* Add Quality Input */}
                  <div className="flex gap-2">
                    <Input
                      value={newQuality}
                      onChange={(e) => setNewQuality(e.target.value)}
                      placeholder="Adicionar nova qualidade"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddQuality()}
                    />
                    <Button size="sm" onClick={handleAddQuality}>
                      Adicionar
                    </Button>
                  </div>
                  
                  {/* Quality List */}
                  <div className="flex flex-wrap gap-2">
                    {editData.qualities.map((quality) => (
                      <Badge key={quality} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleRemoveQuality(quality)}>
                        {quality} ×
                      </Badge>
                    ))}
                  </div>
                  
                  {editData.qualities.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma qualidade adicionada. Clique em "Adicionar" para incluir qualidades.</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {character.qualities.map((quality) => (
                    <Badge key={quality} variant="secondary">
                      {quality}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="card-magical">
            <CardHeader>
              <CardTitle>Organização</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Select value={editData.organization} onValueChange={(value) => setEditData(prev => ({ ...prev, organization: value === "none" ? "" : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma organização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {mockOrganizations.map((org) => (
                      <SelectItem key={org.id} value={org.name}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{character.organization || "Nenhuma organização"}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Excluir Personagem"
        description={`O personagem "${character.name}" será permanentemente removido.`}
        itemName={character.name}
        itemType="personagem"
       />
        </div>
      </div>
    </div>
  );
}