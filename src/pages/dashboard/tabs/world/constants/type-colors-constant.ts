import { WorldEntityType } from "../types/world-types";

export const TYPE_COLORS_CONSTANT: Record<WorldEntityType, string> = {
  World: "bg-primary text-primary-foreground",
  Continent: "bg-accent text-accent-foreground",
  Location: "bg-secondary text-secondary-foreground",
};
