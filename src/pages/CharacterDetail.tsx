import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, MapPin, Users, Calendar, Heart, Crown, Sword, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
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

export function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [character, setCharacter] = useState(mockCharacter);
  const [editData, setEditData] = useState(mockCharacter);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    setEditData(character);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
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
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={character.image} />
                    <AvatarFallback className="text-2xl">
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
              <div className="flex flex-wrap gap-2">
                {character.qualities.map((quality) => (
                  <Badge key={quality} variant="secondary">
                    {quality}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="card-magical">
            <CardHeader>
              <CardTitle>Organização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{character.organization || "Nenhuma organização"}</span>
              </div>
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
  );
}