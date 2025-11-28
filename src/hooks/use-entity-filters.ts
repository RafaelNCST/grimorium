import { useState, useCallback, useMemo } from "react";

interface UseEntityFiltersParams<T> {
  entities: T[];
  searchFields: (keyof T)[];
  filterGroups?: FilterGroup<T>[];
}

interface FilterGroup<T> {
  key: string;
  filterFn: (entity: T, selectedValues: string[]) => boolean;
}

interface UseEntityFiltersReturn<T> {
  filteredEntities: T[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilters: Record<string, string[]>;
  toggleFilter: (groupKey: string, value: string) => void;
  clearFilters: () => void;
  clearFilterGroup: (groupKey: string) => void;
  hasActiveFilters: boolean;
}

export function useEntityFilters<T extends Record<string, any>>({
  entities,
  searchFields,
  filterGroups = [],
}: UseEntityFiltersParams<T>): UseEntityFiltersReturn<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >(() => {
    const initial: Record<string, string[]> = {};
    filterGroups.forEach((group) => {
      initial[group.key] = [];
    });
    return initial;
  });

  // Toggle filter value
  const toggleFilter = useCallback((groupKey: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[groupKey] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [groupKey]: currentValues.filter((v) => v !== value),
        };
      }
      return {
        ...prev,
        [groupKey]: [...currentValues, value],
      };
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const resetFilters: Record<string, string[]> = {};
    filterGroups.forEach((group) => {
      resetFilters[group.key] = [];
    });
    setSelectedFilters(resetFilters);
  }, [filterGroups]);

  // Clear specific filter group
  const clearFilterGroup = useCallback((groupKey: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [groupKey]: [],
    }));
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(
    () => Object.values(selectedFilters).some((values) => values.length > 0),
    [selectedFilters]
  );

  // Filter entities
  const filteredEntities = useMemo(
    () =>
      entities.filter((entity) => {
        // Search filter (OR between fields)
        if (searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = searchFields.some((field) => {
            const value = entity[field];
            if (value == null) return false;
            return String(value).toLowerCase().includes(searchLower);
          });
          if (!matchesSearch) return false;
        }

        // Filter groups (AND between groups, OR within group)
        for (const group of filterGroups) {
          const selectedValues = selectedFilters[group.key] || [];
          if (selectedValues.length > 0) {
            const matchesGroup = group.filterFn(entity, selectedValues);
            if (!matchesGroup) return false;
          }
        }

        return true;
      }),
    [entities, searchTerm, searchFields, filterGroups, selectedFilters]
  );

  return {
    filteredEntities,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    clearFilters,
    clearFilterGroup,
    hasActiveFilters,
  };
}
