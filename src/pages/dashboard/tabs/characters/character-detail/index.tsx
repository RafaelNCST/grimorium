import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { CHARACTER_ROLES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-roles";
import { GENDERS_CONSTANT as GENDERS_CONSTANT_MODAL } from "@/components/modals/create-character-modal/constants/genders";
import {
  getCharacterById,
  getCharactersByBookId,
  getCharacterRelationships,
  saveCharacterRelationships,
  getCharacterFamily,
  saveCharacterFamily,
  getCharacterVersions,
  createCharacterVersion,
  deleteCharacterVersion,
  updateCharacterVersion,
} from "@/lib/db/characters.service";
import {
  getPowerLinksByCharacterId,
  updatePowerCharacterLinkLabel,
  deletePowerCharacterLink,
  getPowerPageById,
  getPowerSectionById,
} from "@/lib/db/power-system.service";
import { mockLocations, mockFactions } from "@/mocks/global";
import type { IPowerCharacterLink } from "@/pages/dashboard/tabs/power-system/types/power-system-types";
import { useCharactersStore } from "@/stores/characters-store";
import {
  type ICharacterVersion,
  type ICharacterFormData,
  type ICharacter,
  type IFieldVisibility,
} from "@/types/character-types";
import { type ISectionVisibility } from "@/components/detail-page/visibility-helpers";

import { ALIGNMENTS_CONSTANT } from "./constants/alignments-constant";
import { FAMILY_RELATIONS_CONSTANT } from "./constants/family-relations-constant";
import { RELATIONSHIP_TYPES_CONSTANT } from "./constants/relationship-types-constant";
import { getFamilyRelationLabel } from "./utils/get-family-relation-label";
import { getRelationshipTypeData } from "./utils/get-relationship-type-data";
import { CharacterDetailView } from "./view";
import { UnsavedChangesDialog } from "./components/unsaved-changes-dialog";
import { CharacterSchema } from "@/lib/validation/character-schema";

// Extended type to include page/section titles
interface IPowerLinkWithTitles extends IPowerCharacterLink {
  pageTitle?: string;
  sectionTitle?: string;
}

export function CharacterDetail() {
  const { dashboardId, characterId } = useParams({
    from: "/dashboard/$dashboardId/tabs/character/$characterId/",
  });
  const navigate = useNavigate();
  const { t } = useTranslation("character-detail");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usar o store para atualizar personagens
  const updateCharacterInStore = useCharactersStore(
    (state) => state.updateCharacterInCache
  );
  const deleteCharacterFromStore = useCharactersStore(
    (state) => state.deleteCharacterFromCache
  );

  const emptyCharacter: ICharacter = {
    id: "",
    name: "",
    age: "0",
    role: "",
    image: "",
    gender: "",
    description: "",
    alignment: "",
    birthPlace: [],
    qualities: [],
    relationships: [],
    family: {
      grandparents: [],
      parents: [],
      spouses: [],
      unclesAunts: [],
      cousins: [],
      children: [],
      siblings: [],
      halfSiblings: [],
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
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
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
  const [sectionVisibility, setSectionVisibility] = useState<ISectionVisibility>({});
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(() => {
    const stored = localStorage.getItem("characterDetailAdvancedSectionOpen");
    return stored ? JSON.parse(stored) : false;
  });
  const [_isLoading, setIsLoading] = useState(true);
  const [allCharacters, setAllCharacters] = useState<ICharacter[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Power links state
  const [characterPowerLinks, setCharacterPowerLinks] = useState<
    IPowerLinkWithTitles[]
  >([]);
  const [isEditLinkModalOpen, setIsEditLinkModalOpen] = useState(false);
  const [selectedLinkForEdit, setSelectedLinkForEdit] =
    useState<IPowerCharacterLink | null>(null);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Original states for comparison
  const [originalFieldVisibility, setOriginalFieldVisibility] =
    useState<IFieldVisibility>({});
  const [originalSectionVisibility, setOriginalSectionVisibility] =
    useState<ISectionVisibility>({});

  // Save advanced section state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "characterDetailAdvancedSectionOpen",
      JSON.stringify(advancedSectionOpen)
    );
  }, [advancedSectionOpen]);

  // Função de validação de campo individual (onBlur)
  const validateField = useCallback((field: string, value: any) => {
    try {
      // Validar apenas este campo
      const fieldSchema = CharacterSchema.pick({ [field]: true } as any);
      fieldSchema.parse({ [field]: value });

      // Se passou, remover erro
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Traduzir a mensagem de erro
        const errorMessage = error.errors[0].message;
        const translatedMessage = errorMessage.startsWith("character-detail:")
          ? t(errorMessage)
          : errorMessage;

        setErrors((prev) => ({
          ...prev,
          [field]: translatedMessage,
        }));
        return false;
      }
    }
  }, [t]);

  // Verificar se tem campos obrigatórios vazios e quais são
  const { hasRequiredFieldsEmpty, missingFields } = useMemo(() => {
    if (!editData) return { hasRequiredFieldsEmpty: false, missingFields: [] };

    try {
      // Validar apenas campos obrigatórios
      CharacterSchema.pick({
        name: true,
        age: true,
        role: true,
        gender: true,
        description: true,
      } as any).parse({
        name: editData.name,
        age: editData.age,
        role: editData.role,
        gender: editData.gender,
        description: editData.description,
      });
      return { hasRequiredFieldsEmpty: false, missingFields: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missing = error.errors.map((e) => e.path[0] as string);
        return { hasRequiredFieldsEmpty: true, missingFields: missing };
      }
      return { hasRequiredFieldsEmpty: true, missingFields: [] };
    }
  }, [editData]);

  // Check if there are changes between character and editData
  const hasChanges = useMemo(() => {
    if (!isEditing) return false;

    // Check if visibility has changed
    if (
      JSON.stringify(fieldVisibility) !==
      JSON.stringify(originalFieldVisibility)
    )
      return true;

    // Check if section visibility has changed
    if (
      JSON.stringify(sectionVisibility) !==
      JSON.stringify(originalSectionVisibility)
    )
      return true;

    // Helper function to compare arrays (order-independent for IDs, order-dependent for strings)
    const arraysEqual = (
      a: unknown[] | undefined,
      b: unknown[] | undefined
    ): boolean => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a.length !== b.length) return false;

      // For string arrays, order matters
      if (a.length > 0 && typeof a[0] === "string") {
        return a.every((item, index) => item === b[index]);
      }

      // For ID arrays, order doesn't matter
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((item, index) => item === sortedB[index]);
    };

    // Compare basic fields
    if (character.name !== editData.name) return true;
    if (character.age !== editData.age) return true;
    if (character.role !== editData.role) return true;
    if (character.gender !== editData.gender) return true;
    if (character.description !== editData.description) return true;
    if (character.image !== editData.image) return true;
    if (character.alignment !== editData.alignment) return true;

    // Compare appearance fields
    if (character.height !== editData.height) return true;
    if (character.weight !== editData.weight) return true;
    if (character.skinTone !== editData.skinTone) return true;
    if (character.physicalType !== editData.physicalType) return true;
    if (character.hair !== editData.hair) return true;
    if (character.eyes !== editData.eyes) return true;
    if (character.face !== editData.face) return true;
    if (character.distinguishingFeatures !== editData.distinguishingFeatures)
      return true;

    if (!arraysEqual(character.speciesAndRace, editData.speciesAndRace))
      return true;

    // Compare behavior fields
    if (character.archetype !== editData.archetype) return true;
    if (character.personality !== editData.personality) return true;
    if (character.hobbies !== editData.hobbies) return true;
    if (character.dreamsAndGoals !== editData.dreamsAndGoals) return true;
    if (character.fearsAndTraumas !== editData.fearsAndTraumas) return true;
    if (character.favoriteFood !== editData.favoriteFood) return true;
    if (character.favoriteMusic !== editData.favoriteMusic) return true;

    // Compare locations
    if (!arraysEqual(character.birthPlace, editData.birthPlace)) return true;

    // Compare relationships
    if (
      JSON.stringify(character.relationships) !==
      JSON.stringify(editData.relationships)
    )
      return true;

    // Compare family
    if (JSON.stringify(character.family) !== JSON.stringify(editData.family))
      return true;

    return false;
  }, [
    character,
    editData,
    isEditing,
    fieldVisibility,
    originalFieldVisibility,
    sectionVisibility,
    originalSectionVisibility,
  ]);

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
          setOriginalFieldVisibility(characterFromDB.fieldVisibility || {});

          // Load relationships
          const relationships = await getCharacterRelationships(characterId);
          setCharacter((prev) => ({ ...prev, relationships }));
          setEditData((prev) => ({ ...prev, relationships }));

          // Load family
          const family = await getCharacterFamily(characterId);
          setCharacter((prev) => ({ ...prev, family }));
          setEditData((prev) => ({ ...prev, family }));

          // Load versions from database
          const versionsFromDB = await getCharacterVersions(characterId);

          // Se não houver versões, criar a versão principal
          if (versionsFromDB.length === 0) {
            const mainVersion: ICharacterVersion = {
              id: `main-version-${characterId}`,
              name: "Versão Principal",
              description: "Versão principal do personagem",
              createdAt: new Date().toISOString(),
              isMain: true,
              characterData: {
                ...characterFromDB,
                relationships,
                family,
              },
            };

            await createCharacterVersion(characterId, mainVersion);
            setVersions([mainVersion]);
            setCurrentVersion(mainVersion);
          } else {
            // Atualizar versão principal com dados carregados
            const updatedVersions = versionsFromDB.map((v) =>
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
            );
            setVersions(updatedVersions);

            // Definir versão principal como atual
            const mainVersion = updatedVersions.find((v) => v.isMain);
            if (mainVersion) {
              setCurrentVersion(mainVersion);
            }
          }

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

  // Load power links when character loads
  useEffect(() => {
    if (characterId) {
      loadPowerLinks();
    }
  }, [characterId]);

  async function loadPowerLinks() {
    try {
      const links = await getPowerLinksByCharacterId(characterId);

      // Fetch page/section titles for each link
      const linksWithTitles = await Promise.all(
        links.map(async (link) => {
          let pageTitle: string | undefined;
          let sectionTitle: string | undefined;

          if (link.pageId) {
            const page = await getPowerPageById(link.pageId);
            pageTitle = page?.name;
          } else if (link.sectionId) {
            const section = await getPowerSectionById(link.sectionId);
            sectionTitle = section?.title;
          }

          return {
            ...link,
            pageTitle,
            sectionTitle,
          };
        })
      );

      setCharacterPowerLinks(linksWithTitles);
    } catch (error) {
      console.error("Error loading power links:", error);
    }
  }

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
    async (versionData: {
      name: string;
      description: string;
      characterData: ICharacterFormData;
    }) => {
      try {
        const newVersion: ICharacterVersion = {
          id: `version-${Date.now()}`,
          name: versionData.name,
          description: versionData.description,
          createdAt: new Date().toISOString(),
          isMain: false,
          characterData: versionData.characterData as unknown as ICharacter,
        };

        // Salvar no banco de dados
        await createCharacterVersion(characterId, newVersion);

        // Atualizar o estado apenas se o save for bem-sucedido
        setVersions((prev) => [...prev, newVersion]);
        toast.success(`Versão "${versionData.name}" criada com sucesso!`);
      } catch (error) {
        console.error("Error creating character version:", error);
        toast.error("Erro ao criar versão");
      }
    },
    [characterId]
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
        await deleteCharacterVersion(versionId);

        // Atualizar o estado apenas se o delete for bem-sucedido
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
      } catch (error) {
        console.error("Error deleting character version:", error);
        toast.error("Erro ao excluir versão");
      }
    },
    [versions, currentVersion]
  );

  const handleVersionUpdate = useCallback(
    async (versionId: string, name: string, description?: string) => {
      try {
        // Atualizar no banco de dados
        await updateCharacterVersion(versionId, name, description);

        // Atualizar o estado apenas se o update for bem-sucedido
        const updatedVersions = versions.map((v) =>
          v.id === versionId ? { ...v, name, description } : v
        );
        setVersions(updatedVersions);

        if (currentVersion.id === versionId) {
          setCurrentVersion({ ...currentVersion, name, description });
        }
      } catch (error) {
        console.error("Error updating character version:", error);
        toast.error("Erro ao atualizar versão");
      }
    },
    [versions, currentVersion]
  );

  const handleSave = useCallback(async () => {
    try {
      console.log("[handleSave] Starting save...", { currentVersion, editData });

      // Validar TUDO com Zod
      const validatedData = CharacterSchema.parse({
        name: editData.name,
        age: editData.age,
        role: editData.role,
        gender: editData.gender,
        description: editData.description,
        image: editData.image,
        alignment: editData.alignment,
        // Appearance
        height: editData.height,
        weight: editData.weight,
        skinTone: editData.skinTone,
        physicalType: editData.physicalType,
        hair: editData.hair,
        eyes: editData.eyes,
        face: editData.face,
        distinguishingFeatures: editData.distinguishingFeatures,
        speciesAndRace: editData.speciesAndRace,
        // Behavior
        archetype: editData.archetype,
        personality: editData.personality,
        hobbies: editData.hobbies,
        dreamsAndGoals: editData.dreamsAndGoals,
        fearsAndTraumas: editData.fearsAndTraumas,
        favoriteFood: editData.favoriteFood,
        favoriteMusic: editData.favoriteMusic,
        // Locations
        birthPlace: editData.birthPlace,
        // Relations
        family: editData.family,
        relationships: editData.relationships,
      });

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

      // Atualizar no store (que também salva no DB)
      await updateCharacterInStore(characterId, updatedCharacter);

      // Update original visibility to match saved state
      setOriginalFieldVisibility(fieldVisibility);

      setErrors({}); // Limpar erros
      setIsEditing(false);
      toast.success("Personagem atualizado com sucesso!");
    } catch (error) {
      console.error("[handleSave] Error caught:", error);
      if (error instanceof z.ZodError) {
        console.error("[handleSave] Zod validation errors:", error.errors);
        // Mapear erros para cada campo e traduzir
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          // Traduzir a mensagem de erro
          const errorMessage = err.message;
          const translatedMessage = errorMessage.startsWith("character-detail:")
            ? t(errorMessage)
            : errorMessage;
          newErrors[field] = translatedMessage;
        });
        setErrors(newErrors);
      } else {
        console.error("Error saving character:", error);
        toast.error("Erro ao salvar personagem");
      }
    }
  }, [
    editData,
    fieldVisibility,
    versions,
    currentVersion,
    characterId,
    updateCharacterInStore,
  ]);

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
        if (!dashboardId) return;
        // Deletar do store (que também deleta do DB)
        await deleteCharacterFromStore(dashboardId, characterId);
        console.log("Delete successful, showing toast");
        toast.success(t("delete.character.step2.success"));
        console.log("Navigating to characters tab");
        navigateToCharactersTab();
      } catch (error) {
        console.error("Error deleting character:", error);
        toast.error("Erro ao excluir personagem");
      }
    }
  }, [
    currentVersion,
    versions,
    navigateToCharactersTab,
    characterId,
    dashboardId,
    deleteCharacterFromStore,
    t,
  ]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditData({ ...character, relationships: character.relationships || [] });
    setFieldVisibility(originalFieldVisibility);
    setSectionVisibility(originalSectionVisibility);
    setErrors({});
    setIsEditing(false);
  }, [character, originalFieldVisibility, originalSectionVisibility, hasChanges]);

  const handleConfirmCancel = useCallback(() => {
    setEditData({ ...character, relationships: character.relationships || [] });
    setFieldVisibility(originalFieldVisibility);
    setSectionVisibility(originalSectionVisibility);
    setErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [character, originalFieldVisibility, originalSectionVisibility]);

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
    setIsNavigationSidebarOpen(false);
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

  const handleFieldVisibilityToggle = useCallback((fieldName: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] === false ? true : false,
    }));
  }, []);

  const handleSectionVisibilityToggle = useCallback((sectionName: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName] === false ? true : false,
    }));
  }, []);

  const handleAdvancedSectionToggle = useCallback(() => {
    setAdvancedSectionOpen((prev) => !prev);
  }, []);

  const toggleSection = useCallback((sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  }, []);

  // Power links handlers
  const handleNavigateToPowerInstance = useCallback(
    (linkId: string) => {
      if (!dashboardId) return;
      navigate({
        to: "/dashboard/$dashboardId/tabs/character/$characterId/power/$linkId",
        params: { dashboardId, characterId, linkId },
      });
    },
    [navigate, dashboardId, characterId]
  );

  const handleEditLink = useCallback((link: IPowerCharacterLink) => {
    setSelectedLinkForEdit(link);
    setIsEditLinkModalOpen(true);
  }, []);

  const handleSaveLink = useCallback(
    async (linkId: string, customLabel: string) => {
      try {
        await updatePowerCharacterLinkLabel(linkId, customLabel);
        await loadPowerLinks();
        toast.success(t("character-detail:power_links.link_updated"));
        setIsEditLinkModalOpen(false);
      } catch (error) {
        toast.error(t("character-detail:power_links.error_updating_link"));
      }
    },
    [t]
  );

  const handleDeleteLink = useCallback(
    async (linkId: string) => {
      try {
        await deletePowerCharacterLink(linkId);
        await loadPowerLinks();
        toast.success(t("character-detail:power_links.link_deleted"));
        setIsEditLinkModalOpen(false);
      } catch (error) {
        toast.error(t("character-detail:power_links.error_deleting_link"));
      }
    },
    [t]
  );

  return (
    <>
      <UnsavedChangesDialog
        open={showUnsavedChangesDialog}
        onOpenChange={setShowUnsavedChangesDialog}
        onConfirm={handleConfirmCancel}
      />

      <CharacterDetailView
        character={character}
        editData={editData}
        isEditing={isEditing}
        hasChanges={hasChanges}
        bookId={dashboardId}
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
        mockFactions={mockFactions}
        roles={CHARACTER_ROLES_CONSTANT}
        alignments={ALIGNMENTS_CONSTANT}
        genders={GENDERS_CONSTANT_MODAL}
        relationshipTypes={RELATIONSHIP_TYPES_CONSTANT}
        currentRole={currentRole}
        currentAlignment={currentAlignment}
        currentGender={currentGender}
        fieldVisibility={fieldVisibility}
        advancedSectionOpen={advancedSectionOpen}
        openSections={openSections}
        toggleSection={toggleSection}
        powerLinks={characterPowerLinks}
        errors={errors}
        validateField={validateField}
        hasRequiredFieldsEmpty={hasRequiredFieldsEmpty}
        missingFields={missingFields}
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
        sectionVisibility={sectionVisibility}
        onSectionVisibilityToggle={handleSectionVisibilityToggle}
        onAdvancedSectionToggle={handleAdvancedSectionToggle}
        getRelationshipTypeData={getRelationshipTypeData}
        onNavigateToPowerInstance={handleNavigateToPowerInstance}
        onEditPowerLink={handleEditLink}
        onDeletePowerLink={handleDeleteLink}
        isEditLinkModalOpen={isEditLinkModalOpen}
        selectedLinkForEdit={selectedLinkForEdit}
        onCloseEditLinkModal={() => setIsEditLinkModalOpen(false)}
        onSavePowerLink={handleSaveLink}
      />
    </>
  );
}
