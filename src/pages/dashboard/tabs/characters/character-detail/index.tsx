import { useState, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Users,
  Crown,
  Sword,
  Shield,
  Target,
  User,
  UserCheck,
  Users2,
  Ban,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

import { type CharacterVersion } from "@/components/character-version-manager";
import {
  mockCharacters,
  mockLocations,
  mockOrganizations,
} from "@/mocks/global";
import { mockCharacterDetail } from "@/mocks/local/character-data";

import { CharacterDetailView } from "./view";

const mockCharacter = mockCharacterDetail;

const roles = [
  {
    value: "protagonista",
    label: "Protagonista",
    icon: Crown,
    color: "bg-accent text-accent-foreground",
  },
  {
    value: "co-protagonista",
    label: "Co-protagonista",
    icon: UserCheck,
    color: "bg-accent/80 text-accent-foreground",
  },
  {
    value: "antagonista",
    label: "Antagonista",
    icon: Sword,
    color: "bg-destructive text-destructive-foreground",
  },
  {
    value: "vilao",
    label: "Vilão",
    icon: Sword,
    color: "bg-destructive text-destructive-foreground",
  },
  {
    value: "secundario",
    label: "Secundário",
    icon: Users,
    color: "bg-secondary text-secondary-foreground",
  },
  {
    value: "figurante",
    label: "Figurante",
    icon: Users,
    color: "bg-muted text-muted-foreground",
  },
];

const alignments = [
  {
    value: "bem",
    label: "Bem",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-500/10 border-green-500/20",
  },
  {
    value: "neutro",
    label: "Neutro",
    icon: Target,
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    value: "caotico",
    label: "Caótico",
    icon: Sword,
    color: "text-red-600",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
];

const genders = [
  { value: "masculino", label: "Masculino", icon: User },
  { value: "feminino", label: "Feminino", icon: Users2 },
  { value: "transgenero", label: "Transgênero", icon: UserCheck },
  { value: "assexuado", label: "Assexuado", icon: Ban },
  { value: "outro", label: "Outro", icon: HelpCircle },
];

const familyRelations = {
  single: [
    { value: "father", label: "Pai" },
    { value: "mother", label: "Mãe" },
    { value: "spouse", label: "Cônjuge" },
  ],
  multiple: [
    { value: "child", label: "Filho/Filha" },
    { value: "sibling", label: "Irmão/Irmã" },
    { value: "halfSibling", label: "Meio-irmão/Meio-irmã" },
    { value: "uncleAunt", label: "Tio/Tia" },
    { value: "cousin", label: "Primo/Prima" },
  ],
};

const relationshipTypes = [
  {
    value: "odio",
    label: "Ódio",
    emoji: "😡",
    color: "bg-red-500/10 text-red-600",
  },
  {
    value: "amor",
    label: "Amor",
    emoji: "❤️",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    value: "interesse_amoroso",
    label: "Interesse Amoroso",
    emoji: "💕",
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    value: "mentorado",
    label: "Mentorado",
    emoji: "🎓",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    value: "subordinacao",
    label: "Subordinação",
    emoji: "🫡",
    color: "bg-gray-500/10 text-gray-600",
  },
  {
    value: "rivalidade",
    label: "Rivalidade",
    emoji: "⚔️",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    value: "lideranca",
    label: "Liderança",
    emoji: "👑",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    value: "amizade",
    label: "Amizade",
    emoji: "😊",
    color: "bg-green-500/10 text-green-600",
  },
  {
    value: "melhores_amigos",
    label: "Melhores Amigos",
    emoji: "👥",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    value: "inimizade",
    label: "Inimizade",
    emoji: "😤",
    color: "bg-red-600/10 text-red-700",
  },
  {
    value: "neutro",
    label: "Neutro",
    emoji: "😐",
    color: "bg-slate-500/10 text-slate-600",
  },
];

export function CharacterDetail() {
  const { dashboardId, characterId } = useParams({
    from: "/dashboard/$dashboardId/tabs/character/$characterId/",
  });
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [character, setCharacter] = useState(mockCharacter);
  const [editData, setEditData] = useState({
    ...mockCharacter,
    relationships: mockCharacter.relationships || [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newQuality, setNewQuality] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(mockCharacter.image);
  const [selectedRelationshipCharacter, setSelectedRelationshipCharacter] =
    useState("");
  const [selectedRelationshipType, setSelectedRelationshipType] = useState("");
  const [relationshipIntensity, setRelationshipIntensity] = useState([50]);
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);

  // Character versions state
  const [versions, setVersions] = useState<CharacterVersion[]>([
    {
      id: "version-1",
      name: "Versão Original",
      description: "Estado inicial do personagem",
      createdAt: new Date(),
      isActive: true,
      data: mockCharacter,
    },
  ]);
  const [currentVersion, setCurrentVersion] = useState(versions[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentRole = roles.find((r) => r.value === character.role);
  const currentAlignment = alignments.find(
    (a) => a.value === character.alignment
  );
  const currentGender = genders.find((g) => g.value === character.gender);
  const RoleIcon = currentRole?.icon || Users;

  // Version management functions
  const handleVersionChange = (version: CharacterVersion) => {
    const updatedVersions = versions.map((v) => ({
      ...v,
      isActive: v.id === version.id,
    }));
    setVersions(updatedVersions);
    setCurrentVersion(version);

    setCharacter(version.data);
    setEditData({
      ...version.data,
      relationships: version.data.relationships || [],
    });
    setImagePreview(version.data.image);

    toast.success(`Versão "${version.name}" ativada`);
  };

  const handleVersionSave = (name: string, description?: string) => {
    const newVersion: CharacterVersion = {
      id: `version-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      isActive: false,
      data: { ...character },
    };

    setVersions((prev) => [...prev, newVersion]);
    toast.success(`Versão "${name}" salva com sucesso!`);
  };

  const handleVersionDelete = (versionId: string) => {
    if (versions.length <= 1) {
      toast.error("Não é possível excluir a última versão");
      return;
    }

    const versionToDelete = versions.find((v) => v.id === versionId);
    const updatedVersions = versions.filter((v) => v.id !== versionId);

    if (versionToDelete?.isActive && updatedVersions.length > 0) {
      updatedVersions[0].isActive = true;
      setCurrentVersion(updatedVersions[0]);
      setCharacter(updatedVersions[0].data);
      setEditData({
        ...updatedVersions[0].data,
        relationships: updatedVersions[0].data.relationships || [],
      });
      setImagePreview(updatedVersions[0].data.image);
    }

    setVersions(updatedVersions);
  };

  const handleVersionUpdate = (
    versionId: string,
    name: string,
    description?: string
  ) => {
    const updatedVersions = versions.map((v) =>
      v.id === versionId ? { ...v, name, description } : v
    );
    setVersions(updatedVersions);

    if (currentVersion.id === versionId) {
      setCurrentVersion({ ...currentVersion, name, description });
    }
  };

  const handleSave = () => {
    const updatedCharacter = { ...editData };
    setCharacter(updatedCharacter);

    const updatedVersions = versions.map((v) =>
      v.isActive ? { ...v, data: updatedCharacter } : v
    );
    setVersions(updatedVersions);

    const activeVersion = updatedVersions.find((v) => v.isActive);
    if (activeVersion) {
      setCurrentVersion(activeVersion);
    }

    setIsEditing(false);
    toast.success("Personagem atualizado com sucesso!");
  };

  const handleDelete = () => {
    toast.success("Personagem excluído com sucesso!");
    navigate({ to: "/dashboard/$dashboardId", params: { dashboardId: dashboardId } });
  };

  const handleCancel = () => {
    setEditData({ ...character, relationships: character.relationships || [] });
    setIsEditing(false);
  };

  const handleAddQuality = () => {
    if (newQuality.trim() && !editData.qualities.includes(newQuality.trim())) {
      setEditData((prev) => ({
        ...prev,
        qualities: [...prev.qualities, newQuality.trim()],
      }));
      setNewQuality("");
    }
  };

  const handleRemoveQuality = (qualityToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      qualities: prev.qualities.filter((q) => q !== qualityToRemove),
    }));
  };

  const handleFamilyRelationChange = (
    relationType: string,
    characterId: string | null
  ) => {
    setEditData((prev) => {
      const newFamily = { ...prev.family };

      Object.keys(newFamily).forEach((key) => {
        if (Array.isArray(newFamily[key])) {
          newFamily[key] = newFamily[key].filter(
            (id: string) => id !== characterId
          );
        } else if (newFamily[key] === characterId) {
          newFamily[key] = null;
        }
      });

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
        family: newFamily,
      };
    });
  };

  const getFamilyRelationLabel = (
    relationType: string,
    characterName: string
  ) => {
    const relations = {
      father: `Pai de ${characterName}`,
      mother: `Mãe de ${characterName}`,
      child: `Filho(a) de ${characterName}`,
      sibling: `Irmão(ã) de ${characterName}`,
      spouse: `Cônjuge de ${characterName}`,
      halfSibling: `Meio-irmão(ã) de ${characterName}`,
      uncleAunt: `Tio(a) de ${characterName}`,
      grandparent: `Avô(ó) de ${characterName}`,
      cousin: `Primo(a) de ${characterName}`,
    };
    return relations[relationType] || "";
  };

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setEditData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgeChange = (increment: boolean) => {
    setEditData((prev) => ({
      ...prev,
      age: Math.max(0, prev.age + (increment ? 1 : -1)),
    }));
  };

  const handleAddRelationship = () => {
    if (selectedRelationshipCharacter && selectedRelationshipType) {
      const newRelationship = {
        id: `rel-${Date.now()}`,
        characterId: selectedRelationshipCharacter,
        type: selectedRelationshipType,
        intensity: relationshipIntensity[0],
      };

      setEditData((prev) => ({
        ...prev,
        relationships: [...(prev.relationships || []), newRelationship],
      }));

      setSelectedRelationshipCharacter("");
      setSelectedRelationshipType("");
      setRelationshipIntensity([50]);
      toast.success("Relacionamento adicionado com sucesso!");
    }
  };

  const handleRemoveRelationship = (relationshipId: string) => {
    setEditData((prev) => ({
      ...prev,
      relationships:
        prev.relationships?.filter((rel) => rel.id !== relationshipId) || [],
    }));
    toast.success("Relacionamento removido com sucesso!");
  };

  const handleUpdateRelationshipIntensity = (
    relationshipId: string,
    intensity: number
  ) => {
    setEditData((prev) => ({
      ...prev,
      relationships:
        prev.relationships?.map((rel) =>
          rel.id === relationshipId ? { ...rel, intensity } : rel
        ) || [],
    }));
  };

  const getRelationshipTypeData = (type: string) =>
    relationshipTypes.find((rt) => rt.value === type) || relationshipTypes[0];

  // Mock linked notes - in real app would come from API/state
  const linkedNotes = [
    {
      id: "note-1",
      name: "Análise Psicológica do Aelric",
      content:
        "Análise detalhada da personalidade e motivações do personagem Aelric. Suas características heróicas contrastam com sua impulsividade...",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
      linkCreatedAt: new Date("2024-01-16"),
    },
    {
      id: "note-2",
      name: "Arco Narrativo - Primeira Jornada",
      content:
        "Desenvolvimento do personagem durante sua primeira aventura. Como ele evolui de pastor simples para herói...",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-18"),
      linkCreatedAt: new Date("2024-01-12"),
    },
  ];

  // Handler functions
  const handleBack = () => window.history.back();
  const handleNavigationSidebarToggle = () => setIsNavigationSidebarOpen(true);
  const handleNavigationSidebarClose = () => setIsNavigationSidebarOpen(false);
  const handleCharacterSelect = (characterId: string) => {
    window.location.replace(`/book/1/character/${characterId}`);
  };
  const handleLinkedNotesModalOpen = () => setIsLinkedNotesModalOpen(true);
  const handleLinkedNotesModalClose = () => setIsLinkedNotesModalOpen(false);
  const handleEdit = () => setIsEditing(true);
  const handleDeleteModalOpen = () => setShowDeleteModal(true);
  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleEditDataChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };
  const handleNewQualityChange = (value: string) => setNewQuality(value);
  const handleRelationshipCharacterChange = (characterId: string) =>
    setSelectedRelationshipCharacter(characterId);
  const handleRelationshipTypeChange = (type: string) =>
    setSelectedRelationshipType(type);
  const handleRelationshipIntensityChange = (intensity: number[]) =>
    setRelationshipIntensity(intensity);
  const handleNavigateToFamilyTree = () => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/character/$characterId/family-tree",
      params: { dashboardId: dashboardId, characterId: characterId },
    });
  };

  return (
    <CharacterDetailView
      character={character}
      editData={editData}
      isEditing={isEditing}
      versions={versions}
      currentVersion={currentVersion}
      showDeleteModal={showDeleteModal}
      isNavigationSidebarOpen={isNavigationSidebarOpen}
      isLinkedNotesModalOpen={isLinkedNotesModalOpen}
      newQuality={newQuality}
      imagePreview={imagePreview}
      selectedRelationshipCharacter={selectedRelationshipCharacter}
      selectedRelationshipType={selectedRelationshipType}
      relationshipIntensity={relationshipIntensity}
      fileInputRef={fileInputRef}
      linkedNotes={linkedNotes}
      mockCharacters={mockCharacters}
      mockLocations={mockLocations}
      mockOrganizations={mockOrganizations}
      roles={roles}
      alignments={alignments}
      genders={genders}
      familyRelations={familyRelations}
      relationshipTypes={relationshipTypes}
      currentRole={currentRole}
      currentAlignment={currentAlignment}
      currentGender={currentGender}
      RoleIcon={RoleIcon}
      onBack={handleBack}
      onNavigationSidebarToggle={handleNavigationSidebarToggle}
      onNavigationSidebarClose={handleNavigationSidebarClose}
      onCharacterSelect={handleCharacterSelect}
      onLinkedNotesModalOpen={handleLinkedNotesModalOpen}
      onLinkedNotesModalClose={handleLinkedNotesModalClose}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      onDeleteModalOpen={handleDeleteModalOpen}
      onDeleteModalClose={handleDeleteModalClose}
      onVersionChange={handleVersionChange}
      onVersionSave={handleVersionSave}
      onVersionDelete={handleVersionDelete}
      onVersionUpdate={handleVersionUpdate}
      onImageFileChange={handleImageFileChange}
      onAgeChange={handleAgeChange}
      onEditDataChange={handleEditDataChange}
      onQualityAdd={handleAddQuality}
      onQualityRemove={handleRemoveQuality}
      onNewQualityChange={handleNewQualityChange}
      onFamilyRelationChange={handleFamilyRelationChange}
      onRelationshipAdd={handleAddRelationship}
      onRelationshipRemove={handleRemoveRelationship}
      onRelationshipIntensityUpdate={handleUpdateRelationshipIntensity}
      onRelationshipCharacterChange={handleRelationshipCharacterChange}
      onRelationshipTypeChange={handleRelationshipTypeChange}
      onRelationshipIntensityChange={handleRelationshipIntensityChange}
      onNavigateToFamilyTree={handleNavigateToFamilyTree}
      getRelationshipTypeData={getRelationshipTypeData}
      getFamilyRelationLabel={getFamilyRelationLabel}
    />
  );
}
