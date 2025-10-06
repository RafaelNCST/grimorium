export interface Entity {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export const mockEntities: Entity[] = [];
