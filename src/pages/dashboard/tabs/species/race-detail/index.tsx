import { useState, useCallback } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { useToast } from "@/hooks/use-toast";

import { IRaceWithSpeciesName, RaceType } from "../types/species-types";

import { MOCK_RACE } from "./mocks/mock-race";
import { RaceDetailView } from "./view";

export function RaceDetail() {
  const { dashboardId, raceId } = useParams({
    from: "/dashboard/$dashboardId/tabs/race/$raceId",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const [race, setRace] = useState<IRaceWithSpeciesName>(MOCK_RACE);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: race.name,
    description: race.description,
    history: race.history,
    type: race.type,
    physicalCharacteristics: race.physicalCharacteristics || "",
    culture: race.culture || "",
  });

  const handleBack = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: dashboardId! },
    });
  }, [navigate, dashboardId]);

  const handleEdit = useCallback(() => {
    setEditForm({
      name: race.name,
      description: race.description,
      history: race.history,
      type: race.type,
      physicalCharacteristics: race.physicalCharacteristics || "",
      culture: race.culture || "",
    });
    setIsEditing(true);
  }, [race]);

  const handleSave = useCallback(() => {
    setRace({
      ...race,
      name: editForm.name,
      description: editForm.description,
      history: editForm.history,
      type: editForm.type as RaceType,
      physicalCharacteristics: editForm.physicalCharacteristics || undefined,
      culture: editForm.culture || undefined,
    });
    setIsEditing(false);
    toast({
      title: "Raça atualizada",
      description: "As informações foram salvas com sucesso.",
    });
  }, [race, editForm, toast]);

  const handleCancel = useCallback(() => {
    setEditForm({
      name: race.name,
      description: race.description,
      history: race.history,
      type: race.type,
      physicalCharacteristics: race.physicalCharacteristics || "",
      culture: race.culture || "",
    });
    setIsEditing(false);
  }, [race]);

  const handleDelete = useCallback(() => {
    toast({
      title: "Raça excluída",
      description: `${race.name} foi excluída com sucesso.`,
    });
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: dashboardId! },
    });
  }, [race.name, toast, navigate, dashboardId]);

  const handleDeleteModalOpen = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleEditFormChange = useCallback((field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <RaceDetailView
      race={race}
      editForm={editForm}
      isEditing={isEditing}
      isDeleteModalOpen={isDeleteModalOpen}
      onBack={handleBack}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDeleteModalOpen={handleDeleteModalOpen}
      onDeleteModalClose={handleDeleteModalClose}
      onDelete={handleDelete}
      onEditFormChange={handleEditFormChange}
    />
  );
}
