import { useState } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { Globe, Mountain, MapPin } from "lucide-react";
import { toast } from "sonner";

import {
  Organization,
  mockOrganizations,
  availableLocations,
  availableWorlds,
  availableContinents,
} from "@/mocks/local/organization-data";

import { OrganizationDetailView } from "./view";

export function OrganizationDetail() {
  const { dashboardId, orgId } = useParams({
    from: "/dashboard/$dashboardId/tabs/organization/$orgId",
  });
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddTitleDialog, setShowAddTitleDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);

  const [newTitle, setNewTitle] = useState({
    name: "",
    description: "",
    level: 1,
  });
  const [newMember, setNewMember] = useState({
    characterId: "",
    titleId: "",
    joinDate: "",
  });

  const organization = mockOrganizations[orgId || ""];

  const [editData, setEditData] = useState({
    name: organization?.name || "",
    description: organization?.description || "",
    type: organization?.type || "",
    alignment: organization?.alignment || "",
    influence: organization?.influence || "",
    baseLocation: organization?.baseLocation || "",
    world: organization?.world || "",
    continent: organization?.continent || "",
    objectives: organization?.objectives || [],
    dominatedLocations: organization?.dominatedLocations || [],
    titles: organization?.titles || [],
  });

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "Mundo":
        return <Globe className="w-3 h-3" />;
      case "Continente":
        return <Mountain className="w-3 h-3" />;
      default:
        return <MapPin className="w-3 h-3" />;
    }
  };

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case "Bem":
        return "bg-success text-success-foreground";
      case "Caótico":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case "Dominante":
        return "bg-destructive text-destructive-foreground";
      case "Alta":
        return "bg-accent text-accent-foreground";
      case "Média":
        return "bg-primary text-primary-foreground";
      case "Baixa":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTitleName = (titleId: string) => {
    const title = organization.titles.find((t) => t.id === titleId);
    return title?.name || "Membro";
  };

  const handleBack = () => window.history.back();

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    toast.success("Organização atualizada com sucesso!");
    setIsEditing(false);
  };

  const handleCancel = () => setIsEditing(false);

  const handleDelete = () => {
    toast.success("Organização excluída com sucesso!");
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: dashboardId! },
    });
  };

  const handleDeleteDialogOpen = () => setShowDeleteDialog(true);
  const handleDeleteDialogClose = () => setShowDeleteDialog(false);
  const handleAddTitleDialogOpen = () => setShowAddTitleDialog(true);
  const handleAddTitleDialogClose = () => setShowAddTitleDialog(false);
  const handleAddMemberDialogOpen = () => setShowAddMemberDialog(true);
  const handleAddMemberDialogClose = () => setShowAddMemberDialog(false);

  const handleEditDataChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewTitleChange = (field: string, value: any) => {
    setNewTitle((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewMemberChange = (field: string, value: any) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTitle = () => {
    if (!newTitle.name.trim()) {
      toast.error("Nome do título é obrigatório");
      return;
    }

    // In real app, this would update the state
    toast.success("Título adicionado com sucesso!");
    setNewTitle({ name: "", description: "", level: 1 });
    setShowAddTitleDialog(false);
  };

  const handleAddMember = () => {
    if (!newMember.characterId || !newMember.titleId) {
      toast.error("Personagem e título são obrigatórios");
      return;
    }

    // In real app, this would update the state
    toast.success("Membro adicionado com sucesso!");
    setNewMember({ characterId: "", titleId: "", joinDate: "" });
    setShowAddMemberDialog(false);
  };

  const handleAddObjective = (newObjective: string) => {
    if (
      newObjective.trim() &&
      !editData.objectives.includes(newObjective.trim())
    ) {
      setEditData((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
    }
  };

  const handleRemoveObjective = (objective: string) => {
    setEditData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((o) => o !== objective),
    }));
  };

  const handleAddDominatedLocation = (locationId: string) => {
    const allAvailableLocations = [
      ...availableLocations,
      ...availableWorlds,
      ...availableContinents,
    ];
    const location = allAvailableLocations.find((l) => l.id === locationId);
    if (location && !editData.dominatedLocations.includes(location.name)) {
      setEditData((prev) => ({
        ...prev,
        dominatedLocations: [...prev.dominatedLocations, location.name],
      }));
    }
  };

  const handleRemoveDominatedLocation = (location: string) => {
    setEditData((prev) => ({
      ...prev,
      dominatedLocations: prev.dominatedLocations.filter((l) => l !== location),
    }));
  };

  const handleUpdateTitleLevel = (titleId: string, newLevel: number) => {
    setEditData((prev) => ({
      ...prev,
      titles: prev.titles.map((title) =>
        title.id === titleId ? { ...title, level: newLevel } : title
      ),
    }));
  };

  return (
    <OrganizationDetailView
      organization={organization}
      editData={editData}
      isEditing={isEditing}
      showDeleteDialog={showDeleteDialog}
      showAddTitleDialog={showAddTitleDialog}
      showAddMemberDialog={showAddMemberDialog}
      newTitle={newTitle}
      newMember={newMember}
      availableLocations={availableLocations}
      availableWorlds={availableWorlds}
      availableContinents={availableContinents}
      onBack={handleBack}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      onDeleteDialogOpen={handleDeleteDialogOpen}
      onDeleteDialogClose={handleDeleteDialogClose}
      onAddTitleDialogOpen={handleAddTitleDialogOpen}
      onAddTitleDialogClose={handleAddTitleDialogClose}
      onAddMemberDialogOpen={handleAddMemberDialogOpen}
      onAddMemberDialogClose={handleAddMemberDialogClose}
      onEditDataChange={handleEditDataChange}
      onNewTitleChange={handleNewTitleChange}
      onNewMemberChange={handleNewMemberChange}
      onAddObjective={handleAddObjective}
      onRemoveObjective={handleRemoveObjective}
      onAddDominatedLocation={handleAddDominatedLocation}
      onRemoveDominatedLocation={handleRemoveDominatedLocation}
      onUpdateTitleLevel={handleUpdateTitleLevel}
      onAddTitle={handleAddTitle}
      onAddMember={handleAddMember}
      getAlignmentColor={getAlignmentColor}
      getInfluenceColor={getInfluenceColor}
      getTitleName={getTitleName}
      getLocationIcon={getLocationIcon}
    />
  );
}
