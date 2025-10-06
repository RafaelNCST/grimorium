import { useState, useRef, useCallback, useMemo } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { toast } from "sonner";

import { type CharacterVersion } from "@/components/character-version-manager";
import {
  mockCharacters,
  mockLocations,
  mockOrganizations,
} from "@/mocks/global";

import { ALIGNMENTS_CONSTANT } from "./constants/alignments-constant";
import { FAMILY_RELATIONS_CONSTANT } from "./constants/family-relations-constant";
import { GENDERS_CONSTANT } from "./constants/genders-constant";
import { RELATIONSHIP_TYPES_CONSTANT } from "./constants/relationship-types-constant";
import { ROLES_CONSTANT } from "./constants/roles-constant";
import { getFamilyRelationLabel } from "./utils/get-family-relation-label";
import { getRelationshipTypeData } from "./utils/get-relationship-type-data";
import { CharacterDetailView } from "./view";

export function CharacterDetail() {
  const { dashboardId, characterId } = useParams({
    from: "/dashboard/$dashboardId/tabs/character/$characterId/",
  });
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyCharacter = {
    id: "",
    name: "",
    age: 0,
    role: "",
    image: "",
    description: "",
    appearance: "",
    personality: "",
    backstory: "",
    motivations: "",
    fears: "",
    organization: "",
    birthPlace: "",
    currentLocation: "",
    alignment: "",
    qualities: [],
    relationships: [],
  };

  const [isEditing, setIsEditing] = useState(false);
  const [character, setCharacter] = useState(emptyCharacter);
  const [editData, setEditData] = useState({
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
  const [isLinkedNotesModalOpen, setIsLinkedNotesModalOpen] = useState(false);
  const [versions, setVersions] = useState<CharacterVersion[]>([
    {
      id: "version-1",
      name: "Versão Original",
      description: "Estado inicial do personagem",
      createdAt: new Date(),
      isActive: true,
      data: emptyCharacter,
    },
  ]);
  const [currentVersion, setCurrentVersion] = useState(versions[0]);

  const currentRole = useMemo(
    () => ROLES_CONSTANT.find((r) => r.value === character.role),
    [character.role]
  );
  const currentAlignment = useMemo(
    () => ALIGNMENTS_CONSTANT.find((a) => a.value === character.alignment),
    [character.alignment]
  );
  const currentGender = useMemo(
    () => GENDERS_CONSTANT.find((g) => g.value === character.gender),
    [character.gender]
  );
  const RoleIcon = currentRole?.icon || Users;

  const handleVersionChange = useCallback(
    (version: CharacterVersion) => {
      const updatedVersions = versions.map((v) => ({
        ...v,
        isActive: v.id === version.id,
      }));
      setVersions(updatedVersions);
      setCurrentVersion(version);

      setCharacter(version.data);
      setEditData({
        ...version.data,
        relationships: version.data.relationships || [],
      });
      setImagePreview(version.data.image);

      toast.success(`Versão "${version.name}" ativada`);
    },
    [versions]
  );

  const handleVersionSave = useCallback(
    (name: string, description?: string) => {
      const newVersion: CharacterVersion = {
        id: `version-${Date.now()}`,
        name,
        description,
        createdAt: new Date(),
        isActive: false,
        data: { ...character },
      };

      setVersions((prev) => [...prev, newVersion]);
      toast.success(`Versão "${name}" salva com sucesso!`);
    },
    [character]
  );

  const handleVersionDelete = useCallback(
    (versionId: string) => {
      if (versions.length <= 1) {
        toast.error("Não é possível excluir a última versão");
        return;
      }

      const versionToDelete = versions.find((v) => v.id === versionId);
      const updatedVersions = versions.filter((v) => v.id !== versionId);

      if (versionToDelete?.isActive && updatedVersions.length > 0) {
        updatedVersions[0].isActive = true;
        setCurrentVersion(updatedVersions[0]);
        setCharacter(updatedVersions[0].data);
        setEditData({
          ...updatedVersions[0].data,
          relationships: updatedVersions[0].data.relationships || [],
        });
        setImagePreview(updatedVersions[0].data.image);
      }

      setVersions(updatedVersions);
    },
    [versions]
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

  const handleSave = useCallback(() => {
    const updatedCharacter = { ...editData };
    setCharacter(updatedCharacter);

    const updatedVersions = versions.map((v) =>
      v.isActive ? { ...v, data: updatedCharacter } : v
    );
    setVersions(updatedVersions);

    const activeVersion = updatedVersions.find((v) => v.isActive);
    if (activeVersion) {
      setCurrentVersion(activeVersion);
    }

    setIsEditing(false);
    toast.success("Personagem atualizado com sucesso!");
  }, [editData, versions]);

  const navigateToCharactersTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleDelete = useCallback(() => {
    toast.success("Personagem excluído com sucesso!");
    navigateToCharactersTab();
  }, [navigateToCharactersTab]);

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
    navigateBack();
  }, [navigateBack]);

  const handleNavigationSidebarToggle = useCallback(() => {
    setIsNavigationSidebarOpen(true);
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

  const handleLinkedNotesModalOpen = useCallback(() => {
    setIsLinkedNotesModalOpen(true);
  }, []);

  const handleLinkedNotesModalClose = useCallback(() => {
    setIsLinkedNotesModalOpen(false);
  }, []);

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

  return (
    <CharacterDetailView
      character={character}
      editData={editData}
      isEditing={isEditing}
      versions={versions}
      currentVersion={currentVersion}
      showDeleteModal={showDeleteModal}
      isNavigationSidebarOpen={isNavigationSidebarOpen}
      isLinkedNotesModalOpen={isLinkedNotesModalOpen}
      newQuality={newQuality}
      imagePreview={imagePreview}
      selectedRelationshipCharacter={selectedRelationshipCharacter}
      selectedRelationshipType={selectedRelationshipType}
      relationshipIntensity={relationshipIntensity}
      fileInputRef={fileInputRef}
      linkedNotes={[]}
      mockCharacters={mockCharacters}
      mockLocations={mockLocations}
      mockOrganizations={mockOrganizations}
      roles={ROLES_CONSTANT}
      alignments={ALIGNMENTS_CONSTANT}
      genders={GENDERS_CONSTANT}
      familyRelations={FAMILY_RELATIONS_CONSTANT}
      relationshipTypes={RELATIONSHIP_TYPES_CONSTANT}
      currentRole={currentRole}
      currentAlignment={currentAlignment}
      currentGender={currentGender}
      RoleIcon={RoleIcon}
      onBack={handleBack}
      onNavigationSidebarToggle={handleNavigationSidebarToggle}
      onNavigationSidebarClose={handleNavigationSidebarClose}
      onCharacterSelect={handleCharacterSelect}
      onLinkedNotesModalOpen={handleLinkedNotesModalOpen}
      onLinkedNotesModalClose={handleLinkedNotesModalClose}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      onDeleteModalOpen={handleDeleteModalOpen}
      onDeleteModalClose={handleDeleteModalClose}
      onVersionChange={handleVersionChange}
      onVersionSave={handleVersionSave}
      onVersionDelete={handleVersionDelete}
      onVersionUpdate={handleVersionUpdate}
      onImageFileChange={handleImageFileChange}
      onAgeChange={handleAgeChange}
      onEditDataChange={handleEditDataChange}
      onQualityAdd={handleAddQuality}
      onQualityRemove={handleRemoveQuality}
      onNewQualityChange={handleNewQualityChange}
      onFamilyRelationChange={handleFamilyRelationChange}
      onRelationshipAdd={handleAddRelationship}
      onRelationshipRemove={handleRemoveRelationship}
      onRelationshipIntensityUpdate={handleUpdateRelationshipIntensity}
      onRelationshipCharacterChange={handleRelationshipCharacterChange}
      onRelationshipTypeChange={handleRelationshipTypeChange}
      onRelationshipIntensityChange={handleRelationshipIntensityChange}
      onNavigateToFamilyTree={handleNavigateToFamilyTree}
      getRelationshipTypeData={getRelationshipTypeData}
      getFamilyRelationLabel={getFamilyRelationLabel}
    />
  );
}
