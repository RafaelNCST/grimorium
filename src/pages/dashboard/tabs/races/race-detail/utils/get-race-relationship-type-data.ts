import {
  RACE_RELATIONSHIP_TYPES,
  type RaceRelationshipTypeConfig,
} from "../constants/race-relationship-types";

export const getRaceRelationshipTypeData = (
  type: string
): RaceRelationshipTypeConfig =>
  RACE_RELATIONSHIP_TYPES.find((rt) => rt.value === type) ||
  RACE_RELATIONSHIP_TYPES[0];
