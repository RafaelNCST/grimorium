import { IOrganization } from "@/types/organization-types";

export function getTitleName(
  titleId: string,
  organization: IOrganization
): string {
  const title = organization.titles.find((t) => t.id === titleId);
  return title?.name || "Membro";
}
