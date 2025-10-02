import { IOrganization } from "@/types/organization-types";

interface TotalByAlignment {
  bem: number;
  neutro: number;
  caotico: number;
}

export function calculateTotalByAlignment(
  organizations: IOrganization[]
): TotalByAlignment {
  return {
    bem: organizations.filter((o) => o.alignment === "Bem").length,
    neutro: organizations.filter((o) => o.alignment === "Neutro").length,
    caotico: organizations.filter((o) => o.alignment === "Caótico").length,
  };
}
