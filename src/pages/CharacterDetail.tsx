import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, MapPin, Users, Calendar, Heart, Crown, Sword, Shield, Upload, Plus, Minus, TreePine, Target, Frown, Smile, HeartHandshake, BookOpen, ChevronUp, ChevronDown, UserPlus, Search, Menu, X, GripVertical, FileText, List, Tags, Palette, Eye, EyeOff } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { CharacterNavigationSidebar } from "@/components/CharacterNavigationSidebar";
import { toast } from "sonner";

// Custom field interfaces
interface BaseCustomField {
  id: string;
  type: string;
  name: string;
  order: number;
}

interface TextCustomField extends BaseCustomField {
  type: 'text';
  value: string;
}

interface SelectCustomField extends BaseCustomField {
  type: 'select';
  value: string;
  options: string[];
}

interface MultiSelectCustomField extends BaseCustomField {
  type: 'multiselect';
  value: string[];
  options: string[];
}

interface IconPickerCustomField extends BaseCustomField {
  type: 'iconpicker';
  value: string;
  options: string[];
}

type CustomField = TextCustomField | SelectCustomField | MultiSelectCustomField | IconPickerCustomField;

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
  customFields?: CustomField[];
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
  customFields: [
    { id: 'cf1', type: 'text', name: 'Profissão Anterior', value: 'Pastor', order: 0 },
    { id: 'cf2', type: 'select', name: 'Classe Social', value: 'Plebeu', options: ['Plebeu', 'Nobre', 'Mercador', 'Artesão'], order: 1 },
    { id: 'cf3', type: 'multiselect', name: 'Idiomas', value: ['Comum', 'Élfico'] as string[], options: ['Comum', 'Élfico', 'Anão', 'Dracônico', 'Celestial'], order: 2 }
  ],
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
  { id: "1", name: "Aelric Valorheart", role: "protagonista", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
  { id: "2", name: "Elena Moonwhisper", role: "secundario", image: "https://images.unsplash.com/photo-1494790108755-2616b612b732?w=300&h=300&fit=crop&crop=face" },
  { id: "3", name: "Marcus Ironforge", role: "secundario", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
  { id: "4", name: "Lyra Starweaver", role: "protagonista", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" },
  { id: "5", name: "Thane Stormborn", role: "antagonista", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face" },
  { id: "6", name: "Aria Nightsong", role: "secundario" },
  { id: "7", name: "Gareth Goldshield", role: "figurante" },
  { id: "8", name: "Vera Shadowbane", role: "antagonista" },
  { id: "9", name: "Duncan Firebeard", role: "secundario" },
  { id: "10", name: "Seraphina Dawnbringer", role: "secundario" }
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

// Custom field types
const fieldTypes = [
  { value: 'text', label: 'Texto', icon: FileText },
  { value: 'select', label: 'Dropdown', icon: List },
  { value: 'multiselect', label: 'Multi-seleção', icon: Tags },
  { value: 'iconpicker', label: 'Picker de Ícone', icon: Palette }
];

// Required field order
const requiredFields = ['image', 'name', 'role', 'description', 'gender', 'age'];

export function CharacterDetail() {
  const { id } = useParams();
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
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [newField, setNewField] = useState({ name: '', type: 'text', options: [] as string[] });
  const [newOption, setNewOption] = useState('');
  
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

  const handleCancel = () => {
    setEditData({...character, relationships: character.relationships || []});
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate("/book/1");
  };

  const handleAddCustomField = () => {
    if (newField.name.trim()) {
      const field: CustomField = {
        id: `cf-${Date.now()}`,
        type: newField.type as any,
        name: newField.name,
        value: newField.type === 'multiselect' ? [] : '',
        options: newField.options,
        order: (editData.customFields?.length || 0)
      } as CustomField;
      
      setEditData(prev => ({
        ...prev,
        customFields: [...(prev.customFields || []), field]
      }));
      
      setNewField({ name: '', type: 'text', options: [] });
      setShowAddFieldDialog(false);
      toast.success("Campo adicionado com sucesso!");
    }
  };

  const handleRemoveCustomField = (fieldId: string) => {
    setEditData(prev => ({
      ...prev,
      customFields: prev.customFields?.filter(f => f.id !== fieldId) || []
    }));
    toast.success("Campo removido com sucesso!");
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      customFields: prev.customFields?.map(f => 
        f.id === fieldId ? { ...f, value } : f
      ) || []
    }));
  };

  const handleAddOption = () => {
    if (newOption.trim() && !newField.options.includes(newOption.trim())) {
      setNewField(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (option: string) => {
    setNewField(prev => ({
      ...prev,
      options: prev.options.filter(o => o !== option)
    }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Character Navigation Sidebar */}
      <CharacterNavigationSidebar
        characters={mockCharacters}
        currentCharacterId={character.id}
        isOpen={showCharacterNav}
        onClose={() => setShowCharacterNav(false)}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCharacterNav(true)}
                className="flex items-center gap-2"
              >
                <Menu className="w-4 h-4" />
                Personagens
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

          {/* Required Fields Card */}
          <Card className="card-magical mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Informações Básicas (Obrigatórias)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Photo */}
              <div className="space-y-2">
                <Label>Foto do Personagem</Label>
                {isEditing ? (
                  <div 
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Clique para selecionar</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-lg overflow-hidden border">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        setImagePreview(result);
                        setEditData(prev => ({ ...prev, image: result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do personagem"
                  />
                ) : (
                  <p className="text-lg font-semibold">{character.name}</p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Papel *</Label>
                {isEditing ? (
                  <Select value={editData.role} onValueChange={(value) => setEditData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar papel" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
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
                    {currentRole && <currentRole.icon className="w-3 h-3 mr-1" />}
                    {currentRole?.label}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição Básica *</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição básica do personagem"
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{character.description}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                {isEditing ? (
                  <Select value={editData.gender} onValueChange={(value) => setEditData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Não-binário">Não-binário</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p>{character.gender}</p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Idade *</Label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setEditData(prev => ({ ...prev, age: Math.max(0, prev.age - 1) }))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      id="age"
                      type="number"
                      value={editData.age}
                      onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                      className="text-center"
                      min="0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setEditData(prev => ({ ...prev, age: prev.age + 1 }))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p>{character.age} anos</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Custom Fields */}
          {(editData.customFields && editData.customFields.length > 0) && (
            <Card className="card-magical mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Campos Personalizados
                  </CardTitle>
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddFieldDialog(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Campo
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editData.customFields
                  ?.filter(field => field.value && (Array.isArray(field.value) ? field.value.length > 0 : field.value.toString().trim() !== ''))
                  .map((field) => (
                  <div key={field.id} className="space-y-2 relative group">
                    {isEditing && (
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveCustomField(field.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    
                    <Label>{field.name}</Label>
                    {isEditing ? (
                      <>
                        {field.type === 'text' && (
                          <Input
                            value={field.value as string}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          />
                        )}
                        {field.type === 'select' && (
                          <Select 
                            value={field.value as string} 
                            onValueChange={(value) => handleCustomFieldChange(field.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {field.type === 'multiselect' && (
                          <div className="space-y-2">
                            <Select onValueChange={(value) => {
                              const currentValues = Array.isArray(field.value) ? field.value : [];
                              if (!currentValues.includes(value)) {
                                handleCustomFieldChange(field.id, [...currentValues, value]);
                              }
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Adicionar opção" />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map(option => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(field.value) && field.value.map(value => (
                                <Badge key={value} variant="secondary" className="text-xs">
                                  {value}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 ml-1"
                                    onClick={() => {
                                      const newValues = (field.value as string[]).filter((v: string) => v !== value);
                                      handleCustomFieldChange(field.id, newValues);
                                    }}
                                  >
                                    <X className="w-2 h-2" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        {field.type === 'multiselect' && Array.isArray(field.value) ? (
                          <div className="flex flex-wrap gap-1">
                            {field.value.map(value => (
                              <Badge key={value} variant="secondary" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p>{field.value as string}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Add Custom Field Button for editing mode when no fields */}
          {isEditing && (!editData.customFields || editData.customFields.length === 0) && (
            <Card className="card-magical mb-6">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Nenhum campo personalizado ainda</p>
                <Button 
                  variant="outline"
                  onClick={() => setShowAddFieldDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Campo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Appearance */}
          {(!isEditing && character.appearance) && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Aparência Física</h4>
                <p className="text-sm text-muted-foreground">{character.appearance}</p>
              </div>
            </>
          )}
          {isEditing && (
            <>
              <Separator />
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
            </>
          )}

          {/* Personality */}
          {(!isEditing && character.personality) && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Personalidade</h4>
                <p className="text-sm text-muted-foreground">{character.personality}</p>
              </div>
            </>
          )}
          {isEditing && (
            <>
              <Separator />
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
            </>
          )}

          {/* Birth Place and Affiliated Place */}
          {(!isEditing && (character.birthPlace || character.affiliatedPlace)) && (
            <>
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
            </>
          )}
          {isEditing && (
            <>
              <Separator />
              <div className="space-y-4">
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
              </div>
            </>
          )}

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
                        onClick={() => {
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
                        }} 
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
                        const typeData = relationshipTypes.find(rt => rt.value === relationship.type) || relationshipTypes[0];
                        
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
                                onClick={() => {
                                  setEditData(prev => ({
                                    ...prev,
                                    relationships: prev.relationships?.filter(rel => rel.id !== relationship.id) || []
                                  }));
                                  toast.success("Relacionamento removido com sucesso!");
                                }}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Intensidade: {relationship.intensity}%</Label>
                              <Slider
                                value={[relationship.intensity]}
                                onValueChange={(value) => {
                                  setEditData(prev => ({
                                    ...prev,
                                    relationships: prev.relationships?.map(rel => 
                                      rel.id === relationship.id ? { ...rel, intensity: value[0] } : rel
                                    ) || []
                                  }));
                                }}
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
                      const typeData = relationshipTypes.find(rt => rt.value === relationship.type) || relationshipTypes[0];
                      
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
      </div>

      {/* Add Field Dialog */}
      <Dialog open={showAddFieldDialog} onOpenChange={setShowAddFieldDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Campo Personalizado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Campo</Label>
              <Input
                value={newField.name}
                onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Classe Social, Profissão, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Campo</Label>
              <Select value={newField.type} onValueChange={(value) => setNewField(prev => ({ ...prev, type: value, options: [] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(newField.type === 'select' || newField.type === 'multiselect') && (
              <div className="space-y-2">
                <Label>Opções</Label>
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Digite uma opção"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                  />
                  <Button type="button" onClick={handleAddOption}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newField.options.map(option => (
                    <Badge key={option} variant="secondary">
                      {option}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => handleRemoveOption(option)}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddFieldDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCustomField} disabled={!newField.name.trim()}>
                Adicionar Campo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
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
