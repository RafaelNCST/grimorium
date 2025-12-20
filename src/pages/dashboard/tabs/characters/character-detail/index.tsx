import { useState, useRef, useCallback, useMemo, useEffect } from "react";

import { useParams, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { type ISectionVisibility } from "@/components/detail-page/visibility-helpers";
import { CHARACTER_ROLES_CONSTANT } from "@/components/modals/create-character-modal/constants/character-roles";
import { GENDERS_CONSTANT as GENDERS_CONSTANT_MODAL } from "@/components/modals/create-character-modal/constants/genders";
import {
  getCharacterById,
  getCharactersByBookId,
  getCharacterRelationships,
  saveCharacterRelationships,
  getCharacterFamily,
  saveCharacterFamily,
} from "@/lib/db/characters.service";
import {
  getPowerLinksWithTitlesByCharacterId,
  updatePowerCharacterLinkLabel,
  deletePowerCharacterLink,
} from "@/lib/db/power-system.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import { getRegionsByBookId } from "@/lib/db/regions.service";
import { CharacterSchema } from "@/lib/validation/character-schema";
import type { IPowerCharacterLink } from "@/pages/dashboard/tabs/power-system/types/power-system-types";
import type { IRace } from "@/pages/dashboard/tabs/races/types/race-types";
import type { IRegion } from "@/pages/dashboard/tabs/world/types/region-types";
import { useCharactersStore } from "@/stores/characters-store";
import { type ICharacter } from "@/types/character-types";

import { UnsavedChangesDialog } from "./components/unsaved-changes-dialog";
import { ALIGNMENTS_CONSTANT } from "./constants/alignments-constant";
import { RELATIONSHIP_TYPES_CONSTANT } from "./constants/relationship-types-constant";
import { getRelationshipTypeData } from "./utils/get-relationship-type-data";
import { CharacterDetailView } from "./view";

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
    createdAt: new Date().toISOString(),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [character, setCharacter] = useState<ICharacter>(emptyCharacter);
  const [editData, setEditData] = useState<ICharacter>({
    ...emptyCharacter,
    relationships: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [newQuality, setNewQuality] = useState("");
  const [_imageFile, _setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedRelationshipCharacter, setSelectedRelationshipCharacter] =
    useState("");
  const [selectedRelationshipType, setSelectedRelationshipType] = useState("");
  const [relationshipIntensity, setRelationshipIntensity] = useState([50]);
  const [isNavigationSidebarOpen, setIsNavigationSidebarOpen] = useState(false);
  const [sectionVisibility, setSectionVisibility] =
    useState<ISectionVisibility>(() => {
      const stored = localStorage.getItem(
        `characterDetailSectionVisibility_${characterId}`
      );
      return stored ? JSON.parse(stored) : {};
    });
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(() => {
    const stored = localStorage.getItem("characterDetailAdvancedSectionOpen");
    return stored ? JSON.parse(stored) : false;
  });
  const [_isLoading, setIsLoading] = useState(true);
  const [allCharacters, setAllCharacters] = useState<ICharacter[]>([]);
  const [regions, setRegions] = useState<IRegion[]>([]);
  const [races, setRaces] = useState<IRace[]>([]);
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
  const [originalSectionVisibility, _setOriginalSectionVisibility] =
    useState<ISectionVisibility>({});

  // Save advanced section state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "characterDetailAdvancedSectionOpen",
      JSON.stringify(advancedSectionOpen)
    );
  }, [advancedSectionOpen]);

  // Save section visibility state to localStorage
  useEffect(() => {
    localStorage.setItem(
      `characterDetailSectionVisibility_${characterId}`,
      JSON.stringify(sectionVisibility)
    );
  }, [sectionVisibility, characterId]);

  // Função de validação de campo individual (onBlur)
  const validateField = useCallback(
    (field: string, value: any) => {
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
    },
    [t]
  );

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
        status: true,
      } as any).parse({
        name: editData.name,
        age: editData.age,
        role: editData.role,
        gender: editData.gender,
        description: editData.description,
        status: editData.status,
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

    // Helper function to compare section visibility
    // Treats undefined and true as equivalent (both = visible)
    const sectionVisibilityChanged = (
      current: ISectionVisibility,
      original: ISectionVisibility
    ): boolean => {
      const allSections = new Set([
        ...Object.keys(current),
        ...Object.keys(original),
      ]);

      for (const section of allSections) {
        const currentValue = current[section] !== false; // undefined or true = visible
        const originalValue = original[section] !== false; // undefined or true = visible
        if (currentValue !== originalValue) return true;
      }

      return false;
    };

    // Check if section visibility has changed
    if (sectionVisibilityChanged(sectionVisibility, originalSectionVisibility))
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
    if (character.status !== editData.status) return true;

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

    // Compare history fields
    if (!arraysEqual(character.birthPlace, editData.birthPlace)) return true;
    if (!arraysEqual(character.nicknames, editData.nicknames)) return true;
    if (character.past !== editData.past) return true;

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
    sectionVisibility,
    originalSectionVisibility,
  ]);

  // Load character from database
  useEffect(() => {
    let isMounted = true;

    const loadCharacter = async () => {
      try {
        // Execute all independent queries in parallel for better performance
        const [
          characterFromDB,
          relationships,
          family,
          allCharsFromBook,
          powerLinks,
          regionsFromDB,
          racesFromDB,
        ] = await Promise.all([
          getCharacterById(characterId),
          getCharacterRelationships(characterId),
          getCharacterFamily(characterId),
          dashboardId
            ? getCharactersByBookId(dashboardId)
            : Promise.resolve([]),
          getPowerLinksWithTitlesByCharacterId(characterId),
          dashboardId ? getRegionsByBookId(dashboardId) : Promise.resolve([]),
          dashboardId ? getRacesByBookId(dashboardId) : Promise.resolve([]),
        ]);

        // Only update state if component is still mounted
        if (!isMounted) return;

        if (characterFromDB) {
          // Set character data with all loaded information
          setCharacter({
            ...characterFromDB,
            relationships,
            family,
          });
          setEditData({
            ...characterFromDB,
            relationships,
            family,
          });
          setImagePreview(characterFromDB.image || "");

          // Set power links
          setCharacterPowerLinks(powerLinks);

          // Set all characters from the same book
          setAllCharacters(allCharsFromBook);

          // Set regions and races from the same book
          setRegions(regionsFromDB);
          setRaces(racesFromDB);
        }
      } catch (error) {
        // Don't log errors or show toasts if component is unmounted
        if (!isMounted) return;

        console.error("Error loading character:", error);
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCharacter();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [characterId, dashboardId]);

  async function loadPowerLinks() {
    try {
      // Optimized: Single query with JOINs instead of N+1 queries
      const linksWithTitles =
        await getPowerLinksWithTitlesByCharacterId(characterId);
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

  const handleSave = useCallback(async () => {
    try {
      // Validar TUDO com Zod
      const _validatedData = CharacterSchema.parse({
        name: editData.name,
        age: editData.age,
        role: editData.role,
        gender: editData.gender,
        description: editData.description,
        image: editData.image,
        alignment: editData.alignment,
        status: editData.status,
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
        // History
        birthPlace: editData.birthPlace,
        nicknames: editData.nicknames,
        past: editData.past,
        // Relations
        family: editData.family,
        relationships: editData.relationships,
      });

      const updatedCharacter = { ...editData };
      setCharacter(updatedCharacter);

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

      setErrors({}); // Limpar erros
      setIsEditing(false);
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
      }
    }
  }, [editData, characterId, updateCharacterInStore, t]);

  const navigateToCharactersTab = useCallback(() => {
    if (!dashboardId) return;
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId },
    });
  }, [navigate, dashboardId]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (!dashboardId) return;
      await deleteCharacterFromStore(dashboardId, characterId);
      navigateToCharactersTab();
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  }, [navigateToCharactersTab, characterId, dashboardId, deleteCharacterFromStore]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      setShowUnsavedChangesDialog(true);
      return;
    }

    // If no changes, cancel immediately
    setEditData({ ...character, relationships: character.relationships || [] });
    setSectionVisibility(originalSectionVisibility);
    setErrors({});
    setIsEditing(false);
  }, [
    character,
    originalSectionVisibility,
    hasChanges,
  ]);

  const handleConfirmCancel = useCallback(() => {
    setEditData({ ...character, relationships: character.relationships || [] });
    setSectionVisibility(originalSectionVisibility);
    setErrors({});
    setIsEditing(false);
    setShowUnsavedChangesDialog(false);
  }, [character, originalSectionVisibility]);

  const _handleAddQuality = useCallback(() => {
    if (newQuality.trim() && !editData.qualities.includes(newQuality.trim())) {
      setEditData((prev) => ({
        ...prev,
        qualities: [...prev.qualities, newQuality.trim()],
      }));
      setNewQuality("");
    }
  }, [newQuality, editData.qualities]);

  const _handleRemoveQuality = useCallback((qualityToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      qualities: prev.qualities.filter((q) => q !== qualityToRemove),
    }));
  }, []);

  const _handleFamilyRelationChange = useCallback(
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

  const _navigateBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleNavigateToCharacter = useCallback(
    (targetCharacterId: string) => {
      if (!dashboardId) return;
      navigate({
        to: "/dashboard/$dashboardId/tabs/character/$characterId/",
        params: { dashboardId, characterId: targetCharacterId },
      });
    },
    [navigate, dashboardId]
  );

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

  const _handleNewQualityChange = useCallback((value: string) => {
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
        setIsEditLinkModalOpen(false);
      } catch (error) {
        console.error("Error updating power link:", error);
      }
    },
    [t]
  );

  const handleDeleteLink = useCallback(
    async (linkId: string) => {
      try {
        await deletePowerCharacterLink(linkId);
        await loadPowerLinks();
        setIsEditLinkModalOpen(false);
      } catch (error) {
        console.error("Error deleting power link:", error);
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
        showDeleteModal={showDeleteModal}
        isNavigationSidebarOpen={isNavigationSidebarOpen}
        newQuality={newQuality}
        imagePreview={imagePreview}
        selectedRelationshipCharacter={selectedRelationshipCharacter}
        selectedRelationshipType={selectedRelationshipType}
        relationshipIntensity={relationshipIntensity}
        fileInputRef={fileInputRef}
        mockCharacters={allCharacters}
        regions={regions}
        races={races}
        roles={CHARACTER_ROLES_CONSTANT}
        alignments={ALIGNMENTS_CONSTANT}
        genders={GENDERS_CONSTANT_MODAL}
        relationshipTypes={RELATIONSHIP_TYPES_CONSTANT}
        currentRole={currentRole}
        currentAlignment={currentAlignment}
        currentGender={currentGender}
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
        onImageFileChange={handleImageFileChange}
        onAgeChange={handleAgeChange}
        onEditDataChange={handleEditDataChange}
        onRelationshipAdd={handleAddRelationship}
        onRelationshipRemove={handleRemoveRelationship}
        onRelationshipIntensityUpdate={handleUpdateRelationshipIntensity}
        onRelationshipCharacterChange={handleRelationshipCharacterChange}
        onRelationshipTypeChange={handleRelationshipTypeChange}
        onRelationshipIntensityChange={handleRelationshipIntensityChange}
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
