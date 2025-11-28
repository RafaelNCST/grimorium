import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import type { RaceFormSchema } from "@/components/modals/create-race-modal/hooks/use-race-validation";
import { useEntityFilters } from "@/hooks/use-entity-filters";
import { createRace, getRacesByBookId } from "@/lib/db/races.service";
import { calculateEntityStats } from "@/utils/calculate-entity-stats";

import { createDomainFilterRows } from "./helpers/domain-filter-config";
import { IRace, DomainType } from "./types/race-types";
import { SpeciesView } from "./view";

interface PropsSpeciesTab {
  bookId: string;
}

// Map English domain values to Portuguese DomainType
const DOMAIN_MAP: Record<string, DomainType> = {
  aquatic: "Aquático",
  terrestrial: "Terrestre",
  aerial: "Aéreo",
  underground: "Subterrâneo",
  elevated: "Elevado",
  dimensional: "Dimensional",
  spiritual: "Espiritual",
  cosmic: "Cósmico",
};

export function SpeciesTab({ bookId }: PropsSpeciesTab) {
  const navigate = useNavigate();

  const [races, setRaces] = useState<IRace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateRaceOpen, setIsCreateRaceOpen] = useState(false);

  // Load races from database
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const loadedRaces = await getRacesByBookId(bookId);
        setRaces(loadedRaces);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [bookId]);

  // Prepare all races for availableRaces prop (race views)
  const availableRaces = useMemo(
    () =>
      races.map((race) => ({
        id: race.id,
        name: race.name,
      })),
    [races]
  );

  // Use entity filters hook
  const {
    filteredEntities: filteredRaces,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    clearFilters: clearAllFilters,
  } = useEntityFilters({
    entities: races,
    searchFields: ["name"],
    filterGroups: [
      {
        key: "domain",
        filterFn: (race, selectedDomains) =>
          selectedDomains.some((domain) =>
            race.domain.includes(domain as DomainType)
          ),
      },
    ],
  });

  const selectedDomains = selectedFilters.domain || [];

  // Calculate domain stats from all races
  const domainStats = useMemo(
    () =>
      calculateEntityStats(races, "domain", [
        "Aquático",
        "Terrestre",
        "Aéreo",
        "Subterrâneo",
        "Elevado",
        "Dimensional",
        "Espiritual",
        "Cósmico",
      ]),
    [races]
  );

  const handleCreateRace = useCallback(
    async (data: RaceFormSchema) => {
      try {
        const convertedDomains = data.domain.map(
          (d) => DOMAIN_MAP[d] || d
        ) as DomainType[];

        const newRace: IRace = {
          id: crypto.randomUUID(),
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
          otherReproductiveCycleDescription:
            data.otherReproductiveCycleDescription,
          diet: data.diet,
          elementalDiet: data.elementalDiet,
          communication: data.communication,
          otherCommunication: data.otherCommunication,
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

        setIsCreateRaceOpen(false);
      } catch (error) {
        console.error("Error creating race:", error);
      }
    },
    [bookId, races]
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

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchTerm(query);
    },
    [setSearchTerm]
  );

  const handleDomainToggle = useCallback(
    (domain: DomainType) => {
      toggleFilter("domain", domain);
    },
    [toggleFilter]
  );

  const handleClearFilters = useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

  return (
    <SpeciesView
      bookId={bookId}
      races={filteredRaces}
      allRaces={races}
      isLoading={isLoading}
      isCreateRaceOpen={isCreateRaceOpen}
      domainStats={domainStats}
      availableRaces={availableRaces}
      searchQuery={searchTerm}
      selectedDomains={selectedDomains}
      onSetIsCreateRaceOpen={setIsCreateRaceOpen}
      onCreateRace={handleCreateRace}
      onRaceClick={handleRaceClick}
      onSearchChange={handleSearchChange}
      onDomainToggle={handleDomainToggle}
      onClearFilters={handleClearFilters}
    />
  );
}
