import { IWorldEntity, WorldEntityType } from "../types/world-types";

export function filterEntities(
  entities: IWorldEntity[],
  searchTerm: string,
  typeFilter?: WorldEntityType
): IWorldEntity[] {
  let filteredEntities = entities;

  if (typeFilter) {
    filteredEntities = filteredEntities.filter((e) => e.type === typeFilter);
  }

  if (searchTerm) {
    filteredEntities = filteredEntities.filter((entity) => {
      const matchesSearch =
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }

  return filteredEntities;
}
