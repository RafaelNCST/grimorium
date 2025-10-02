import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { Globe, Mountain, TreePine, Castle, Home, MapPin } from "lucide-react";
import { toast } from "sonner";

import { WorldDetailView } from "./view";

interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  worldId?: string;
  continentId?: string;
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

interface StickyNote {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
}

// Mock data - in a real app this would come from API/state management
const mockWorldEntities: WorldEntity[] = [
  {
    id: "world1",
    name: "Aethermoor",
    type: "World",
    description:
      "Mundo principal onde se desenrola a história. Um reino de magia e mistério onde antigas magias ainda ecoam pelas terras.",
    age: "5000 anos",
    dominantOrganization: "Ordem dos Guardiões",
    image: "/api/placeholder/400/250",
  },
  {
    id: "continent1",
    name: "Continente Central",
    type: "Continent",
    description:
      "Continente principal de Aethermoor, rico em recursos mágicos e lar de diversas civilizações antigas.",
    worldId: "world1",
    age: "3000 anos",
    dominantOrganization: "Reino de Aethermoor",
    image: "/api/placeholder/400/250",
  },
  {
    id: "loc1",
    name: "Floresta das Lamentações",
    type: "Location",
    description:
      "Floresta sombria habitada por criaturas mágicas perigosas. As árvores sussurram segredos dos tempos antigos.",
    worldId: "world1",
    continentId: "continent1",
    classification: "Floresta Mágica",
    climate: "Frio e Úmido",
    location: "Norte do Continente Central",
    terrain: "Florestal",
    organizations: ["Culto das Sombras", "Guarda Florestal"],
    image: "/api/placeholder/400/250",
  },
];

// Mock data for selects
const mockWorlds = [
  { id: "world1", name: "Aethermoor" },
  { id: "world2", name: "Terra Sombria" },
  { id: "world3", name: "Reino Celestial" },
];

const mockContinents = [
  { id: "continent1", name: "Continente Central", worldId: "world1" },
  { id: "continent2", name: "Terras do Norte", worldId: "world1" },
  { id: "continent3", name: "Ilhas do Sul", worldId: "world1" },
];

const mockOrganizations = [
  { id: "1", name: "Ordem dos Guardiões" },
  { id: "2", name: "Culto das Sombras" },
  { id: "3", name: "Guarda Florestal" },
  { id: "4", name: "Reino de Aethermoor" },
  { id: "5", name: "Academia Arcana" },
];

export function WorldDetail() {
  const { worldId } = useParams({
    from: "/dashboard/$dashboardId/tabs/world/$worldId",
  });
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [character, setCharacter] = useState(
    mockWorldEntities.find((e) => e.id === worldId)
  );
  const [editData, setEditData] = useState(
    mockWorldEntities.find((e) => e.id === worldId) || mockWorldEntities[0]
  );
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    {
      id: "1",
      content: "Investigar a origem dos sussurros nas árvores",
      x: 20,
      y: 20,
      color: "bg-yellow-200",
    },
    {
      id: "2",
      content: "Conexão com o Culto das Sombras precisa ser explorada",
      x: 250,
      y: 80,
      color: "bg-blue-200",
    },
  ]);
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);

  useEffect(() => {
    const entity = mockWorldEntities.find((e) => e.id === worldId);
    if (entity) {
      setCharacter(entity);
      setEditData(entity);
    }
  }, [worldId]);

  // Mock linked notes - in real app would come from API/state
  const linkedNotes = useMemo(
    () => [
      {
        id: "note-1",
        name: "História Antiga de Aethermoor",
        content:
          "Detalhes sobre a fundação do mundo e os eventos que moldaram sua história ao longo dos milênios...",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-10"),
        linkCreatedAt: new Date("2024-01-07"),
      },
      {
        id: "note-2",
        name: "Geografia e Clima",
        content:
          "Análise detalhada dos biomas, sistemas climáticos e características geográficas do mundo...",
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-12"),
        linkCreatedAt: new Date("2024-01-09"),
      },
    ],
    []
  );

  // Navigation handlers with useCallback
  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleLinkedNotesModalOpen = useCallback(() => {
    setIsLinkedNotesModalOpen(true);
  }, []);

  const handleLinkedNotesModalClose = useCallback(() => {
    setIsLinkedNotesModalOpen(false);
  }, []);

  const handleDeleteModalOpen = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  // Memoized helper functions
  const getEntityIcon = useCallback(() => {
    if (!character) return <MapPin className="w-6 h-6" />;

    if (character.type === "World") return <Globe className="w-6 h-6" />;
    if (character.type === "Continent") return <Mountain className="w-6 h-6" />;

    switch (character.classification?.toLowerCase()) {
      case "floresta mágica":
        return <TreePine className="w-6 h-6" />;
      case "assentamento":
        return <Home className="w-6 h-6" />;
      case "ruína mágica":
        return <Castle className="w-6 h-6" />;
      default:
        return <MapPin className="w-6 h-6" />;
    }
  }, [character]);

  const getWorldName = useCallback((worldId?: string) => {
    if (!worldId) return null;
    const world = mockWorlds.find((w) => w.id === worldId);
    return world?.name;
  }, []);

  const getContinentName = useCallback((continentId?: string) => {
    if (!continentId) return null;
    const continent = mockContinents.find((c) => c.id === continentId);
    return continent?.name;
  }, []);

  const getEntityTypeForModal = useCallback(() => {
    if (!character) return "location";
    if (character.type === "World") return "world";
    if (character.type === "Continent") return "continent";
    return "location";
  }, [character]);

  // Event handlers with useCallback
  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setImagePreview(result);
          setEditData((prev) => ({ ...prev, image: result }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleEditDataChange = useCallback((field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (!character) return;
    setCharacter(editData);
    setIsEditing(false);
    setImagePreview("");
    setSelectedFile(null);
    toast.success(
      `${character.type === "World" ? "Mundo" : character.type === "Continent" ? "Continente" : "Local"} atualizado com sucesso!`
    );
  }, [character, editData]);

  const handleCancel = useCallback(() => {
    if (!character) return;
    setEditData(character);
    setIsEditing(false);
    setImagePreview("");
    setSelectedFile(null);
  }, [character]);

  const handleDelete = useCallback(() => {
    if (!character) return;
    console.log("Deleting entity:", character.id);
    setShowDeleteModal(false);
    window.history.back();
  }, [character]);

  const handleAddStickyNote = useCallback(() => {
    const newNote: StickyNote = {
      id: Date.now().toString(),
      content: "Nova nota",
      x: Math.random() * 300,
      y: Math.random() * 200,
      color: "bg-yellow-200",
    };
    setStickyNotes((prev) => [...prev, newNote]);
  }, []);

  if (!character) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Entidade não encontrada</h1>
          <button onClick={handleBack} className="btn btn-primary">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <WorldDetailView
      character={character}
      isEditing={isEditing}
      showDeleteModal={showDeleteModal}
      editData={editData}
      imagePreview={imagePreview}
      fileInputRef={fileInputRef}
      stickyNotes={stickyNotes}
      isLinkedNotesModalOpen={isLinkedNotesModalOpen}
      linkedNotes={linkedNotes}
      mockOrganizations={mockOrganizations}
      mockWorlds={mockWorlds}
      mockContinents={mockContinents}
      onBack={handleBack}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDeleteModalOpen={handleDeleteModalOpen}
      onDeleteModalClose={handleDeleteModalClose}
      onDelete={handleDelete}
      onImageChange={handleImageChange}
      onEditDataChange={handleEditDataChange}
      onAddStickyNote={handleAddStickyNote}
      onLinkedNotesModalOpen={handleLinkedNotesModalOpen}
      onLinkedNotesModalClose={handleLinkedNotesModalClose}
      getEntityIcon={getEntityIcon}
      getWorldName={getWorldName}
      getContinentName={getContinentName}
      getEntityTypeForModal={getEntityTypeForModal}
    />
  );
}
