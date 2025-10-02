import { Beast } from "@/mocks/local/beast-data";

interface FilterBeastsParams {
  beasts: Beast[];
  searchQuery: string;
  selectedRace: string;
  selectedThreatLevel: string;
  selectedHabit: string;
}

export function filterBeasts({
  beasts,
  searchQuery,
  selectedRace,
  selectedThreatLevel,
  selectedHabit,
}: FilterBeastsParams): Beast[] {
  return beasts.filter((beast) => {
    const matchesSearch =
      beast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      beast.basicDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRace = selectedRace === "all" || beast.race === selectedRace;
    const matchesThreat =
      selectedThreatLevel === "all" ||
      beast.threatLevel.name === selectedThreatLevel;
    const matchesHabit =
      selectedHabit === "all" || beast.habit === selectedHabit;

    return matchesSearch && matchesRace && matchesThreat && matchesHabit;
  });
}
