import { IRace } from "../../types/race-types";

export interface IRaceRelationship {
  id: string;
  raceId: string;
  type: string;
}

export interface IRaceVersion {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isMain: boolean;
  raceData: IRace;
}

export interface IFieldVisibility {
  [key: string]: boolean;
}
