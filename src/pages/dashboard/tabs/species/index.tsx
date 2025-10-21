import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useToast } from "@/hooks/use-toast";
import { createRace, getRacesByBookId } from "@/lib/db/races.service";

import type { RaceFormSchema } from "@/components/modals/create-race-modal/hooks/use-race-validation";

import {
  IRace,
  IRaceTypeStats,
  DomainType,
} from "./types/species-types";
import { SpeciesView } from "./view";

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
  const [isCreateRaceOpen, setIsCreateRaceOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  // Load races from database
  useEffect(() => {
    const loadRaces = async () => {
      try {
        const loadedRaces = await getRacesByBookId(bookId);
        setRaces(loadedRaces);
      } catch (error) {
        console.error("Error loading races:", error);
        toast({
          title: "Erro ao carregar raças",
          description: "Não foi possível carregar as raças do banco de dados.",
          variant: "destructive",
        });
      }
    };

    loadRaces();
  }, [bookId, toast]);

  // Prepare all races for availableRaces prop (race views)
  const availableRaces = useMemo(() => {
    return races.map((race) => ({
      id: race.id,
      name: race.name,
    }));
  }, [races]);

  // Filter races based on search term and selected domains
  const filteredRaces = useMemo(() => {
    let filtered = races;

    // Filter by search term (name only)
    if (searchTerm.trim()) {
      filtered = filtered.filter((race) =>
        race.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected domains
    if (selectedDomains.length > 0) {
      filtered = filtered.filter((race) =>
        selectedDomains.some((domain) => race.domain.includes(domain as DomainType))
      );
    }

    return filtered;
  }, [races, searchTerm, selectedDomains]);

  // Calculate domain stats from races
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
        // Convert domain values from English to Portuguese
        const convertedDomains = data.domain.map(d => DOMAIN_MAP[d] || d) as DomainType[];

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
          speciesId: "", // Legacy field, not used anymore
        };

        // Save to database
        await createRace(bookId, newRace);

        // Update local state
        setRaces([newRace, ...races]);

        toast({
          title: "Raça criada",
          description: `${data.name} foi criada com sucesso.`,
        });

        setIsCreateRaceOpen(false);
      } catch (error) {
        console.error("Error creating race:", error);
        toast({
          title: "Erro ao criar raça",
          description: "Não foi possível criar a raça. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [bookId, races, toast]
  );

  const handleRaceClick = useCallback(
    (raceId: string) => {
      // For now, just log - navigation will be implemented in future steps
      console.log("Race clicked:", raceId);
    },
    []
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

  const handleSetIsCreateRaceOpen = useCallback((open: boolean) => {
    setIsCreateRaceOpen(open);
  }, []);

  return (
    <SpeciesView
      races={races}
      filteredRaces={filteredRaces}
      isCreateRaceOpen={isCreateRaceOpen}
      raceTypeStats={raceTypeStats}
      availableRaces={availableRaces}
      searchTerm={searchTerm}
      selectedDomains={selectedDomains}
      onSetIsCreateRaceOpen={handleSetIsCreateRaceOpen}
      onCreateRace={handleCreateRace}
      onRaceClick={handleRaceClick}
      onSearchTermChange={handleSearchTermChange}
      onDomainFilterChange={handleDomainFilterChange}
      onClearFilters={handleClearFilters}
    />
  );
}
