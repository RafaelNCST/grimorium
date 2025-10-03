import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import { useParams } from "@tanstack/react-router";
import { Globe, Mountain, TreePine, Castle, Home, MapPin } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { MOCK_CONTINENTS } from "./mocks/mock-continents";
import { MOCK_LINKED_NOTES } from "./mocks/mock-linked-notes";
import { MOCK_ORGANIZATIONS } from "./mocks/mock-organizations";
import { MOCK_STICKY_NOTES } from "./mocks/mock-sticky-notes";
import { MOCK_WORLD_DETAIL_ENTITIES } from "./mocks/mock-world-entities";
import { MOCK_WORLDS } from "./mocks/mock-worlds";
import {
  IWorldDetailEntity,
  IStickyNote,
  IOrganization,
  IWorld,
  IContinent,
  ILinkedNote,
} from "./types/world-detail-types";
import { WorldDetailView } from "./view";

export function WorldDetail() {
  const { dashboardId, worldId } = useParams({
    from: "/dashboard/$dashboardId/tabs/world/$worldId",
  });
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entity, setEntity] = useState<IWorldDetailEntity | undefined>(
    MOCK_WORLD_DETAIL_ENTITIES.find((e) => e.id === worldId)
  );
  const [editData, setEditData] = useState<IWorldDetailEntity>(
    MOCK_WORLD_DETAIL_ENTITIES.find((e) => e.id === worldId) ||
      MOCK_WORLD_DETAIL_ENTITIES[0]
  );
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stickyNotes, setStickyNotes] =
    useState<IStickyNote[]>(MOCK_STICKY_NOTES);
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);

  const mockOrganizations = useMemo<IOrganization[]>(
    () => MOCK_ORGANIZATIONS,
    []
  );
  const mockWorlds = useMemo<IWorld[]>(() => MOCK_WORLDS, []);
  const mockContinents = useMemo<IContinent[]>(() => MOCK_CONTINENTS, []);
  const linkedNotes = useMemo<ILinkedNote[]>(() => MOCK_LINKED_NOTES, []);

  useEffect(() => {
    const foundEntity = MOCK_WORLD_DETAIL_ENTITIES.find((e) => e.id === worldId);
    if (foundEntity) {
      setEntity(foundEntity);
      setEditData(foundEntity);
    }
  }, [worldId]);

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
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const getEntityIcon = useCallback(() => {
    if (!entity) return <MapPin className="w-6 h-6" />;

    if (entity.type === "World") return <Globe className="w-6 h-6" />;
    if (entity.type === "Continent") return <Mountain className="w-6 h-6" />;

    switch (entity.classification?.toLowerCase()) {
      case "floresta mágica":
        return <TreePine className="w-6 h-6" />;
      case "assentamento":
        return <Home className="w-6 h-6" />;
      case "ruína mágica":
        return <Castle className="w-6 h-6" />;
      default:
        return <MapPin className="w-6 h-6" />;
    }
  }, [entity]);

  const getWorldName = useCallback(
    (worldId?: string) => {
      if (!worldId) return null;
      const world = mockWorlds.find((w) => w.id === worldId);
      return world?.name || null;
    },
    [mockWorlds]
  );

  const getContinentName = useCallback(
    (continentId?: string) => {
      if (!continentId) return null;
      const continent = mockContinents.find((c) => c.id === continentId);
      return continent?.name || null;
    },
    [mockContinents]
  );

  const getEntityTypeForModal = useCallback(() => {
    if (!entity) return "location";
    if (entity.type === "World") return "world";
    if (entity.type === "Continent") return "continent";
    return "location";
  }, [entity]);

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
    if (!entity) return;
    setEntity(editData);
    setIsEditing(false);
    setImagePreview("");
    setSelectedFile(null);
    toast({
      title: `${entity.type === "World" ? "Mundo" : entity.type === "Continent" ? "Continente" : "Local"} atualizado`,
      description: "As informações foram salvas com sucesso.",
    });
  }, [entity, editData, toast]);

  const handleCancel = useCallback(() => {
    if (!entity) return;
    setEditData(entity);
    setIsEditing(false);
    setImagePreview("");
    setSelectedFile(null);
  }, [entity]);

  const handleDelete = useCallback(() => {
    if (!entity) return;
    toast({
      title: `${entity.type === "World" ? "Mundo" : entity.type === "Continent" ? "Continente" : "Local"} excluído`,
      description: `${entity.name} foi excluído com sucesso.`,
    });
    setIsDeleteModalOpen(false);
    window.history.back();
  }, [entity, toast]);

  const handleAddStickyNote = useCallback(() => {
    const newNote: IStickyNote = {
      id: Date.now().toString(),
      content: "Nova nota",
      x: Math.random() * 300,
      y: Math.random() * 200,
      color: "bg-yellow-200",
    };
    setStickyNotes((prev) => [...prev, newNote]);
  }, []);

  if (!entity) {
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
      entity={entity}
      isEditing={isEditing}
      isDeleteModalOpen={isDeleteModalOpen}
      editData={editData}
      imagePreview={imagePreview}
      fileInputRef={fileInputRef}
      stickyNotes={stickyNotes}
      isLinkedNotesModalOpen={isLinkedNotesModalOpen}
      linkedNotes={linkedNotes}
      mockOrganizations={mockOrganizations}
      mockWorlds={mockWorlds}
      mockContinents={mockContinents}
      dashboardId={dashboardId}
      worldId={worldId}
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
