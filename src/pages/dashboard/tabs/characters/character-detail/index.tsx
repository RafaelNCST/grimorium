import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { CHARACTER_ROLES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-roles";
import { GENDERS_CONSTANT as GENDERS_CONSTANT_MODAL } from "@/components/modals/create-character-modal/constants/genders";
import {
  getCharacterById,
  getCharactersByBookId,
  updateCharacter,
  deleteCharacter,
  getCharacterRelationships,
  saveCharacterRelationships,
  getCharacterFamily,
  saveCharacterFamily,
} from "@/lib/db/characters.service";
import { mockLocations, mockOrganizations } from "@/mocks/global";
import {
  type ICharacterVersion,
  type ICharacterFormData,
  type ICharacter,
  type IFieldVisibility,
} from "@/types/character-types";

import { ALIGNMENTS_CONSTANT } from "./constants/alignments-constant";
import { FAMILY_RELATIONS_CONSTANT } from "./constants/family-relations-constant";
import { RELATIONSHIP_TYPES_CONSTANT } from "./constants/relationship-types-constant";
import { getFamilyRelationLabel } from "./utils/get-family-relation-label";
import { getRelationshipTypeData } from "./utils/get-relationship-type-data";
import { CharacterDetailViewRefactored } from "./view-refactored";

export function CharacterDetail() {
  const { dashboardId, characterId } = useParams({
    from: "/dashboard/$dashboardId/tabs/character/$characterId/",
  });
  const navigate = useNavigate();
  const { t } = useTranslation("character-detail");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyCharacter: ICharacter = {
    id: "",
    name: "",
    age: "0",
    role: "",
    image: "",
    gender: "",
    description: "",
    alignment: "",
    qualities: [],
    relationships: [],
    family: {
      father: null,
      mother: null,
      spouse: null,
      children: [],
      siblings: [],
      halfSiblings: [],
      grandparents: [],
      unclesAunts: [],
      cousins: [],
    },
    fieldVisibility: {},
    createdAt: new Date().toISOString(),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [character, setCharacter] = useState<ICharacter>(emptyCharacter);
  const [editData, setEditData] = useState<ICharacter>({
    ...emptyCharacter,
    relationships: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newQuality, setNewQuality] = useState("");
  const [_imageFile, _setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedRelationshipCharacter, setSelectedRelationshipCharacter] =
    useState("");
  const [selectedRelationshipType, setSelectedRelationshipType] = useState("");
  const [relationshipIntensity, setRelationshipIntensity] = useState([50]);
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  // TODO: Refatorar anotações no futuro
  // const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);
  const [versions, setVersions] = useState<ICharacterVersion[]>([
    {
      id: "main-version",
      name: "Versão Principal",
      description: "Versão principal do personagem",
      createdAt: new Date().toISOString(),
      isMain: true,
      characterData: emptyCharacter as ICharacter,
    },
  ]);
  const [currentVersion, setCurrentVersion] =
    useState<ICharacterVersion | null>(versions[0]);
  const [fieldVisibility, setFieldVisibility] = useState<IFieldVisibility>({});
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);
  const [_isLoading, setIsLoading] = useState(true);
  const [allCharacters, setAllCharacters] = useState<ICharacter[]>([]);

  // Load character from database
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const characterFromDB = await getCharacterById(characterId);
        if (characterFromDB) {
          setCharacter(characterFromDB);
          setEditData(characterFromDB);
          setImagePreview(characterFromDB.image || "");
          setFieldVisibility(characterFromDB.fieldVisibility || {});

          // Load relationships
          const relationships = await getCharacterRelationships(characterId);
          setCharacter((prev) => ({ ...prev, relationships }));
          setEditData((prev) => ({ ...prev, relationships }));

          // Load family
          const family = await getCharacterFamily(characterId);
          setCharacter((prev) => ({ ...prev, family }));
          setEditData((prev) => ({ ...prev, family }));

          // Update main version with loaded data
          setVersions((prev) =>
            prev.map((v) =>
              v.isMain
                ? {
                    ...v,
                    characterData: {
                      ...characterFromDB,
                      relationships,
                      family,
                    },
                  }
                : v
            )
          );

          // Load all characters from the same book
          if (dashboardId) {
            const allCharsFromBook = await getCharactersByBookId(dashboardId);
            setAllCharacters(allCharsFromBook);
          }
        }
      } catch (error) {
        console.error("Error loading character:", error);
        toast.error("Erro ao carregar personagem");
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, [characterId, dashboardId]);

  const currentRole = useMemo(
    () => CHARACTER_ROLES_CONSTANT.find((r) => r.value === character.role),
    [character.role]
  );
  const currentAlignment = useMemo(
    () => ALIGNMENTS_CONSTANT.find((a) => a.value === character.alignment),
    [character.alignment]
  );
  const currentGender = useMemo(
    () => GENDERS_CONSTANT_MODAL.find((g) => g.value === character.gender),
    [character.gender]
  );
  const RoleIcon = currentRole?.icon || Users;

  const handleVersionChange = useCallback(
    (versionId: string | null) => {
      if (!versionId) return;

      const version = versions.find((v) => v.id === versionId);
      if (!version) return;

      setCurrentVersion(version);
      setCharacter(version.characterData as any);
      setEditData({
        ...(version.characterData as any),
        relationships: version.characterData.relationships || [],
      });
      setImagePreview(version.characterData.image || "");
      setFieldVisibility(version.characterData.fieldVisibility || {});

      toast.success(`Versão "${version.name}" ativada`);
    },
    [versions]
  );

  const handleVersionCreate = useCallback(
    (versionData: {
      name: string;
      description: string;
      characterData: ICharacterFormData;
    }) => {
      const newVersion: ICharacterVersion = {
        id: `version-${Date.now()}`,
        name: versionData.name,
        description: versionData.description,
        createdAt: new Date().toISOString(),
        isMain: false,
        characterData: versionData.characterData as unknown as ICharacter,
      };

      setVersions((prev) => [...prev, newVersion]);
      toast.success(`Versão "${versionData.name}" criada com sucesso!`);
    },
    []
  );

  const handleVersionDelete = useCallback(
    (versionId: string) => {
      const versionToDelete = versions.find((v) => v.id === versionId);

      // Não permitir deletar versão principal
      if (versionToDelete?.isMain) {
        toast.error("Não é possível excluir a versão principal");
        return;
      }

      const updatedVersions = versions.filter((v) => v.id !== versionId);

      // Se a versão deletada for a atual, voltar para a principal
      if (currentVersion?.id === versionId) {
        const mainVersion = updatedVersions.find((v) => v.isMain);
        if (mainVersion) {
          setCurrentVersion(mainVersion);
          setCharacter(mainVersion.characterData as any);
          setEditData({
            ...(mainVersion.characterData as any),
            relationships: mainVersion.characterData.relationships || [],
          });
          setImagePreview(mainVersion.characterData.image || "");
        }
      }

      setVersions(updatedVersions);
      toast.success("Versão excluída com sucesso!");
    },
    [versions, currentVersion]
  );

  const handleVersionUpdate = useCallback(
    (versionId: string, name: string, description?: string) => {
      const updatedVersions = versions.map((v) =>
        v.id === versionId ? { ...v, name, description } : v
      );
      setVersions(updatedVersions);

      if (currentVersion.id === versionId) {
        setCurrentVersion({ ...currentVersion, name, description });
      }
    },
    [versions, currentVersion]
  );

  const handleSave = useCallback(async () => {
    const updatedCharacter = { ...editData, fieldVisibility };
    setCharacter(updatedCharacter);

    // Atualizar dados na versão atual
    const updatedVersions = versions.map((v) =>
      v.id === currentVersion?.id
        ? { ...v, characterData: updatedCharacter as ICharacter }
        : v
    );
    setVersions(updatedVersions);

    const activeVersion = updatedVersions.find(
      (v) => v.id === currentVersion?.id
    );
    if (activeVersion) {
      setCurrentVersion(activeVersion);
    }

    try {
      // Save to database
      await updateCharacter(characterId, updatedCharacter);

      // Save relationships
      if (updatedCharacter.relationships) {
        await saveCharacterRelationships(
          characterId,
          updatedCharacter.relationships
        );
      }

      // Save family
      if (updatedCharacter.family) {
        await saveCharacterFamily(characterId, updatedCharacter.family);
      }

      setIsEditing(false);
      toast.success("Personagem atualizado com sucesso!");
    } catch (error) {
      console.error("Error saving character:", error);
      toast.error("Erro ao salvar personagem");
    }
  }, [editData, fieldVisibility, versions, currentVersion, characterId]);

  const navigateToCharactersTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleConfirmDelete = useCallback(async () => {
    console.log("handleConfirmDelete called", { currentVersion, characterId });
    if (currentVersion && !currentVersion.isMain) {
      // Delete version (non-main)
      const versionToDelete = versions.find((v) => v.id === currentVersion.id);

      if (!versionToDelete) return;

      const updatedVersions = versions.filter(
        (v) => v.id !== currentVersion.id
      );

      // Switch to main version after deleting
      const mainVersion = updatedVersions.find((v) => v.isMain);
      if (mainVersion) {
        setCurrentVersion(mainVersion);
        setCharacter(mainVersion.characterData as any);
        setEditData({
          ...(mainVersion.characterData as any),
          relationships: mainVersion.characterData.relationships || [],
        });
        setImagePreview(mainVersion.characterData.image || "");
        setFieldVisibility(mainVersion.characterData.fieldVisibility || {});
      }

      setVersions(updatedVersions);
      toast.success(t("delete.version.success"));
    } else {
      // Delete entire character (main version)
      console.log("Attempting to delete character");
      try {
        console.log("Calling deleteCharacter with ID:", characterId);
        await deleteCharacter(characterId);
        console.log("Delete successful, showing toast");
        toast.success(t("delete.character.step2.success"));
        console.log("Navigating to characters tab");
        navigateToCharactersTab();
      } catch (error) {
        console.error("Error deleting character:", error);
        toast.error("Erro ao excluir personagem");
      }
    }
  }, [currentVersion, versions, navigateToCharactersTab, characterId, t]);

  const handleCancel = useCallback(() => {
    setEditData({ ...character, relationships: character.relationships || [] });
    setIsEditing(false);
  }, [character]);

  const handleAddQuality = useCallback(() => {
    if (newQuality.trim() && !editData.qualities.includes(newQuality.trim())) {
      setEditData((prev) => ({
        ...prev,
        qualities: [...prev.qualities, newQuality.trim()],
      }));
      setNewQuality("");
    }
  }, [newQuality, editData.qualities]);

  const handleRemoveQuality = useCallback((qualityToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      qualities: prev.qualities.filter((q) => q !== qualityToRemove),
    }));
  }, []);

  const handleFamilyRelationChange = useCallback(
    (relationType: string, characterId: string | null) => {
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
    },
    []
  );

  const handleImageFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const handleAgeChange = useCallback((increment: boolean) => {
    setEditData((prev) => ({
      ...prev,
      age: Math.max(0, prev.age + (increment ? 1 : -1)),
    }));
  }, []);

  const handleAddRelationship = useCallback(() => {
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
  }, [
    selectedRelationshipCharacter,
    selectedRelationshipType,
    relationshipIntensity,
  ]);

  const handleRemoveRelationship = useCallback((relationshipId: string) => {
    setEditData((prev) => ({
      ...prev,
      relationships:
        prev.relationships?.filter((rel) => rel.id !== relationshipId) || [],
    }));
    toast.success("Relacionamento removido com sucesso!");
  }, []);

  const handleUpdateRelationshipIntensity = useCallback(
    (relationshipId: string, intensity: number) => {
      setEditData((prev) => ({
        ...prev,
        relationships:
          prev.relationships?.map((rel) =>
            rel.id === relationshipId ? { ...rel, intensity } : rel
          ) || [],
      }));
    },
    []
  );

  const navigateBack = useCallback(() => {
    window.history.back();
  }, []);

  const navigateToFamilyTree = useCallback(() => {
    if (!dashboardId || !characterId) return;
    navigate({
      to: "/dashboard/$dashboardId/tabs/character/$characterId/family-tree",
      params: { dashboardId, characterId },
    });
  }, [navigate, dashboardId, characterId]);

  const handleNavigateToCharacter = useCallback((characterId: string) => {
    window.location.replace(`/book/1/character/${characterId}`);
  }, []);

  const handleBack = useCallback(() => {
    navigateToCharactersTab();
  }, [navigateToCharactersTab]);

  const handleNavigationSidebarToggle = useCallback(() => {
    setIsNavigationSidebarOpen((prev) => !prev);
  }, []);

  const handleNavigationSidebarClose = useCallback(() => {
    setIsNavigationSidebarOpen(false);
  }, []);

  const handleCharacterSelect = useCallback(
    (characterId: string) => {
      handleNavigateToCharacter(characterId);
    },
    [handleNavigateToCharacter]
  );

  // TODO: Refatorar anotações no futuro
  // const handleLinkedNotesModalOpen = useCallback(() => {
  //   setIsLinkedNotesModalOpen(true);
  // }, []);

  // const handleLinkedNotesModalClose = useCallback(() => {
  //   setIsLinkedNotesModalOpen(false);
  // }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleDeleteModalOpen = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleEditDataChange = useCallback((field: string, value: unknown) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNewQualityChange = useCallback((value: string) => {
    setNewQuality(value);
  }, []);

  const handleRelationshipCharacterChange = useCallback(
    (characterId: string) => {
      setSelectedRelationshipCharacter(characterId);
    },
    []
  );

  const handleRelationshipTypeChange = useCallback((type: string) => {
    setSelectedRelationshipType(type);
  }, []);

  const handleRelationshipIntensityChange = useCallback(
    (intensity: number[]) => {
      setRelationshipIntensity(intensity);
    },
    []
  );

  const handleNavigateToFamilyTree = useCallback(() => {
    navigateToFamilyTree();
  }, [navigateToFamilyTree]);

  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === false ? true : false,
    }));
  }, []);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => !prev);
  }, []);

  return (
    <CharacterDetailViewRefactored
      character={character}
      editData={editData}
      isEditing={isEditing}
      versions={versions}
      currentVersion={currentVersion}
      showDeleteModal={showDeleteModal}
      isNavigationSidebarOpen={isNavigationSidebarOpen}
      newQuality={newQuality}
      imagePreview={imagePreview}
      selectedRelationshipCharacter={selectedRelationshipCharacter}
      selectedRelationshipType={selectedRelationshipType}
      relationshipIntensity={relationshipIntensity}
      fileInputRef={fileInputRef}
      mockCharacters={allCharacters}
      mockLocations={mockLocations}
      mockOrganizations={mockOrganizations}
      roles={CHARACTER_ROLES_CONSTANT}
      alignments={ALIGNMENTS_CONSTANT}
      genders={GENDERS_CONSTANT_MODAL}
      relationshipTypes={RELATIONSHIP_TYPES_CONSTANT}
      currentRole={currentRole}
      currentAlignment={currentAlignment}
      currentGender={currentGender}
      RoleIcon={RoleIcon}
      fieldVisibility={fieldVisibility}
      advancedSectionOpen={advancedSectionOpen}
      onBack={handleBack}
      onNavigationSidebarToggle={handleNavigationSidebarToggle}
      onNavigationSidebarClose={handleNavigationSidebarClose}
      onCharacterSelect={handleCharacterSelect}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDeleteModalOpen={handleDeleteModalOpen}
      onDeleteModalClose={handleDeleteModalClose}
      onConfirmDelete={handleConfirmDelete}
      onVersionChange={handleVersionChange}
      onVersionCreate={handleVersionCreate}
      onVersionDelete={handleVersionDelete}
      onVersionUpdate={handleVersionUpdate}
      onImageFileChange={handleImageFileChange}
      onAgeChange={handleAgeChange}
      onEditDataChange={handleEditDataChange}
      onRelationshipAdd={handleAddRelationship}
      onRelationshipRemove={handleRemoveRelationship}
      onRelationshipIntensityUpdate={handleUpdateRelationshipIntensity}
      onRelationshipCharacterChange={handleRelationshipCharacterChange}
      onRelationshipTypeChange={handleRelationshipTypeChange}
      onRelationshipIntensityChange={handleRelationshipIntensityChange}
      onFieldVisibilityToggle={handleFieldVisibilityToggle}
      onAdvancedSectionToggle={handleAdvancedSectionToggle}
      getRelationshipTypeData={getRelationshipTypeData}
    />
  );
}
