import { useState, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { Shield, Skull, Sun, Moon, TreePine, Sword } from "lucide-react";
import { toast } from "sonner";

import {
  Beast,
  mockBeast,
  habits,
  humanComparisons,
  threatLevels,
  mockLinkedNotes,
} from "@/mocks/local/beast-data";

import { BeastDetailView } from "./view";

export function BeastDetail() {
  const { beastId } = useParams({ from: "/dashboard/$dashboardId/tabs/beast/$beastId" });
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [beast, setBeast] = useState(mockBeast);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBeast, setEditedBeast] = useState(mockBeast);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMythology, setNewMythology] = useState({ people: "", version: "" });
  const [isAddingMythology, setIsAddingMythology] = useState(false);
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);

  const getThreatLevelIcon = (threatLevel: string) => {
    switch (threatLevel) {
      case "inexistente":
        return Shield;
      case "baixo":
        return Shield;
      case "médio":
        return Sword;
      case "mortal":
        return Skull;
      case "apocalíptico":
        return Skull;
      default:
        return Shield;
    }
  };

  const getHabitIcon = (habit: string) => {
    switch (habit) {
      case "diurno":
        return Sun;
      case "noturno":
        return Moon;
      case "subterrâneo":
        return TreePine;
      default:
        return Sun;
    }
  };

  const getComparisonColor = (comparison: string) => {
    switch (comparison) {
      case "impotente":
        return "text-green-600 bg-green-50";
      case "mais fraco":
        return "text-green-500 bg-green-50";
      case "ligeiramente mais fraco":
        return "text-blue-500 bg-blue-50";
      case "igual":
        return "text-gray-500 bg-gray-50";
      case "ligeiramente mais forte":
        return "text-yellow-600 bg-yellow-50";
      case "mais forte":
        return "text-orange-500 bg-orange-50";
      case "impossível de ganhar":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const handleSave = () => {
    setBeast(editedBeast);
    setIsEditing(false);
    toast.success("Besta atualizada com sucesso!");
  };

  const handleCancel = () => {
    setEditedBeast(beast);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (isEditing) {
          setEditedBeast({ ...editedBeast, image: imageUrl });
        } else {
          setBeast({ ...beast, image: imageUrl });
          toast.success("Imagem atualizada!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addMythology = () => {
    if (!newMythology.people.trim() || !newMythology.version.trim()) {
      toast.error("Povo e versão são obrigatórios");
      return;
    }

    const mythology = {
      id: `myth-${Date.now()}`,
      people: newMythology.people,
      version: newMythology.version,
    };

    setEditedBeast({
      ...editedBeast,
      mythologies: [...editedBeast.mythologies, mythology],
    });

    setNewMythology({ people: "", version: "" });
    setIsAddingMythology(false);
  };

  const removeMythology = (mythId: string) => {
    setEditedBeast({
      ...editedBeast,
      mythologies: editedBeast.mythologies.filter((m) => m.id !== mythId),
    });
  };

  const handleDelete = () => {
    toast.success("Besta excluída com sucesso!");
    window.history.back();
  };

  const handleEditedBeastChange = (updates: Partial<Beast>) => {
    setEditedBeast({ ...editedBeast, ...updates });
  };

  const handleNewMythologyChange = (mythology: {
    people: string;
    version: string;
  }) => {
    setNewMythology(mythology);
  };

  const currentData = isEditing ? editedBeast : beast;
  const linkedNotes = mockLinkedNotes;

  return (
    <BeastDetailView
      currentData={currentData}
      isEditing={isEditing}
      editedBeast={editedBeast}
      showDeleteModal={showDeleteModal}
      newMythology={newMythology}
      isAddingMythology={isAddingMythology}
      isLinkedNotesModalOpen={isLinkedNotesModalOpen}
      linkedNotes={linkedNotes}
      fileInputRef={fileInputRef}
      getThreatLevelIcon={getThreatLevelIcon}
      getHabitIcon={getHabitIcon}
      getComparisonColor={getComparisonColor}
      onBack={() => window.history.back()}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      onImageUpload={handleImageUpload}
      onEditedBeastChange={handleEditedBeastChange}
      onAddMythology={addMythology}
      onRemoveMythology={removeMythology}
      onNewMythologyChange={handleNewMythologyChange}
      setShowDeleteModal={setShowDeleteModal}
      setIsAddingMythology={setIsAddingMythology}
      setIsLinkedNotesModalOpen={setIsLinkedNotesModalOpen}
      habits={habits}
      humanComparisons={humanComparisons}
    />
  );
}