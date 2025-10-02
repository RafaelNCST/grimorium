import {
  RELATIONSHIP_TYPES_CONSTANT,
  type IRelationshipType,
} from "../constants/relationship-types-constant";

export const getRelationshipTypeData = (type: string): IRelationshipType =>
  RELATIONSHIP_TYPES_CONSTANT.find((rt) => rt.value === type) ||
  RELATIONSHIP_TYPES_CONSTANT[0];
