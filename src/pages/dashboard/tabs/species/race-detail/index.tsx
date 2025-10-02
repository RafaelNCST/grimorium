import { useState, useCallback, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";

import { RaceDetailView } from "./view";

import { useToast } from "@/hooks/use-toast";

interface IRace {
  id: string;
  name: string;
  description: string;
  history: string;
  type: "Aquática" | "Terrestre" | "Voadora" | "Espacial" | "Espiritual";
  physicalCharacteristics?: string;
  culture?: string;
  speciesId: string;
  speciesName: string;
}

export function RaceDetail() {
  const { dashboardId, raceId } = useParams({
    from: "/dashboard/$dashboardId/tabs/race/$raceId",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mock data - replace with actual data management
  const [race, setRace] = useState<IRace>({
    id: "1",
    name: "Elfos da Floresta",
    description:
      "Elfos que vivem em harmonia com as florestas antigas, protegendo os bosques sagrados com sua magia natural.",
    history:
      "Os Elfos da Floresta são os guardiões ancestrais das florestas sagradas. Há milênios, quando o mundo ainda era jovem, eles fizeram um pacto com as árvores antigas para proteger a natureza. Desde então, vivem em perfeita simbiose com a floresta, obtendo sua longevidade e poderes mágicos através desta conexão mística.",
    type: "Terrestre",
    physicalCharacteristics:
      "Possuem pele clara com tons esverdeados sutis, cabelos longos que variam do dourado ao castanho, e orelhas pontiagudas características. Seus olhos geralmente são verdes ou castanhos, refletindo as cores da floresta. São mais altos que os humanos comuns, com corpos esbeltos e movimentos graciosos.",
    culture:
      "Vivem em comunidades arbóreas construídas nas copas das árvores mais antigas. Respeitam profundamente os ciclos naturais, celebrando os solstícios e equinócios. Sua sociedade é baseada na harmonia e no consenso, com decisões tomadas pelos anciões em conselhos sob a luz da lua. Valorizam a arte, música e poesia, considerando-as formas de comunhão com a natureza.",
    speciesId: "1",
    speciesName: "Elfos",
  });

  const [editForm, setEditForm] = useState({
    name: race.name,
    description: race.description,
    history: race.history,
    type: race.type,
    physicalCharacteristics: race.physicalCharacteristics || "",
    culture: race.culture || "",
  });

  // Memoized type colors
  const typeColors = useMemo(
    () => ({
      Aquática: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Terrestre:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Voadora: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
      Espacial:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Espiritual:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    }),
    []
  );

  // Navigation handlers with useCallback
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
      type: editForm.type,
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

  const handleEditFormChange = useCallback((field: string, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <RaceDetailView
      race={race}
      editForm={editForm}
      isEditing={isEditing}
      isDeleteModalOpen={isDeleteModalOpen}
      typeColors={typeColors}
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
