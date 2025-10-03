import { IWorldEntity } from "../types/world-types";

export function getParentName(
  parentId: string | undefined,
  entities: IWorldEntity[]
): string {
  if (!parentId) return "";
  const parent = entities.find((e) => e.id === parentId);
  return parent?.name || "";
}
