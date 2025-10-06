import { useState, useCallback, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { IOrganization, IOrganizationTitle } from "@/types/organization-types";

import { getAlignmentColor } from "../utils/formatters/get-alignment-color";
import { getInfluenceColor } from "../utils/formatters/get-influence-color";
import { getLocationIcon } from "../utils/formatters/get-location-icon";
import { getTitleName } from "../utils/formatters/get-title-name";

import { OrganizationDetailView } from "./view";

const MOCK_LOCATIONS: any[] = [];
const MOCK_WORLDS: any[] = [];
const MOCK_CONTINENTS: any[] = [];

export function OrganizationDetail() {
  const { dashboardId, orgId } = useParams({
    from: "/dashboard/$dashboardId/tabs/organization/$orgId",
  });
  const navigate = useNavigate();

  const organization = useMemo(() => undefined, [orgId]);

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

  const handleBack = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: dashboardId! },
    });
  }, [navigate, dashboardId]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    toast.success("Organização atualizada com sucesso!");
    setIsEditing(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleDelete = useCallback(() => {
    toast.success("Organização excluída com sucesso!");
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: dashboardId! },
    });
  }, [navigate, dashboardId]);

  const handleDeleteDialogOpen = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const handleAddTitleDialogOpen = useCallback(() => {
    setShowAddTitleDialog(true);
  }, []);

  const handleAddTitleDialogClose = useCallback(() => {
    setShowAddTitleDialog(false);
  }, []);

  const handleAddMemberDialogOpen = useCallback(() => {
    setShowAddMemberDialog(true);
  }, []);

  const handleAddMemberDialogClose = useCallback(() => {
    setShowAddMemberDialog(false);
  }, []);

  const handleEditDataChange = useCallback(
    (field: string, value: string | string[] | IOrganizationTitle[]) => {
      setEditData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleNewTitleChange = useCallback(
    (field: string, value: string | number) => {
      setNewTitle((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleNewMemberChange = useCallback((field: string, value: string) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAddTitle = useCallback(() => {
    if (!newTitle.name.trim()) {
      toast.error("Nome do título é obrigatório");
      return;
    }

    toast.success("Título adicionado com sucesso!");
    setNewTitle({ name: "", description: "", level: 1 });
    setShowAddTitleDialog(false);
  }, [newTitle]);

  const handleAddMember = useCallback(() => {
    if (!newMember.characterId || !newMember.titleId) {
      toast.error("Personagem e título são obrigatórios");
      return;
    }

    toast.success("Membro adicionado com sucesso!");
    setNewMember({ characterId: "", titleId: "", joinDate: "" });
    setShowAddMemberDialog(false);
  }, [newMember]);

  const handleAddObjective = useCallback(
    (newObjective: string) => {
      if (
        newObjective.trim() &&
        !editData.objectives.includes(newObjective.trim())
      ) {
        setEditData((prev) => ({
          ...prev,
          objectives: [...prev.objectives, newObjective.trim()],
        }));
      }
    },
    [editData.objectives]
  );

  const handleRemoveObjective = useCallback((objective: string) => {
    setEditData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((o) => o !== objective),
    }));
  }, []);

  const handleAddDominatedLocation = useCallback(
    (locationId: string) => {
      const allAvailableLocations = [
        ...MOCK_LOCATIONS,
        ...MOCK_WORLDS,
        ...MOCK_CONTINENTS,
      ];
      const location = allAvailableLocations.find((l) => l.id === locationId);
      if (location && !editData.dominatedLocations.includes(location.name)) {
        setEditData((prev) => ({
          ...prev,
          dominatedLocations: [...prev.dominatedLocations, location.name],
        }));
      }
    },
    [editData.dominatedLocations]
  );

  const handleRemoveDominatedLocation = useCallback((location: string) => {
    setEditData((prev) => ({
      ...prev,
      dominatedLocations: prev.dominatedLocations.filter((l) => l !== location),
    }));
  }, []);

  const handleUpdateTitleLevel = useCallback(
    (titleId: string, newLevel: number) => {
      setEditData((prev) => ({
        ...prev,
        titles: prev.titles.map((title) =>
          title.id === titleId ? { ...title, level: newLevel } : title
        ),
      }));
    },
    []
  );

  const getAlignmentColorCallback = useCallback(
    (alignment: string) =>
      getAlignmentColor(alignment as IOrganization["alignment"]),
    []
  );

  const getInfluenceColorCallback = useCallback(
    (influence: string) =>
      getInfluenceColor(influence as IOrganization["influence"]),
    []
  );

  const getTitleNameCallback = useCallback(
    (titleId: string) => {
      if (!organization) return "Membro";
      return getTitleName(titleId, organization);
    },
    [organization]
  );

  const getLocationIconCallback = useCallback(
    (type: string) => getLocationIcon(type),
    []
  );

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
      availableLocations={MOCK_LOCATIONS}
      availableWorlds={MOCK_WORLDS}
      availableContinents={MOCK_CONTINENTS}
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
      getAlignmentColor={getAlignmentColorCallback}
      getInfluenceColor={getInfluenceColorCallback}
      getTitleName={getTitleNameCallback}
      getLocationIcon={getLocationIconCallback}
    />
  );
}
