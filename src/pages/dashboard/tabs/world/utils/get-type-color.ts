import { TYPE_COLORS_CONSTANT } from "../constants/type-colors-constant";
import { WorldEntityType } from "../types/world-types";

export function getTypeColor(type: WorldEntityType): string {
  return TYPE_COLORS_CONSTANT[type];
}
