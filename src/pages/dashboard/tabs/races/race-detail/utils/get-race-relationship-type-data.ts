import { TFunction } from "i18next";

import {
  getRaceRelationshipTypes,
  type RaceRelationshipTypeConfig,
} from "../constants/race-relationship-types";

export const getRaceRelationshipTypeData = (
  type: string,
  t: TFunction
): RaceRelationshipTypeConfig => {
  const relationshipTypes = getRaceRelationshipTypes(t);
  return (
    relationshipTypes.find((rt) => rt.value === type) || relationshipTypes[0]
  );
};
