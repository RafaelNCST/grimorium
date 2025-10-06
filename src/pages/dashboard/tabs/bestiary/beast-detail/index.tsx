import { useState, useRef, useCallback, useMemo } from "react";

import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  Beast,
  mockBeast,
  habits,
  humanComparisons,
} from "@/mocks/local/beast-data";

import { getComparisonColorWithBg } from "../utils/get-comparison-color-with-bg";
import { getHabitIcon } from "../utils/get-habit-icon";
import { getThreatLevelIcon } from "../utils/get-threat-level-icon";

import { BeastDetailView } from "./view";

export function BeastDetail() {
  const { beastId } = useParams({
    from: "/dashboard/$dashboardId/tabs/beast/$beastId",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [beast, setBeast] = useState(mockBeast);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBeast, setEditedBeast] = useState(mockBeast);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newMythology, setNewMythology] = useState({ people: "", version: "" });
  const [isAddingMythology, setIsAddingMythology] = useState(false);
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);

  const currentData = useMemo(
    () => (isEditing ? editedBeast : beast),
    [isEditing, editedBeast, beast]
  );

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    setBeast(editedBeast);
    setIsEditing(false);
    toast.success("Besta atualizada com sucesso!");
  }, [editedBeast]);

  const handleCancel = useCallback(() => {
    setEditedBeast(beast);
    setIsEditing(false);
  }, [beast]);

  const handleDelete = useCallback(() => {
    toast.success("Besta excluída com sucesso!");
    window.history.back();
  }, []);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [isEditing, editedBeast, beast]
  );

  const handleEditedBeastChange = useCallback(
    (updates: Partial<Beast>) => {
      setEditedBeast({ ...editedBeast, ...updates });
    },
    [editedBeast]
  );

  const handleAddMythology = useCallback(() => {
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
  }, [newMythology, editedBeast]);

  const handleRemoveMythology = useCallback(
    (mythId: string) => {
      setEditedBeast({
        ...editedBeast,
        mythologies: editedBeast.mythologies.filter((m) => m.id !== mythId),
      });
    },
    [editedBeast]
  );

  const handleNewMythologyChange = useCallback(
    (mythology: { people: string; version: string }) => {
      setNewMythology(mythology);
    },
    []
  );

  const handleShowDeleteModalChange = useCallback((show: boolean) => {
    setShowDeleteModal(show);
  }, []);

  const handleIsAddingMythologyChange = useCallback((adding: boolean) => {
    setIsAddingMythology(adding);
  }, []);

  const handleLinkedNotesModalOpenChange = useCallback((open: boolean) => {
    setIsLinkedNotesModalOpen(open);
  }, []);

  return (
    <BeastDetailView
      currentData={currentData}
      isEditing={isEditing}
      editedBeast={editedBeast}
      showDeleteModal={showDeleteModal}
      newMythology={newMythology}
      isAddingMythology={isAddingMythology}
      isLinkedNotesModalOpen={isLinkedNotesModalOpen}
      linkedNotes={[]}
      fileInputRef={fileInputRef}
      getThreatLevelIcon={getThreatLevelIcon}
      getHabitIcon={getHabitIcon}
      getComparisonColor={getComparisonColorWithBg}
      onBack={handleBack}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      onImageUpload={handleImageUpload}
      onEditedBeastChange={handleEditedBeastChange}
      onAddMythology={handleAddMythology}
      onRemoveMythology={handleRemoveMythology}
      onNewMythologyChange={handleNewMythologyChange}
      onShowDeleteModalChange={handleShowDeleteModalChange}
      onIsAddingMythologyChange={handleIsAddingMythologyChange}
      onLinkedNotesModalOpenChange={handleLinkedNotesModalOpenChange}
      habits={habits}
      humanComparisons={humanComparisons}
    />
  );
}
