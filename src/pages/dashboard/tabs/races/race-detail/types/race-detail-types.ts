import { IRace } from "../../types/race-types";

export interface IRaceRelationship {
  id: string;
  raceId: string;
  type:
    | "predation"
    | "prey"
    | "parasitism"
    | "commensalism"
    | "mutualism"
    | "competition"
    | "neutralism";
  description?: string; // Optional description (max 200 characters)
}

export interface IFieldVisibility {
  [key: string]: boolean;
}
