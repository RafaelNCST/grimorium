import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { Shield, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  getFactionById,
  getFactionVersions,
  createFactionVersion,
  deleteFactionVersion,
  updateFactionVersion,
} from "@/lib/db/factions.service";
import { useFactionsStore } from "@/stores/factions-store";
import {
  type IFaction,
  type IFactionFormData,
  type IFactionVersion,
} from "@/types/faction-types";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { FACTION_INFLUENCE_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-influence";
import { FACTION_REPUTATION_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-reputation";
import { useRacesStore } from "@/stores/races-store";
import { useCharactersStore } from "@/stores/characters-store";

import { FactionDetailView } from "./view";

export function FactionDetail() {
  const { dashboardId, factionId } = useParams({
    from: "/dashboard/$dashboardId/tabs/faction/$factionId",
  });
  const navigate = useNavigate();
  const { t } = useTranslation("faction-detail");

  // Stores
  const updateFactionInStore = useFactionsStore(
    (state) => state.updateFactionInCache
  );
  const deleteFactionFromStore = useFactionsStore(
    (state) => state.deleteFactionFromCache
  );
  const factionsCache = useFactionsStore((state) => state.cache);
  const racesCache = useRacesStore((state) => state.cache);
  const charactersCache = useCharactersStore((state) => state.cache);

  const emptyFaction: IFaction = {
    id: "",
    bookId: dashboardId,
    name: "",
    summary: "",
    status: "active",
    factionType: "commercial",
    createdAt: new Date().toISOString(),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [faction, setFaction] = useState<IFaction>(emptyFaction);
  const [editData, setEditData] = useState<IFaction>(emptyFaction);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);
  const [versions, setVersions] = useState<IFactionVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<IFactionVersion | null>(
    null
  );
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [isDeletingVersion, setIsDeletingVersion] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<string | null>(null);
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, boolean>>(
    {
      diplomacy: true,
      hierarchy: true,
    }
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load faction from database
  useEffect(() => {
    const loadFaction = async () => {
      try {
        const factionFromDB = await getFactionById(factionId);
        if (factionFromDB) {
          setFaction(factionFromDB);
          setEditData(factionFromDB);
          setImagePreview(factionFromDB.image || "");

          // Load versions from database
          const versionsFromDB = await getFactionVersions(factionId);

          // Se não houver versões, criar a versão principal
          if (versionsFromDB.length === 0) {
            const mainVersion: IFactionVersion = {
              id: `main-version-${factionId}`,
              name: "Versão Principal",
              description: "Versão principal da facção",
              createdAt: new Date().toISOString(),
              isMain: true,
              factionData: factionFromDB,
            };

            await createFactionVersion(factionId, mainVersion);
            setVersions([mainVersion]);
            setSelectedVersion(mainVersion);
          } else {
            // Atualizar versão principal com dados carregados
            const updatedVersions = versionsFromDB.map((v) =>
              v.isMain
                ? {
                    ...v,
                    factionData: factionFromDB,
                  }
                : v
            );
            setVersions(updatedVersions);

            // Definir versão principal como atual
            const mainVersion = updatedVersions.find((v) => v.isMain);
            if (mainVersion) {
              setSelectedVersion(mainVersion);
            }
          }
        }
      } catch (error) {
        console.error("Error loading faction:", error);
        toast.error(t("errors.load_failed"));
      } finally {
        setIsLoading(false);
      }
    };

    loadFaction();
  }, [factionId, t]);

  // Get races for the current book
  const races = useMemo(() => {
    if (!dashboardId) return [];
    const bookRaces = racesCache[dashboardId]?.races || [];
    return bookRaces.map((race) => ({
      id: race.id,
      name: race.name,
    }));
  }, [dashboardId, racesCache]);

  // Get characters for the current book
  const characters = useMemo(() => {
    if (!dashboardId) return [];
    const bookCharacters = charactersCache[dashboardId]?.characters || [];
    return bookCharacters.map((char) => ({
      id: char.id,
      name: char.name,
    }));
  }, [dashboardId, charactersCache]);

  // Get factions for the current book
  const factions = useMemo(() => {
    if (!dashboardId) return [];
    const bookFactions = factionsCache[dashboardId]?.factions || [];
    return bookFactions.map((faction) => ({
      id: faction.id,
      name: faction.name,
      image: faction.image,
    }));
  }, [dashboardId, factionsCache]);

  // Get current status, type, influence, reputation
  const currentStatus = useMemo(
    () => FACTION_STATUS_CONSTANT.find((s) => s.value === faction.status),
    [faction.status]
  );
  const currentType = useMemo(
    () => FACTION_TYPES_CONSTANT.find((t) => t.value === faction.factionType),
    [faction.factionType]
  );
  const currentInfluence = useMemo(
    () => FACTION_INFLUENCE_CONSTANT.find((i) => i.value === faction.influence),
    [faction.influence]
  );
  const currentReputation = useMemo(
    () =>
      FACTION_REPUTATION_CONSTANT.find(
        (r) => r.value === faction.publicReputation
      ),
    [faction.publicReputation]
  );

  const handleVersionChange = useCallback(
    (versionId: string | null) => {
      if (!versionId) return;

      const version = versions.find((v) => v.id === versionId);
      if (!version) return;

      setSelectedVersion(version);
      setFaction(version.factionData);
      setEditData(version.factionData);
      setImagePreview(version.factionData.image || "");

      toast.success(`Versão "${version.name}" ativada`);
    },
    [versions]
  );

  const handleVersionCreate = useCallback(
    async (versionData: {
      name: string;
      description: string;
      factionData: IFactionFormData;
    }) => {
      try {
        const newVersion: IFactionVersion = {
          id: `version-${Date.now()}`,
          name: versionData.name,
          description: versionData.description,
          createdAt: new Date().toISOString(),
          isMain: false,
          factionData: versionData.factionData as unknown as IFaction,
        };

        // Salvar no banco de dados
        await createFactionVersion(factionId, newVersion);

        // Atualizar o estado apenas se o save for bem-sucedido
        setVersions((prev) => [...prev, newVersion]);
        toast.success(`Versão "${versionData.name}" criada com sucesso!`);
      } catch (error) {
        console.error("Error creating faction version:", error);
        toast.error("Erro ao criar versão");
      }
    },
    [factionId]
  );

  const handleVersionDelete = useCallback(
    async (versionId: string) => {
      const versionToDelete = versions.find((v) => v.id === versionId);

      // Não permitir deletar versão principal
      if (versionToDelete?.isMain) {
        toast.error("Não é possível excluir a versão principal");
        return;
      }

      try {
        // Deletar do banco de dados
        await deleteFactionVersion(versionId);

        // Atualizar o estado apenas se o delete for bem-sucedido
        const updatedVersions = versions.filter((v) => v.id !== versionId);

        // Se a versão deletada for a atual, voltar para a principal
        if (selectedVersion?.id === versionId) {
          const mainVersion = updatedVersions.find((v) => v.isMain);
          if (mainVersion) {
            setSelectedVersion(mainVersion);
            setFaction(mainVersion.factionData);
            setEditData(mainVersion.factionData);
            setImagePreview(mainVersion.factionData.image || "");
          }
        }

        setVersions(updatedVersions);
        toast.success("Versão excluída com sucesso!");
      } catch (error) {
        console.error("Error deleting faction version:", error);
        toast.error("Erro ao excluir versão");
      }
    },
    [versions, selectedVersion]
  );

  const handleVersionUpdate = useCallback(
    async (versionId: string, name: string, description?: string) => {
      try {
        // Atualizar no banco de dados
        await updateFactionVersion(versionId, name, description);

        // Atualizar o estado apenas se o update for bem-sucedido
        const updatedVersions = versions.map((v) =>
          v.id === versionId ? { ...v, name, description } : v
        );
        setVersions(updatedVersions);

        if (selectedVersion?.id === versionId) {
          setSelectedVersion({ ...selectedVersion, name, description });
        }
      } catch (error) {
        console.error("Error updating faction version:", error);
        toast.error("Erro ao atualizar versão");
      }
    },
    [versions, selectedVersion]
  );

  const handleOpenCreateVersionDialog = useCallback(() => {
    setIsCreatingVersion(true);
  }, []);

  const handleCloseCreateVersionDialog = useCallback(() => {
    setIsCreatingVersion(false);
  }, []);

  const handleConfirmDeleteVersion = useCallback((versionId: string) => {
    setVersionToDelete(versionId);
    setIsDeletingVersion(true);
  }, []);

  const handleCancelDeleteVersion = useCallback(() => {
    setVersionToDelete(null);
    setIsDeletingVersion(false);
  }, []);

  const handleSave = useCallback(async () => {
    const updatedFaction = { ...editData };
    setFaction(updatedFaction);

    // Atualizar dados na versão atual
    const updatedVersions = versions.map((v) =>
      v.id === selectedVersion?.id
        ? { ...v, factionData: updatedFaction }
        : v
    );
    setVersions(updatedVersions);

    const activeVersion = updatedVersions.find(
      (v) => v.id === selectedVersion?.id
    );
    if (activeVersion) {
      setSelectedVersion(activeVersion);
    }

    try {
      // Atualizar no store (que também salva no DB)
      await updateFactionInStore(factionId, updatedFaction);
      setIsEditing(false);
      toast.success(t("messages.save_success"));
    } catch (error) {
      console.error("Error saving faction:", error);
      toast.error(t("errors.save_failed"));
    }
  }, [editData, versions, selectedVersion, factionId, updateFactionInStore, t]);

  const navigateToFactionsTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedVersion && !selectedVersion.isMain) {
      // Delete version (non-main)
      const versionToDeleteObj = versions.find((v) => v.id === selectedVersion.id);

      if (!versionToDeleteObj) return;

      const updatedVersions = versions.filter(
        (v) => v.id !== selectedVersion.id
      );

      // Switch to main version after deleting
      const mainVersion = updatedVersions.find((v) => v.isMain);
      if (mainVersion) {
        setSelectedVersion(mainVersion);
        setFaction(mainVersion.factionData);
        setEditData(mainVersion.factionData);
        setImagePreview(mainVersion.factionData.image || "");
      }

      setVersions(updatedVersions);
      toast.success(t("delete.version.success"));
    } else {
      // Delete entire faction (main version)
      try {
        if (!dashboardId) return;
        await deleteFactionFromStore(dashboardId, factionId);
        toast.success(t("messages.delete_success"));
        navigateToFactionsTab();
      } catch (error) {
        console.error("Error deleting faction:", error);
        toast.error(t("errors.delete_failed"));
      }
    }
  }, [
    selectedVersion,
    versions,
    navigateToFactionsTab,
    factionId,
    dashboardId,
    deleteFactionFromStore,
    t,
  ]);

  const handleCancel = useCallback(() => {
    setEditData({ ...faction });
    setImagePreview(faction.image || "");
    setIsEditing(false);
  }, [faction]);

  const handleBack = useCallback(() => {
    navigateToFactionsTab();
  }, [navigateToFactionsTab]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setIsNavigationOpen(false);
  }, []);

  const handleDeleteModalOpen = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleNavigationToggle = useCallback(() => {
    setIsNavigationOpen((prev) => !prev);
  }, []);

  const handleNavigationClose = useCallback(() => {
    setIsNavigationOpen(false);
  }, []);

  const handleEditDataChange = useCallback((field: string, value: unknown) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = useCallback((image: string) => {
    setImagePreview(image);
    setEditData((prev) => ({ ...prev, image }));
  }, []);

  const handleImageFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
          setEditData((prev) => ({ ...prev, image: result }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => !prev);
  }, []);

  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === false ? true : false,
    }));
  }, []);

  const handleFactionSelect = useCallback(
    (newFactionId: string) => {
      if (!dashboardId) return;
      navigate({
        to: "/dashboard/$dashboardId/tabs/faction/$factionId",
        params: { dashboardId, factionId: newFactionId },
      });
    },
    [navigate, dashboardId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!faction.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t("not_found.title")}</h2>
          <p className="text-muted-foreground mb-4">
            {t("not_found.description")}
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            {t("buttons.back")}
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = currentStatus?.icon || Shield;
  const TypeIcon = currentType?.icon || Building2;

  return (
    <FactionDetailView
      faction={faction}
      editData={editData}
      isEditing={isEditing}
      versions={versions}
      currentVersion={selectedVersion}
      showDeleteModal={showDeleteModal}
      isNavigationSidebarOpen={isNavigationOpen}
      imagePreview={imagePreview}
      advancedSectionOpen={advancedSectionOpen}
      mockRaces={races}
      mockCharacters={characters}
      mockFactions={factions}
      statuses={FACTION_STATUS_CONSTANT}
      types={FACTION_TYPES_CONSTANT}
      influences={FACTION_INFLUENCE_CONSTANT}
      reputations={FACTION_REPUTATION_CONSTANT}
      currentStatus={currentStatus}
      currentType={currentType}
      currentInfluence={currentInfluence}
      currentReputation={currentReputation}
      StatusIcon={StatusIcon}
      TypeIcon={TypeIcon}
      fieldVisibility={fieldVisibility}
      fileInputRef={fileInputRef}
      onBack={handleBack}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDeleteModalOpen={handleDeleteModalOpen}
      onDeleteModalClose={handleDeleteModalClose}
      onConfirmDelete={handleConfirmDelete}
      onNavigationSidebarToggle={handleNavigationToggle}
      onNavigationSidebarClose={handleNavigationClose}
      onFactionSelect={handleFactionSelect}
      onEditDataChange={handleEditDataChange}
      onImageFileChange={handleImageFileChange}
      onAdvancedSectionToggle={handleAdvancedSectionToggle}
      onFieldVisibilityToggle={handleFieldVisibilityToggle}
      onVersionChange={handleVersionChange}
      onVersionCreate={handleVersionCreate}
      onVersionDelete={handleVersionDelete}
      onVersionUpdate={handleVersionUpdate}
    />
  );
}
