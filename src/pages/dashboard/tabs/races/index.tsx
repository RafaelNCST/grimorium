import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

import { useToast } from "@/hooks/use-toast";
import {
  createRace,
  getRacesByBookId,
  moveRacesToGroup,
  moveRaceToGroup,
} from "@/lib/db/races.service";
import {
  createRaceGroup,
  getRaceGroupsByBookId,
  updateRaceGroup,
  deleteRaceGroup,
} from "@/lib/db/race-groups.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { RaceFormSchema } from "@/components/modals/create-race-modal/hooks/use-race-validation";
import type { RaceGroupFormSchema } from "@/components/modals/create-race-group-modal/use-race-group-validation";

import {
  IRace,
  IRaceGroup,
  IRaceTypeStats,
  DomainType,
} from "./types/race-types";
import { SpeciesView } from "./view";
import { RaceCard } from "./components/race-card";

interface PropsSpeciesTab {
  bookId: string;
}

// Map English domain values to Portuguese DomainType
const DOMAIN_MAP: Record<string, DomainType> = {
  'aquatic': 'Aquático',
  'terrestrial': 'Terrestre',
  'aerial': 'Aéreo',
  'underground': 'Subterrâneo',
  'elevated': 'Elevado',
  'dimensional': 'Dimensional',
  'spiritual': 'Espiritual',
  'cosmic': 'Cósmico',
};

export function SpeciesTab({ bookId }: PropsSpeciesTab) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [races, setRaces] = useState<IRace[]>([]);
  const [raceGroups, setRaceGroups] = useState<IRaceGroup[]>([]);
  const [isCreateRaceOpen, setIsCreateRaceOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  // Group-related states
  const [selectedGroupForNewRace, setSelectedGroupForNewRace] = useState<string | null>(null);
  const [isAddRacesModalOpen, setIsAddRacesModalOpen] = useState(false);
  const [selectedGroupForAddRaces, setSelectedGroupForAddRaces] = useState<string | null>(null);
  const [groupInRemoveMode, setGroupInRemoveMode] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<IRaceGroup | null>(null);

  // Drag-and-drop states
  const [activeRace, setActiveRace] = useState<IRace | null>(null);
  const [activeCardWidth, setActiveCardWidth] = useState<number | null>(null);

  // Load races and groups from database
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedRaces, loadedGroups] = await Promise.all([
          getRacesByBookId(bookId),
          getRaceGroupsByBookId(bookId),
        ]);

        setRaces(loadedRaces);

        // Populate groups with their races
        const groupsWithRaces: IRaceGroup[] = loadedGroups.map((group) => ({
          ...group,
          races: loadedRaces.filter((race) => race.groupId === group.id),
        }));

        setRaceGroups(groupsWithRaces);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as raças e grupos.",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [bookId, toast]);

  // Prepare all races for availableRaces prop (race views)
  const availableRaces = useMemo(() => {
    return races.map((race) => ({
      id: race.id,
      name: race.name,
    }));
  }, [races]);

  // Get ungrouped races
  const ungroupedRaces = useMemo(() => {
    return races.filter((race) => !race.groupId);
  }, [races]);

  // Filter logic
  const filteredData = useMemo(() => {
    // When searching, hide groups and show only matching races
    if (searchTerm.trim()) {
      const matchingRaces = races.filter((race) =>
        race.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return {
        groups: [],
        ungroupedRaces: matchingRaces,
      };
    }

    // Filter by domains
    if (selectedDomains.length > 0) {
      const filteredGroups = raceGroups
        .map((group) => ({
          ...group,
          races: group.races.filter((race) =>
            selectedDomains.some((domain) => race.domain.includes(domain as DomainType))
          ),
        }))
        .filter((group) => group.races.length > 0); // Hide groups with no matching races

      const filteredUngrouped = ungroupedRaces.filter((race) =>
        selectedDomains.some((domain) => race.domain.includes(domain as DomainType))
      );

      return {
        groups: filteredGroups,
        ungroupedRaces: filteredUngrouped,
      };
    }

    // No filters - show everything
    return {
      groups: raceGroups,
      ungroupedRaces,
    };
  }, [races, raceGroups, ungroupedRaces, searchTerm, selectedDomains]);

  // Calculate domain stats from all races
  const raceTypeStats = useMemo<IRaceTypeStats>(
    () => ({
      Aquático: races.filter((r) => r.domain.includes("Aquático")).length,
      Terrestre: races.filter((r) => r.domain.includes("Terrestre")).length,
      Aéreo: races.filter((r) => r.domain.includes("Aéreo")).length,
      Subterrâneo: races.filter((r) => r.domain.includes("Subterrâneo")).length,
      Elevado: races.filter((r) => r.domain.includes("Elevado")).length,
      Dimensional: races.filter((r) => r.domain.includes("Dimensional")).length,
      Espiritual: races.filter((r) => r.domain.includes("Espiritual")).length,
      Cósmico: races.filter((r) => r.domain.includes("Cósmico")).length,
    }),
    [races]
  );

  const handleCreateRace = useCallback(
    async (data: RaceFormSchema) => {
      try {
        const convertedDomains = data.domain.map(d => DOMAIN_MAP[d] || d) as DomainType[];

        const newRace: IRace = {
          id: crypto.randomUUID(),
          groupId: selectedGroupForNewRace || undefined,
          name: data.name,
          domain: convertedDomains,
          summary: data.summary,
          image: data.image,
          scientificName: data.scientificName,
          alternativeNames: data.alternativeNames,
          raceViews: data.raceViews,
          culturalNotes: data.culturalNotes,
          generalAppearance: data.generalAppearance,
          lifeExpectancy: data.lifeExpectancy,
          averageHeight: data.averageHeight,
          averageWeight: data.averageWeight,
          specialPhysicalCharacteristics: data.specialPhysicalCharacteristics,
          habits: data.habits,
          reproductiveCycle: data.reproductiveCycle,
          diet: data.diet,
          elementalDiet: data.elementalDiet,
          communication: data.communication,
          moralTendency: data.moralTendency,
          socialOrganization: data.socialOrganization,
          habitat: data.habitat,
          physicalCapacity: data.physicalCapacity,
          specialCharacteristics: data.specialCharacteristics,
          weaknesses: data.weaknesses,
          storyMotivation: data.storyMotivation,
          inspirations: data.inspirations,
          speciesId: "",
        };

        await createRace(bookId, newRace);

        // Update local state
        setRaces([newRace, ...races]);

        // If created in a group, update that group
        if (selectedGroupForNewRace) {
          setRaceGroups((prev) =>
            prev.map((group) =>
              group.id === selectedGroupForNewRace
                ? { ...group, races: [newRace, ...group.races] }
                : group
            )
          );
        }

        toast({
          title: "Raça criada",
          description: `${data.name} foi criada com sucesso.`,
        });

        setIsCreateRaceOpen(false);
        setSelectedGroupForNewRace(null);
      } catch (error) {
        console.error("Error creating race:", error);
        toast({
          title: "Erro ao criar raça",
          description: "Não foi possível criar a raça. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [bookId, races, selectedGroupForNewRace, toast]
  );

  const handleEditGroup = useCallback(
    (groupId: string) => {
      setEditingGroupId(groupId);
      setIsCreateGroupOpen(true);
    },
    []
  );

  const handleSetGroupModalOpen = useCallback((open: boolean) => {
    setIsCreateGroupOpen(open);
    if (!open) {
      setEditingGroupId(null);
    }
  }, []);

  const handleDeleteGroup = useCallback(
    (groupId: string) => {
      const group = raceGroups.find(g => g.id === groupId);
      if (group) {
        setGroupToDelete(group);
      }
    },
    [raceGroups]
  );

  const confirmDeleteGroup = useCallback(
    async () => {
      if (!groupToDelete) return;

      try {
        // Excluir o grupo
        await deleteRaceGroup(groupToDelete.id);

        // Mover todas as raças do grupo para ungrouped (groupId = null)
        if (groupToDelete.races.length > 0) {
          const raceIdsToUngroup = groupToDelete.races.map(r => r.id);
          await moveRacesToGroup(raceIdsToUngroup, null);

          // Atualizar o estado local das raças
          setRaces(
            races.map((race) =>
              raceIdsToUngroup.includes(race.id)
                ? { ...race, groupId: undefined }
                : race
            )
          );
        }

        // Remover o grupo do estado
        setRaceGroups(raceGroups.filter((g) => g.id !== groupToDelete.id));

        toast({
          title: "Grupo excluído",
          description: `O grupo "${groupToDelete.name}" foi excluído com sucesso.`,
        });

        setGroupToDelete(null);
      } catch (error) {
        console.error("Error deleting group:", error);
        toast({
          title: "Erro ao excluir grupo",
          description: "Não foi possível excluir o grupo. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [groupToDelete, raceGroups, races, toast]
  );

  const handleSaveGroup = useCallback(
    async (data: RaceGroupFormSchema) => {
      try {
        if (editingGroupId) {
          // Editando grupo existente
          const updatedGroup: Omit<IRaceGroup, "races"> = {
            id: editingGroupId,
            name: data.name,
            description: data.description,
            orderIndex: raceGroups.find(g => g.id === editingGroupId)?.orderIndex ?? 0,
          };

          await updateRaceGroup(editingGroupId, updatedGroup);

          setRaceGroups(
            raceGroups.map((group) =>
              group.id === editingGroupId
                ? { ...group, name: data.name, description: data.description }
                : group
            )
          );

          toast({
            title: "Grupo atualizado",
            description: `${data.name} foi atualizado com sucesso.`,
          });
        } else {
          // Criando novo grupo
          const newGroup: Omit<IRaceGroup, "races"> = {
            id: crypto.randomUUID(),
            name: data.name,
            description: data.description,
            orderIndex: raceGroups.length,
          };

          await createRaceGroup(bookId, newGroup);

          setRaceGroups([...raceGroups, { ...newGroup, races: [] }]);

          toast({
            title: "Grupo criado",
            description: `${data.name} foi criado com sucesso.`,
          });
        }

        setIsCreateGroupOpen(false);
        setEditingGroupId(null);
      } catch (error) {
        console.error("Error saving group:", error);
        toast({
          title: editingGroupId ? "Erro ao atualizar grupo" : "Erro ao criar grupo",
          description: "Não foi possível salvar o grupo. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [bookId, raceGroups, editingGroupId, toast]
  );

  const handleAddRacesToGroup = useCallback(
    (groupId: string) => {
      setSelectedGroupForAddRaces(groupId);
      setIsAddRacesModalOpen(true);
    },
    []
  );

  const handleConfirmAddRaces = useCallback(
    async (raceIds: string[]) => {
      if (!selectedGroupForAddRaces) return;

      try {
        await moveRacesToGroup(raceIds, selectedGroupForAddRaces);

        // Update local state
        setRaces((prev) =>
          prev.map((race) =>
            raceIds.includes(race.id)
              ? { ...race, groupId: selectedGroupForAddRaces }
              : race
          )
        );

        setRaceGroups((prev) =>
          prev.map((group) =>
            group.id === selectedGroupForAddRaces
              ? {
                  ...group,
                  races: [
                    ...group.races,
                    ...races.filter((r) => raceIds.includes(r.id)),
                  ],
                }
              : group
          )
        );

        toast({
          title: "Raças adicionadas",
          description: `${raceIds.length} ${raceIds.length === 1 ? "raça foi adicionada" : "raças foram adicionadas"} ao grupo.`,
        });

        setIsAddRacesModalOpen(false);
        setSelectedGroupForAddRaces(null);
      } catch (error) {
        console.error("Error adding races to group:", error);
        toast({
          title: "Erro ao adicionar raças",
          description: "Não foi possível adicionar as raças ao grupo.",
          variant: "destructive",
        });
      }
    },
    [selectedGroupForAddRaces, races, toast]
  );

  const handleCreateRaceInGroup = useCallback((groupId: string) => {
    setSelectedGroupForNewRace(groupId);
    setIsCreateRaceOpen(true);
  }, []);

  const handleToggleRemoveMode = useCallback((groupId: string) => {
    setGroupInRemoveMode((prev) => (prev === groupId ? null : groupId));
  }, []);

  const handleRemoveRaceFromGroup = useCallback(
    async (raceId: string) => {
      try {
        await moveRaceToGroup(raceId, null);

        // Update local state
        setRaces((prev) =>
          prev.map((race) =>
            race.id === raceId ? { ...race, groupId: undefined } : race
          )
        );

        setRaceGroups((prev) =>
          prev.map((group) => ({
            ...group,
            races: group.races.filter((r) => r.id !== raceId),
          }))
        );

        toast({
          title: "Raça removida",
          description: "A raça foi removida do grupo.",
        });
      } catch (error) {
        console.error("Error removing race from group:", error);
        toast({
          title: "Erro ao remover raça",
          description: "Não foi possível remover a raça do grupo.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleRaceClick = useCallback(
    (raceId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/race/$raceId",
        params: { dashboardId: bookId, raceId },
      });
    },
    [navigate, bookId]
  );

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleDomainFilterChange = useCallback((domain: string) => {
    setSelectedDomains((prev) => {
      if (prev.includes(domain)) {
        return prev.filter((d) => d !== domain);
      }
      return [...prev, domain];
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedDomains([]);
    setSearchTerm("");
  }, []);

  const handleDropRaceInGroup = useCallback(
    async (raceId: string, sourceGroupId: string | null, targetGroupId: string | null) => {
      try {
        await moveRaceToGroup(raceId, targetGroupId);

        // Update local state
        setRaces((prev) =>
          prev.map((race) =>
            race.id === raceId
              ? { ...race, groupId: targetGroupId || undefined }
              : race
          )
        );

        // Update groups state
        setRaceGroups((prev) => {
          const raceToMove = races.find((r) => r.id === raceId);
          if (!raceToMove) return prev;

          return prev.map((group) => {
            // Remove from source group
            if (group.id === sourceGroupId) {
              return {
                ...group,
                races: group.races.filter((r) => r.id !== raceId),
              };
            }
            // Add to target group
            if (group.id === targetGroupId) {
              return {
                ...group,
                races: [...group.races, { ...raceToMove, groupId: targetGroupId }],
              };
            }
            return group;
          });
        });

        // Show success toast
        const race = races.find((r) => r.id === raceId);
        const targetGroup = raceGroups.find((g) => g.id === targetGroupId);

        if (targetGroupId) {
          toast({
            title: "Raça movida para o grupo",
            description: `${race?.name} foi adicionada ao grupo "${targetGroup?.name}".`,
          });
        } else {
          toast({
            title: "Raça removida do grupo",
            description: `${race?.name} foi removida do grupo.`,
          });
        }
      } catch (error) {
        console.error("Error dropping race in group:", error);
        toast({
          title: "Erro ao mover raça",
          description: "Não foi possível mover a raça. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [races, raceGroups, toast]
  );

  // Available races for "add to group" modal (only ungrouped races)
  const racesAvailableForGroup = useMemo(() => {
    return ungroupedRaces;
  }, [ungroupedRaces]);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const raceData = active.data.current?.race as IRace | undefined;
    if (raceData) {
      setActiveRace(raceData);

      // Capture the width of the element being dragged
      const element = document.querySelector(`[data-race-id="${raceData.id}"]`) as HTMLElement;
      if (element) {
        setActiveCardWidth(element.offsetWidth);
      }
    }
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveRace(null);
      setActiveCardWidth(null);

      if (!over) return;

      // Extract race data from active item
      const raceData = active.data.current?.race as IRace | undefined;
      if (!raceData) return;

      const raceId = raceData.id;
      const sourceGroupId = raceData.groupId || null;

      // Extract target group ID from over item
      const overData = over.data.current;
      const targetGroupId = overData?.type === 'group' ? overData.groupId : null;

      // Don't do anything if dropping in the same group
      if (sourceGroupId === targetGroupId) {
        return;
      }

      try {
        await moveRaceToGroup(raceId, targetGroupId);

        // Update local state
        setRaces((prev) =>
          prev.map((race) =>
            race.id === raceId
              ? { ...race, groupId: targetGroupId || undefined }
              : race
          )
        );

        // Update groups state
        setRaceGroups((prev) => {
          const raceToMove = races.find((r) => r.id === raceId);
          if (!raceToMove) return prev;

          return prev.map((group) => {
            // Remove from source group
            if (group.id === sourceGroupId) {
              return {
                ...group,
                races: group.races.filter((r) => r.id !== raceId),
              };
            }
            // Add to target group
            if (group.id === targetGroupId) {
              return {
                ...group,
                races: [...group.races, { ...raceToMove, groupId: targetGroupId }],
              };
            }
            return group;
          });
        });

        // Show success toast
        const race = races.find((r) => r.id === raceId);
        const targetGroup = raceGroups.find((g) => g.id === targetGroupId);

        if (targetGroupId) {
          toast({
            title: "Raça movida para o grupo",
            description: `${race?.name} foi adicionada ao grupo "${targetGroup?.name}".`,
          });
        } else {
          toast({
            title: "Raça removida do grupo",
            description: `${race?.name} foi removida do grupo.`,
          });
        }
      } catch (error) {
        console.error("Error dropping race:", error);
        toast({
          title: "Erro ao mover raça",
          description: "Não foi possível mover a raça. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [races, raceGroups, toast]
  );

  // Calculate initial values for edit mode
  const editingGroup = editingGroupId ? raceGroups.find(g => g.id === editingGroupId) : null;
  const groupInitialValues = editingGroup ? {
    name: editingGroup.name,
    description: editingGroup.description,
  } : undefined;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SpeciesView
      races={races}
      raceGroups={filteredData.groups}
      ungroupedRaces={filteredData.ungroupedRaces}
      isCreateRaceOpen={isCreateRaceOpen}
      isCreateGroupOpen={isCreateGroupOpen}
      isAddRacesModalOpen={isAddRacesModalOpen}
      groupInitialValues={groupInitialValues}
      editingGroupId={editingGroupId}
      raceTypeStats={raceTypeStats}
      availableRaces={availableRaces}
      racesAvailableForGroup={racesAvailableForGroup}
      selectedGroupForAddRaces={selectedGroupForAddRaces}
      searchTerm={searchTerm}
      selectedDomains={selectedDomains}
      groupInRemoveMode={groupInRemoveMode}
      onSetIsCreateRaceOpen={setIsCreateRaceOpen}
      onSetIsCreateGroupOpen={handleSetGroupModalOpen}
      onCreateRace={handleCreateRace}
      onCreateGroup={handleSaveGroup}
      onEditGroup={handleEditGroup}
      onDeleteGroup={handleDeleteGroup}
      onAddRacesToGroup={handleAddRacesToGroup}
      onConfirmAddRaces={handleConfirmAddRaces}
      onCreateRaceInGroup={handleCreateRaceInGroup}
      onToggleRemoveMode={handleToggleRemoveMode}
      onRemoveRaceFromGroup={handleRemoveRaceFromGroup}
      onDropRaceInGroup={handleDropRaceInGroup}
      onRaceClick={handleRaceClick}
      onSearchTermChange={handleSearchTermChange}
      onDomainFilterChange={handleDomainFilterChange}
      onClearFilters={handleClearFilters}
      onCloseAddRacesModal={() => setIsAddRacesModalOpen(false)}
    />

    <DragOverlay dropAnimation={null}>
      {activeRace ? (
        <div style={{ width: activeCardWidth ? `${activeCardWidth}px` : '320px' }}>
          <RaceCard race={activeRace} isDragDisabled={true} />
        </div>
      ) : null}
    </DragOverlay>

    {/* Confirmation dialog for deleting group */}
    <AlertDialog open={!!groupToDelete} onOpenChange={() => setGroupToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir grupo "{groupToDelete?.name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="block mb-3">
              Esta ação irá excluir permanentemente o grupo.
            </span>
            {groupToDelete && groupToDelete.races.length > 0 ? (
              <span className="block p-3 bg-muted rounded-md border border-border">
                <span className="font-semibold text-foreground block mb-1">
                  ⚠️ Atenção:
                </span>
                {groupToDelete.races.length === 1 ? (
                  <>
                    Existe <strong>1 raça</strong> dentro deste grupo. Ela será automaticamente movida para a lista de raças não agrupadas e continuará disponível no seu projeto.
                  </>
                ) : (
                  <>
                    Existem <strong>{groupToDelete.races.length} raças</strong> dentro deste grupo. Todas elas serão automaticamente movidas para a lista de raças não agrupadas e continuarão disponíveis no seu projeto.
                  </>
                )}
              </span>
            ) : (
              <span className="block text-muted-foreground italic">
                Este grupo está vazio, portanto não há raças para serem movidas.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDeleteGroup}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sim, excluir grupo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </DndContext>
  );
}
